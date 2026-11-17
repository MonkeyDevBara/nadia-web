import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/public/ProjectCard";
import { getCategories, getPublishedProjects, getSettings } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const site = isSupabaseConfigured ? await getSettings() : null;
  return {
    title: "Work",
    description: site ? `Selected projects by ${site.name}.` : undefined,
  };
}

type WorkPageProps = { searchParams: Promise<{ category?: string }> };

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const [{ category }, projects, categories] = await Promise.all([
    searchParams,
    getPublishedProjects(),
    getCategories(),
  ]);

  // Hanya tampilkan kategori yang punya project published.
  const usable = categories.filter((c) => projects.some((p) => p.category_id === c.id));
  const active = usable.find((c) => c.slug === category)?.slug ?? null;
  const visible = active ? projects.filter((p) => p.category?.slug === active) : projects;

  const pill = (isActive: boolean) =>
    `label-caps rounded-sm border px-4 py-2.5 transition-colors ${
      isActive ? "border-charcoal bg-charcoal text-cream" : "border-line hover:border-charcoal"
    }`;

  return (
    <div className="container-x py-12 md:py-20">
      <p className="font-serif text-3xl italic md:text-4xl">Selected</p>
      <h1 className="-mt-1 font-display text-[clamp(3.5rem,19vw,9rem)] uppercase leading-[0.95]">
        Work
      </h1>

      {usable.length > 0 ? (
        <nav aria-label="Filter by category" className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
          <Link href="/work" className={pill(active === null)} aria-current={active === null ? "page" : undefined}>
            All
          </Link>
          {usable.map((c) => (
            <Link
              key={c.id}
              href={`/work?category=${c.slug}`}
              className={pill(active === c.slug)}
              aria-current={active === c.slug ? "page" : undefined}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      ) : null}

      {visible.length === 0 ? (
        <p className="mt-16 text-muted">No projects yet.</p>
      ) : (
        <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <li key={p.id}>
              <ProjectCard project={p} number={i + 1} variant="light" priority={i < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
