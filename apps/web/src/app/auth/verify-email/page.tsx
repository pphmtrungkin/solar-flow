"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get("email") ?? "";
  const [email, setEmail] = React.useState(emailFromQuery);
  const [otp, setOtp] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // keep state in sync if query param changes (e.g., user navigates here again)
  React.useEffect(() => {
    if (emailFromQuery && emailFromQuery !== email) {
      setEmail(emailFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFromQuery]);

  const normalizeOtp = (value: string) => value.replace(/\D/g, "").slice(0, 8);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }
    if (!otp.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Uses better-auth email OTP client plugin.
      // Depending on your better-auth version, the method name can be one of:
      // - authClient.emailOTP.verifyEmail(...)
      // - authClient.emailOTP.verify(...)
      // This implementation tries both to avoid hard-failing on naming differences.
      const emailOTP: any = (authClient as any).emailOTP;

      if (!emailOTP) {
        throw new Error(
          "Email OTP client is not configured. Ensure emailOTPClient() is added to createAuthClient plugins.",
        );
      }

      let result:
        | { data?: unknown; error?: { message?: string } | unknown }
        | undefined;

      if (typeof emailOTP.verifyEmail === "function") {
        result = await emailOTP.verifyEmail({
          email: trimmedEmail,
          otp,
        });
      } else if (typeof emailOTP.verify === "function") {
        result = await emailOTP.verify({
          email: trimmedEmail,
          otp,
          type: "email_verification",
        });
      } else {
        throw new Error(
          "Email OTP verify method not found on auth client. Check better-auth email OTP client API.",
        );
      }

      if (result && (result as any).error) {
        const errObj: any = (result as any).error;
        setError(errObj?.message ?? "Invalid verification code.");
        return;
      }

      setSuccess("Email verified successfully. Redirecting...");
      // Send them somewhere sensible; adjust route as needed
      setTimeout(() => router.push("/login" as any), 800);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to verify email.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email to resend a verification code.");
      return;
    }

    setIsResending(true);
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

      if (typeof emailOTP.sendVerificationOTP === "function") {
        result = await emailOTP.sendVerificationOTP({
          email: trimmedEmail,
          type: "email_verification",
        });
      } else if (typeof emailOTP.send === "function") {
        result = await emailOTP.send({
          email: trimmedEmail,
          type: "email_verification",
        });
      } else {
        throw new Error(
          "Email OTP resend method not found on auth client. Check better-auth email OTP client API.",
        );
      }

      if (result && (result as any).error) {
        const errObj: any = (result as any).error;
        setError(errObj?.message ?? "Failed to resend verification code.");
        return;
      }

      setSuccess("A new verification code has been sent to your email.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to resend verification code.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="my-auto w-full flex justify-center px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-sm space-y-4 bg-base-200 border border-base-300 rounded-box p-6"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Verify your email</h1>
          <p className="text-sm opacity-70">
            Enter the verification code (OTP) sent to your email.
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

        <div className="space-y-2">
          <label className="label py-0">
            <span className="label-text">Verification code</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            inputMode="numeric"
            name="otp"
            placeholder="Enter code"
            value={otp}
            onChange={(e) => setOtp(normalizeOtp(e.target.value))}
            autoComplete="one-time-code"
            required
          />
          <p className="text-xs opacity-60">
            Tip: If you pasted spaces or dashes, they’ll be removed
            automatically.
          </p>
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
          {isSubmitting ? "Verifying..." : "Verify email"}
        </button>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>

          <button
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => router.push("/login" as any)}
          >
            Back to login
          </button>
        </div>
      </form>
    </div>
  );
}
