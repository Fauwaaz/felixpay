import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Felixpay",
  description: "Sign up for a Felixpay account",
};

export default function SignUp() {
  return <SignUpForm />;
}
