import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ArticlesTable from "@/components/admin/ArticlesTable";
import PageHeader from "@/components/admin/PageHeader";
import { listArticles } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Artikel" };

export default async function ArticlesPage() {
  const articles = await listArticles();

  return (
    <>
      <PageHeader
        title="Artikel"
        description="Artikel yang tampil di menu Articles. Yang berstatus Published ditampilkan terbaru dulu."
        actions={
          <Link
            href="/admin/articles/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-charcoal px-4 text-sm font-medium text-white hover:bg-black"
          >
            <Plus size={16} aria-hidden="true" />
            Tambah artikel
          </Link>
        }
      />
      <ArticlesTable articles={articles} />
    </>
  );
}
