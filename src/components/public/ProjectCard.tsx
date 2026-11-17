import Image from "next/image";
import Link from "next/link";
import type { ProjectWithRelations } from "@/types/database";

type ProjectCardProps = {
  project: ProjectWithRelations;
  number: number;
  variant?: "dark" | "light";
  priority?: boolean;
};

export default function ProjectCard({
  project,
  number,
  variant = "dark",
  priority = false,
}: ProjectCardProps) {
  const dark = variant === "dark";
  const wide = project.cover_width / project.cover_height > 1.5;
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <p className={`label-caps mb-4 ${dark ? "text-taupe" : "text-muted"}`}>
        {String(number).padStart(2, "0")}
      </p>
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-sm border bg-white ${dark ? "border-line-dark" : "border-line"}`}
      >
        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={`${project.title} — cover`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 78vw"
            className={`transition-transform duration-500 group-hover:scale-105 ${wide ? "object-contain" : "object-cover object-top"}`}
          />
        ) : null}
      </div>
      <h3 className="mt-5 font-serif text-2xl italic">{project.title}</h3>
      <p className={`label-caps mt-1 ${dark ? "text-taupe" : "text-muted"}`}>
        {project.category?.name ?? ""}
      </p>
    </Link>
  );
}
