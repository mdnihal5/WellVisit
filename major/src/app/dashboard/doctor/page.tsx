"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import AppointmentList from "@/components/dashboard/AppointmentList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function DoctorDashboard() {
  const { user } = useSelector((state: RootState) => state.auth); // Access user info from Redux

  // Ensure that the user is authenticated and has a doctor role
  if (!user || user.role !== "doctor") {
    return <div>Access Denied</div>; // Show access denied if the user is not a doctor
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentList /> {/* Display list of upcoming appointments */}
        </CardContent>
      </Card>
    </div>
  );
}
