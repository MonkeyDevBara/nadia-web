import { getIcon } from "@/lib/utils/icons";
import type { Expertise as ExpertiseItem, SiteSettings } from "@/types/database";

type ExpertiseProps = {
  items: ExpertiseItem[];
  site: Pick<SiteSettings, "expertise_eyebrow" | "expertise_title" | "tools_title" | "tools">;
};

export default function Expertise({ items, site }: ExpertiseProps) {
  if (items.length === 0) return null;
  return (
    <section id="expertise">
      {site.expertise_eyebrow ? <p className="label-caps text-muted">{site.expertise_eyebrow}</p> : null}
      <h2 className="mt-2 font-serif text-4xl italic md:text-5xl">{site.expertise_title}</h2>
      <ul className="mt-8 border-t border-line">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <li key={item.id} className="flex gap-5 border-b border-line py-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-charcoal text-cream">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em]">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {site.tools.length > 0 ? (
        <div className="mt-8">
          {site.tools_title ? <p className="label-caps text-muted">{site.tools_title}</p> : null}
          <ul className="mt-3 flex flex-wrap gap-2">
            {site.tools.map((t) => (
              <li key={t} className="rounded-sm border border-line px-3 py-1.5 text-sm">
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
