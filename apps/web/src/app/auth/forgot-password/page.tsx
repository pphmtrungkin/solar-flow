"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const emailOTP: any = (authClient as any).emailOTP;

      if (!emailOTP) {
        throw new Error(
          "Email OTP client is not configured. Ensure emailOTPClient() is added to createAuthClient plugins.",
        );
      }

      let result:
        | { data?: unknown; error?: { message?: string } | unknown }
        | undefined;

      // Depending on better-auth version, method names may differ.
      if (typeof emailOTP.sendVerificationOTP === "function") {
        result = await emailOTP.sendVerificationOTP({
          email: trimmedEmail,
          type: "password_reset",
        });
      } else if (typeof emailOTP.send === "function") {
        result = await emailOTP.send({
          email: trimmedEmail,
          type: "password_reset",
        });
      } else {
        throw new Error(
          "Email OTP send method not found on auth client. Check better-auth email OTP client API.",
        );
      }

      if (result && (result as any).error) {
        const errObj: any = (result as any).error;
        setError(errObj?.message ?? "Failed to send reset code.");
        return;
      }

      setSuccess("We sent a password reset code to your email.");
      // Navigate to reset password page (with email prefilled)
      router.push(`/auth/reset-password?email=${encodeURIComponent(trimmedEmail)}` as any);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset code.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-auto w-full flex justify-center px-4">
      <form
        onSubmit={handleSendCode}
        className="w-full max-w-sm space-y-4 bg-base-200 border border-base-300 rounded-box p-6"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Forgot password</h1>
          <p className="text-sm opacity-70">
            Enter your email and we’ll send you a one-time code to reset your password.
          </p>
        </div>

        <div className="space-y-2">
          <label className="label py-0">
            <span className="label-text">Email</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span className="text-sm">{success}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send reset code"}
        </button>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="btn btn-link btn-sm px-0"
            onClick={() => router.push("/auth/login" as any)}
          >
            Back to login
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setEmail("")}
            disabled={isSubmitting}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
