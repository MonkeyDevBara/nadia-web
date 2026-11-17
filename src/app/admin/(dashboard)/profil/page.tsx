import type { Metadata } from "next";
import { profileSections } from "@/components/admin/fieldConfigs";
import SettingsPage from "@/components/admin/SettingsPage";
import { saveProfileSettings } from "@/lib/actions/settings";

export const metadata: Metadata = { title: "Profil & Hero" };

export default function ProfilPage() {
  return (
    <SettingsPage
      title="Profil & Hero"
      description="Nama, role, teks hero, foto, tanda tangan, dan badge di bagian paling atas website."
      sections={profileSections}
      save={saveProfileSettings}
    />
  );
}
