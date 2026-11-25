import Link from "next/link";
import type { SiteSettings } from "@/types/database";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import Star from "./Star";

export const navLinks = [
  { href: "/#work", label: "Work" },
  { href: "/#expertise", label: "Expertise" },
  { href: "/#process", label: "Process" },
  { href: "/#contact", label: "Contact" },
  { href: "/articles", label: "Articles" },
];

type HeaderProps = { site: Pick<SiteSettings, "initials" | "name" | "role"> };

export default function Header({ site }: HeaderProps) {
  return (
    <header className="relative z-30 border-b border-line">
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Logo initials={site.initials} name={site.name.split(" ").slice(0, 2).join(" ")} />
        <nav aria-label="Main menu" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="label-caps transition-opacity hover:opacity-60">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="label-caps hidden items-center gap-2 lg:flex">
          {site.role}
          <Star />
        </p>
        <MobileMenu links={navLinks} role={site.role} />
      </div>
    </header>
  );
}
