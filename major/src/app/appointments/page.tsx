"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import AppointmentList from "@/components/dashboard/AppointmentList";
import AppointmentForm from "@/components/AppointmentForm";

export default function Appointments() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <div>Please log in to view appointments</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Appointments</h1>
      {user.role === "patient" && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
          <AppointmentForm />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
      <AppointmentList />
    </div>
  );
}
