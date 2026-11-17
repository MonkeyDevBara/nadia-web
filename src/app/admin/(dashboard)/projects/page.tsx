import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import ProjectsTable from "@/components/admin/ProjectsTable";
import { listCategories, listProjects } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([listProjects(), listCategories()]);
  const rows = projects.map((p) => ({
    ...p,
    category_name: categories.find((c) => c.id === p.category_id)?.name ?? "",
  }));

  return (
    <>
      <PageHeader
        title="Projects"
        description="Urutan di daftar ini = urutan tampil di website. Project featured (maks 3) tampil di halaman utama."
        actions={
          <Link
            href="/admin/projects/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-charcoal px-4 text-sm font-medium text-white hover:bg-black"
          >
            <Plus size={16} aria-hidden="true" />
            Tambah project
          </Link>
        }
      />
      <ProjectsTable projects={rows} />
    </>
  );
}
