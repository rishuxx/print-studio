"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/supabase/actions";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isCompleted, setIsCompleted] = React.useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password || password.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(password);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to update password. Your recovery link may have expired.");
        toast.error("Error", { description: res.error });
      } else {
        setIsCompleted(true);
        toast.success("Password updated successfully!");
        setTimeout(() => {
          router.push("/account");
          router.refresh();
        }, 2000);
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
          { label: "Set New Password" },
        ]}
      />

      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-violet/10 text-violet mb-3">
            <Lock className="size-5" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink">
            Set New Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Please choose a strong password with at least 6 characters.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-2.5 text-xs text-red-700" role="alert">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isCompleted ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3 text-xs text-emerald-800 text-center">
            <div className="flex items-center justify-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Password Changed Successfully</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[0.6875rem]">
              Your password has been updated. Redirecting you to your account dashboard...
            </p>
            <div className="pt-2">
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 font-bold text-violet hover:underline text-xs"
              >
                <span>Go to Account Now</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="font-bold text-ink">New Password</label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border pl-9 pr-10 py-2.5 text-xs font-mono text-ink focus:border-violet focus:outline-none"
                />
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-ink focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-new-password" className="font-bold text-ink">Confirm New Password</label>
              <div className="relative">
                <input
                  id="confirm-new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border pl-9 pr-3.5 py-2.5 text-xs font-mono text-ink focus:border-violet focus:outline-none"
                />
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet py-3 px-5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? "Updating Password..." : "Update Password"}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>
        )}

        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <Link href="/login" className="font-bold text-violet hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
