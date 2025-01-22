"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import AppointmentList from "@/components/dashboard/AppointmentList";
import AppointmentForm from "@/components/AppointmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function PatientDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Ensure that the user is authenticated and has a patient role
  if (!user || user.role !== "patient") {
    return <div>Access Denied</div>; // Show access denied if the user is not a patient
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Patient Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Book an Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentForm /> {/* Appointment form to book an appointment */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentList /> {/* List of the patient's appointments */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
