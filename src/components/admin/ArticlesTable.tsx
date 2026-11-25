"use client";

import { ExternalLink, Pencil, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { inputClass } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import { deleteArticle } from "@/lib/actions/articles";
import { formatArticleDate } from "@/lib/utils/date";
import type { Article } from "@/types/database";

export default function ArticlesTable({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => (q === "" ? articles : articles.filter((a) => `${a.title} ${a.tags.join(" ")}`.toLowerCase().includes(q))),
    [articles, q],
  );

  async function onDelete(a: Article) {
    const ok = await confirm({
      title: "Hapus artikel ini?",
      description: `"${a.title}" akan dihapus permanen dari website.`,
      confirmLabel: "Ya, hapus",
      danger: true,
    });
    if (!ok) return;
    setBusyId(a.id);
    try {
      const result = await deleteArticle(a.id);
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
        <input
          type="search"
          aria-label="Cari artikel"
          placeholder="Cari judul atau tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputClass} pl-9`}
        />
      </div>

      <ul className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        {visible.length === 0 ? (
          <li className="p-6 text-center text-sm text-stone-500">
            {articles.length === 0 ? "Belum ada artikel." : "Tidak ada artikel yang cocok."}
          </li>
        ) : null}
        {visible.map((a) => (
          <li key={a.id} className="flex items-center gap-2 border-b border-stone-200 p-3 last:border-b-0 md:px-4">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium">{a.title}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-stone-500">
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    a.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {a.status === "published" ? "Published" : "Draft"}
                </span>
                {a.published_on ? <span>{formatArticleDate(a.published_on)}</span> : null}
              </p>
            </div>
            {a.status === "published" ? (
              <Link
                href={`/articles/${a.slug}`}
                target="_blank"
                aria-label={`Lihat ${a.title} di website`}
                className="inline-flex h-9 items-center rounded-md px-2 text-stone-600 hover:bg-stone-100"
              >
                <ExternalLink size={16} aria-hidden="true" />
              </Link>
            ) : null}
            <Link
              href={`/admin/articles/${a.id}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 text-sm font-medium hover:bg-stone-50"
            >
              <Pencil size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
            <Button
              variant="ghost"
              aria-label={`Hapus ${a.title}`}
              loading={busyId === a.id}
              disabled={busyId !== null && busyId !== a.id}
              onClick={() => onDelete(a)}
              className="h-9 px-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
