"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    try {
      const email = String(form.get("email"));
      const password = String(form.get("password"));
      const data = await adminLogin(email, password);
      localStorage.setItem("adminToken", data.token);
      router.push("/admin");
    } catch {
      setError("Invalid credentials.");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded border border-slate-300 px-3 py-2" name="email" type="email" placeholder="Email" required />
        <input className="w-full rounded border border-slate-300 px-3 py-2" name="password" type="password" placeholder="Password" required />
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Login
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </section>
  );
}
