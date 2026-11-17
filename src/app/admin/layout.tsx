import type { Metadata } from "next";
import AdminProviders from "@/components/admin/AdminProviders";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

// Halaman admin selalu dinamis (butuh sesi login).
export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 font-sans">
        <h1 className="text-xl font-semibold">Supabase belum dikonfigurasi</h1>
        <p className="mt-3 text-stone-600">
          Isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di{" "}
          <code>.env.local</code>, lalu restart server.
        </p>
      </main>
    );
  }
  return <AdminProviders>{children}</AdminProviders>;
}
