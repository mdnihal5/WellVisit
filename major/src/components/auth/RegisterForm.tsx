"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "@/lib/redux/features/authSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AppDispatch } from "@/lib/redux/store";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [availability, setAvailability] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const userDetails = { name, email, password, role, availability, speciality };

    try {
      const action = await dispatch(registerUser(userDetails));

      if (registerUser.fulfilled.match(action)) {
        // Success logic here (e.g., redirect or display a success message)
      } else {
        setError(action.error.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
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
        <>
          <Input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="Availability (e.g., 9am-5pm)"
            required
          />
          <Input
            type="text"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            placeholder="Speciality (e.g., Cardiologist)"
            required
          />
        </>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;

