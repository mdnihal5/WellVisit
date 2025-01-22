import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  doctorName: string;
  patientName: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface AppointmentState {
  list: Appointment[];
}

const initialState: AppointmentState = {
  list: [],
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.list = action.payload;
    },
    bookAppointment: (state, action: PayloadAction<Appointment>) => {
      state.list.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.list.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    cancelAppointment: (state, action: PayloadAction<string>) => {
      const index = state.list.findIndex((a) => a.id === action.payload);
      if (index !== -1) {
        state.list[index].status = "cancelled";
      }
    },
  },
});

export const {
  setAppointments,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
