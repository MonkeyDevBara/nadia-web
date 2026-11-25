import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticles } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/env";
import { formatArticleDate } from "@/lib/utils/date";
import { renderMarkdown } from "@/lib/utils/markdown";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured) return {};
  const article = (await getPublishedArticles()).find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt || undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || undefined,
      publishedTime: article.published_on ?? undefined,
      images: article.cover_url ? [article.cover_url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const articles = await getPublishedArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) notFound();

  const article = articles[index];
  const next = articles[(index + 1) % articles.length];

  return (
    <article>
      <div className="container-x py-12 md:py-20">
        <Link href="/articles" className="label-caps text-muted transition-colors hover:text-charcoal">
          ← All articles
        </Link>
        {article.published_on ? (
          <p className="label-caps mt-10 text-muted">{formatArticleDate(article.published_on)}</p>
        ) : null}
        <h1 className="mt-2 max-w-4xl font-display text-[clamp(2.5rem,9vw,5.5rem)] uppercase leading-[0.98]">
          {article.title}
        </h1>
        {article.excerpt ? (
          <p className="mt-6 max-w-2xl font-serif text-xl italic text-muted md:text-2xl">{article.excerpt}</p>
        ) : null}
        {article.tags.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <li key={t} className="label-caps rounded-sm border border-line px-3 py-1.5">
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        {article.cover_url ? (
          <div className="mt-10 overflow-hidden rounded-sm border border-line bg-white">
            <Image
              src={article.cover_url}
              alt={`${article.title} — cover`}
              width={article.cover_width}
              height={article.cover_height}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-auto w-full"
            />
          </div>
        ) : null}

        <div
          className="prose-md mt-10 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content_md) }}
        />

        {article.source_url ? (
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps mt-4 inline-flex items-center gap-2 rounded-sm border border-charcoal px-6 py-4 transition-colors hover:bg-charcoal hover:text-cream"
          >
            Read original <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : null}
      </div>

      {next.id !== article.id ? (
        <Link href={`/articles/${next.slug}`} className="group block bg-charcoal py-16 text-cream md:py-24">
          <div className="container-x">
            <p className="label-caps text-taupe">Next article</p>
            <p className="mt-3 font-display text-[clamp(2rem,8vw,5rem)] uppercase leading-none transition-opacity group-hover:opacity-60">
              {next.title} →
            </p>
          </div>
        </Link>
      ) : null}
    </article>
  );
}
