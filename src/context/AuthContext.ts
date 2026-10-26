import { createContext, useContext } from "react";
import type { User, Session } from "@supabase/supabase-js";
import type { Account } from "../lib/esportsApiClient";

export type Profile = NonNullable<Account["profile"]>;

export type UserRole = "member" | "admin";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
