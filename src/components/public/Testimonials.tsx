import { Quote } from "lucide-react";
import Image from "next/image";
import type { Testimonial } from "@/types/database";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-label="Testimonials" className="container-x pb-16 md:pb-24">
      <div className="rounded-sm bg-charcoal text-cream">
        <ul className="snap-x-thin flex snap-x snap-mandatory overflow-x-auto">
          {items.map((t, i) => (
            <li
              id={`testimonial-${i + 1}`}
              key={t.id}
              className={`grid w-full shrink-0 snap-center items-center gap-8 p-7 md:gap-14 md:p-14 ${t.photo_url ? "md:grid-cols-[1fr_auto]" : ""}`}
            >
              <figure>
                <Quote size={44} className="text-taupe" aria-hidden="true" />
                <blockquote className="mt-5 font-serif text-2xl italic leading-snug md:text-3xl">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-line-dark pt-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em]">{t.name}</p>
                  <p className="label-caps mt-1 text-taupe">{t.position}</p>
                </figcaption>
              </figure>
              {t.photo_url ? (
                <div className="relative order-first h-40 w-32 overflow-hidden rounded-sm grayscale md:order-none md:h-72 md:w-56">
                  <Image
                    src={t.photo_url}
                    alt={`Photo of ${t.name}`}
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        {items.length > 1 ? (
          <nav aria-label="Choose testimonial" className="flex justify-center gap-3 pb-6">
            {items.map((t, i) => (
              <a
                key={t.id}
                href={`#testimonial-${i + 1}`}
                aria-label={`Testimonial ${i + 1}: ${t.name}`}
                className="flex h-6 w-6 items-center justify-center"
              >
                <span className="h-2 w-2 rounded-full bg-taupe" />
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
