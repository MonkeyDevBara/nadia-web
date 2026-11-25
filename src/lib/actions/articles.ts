"use server";

import { createClient } from "@/lib/supabase/server";
import { fieldErrors } from "@/lib/validations/common";
import { articleSchema } from "@/lib/validations/entities";
import { requireUser } from "./auth";
import { deleteRow, describeDbError, revalidateContent } from "./crud";
import { fail, ok, type ActionResult } from "./types";

const TAGS = ["articles" as const];

export async function saveArticle(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireUser();

  const parsed = articleSchema.safeParse(input);
  if (!parsed.success) return fail("Periksa kembali isian yang ditandai.", fieldErrors(parsed.error));
  const article = parsed.data;

  const supabase = await createClient();

  // Artikel yang dipublikasikan tanpa tanggal: pakai tanggal tersimpan, atau hari ini bila belum pernah ada.
  let published_on = article.published_on;
  if (article.status === "published" && !published_on) {
    let stored: string | null = null;
    if (id) {
      const { data } = await supabase.from("articles").select("published_on").eq("id", id).maybeSingle();
      const found: { published_on: string | null } | null = data;
      stored = found?.published_on ?? null;
    }
    // en-CA menghasilkan format YYYY-MM-DD; zona Jakarta supaya tanggal tidak mundur sehari di pagi hari WIB.
    published_on = stored ?? new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  }
  const row = { ...article, published_on };

  let slugQuery = supabase.from("articles").select("id").eq("slug", row.slug);
  if (id) slugQuery = slugQuery.neq("id", id);
  const { data: clash } = await slugQuery.limit(1);
  if (clash && clash.length > 0) {
    return fail("Slug sudah dipakai artikel lain.", { slug: "Slug sudah dipakai artikel lain. Ganti dengan yang lain." });
  }

  let articleId = id;
  if (articleId) {
    const { error } = await supabase.from("articles").update(row).eq("id", articleId);
    if (error) return fail(describeDbError(error, "Gagal menyimpan artikel."));
  } else {
    const { data: created, error } = await supabase.from("articles").insert(row).select("id").single();
    if (error || !created) return fail(describeDbError(error ?? { message: "" }, "Gagal menambah artikel."));
    const createdRow: { id: string } = created;
    articleId = createdRow.id;
  }

  revalidateContent(TAGS, [`/articles/${row.slug}`]);
  return ok(id ? "Artikel berhasil disimpan." : "Artikel berhasil dibuat.", { id: articleId });
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  return deleteRow("articles", id, TAGS, "artikel");
}
