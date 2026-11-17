import { ExternalLink } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { countRows } from "@/lib/data/admin";

export default async function DashboardPage() {
  const [published, drafts, testimonials, unread, messages] = await Promise.all([
    countRows("projects", { column: "status", value: "published" }),
    countRows("projects", { column: "status", value: "draft" }),
    countRows("testimonials"),
    countRows("messages", { column: "is_read", value: false }),
    countRows("messages"),
  ]);

  const cards = [
    { label: "Project dipublikasikan", value: published, hint: `${drafts} draft`, href: "/admin/projects" },
    { label: "Testimoni", value: testimonials, hint: "Kelola di menu Testimonials", href: "/admin/testimonials" },
    { label: "Pesan belum dibaca", value: unread, hint: `${messages} pesan total`, href: "/admin/pesan" },
  ];

  const shortcuts = [
    { href: "/admin/profil", label: "Ubah foto & teks hero" },
    { href: "/admin/projects/new", label: "Tambah project baru" },
    { href: "/admin/kontak", label: "Ubah kontak & tombol CTA" },
    { href: "/admin/seo", label: "Atur SEO & favicon" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan isi website kamu."
        actions={
          <Link
            href="/"
            target="_blank"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-charcoal px-4 text-sm font-medium text-white hover:bg-black"
          >
            Lihat Website <ExternalLink size={16} aria-hidden="true" />
          </Link>
        }
      />

      <ul className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="block rounded-lg border border-stone-200 bg-white p-5 transition-colors hover:border-stone-400">
              <p className="text-3xl font-semibold">{c.value}</p>
              <p className="mt-1 text-sm font-medium">{c.label}</p>
              <p className="mt-0.5 text-xs text-stone-500">{c.hint}</p>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mb-3 mt-10 text-base font-semibold">Pintasan</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {shortcuts.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="block rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm hover:border-stone-400">
              {s.label} →
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
