import Image from "next/image";
import type { SiteSettings } from "@/types/database";
import RotatingBadge from "./RotatingBadge";

type HeroProps = {
  site: Pick<
    SiteSettings,
    | "name"
    | "hero_small_word"
    | "hero_big_word"
    | "headline"
    | "description"
    | "hero_image_url"
    | "signature_url"
    | "signature_text"
    | "badge_enabled"
    | "badge_text"
  >;
};

export default function Hero({ site }: HeroProps) {
  return (
    <section className="overflow-hidden">
      <div className="container-x grid items-center gap-10 pb-16 pt-10 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-16">
        <div>
          {site.hero_small_word ? (
            <p className="font-serif text-3xl italic md:text-4xl">{site.hero_small_word}</p>
          ) : null}
          <h1 className="-mt-1 font-display text-[clamp(3.5rem,19vw,8rem)] uppercase leading-[0.95] lg:text-[clamp(5rem,10vw,8.5rem)]">
            {site.hero_big_word}
          </h1>
          <div className="my-6 h-px w-16 bg-charcoal" />
          <p className="max-w-md text-xl font-semibold uppercase leading-snug tracking-wide md:text-2xl">
            {site.headline}
          </p>
          <p className="mt-5 max-w-md leading-relaxed text-muted">{site.description}</p>
          {site.signature_url ? (
            <Image
              src={site.signature_url}
              alt={`Signature ${site.name}`}
              width={320}
              height={120}
              className="mt-6 h-16 w-auto md:h-20"
            />
          ) : site.signature_text ? (
            <p className="mt-6 font-script text-5xl leading-none md:text-6xl" aria-hidden="true">
              {site.signature_text}
            </p>
          ) : null}
          <p className="label-caps mt-2 text-muted">{site.name}</p>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
          <div className="absolute left-1/2 top-[8%] aspect-square w-[92%] -translate-x-1/2 rounded-full bg-taupe" />
          {site.hero_image_url ? (
            <div className="absolute inset-x-[6%] bottom-0 top-[10%]">
              <Image
                src={site.hero_image_url}
                alt={`Portrait of ${site.name}`}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-contain object-bottom"
              />
            </div>
          ) : null}
          {site.badge_enabled && site.badge_text ? (
            <div className="absolute -bottom-2 left-0 sm:bottom-4 sm:left-2">
              <RotatingBadge text={site.badge_text} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
