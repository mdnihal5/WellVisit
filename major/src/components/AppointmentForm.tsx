"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookAppointment } from "@/lib/redux/features/appointmentSlice";
import { fetchDoctors } from "@/lib/redux/features/doctorSlice"; // Import fetchDoctors action
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AppDispatch } from "@/lib/redux/store";

// Define types for Doctor, User, and Redux State
interface Doctor {
    _id: string; // Change to _id instead of id
    name: string;
    specialty: string;
}

interface User {
    name: string;
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
    const [doctorName, setDoctorName] = useState<string>(""); // Added doctorName state
    const [date, setDate] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();

    // Access doctors and user data from Redux state
    const { list: doctors } = useSelector((state: RootState) => state.doctors);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Fetch doctors when the component mounts
    useEffect(() => {
        dispatch(fetchDoctors()); // Fetch doctors from the Redux store
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

        const appointment = {
            doctorId,
            doctorName, // Include doctorName in the appointment data
            patientId: user.id,
            appointmentDate: date,
            patientName: user.name || "",
            status: "upcoming", // Set status to "upcoming"
        };

        try {
            // Dispatch the action to book the appointment
            dispatch(bookAppointment(appointment));
            console.log("Appointment booked successfully");
        } catch (error) {
            console.error("Booking error:", error);
        }
    };

    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDoctorId = e.target.value;
        setDoctorId(selectedDoctorId);

        // Log to check doctorId
        console.log("Selected doctor ID:", selectedDoctorId);

        const selectedDoctor = doctors.find((doctor) => doctor._id === selectedDoctorId); // Match by _id instead of id

        if (selectedDoctor) {
            setDoctorName(selectedDoctor.name); // Correctly set doctorName if the doctor is found
            console.log("Doctor Name:", selectedDoctor.name);
        } else {
            console.error("Doctor not found for the selected ID");
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
                    onChange={handleDoctorChange} // Use the handleDoctorChange function
                    required
                    className="w-full p-2 rounded"
                >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor, index) => (
                        <option key={index} value={doctor._id}>
                            {" "}
                            {/* Use _id here instead of id */}
                            {doctor.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="appointmentDate" className="block text-white mb-2">
                    Appointment Date
                </label>
                <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 rounded" />
            </div>

            <Button type="submit">Book Appointment</Button>
        </form>
    );
};

export default AppointmentForm;
