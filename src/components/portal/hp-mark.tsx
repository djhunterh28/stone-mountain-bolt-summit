import { cn } from "@/lib/utils";

/** Actual Hurricane Productions swirl, cropped from the company lockup. */
export function HurricaneLogo({ className, alt = "Hurricane Productions" }: { className?: string; alt?: string }) {
  return (
    <img
      src="/hp-logo.png"
      alt={alt}
      className={cn("rounded-md bg-black object-cover", className)}
    />
  );
}

export function HpMark({ className, color: _color = "#0D47A1" }: { className?: string; color?: string }) {
  return <HurricaneLogo className={className} alt="" />;
}
