import type { Metadata } from "next";
import { certificateFields } from "@/components/admin/fieldConfigs";
import ListPage from "@/components/admin/ListPage";
import { deleteCertificate, moveCertificate, saveCertificate } from "@/lib/actions/certificates";

export const metadata: Metadata = { title: "Sertifikat" };

export default function SertifikatPage() {
  return (
    <ListPage
      title="Sertifikat & Award"
      description="Sertifikat dan penghargaan yang tampil sebagai slider di halaman utama."
      table="certificates"
      noun="sertifikat"
      titleKey="title"
      subtitleKey="issuer"
      fields={certificateFields}
      defaults={{ title: "", issuer: "", image_url: null, is_highlight: false }}
      save={saveCertificate}
      remove={deleteCertificate}
      move={moveCertificate}
    />
  );
}
