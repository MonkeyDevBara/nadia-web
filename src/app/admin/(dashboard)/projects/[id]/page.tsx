import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "@/components/admin/ProjectForm";
import { getAdminProject, listCategories } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Edit Project" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const [found, categories] = await Promise.all([getAdminProject(id), listCategories()]);
  if (!found) notFound();

  return (
    <>
      <PageHeader title="Edit Project" description={found.project.title} />
      <ProjectForm project={found.project} images={found.images} categories={categories} />
    </>
  );
}
