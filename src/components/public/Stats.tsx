import type { Stat } from "@/types/database";

export default function Stats({ items }: { items: Stat[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-label="Highlights" className="border-y border-line">
      <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <div
            key={s.id}
            className={`flex flex-col-reverse justify-end gap-2 py-8 pr-4 md:py-10 ${
              i % 2 === 1 ? "border-l border-line pl-5" : ""
            } ${i >= 2 ? "border-t border-line" : ""} lg:border-t-0 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0`}
          >
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="font-display text-5xl leading-none md:text-6xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
