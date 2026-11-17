import Link from "next/link";

type LogoProps = {
  initials: string;
  name?: string;
  tone?: "light" | "dark";
};

export default function Logo({ initials, name, tone = "light" }: LogoProps) {
  const circle =
    tone === "light"
      ? "border-charcoal text-charcoal"
      : "border-cream text-cream";
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label={name ?? initials}>
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full border font-serif text-base italic ${circle}`}
      >
        {initials}
      </span>
      {name ? (
        <span className="label-caps hidden sm:inline">{name}</span>
      ) : null}
    </Link>
  );
}
