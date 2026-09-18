"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.4),0_4px_14px_-4px_hsl(var(--primary)/0.6)] hover:bg-primary/90 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.6),0_6px_20px_-4px_hsl(var(--primary)/0.8)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_0_0_1px_hsl(var(--secondary)/0.3)] hover:bg-secondary/90",
        accent:
          "bg-accent text-accent-foreground shadow-[0_0_0_1px_hsl(var(--accent)/0.4)] hover:bg-accent/90",
        outline:
          "border border-border bg-transparent hover:bg-white/5 hover:border-primary/40",
        ghost:
          "bg-transparent hover:bg-white/5 text-muted-foreground hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success:
          "bg-neon-green/20 text-neon-green border border-neon-green/30 hover:bg-neon-green/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6",
        xs: "h-6 px-2 text-[9px]",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
