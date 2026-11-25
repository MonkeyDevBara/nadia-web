import type { Metadata } from "next";
import ArticleForm from "@/components/admin/ArticleForm";
import PageHeader from "@/components/admin/PageHeader";

export const metadata: Metadata = { title: "Tambah Artikel" };

export default function NewArticlePage() {
  return (
    <>
      <PageHeader title="Tambah Artikel" description="Simpan sebagai Draft dulu jika belum siap tayang." />
      <ArticleForm article={null} />
    </>
  );
}
