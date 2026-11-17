import type { Metadata } from "next";
import { expertiseFields } from "@/components/admin/fieldConfigs";
import ListPage from "@/components/admin/ListPage";
import { deleteExpertise, moveExpertise, saveExpertise } from "@/lib/actions/expertises";

export const metadata: Metadata = { title: "Expertise" };

export default function ExpertisePage() {
  return (
    <ListPage
      title="Expertise"
      description="Daftar keahlian di halaman utama. Urutan di sini = urutan tampil."
      table="expertises"
      noun="keahlian"
      titleKey="title"
      subtitleKey="description"
      fields={expertiseFields}
      defaults={{ icon: "Sparkles", title: "", description: "" }}
      save={saveExpertise}
      remove={deleteExpertise}
      move={moveExpertise}
    />
  );
}
