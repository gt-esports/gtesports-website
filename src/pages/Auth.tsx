import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Tab = "login" | "signup";

function Auth() {
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/home", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-tech-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Tab Toggle */}
        <div className="mb-8 flex rounded-lg border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 rounded-md py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
              activeTab === "login"
                ? "bg-tech-gold text-deep-space"
                : "text-gray-400 hover:text-white"
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 rounded-md py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
              activeTab === "signup"
                ? "bg-tech-gold text-deep-space"
                : "text-gray-400 hover:text-white"
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Form Card */}
        <div className="glass-panel rounded-2xl p-8">
          {activeTab === "login" ? (
            <LoginForm
              signIn={signIn}
              onSwitchToSignUp={() => setActiveTab("signup")}
            />
          ) : (
            <SignUpForm
              signUp={signUp}
              onSwitchToLogin={() => setActiveTab("login")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login Form
// ---------------------------------------------------------------------------

interface LoginFormProps {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  onSwitchToSignUp: () => void;
}

function LoginForm({ signIn, onSwitchToSignUp }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate("/home", { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-outfit text-2xl font-bold text-white">
          Welcome Back
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Sign in to your GT Esports account
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-tech-gold focus:ring-1 focus:ring-tech-gold"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-tech-gold focus:ring-1 focus:ring-tech-gold"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-tech-gold py-3 text-sm font-bold tracking-wide text-deep-space transition-all duration-300 hover:bg-gold-glow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "SIGNING IN..." : "SIGN IN"}
      </button>

      <p className="text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-medium text-tech-gold hover:underline"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Sign Up Form
// ---------------------------------------------------------------------------

interface SignUpFormProps {
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>;
  onSwitchToLogin: () => void;
}

function SignUpForm({ signUp, onSwitchToLogin }: SignUpFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await signUp(email.trim(), password, fullName.trim());
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-tech-gold/30 bg-tech-gold/10">
          <svg
            className="h-8 w-8 text-tech-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="font-outfit text-2xl font-bold text-white">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-white">{email}</span>. Click the
            link to verify your account, then come back to log in.
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full rounded-lg border border-white/10 py-3 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:border-tech-gold hover:text-tech-gold"
        >
          BACK TO LOGIN
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-outfit text-2xl font-bold text-white">
          Create Account
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Join the GT Esports community
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="signup-name"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-tech-gold focus:ring-1 focus:ring-tech-gold"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-tech-gold focus:ring-1 focus:ring-tech-gold"
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-tech-gold focus:ring-1 focus:ring-tech-gold"
          />
        </div>

        <div>
          <label
            htmlFor="signup-confirm"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Confirm Password
          </label>
          <input
            id="signup-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-tech-gold focus:ring-1 focus:ring-tech-gold"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-tech-gold py-3 text-sm font-bold tracking-wide text-deep-space transition-all duration-300 hover:bg-gold-glow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
      </button>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-tech-gold hover:underline"
        >
          Log in
        </button>
      </p>
    </form>
  );
}

export default Auth;
