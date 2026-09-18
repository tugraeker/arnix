"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  Bell,
  PlusCircle,
  Upload,
  ChevronDown,
  LogOut,
  User,
  Settings as SettingsIcon,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserRole, setStoredRole } from "@/components/shared/role-gate";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import type { AppRole } from "@/lib/constants";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface TopbarProps {
  className?: string;
  user?: {
    email?: string | null;
    fullName?: string | null;
    avatarUrl?: string | null;
    role?: AppRole | null;
  } | null;
  onToggleSidebar?: () => void;
}

export function Topbar({ className, user, onToggleSidebar }: TopbarProps) {
  const router = useRouter();
  const role = useUserRole();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const effectiveRole: AppRole | null = (user?.role ?? role ?? null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    if (typeof window !== "undefined") window.localStorage.removeItem("arnix_user_role");
    router.push("/login");
    router.refresh();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-20 px-4 md:px-8 flex items-center gap-4 border-b border-white/5 bg-background/70 backdrop-blur-xl",
        className
      )}
    >
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-lg hover:bg-white/5"
        aria-label="Menüyü aç"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Beat, preset, görev, üye ara..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/5 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all"
        />
        <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 h-5 rounded bg-white/5 border border-white/5 text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {/* Quick Actions */}
      <div className="hidden md:flex items-center gap-2">
        <Select defaultValue="demo">
          <SelectTrigger className="!w-auto !h-9 !px-3 !text-xs">
            <SelectValue placeholder="Demo rolü..." />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ROLE_LABELS) as AppRole[]).map((r) => (
              <SelectItem
                key={r}
                value={r}
                onClick={() => setStoredRole(r)}
              >
                <span className="flex items-center gap-2">
                  <Badge variant="muted" className={cn("!px-1.5 !text-[10px]", ROLE_COLORS[r])}>
                    {ROLE_LABELS[r]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">demo olarak görüntüle</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Link href="/beats/new">
          <Button size="sm" variant="default" className="h-9">
            <PlusCircle className="h-4 w-4" />
            Yeni Beat
          </Button>
        </Link>

        <Link href="/presets">
          <Button size="sm" variant="outline" className="h-9">
            <Upload className="h-4 w-4" />
            Preset Yükle
          </Button>
        </Link>

        <Link href="/studio/calendar">
          <Button size="sm" variant="ghost" className="h-9">
            <CalendarPlus className="h-4 w-4" />
            Randevu
          </Button>
        </Link>
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
      </button>

      {/* User Menu */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <Avatar
            src={user?.avatarUrl ?? undefined}
            name={user?.fullName ?? user?.email ?? "Kullanıcı"}
            size="md"
          />
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium leading-none">
              {user?.fullName ?? user?.email ?? "Giriş Yapılmamış"}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
              {effectiveRole && (
                <Badge variant="muted" className={cn("!px-1.5 !text-[9px]", ROLE_COLORS[effectiveRole])}>
                  {ROLE_LABELS[effectiveRole]}
                </Badge>
              )}
              {user?.email ?? ""}
            </span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 p-1.5 rounded-xl border border-white/10 bg-popover shadow-2xl shadow-black/50 animate-slide-up z-50">
            <div className="p-3 mb-1 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.avatarUrl ?? undefined}
                  name={user?.fullName ?? user?.email ?? "Kullanıcı"}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">
                    {user?.fullName ?? "Arnix Kullanıcısı"}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user?.email ?? "giriş yapın"}
                  </div>
                  {effectiveRole && (
                    <Badge variant="muted" className={cn("mt-1 !px-1.5", ROLE_COLORS[effectiveRole])}>
                      {ROLE_LABELS[effectiveRole]}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="py-1">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Profilim
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
              >
                <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                Ayarlar
              </Link>
            </div>
            <div className="border-t border-white/5 my-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
