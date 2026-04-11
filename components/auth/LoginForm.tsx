//src/components/auth/LoginForm.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/feed");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <div className="field">
        <label>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="field">
        <label>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      {error ? <p style={{ color: "#dc2626", margin: 0 }}>{error}</p> : null}

      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login now"}
      </button>

      <p style={{ margin: 0, color: "#64748b" }}>
        Don&apos;t have an account?{" "}
        <Link className="secondary-link" href="/register">
          Create New Account
        </Link>
      </p>
    </form>
  );
}