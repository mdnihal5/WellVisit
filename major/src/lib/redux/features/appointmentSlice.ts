import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFromAPI } from "@/lib/utils";

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
  fetchLoading: boolean;
  bookLoading: boolean;
  updateLoading: boolean;
  cancelLoading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  list: [],
  fetchLoading: false,
  bookLoading: false,
  updateLoading: false,
  cancelLoading: false,
  error: null,
};

// Fetch all appointments
export const fetchAppointments = createAsyncThunk<Appointment[]>(
  "appointments/fetchAppointments",
  async () => {
    const data = await fetchFromAPI("/appointments");
<<<<<<< HEAD
    return data; // Ensure the returned data contains all necessary fields like doctorId, patientId, etc.
  },
=======
    return data;
  }
>>>>>>> 248fdc7f92c80e0efeab52e81ad2ff439973e7ae
);

// Book an appointment
export const bookAppointment = createAsyncThunk<Appointment, Partial<Appointment>>(
  "appointments/bookAppointment",
  async (appointment) => {
    const data = await fetchFromAPI("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
<<<<<<< HEAD
    return data.appointment; // Ensure the booked appointment contains all fields like doctorId, patientId, etc.
  },
=======
    return data;
  }
>>>>>>> 248fdc7f92c80e0efeab52e81ad2ff439973e7ae
);

// Update an appointment
export const updateAppointment = createAsyncThunk<Appointment, Appointment>(
  "appointments/updateAppointment",
<<<<<<< HEAD
  async (appointment: Appointment) => {
=======
  async (appointment) => {
>>>>>>> 248fdc7f92c80e0efeab52e81ad2ff439973e7ae
    const data = await fetchFromAPI(`/appointments/${appointment._id}`, {
      method: "PUT",
      body: JSON.stringify(appointment),
    });
<<<<<<< HEAD
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
=======
    return data;
  }
);

// Cancel an appointment
export const cancelAppointment = createAsyncThunk<string, string>(
  "appointments/cancelAppointment",
  async (appointmentId) => {
    await fetchFromAPI(`/appointments/${appointmentId}`, {
      method: "DELETE",
    });
    return appointmentId;
  }
>>>>>>> 248fdc7f92c80e0efeab52e81ad2ff439973e7ae
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.error.message || "Error fetching appointments";
      })

      // Book Appointment
      .addCase(bookAppointment.pending, (state) => {
        state.bookLoading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
<<<<<<< HEAD
        state.list = [...state.list, action.payload];
=======
        state.bookLoading = false;
        state.list.push(action.payload);
>>>>>>> 248fdc7f92c80e0efeab52e81ad2ff439973e7ae
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookLoading = false;
        state.error = action.error.message || "Error booking appointment";
      })

      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
<<<<<<< HEAD
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
=======
        state.updateLoading = false;
        const index = state.list.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message || "Error updating appointment";
      })

      // Cancel Appointment (with Optimistic Updates)
      .addCase(cancelAppointment.pending, (state, action) => {
        state.cancelLoading = true;
        state.error = null;
        // Optimistically remove the appointment
        state.list = state.list.filter((a) => a._id !== action.meta.arg);
      })
      .addCase(cancelAppointment.fulfilled, (state) => {
        state.cancelLoading = false;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.cancelLoading = false;
        state.error = action.error.message || "Error canceling appointment";
>>>>>>> 248fdc7f92c80e0efeab52e81ad2ff439973e7ae
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
