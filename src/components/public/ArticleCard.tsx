import Image from "next/image";
import Link from "next/link";
import { formatArticleDate } from "@/lib/utils/date";
import type { Article } from "@/types/database";

type ArticleCardProps = { article: Article; priority?: boolean };

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-line bg-white">
        {article.cover_url ? (
          <Image
            src={article.cover_url}
            alt={`${article.title} — cover`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      {article.published_on ? (
        <p className="label-caps mt-5 text-muted">{formatArticleDate(article.published_on)}</p>
      ) : null}
      <h2 className="mt-1 font-serif text-2xl italic">{article.title}</h2>
      {article.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{article.excerpt}</p> : null}
    </Link>
  );
}
