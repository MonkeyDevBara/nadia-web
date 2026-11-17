import type { Metadata } from "next";
import { Anton, Inter, Mrs_Saint_Delafield, Playfair_Display } from "next/font/google";
import Script from "next/script";
import type { CSSProperties } from "react";
import { getSettings } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/env";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const signature = Mrs_Saint_Delafield({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = isSupabaseConfigured ? await getSettings() : null;
  if (!site) return { title: "Portfolio" };

  return {
    title: { default: site.seo_title || site.name, template: `%s — ${site.name}` },
    description: site.seo_description || undefined,
    openGraph: {
      title: site.seo_title || site.name,
      description: site.seo_description || undefined,
      images: site.og_image_url ? [site.og_image_url] : undefined,
      type: "website",
    },
    icons: site.favicon_url ? { icon: site.favicon_url } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = isSupabaseConfigured ? await getSettings() : null;
  const style = site?.accent_color ? ({ "--taupe": site.accent_color } as CSSProperties) : undefined;

  return (
    <html lang="en" style={style}>
      <body
        className={`${anton.variable} ${playfair.variable} ${inter.variable} ${signature.variable}`}
      >
        {children}
        {site?.ga_id ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.ga_id}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.ga_id}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
