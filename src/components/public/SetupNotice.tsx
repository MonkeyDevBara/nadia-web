type SetupNoticeProps = { reason: "env" | "empty" };

export default function SetupNotice({ reason }: SetupNoticeProps) {
  return (
    <main className="container-x py-24 md:py-32">
      <p className="label-caps text-muted">Setup</p>
      <h1 className="mt-3 font-serif text-4xl italic md:text-5xl">
        {reason === "env" ? "Supabase belum dikonfigurasi" : "Database masih kosong"}
      </h1>
      {reason === "env" ? (
        <ol className="mt-6 max-w-xl list-decimal space-y-2 pl-5 leading-relaxed text-muted">
          <li>
            Salin <code>.env.example</code> menjadi <code>.env.local</code>.
          </li>
          <li>
            Isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dari
            Supabase &gt; Project Settings &gt; API.
          </li>
          <li>Restart <code>npm run dev</code>.</li>
        </ol>
      ) : (
        <p className="mt-6 max-w-xl leading-relaxed text-muted">
          Tabel <code>site_settings</code> belum berisi data. Jalankan{" "}
          <code>supabase/seed.sql</code> di Supabase SQL Editor, atau isi lewat{" "}
          <code>/admin</code>.
        </p>
      )}
    </main>
  );
}
