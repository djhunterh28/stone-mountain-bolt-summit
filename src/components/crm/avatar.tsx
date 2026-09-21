import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  steel: "bg-primary/20 text-primary",
  mist: "bg-steel/30 text-steel",
  sage: "bg-success/20 text-success",
  clay: "bg-destructive/20 text-destructive",
  fog: "bg-muted-foreground/20 text-muted-foreground",
  ink: "bg-foreground/12 text-foreground",
};

export function MemberAvatar({
  initials,
  tone,
  size = "md",
  className,
}: {
  initials: string;
  tone?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium",
        size === "sm" && "size-6 text-[10px]",
        size === "md" && "size-8 text-xs",
        size === "lg" && "size-10 text-sm",
        TONE[tone ?? "steel"] ?? TONE.steel,
        className,
      )}
    >
      {initials}
    </span>
  );
}
