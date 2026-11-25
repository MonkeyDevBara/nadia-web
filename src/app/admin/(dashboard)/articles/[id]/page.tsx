import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import PageHeader from "@/components/admin/PageHeader";
import { getAdminArticle } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Edit Artikel" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const article = await getAdminArticle(id);
  if (!article) notFound();

  return (
    <>
      <PageHeader title="Edit Artikel" description={article.title} />
      <ArticleForm article={article} />
    </>
  );
}
