import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
