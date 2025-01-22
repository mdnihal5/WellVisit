import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFromAPI } from "@/lib/utils"; // Utility for API requests

interface User {
  id: string;
  name: string;
  email: string;
  role: "doctor" | "patient";
  availability?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userCredentials: { email: string; password: string }) => {
    const data = await fetchFromAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(userCredentials),
    });
    return data.user;
  }
);

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userDetails: { name: string; email: string; password: string; role: string; availability?: string }) => {
    const data = await fetchFromAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userDetails),
    });
    return data.user;
  }
);

// Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await fetchFromAPI("/auth/logout", { method: "GET" });
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { updateProfile } = authSlice.actions;
export default authSlice.reducer;
