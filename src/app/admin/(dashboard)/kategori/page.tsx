import type { Metadata } from "next";
import { categoryFields } from "@/components/admin/fieldConfigs";
import ListPage from "@/components/admin/ListPage";
import { deleteCategory, moveCategory, saveCategory } from "@/lib/actions/categories";

export const metadata: Metadata = { title: "Kategori Project" };

export default function KategoriPage() {
  return (
    <ListPage
      title="Kategori Project"
      description="Kategori dipakai untuk filter di halaman /work. Menghapus kategori tidak menghapus project-nya."
      table="categories"
      noun="kategori"
      titleKey="name"
      subtitleKey="slug"
      fields={categoryFields}
      defaults={{ name: "", slug: "" }}
      save={saveCategory}
      remove={deleteCategory}
      move={moveCategory}
    />
  );
}
