"use client"
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import LoginForm from "@/components/auth/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated); // Get auth state from Redux

  // Redirect if user is authenticated
  if (isAuthenticated) {
    router.push("/"); // Navigate to the home page
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Login</h1>
      <LoginForm />
    </div>
  );
}
