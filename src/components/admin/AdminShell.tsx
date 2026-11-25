"use client";

import {
  Award,
  BarChart3,
  FolderKanban,
  Globe,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Quote,
  Search,
  Settings2,
  Sparkles,
  Tags,
  User,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { logout } from "@/lib/actions/auth";

type NavItem = { href: string; label: string; icon: LucideIcon; badgeKey?: "unread" };

const NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Ringkasan",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Halaman utama",
    items: [
      { href: "/admin/profil", label: "Profil & Hero", icon: User },
      { href: "/admin/section", label: "Section & Tampilan", icon: Settings2 },
      { href: "/admin/statistik", label: "Statistik", icon: BarChart3 },
      { href: "/admin/expertise", label: "Expertise", icon: Sparkles },
      { href: "/admin/process", label: "Process", icon: Workflow },
      { href: "/admin/sertifikat", label: "Sertifikat", icon: Award },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/kontak", label: "Kontak & CTA", icon: Mail },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/articles", label: "Artikel", icon: Newspaper },
      { href: "/admin/kategori", label: "Kategori Project", icon: Tags },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { href: "/admin/pesan", label: "Pesan Masuk", icon: Inbox, badgeKey: "unread" },
      { href: "/admin/seo", label: "SEO & Pengaturan", icon: Search },
    ],
  },
];

const BOTTOM: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/pesan", label: "Pesan", icon: Inbox, badgeKey: "unread" },
];

type AdminShellProps = { email: string; unread: number; children: ReactNode };

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ email, unread, children }: AdminShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  function badge(item: NavItem) {
    if (item.badgeKey !== "unread" || unread === 0) return null;
    return (
      <span className="ml-auto rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white" aria-label={`${unread} belum dibaca`}>
        {unread > 99 ? "99+" : unread}
      </span>
    );
  }

  const navList = (
    <nav aria-label="Menu admin" className="flex-1 overflow-y-auto px-3 py-4">
      {NAV.map((group) => (
        <div key={group.title} className="mb-5">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-stone-400">{group.title}</p>
          <ul>
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <item.icon size={18} aria-hidden="true" />
                    {item.label}
                    {badge(item)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-stone-200 p-3">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
      >
        <Globe size={18} aria-hidden="true" />
        Lihat Website
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
        >
          <LogOut size={18} aria-hidden="true" />
          Keluar
        </button>
      </form>
      <p className="truncate px-3 pt-2 text-xs text-stone-400">{email}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-stone-200 bg-white lg:flex">
        <div className="border-b border-stone-200 px-6 py-5">
          <p className="text-sm font-semibold">Admin Portfolio</p>
          <p className="text-xs text-stone-500">Kelola isi website</p>
        </div>
        {navList}
        {footer}
      </aside>

      {/* Top bar mobile */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 lg:hidden">
        <p className="text-sm font-semibold">Admin Portfolio</p>
        <Link href="/" target="_blank" className="text-sm text-stone-600 underline">
          Lihat Website
        </Link>
      </header>

      {/* Drawer mobile */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu admin">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <p className="text-sm font-semibold">Menu</p>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Tutup menu" className="rounded p-1 hover:bg-stone-100">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            {navList}
            {footer}
          </div>
        </div>
      ) : null}

      <main className="px-4 pb-24 pt-6 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>

      {/* Bottom nav mobile */}
      <nav
        aria-label="Navigasi cepat"
        className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-4 border-t border-stone-200 bg-white lg:hidden"
      >
        {BOTTOM.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 text-xs ${
                active ? "font-semibold text-stone-900" : "text-stone-500"
              }`}
            >
              <item.icon size={20} aria-hidden="true" />
              {item.label}
              {item.badgeKey === "unread" && unread > 0 ? (
                <span className="absolute right-[28%] top-1.5 rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white">
                  {unread > 99 ? "99+" : unread}
                </span>
              ) : null}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 text-xs text-stone-500"
        >
          <Menu size={20} aria-hidden="true" />
          Menu
        </button>
      </nav>
    </div>
  );
}
