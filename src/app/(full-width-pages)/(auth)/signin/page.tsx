import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Felixpay",
  description: "Sign in to your Felixpay account",
};

export default function SignIn() {
  return <SignInForm />;
}
