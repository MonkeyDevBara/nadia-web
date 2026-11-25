"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";
import { saveArticle } from "@/lib/actions/articles";
import { useAdminForm } from "@/lib/hooks/useAdminForm";
import { slugify } from "@/lib/utils/slugify";
import type { Article } from "@/types/database";
import FieldRenderer from "./FieldRenderer";
import type { FieldDef, FormValues } from "./fieldTypes";
import ImageUploader from "./ImageUploader";

function toInitial(article: Article | null): FormValues {
  return {
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content_md: article?.content_md ?? "",
    tags: article?.tags ?? [],
    cover_url: article?.cover_url ?? null,
    cover_width: article?.cover_width ?? 1200,
    cover_height: article?.cover_height ?? 630,
    source_url: article?.source_url ?? "",
    status: article?.status ?? "draft",
    published_on: article?.published_on ?? "",
  };
}

export default function ArticleForm({ article }: { article: Article | null }) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(article !== null);

  const { values, setValue, errors, saving, dirty, submit } = useAdminForm(
    toInitial(article),
    (v) => saveArticle(article?.id ?? null, v),
    {
      onSaved: (data) => {
        if (article) router.refresh();
        else router.replace(`/admin/articles/${data.id}`);
      },
    },
  );

  const title = typeof values.title === "string" ? values.title : "";
  const slug = typeof values.slug === "string" ? values.slug : "";

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
            <FormField label="Judul artikel" htmlFor="title" error={errors.title} required>
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
              hint={`Alamat halaman: /articles/${slug || "slug-artikel"}. Dibuat otomatis dari judul, boleh diubah.`}
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
            {field({
              type: "textarea",
              name: "excerpt",
              label: "Ringkasan",
              rows: 3,
              hint: "Tampil di daftar artikel dan sebagai deskripsi untuk Google (maks 300 karakter).",
            })}
            {field({ type: "tags", name: "tags", label: "Tag", placeholder: "Mis. SEO lalu tekan Enter" })}
            {field({
              type: "select",
              name: "status",
              label: "Status",
              hint: "Draft tidak tampil di website. Published tampil di /articles.",
              options: [
                { value: "draft", label: "Draft (disembunyikan)" },
                { value: "published", label: "Published (tampil di website)" },
              ],
            })}
            {field({
              type: "date",
              name: "published_on",
              label: "Tanggal terbit",
              hint: "Kosongkan untuk memakai tanggal hari ini saat artikel dipublikasikan.",
            })}
            {field({
              type: "url",
              name: "source_url",
              label: "Link sumber (opsional)",
              placeholder: "https://",
              hint: "Jika artikel juga terbit di tempat lain (mis. Kompasiana), tampil sebagai tombol di halaman artikel.",
            })}
          </div>
        </section>

        <section className={card}>
          <h2 className="text-base font-semibold">Isi artikel</h2>
          <div className="mt-5">{field({ type: "markdown", name: "content_md", label: "Isi" })}</div>
        </section>

        <section className={card}>
          <h2 className="text-base font-semibold">Gambar</h2>
          <div className="mt-5">
            <FormField label="Cover" error={errors.cover_url}>
              <ImageUploader
                value={typeof values.cover_url === "string" && values.cover_url ? values.cover_url : null}
                folder="articles"
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
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur lg:bottom-0 lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link href="/admin/articles" className="text-sm text-stone-600 underline">
            ← Daftar artikel
          </Link>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-stone-500 sm:block" aria-live="polite">
              {dirty ? "Ada perubahan yang belum disimpan" : article ? "Semua perubahan tersimpan" : ""}
            </p>
            <Button type="submit" loading={saving} disabled={!dirty && article !== null}>
              {article ? "Simpan" : "Buat artikel"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
