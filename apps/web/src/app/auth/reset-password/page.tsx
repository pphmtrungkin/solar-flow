"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get("email") ?? "";
  const [email, setEmail] = React.useState(emailFromQuery);
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (emailFromQuery && emailFromQuery !== email) setEmail(emailFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFromQuery]);

  const normalizeOtp = (value: string) => value.replace(/\D/g, "").slice(0, 8);

  const validate = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return "Please enter your email.";
    if (!otp.trim()) return "Please enter the reset code.";
    if (!newPassword) return "Please enter a new password.";
    if (newPassword.length < 8)
      return "Password must be at least 8 characters.";
    if (newPassword !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleResend = async () => {
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email to resend a reset code.");
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
          type: "password_reset",
        });
      } else if (typeof emailOTP.send === "function") {
        result = await emailOTP.send({
          email: trimmedEmail,
          type: "password_reset",
        });
      } else {
        throw new Error(
          "Email OTP resend method not found on auth client. Check better-auth email OTP client API.",
        );
      }

      if (result && (result as any).error) {
        const errObj: any = (result as any).error;
        setError(errObj?.message ?? "Failed to resend reset code.");
        return;
      }

      setSuccess("A new reset code has been sent to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend reset code.");
    } finally {
      setIsResending(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmedEmail = email.trim();

    setIsSubmitting(true);
    try {
      const emailOTP: any = (authClient as any).emailOTP;

      if (!emailOTP) {
        throw new Error(
          "Email OTP client is not configured. Ensure emailOTPClient() is added to createAuthClient plugins.",
        );
      }

      // better-auth versions may differ; try common method names.
      // Goal: verify OTP for password_reset and set new password.
      let result:
        | { data?: unknown; error?: { message?: string } | unknown }
        | undefined;

      if (typeof emailOTP.resetPassword === "function") {
        result = await emailOTP.resetPassword({
          email: trimmedEmail,
          otp,
          password: newPassword,
        });
      } else if (typeof emailOTP.verifyAndResetPassword === "function") {
        result = await emailOTP.verifyAndResetPassword({
          email: trimmedEmail,
          otp,
          password: newPassword,
        });
      } else if (typeof emailOTP.verify === "function") {
        // Fallback: some APIs split verify + action server-side; if so, this may not be sufficient.
        // We still attempt a verify call with type password_reset.
        result = await emailOTP.verify({
          email: trimmedEmail,
          otp,
          type: "password_reset",
          password: newPassword,
        });
      } else {
        throw new Error(
          "Password reset method not found on auth client. Check better-auth email OTP client API for password reset.",
        );
      }

      if (result && (result as any).error) {
        const errObj: any = (result as any).error;
        setError(errObj?.message ?? "Failed to reset password.");
        return;
      }

      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => router.push("/auth/login" as any), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-auto w-full flex justify-center px-4">
      <form
        onSubmit={handleResetPassword}
        className="w-full max-w-sm space-y-4 bg-base-200 border border-base-300 rounded-box p-6"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Reset password</h1>
          <p className="text-sm opacity-70">
            Enter the reset code (OTP) sent to your email and choose a new password.
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
            <span className="label-text">Reset code</span>
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
            Tip: If you pasted spaces or dashes, they’ll be removed automatically.
          </p>
        </div>

        <div className="space-y-2">
          <label className="label py-0">
            <span className="label-text">New password</span>
          </label>
          <div className="input input-bordered flex items-center gap-2">
            <input
              className="grow"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
            />
            <button
              type="button"
              className="btn btn-ghost btn-xs px-1"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="label py-0">
            <span className="label-text">Confirm new password</span>
          </label>
          <div className="input input-bordered flex items-center gap-2">
            <input
              className="grow"
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
            />
            <button
              type="button"
              className="btn btn-ghost btn-xs px-1"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
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
          {isSubmitting ? "Resetting..." : "Reset password"}
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
            className="btn btn-link btn-sm px-0"
            onClick={() => router.push("/auth/login" as any)}
          >
            Back to login
          </button>
        </div>
      </form>
    </div>
  );
}
