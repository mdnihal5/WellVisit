import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFromAPI } from "@/lib/utils"; // Utility for API requests

// User interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: "doctor" | "patient";
  availability?: string; // Only for doctors
  speciality?: string; // Only for doctors
}

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("user") : false,
};

// Async thunk: Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userCredentials: { email: string; password: string }) => {
    const data = await fetchFromAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(userCredentials),
    });
    return data.user; // Assuming the API returns user data
  }
);

// Async thunk: Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userDetails: { name: string; email: string; password: string; role: string; availability?: string; speciality?: string }) => {
    const data = await fetchFromAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userDetails),
    });
    return data.user; // Assuming the API returns the registered user data
  }
);

// Async thunk: Logout user
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await fetchFromAPI("/auth/logout", { method: "GET" });
  localStorage.removeItem("user"); // Remove user data from localStorage
  return null; // Reset user state
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to update the profile (e.g., after editing user data)
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
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      });
  },
});

// Export actions and reducer
export const { updateProfile } = authSlice.actions;
export default authSlice.reducer;
