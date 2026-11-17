import Link from "next/link";
import type { ProjectWithRelations, SiteSettings } from "@/types/database";
import ProjectCard from "./ProjectCard";
import Star from "./Star";

type SelectedWorkProps = {
  projects: ProjectWithRelations[];
  site: Pick<SiteSettings, "work_eyebrow" | "work_title" | "work_link_label">;
};

export default function SelectedWork({ projects, site }: SelectedWorkProps) {
  if (projects.length === 0) return null;

  return (
    <section id="work" className="bg-charcoal py-16 text-cream md:py-24">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line-dark pb-6">
          <div>
            {site.work_eyebrow ? (
              <p className="label-caps flex items-center gap-2 text-taupe">
                <Star /> {site.work_eyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 font-serif text-4xl italic md:text-5xl">{site.work_title}</h2>
          </div>
          {site.work_link_label ? (
            <Link
              href="/work"
              className="label-caps border-b border-cream pb-1 transition-opacity hover:opacity-60"
            >
              {site.work_link_label} →
            </Link>
          ) : null}
        </div>

        <ul className="snap-x-thin -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto px-5 pb-2 md:-mx-8 md:scroll-pl-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0">
          {projects.map((p, i) => (
            <li key={p.id} className="w-[78%] shrink-0 snap-start sm:w-[55%] md:w-[42%] lg:w-auto">
              <ProjectCard project={p} number={i + 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
