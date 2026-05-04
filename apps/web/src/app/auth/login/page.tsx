"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Alert } from "@/components/alert";
import Link from "next/link";

type AlertType = "success" | "error" | null;

export default function Page() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [alertType, setAlertType] = React.useState<AlertType>(null);
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      setAlertType("error");
      setAlertMessage("Email and password are required.");
      return;
    }

    setSubmitting(true);
    setAlertType(null);
    setAlertMessage(null);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: invitationId ? `/accept-invitation/${invitationId}` : "/",
        rememberMe: true,
      });

      if (error) {
        console.error("Login error", error);
        setAlertType("error");
        setAlertMessage(error.code + ": " + error.message);
        return;
      }

      if (data) {
        setAlertType("success");
        setAlertMessage("Login successful. Redirecting…");
        if (invitationId) {
          router.replace(`/accept-invitation/${invitationId}` as any);
        } else {
          router.replace("/");
        }
      }
    } catch (err) {
      console.error("Unexpected login error", err);
      setAlertType("error");
      setAlertMessage("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto my-auto">
      <form onSubmit={handleSubmit}>
        {alertType && alertMessage && (
          <div className="mb-3">
            <Alert type={alertType} message={alertMessage} />
          </div>
        )}

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Login</legend>

          <label className="label">Email</label>
          <div className="join">
            <div className="w-full">
              <label className="input validator join-item">
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
                <input name="email" type="email" placeholder="Email" required />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>
            </div>
          </div>

          <label className="label">
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
              minLength={3}
            />
            <button
              type="button"
              className="btn btn-ghost btn-xs px-1"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
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

          <button
            className="btn btn-neutral mt-4 w-full"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </fieldset>
      </form>

      <div className="mt-4 text-center text-sm space-y-2">
        <p>
          <a href="/auth/forgot-password" className="hover:underline">
            Forgot password?
          </a>
        </p>

        <p>
          Not a member?{" "}
          <Link
            href={{
              pathname: "/auth/signup",
              query: invitationId ? { invitationId } : undefined,
            }}
            className="hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
