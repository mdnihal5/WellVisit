import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFromAPI } from "@/lib/utils"; // Import the utility for API requests

interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  doctorName: string;
  patientName: string;
  status: string;
}

interface AppointmentState {
  list: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  list: [],
  loading: false,
  error: null,
};

// Fetch all appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async () => {
    const data = await fetchFromAPI("/appointments");
    return data; // Ensure the returned data contains all necessary fields like doctorId, patientId, etc.
  },
);

// Book an appointment
export const bookAppointment = createAsyncThunk(
  "appointments/bookAppointment",
  async (appointment: Appointment) => {
    const data = await fetchFromAPI("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
    return data.appointment; // Ensure the booked appointment contains all fields like doctorId, patientId, etc.
  },
);

// Update an appointment
export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async (appointment: Appointment) => {
    const data = await fetchFromAPI(`/appointments/${appointment._id}`, {
      method: "PUT",
      body: JSON.stringify(appointment),
    });
    return data; // Ensure the updated appointment contains all fields like doctorId, patientId, etc.
  },
);

// Cancel an appointment (status change)
export const cancelAppointment = createAsyncThunk(
  "appointments/cancelAppointment",
  async (_id: string) => {
    const data = await fetchFromAPI(`/appointments/${_id}`, {
      method: "DELETE",
    });
    return _id; // Return the appointment ID that was canceled
  },
);

// Delete an appointment permanently
export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (_id: string) => {
    await fetchFromAPI(`/appointments/${_id}`, {
      method: "DELETE",
    });
    return _id; // Return the appointment ID that was deleted permanently
  },
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching appointments";
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.list = [...state.list, action.payload];
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.list = state.list.map((a) =>
          a._id === action.payload._id ? action.payload : a,
        );
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.list = state.list.map((a) =>
          a._id === action.payload ? { ...a, status: "cancelled" } : a,
        );
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a._id !== action.payload); // Delete the appointment permanently from the list
      });
  },
});

export default appointmentSlice.reducer;
