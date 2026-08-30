"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerCustomer } from "@/lib/supabase/actions";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { UserPlus, Mail, Lock, User, Building, Phone, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [emailConfirmationRequired, setEmailConfirmationRequired] = React.useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      setErrorMessage("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerCustomer({
        email,
        password,
        fullName,
        phone: phone || undefined,
        companyName: companyName || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Registration failed. Please try again.");
        toast.error("Registration error", { description: res.error });
      } else {
        if (res.message?.includes("email inbox")) {
          setEmailConfirmationRequired(true);
        } else {
          toast.success("Account created successfully!");
          router.push("/account");
          router.refresh();
        }
      }
    } catch {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailConfirmationRequired) {
    return (
      <div className="shell py-12 max-w-md mx-auto space-y-6 text-center">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Mail className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-extrabold text-ink">Check Your Email</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We have sent a verification link to <strong>{email}</strong>. Please click the link to activate your account and start configuring your print jobs.
            </p>
          </div>
          <div className="pt-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10 max-w-lg mx-auto space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Create Account" },
        ]}
      />

      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-violet/10 text-violet mb-3">
            <UserPlus className="size-5" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink">
            Create Customer Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Save delivery addresses, pre-press artwork presets, and business GST details.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-2.5 text-xs text-red-700" role="alert">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="reg-fullname" className="font-bold text-ink">Full Name *</label>
              <div className="relative">
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-border pl-9 pr-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
                />
                <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-company" className="font-bold text-ink">Company / Studio (Optional)</label>
              <div className="relative">
                <input
                  id="reg-company"
                  type="text"
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Pixel Works LLP"
                  className="w-full rounded-xl border border-border pl-9 pr-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
                />
                <Building className="absolute left-3 top-3 size-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="font-bold text-ink">Email Address *</label>
              <div className="relative">
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-border pl-9 pr-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
                />
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-phone" className="font-bold text-ink">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  id="reg-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="w-full rounded-xl border border-border pl-9 pr-3.5 py-2.5 text-xs font-mono text-ink focus:border-violet focus:outline-none"
                />
                <Phone className="absolute left-3 top-3 size-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="font-bold text-ink">Password (6+ chars) *</label>
              <div className="relative">
                <input
                  id="reg-password"
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
              <label htmlFor="reg-confirm-password" className="font-bold text-ink">Confirm Password *</label>
              <div className="relative">
                <input
                  id="reg-confirm-password"
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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet py-3 px-5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
          >
            <span>{isSubmitting ? "Creating Account..." : "Register Customer Account"}</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground space-y-2">
          <div>
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-violet hover:underline">
              Sign in here
            </Link>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Encrypted Supabase Auth Credentials</span>
          </div>
        </div>
      </div>
    </div>
  );
}
