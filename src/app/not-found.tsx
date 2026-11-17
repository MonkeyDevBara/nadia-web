import Link from "next/link";
import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import { getSettings } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/env";

export default async function NotFound() {
  const site = isSupabaseConfigured ? await getSettings() : null;

  return (
    <>
      {site ? <Header site={site} /> : null}
      <main className="container-x py-20 text-center md:py-32">
        <p className="font-serif text-3xl italic md:text-4xl">Oops</p>
        <h1 className="font-display text-[clamp(6rem,30vw,16rem)] leading-none">404</h1>
        <div className="mx-auto my-6 h-px w-16 bg-charcoal" />
        <p className="mx-auto max-w-md text-muted">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="label-caps mt-8 inline-flex rounded-sm border border-charcoal px-7 py-4 transition-colors hover:bg-charcoal hover:text-cream"
        >
          ← Back to home
        </Link>
      </main>
      {site ? <Footer site={site} /> : null}
    </>
  );
}
