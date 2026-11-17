import type { FieldDef, FormValues } from "./fieldTypes";
import type { FormSection } from "./SettingsForm";

/** Ambil hanya kolom yang ada di konfigurasi field (buang id, updated_at, dll.). */
export function pickValues(row: FormValues, sections: FormSection[]): FormValues {
  const out: FormValues = {};
  for (const section of sections) {
    for (const field of section.fields) out[field.name] = row[field.name] ?? null;
  }
  return out;
}

export const profileSections: FormSection[] = [
  {
    title: "Identitas",
    description: "Tampil di header (logo bulat + nama) dan footer.",
    fields: [
      { type: "text", name: "name", label: "Nama lengkap", required: true },
      { type: "text", name: "initials", label: "Inisial", hint: "Maksimal 4 huruf, tampil di logo bulat.", required: true },
      { type: "text", name: "role", label: "Role / profesi", hint: "Tampil di kanan header, mis. UI UX / Web Designer.", required: true },
    ],
  },
  {
    title: "Teks Hero",
    fields: [
      { type: "text", name: "hero_small_word", label: "Kata kecil (italic)", hint: "Di atas kata besar, mis. Creative." },
      { type: "text", name: "hero_big_word", label: "Kata besar", hint: "Judul raksasa, mis. PORTFOLIO.", required: true },
      { type: "text", name: "headline", label: "Headline", required: true },
      { type: "textarea", name: "description", label: "Deskripsi singkat", rows: 5 },
    ],
  },
  {
    title: "Gambar",
    fields: [
      {
        type: "image",
        name: "hero_image_url",
        label: "Foto hero",
        hint: "Disarankan PNG/WebP tanpa background (remove.bg) agar efek lingkaran terlihat.",
        folder: "hero",
        aspect: "portrait",
        transparent: true,
      },
      {
        type: "image",
        name: "signature_url",
        label: "Gambar tanda tangan (opsional)",
        hint: "Jika kosong, dipakai teks tanda tangan di bawah.",
        folder: "hero",
        aspect: "video",
        transparent: true,
      },
      { type: "text", name: "signature_text", label: "Teks tanda tangan", hint: "Ditulis dengan font tulisan tangan." },
    ],
  },
  {
    title: "Badge berputar",
    fields: [
      { type: "toggle", name: "badge_enabled", label: "Tampilkan badge", hint: "Lingkaran berputar di dekat foto hero." },
      { type: "text", name: "badge_text", label: "Teks badge", hint: "Mis. Available for freelance." },
    ],
  },
  {
    title: "Footer",
    fields: [{ type: "text", name: "tagline", label: "Tagline footer" }],
  },
];

export const sectionSections: FormSection[] = [
  {
    title: "Tampilkan / sembunyikan section",
    description: "Section yang dimatikan tidak tampil di halaman utama.",
    fields: [
      { type: "toggle", name: "show_stats", label: "Statistik (angka highlight)" },
      { type: "toggle", name: "show_work", label: "Selected Work" },
      { type: "toggle", name: "show_expertise", label: "Expertise" },
      { type: "toggle", name: "show_process", label: "Process" },
      { type: "toggle", name: "show_certificates", label: "Sertifikat & Award" },
      { type: "toggle", name: "show_testimonials", label: "Testimonial" },
    ],
  },
  {
    title: "Selected Work",
    fields: [
      { type: "text", name: "work_eyebrow", label: "Label kecil" },
      { type: "text", name: "work_title", label: "Judul section", required: true },
      { type: "text", name: "work_link_label", label: "Teks link ke semua project", hint: "Kosongkan untuk menyembunyikan link." },
    ],
  },
  {
    title: "Expertise",
    fields: [
      { type: "text", name: "expertise_eyebrow", label: "Label kecil" },
      { type: "text", name: "expertise_title", label: "Judul section", required: true },
      { type: "text", name: "tools_title", label: "Judul daftar tools" },
      { type: "tags", name: "tools", label: "Daftar tools", hint: "Ketik nama tool lalu Enter. Kosongkan semua untuk menyembunyikan." },
    ],
  },
  {
    title: "Process",
    fields: [
      { type: "text", name: "process_eyebrow", label: "Label kecil" },
      { type: "text", name: "process_title", label: "Judul section", required: true },
    ],
  },
  {
    title: "Sertifikat & Award",
    fields: [
      { type: "text", name: "certificates_eyebrow", label: "Label kecil" },
      { type: "text", name: "certificates_title", label: "Judul section", required: true },
    ],
  },
];

export const contactSections: FormSection[] = [
  {
    title: "Ajakan (CTA)",
    fields: [
      { type: "text", name: "contact_eyebrow", label: "Label kecil" },
      { type: "text", name: "cta_title", label: "Judul CTA", required: true },
      { type: "textarea", name: "cta_text", label: "Teks ajakan", rows: 3 },
      { type: "text", name: "cta_button_label", label: "Label tombol", hint: "Kosongkan untuk menyembunyikan tombol." },
      {
        type: "url",
        name: "cta_button_link",
        label: "Link tombol",
        hint: "WhatsApp: https://wa.me/628123456789 · Email: mailto:nama@email.com",
        placeholder: "https://wa.me/628123456789",
      },
    ],
  },
  {
    title: "Info kontak",
    fields: [
      { type: "email", name: "email", label: "Email" },
      { type: "tel", name: "phone", label: "Telepon" },
      { type: "text", name: "address", label: "Alamat / lokasi" },
      { type: "text", name: "website", label: "Website", placeholder: "namakamu.com" },
    ],
  },
  {
    title: "Sosial media",
    description: "Tampil di bagian kontak dan footer.",
    fields: [{ type: "socials", name: "socials", label: "Link sosial media" }],
  },
];

export const seoSections: FormSection[] = [
  {
    title: "SEO",
    fields: [
      { type: "text", name: "seo_title", label: "Meta title", hint: "Judul di tab browser & hasil Google (maks ±60 karakter)." },
      { type: "textarea", name: "seo_description", label: "Meta description", rows: 3, hint: "Ringkasan di hasil Google (maks ±160 karakter)." },
      { type: "image", name: "og_image_url", label: "OG image", hint: "Gambar pratinjau saat link dibagikan (disarankan 1200×630).", folder: "seo", aspect: "video" },
    ],
  },
  {
    title: "Tampilan & analitik",
    fields: [
      { type: "image", name: "favicon_url", label: "Favicon", hint: "Ikon kecil di tab browser (disarankan persegi).", folder: "seo", aspect: "square", transparent: true },
      { type: "color", name: "accent_color", label: "Warna aksen (opsional)", hint: "Mengganti warna lingkaran di belakang foto hero." },
      { type: "text", name: "ga_id", label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX" },
    ],
  },
];

const iconTitleDesc = (titleLabel: string): FieldDef[] => [
  { type: "icon", name: "icon", label: "Ikon" },
  { type: "text", name: "title", label: titleLabel, required: true },
  { type: "textarea", name: "description", label: "Deskripsi singkat", rows: 3 },
];

export const expertiseFields: FieldDef[] = iconTitleDesc("Judul");
export const processFields: FieldDef[] = iconTitleDesc("Judul langkah");

export const testimonialFields: FieldDef[] = [
  { type: "textarea", name: "quote", label: "Kutipan", rows: 4, required: true },
  { type: "text", name: "name", label: "Nama", required: true },
  { type: "text", name: "position", label: "Jabatan / perusahaan" },
  { type: "image", name: "photo_url", label: "Foto (opsional)", folder: "testimonials", aspect: "portrait", hint: "Ditampilkan hitam-putih di website." },
  { type: "toggle", name: "is_visible", label: "Tampilkan di website" },
];

export const statFields: FieldDef[] = [
  { type: "text", name: "value", label: "Angka", hint: "Mis. 3+, 18.5K, +280%", required: true },
  { type: "text", name: "label", label: "Keterangan", required: true },
];

export const certificateFields: FieldDef[] = [
  { type: "text", name: "title", label: "Judul sertifikat", required: true },
  { type: "text", name: "issuer", label: "Penerbit" },
  { type: "image", name: "image_url", label: "Gambar sertifikat", folder: "certificates", aspect: "video", required: true },
  { type: "toggle", name: "is_highlight", label: "Sorot sebagai award utama", hint: "Diberi garis tegas di website." },
];

export const categoryFields: FieldDef[] = [
  { type: "text", name: "name", label: "Nama kategori", required: true },
  { type: "text", name: "slug", label: "Slug", hint: "Dipakai di URL filter. Kosongkan untuk dibuat otomatis dari nama." },
];
