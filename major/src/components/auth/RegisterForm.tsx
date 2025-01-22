"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "@/lib/redux/features/authSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
          credentials: "include", // Ensure cookies are sent with the request
        },
      );

      const data = await response.json();
      if (response.ok) {
        dispatch(register(data.user));
      } else {
        setError(data.message || "Registration failed. Please try again.");
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
      <Button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;
