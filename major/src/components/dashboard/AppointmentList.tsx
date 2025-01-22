"use client";

import { AppDispatch, type RootState } from "@/lib/redux/store";
import { Card, CardContent } from "@/components/ui/Card";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAppointments } from "@/lib/redux/features/appointmentSlice"; // Import the fetchAppointments action

interface AppointmentListProps {
  limit?: number;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ limit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const appointments = useSelector((state: RootState) => state.appointments.list);
  const displayedAppointments = limit ? appointments.slice(0, limit) : appointments;

  // Fetch appointments when the component mounts
  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Function to format date properly
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) // Check if the date is valid
      ? "Invalid Date"
      : date.toLocaleString(); // Return formatted date or "Invalid Date" if invalid
  };

  return (
    <div className="space-y-4">
      {displayedAppointments.map((appointment,index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <h3 className="font-bold">Doctor: {appointment.doctorName}</h3>
            <p>Doctor ID: {appointment.doctorId}</p>
            <h3 className="font-bold">Patient: {appointment.patientName}</h3>
            <p>Patient ID: {appointment.patientId}</p>
            <p>Appointment Date: {formatDate(appointment.appointmentDate)}</p>
            <p>Status: {appointment.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentList;
