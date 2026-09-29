import React, { useEffect, useState, useRef } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import Button from "../common/Button";

// Default client ID fallback so production builds never fail even if hosting env variable is omitted
const DEFAULT_GOOGLE_CLIENT_ID =
  "113387745578-39rrp3vibarq7e6m589knqnqp8vcipgq.apps.googleusercontent.com";

const GoogleLogo = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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

const GoogleSignInButton = ({
  onGoogleSuccess,
  onError,
  text = "Continue with Google",
}) => {
  const googleBtnContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devEmail, setDevEmail] = useState("");
  const [devName, setDevName] = useState("");

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    let isMounted = true;

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
        if (isMounted) setIsLoading(false);
      }
    };

    const initializeGsi = () => {
      if (!window.google?.accounts?.id || !googleClientId) return;

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGsiCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: text.toLowerCase().includes("sign up")
              ? "signup_with"
              : "continue_with",
            shape: "pill",
            logo_alignment: "center",
            width: 340,
          });
        }

        if (isMounted) setGsiLoaded(true);

        // Prompt Google One Tap if available in browser
        window.google.accounts.id.prompt();
      } catch (err) {
        console.error("Failed to render Google Sign-In button:", err);
      }
    };

    if (window.google?.accounts?.id) {
      initializeGsi();
    } else {
      const existingScript = document.getElementById("google-gsi-client");
      if (existingScript) {
        existingScript.addEventListener("load", initializeGsi);
      } else {
        const script = document.createElement("script");
        script.id = "google-gsi-client";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGsi;
        document.body.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [googleClientId, text, onError, onGoogleSuccess]);

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
    <div className="w-full flex flex-col items-center justify-center">
      {isLoading && (
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 py-3 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
          <span>Connecting to your Google Account...</span>
        </div>
      )}

      {/* Official Google Identity Services Button Container */}
      <div
        ref={googleBtnContainerRef}
        className={`w-full flex justify-center items-center min-h-[44px] ${
          isLoading ? "opacity-40 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* Fallback button shown only while Google script is downloading over network */}
      {!gsiLoaded && !isLoading && (
        <div className="w-full max-w-[340px] flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white text-slate-700 font-semibold text-sm border-2 border-slate-200 shadow-2xs">
          <GoogleLogo />
          <span>{text}</span>
        </div>
      )}

      {/* Development-only test accounts modal trigger */}
      {isDev && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setShowDevModal(true)}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
          >
            [Dev Only] Quick test profiles
          </button>
        </div>
      )}

      {/* Dev modal (ONLY reachable in development) */}
      {isDev && showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-[var(--border-color)] shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                <GoogleLogo />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Localhost Quick Test Profiles
                </h3>
                <p className="text-[11px] text-slate-500">
                  Instant login for local development
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
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

            <form onSubmit={handleDevSubmit} className="space-y-2 pt-2 border-t border-[var(--border-color)]">
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
    </div>
  );
};

export default GoogleSignInButton;
