"use client";

import { useActionState, useState } from "react";
import { submitContactMessage, type ContactFormState } from "@/lib/actions/messages";

const inputClass =
  "mt-2 w-full rounded-sm border border-line bg-transparent px-4 py-3 text-base outline-none transition-colors focus:border-charcoal";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactFormState, FormData>(
    submitContactMessage,
    null,
  );
  // Dikontrol agar isian tidak hilang saat form di-reset setelah validasi gagal.
  const [fields, setFields] = useState({ name: "", email: "", body: "" });
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  if (state?.ok) {
    return (
      <p role="status" className="mt-10 rounded-sm border border-charcoal px-5 py-4">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="mt-10 space-y-5" noValidate>
      <p className="label-caps text-muted">Or send me a message</p>

      {/* Honeypot: disembunyikan dari pengguna, bot akan mengisinya */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          Name
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
          />
          {errors.name ? <span className="mt-1 block text-sm text-[#a33]">{errors.name}</span> : null}
        </label>
        <label className="block text-sm">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={fields.email}
            onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
            aria-invalid={Boolean(errors.email)}
            className={inputClass}
          />
          {errors.email ? <span className="mt-1 block text-sm text-[#a33]">{errors.email}</span> : null}
        </label>
      </div>
      <label className="block text-sm">
        Message
        <textarea
          name="body"
          rows={5}
          required
          value={fields.body}
          onChange={(e) => setFields((f) => ({ ...f, body: e.target.value }))}
          aria-invalid={Boolean(errors.body)}
          className={inputClass}
        />
        {errors.body ? <span className="mt-1 block text-sm text-[#a33]">{errors.body}</span> : null}
      </label>

      {state && !state.ok && !state.fieldErrors ? (
        <p role="alert" className="text-sm text-[#a33]">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="label-caps inline-flex items-center gap-2 rounded-sm bg-charcoal px-7 py-4 text-cream transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
