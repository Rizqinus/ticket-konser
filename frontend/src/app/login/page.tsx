"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop relative overflow-hidden">
      {/* Atmospheric Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-surface-container blur-[120px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed blur-[120px] opacity-40 pointer-events-none"></div>

      <main className="w-full max-w-[440px] relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-container mb-4 shadow-sm">
            <Icon name="confirmation_number" className="text-on-primary text-[28px]" />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight">
            Concert Manager
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Enterprise Administration Portal
          </p>
        </div>

        <div className="bg-surface-container-lowest login-card rounded-xl p-8 md:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="block font-label-md text-label-md text-on-surface"
                htmlFor="identifier"
              >
                Email or Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon
                    name="person"
                    className="text-outline text-[20px] group-focus-within:text-primary transition-colors"
                  />
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-xl font-body-base text-body-base text-on-surface placeholder:text-outline/50 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  id="identifier"
                  name="identifier"
                  placeholder="admin@concert.com"
                  required
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  className="block font-label-md text-label-md text-on-surface"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="font-label-sm text-label-sm text-primary hover:underline transition-all"
                  href="#"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon
                    name="lock"
                    className="text-outline text-[20px] group-focus-within:text-primary transition-colors"
                  />
                </div>
                <input
                  className="block w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-xl font-body-base text-body-base text-on-surface placeholder:text-outline/50 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <Icon
                    name={showPassword ? "visibility_off" : "visibility"}
                    className="text-[20px]"
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary/20"
                id="remember"
                type="checkbox"
              />
              <label
                className="ml-2 font-body-sm text-body-sm text-on-surface-variant cursor-pointer"
                htmlFor="remember"
              >
                Keep me signed in
              </label>
            </div>

            <button
              className="w-full py-3.5 px-6 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-md hover:bg-primary-container active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 group"
              type="submit"
              disabled={submitting}
            >
              <span>{submitting ? "Authenticating..." : "Login to Dashboard"}</span>
              <Icon
                name="arrow_forward"
                className="text-[18px] transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Having trouble?{" "}
              <a
                className="text-primary font-label-sm hover:underline"
                href="#"
              >
                Contact System Admin
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center flex flex-col gap-2">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
            v2.4.0 Stable
          </p>
          <div className="flex justify-center gap-4">
            <a
              className="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <span className="text-outline/30">•</span>
            <a
              className="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors"
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
