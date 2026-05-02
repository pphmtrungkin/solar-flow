"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OTPInput, type SlotProps } from "input-otp";
import { authClient } from "@/lib/auth-client";
import { Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAlert } from "@/hooks/useAlert";

/**
 * A single slot in the OTP input, styled with DaisyUI classes.
 */
function Slot(props: SlotProps) {
  return (
    <div
      className={`
        relative w-12 h-16 flex items-center justify-center
        text-2xl font-black transition-all duration-300
        border-2 rounded-2xl bg-base-200/50
        ${props.isActive ? "border-primary bg-base-100 shadow-[0_0_20px_rgba(var(--p),0.2)] scale-110 z-10" : "border-transparent"}
        ${props.char ? "text-base-content" : "text-base-content/20"}
      `}
    >
      {props.char !== null ? (
        <div className="animate-in fade-in zoom-in duration-300">
          {props.char}
        </div>
      ) : (
        <div className="w-1 h-1 rounded-full bg-current opacity-20" />
      )}
      {props.hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-0.5 h-8 bg-primary animate-caret-blink" />
        </div>
      )}
    </div>
  );
}

function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "";
  const { showAlert } = useAlert();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOTP = async (code: string) => {
    if (code.length !== 6) return;

    setIsLoading(true);

    if (type === "sign-in") {
      const { data, error: authError } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (authError) {
        showAlert("error", authError.message as string);
      } else {
        router.push("/auth/login");
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-primary/10 text-primary mb-4">
          <Mail className="w-10 h-10" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-base-content">
          Check your mail
        </h1>
        <p className="text-base-content/60 font-medium">
          We've sent a 6-digit code to <br />
          <span className="text-base-content font-bold">
            {email || "your email"}
          </span>
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex flex-col items-center space-y-8">
        <OTPInput
          maxLength={6}
          value={otp}
          onChange={(val) => {
            setOtp(val);
            if (val.length === 6) handleOTP(val);
          }}
          containerClassName="group flex items-center gap-3 has-[:disabled]:opacity-50"
          render={({ slots }) => (
            <>
              <div className="flex gap-2">
                {slots.slice(0, 3).map((slot, idx) => (
                  <Slot key={idx} {...slot} />
                ))}
              </div>
              <div className="w-4 h-0.5 bg-base-content/10 rounded-full" />
              <div className="flex gap-2">
                {slots.slice(3).map((slot, idx) => (
                  <Slot key={idx} {...slot} />
                ))}
              </div>
            </>
          )}
        />
      </div>

      {/* Footer Actions */}
      <div className="space-y-6">
        <button
          onClick={() => handleOTP(otp)}
          disabled={isLoading || otp.length !== 6}
          className="btn btn-primary btn-block h-20 rounded-3xl shadow-2xl shadow-primary/20 text-lg font-black uppercase tracking-[0.2em] group"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Verify Identity
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-sm font-bold opacity-40 uppercase tracking-widest">
            Didn't receive a code?
          </p>
          <button
            className="btn btn-link no-underline hover:text-primary font-black uppercase tracking-widest text-xs mt-2"
            onClick={() => {
              /* Implement resend logic if needed */
            }}
          >
            Resend Verification Email
          </button>
        </div>
      </div>

      <div className="text-center pt-8">
        <Link
          href="/auth/login"
          className="text-xs font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-base-100/50">
      <Suspense
        fallback={<Loader2 className="w-10 h-10 animate-spin text-primary" />}
      >
        <OTPContent />
      </Suspense>

      <style jsx global>{`
        @keyframes caret-blink {
          0%,
          70%,
          100% {
            opacity: 1;
          }
          20%,
          50% {
            opacity: 0;
          }
        }
        .animate-caret-blink {
          animation: caret-blink 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
