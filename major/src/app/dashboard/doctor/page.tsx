"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import AppointmentList from "@/components/dashboard/AppointmentList";
import DoctorAnalytics from "@/components/dashboard/DoctorAnalytics";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function DoctorDashboard() {
  const { user } = useSelector((state: RootState) => state.auth); // Access user info from Redux
  const [activeTab, setActiveTab] = useState("overview");

  // Ensure that the user is authenticated and has a doctor role
  if (!user || user.role !== "doctor") {
    return <div>Access Denied</div>; // Show access denied if the user is not a doctor
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <DoctorAnalytics /> {/* Display doctor analytics */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button>View Schedule</Button>
              <Button>Manage Availability</Button>
              <Button>Send Patient Message</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Your Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Patient list coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
