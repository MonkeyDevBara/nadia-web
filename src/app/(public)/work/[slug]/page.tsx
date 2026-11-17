import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProjects } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/env";
import { renderMarkdown } from "@/lib/utils/markdown";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured) return {};
  const project = (await getPublishedProjects()).find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: project.cover_url ? { images: [project.cover_url] } : undefined,
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const projects = await getPublishedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const meta = [
    { label: "Client", value: project.client },
    { label: "Period", value: project.period || (project.year ? String(project.year) : "") },
    { label: "Role", value: project.role },
    { label: "Tools", value: project.tools.join(", ") },
  ].filter((m) => m.value);

  return (
    <article>
      <div className="container-x py-12 md:py-20">
        <Link href="/work" className="label-caps text-muted transition-colors hover:text-charcoal">
          ← All projects
        </Link>
        {project.category ? (
          <p className="label-caps mt-10 text-muted">{project.category.name}</p>
        ) : null}
        <h1 className="mt-2 font-display text-[clamp(2.5rem,11vw,6rem)] uppercase leading-[0.98]">
          {project.title}
        </h1>
        {project.summary ? (
          <p className="mt-6 max-w-2xl font-serif text-xl italic text-muted md:text-2xl">
            {project.summary}
          </p>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-14">
          <div>
            {meta.length > 0 ? (
              <dl className="grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-4">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="label-caps text-muted">{m.label}</dt>
                    <dd className="mt-1 text-sm">{m.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div
              className="prose-md mt-10 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(project.content_md) }}
            />

            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps mt-4 inline-flex items-center gap-2 rounded-sm border border-charcoal px-6 py-4 transition-colors hover:bg-charcoal hover:text-cream"
              >
                View live <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : null}
          </div>

          {project.cover_url ? (
            <div className="self-start overflow-hidden rounded-sm border border-line bg-white lg:sticky lg:top-6">
              <Image
                src={project.cover_url}
                alt={`${project.title} — cover`}
                width={project.cover_width}
                height={project.cover_height}
                priority
                sizes="(min-width: 1024px) 352px, 100vw"
                className="h-auto w-full"
              />
            </div>
          ) : null}
        </div>

        {project.images.length > 0 ? (
          <section aria-label="Gallery" className="mt-16">
            <h2 className="font-serif text-3xl italic">Gallery</h2>
            <ul className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {project.images.map((img, i) => (
                <li
                  key={img.id}
                  className="mb-4 break-inside-avoid overflow-hidden rounded-sm border border-line bg-white"
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt || `${project.title} — sample ${i + 1}`}
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {next.id !== project.id ? (
        <Link href={`/work/${next.slug}`} className="group block bg-charcoal py-16 text-cream md:py-24">
          <div className="container-x">
            <p className="label-caps text-taupe">Next project</p>
            <p className="mt-3 font-display text-[clamp(2rem,8vw,5rem)] uppercase leading-none transition-opacity group-hover:opacity-60">
              {next.title} →
            </p>
          </div>
        </Link>
      ) : null}
    </article>
  );
}
