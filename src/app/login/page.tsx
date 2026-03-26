"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-bark">Log in</h1>
      <p className="mt-2 text-sm text-stone-600">
        Demo: use <code className="rounded bg-stone-200 px-1">demo@example.com</code> or{" "}
        <code className="rounded bg-stone-200 px-1">shelter@nbrescue.org</code> (shelter).
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-bark">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-bark">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Log in
        </button>
      </form>
      <Link href="/" className="mt-6 block text-center text-sm text-stone-500 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
