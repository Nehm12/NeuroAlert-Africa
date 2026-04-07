"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi, type LoginResponse, type UserProfile } from "@/lib/api";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  role: string | null;
  institutionName: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    role: null,
    institutionName: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("na_token");
    const cachedUser = localStorage.getItem("na_user");
    if (token && cachedUser) {
      try {
        const user = JSON.parse(cachedUser) as UserProfile;
        setState({
          token,
          user,
          role: user.role,
          institutionName: user.institution?.name || null,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        localStorage.removeItem("na_token");
        localStorage.removeItem("na_user");
        setState(s => ({ ...s, isLoading: false }));
      }
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res: LoginResponse = await authApi.login(email, password);
    localStorage.setItem("na_token", res.access_token);

    // Fetch full profile
    const profile = await authApi.me();
    localStorage.setItem("na_user", JSON.stringify(profile));

    setState({
      token: res.access_token,
      user: profile,
      role: res.role,
      institutionName: res.institution_name,
      isLoading: false,
      isAuthenticated: true,
    });

    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("na_token");
    localStorage.removeItem("na_user");
    authApi.logout().catch(() => {});
    setState({
      user: null, token: null, role: null, institutionName: null,
      isLoading: false, isAuthenticated: false,
    });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
