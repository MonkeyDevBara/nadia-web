import { z } from "zod";

export function requiredText(label: string, max = 200) {
  return z
    .string({ error: `${label} wajib diisi` })
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(max, `${label} maksimal ${max} karakter`);
}

export function optionalText(label: string, max = 200) {
  return z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .default("");
}

const LINK_PATTERN = /^(https?:\/\/\S+|mailto:\S+|tel:\S+|\/\S*)$/i;
const URL_PATTERN = /^(https?:\/\/\S+|\/\S*)$/i;

/** Link tombol/sosial: kosong, http(s), mailto:, tel:, atau path relatif. */
export function linkText(label: string) {
  return z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || LINK_PATTERN.test(v), `${label} harus diawali https://, mailto:, tel:, atau /`)
    .default("");
}

/** URL gambar: kosong → null; selain itu http(s) atau path relatif. */
export const imageUrl = z
  .string()
  .trim()
  .max(1000)
  .nullable()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || URL_PATTERN.test(v), "URL gambar tidak valid");

export const requiredImageUrl = (label: string) =>
  z
    .string({ error: `${label} wajib diunggah` })
    .trim()
    .min(1, `${label} wajib diunggah`)
    .max(1000)
    .refine((v) => URL_PATTERN.test(v), "URL gambar tidak valid");

export const stringList = z.array(z.string().trim().min(1).max(60)).max(60).default([]);

/** Ubah ZodError menjadi { namaField: pesan } (hanya error pertama tiap field). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
