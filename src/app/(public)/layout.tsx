import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import SetupNotice from "@/components/public/SetupNotice";
import { getSettings } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/env";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) return <SetupNotice reason="env" />;
  const site = await getSettings();
  if (!site) return <SetupNotice reason="empty" />;

  return (
    <>
      <a
        href="#main"
        className="label-caps sr-only bg-charcoal px-4 py-3 text-cream focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50"
      >
        Skip to content
      </a>
      <Header site={site} />
      <main id="main">{children}</main>
      <Footer site={site} />
    </>
  );
}
