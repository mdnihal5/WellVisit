import { Button } from "@/components/ui/Button";
import React from "react";
import { FaStar } from "react-icons/fa";
const LandingPage = () => {
  return (
    <div className="min-h-screen text-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-10">
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-bold text-white mb-4">
            Revolutionize Hospital Management
          </h2>
          <p className="text-gray-300 mb-6">
            Simplify operations, schedule appointments, and deliver exceptional
            care with WellVisit. We provide a comprehensive solution for
            hospitals and clinics to manage their operations smoothly and
            efficiently.
          </p>
          <a
            href="#features"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
          >
            Explore Features
          </a>
        </div>
        <img
          src="/assets/assets_frontend/header_img.png"
          alt="Hospital Management"
          className="mt-6 lg:mt-0 lg:w-1/2 rounded-lg shadow-lg object-cover"
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 bg-violet-700 px-6 lg:px-20">
        <h3 className="text-3xl font-bold text-center text-white mb-8">
          Our Features
        </h3>
        <p className="text-center text-gray-300 mb-8">
          WellVisit is packed with essential features that enhance the hospital
          management experience. From appointment scheduling to secure patient
          record management, we’ve got everything you need.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Appointment Scheduling Feature */}
          <div className="p-6 flex items-start justify-center flex-col bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100">
              Appointment Scheduling
            </h4>
            <p className="text-gray-400 mt-2">
              Easily schedule, track, and manage appointments for both patients
              and healthcare providers. With WellVisit, never miss an
              appointment again and ensure seamless communication.
            </p>
            <Button className="my-2" variant="secondary">
              Book Your Appointment Here
            </Button>
          </div>

          {/* Patient Records Feature */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100">Patient Records</h4>
            <p className="text-gray-400 mt-2">
              Keep detailed and secure patient records accessible at any time.
              WellVisit allows you to track medical history, prescriptions, and
              appointments, all in one place.
            </p>
            <Button className="my-2" variant="secondary">
              Get Your History
            </Button>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="specialties" className="py-10  bg-violet-700 px-6 lg:px-20">
        <h3 className="text-3xl font-bold text-center text-white mb-8">
          Types of Services (Specialties)
        </h3>
        <p className="text-center text-black text-xl mb-8">
          WellVisit connects you with experienced professionals across a wide
          range of specialties. Whether you need a general check-up or
          specialized treatment, we have you covered.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card for each specialty */}
          <div className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100 mb-4">Cardiology</h4>
            <p className="text-gray-400">
              Our cardiologists provide expert care for heart-related issues,
              including diagnosis, treatment, and prevention.
            </p>
          </div>

          <div className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100 mb-4">
              Dermatology
            </h4>
            <p className="text-gray-400">
              Expert dermatologists to treat various skin conditions, including
              acne, eczema, psoriasis, and more.
            </p>
          </div>

          <div className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100 mb-4">Pediatrics</h4>
            <p className="text-gray-400">
              Our pediatricians specialize in the care of infants, children, and
              adolescents, offering regular check-ups and vaccinations.
            </p>
          </div>

          <div className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100 mb-4">
              Orthopedics
            </h4>
            <p className="text-gray-400">
              Our orthopedic specialists handle musculoskeletal issues, from
              sports injuries to joint replacements.
            </p>
          </div>

          <div className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100 mb-4">Neurology</h4>
            <p className="text-gray-400">
              Experienced neurologists focused on diagnosing and treating
              neurological conditions, such as migraines and epilepsy.
            </p>
          </div>

          <div className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-gray-100 mb-4">
              Gastroenterology
            </h4>
            <p className="text-gray-400">
              Specialized care for digestive system disorders, including acid
              reflux, IBS, and liver diseases.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-10 px-6 lg:px-20 bg-violet-700">
        <h3 className="text-3xl font-bold text-center text-white mb-8">
          What Our Patients Say
        </h3>
        <div className="flex justify-center space-x-6">
          {/* Review 1 */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-md w-72 hover:shadow-lg transition">
            <p className="text-gray-400 mb-4">
              "WellVisit has made managing my appointments so easy. I can book a
              doctor whenever I need one, and the platform is so simple to use."
            </p>
            <p className="text-white font-bold">John Doe</p>
            <p className="text-gray-500">Patient</p>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {/* Star Rating */}
                {[...Array(5)].map((_, index) => (
                  <FaStar key={index} className="text-xl" />
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-md w-72 hover:shadow-lg transition">
            <p className="text-gray-400 mb-4">
              "WellVisit has made managing my appointments so easy. I can book a
              doctor whenever I need one, and the platform is so simple to use."
            </p>
            <p className="text-white font-bold">John Doe</p>
            <p className="text-gray-500">Patient</p>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {/* Star Rating */}
                {[...Array(5)].map((_, index) => (
                  <FaStar key={index} className="text-xl" />
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-md w-72 hover:shadow-lg transition">
            <p className="text-gray-400 mb-4">
              "WellVisit has made managing my appointments so easy. I can book a
              doctor whenever I need one, and the platform is so simple to use."
            </p>
            <p className="text-white font-bold">John Doe</p>
            <p className="text-gray-500">Patient</p>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {/* Star Rating */}
                {[...Array(5)].map((_, index) => (
                  <FaStar key={index} className="text-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
