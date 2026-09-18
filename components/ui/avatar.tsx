"use client";

import * as React from "react";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  fallbackClassName?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size = "md", className, fallbackClassName, ...props }, ref) => {
    const [error, setError] = React.useState(false);
    const showImage = src && !error;
    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/40 border border-white/10 items-center justify-center font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name ?? "avatar"}
            className="aspect-square h-full w-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <span className={cn("uppercase tracking-wide", fallbackClassName)}>
            {getInitials(name || alt)}
          </span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: "sm" | "md" | "lg";
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max = 4, size = "md", className, children, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const visible = items.slice(0, max);
    const extra = items.length - max;

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-2", size === "sm" ? "-space-x-1.5" : size === "lg" ? "-space-x-3" : "-space-x-2", className)}
        {...props}
      >
        {visible}
        {extra > 0 && (
          <div
            className={cn(
              "relative inline-flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-foreground font-semibold backdrop-blur-sm",
              sizeClasses[size]
            )}
          >
            +{extra}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };
