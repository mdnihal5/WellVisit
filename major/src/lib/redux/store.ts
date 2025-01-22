import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import appointmentReducer from "./features/appointmentSlice";
import doctorReducer from "./features/doctorSlice"; // Import doctor reducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentReducer,
    doctors: doctorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
