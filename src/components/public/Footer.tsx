import type { SiteSettings } from "@/types/database";
import Logo from "./Logo";
import Star from "./Star";

type FooterProps = {
  site: Pick<SiteSettings, "initials" | "name" | "tagline" | "socials">;
};

export default function Footer({ site }: FooterProps) {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <Logo initials={site.initials} tone="dark" />
          <p className="font-serif text-lg italic">{site.tagline}</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {site.socials.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps text-taupe transition-colors hover:text-cream"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-line-dark">
        <p className="container-x label-caps flex items-center gap-2 py-5 text-taupe">
          <Star /> © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
