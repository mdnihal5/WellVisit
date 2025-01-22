import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFromAPI } from "@/lib/utils"; // Import the utility for API requests

interface Appointment {
  id?: string;
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
  }
);

// Book an appointment
export const bookAppointment = createAsyncThunk(
  "appointments/bookAppointment",
  async (appointment: Appointment) => {
    const data = await fetchFromAPI("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
    return data; // Ensure the booked appointment contains all fields like doctorId, patientId, etc.
  }
);

// Update an appointment
export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async (appointment: Appointment) => {
    const data = await fetchFromAPI(`/appointments/${appointment.id}`, {
      method: "PUT",
      body: JSON.stringify(appointment),
    });
    return data; // Ensure the updated appointment contains all fields like doctorId, patientId, etc.
  }
);

// Cancel an appointment
export const cancelAppointment = createAsyncThunk(
  "appointments/cancelAppointment",
  async (appointmentId: string) => {
    const data = await fetchFromAPI(`/appointments/${appointmentId}`, {
      method: "DELETE",
    });
    return appointmentId; // Return the appointment ID that was canceled
  }
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
        state.list.push(action.payload);
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.list.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const index = state.list.findIndex((a) => a.id === action.payload);
        if (index !== -1) {
          state.list[index].status = "cancelled";
        }
      });
  },
});

export default appointmentSlice.reducer;
