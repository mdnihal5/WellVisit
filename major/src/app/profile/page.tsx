"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { updateProfile } from "@/lib/redux/features/authSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:4000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(updateProfile(data.user));
      } else {
        console.error("Profile update failed:", data.message);
      }
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
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
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
}
