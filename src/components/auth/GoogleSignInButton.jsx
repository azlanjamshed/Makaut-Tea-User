import React, { useEffect, useState, useRef } from "react";
import { Loader2, AlertCircle, Laptop, ArrowRight } from "lucide-react";
import Button from "../common/Button";

// Official Google "G" logo SVG
const GoogleLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const GoogleSignInButton = ({ onGoogleSuccess, onError, text = "Continue with Google" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devEmail, setDevEmail] = useState("");
  const [devName, setDevName] = useState("");

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (!googleClientId) return;

    // Load Google Identity Services script
    const loadGsi = () => {
      if (window.google?.accounts?.id) {
        initializeGsi();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGsi;
      document.body.appendChild(script);
    };

    const initializeGsi = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGsiCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } catch (err) {
        console.error("Failed to initialize Google Sign-In:", err);
      }
    };

    loadGsi();
  }, [googleClientId]);

  const handleGsiCallback = async (response) => {
    if (!response?.credential) {
      onError?.(new Error("No credential received from Google"));
      return;
    }

    setIsLoading(true);
    try {
      await onGoogleSuccess({ credential: response.credential });
    } catch (err) {
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If one-tap prompt was dismissed or blocked, fallback to dev modal or alert
            if (isDev && !googleClientId) {
              setShowDevModal(true);
            }
          }
        });
        return;
      } catch (e) {
        console.warn("Google prompt error, falling back:", e);
      }
    }

    // If no client ID configured yet or local testing
    setShowDevModal(true);
  };

  const handleDevSubmit = async (e) => {
    e.preventDefault();
    if (!devEmail.trim()) return;

    setIsLoading(true);
    try {
      await onGoogleSuccess({
        devUser: {
          email: devEmail.trim().toLowerCase(),
          name: devName.trim() || devEmail.split("@")[0],
        },
      });
      setShowDevModal(false);
    } catch (err) {
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPreset = async (presetEmail, presetName) => {
    setIsLoading(true);
    try {
      await onGoogleSuccess({
        devUser: {
          email: presetEmail,
          name: presetName,
        },
      });
      setShowDevModal(false);
    } catch (err) {
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
        ) : (
          <div className="group-hover:scale-105 transition-transform shrink-0">
            <GoogleLogo />
          </div>
        )}
        <span>{text}</span>
      </button>

      {/* Local Dev Google Sign-In Modal (Active when VITE_GOOGLE_CLIENT_ID is not configured) */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-[var(--border-color)] shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                <GoogleLogo />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Localhost Google Sign-In
                </h3>
                <p className="text-[11px] text-slate-500">
                  {googleClientId
                    ? "Direct OAuth or Local Test"
                    : "Simulate Google OAuth locally"}
                </p>
              </div>
            </div>

            {!googleClientId && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  No <code>VITE_GOOGLE_CLIENT_ID</code> found in <code>.env</code>. You can test OAuth registration right now with any email below.
                </span>
              </div>
            )}

            {/* Quick One-Click Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Quick Test Accounts
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickPreset("arjun.sharma@makaut.edu", "Arjun Sharma")}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-[var(--border-color)] text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-bold">Arjun Sharma</div>
                    <div className="text-[10px] text-slate-500 font-mono">arjun.sharma@makaut.edu</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("priya.das@gmail.com", "Priya Das")}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-[var(--border-color)] text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-bold">Priya Das</div>
                    <div className="text-[10px] text-slate-500 font-mono">priya.das@gmail.com</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Custom Email Form */}
            <form onSubmit={handleDevSubmit} className="space-y-2 pt-2 border-t border-[var(--border-color)]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Or enter custom Google account
              </span>
              <input
                type="text"
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                placeholder="Full Name (e.g. Rahul Sen)"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-[var(--border-color)] text-slate-900 focus:outline-none focus:border-[var(--color-primary)]"
              />
              <input
                type="email"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                placeholder="Google Email (e.g. rahul@gmail.com)"
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-[var(--border-color)] text-slate-900 focus:outline-none focus:border-[var(--color-primary)]"
              />
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-1/2"
                  onClick={() => setShowDevModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isLoading}
                  className="w-1/2"
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleSignInButton;
