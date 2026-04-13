"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      // TODO: replace with proper UI feedback
      console.error("Passwords do not match");
      return;
    }

    // TODO: replace with authClient or API call
    console.log("signup", { fullName, email, password });

    const { data, error } = await authClient.signUp.email({
      name: fullName,
      email,
      password,
    });
    if (error) {
      console.error("signup error", error);
      return;
    } else {
      console.log("signup success", data);
    }
  };

  return (
    <div className="my-auto">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Sign Up</legend>

          {/* Full Name */}
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            name="fullName"
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter your full name"
            required
          />

          {/* Email */}
          <label className="label mt-3">
            <span className="label-text">Email</span>
          </label>
          <div className="join">
            <div className="w-full">
              <label className="input input-bordered join-item flex items-center gap-2">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  name="email"
                  type="email"
                  className="grow"
                  placeholder="Email"
                  required
                />
              </label>
              <div className="validator-hint hidden text-xs text-error mt-1">
                Enter a valid email address
              </div>
            </div>
          </div>

          {/* Password */}
          <label className="label mt-3">
            <span className="label-text">Password</span>
          </label>
          <div className="input input-bordered flex items-center gap-2">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="grow"
              required
              placeholder="Password"
              minLength={8}
              pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />
            <button
              type="button"
              className="btn btn-ghost btn-xs px-1"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // eye-off icon
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9.27-3.11-11-8 1-2.86 2.84-5.15 5.12-6.51" />
                  <path d="M10.58 10.58A2 2 0 0 0 13.41 13.4" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                // eye icon
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <p className="validator-hint hidden text-xs text-error mt-1">
            Must be more than 8 characters, including:
            <br />
            • At least one number
            <br />
            • At least one lowercase letter
            <br />• At least one uppercase letter
          </p>

          {/* Confirm Password */}
          <label className="label mt-3">
            <span className="label-text">Confirm Password</span>
          </label>
          <div className="input input-bordered flex items-center gap-2">
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              className="grow"
              placeholder="Repeat your password"
              required
            />
            <button
              type="button"
              className="btn btn-ghost btn-xs px-1"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9.27-3.11-11-8 1-2.86 2.84-5.15 5.12-6.51" />
                  <path d="M10.58 10.58A2 2 0 0 0 13.41 13.4" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button className="btn btn-neutral mt-4 w-full" type="submit">
            Sign Up
          </button>
        </fieldset>
      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
