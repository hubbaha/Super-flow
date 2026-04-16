"use client";

import { FormEvent, useState } from "react";
import { createInquiry } from "@/lib/api";

export function InquiryForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);
      setMessage("");
      await createInquiry({
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        message: String(formData.get("message")),
        buyerType: String(formData.get("buyerType")),
      });
      event.currentTarget.reset();
      setMessage("Inquiry submitted successfully. Our team will contact you shortly.");
    } catch {
      setMessage("Unable to submit inquiry right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-xl font-semibold text-slate-900">Request a Quote</h3>
      <p className="text-sm text-slate-600">Share your requirement and our technical team will contact you.</p>
      <input
        name="name"
        placeholder="Full Name"
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <input
        name="email"
        type="email"
        placeholder="Business Email"
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <select
        name="buyerType"
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Select buyer type</option>
        <option value="Distributor">Distributor</option>
        <option value="Contractor">Contractor</option>
        <option value="Manufacturer">Manufacturer</option>
        <option value="Other">Other</option>
      </select>
      <textarea
        name="message"
        placeholder="Message"
        rows={4}
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <button
        disabled={loading}
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Inquiry"}
      </button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}
