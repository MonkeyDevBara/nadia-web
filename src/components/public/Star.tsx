export default function Star({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={className}>
      ✦
    </span>
  );
}
