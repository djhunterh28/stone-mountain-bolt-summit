import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-accent text-foreground",
        outline: "shadow-[var(--shadow-border)] text-muted-foreground",
        success: "bg-success/15 text-success",
        warn: "bg-warn/15 text-warn",
        danger: "bg-destructive/15 text-destructive",
        steel: "bg-primary/12 text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
