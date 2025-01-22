"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookAppointment } from "@/lib/redux/features/appointmentSlice";
import { setDoctors } from "@/lib/redux/features/doctorSlice"; // Import the setDoctors action
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Define types for Doctor, User, and Redux State
interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface User {
  id: string;
  role: "doctor" | "patient";
}

interface RootState {
  doctors: {
    list: Doctor[];
  };
  auth: {
    user: User | null;
    isAuthenticated: boolean;
  };
}

const AppointmentForm = () => {
  const [doctorId, setDoctorId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const dispatch = useDispatch();

  // Access doctors and user data from Redux state
  const { list: doctors } = useSelector((state: RootState) => state.doctors);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  // Fetch doctors when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/doctors`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        const data = await response.json();
        if (response.ok) {
          dispatch(setDoctors(data));
        } else {
          console.error("Failed to fetch doctors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || user?.role !== "patient") {
      console.error("Only patients can book appointments");
      return;
    }

    if (!doctorId || !date) {
      console.error("Please select a doctor and appointment date.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId,
            patientId: user.id,
            appointmentDate: date,
            status: "upcoming",
          }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (response.ok) {
        dispatch(bookAppointment(data.appointment));
        console.log("Appointment booked successfully");
      } else {
        console.error("Booking failed:", data.message);
      }
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="doctorId" className="block text-white mb-2">
          Select Doctor
        </label>
        <select
          id="doctorId"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
          className="w-full p-2 rounded"
        >
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <Button type="submit">Book Appointment</Button>
    </form>
  );
};

export default AppointmentForm;
