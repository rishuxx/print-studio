"use client";

import * as React from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/supabase/actions";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { KeyRound, Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSent, setIsSent] = React.useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email);
      if (!res.success) {
        setErrorMessage(res.error || "Unable to send reset email.");
        toast.error("Error", { description: res.error });
      } else {
        setIsSent(true);
        toast.success("Recovery instructions sent!");
      }
    } catch {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shell py-10 max-w-md mx-auto space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Forgot Password" },
        ]}
      />

      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-violet/10 text-violet mb-3">
            <KeyRound className="size-5" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink">
            Reset Your Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your registered email address to receive secure recovery instructions.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-2.5 text-xs text-red-700" role="alert">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSent ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3 text-xs text-emerald-800 text-center">
            <div className="flex items-center justify-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Recovery Link Dispatched</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[0.6875rem]">
              If an account is associated with <strong>{email}</strong>, we have sent a secure password reset link. Please check your inbox and spam folder.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 font-bold text-violet hover:underline text-xs"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="forgot-email" className="font-bold text-ink">Registered Email Address</label>
              <div className="relative">
                <input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-border pl-9 pr-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
                />
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet py-3 px-5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? "Sending Link..." : "Send Recovery Instructions"}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>
        )}

        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          Remembered your password?{" "}
          <Link href="/login" className="font-bold text-violet hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
