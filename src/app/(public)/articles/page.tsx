import type { Metadata } from "next";
import ArticleCard from "@/components/public/ArticleCard";
import { getPublishedArticles, getSettings } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const site = isSupabaseConfigured ? await getSettings() : null;
  return {
    title: "Articles",
    description: site ? `Articles and writing by ${site.name}.` : undefined,
  };
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="container-x py-12 md:py-20">
      <p className="font-serif text-3xl italic md:text-4xl">Latest</p>
      <h1 className="-mt-1 font-display text-[clamp(3.5rem,19vw,9rem)] uppercase leading-[0.95]">
        Articles
      </h1>

      {articles.length === 0 ? (
        <p className="mt-16 text-muted">No articles yet.</p>
      ) : (
        <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <li key={a.id}>
              <ArticleCard article={a} priority={i < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
