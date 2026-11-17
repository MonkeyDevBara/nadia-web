import { revalidatePath, revalidateTag } from "next/cache";
import type { z } from "zod";
import type { CacheTag } from "@/lib/data/public";
import { createClient } from "@/lib/supabase/server";
import { fieldErrors } from "@/lib/validations/common";
import { requireUser } from "./auth";
import { fail, ok, type ActionResult } from "./types";

type PgError = { code?: string; message: string };

/** Terjemahkan error Postgres ke pesan Bahasa Indonesia yang ramah. */
export function describeDbError(error: PgError, fallback: string): string {
  if (error.code === "23505") return "Data dengan nilai tersebut sudah ada (duplikat).";
  if (error.code === "23514") return error.message.startsWith("Maksimal") ? error.message : fallback;
  if (error.code === "42501") return "Akses ditolak. Silakan login ulang.";
  return fallback;
}

/** Bersihkan cache publik untuk tag yang berubah (website otomatis menampilkan data terbaru). */
export function revalidateContent(tags: CacheTag[], paths: string[] = []): void {
  for (const tag of tags) revalidateTag(tag);
  revalidatePath("/", "layout");
  for (const p of paths) revalidatePath(p);
}

type SaveConfig<S extends z.ZodType> = {
  table: string;
  schema: S;
  tags: CacheTag[];
  noun: string;
  /** Batas jumlah baris (mis. process_steps maks 6). */
  max?: number;
};

/** Insert (id null) atau update satu baris tabel berurutan (punya kolom sort_order). */
export async function saveRow<S extends z.ZodType>(
  cfg: SaveConfig<S>,
  id: string | null,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  await requireUser();

  const parsed = cfg.schema.safeParse(input);
  if (!parsed.success) return fail("Periksa kembali isian yang ditandai.", fieldErrors(parsed.error));
  const data = parsed.data as Record<string, unknown>;

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase.from(cfg.table).update(data).eq("id", id);
    if (error) return fail(describeDbError(error, `Gagal menyimpan ${cfg.noun}.`));
    revalidateContent(cfg.tags);
    return ok(`${capitalize(cfg.noun)} berhasil disimpan.`, { id });
  }

  if (cfg.max !== undefined) {
    const { count } = await supabase.from(cfg.table).select("id", { count: "exact", head: true });
    if ((count ?? 0) >= cfg.max) return fail(`Maksimal ${cfg.max} ${cfg.noun}.`);
  }

  const { data: last } = await supabase
    .from(cfg.table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const lastRow: { sort_order: number } | null = last;
  const sortOrder = (lastRow?.sort_order ?? 0) + 1;

  const { data: created, error } = await supabase
    .from(cfg.table)
    .insert({ ...data, sort_order: sortOrder })
    .select("id")
    .single();
  if (error || !created) return fail(describeDbError(error ?? { message: "" }, `Gagal menambah ${cfg.noun}.`));

  revalidateContent(cfg.tags);
  const createdRow: { id: string } = created;
  return ok(`${capitalize(cfg.noun)} berhasil ditambahkan.`, { id: createdRow.id });
}

export async function deleteRow(table: string, id: string, tags: CacheTag[], noun: string): Promise<ActionResult> {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return fail(describeDbError(error, `Gagal menghapus ${noun}.`));
  revalidateContent(tags);
  return ok(`${capitalize(noun)} dihapus.`);
}

/** Tukar posisi dengan tetangga, lalu rapikan sort_order jadi 1..n. */
export async function moveRow(
  table: string,
  id: string,
  direction: "up" | "down",
  tags: CacheTag[],
): Promise<ActionResult> {
  await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) return fail("Gagal mengubah urutan.");

  const rows: { id: string; sort_order: number }[] = data ?? [];
  const index = rows.findIndex((r) => r.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= rows.length) return ok("Urutan tidak berubah.");

  [rows[index], rows[target]] = [rows[target], rows[index]];

  const updates = rows
    .map((r, i) => ({ id: r.id, from: r.sort_order, to: i + 1 }))
    .filter((r) => r.from !== r.to);
  const results = await Promise.all(
    updates.map((u) => supabase.from(table).update({ sort_order: u.to }).eq("id", u.id)),
  );
  if (results.some((r) => r.error)) return fail("Gagal mengubah urutan.");

  revalidateContent(tags);
  return ok("Urutan diperbarui.");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
