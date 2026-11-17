import { z } from "zod";
import { imageUrl, linkText, optionalText, requiredText, stringList } from "./common";

export const profileSettingsSchema = z.object({
  name: requiredText("Nama", 120),
  initials: requiredText("Inisial", 4),
  role: requiredText("Role", 120),
  hero_small_word: optionalText("Kata kecil", 40),
  hero_big_word: requiredText("Kata besar", 40),
  headline: requiredText("Headline", 200),
  description: optionalText("Deskripsi", 800),
  hero_image_url: imageUrl,
  signature_url: imageUrl,
  signature_text: optionalText("Teks tanda tangan", 60),
  badge_enabled: z.boolean(),
  badge_text: optionalText("Teks badge", 40),
  tagline: optionalText("Tagline footer", 200),
});

export const sectionSettingsSchema = z.object({
  show_stats: z.boolean(),
  show_work: z.boolean(),
  show_expertise: z.boolean(),
  show_process: z.boolean(),
  show_certificates: z.boolean(),
  show_testimonials: z.boolean(),
  work_eyebrow: optionalText("Label kecil", 60),
  work_title: requiredText("Judul", 80),
  work_link_label: optionalText("Teks link", 60),
  expertise_eyebrow: optionalText("Label kecil", 60),
  expertise_title: requiredText("Judul", 80),
  tools_title: optionalText("Judul tools", 60),
  tools: stringList,
  process_eyebrow: optionalText("Label kecil", 60),
  process_title: requiredText("Judul", 80),
  certificates_eyebrow: optionalText("Label kecil", 60),
  certificates_title: requiredText("Judul", 80),
});

export const contactSettingsSchema = z.object({
  contact_eyebrow: optionalText("Label kecil", 60),
  cta_title: requiredText("Judul CTA", 80),
  cta_text: optionalText("Teks ajakan", 500),
  cta_button_label: optionalText("Label tombol", 40),
  cta_button_link: linkText("Link tombol"),
  email: z.union([z.literal(""), z.email("Format email tidak valid")]).default(""),
  phone: optionalText("Telepon", 40),
  address: optionalText("Alamat", 200),
  website: optionalText("Website", 200),
  socials: z
    .array(
      z.object({
        label: z.string().trim().max(40),
        url: z.string().trim().max(500),
      }),
    )
    .max(12, "Maksimal 12 sosial media")
    .transform((rows) => rows.filter((r) => r.label !== "" || r.url !== ""))
    .superRefine((rows, ctx) => {
      for (const r of rows) {
        if (r.label === "" || !/^https?:\/\/\S+$/i.test(r.url)) {
          ctx.addIssue({
            code: "custom",
            message: "Setiap sosial media butuh nama dan URL yang diawali https://",
          });
          return;
        }
      }
    }),
});

export const seoSettingsSchema = z.object({
  seo_title: optionalText("Meta title", 70),
  seo_description: optionalText("Meta description", 300),
  og_image_url: imageUrl,
  favicon_url: imageUrl,
  accent_color: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^#[0-9a-fA-F]{6}$/.test(v), "Warna harus berformat #RRGGBB"),
  ga_id: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^(G-[A-Z0-9]{4,}|UA-\d+-\d+)$/.test(v), "ID Google Analytics tidak valid (contoh: G-ABC123XYZ)"),
});
