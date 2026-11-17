"use server";

import { createClient } from "@/lib/supabase/server";
import { fieldErrors } from "@/lib/validations/common";
import { projectSchema } from "@/lib/validations/entities";
import { requireUser } from "./auth";
import { deleteRow, describeDbError, moveRow, revalidateContent } from "./crud";
import { fail, ok, type ActionResult } from "./types";

const TAGS = ["projects" as const];
const MAX_FEATURED = 3;

export async function saveProject(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireUser();

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return fail("Periksa kembali isian yang ditandai.", fieldErrors(parsed.error));
  const { gallery, ...project } = parsed.data;

  const supabase = await createClient();

  // Slug harus unik
  let slugQuery = supabase.from("projects").select("id").eq("slug", project.slug);
  if (id) slugQuery = slugQuery.neq("id", id);
  const { data: clash } = await slugQuery.limit(1);
  if (clash && clash.length > 0) {
    return fail("Slug sudah dipakai project lain.", { slug: "Slug sudah dipakai project lain. Ganti dengan yang lain." });
  }

  // Maksimal 3 project featured
  if (project.is_featured) {
    let featuredQuery = supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_featured", true);
    if (id) featuredQuery = featuredQuery.neq("id", id);
    const { count } = await featuredQuery;
    if ((count ?? 0) >= MAX_FEATURED) {
      return fail(`Maksimal ${MAX_FEATURED} project featured.`, {
        is_featured: `Sudah ada ${MAX_FEATURED} project featured. Matikan featured di project lain dulu.`,
      });
    }
  }

  let projectId = id;
  if (projectId) {
    const { error } = await supabase.from("projects").update(project).eq("id", projectId);
    if (error) return fail(describeDbError(error, "Gagal menyimpan project."));
  } else {
    const { data: last } = await supabase
      .from("projects")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const lastRow: { sort_order: number } | null = last;
    const { data: created, error } = await supabase
      .from("projects")
      .insert({ ...project, sort_order: (lastRow?.sort_order ?? 0) + 1 })
      .select("id")
      .single();
    if (error || !created) return fail(describeDbError(error ?? { message: "" }, "Gagal menambah project."));
    const createdRow: { id: string } = created;
    projectId = createdRow.id;
  }

  const galleryError = await syncGallery(projectId, gallery);
  if (galleryError) return fail(galleryError);

  revalidateContent(TAGS, [`/work/${project.slug}`]);
  return ok(id ? "Project berhasil disimpan." : "Project berhasil dibuat.", { id: projectId });
}

type GalleryInput = { id?: string; image_url: string; alt: string; width: number; height: number }[];

/** Samakan project_images dengan daftar dari form: hapus yang hilang, update yang ada, tambah yang baru. */
async function syncGallery(projectId: string, gallery: GalleryInput): Promise<string | null> {
  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase
    .from("project_images")
    .select("id")
    .eq("project_id", projectId);
  if (readError) return "Gagal membaca galeri.";

  const existingRows: { id: string }[] = existing ?? [];
  const keepIds = new Set(gallery.flatMap((g) => (g.id ? [g.id] : [])));
  const removeIds = existingRows.map((r) => r.id).filter((rid) => !keepIds.has(rid));

  if (removeIds.length > 0) {
    const { error } = await supabase.from("project_images").delete().in("id", removeIds);
    if (error) return "Gagal menghapus gambar galeri.";
  }

  for (const [index, item] of gallery.entries()) {
    const row = {
      image_url: item.image_url,
      alt: item.alt,
      width: item.width,
      height: item.height,
      sort_order: index + 1,
    };
    const { error } =
      item.id && existingRows.some((r) => r.id === item.id)
        ? await supabase.from("project_images").update(row).eq("id", item.id)
        : await supabase.from("project_images").insert({ ...row, project_id: projectId });
    if (error) return "Gagal menyimpan gambar galeri.";
  }
  return null;
}

export async function deleteProject(id: string): Promise<ActionResult> {
  return deleteRow("projects", id, TAGS, "project");
}

export async function moveProject(id: string, direction: "up" | "down"): Promise<ActionResult> {
  return moveRow("projects", id, direction, TAGS);
}
