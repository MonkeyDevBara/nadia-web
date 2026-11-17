import type { Metadata } from "next";
import { contactSections } from "@/components/admin/fieldConfigs";
import SettingsPage from "@/components/admin/SettingsPage";
import { saveContactSettings } from "@/lib/actions/settings";

export const metadata: Metadata = { title: "Kontak & CTA" };

export default function KontakPage() {
  return (
    <SettingsPage
      title="Kontak & CTA"
      description="Teks ajakan, tombol, info kontak, dan sosial media."
      sections={contactSections}
      save={saveContactSettings}
    />
  );
}
