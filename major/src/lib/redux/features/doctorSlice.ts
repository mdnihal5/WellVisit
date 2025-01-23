import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFromAPI } from "@/lib/utils";


export interface Doctor {
  _id: string;
  name: string;
  email?: string;
  availability?: string;
  speciality?: string; 
}

interface DoctorState {
  list: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  list: [],
  loading: false,
  error: null,
};


export const fetchDoctors = createAsyncThunk("doctors/fetchDoctors", async () => {
  const data = await fetchFromAPI("/doctors");
  return data; 
});

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Assuming API returns the list with `speciality`
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching doctors";
      });
  },
});

export default doctorSlice.reducer;
