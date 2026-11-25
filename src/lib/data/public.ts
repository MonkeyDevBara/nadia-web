import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  Article,
  Category,
  Certificate,
  Expertise,
  ProcessStep,
  Project,
  ProjectImage,
  ProjectWithRelations,
  SiteSettings,
  Stat,
  Testimonial,
} from "@/types/database";

/**
 * Pembacaan data publik. Hasil di-cache dan diberi tag per entitas;
 * server action admin memanggil revalidateTag(tag) agar perubahan langsung tampil.
 * revalidate 3600 detik hanya jaga-jaga bila data diubah langsung lewat dashboard Supabase.
 */
export const CACHE_TAGS = {
  settings: "settings",
  categories: "categories",
  projects: "projects",
  expertises: "expertises",
  process: "process",
  testimonials: "testimonials",
  stats: "stats",
  certificates: "certificates",
  articles: "articles",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

const REVALIDATE_SECONDS = 3600;

function cached<T>(key: string, tag: CacheTag, load: () => Promise<T>) {
  return unstable_cache(load, [key], { tags: [tag], revalidate: REVALIDATE_SECONDS });
}

function fail(what: string, message: string): never {
  throw new Error(`Gagal membaca ${what}: ${message}`);
}

export const getSettings = cached("settings", CACHE_TAGS.settings, async (): Promise<SiteSettings | null> => {
  const { data, error } = await createPublicClient()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) fail("site_settings", error.message);
  return data as SiteSettings | null;
});

export const getCategories = cached("categories", CACHE_TAGS.categories, async (): Promise<Category[]> => {
  const { data, error } = await createPublicClient()
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("categories", error.message);
  return (data ?? []) as Category[];
});

/** Semua project published (RLS), lengkap dengan kategori dan galeri, urut sort_order. */
export const getPublishedProjects = cached(
  "projects",
  CACHE_TAGS.projects,
  async (): Promise<ProjectWithRelations[]> => {
    const sb = createPublicClient();
    const [projects, images, categories] = await Promise.all([
      sb.from("projects").select("*").eq("status", "published").order("sort_order", { ascending: true }),
      sb.from("project_images").select("*").order("sort_order", { ascending: true }),
      sb.from("categories").select("*"),
    ]);
    if (projects.error) fail("projects", projects.error.message);
    if (images.error) fail("project_images", images.error.message);
    if (categories.error) fail("categories", categories.error.message);

    const cats = (categories.data ?? []) as Category[];
    const imgs = (images.data ?? []) as ProjectImage[];
    return ((projects.data ?? []) as Project[]).map((p) => ({
      ...p,
      category: cats.find((c) => c.id === p.category_id) ?? null,
      images: imgs.filter((i) => i.project_id === p.id),
    }));
  },
);

export const getExpertises = cached("expertises", CACHE_TAGS.expertises, async (): Promise<Expertise[]> => {
  const { data, error } = await createPublicClient()
    .from("expertises")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("expertises", error.message);
  return (data ?? []) as Expertise[];
});

export const getProcessSteps = cached("process", CACHE_TAGS.process, async (): Promise<ProcessStep[]> => {
  const { data, error } = await createPublicClient()
    .from("process_steps")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("process_steps", error.message);
  return (data ?? []) as ProcessStep[];
});

export const getTestimonials = cached("testimonials", CACHE_TAGS.testimonials, async (): Promise<Testimonial[]> => {
  const { data, error } = await createPublicClient()
    .from("testimonials")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  if (error) fail("testimonials", error.message);
  return (data ?? []) as Testimonial[];
});

export const getStats = cached("stats", CACHE_TAGS.stats, async (): Promise<Stat[]> => {
  const { data, error } = await createPublicClient()
    .from("stats")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("stats", error.message);
  return (data ?? []) as Stat[];
});

export const getCertificates = cached("certificates", CACHE_TAGS.certificates, async (): Promise<Certificate[]> => {
  const { data, error } = await createPublicClient()
    .from("certificates")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("certificates", error.message);
  return (data ?? []) as Certificate[];
});

/** Artikel published (RLS), terbaru dulu. */
export const getPublishedArticles = cached("articles", CACHE_TAGS.articles, async (): Promise<Article[]> => {
  const { data, error } = await createPublicClient()
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_on", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) fail("articles", error.message);
  return (data ?? []) as Article[];
});
