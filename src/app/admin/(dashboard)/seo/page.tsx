import type { Metadata } from "next";
import { seoSections } from "@/components/admin/fieldConfigs";
import SettingsPage from "@/components/admin/SettingsPage";
import { saveSeoSettings } from "@/lib/actions/settings";

export const metadata: Metadata = { title: "SEO & Pengaturan" };

export default function SeoPage() {
  return (
    <SettingsPage
      title="SEO & Pengaturan"
      description="Judul & deskripsi untuk Google, gambar saat link dibagikan, favicon, warna aksen, dan Google Analytics."
      sections={seoSections}
      save={saveSeoSettings}
    />
  );
}
