"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import AppointmentList from "@/components/dashboard/AppointmentList";
import AppointmentForm from "@/components/AppointmentForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function PatientDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");

  if (!user || user.role !== "patient") {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Patient Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Book Appointment</Button>
                <Button className="w-full">View Medical Records</Button>
                <Button className="w-full">Contact Doctor</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <AppointmentList limit={3} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="appointments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <AppointmentForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <AppointmentList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
