import type { Metadata } from "next";
import { processFields } from "@/components/admin/fieldConfigs";
import ListPage from "@/components/admin/ListPage";
import { deleteProcessStep, moveProcessStep, saveProcessStep } from "@/lib/actions/processSteps";

export const metadata: Metadata = { title: "Process" };

export default function ProcessPage() {
  return (
    <ListPage
      title="Process"
      description="Langkah kerja di halaman utama (maksimal 6). Urutan di sini = urutan tampil."
      table="process_steps"
      noun="langkah"
      titleKey="title"
      subtitleKey="description"
      max={6}
      fields={processFields}
      defaults={{ icon: "Sparkles", title: "", description: "" }}
      save={saveProcessStep}
      remove={deleteProcessStep}
      move={moveProcessStep}
    />
  );
}
