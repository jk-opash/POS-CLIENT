"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginOwner, clearError } from '../../store/slices/authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Eye, EyeOff, Zap, Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("karthik@dailygrind.co");
  const [password, setPassword] = useState("password123");
  const [showPass, setShowPass] = useState(false);

  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (error) {
      dispatch(clearError());
    }

    const resultAction = await dispatch(loginOwner({ email, password }));

    if (loginOwner.fulfilled.match(resultAction)) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/20 via-brand-bg to-white/10" />
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-brand-dark/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-brand-purple/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-dark to-brand-primaryDark shadow-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-brand-dark">
              POS Client
            </span>
          </div>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-4xl font-bold text-brand-dark leading-tight">
            Restaurant Management
            <br />
            <span className="bg-gradient-to-r from-brand-dark to-white bg-clip-text text-transparent">
              Point of Sale
            </span>
          </h2>
          <p className="text-brand-muted leading-relaxed max-w-sm">
            Manage your restaurant operations, orders, and staff from one
            powerful platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Outlets", value: "4" },
              { label: "Daily Orders", value: "850+" },
              { label: "Staff Members", value: "24" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-brand-border bg-white/80 p-4"
              >
                <p className="text-xl font-bold text-brand-dark">
                  {stat.value}
                </p>
                <p className="text-xs text-brand-muted mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-brand-placeholder">
            © 2026 POS Client. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex flex-1 items-center justify-center p-8 bg-white shadow-2xl z-10 lg:shadow-none lg:bg-transparent">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-dark to-brand-primaryDark">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-brand-dark">
              POS Client
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-brand-dark">Welcome back</h1>
            <p className="mt-1 text-sm text-brand-muted">
              Sign in to your owner account
            </p>
          </div>

          {/* Security badge */}
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-brand-success/20 bg-brand-success/5 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-brand-success" />
            <span className="text-xs text-brand-success">
              Secure access — Owners only
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" id="login-form">
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="owner@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              id="login-password"
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="cursor-pointer"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              required
            />

            {error && (
              <p className="text-sm text-brand-danger bg-brand-danger/5 border border-brand-danger/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold"
              loading={loading}
              id="login-submit-btn"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-brand-placeholder">
            Need help logging in? Contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
