import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import SuccessModal from "../components/SuccessModal.jsx";

function Breadcrumb() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-6 text-sm text-neutral-500">
      <Link to="/" className="hover:text-amber-500">
        Home
      </Link>{" "}
      / <span className="text-neutral-700">Contact Us</span>
    </div>
  );
}

const CONTACT_INFO = [
  {
    icon: Phone,
    text: "+91 94890 23450",
  },
  {
    icon: Mail,
    text: "ym@ymautomation.com",
  },
  {
    icon: MapPin,
    text: "No. 2/395-3, SF No 240/2, Idigarai Road, NGGO Colony Post, Sengalipalayam, Coimbatore – 641022.",
  },
];

function GetInTouch() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-neutral-900">Get in touch</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
        Please fill out the form below and we will get back to you as soon as
        possible.
      </p>

      <div className="mt-6 space-y-4">
        {CONTACT_INFO.map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-black">
              <Icon size={16} />
            </div>
            <p className="mt-1.5 text-sm text-neutral-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { submitContact } from "../api.js";

function ContactForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await submitContact(form);
      onSubmitted();
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      alert(err.message || "Failed to submit message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-neutral-200 p-6 shadow-sm"
    >
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter Your Name*"
          className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 outline-none transition focus:border-amber-400"
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone*"
          className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 outline-none transition focus:border-amber-400"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email*"
          className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 outline-none transition focus:border-amber-400"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          rows={4}
          className="w-full resize-none rounded-md border border-neutral-300 px-4 py-3 text-sm text-neutral-700 placeholder-neutral-400 outline-none transition focus:border-amber-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-md bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

function MapSection() {
  return (
    <div className="mt-10 h-80 w-full overflow-hidden rounded-xl border border-neutral-200">
      <iframe
        title="YM Automation Pvt Ltd location"
        src="https://maps.google.com/maps?q=11.099058,76.9536282&z=16&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Breadcrumb />
      <section className="mx-auto max-w-7xl px-6 py-6">
        <h1 className="text-3xl font-bold text-neutral-900">Contact Us</h1>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
          <GetInTouch />
          <ContactForm onSubmitted={() => setSubmitted(true)} />
        </div>

        <MapSection />
      </section>

      {submitted && (
        <SuccessModal
          title="Message Sent Successfully!"
          message="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          onClose={() => setSubmitted(false)}
        />
      )}
    </>
  );
}
