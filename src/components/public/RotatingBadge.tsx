import Star from "./Star";

export default function RotatingBadge({ text }: { text: string }) {
  return (
    <div className="relative h-28 w-28 rounded-full bg-cream sm:h-32 sm:w-32">
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="animate-spin-slow absolute inset-0 h-full w-full"
      >
        <defs>
          <path id="badge-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
        </defs>
        <text
          fill="#1e1e1e"
          fontSize="8.5"
          fontWeight="500"
          letterSpacing="1.6"
          textLength="236"
          lengthAdjust="spacing"
        >
          <textPath href="#badge-circle">{`${text.toUpperCase()} ✦ `}</textPath>
        </text>
      </svg>
      <span className="sr-only">{text}</span>
      <Star className="absolute inset-0 flex items-center justify-center text-xl" />
    </div>
  );
}
