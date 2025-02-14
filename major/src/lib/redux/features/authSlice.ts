import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFromAPI } from "@/lib/utils";

// User interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: "doctor" | "patient";
  availability?: string;
  speciality?: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("user") : false,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userCredentials: { email: string; password: string }) => {
    const data = await fetchFromAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(userCredentials),
    });
    return data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userDetails: {
    name: string;
    email: string;
    password: string;
    role: string;
    availability?: string;
    speciality?: string;
  }) => {
    const data = await fetchFromAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userDetails),
    });
    return data;
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await fetchFromAPI("/auth/logout", { method: "GET" });
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to update the profile (if needed)
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
  },
});

export const { updateProfile } = authSlice.actions;
export default authSlice.reducer;

