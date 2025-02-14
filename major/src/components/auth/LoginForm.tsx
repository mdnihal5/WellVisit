"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { loginUser } from "@/lib/redux/features/authSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Dispatch the async thunk action
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.rejected.match(resultAction)) {
        // Handle error if login failed
        setError(resultAction.error.message || "Login failed. Please try again.");
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
      <Button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;

