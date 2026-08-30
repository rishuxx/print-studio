"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginCustomer } from "@/lib/supabase/actions";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="shell py-12 text-center text-xs text-muted-foreground">Loading sign in...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  
  const errorParam = searchParams.get("error");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(errorParam || "");
  const [submittingStatusText, setSubmittingStatusText] = React.useState("Sign In to Account");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your registered email and password.");
      return;
    }

    setIsSubmitting(true);
    setSubmittingStatusText("Authenticating...");
    try {
      const res = await loginCustomer({ email, password }, rawRedirect);
      if (!res.success) {
        setErrorMessage(res.error || "Invalid credentials. Please check your email and password.");
        toast.error("Sign in failed", { description: res.error });
        setIsSubmitting(false);
        setSubmittingStatusText("Sign In to Account");
      } else {
        const dest = res.redirectTo || (res.role === "admin" ? "/admin" : "/account");
        if (res.role === "admin") {
          setSubmittingStatusText("Opening Admin Console...");
          toast.success("Welcome, Administrator!", { description: "Opening operations command center." });
        } else {
          setSubmittingStatusText("Signing you in...");
          toast.success("Welcome back!");
        }
        router.push(dest);
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsSubmitting(false);
      setSubmittingStatusText("Sign In to Account");
    }
  };

  return (
    <div className="shell py-10 max-w-md mx-auto space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Customer Sign In" },
        ]}
      />

      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-violet/10 text-violet mb-3">
            <Lock className="size-5" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink">
            Customer Sign In
          </h1>
          <p className="text-xs text-muted-foreground">
            Access your saved print specifications, track live jobs, and download invoices.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-2.5 text-xs text-red-700" role="alert">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="font-bold text-ink">Email Address</label>
            <div className="relative">
              <input
                id="login-email"
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="font-bold text-ink">Password</label>
              <Link
                href="/forgot-password"
                className="text-[0.6875rem] font-semibold text-violet hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet py-3 px-5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
          >
            <span>{submittingStatusText}</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground space-y-2">
          <div>
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold text-violet hover:underline">
              Create customer account
            </Link>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Secure SSL Encrypted Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
