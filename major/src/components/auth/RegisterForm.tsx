"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "@/lib/redux/features/authSlice"; // Import the registerUser async thunk
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AppDispatch } from "@/lib/redux/store"; // Add this import for correct dispatch typing

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [availability, setAvailability] = useState(""); // Added state for availability
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>(); // Use the correct dispatch type

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Collect user details
    const userDetails = { name, email, password, role, availability };

    try {
      // Dispatch the registerUser async thunk
      const action = await dispatch(registerUser(userDetails));

      // Check if the registration was successful
      if (registerUser.fulfilled.match(action)) {
        // Registration successful, proceed with success (e.g., navigate or show success message)
      } else {
        setError(action.error.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <div className="flex gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="patient"
            checked={role === "patient"}
            onChange={() => setRole("patient")}
          />
          <span>Patient</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="doctor"
            checked={role === "doctor"}
            onChange={() => setRole("doctor")}
          />
          <span>Doctor</span>
        </label>
      </div>

      {role === "doctor" && (
        <Input
          type="text"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          placeholder="Availability (e.g., 9am-5pm)"
          required
        />
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;
