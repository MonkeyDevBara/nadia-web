import { createClient } from "@/lib/supabase/server";
import type { Article, Category, Message, Project, ProjectImage, SiteSettings } from "@/types/database";

/** Pembacaan data untuk halaman admin (membawa sesi owner, jadi draft/hidden ikut terbaca). */

export async function listRows<T>(table: string, orderBy = "sort_order"): Promise<T[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: true });
  if (error) throw new Error(`Gagal membaca ${table}: ${error.message}`);
  const rows: T[] = data ?? [];
  return rows;
}

export async function getAdminSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(`Gagal membaca site_settings: ${error.message}`);
  const row: SiteSettings | null = data;
  return row;
}

export async function getAdminProject(id: string): Promise<{ project: Project; images: ProjectImage[] } | null> {
  const supabase = await createClient();
  const [project, images] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_images").select("*").eq("project_id", id).order("sort_order", { ascending: true }),
  ]);
  if (project.error) throw new Error(`Gagal membaca project: ${project.error.message}`);
  if (images.error) throw new Error(`Gagal membaca galeri: ${images.error.message}`);
  const row: Project | null = project.data;
  const imageRows: ProjectImage[] = images.data ?? [];
  return row ? { project: row, images: imageRows } : null;
}

export async function listCategories(): Promise<Category[]> {
  return listRows<Category>("categories");
}

export async function listProjects(): Promise<Project[]> {
  return listRows<Project>("projects");
}

export async function listMessages(): Promise<Message[]> {
  return listRows<Message>("messages", "created_at").then((rows) => rows.reverse());
}

export async function countRows(table: string, filter?: { column: string; value: boolean | string }): Promise<number> {
  const supabase = await createClient();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count } = await query;
  return count ?? 0;
}

export async function listArticles(): Promise<Article[]> {
  return listRows<Article>("articles", "created_at").then((rows) => rows.reverse());
}

export async function getAdminArticle(id: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Gagal membaca artikel: ${error.message}`);
  const row: Article | null = data;
  return row;
}
