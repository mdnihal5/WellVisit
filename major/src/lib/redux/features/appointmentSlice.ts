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
export const fetchAppointments = createAsyncThunk<Appointment[]>("appointments/fetchAppointments", async () => {
    const data = await fetchFromAPI("/appointments");
    return data; // Ensure the returned data contains all necessary fields like doctorId, patientId, etc.
});

// Book an appointment
export const bookAppointment = createAsyncThunk<Appointment, Partial<Appointment>>("appointments/bookAppointment", async (appointment) => {
    const data = await fetchFromAPI("/appointments", {
        method: "POST",
        body: JSON.stringify(appointment),
    });
    return data.appointment; // Ensure the booked appointment contains all fields like doctorId, patientId, etc.
});
export const updateAppointment = createAsyncThunk<Appointment, Partial<Appointment>>("appointments/updateAppointment", async (appointment) => {
    const data = await fetchFromAPI(`/appointments/${appointment._id}`, {
        method: "PUT",
        body: JSON.stringify(appointment),
    });
    return data; // Ensure the updated appointment contains all fields like doctorId, patientId, etc.
});

// Cancel an appointment (status change)
export const cancelAppointment = createAsyncThunk("appointments/cancelAppointment", async (_id: string) => {
    await fetchFromAPI(`/appointments/${_id}`, {
        method: "DELETE",
    });
    return _id; // Return the appointment ID that was canceled
});

// Delete an appointment permanently
export const deleteAppointment = createAsyncThunk("appointments/deleteAppointment", async (_id: string) => {
    await fetchFromAPI(`/appointments/${_id}`, {
        method: "DELETE",
    });
    return _id; // Return the appointment ID that was deleted permanently
});

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
                state.list = [...state.list, action.payload];
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
                state.list = state.list.map((a) => (a._id === action.payload._id ? action.payload : a));
            })
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.list = state.list.map((a) => (a._id === action.payload ? { ...a, status: "cancelled" } : a));
            })
            .addCase(deleteAppointment.fulfilled, (state, action) => {
                state.list = state.list.filter((a) => a._id !== action.payload); // Delete the appointment permanently from the list
            });
    },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
