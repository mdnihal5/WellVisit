"use client";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { FaStar } from "react-icons/fa";
import { fetchAppointments } from "@/lib/redux/features/appointmentSlice";
import { fetchDoctors } from "@/lib/redux/features/doctorSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import Link from "next/link";
import Image from "next/image";

const LandingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDoctors());
      dispatch(fetchAppointments());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="min-h-screen text-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-10">
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-bold text-white mb-4">
            Revolutionize Hospital Management
          </h2>
          <p className="text-gray-300 mb-6">
            Simplify operations, schedule appointments, and deliver exceptional care with WellVisit. 
            We provide a comprehensive solution for hospitals and clinics to manage their operations smoothly and efficiently.
          </p>
          <a href="#features" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700">
            Explore Features
          </a>
        </div>
        <Image
          src="/assets/assets_frontend/header_img.png"
          alt="Hospital Management"
          width={500}
          height={350}
          className="mt-6 lg:mt-0 lg:w-1/2 rounded-lg shadow-lg object-cover"
          priority
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 bg-violet-700 px-6 lg:px-20">
        <h3 className="text-3xl font-bold text-center text-white mb-8">Our Features</h3>
        <p className="text-center text-gray-300 mb-8">
          WellVisit is packed with essential features that enhance the hospital management experience. 
          From appointment scheduling to secure patient record management, we’ve got everything you need.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Appointment Scheduling Feature */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100">Appointment Scheduling</h4>
            <p className="text-gray-400 mt-2">
              Easily schedule, track, and manage appointments for both patients and healthcare providers.
              With WellVisit, never miss an appointment again and ensure seamless communication.
            </p>
            <Link href="/doctors">
              <Button className="my-2" variant="secondary">Book Your Appointment Here</Button>
            </Link>
          </div>

          {/* Patient Records Feature */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100">Patient Records</h4>
            <p className="text-gray-400 mt-2">
              Keep detailed and secure patient records accessible at any time.
              WellVisit allows you to track medical history, prescriptions, and appointments, all in one place.
            </p>
            <Link href={`/dashboard/${user?.role || ""}`}>
              <Button className="my-2" variant="secondary">Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="specialties" className="py-10 bg-violet-700 px-6 lg:px-20">
        <h3 className="text-3xl font-bold text-center text-white mb-8">Types of Services (Specialties)</h3>
        <p className="text-center text-black text-xl mb-8">
          WellVisit connects you with experienced professionals across a wide range of specialties. 
          Whether you need a general check-up or specialized treatment, we have you covered.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Cardiology", description: "Expert care for heart-related issues, including diagnosis, treatment, and prevention." },
            { title: "Dermatology", description: "Specialized treatment for skin conditions such as acne, eczema, and psoriasis." },
            { title: "Pediatrics", description: "Comprehensive care for infants, children, and adolescents, including vaccinations." },
            { title: "Orthopedics", description: "Treatment for musculoskeletal issues, including joint replacements and sports injuries." },
            { title: "Neurology", description: "Expert diagnosis and treatment for neurological conditions like migraines and epilepsy." },
            { title: "Gastroenterology", description: "Specialized care for digestive system disorders such as acid reflux and IBS." }
          ].map((specialty, index) => (
            <div key={index} className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-gray-100 mb-4">{specialty.title}</h4>
              <p className="text-gray-400">{specialty.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-10 px-6 lg:px-20 bg-violet-700">
        <h3 className="text-3xl font-bold text-center text-white mb-8">What Our Patients Say</h3>
        <div className="flex flex-wrap justify-center gap-6">
          {["John Doe", "Jane Smith", "Michael Brown"].map((reviewer, index) => (
            <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-md w-72 hover:shadow-lg transition">
              <p className="text-gray-400 mb-4">
                &ldquo;WellVisit has made managing my appointments so easy. I can book a doctor whenever I need one, 
                and the platform is so simple to use.&rdquo;
              </p>
              <p className="text-white font-bold">{reviewer}</p>
              <p className="text-gray-500">Patient</p>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, starIndex) => (
                    <FaStar key={starIndex} className="text-xl" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

