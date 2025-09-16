// components/auth/SignUpForm.tsx
"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useAuthForm } from "@/app/hooks/useAuthForm";
import Image from "next/image";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { signup } = useAuth();
  const router = useRouter();
  const {
    errors,
    loading,
    setLoading,
    validateField,
    setFieldError,
    clearFieldError,
    clearAllErrors
  } = useAuthForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      clearFieldError(name);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setFieldError(name, error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    clearAllErrors();

    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);

    if (nameError || emailError || passwordError) {
      if (nameError) setFieldError('name', nameError);
      if (emailError) setFieldError('email', emailError);
      if (passwordError) setFieldError('password', passwordError);
      return;
    }

    setLoading(true);

    try {
      const result = await signup(formData.name, formData.email, formData.password);

      if (result.success) {
        router.push('/dashboard'); // Redirect to dashboard or desired page
      } else {
        setFieldError('general', result.error || 'Sign up failed');
      }
    } catch  {
      setFieldError('general', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="flex items-center gap-2 justify-center mb-7">
          <Image
            src={'/images/logo/logo-icon.svg'}
            alt=""
            width={50}
            height={100}
            quality={100}
            unoptimized
          />
          <h1 className="text-5xl font-bold dark:text-white/90">Felix Pay</h1>
        </div>
        <div className="mb-5 sm:mb-8">
          <h2 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {errors.general && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {errors.general}
              </div>
            )}

            <div>
              <Label>
                Full Name <span className="text-error-500">*</span>
              </Label>
              <Input
                name="name"
                placeholder="John Doe"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                name="email"
                placeholder="info@gmail.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={errors.password ? "border-red-500" : ""}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                size="sm"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}