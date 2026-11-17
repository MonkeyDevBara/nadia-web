import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/types/database";
import ContactForm from "./ContactForm";
import Star from "./Star";

type CtaProps = {
  site: Pick<
    SiteSettings,
    | "contact_eyebrow"
    | "cta_title"
    | "cta_text"
    | "cta_button_label"
    | "cta_button_link"
    | "email"
    | "phone"
    | "address"
    | "website"
    | "socials"
  >;
};

export default function CtaSection({ site }: CtaProps) {
  const contacts = [
    { Icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { Icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { Icon: MapPin, label: "Location", value: site.address, href: null },
    {
      Icon: Globe,
      label: "Website",
      value: site.website,
      href: site.website.startsWith("http") ? site.website : `https://${site.website}`,
    },
  ].filter((c) => c.value);

  return (
    <section id="contact" className="border-t border-line py-16 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          {site.contact_eyebrow ? (
            <p className="label-caps flex items-center gap-2 text-muted">
              <Star /> {site.contact_eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-serif text-5xl italic uppercase leading-[1.05] md:text-7xl">
            {site.cta_title}
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted">{site.cta_text}</p>
          {site.cta_button_label && site.cta_button_link ? (
            <a
              href={site.cta_button_link}
              target="_blank"
              rel="noopener noreferrer"
              className="label-caps mt-8 inline-flex items-center gap-2 rounded-sm border border-charcoal px-7 py-4 transition-colors hover:bg-charcoal hover:text-cream"
            >
              {site.cta_button_label} →
            </a>
          ) : null}
          <ContactForm />
        </div>

        <div className="lg:self-start lg:pt-24">
          <ul className="border-t border-line">
            {contacts.map(({ Icon, label, value, href }) => (
              <li key={label} className="flex items-center gap-5 border-b border-line py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="label-caps text-muted">{label}</p>
                  {href ? (
                    <a href={href} className="break-words hover:underline">
                      {value}
                    </a>
                  ) : (
                    <p>{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {site.socials.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {site.socials.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-caps border-b border-charcoal pb-1 transition-opacity hover:opacity-60"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
