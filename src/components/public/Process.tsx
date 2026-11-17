import type { CSSProperties } from "react";
import { getIcon } from "@/lib/utils/icons";
import type { ProcessStep, SiteSettings } from "@/types/database";

type ProcessProps = {
  steps: ProcessStep[];
  site: Pick<SiteSettings, "process_eyebrow" | "process_title">;
};

export default function Process({ steps, site }: ProcessProps) {
  if (steps.length === 0) return null;
  const style = { "--n": steps.length } as CSSProperties;

  return (
    <section id="process">
      {site.process_eyebrow ? <p className="label-caps text-muted">{site.process_eyebrow}</p> : null}
      <h2 className="mt-2 font-serif text-4xl italic md:text-5xl">{site.process_title}</h2>

      <div className="relative mt-10" style={style}>
        {/* garis penghubung: vertikal di mobile, horizontal di sm+ */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-6 top-6 w-px bg-line sm:bottom-auto sm:left-6 sm:right-[calc(100%/var(--n)-1.5rem)] sm:top-6 sm:h-px sm:w-auto"
        />
        <ol className="relative grid gap-8 sm:grid-cols-[repeat(var(--n),minmax(0,1fr))] sm:gap-4">
          {steps.map((step, i) => {
            const Icon = getIcon(step.icon);
            return (
              <li key={step.id} className="flex gap-5 sm:block">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-charcoal bg-cream">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div className="sm:mt-5">
                  <p className="label-caps text-muted">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.14em]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
