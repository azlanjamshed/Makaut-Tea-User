import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Sparkles, GraduationCap, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { supabase } from "../config/supabase";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import OnboardingModal from "../components/auth/OnboardingModal";
import appLogo from "../assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, loginWithSupabase, submitOnboarding } = useAuth();
  const { showToast } = useToast();

  const [error, setError] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const from = location.state?.from?.pathname || "/";

  // Listen for Supabase redirect callback after Google sign-in
  useEffect(() => {
    let isMounted = true;

    const processSession = async (session) => {
      if (!session?.user) return;
      try {
        const res = await loginWithSupabase({
          accessToken: session.access_token,
          user: {
            id: session.user.id,
            email: session.user.email,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0],
            avatar:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              "",
          },
        });

        if (!isMounted) return;

        if (res.needsOnboarding) {
          setLoggedInUser(res.data);
          setShowOnboarding(true);
        } else {
          showToast("Welcome back to MAKAU-TEA!", "success");
          navigate(from, { replace: true });
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to complete authentication");
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isMounted) {
        processSession(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === "SIGNED_IN" || event === "USER_UPDATED") &&
        session?.user &&
        isMounted
      ) {
        processSession(session);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [from, loginWithSupabase, navigate, showToast]);

  const handleGoogleSuccess = async (payload) => {
    setError("");
    try {
      const res = await loginWithGoogle(payload);
      if (res.needsOnboarding) {
        setLoggedInUser(res.data);
        setShowOnboarding(true);
      } else {
        showToast("Welcome back to MAKAU-TEA!", "success");
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  const handleOnboardingComplete = async (onboardingData) => {
    try {
      await submitOnboarding(onboardingData);
      showToast("Profile set up! Welcome to MAKAU-TEA", "success");
      setShowOnboarding(false);
      navigate(from, { replace: true });
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Link to="/" className="inline-block group mb-3">
          <div className="w-20 h-20 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-[var(--border-color)] group-hover:scale-105 transition-transform bg-white shadow-md">
            <img
              src={appLogo}
              alt="MAKAU-TEA"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
          MAKAU<span className="text-[var(--color-primary)]">-TEA</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[var(--color-primary)] mt-1 max-w-xs leading-relaxed">
          Campus discourse & rants
        </p>
        <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
          Campus confessions, anonymous thoughts & unfiltered tea.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full bg-white border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Student Portal
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display mb-1">
          Welcome to MAKAU-TEA
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Sign in with your Google account to read, react, and share campus stories.
        </p>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        {/* Google OAuth Login Button */}
        <div className="space-y-4">
          <GoogleSignInButton
            text="Continue with Google"
            onGoogleSuccess={handleGoogleSuccess}
            onError={(err) => setError(err.message || "Google sign-in was cancelled")}
          />

          {/* Perks / Security features */}
          <div className="pt-3 pb-1 space-y-2 border-t border-[var(--border-color)] text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified university identity & instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span>Connect with peers across departments & semesters</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Full anonymity protection when posting confidential rants</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center">
          <p className="text-xs text-slate-500">
            First time joining?{" "}
            <Link
              to="/register"
              className="text-[var(--color-primary)] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>

      {/* Onboarding Modal for first-time Google sign-ins */}
      <OnboardingModal
        isOpen={showOnboarding}
        user={loggedInUser}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default LoginPage;
