"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type MobileMenuProps = {
  links: { href: string; label: string }[];
  role: string;
};

export default function MobileMenu({ links, role }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-sm border border-line"
      >
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b border-line bg-cream px-5 pb-6 pt-2"
      >
        <nav aria-label="Main menu">
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-line last:border-b-0">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="label-caps block py-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="label-caps mt-4 text-muted">{role} ✦</p>
      </div>
    </div>
  );
}
