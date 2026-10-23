import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { ACCESS_DENIED_EVENT, esportsApi } from "../lib/esportsApi";
import { ApiError, fetchAccount, type Account } from "../lib/esportsApiClient";
import { createAccountAuthorization } from "../lib/accountAuthorization";

type Profile = NonNullable<Account["profile"]>;

type UserRole = "member" | "admin";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  authorizationError: string | null;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signInWithDiscord: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState<UserRole | null>(null);
  const [authorizationError, setAuthorizationError] = useState<string | null>(null);

  useEffect(() => {
    const authorization = createAccountAuthorization<Session>({
      load: (newSession, signal) => fetchAccount(esportsApi, newSession, signal),
      reset: (newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setProfile(null);
        setRole(null);
        setAuthorizationError(null);
        setLoading(true);
      },
      authorize: (account) => {
        setProfile(account.profile);
        setRole(account.role);
      },
      fail: (error) => {
        setProfile(null);
        setRole(null);
        setAuthorizationError(error instanceof ApiError ? error.message : "Unable to verify your permissions. Please reload and try again.");
      },
      settle: () => setLoading(false),
    });
    const denied = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail: unknown = event.detail;
      if (typeof detail !== "object" || detail === null || !("userId" in detail) || typeof detail.userId !== "string") return;
      authorization.deny(detail.userId, new ApiError("forbidden", "Your access could not be verified. Reload the page or sign in again."));
    };
    window.addEventListener(ACCESS_DENIED_EVENT, denied);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => authorization.setSession(newSession)
    );
    return () => {
      authorization.dispose();
      subscription.unsubscribe();
      window.removeEventListener(ACCESS_DENIED_EVENT, denied);
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  };

  const signInWithDiscord = async (): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, role, isAdmin: !loading && role === "admin", authorizationError, signUp, signIn, signInWithDiscord, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
