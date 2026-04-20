"use client";

import { FormEvent, useState } from "react";
import { createInquiry } from "@/lib/api";

export function InquiryForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);
      setMessage(null);
      await createInquiry({
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        message: String(formData.get("message")),
        buyerType: String(formData.get("buyerType")),
      });
      event.currentTarget.reset();
      setMessage({
        text: "Inquiry submitted successfully. Our team will contact you shortly.",
        type: "success",
      });
    } catch {
      setMessage({ text: "Unable to submit inquiry right now. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100 hover:border-slate-300";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100"
    >
      {/* Header */}
      <div className="mb-1">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
          Request a Quote
        </span>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Share your requirement and our technical team will contact you within 24 hours.
        </p>
      </div>

      {/* Name & Email side by side on larger screens */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Full Name
          </label>
          <input name="name" placeholder="John Smith" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Business Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="john@company.com"
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Buyer Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Buyer Type
        </label>
        <select name="buyerType" required className={inputClass}>
          <option value="">Select buyer type</option>
          <option value="Distributor">Distributor</option>
          <option value="Contractor">Contractor</option>
          <option value="Manufacturer">Manufacturer</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Message
        </label>
        <textarea
          name="message"
          placeholder="Tell us about your requirements…"
          rows={4}
          required
          className={inputClass}
        />
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        type="submit"
        className="group relative mt-1 w-full overflow-hidden rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-60"
      >
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Submitting…
            </>
          ) : (
            <>
              Submit Inquiry
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
      </button>

      {/* Status message */}
      {message && (
        <div
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {message.text}
        </div>
      )}
    </form>
  );
}