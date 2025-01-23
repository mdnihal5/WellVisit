"use client";
import { AppDispatch, RootState } from "@/lib/redux/store"; // Import RootState and AppDispatch
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchAppointments,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
} from "@/lib/redux/features/appointmentSlice";
import { Calendar } from "@/components/ui/calendar";

// Define types for Appointment and Status

interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  doctorName: string;
  patientName: string;
  status: string;
}

interface AppointmentListProps {
  limit?: number;
  userRole: "doctor" | "patient";
  userId: string;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  limit,
  userRole,
  userId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const appointments = useSelector(
    (state: RootState) => state.appointments.list,
  );

  // Local state for managing date and dialog
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Filter appointments to display based on the limit prop
  const displayedAppointments = limit
    ? appointments.slice(0, limit)
    : appointments;

  // Fetch appointments on component mount
  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Format the date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  // Handle status update for doctors
  const handleStatusUpdate = async (
    appointmentId: string,
    newStatus: string,
  ) => {
    const appointment = appointments.find((a) => a._id === appointmentId);
    if (!appointment) return;

    if (userRole === "doctor" && appointment.status !== "completed") {
      await dispatch(
        updateAppointment({
          ...appointment, // Make sure appointment is properly assigned
          status: newStatus,
        }),
      );
    }
  };

  // Handle date update for patients
  const handleDateUpdate = async (appointmentId: string, newDate: Date) => {
    const appointment = appointments.find((a) => a._id === appointmentId);
    if (!appointment || appointment.status === "completed") return;

    if (userRole === "patient") {
      await dispatch(
        updateAppointment({
          ...appointment, // Ensure appointment is passed correctly
          appointmentDate: newDate.toISOString(),
        }),
      );
      setIsUpdateDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  // Handle cancellation of an appointment
  const handleCancel = async (appointmentId: string) => {
    const appointment = appointments.find((a) => a._id === appointmentId);
    if (!appointment || appointment.status === "completed") return;

    await dispatch(cancelAppointment(appointmentId)); // Ensure the correct ID is passed
  };

  // Handle deletion of an appointment
  const handleDelete = async (appointmentId: string) => {
    await dispatch(deleteAppointment(appointmentId)); // Ensure the correct ID is passed
  };

  // Render the actions based on the user's role and appointment status
  const renderActions = (appointment: Appointment) => {
    const isCompleted = appointment.status === "completed";

    return (
      <div className="flex gap-2 mt-4">
        {userRole === "doctor" && !isCompleted && (
          <>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate(appointment._id, "completed")}
            >
              Mark Completed
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
            >
              Cancel
            </Button>
          </>
        )}

        {userRole === "patient" && !isCompleted && (
          <>
            <Dialog
              open={isUpdateDialogOpen}
              onOpenChange={setIsUpdateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  Reschedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select New Date</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date && selectedAppointment) {
                      handleDateUpdate(selectedAppointment._id, date);
                    }
                  }}
                  disabled={(date) => date < new Date()}
                />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              onClick={() => handleCancel(appointment._id)}
            >
              Cancel
            </Button>
          </>
        )}

        <Button
          variant="destructive"
          onClick={() => handleDelete(appointment._id)}
        >
          Delete
        </Button>
      </div>
    );
  };
  console.log(displayedAppointments);
  return (
    <div className="space-y-4">
      {displayedAppointments.map((appointment, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <h3 className="font-bold">Doctor: {appointment.doctorName}</h3>
            <p>Doctor ID: {appointment.doctorId}</p>
            <h3 className="font-bold">Patient: {appointment.patientName}</h3>
            <p>Patient ID: {appointment.patientId}</p>
            <p>Appointment Date: {formatDate(appointment.appointmentDate)}</p>
            <p>Status: {appointment.status}</p>
            {renderActions(appointment)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentList;
