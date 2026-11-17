import type { Metadata } from "next";
import { sectionSections } from "@/components/admin/fieldConfigs";
import SettingsPage from "@/components/admin/SettingsPage";
import { saveSectionSettings } from "@/lib/actions/settings";

export const metadata: Metadata = { title: "Section & Tampilan" };

export default function SectionPage() {
  return (
    <SettingsPage
      title="Section & Tampilan"
      description="Judul tiap section di halaman utama, daftar tools, dan pengaturan tampil/sembunyi section."
      sections={sectionSections}
      save={saveSectionSettings}
    />
  );
}
