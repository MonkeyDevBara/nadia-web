"use client";

import { ArrowDown, ArrowUp, Pencil, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { inputClass } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import { deleteProject, moveProject } from "@/lib/actions/projects";
import type { ActionResult } from "@/lib/actions/types";
import type { Project } from "@/types/database";

type Row = Project & { category_name: string };

export default function ProjectsTable({ projects }: { projects: Row[] }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      q === ""
        ? projects
        : projects.filter((p) => `${p.title} ${p.client} ${p.category_name}`.toLowerCase().includes(q)),
    [projects, q],
  );

  async function run(id: string, action: () => Promise<ActionResult>) {
    setBusyId(id);
    try {
      const result = await action();
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

  async function onDelete(p: Row) {
    const ok = await confirm({
      title: "Hapus project ini?",
      description: `"${p.title}" beserta galerinya akan dihapus permanen dari website.`,
      confirmLabel: "Ya, hapus",
      danger: true,
    });
    if (ok) await run(p.id, () => deleteProject(p.id));
  }

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
        <input
          type="search"
          aria-label="Cari project"
          placeholder="Cari judul, klien, atau kategori…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputClass} pl-9`}
        />
      </div>

      <ul className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        {visible.length === 0 ? (
          <li className="p-6 text-center text-sm text-stone-500">
            {projects.length === 0 ? "Belum ada project." : "Tidak ada project yang cocok."}
          </li>
        ) : null}
        {visible.map((p) => {
          const index = projects.findIndex((x) => x.id === p.id);
          return (
            <li key={p.id} className="flex items-center gap-2 border-b border-stone-200 p-3 last:border-b-0 md:px-4">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span className="line-clamp-2">{p.title}</span>
                  {p.is_featured ? (
                    <Star size={14} className="shrink-0 fill-amber-400 text-amber-500" aria-label="Featured" />
                  ) : null}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-stone-500">
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      p.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {p.status === "published" ? "Published" : "Draft"}
                  </span>
                  <span className="truncate">{p.category_name || "Tanpa kategori"}</span>
                </p>
              </div>
              <Button
                variant="ghost"
                aria-label="Naikkan urutan"
                disabled={q !== "" || index === 0 || busyId !== null}
                onClick={() => run(p.id, () => moveProject(p.id, "up"))}
                className="h-9 px-2"
              >
                <ArrowUp size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                aria-label="Turunkan urutan"
                disabled={q !== "" || index === projects.length - 1 || busyId !== null}
                onClick={() => run(p.id, () => moveProject(p.id, "down"))}
                className="h-9 px-2"
              >
                <ArrowDown size={16} aria-hidden="true" />
              </Button>
              <Link
                href={`/admin/projects/${p.id}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 text-sm font-medium hover:bg-stone-50"
              >
                <Pencil size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Edit</span>
              </Link>
              <Button
                variant="ghost"
                aria-label={`Hapus ${p.title}`}
                loading={busyId === p.id}
                disabled={busyId !== null && busyId !== p.id}
                onClick={() => onDelete(p)}
                className="h-9 px-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} aria-hidden="true" />
              </Button>
            </li>
          );
        })}
      </ul>
      {q !== "" ? <p className="mt-2 text-xs text-stone-500">Pengurutan dinonaktifkan saat pencarian aktif.</p> : null}
    </div>
  );
}
