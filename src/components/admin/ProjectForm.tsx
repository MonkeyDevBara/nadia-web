"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";
import { saveProject } from "@/lib/actions/projects";
import { useAdminForm } from "@/lib/hooks/useAdminForm";
import { slugify } from "@/lib/utils/slugify";
import type { Category, Project, ProjectImage } from "@/types/database";
import FieldRenderer from "./FieldRenderer";
import type { FieldDef, FormValues, GalleryItem } from "./fieldTypes";
import ImageUploader from "./ImageUploader";
import MultiImageUploader from "./MultiImageUploader";

type ProjectFormProps = {
  project: Project | null;
  images: ProjectImage[];
  categories: Category[];
};

const detailFields: FieldDef[] = [
  { type: "text", name: "client", label: "Klien" },
  { type: "number", name: "year", label: "Tahun", min: 1990, max: 2100 },
  { type: "text", name: "period", label: "Periode", hint: "Teks bebas, mis. Nov 2024 – Jul 2025. Jika kosong, tahun yang dipakai." },
  { type: "text", name: "role", label: "Role kamu" },
  { type: "tags", name: "tools", label: "Tools", placeholder: "Mis. Figma lalu tekan Enter" },
  { type: "url", name: "live_url", label: "Link live (opsional)", placeholder: "https://" },
];

function toInitial(project: Project | null, images: ProjectImage[]): FormValues {
  const gallery: GalleryItem[] = images.map((i) => ({
    id: i.id,
    image_url: i.image_url,
    alt: i.alt,
    width: i.width,
    height: i.height,
  }));
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    category_id: project?.category_id ?? null,
    summary: project?.summary ?? "",
    content_md: project?.content_md ?? "",
    client: project?.client ?? "",
    year: project?.year ?? null,
    period: project?.period ?? "",
    role: project?.role ?? "",
    tools: project?.tools ?? [],
    cover_url: project?.cover_url ?? null,
    cover_width: project?.cover_width ?? 1000,
    cover_height: project?.cover_height ?? 750,
    live_url: project?.live_url ?? "",
    status: project?.status ?? "draft",
    is_featured: project?.is_featured ?? false,
    gallery,
  };
}

export default function ProjectForm({ project, images, categories }: ProjectFormProps) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(project !== null);

  const { values, setValue, errors, saving, dirty, submit } = useAdminForm(
    toInitial(project, images),
    (v) => saveProject(project?.id ?? null, v),
    {
      onSaved: (data) => {
        if (project) router.refresh();
        else router.replace(`/admin/projects/${data.id}`);
      },
    },
  );

  const title = typeof values.title === "string" ? values.title : "";
  const slug = typeof values.slug === "string" ? values.slug : "";
  const gallery = Array.isArray(values.gallery) ? (values.gallery as GalleryItem[]) : [];

  const field = (f: FieldDef) => (
    <FieldRenderer key={f.name} field={f} values={values} error={errors[f.name]} onChange={setValue} />
  );

  const card = "rounded-lg border border-stone-200 bg-white p-5 md:p-6";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="pb-24"
    >
      <div className="space-y-6">
        <section className={card}>
          <h2 className="text-base font-semibold">Dasar</h2>
          <div className="mt-5 space-y-5">
            <FormField label="Judul project" htmlFor="title" error={errors.title} required>
              <input
                id="title"
                value={title}
                onChange={(e) => {
                  setValue("title", e.target.value);
                  if (!slugTouched) setValue("slug", slugify(e.target.value));
                }}
                className={inputClass}
              />
            </FormField>
            <FormField
              label="Slug (URL)"
              htmlFor="slug"
              hint={`Alamat halaman: /work/${slug || "slug-project"}. Dibuat otomatis dari judul, boleh diubah.`}
              error={errors.slug}
              required
            >
              <input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setValue("slug", slugify(e.target.value));
                }}
                className={inputClass}
              />
            </FormField>
            <FormField label="Kategori" htmlFor="category_id" error={errors.category_id}>
              <select
                id="category_id"
                value={typeof values.category_id === "string" ? values.category_id : ""}
                onChange={(e) => setValue("category_id", e.target.value || null)}
                className={inputClass}
              >
                <option value="">— Tanpa kategori —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormField>
            {field({ type: "textarea", name: "summary", label: "Ringkasan", rows: 3, hint: "Tampil di bawah judul pada halaman detail." })}
            {field({
              type: "select",
              name: "status",
              label: "Status",
              hint: "Draft tidak tampil di website. Published tampil di /work.",
              options: [
                { value: "draft", label: "Draft (disembunyikan)" },
                { value: "published", label: "Published (tampil di website)" },
              ],
            })}
            {field({
              type: "toggle",
              name: "is_featured",
              label: "Featured (tampil di Home)",
              hint: "Maksimal 3 project featured. Urutannya mengikuti urutan di daftar project.",
            })}
          </div>
        </section>

        <section className={card}>
          <h2 className="text-base font-semibold">Detail</h2>
          <div className="mt-5 space-y-5">{detailFields.map(field)}</div>
        </section>

        <section className={card}>
          <h2 className="text-base font-semibold">Deskripsi</h2>
          <div className="mt-5">{field({ type: "markdown", name: "content_md", label: "Isi deskripsi" })}</div>
        </section>

        <section className={card}>
          <h2 className="text-base font-semibold">Gambar</h2>
          <div className="mt-5 space-y-6">
            <FormField label="Cover" error={errors.cover_url}>
              <ImageUploader
                value={typeof values.cover_url === "string" && values.cover_url ? values.cover_url : null}
                folder="projects"
                label="cover"
                onChange={(url, size) => {
                  setValue("cover_url", url);
                  if (size) {
                    setValue("cover_width", size.width);
                    setValue("cover_height", size.height);
                  }
                }}
              />
            </FormField>
            <FormField label="Galeri" error={errors.gallery}>
              <MultiImageUploader value={gallery} onChange={(items) => setValue("gallery", items)} folder="projects" />
            </FormField>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur lg:bottom-0 lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link href="/admin/projects" className="text-sm text-stone-600 underline">
            ← Daftar project
          </Link>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-stone-500 sm:block" aria-live="polite">
              {dirty ? "Ada perubahan yang belum disimpan" : project ? "Semua perubahan tersimpan" : ""}
            </p>
            <Button type="submit" loading={saving} disabled={!dirty && project !== null}>
              {project ? "Simpan" : "Buat project"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
