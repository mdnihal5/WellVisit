"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Doctor, fetchDoctors } from "@/lib/redux/features/doctorSlice"
import { bookAppointment } from "@/lib/redux/features/appointmentSlice"
import { AppDispatch,RootState } from "@/lib/redux/store"

export default function DoctorsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const doctors = useSelector((state: RootState) => state.doctors.list)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [appointmentDate, setAppointmentDate] = useState("")
  const { user } = useSelector((state: RootState) => state.auth);
  if(!user) return <h1 className="text-white text-2xl">This feature is only available for Patients...</h1>;

  useEffect(() => {
    dispatch(fetchDoctors())
  }, [dispatch])

  const handleBookAppointment = () => {
    if (selectedDoctor && appointmentDate) {
      dispatch(
        bookAppointment({
          doctorId: selectedDoctor._id,
          patientId: user?._id,
          appointmentDate,
          status: "upcoming", // Default status for new appointments
        }),
      )
      console.log(user);
      setSelectedDoctor(null)
      setAppointmentDate("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Doctors</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-700">{doctor.name}</h3>
            <p className="text-gray-600 mb-2">Speciality: {doctor.speciality}</p>
            <p className="text-gray-600 mb-4">Email: {doctor.email}</p>
            <button
              onClick={() => setSelectedDoctor(doctor)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Book Appointment with Dr. {selectedDoctor.name}</h3>
            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

