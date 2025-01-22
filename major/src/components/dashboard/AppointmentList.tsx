"use client";

import type { RootState } from "@/lib/redux/store";
import { Card, CardContent } from "@/components/ui/Card";
import { useSelector } from "react-redux";

interface AppointmentListProps {
  limit?: number;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ limit }) => {
  const appointments = useSelector(
    (state: RootState) => state.appointments.list,
  );
  const displayedAppointments = limit
    ? appointments.slice(0, limit)
    : appointments;

  return (
    <div className="space-y-4">
      {displayedAppointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="p-4">
            <h3 className="font-bold">{appointment.doctorName}</h3>
            <h3 className="font-bold">{appointment.patientName}</h3>
            <p>{new Date(appointment.appointmentDate).toLocaleString()}</p>
            <p>Status: {appointment.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentList;
