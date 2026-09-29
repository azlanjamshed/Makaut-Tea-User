import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import appLogo from "../assets/logo.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [error, setError] = useState("");

  const handleGoogleSuccess = async (payload) => {
    setError("");
    try {
      await loginWithGoogle(payload);
      showToast("Welcome to MAKAU-TEA!", "success");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account with Google");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Link to="/" className="inline-block group mb-2">
          <div className="w-15 h-15 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-[var(--border-color)] group-hover:scale-105 transition-transform bg-white shadow-md">
            <img
              src={appLogo}
              alt="MAKAU-TEA"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">
          Join MAKAU<span className="text-[var(--color-primary)]">-TEA</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Campus discourse & rants — vent, react, and connect with fellow
          students.
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full bg-white border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Student Registration
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display mb-1">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Sign up with your Google account. You'll choose your department and
          semester right next.
        </p>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <GoogleSignInButton
            text="Sign up with Google"
            onGoogleSuccess={handleGoogleSuccess}
            onError={(err) =>
              setError(err.message || "Google sign-up was cancelled")
            }
          />

          {/* Student Account Features */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Student Account Features
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant campus verification via your Google account</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Choose your department (CSE, IT, LLB, Biotech, etc.)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Option to post anonymously anytime while keeping reactions
                  verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--color-primary)] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Sign in</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
