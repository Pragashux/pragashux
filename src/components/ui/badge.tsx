import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
