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
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-slate-900">Request A Quote</h3>
      <input name="name" placeholder="Name" required className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      <input name="email" type="email" placeholder="Email" required className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      <select name="buyerType" required className="w-full rounded border border-slate-300 px-3 py-2 text-sm">
        <option value="">Select buyer type</option>
        <option value="Distributor">Distributor</option>
        <option value="Contractor">Contractor</option>
        <option value="Manufacturer">Manufacturer</option>
        <option value="Other">Other</option>
      </select>
      <textarea name="message" placeholder="Message" rows={4} required className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      <button
        disabled={loading}
        type="submit"
        className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Inquiry"}
      </button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}
