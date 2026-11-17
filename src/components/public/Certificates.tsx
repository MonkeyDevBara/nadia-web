import Image from "next/image";
import type { Certificate, SiteSettings } from "@/types/database";
import Star from "./Star";

type CertificatesProps = {
  items: Certificate[];
  site: Pick<SiteSettings, "certificates_eyebrow" | "certificates_title">;
};

export default function Certificates({ items, site }: CertificatesProps) {
  if (items.length === 0) return null;
  return (
    <section id="certificates" className="border-t border-line py-16 md:py-24">
      <div className="container-x">
        {site.certificates_eyebrow ? (
          <p className="label-caps flex items-center gap-2 text-muted">
            <Star /> {site.certificates_eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 font-serif text-4xl italic md:text-5xl">{site.certificates_title}</h2>
      </div>

      <ul className="snap-x-thin mt-10 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto px-5 pb-2 md:scroll-pl-8 md:px-8 xl:scroll-pl-[max(2rem,calc((100vw-80rem)/2+2rem))] xl:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {items.map((c) => (
          <li key={c.id} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[30%]">
            <div
              className={`relative aspect-[4/3] overflow-hidden rounded-sm border bg-white ${c.is_highlight ? "border-charcoal" : "border-line"}`}
            >
              <Image
                src={c.image_url}
                alt={c.issuer ? `${c.title} — ${c.issuer}` : c.title}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw"
                className="object-contain"
              />
            </div>
            <h3 className="mt-4 text-sm font-semibold leading-snug">{c.title}</h3>
            <p className="label-caps mt-1 text-muted">{c.issuer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
