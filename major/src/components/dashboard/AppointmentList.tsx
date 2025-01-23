"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchAppointments, updateAppointment, cancelAppointment } from "@/lib/redux/features/appointmentSlice"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CheckIcon, XIcon, PencilIcon, TrashIcon, SaveIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface AppointmentListProps {
  userType: "doctor" | "patient"
  userId: string
}

export default function AppointmentList() {
  const dispatch = useDispatch<AppDispatch>()
  const appointments = useSelector((state: RootState) => state.appointments.list)
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [newDate, setNewDate] = useState<string>("")
  const { user } = useSelector((state: RootState) => state.auth)
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string } | null>(null)

  useEffect(() => {
    dispatch(fetchAppointments())
  }, [dispatch])
  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    const appointment = appointments.find((a) => a._id === appointmentId)
    if (appointment) {
      dispatch(
        updateAppointment({
          ...appointment,
          status: newStatus,
        }),
      )
      toast({
        title: "Appointment Updated",
        description: `Appointment status changed to ${newStatus}.`,
      })
    }
  }

  const handleDateChange = (appointmentId: string) => {
    const appointment = appointments.find((a) => a._id === appointmentId)
    if (appointment && newDate) {
      dispatch(
        updateAppointment({
          ...appointment,
          appointmentDate: newDate,
        }),
      )
      setEditingDate(null)
      setNewDate("")
      toast({
        title: "Appointment Updated",
        description: "The appointment date has been changed.",
      })
    } else {
      toast({
        title: "Error",
        description: "Please select a valid date.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = (appointmentId: string) => {
    const appointment = appointments.find((a) => a._id === appointmentId)
    if (appointment) {
      dispatch(
        updateAppointment({
          ...appointment,
          status: "cancelled",
        }),
      )
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been cancelled.",
      })
    }
  }

  const handleDelete = (appointmentId: string) => {
    dispatch(cancelAppointment(appointmentId))
    toast({
      title: "Appointment Deleted",
      description: "The appointment has been deleted from the system.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  const startEditing = (appointmentId: string, currentDate: string) => {
    setEditingDate(appointmentId)
    setNewDate(currentDate)
  }

  const cancelEditing = () => {
    setEditingDate(null)
    setNewDate("")
  }

  return (
    <div className="container mx-auto px-4 py-8 w-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Appointments</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
        {appointments.map((appointment, index) => (
          <Card
            key={index}
            className="overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardTitle className="text-xl font-semibold">
                {user?.role === "doctor" ? appointment.patientName : appointment.doctorName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                {editingDate === appointment._id ? (
                  <Input
                    type="datetime-local"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  <span className="text-gray-700">{new Date(appointment.appointmentDate).toLocaleString()}</span>
                )}
              </div>
              <Badge className={`${getStatusColor(appointment.status)} text-white`}>{appointment.status}</Badge>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4 flex flex-wrap gap-2">
              {user?.role === "doctor" && appointment.status !== "completed" && appointment.status !== "cancelled" && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-500 hover:bg-green-600">
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Complete Appointment</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to mark this appointment as completed?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmAction(null)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            handleStatusChange(appointment._id, "completed")
                            setConfirmAction(null)
                          }}
                        >
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-red-500 hover:bg-red-600">
                        <XIcon className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Appointment</DialogTitle>
                        <DialogDescription>Are you sure you want to cancel this appointment?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmAction(null)}>
                          No
                        </Button>
                        <Button
                          onClick={() => {
                            handleStatusChange(appointment._id, "cancelled")
                            setConfirmAction(null)
                          }}
                        >
                          Yes, Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {user?.role === "patient" && appointment.status !== "cancelled" && appointment.status !== "completed" && (
                <>
                  {editingDate !== appointment._id ? (
                    <Button
                      onClick={() => startEditing(appointment._id, appointment.appointmentDate)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Change Date
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleDateChange(appointment._id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={cancelEditing} className="bg-gray-500 hover:bg-gray-600">
                        Cancel Edit
                      </Button>
                    </>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-red-500 hover:bg-red-600">
                        <XIcon className="w-4 h-4 mr-2" />
                        Cancel Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Appointment</DialogTitle>
                        <DialogDescription>Are you sure you want to cancel this appointment?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmAction(null)}>
                          No
                        </Button>
                        <Button
                          onClick={() => {
                            handleCancel(appointment._id)
                            setConfirmAction(null)
                          }}
                        >
                          Yes, Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gray-500 hover:bg-gray-600">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Appointment</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this appointment? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setConfirmAction(null)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDelete(appointment._id)
                        setConfirmAction(null)
                      }}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

