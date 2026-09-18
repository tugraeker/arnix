import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/20 text-primary",
        primary: "border-primary/30 bg-primary/20 text-primary",
        secondary: "border-secondary/30 bg-secondary/20 text-secondary",
        accent: "border-accent/30 bg-accent/20 text-accent",
        outline: "text-foreground border-border bg-transparent",
        success: "border-neon-green/30 bg-neon-green/15 text-neon-green",
        warning: "border-neon-orange/30 bg-neon-orange/15 text-neon-orange",
        destructive: "border-destructive/30 bg-destructive/15 text-destructive",
        muted: "border-white/5 bg-white/5 text-muted-foreground",
        pink: "border-neon-pink/30 bg-neon-pink/15 text-neon-pink",
        purple: "border-neon-purple/30 bg-neon-purple/15 text-neon-purple",
        cyan: "border-neon-cyan/30 bg-neon-cyan/15 text-neon-cyan",
        info: "border-primary/30 bg-primary/20 text-primary",  // Added info variant
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
