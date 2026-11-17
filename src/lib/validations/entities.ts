import { z } from "zod";
import { iconMap } from "@/lib/utils/icons";
import { slugify } from "@/lib/utils/slugify";
import { imageUrl, linkText, optionalText, requiredImageUrl, requiredText, stringList } from "./common";

const iconNames = Object.keys(iconMap);
const icon = z.string().refine((v) => iconNames.includes(v), "Pilih ikon dari daftar");

export const expertiseSchema = z.object({
  icon,
  title: requiredText("Judul", 80),
  description: optionalText("Deskripsi", 300),
});

export const processStepSchema = expertiseSchema;

export const testimonialSchema = z.object({
  quote: requiredText("Kutipan", 600),
  name: requiredText("Nama", 100),
  position: optionalText("Jabatan", 120),
  photo_url: imageUrl,
  is_visible: z.boolean(),
});

export const statSchema = z.object({
  value: requiredText("Angka", 20),
  label: requiredText("Keterangan", 80),
});

export const certificateSchema = z.object({
  title: requiredText("Judul", 150),
  issuer: optionalText("Penerbit", 100),
  image_url: requiredImageUrl("Gambar sertifikat"),
  is_highlight: z.boolean(),
});

export const categorySchema = z
  .object({
    name: requiredText("Nama kategori", 60),
    slug: optionalText("Slug", 80),
  })
  .transform((v) => ({ ...v, slug: slugify(v.slug || v.name) }))
  .refine((v) => v.slug !== "", { message: "Slug tidak valid", path: ["slug"] });

export const projectSchema = z.object({
  title: requiredText("Judul", 150),
  slug: requiredText("Slug", 80).refine(
    (v) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v),
    "Slug hanya boleh huruf kecil, angka, dan tanda hubung",
  ),
  category_id: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || z.uuid().safeParse(v).success, "Kategori tidak valid"),
  summary: optionalText("Ringkasan", 500),
  content_md: optionalText("Deskripsi", 20000),
  client: optionalText("Klien", 150),
  year: z
    .number({ error: "Tahun harus berupa angka" })
    .int("Tahun harus bilangan bulat")
    .min(1990, "Tahun minimal 1990")
    .max(2100, "Tahun maksimal 2100")
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  period: optionalText("Periode", 60),
  role: optionalText("Role", 120),
  tools: stringList,
  cover_url: imageUrl,
  cover_width: z.number().int().positive().default(1000),
  cover_height: z.number().int().positive().default(750),
  live_url: linkText("Link live").transform((v) => (v === "" ? null : v)),
  status: z.enum(["draft", "published"]),
  is_featured: z.boolean(),
  gallery: z
    .array(
      z.object({
        id: z.string().optional(),
        image_url: requiredImageUrl("Gambar galeri"),
        alt: z.string().trim().max(200).default(""),
        width: z.number().int().positive().default(1000),
        height: z.number().int().positive().default(750),
      }),
    )
    .max(40, "Maksimal 40 gambar galeri"),
});

export type ProjectInput = z.output<typeof projectSchema>;
