import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
}

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

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single<Profile>();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }

  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState<UserRole | null>(null);
  const [authorizationError, setAuthorizationError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let revision = 0;

    const loadSession = async (newSession: Session | null) => {
      const request = ++revision;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setProfile(null);
      setRole(null);
      setAuthorizationError(null);
      setLoading(true);

      try {
        if (newSession?.user) {
          const [userProfile, result] = await Promise.all([
            fetchProfile(newSession.user.id),
            supabase.from("user_roles").select("role")
              .eq("user_id", newSession.user.id).maybeSingle(),
          ]);
          // Discard requests from a previous account, sign-out, or unmounted provider.
          if (!active || request !== revision) return;
          setProfile(userProfile);
          if (result.error) throw result.error;
          const value: unknown = result.data?.role;
          if (value !== undefined && value !== "member" && value !== "admin") {
            throw new Error("Unknown user role");
          }
          // No explicit assignment means ordinary member access.
          setRole(value === "admin" ? "admin" : "member");
        }
      } catch (error) {
        if (!active || request !== revision) return;
        console.error("Unable to load account permissions:", error);
        setRole(null);
        setAuthorizationError("Unable to verify your permissions. Please reload and try again.");
      } finally {
        if (active && request === revision) setLoading(false);
      }
    };

    // INITIAL_SESSION handles startup. Keep the callback synchronous and defer
    // database calls until the auth callback has released its internal lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        const eventRevision = ++revision;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setProfile(null);
        setRole(null);
        setLoading(true);
        window.setTimeout(() => {
          if (active && eventRevision === revision) void loadSession(newSession);
        }, 0);
      }
    );

    return () => {
      active = false;
      ++revision;
      subscription.unsubscribe();
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
