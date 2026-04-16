"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema } from "@/src/server/validators/auth";

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrors({});
    setGeneralError("");

    // ✅ Frontend validation (Zod)
    const parsed = loginSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // ✅ Handle backend field errors (if any)
        if (data?.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError(data?.error || "Login failed");
        }
        return;
      }

      router.push("/feed");
      router.refresh();
    } catch {
      setGeneralError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {/* Email */}
      <div className="field">
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          placeholder="Enter your email"
        />
        {errors.email && (
          <p style={{ color: "#dc2626" }}>{errors.email[0]}</p>
        )}
      </div>

      {/* Password */}
      <div className="field">
        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          placeholder="Enter your password"
        />
        {errors.password && (
          <p style={{ color: "#dc2626" }}>{errors.password[0]}</p>
        )}
      </div>

      {/* General Error */}
      {generalError && (
        <p style={{ color: "#dc2626", margin: 0 }}>{generalError}</p>
      )}

      {/* Submit */}
      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login now"}
      </button>

      {/* Redirect */}
      <p style={{ margin: 0, color: "#64748b" }}>
        Don&apos;t have an account?{" "}
        <Link className="secondary-link" href="/register">
          Create New Account
        </Link>
      </p>
    </form>
  );
}