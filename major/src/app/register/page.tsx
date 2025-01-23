"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import RegisterForm from "@/components/auth/RegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";

export default function RegisterPage() {
  const router = useRouter(); // Initialize the router
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated); // Get auth state from Redux


    if (isAuthenticated) {
      router.push("/"); // Redirect to the home page if the user is logged in
    }
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Register</h1>
      <RegisterForm />
    </div>
  );
}
