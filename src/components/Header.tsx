"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function Header() {
  const { user, logout, switchUser } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl font-bold text-scarlet-600">
          Scarlet Paws
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-stone-600 hover:text-bark">
            Home
          </Link>
          <Link href="/shelters" className="text-sm font-medium text-stone-600 hover:text-bark">
            Shelters & Rescues
          </Link>
          <Link href="/report" className="text-sm font-medium text-stone-600 hover:text-bark">
            Report a Cat
          </Link>
          {user?.role === "shelter" && (
            <Link href="/rescues" className="text-sm font-medium text-stone-600 hover:text-bark">
              Rescues
            </Link>
          )}
          <Link href="/membership" className="text-sm font-medium text-scarlet-600 hover:text-bark">
            Membership
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-500">
                {user.name}
                {user.role === "shelter" && (
                  <span className="ml-1 rounded bg-sage/20 px-1.5 py-0.5 text-xs text-sage">
                    Shelter
                  </span>
                )}
              </span>
              <select
                className="rounded border border-stone-300 bg-white px-2 py-1 text-xs"
                value={user.id}
                onChange={(e) => switchUser(e.target.value)}
              >
                <option value="demo">Demo (Public)</option>
                <option value="shelter1">Demo (Shelter)</option>
              </select>
              <button
                type="button"
                onClick={logout}
                className="text-sm text-stone-500 hover:text-bark"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
