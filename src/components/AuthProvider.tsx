"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { User } from "@/types";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: User[] = [
  {
    id: "demo",
    email: "demo@example.com",
    name: "Demo User",
    role: "public",
    membership: "none",
  },
  {
    id: "shelter1",
    email: "shelter@nbrescue.org",
    name: "NB Rescue",
    role: "shelter",
    membership: "yearly",
    shelterId: "nb-rescue",
    shelterName: "New Brunswick Cat Rescue",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_USERS[0]);

  const login = useCallback((email: string, _password: string) => {
    const u = DEMO_USERS.find((x) => x.email === email) ?? DEMO_USERS[0];
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchUser = useCallback((userId: string) => {
    const u = DEMO_USERS.find((x) => x.id === userId) ?? DEMO_USERS[0];
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
