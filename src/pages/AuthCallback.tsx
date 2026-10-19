import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const oauthError = params.get("error_description") ?? hash.get("error_description")
      ?? params.get("error") ?? hash.get("error");

    if (oauthError) {
      setError(oauthError);
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    // The browser Supabase client processes OAuth tokens before getSession resolves.
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (!active) return;
        if (sessionError) {
          setError(sessionError.message);
        } else if (session) {
          navigate("/home", { replace: true });
        } else {
          setError("No session was created. Please return to login and try again.");
        }
      } catch {
        if (active) setError("Unable to complete sign-in. Please try again.");
      }
    };

    void handleCallback();
    return () => { active = false; };
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md glass-panel rounded-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="font-outfit text-xl font-bold text-white">
            Sign-in Failed
          </h2>
          <p className="mt-2 text-sm text-gray-400">{error}</p>
          <button
            onClick={() => navigate("/auth", { replace: true })}
            className="mt-6 w-full rounded-lg border border-white/10 py-3 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:border-tech-gold hover:text-tech-gold"
          >
            BACK TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-tech-gold border-t-transparent" />
        <p className="text-sm text-gray-400">Completing sign-in...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
