import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Doctor {
  id: string;
  name: string;
}

interface DoctorState {
  list: Doctor[];
}

const initialState: DoctorState = {
  list: [],
};

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctors: (state, action: PayloadAction<Doctor[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setDoctors } = doctorSlice.actions;
export default doctorSlice.reducer;
