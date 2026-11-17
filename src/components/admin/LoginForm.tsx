"use client";

import { useActionState, useState } from "react";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";
import { login } from "@/lib/actions/auth";
import type { ActionResult } from "@/lib/actions/types";

export default function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(login, null);
  // Dikontrol agar email tidak hilang saat form di-reset setelah login gagal.
  const [email, setEmail] = useState("");
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={action} className="mt-6 space-y-4" noValidate>
      <FormField label="Email" htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </FormField>
      <FormField label="Password" htmlFor="password" error={errors.password}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </FormField>
      {state && !state.ok && !state.fieldErrors ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" loading={pending} className="w-full">
        Masuk
      </Button>
    </form>
  );
}
