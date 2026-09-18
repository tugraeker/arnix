"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Select({ value, defaultValue, onValueChange, children, className }: SelectProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const [open, setOpen] = React.useState(false);
  const current = value ?? internal;

  const handleChange = React.useCallback(
    (newVal: string) => {
      if (value === undefined) setInternal(newVal);
      onValueChange?.(newVal);
      setOpen(false);
    },
    [value, onValueChange]
  );

  return (
    <SelectContext.Provider value={{ value: current, onValueChange: handleChange, open, setOpen }}>
      <div className={cn("relative inline-block w-full", className)}>{children}</div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => ctx?.setOpen(!ctx.open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background/60 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-all",
          className
        )}
        {...props}
      >
        <span className="flex-1 text-left truncate">{children}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", ctx?.open && "rotate-180")} />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder = "Seçiniz..." }: SelectValueProps) {
  const ctx = React.useContext(SelectContext);
  return (
    <span className={cn(!ctx?.value && "text-muted-foreground")}>
      {ctx?.value || placeholder}
    </span>
  );
}

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SelectContent({ className, children, ...props }: SelectContentProps) {
  const ctx = React.useContext(SelectContext);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) ctx?.setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [ctx]);

  if (!ctx?.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-2xl shadow-black/40 py-1 animate-slide-up",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function SelectItem({ value, className, children, ...props }: SelectItemProps) {
  const ctx = React.useContext(SelectContext);
  const selected = ctx?.value === value;
  return (
    <div
      onClick={() => ctx?.onValueChange(value)}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm hover:bg-white/5 outline-none transition-colors",
        selected && "bg-primary/10 text-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
