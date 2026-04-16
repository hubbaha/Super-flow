import { InquiryForm } from "@/components/InquiryForm";

export default function ContactUsPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-900">Contact Us</h1>
        <p className="mt-3 text-slate-600">
          Reach Super flow for pricing, technical support, and product availability.
        </p>
        <div className="mt-8 space-y-3 text-sm text-slate-700">
          <p>Email: info@superflow.com</p>
          <p>Phone: +1 (204) 000-0000</p>
          <p>Address: 3340 St Marys Rd, Manitoba</p>
        </div>
      </div>
      <InquiryForm />
    </section>
  );
}
