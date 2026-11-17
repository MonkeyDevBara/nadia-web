import type { Metadata } from "next";
import MessagesList from "@/components/admin/MessagesList";
import PageHeader from "@/components/admin/PageHeader";
import { listMessages } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Pesan Masuk" };

export default async function PesanPage() {
  const messages = await listMessages();
  return (
    <>
      <PageHeader title="Pesan Masuk" description="Pesan dari form kontak di website. Membuka pesan otomatis menandainya sudah dibaca." />
      <MessagesList messages={messages} />
    </>
  );
}
