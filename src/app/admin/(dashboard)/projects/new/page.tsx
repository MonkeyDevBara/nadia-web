import type { Metadata } from "next";
import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "@/components/admin/ProjectForm";
import { listCategories } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Tambah Project" };

export default async function NewProjectPage() {
  const categories = await listCategories();
  return (
    <>
      <PageHeader title="Tambah Project" description="Isi detail project. Simpan sebagai Draft dulu jika belum siap tayang." />
      <ProjectForm project={null} images={[]} categories={categories} />
    </>
  );
}
