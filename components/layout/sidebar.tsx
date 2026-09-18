"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Disc3,
  CalendarDays,
  Mic2,
  FileSpreadsheet,
  SlidersVertical,
  CheckSquare,
  Music2,
  Wallet,
  PartyPopper,
  BookOpenCheck,
  PackageOpen,
  Users,
  Settings,
  Bell,
  Headphones,
  Sparkles,
  Disc,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_ROLES, type AppRole, type NavItem } from "@/lib/constants";
import { RoleGate, useUserRole } from "@/components/shared/role-gate";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const MAIN_NAV: NavItem[] = [
  {
    title: "Kontrol Paneli",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Beat Deposu",
    href: "/beats",
    icon: Disc3,
    badge: 12,
  },
  {
    title: "Beat Yükle",
    href: "/beats/new",
    icon: Sparkles,
    roles: [APP_ROLES.ADMIN, APP_ROLES.PRODUCER, APP_ROLES.ENGINEER],
  },
  {
    title: "Stüdyo Takvimi",
    href: "/studio/calendar",
    icon: CalendarDays,
  },
  {
    title: "Ekipmanlar",
    href: "/studio/equipment",
    icon: Mic2,
  },
  {
    title: "Söz Yazarı (Lyric Pad)",
    href: "/lyric-pad",
    icon: FileSpreadsheet,
  },
  {
    title: "Telif Payları (Split)",
    href: "/split-sheets",
    icon: BookOpenCheck,
  },
];

const LIBRARY_NAV: NavItem[] = [
  {
    title: "Presetler",
    href: "/presets",
    icon: SlidersVertical,
    badge: 24,
  },
  {
    title: "Sample & Loop",
    href: "/samples",
    icon: Disc,
  },
  {
    title: "Görevler",
    href: "/tasks",
    icon: CheckSquare,
    badge: 5,
  },
  {
    title: "Seans Notları",
    href: "/session-notes",
    icon: Headphones,
  },
  {
    title: "Referans Parçalar",
    href: "/references",
    icon: Music2,
  },
];

const STUDIO_NAV: NavItem[] = [
  {
    title: "Gelir / Gider",
    href: "/finances",
    icon: Wallet,
    roles: [APP_ROLES.ADMIN, APP_ROLES.PRODUCER],
  },
  {
    title: "Yayın Takvimi",
    href: "/release-calendar",
    icon: PartyPopper,
  },
  {
    title: "Stüdyo Envanteri",
    href: "/inventory",
    icon: PackageOpen,
    roles: [APP_ROLES.ADMIN, APP_ROLES.ENGINEER],
  },
  {
    title: "Ekip & Üyeler",
    href: "/team",
    icon: Users,
    roles: [APP_ROLES.ADMIN],
  },
  {
    title: "Ayarlar",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  userRole?: AppRole | null;
  className?: string;
}

export function Sidebar({ userRole, className }: SidebarProps) {
  const pathname = usePathname();
  const role = useUserRole() ?? userRole;

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const renderItem = (item: NavItem, key: string) => {
    const active = isActive(item.href);
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
      item.roles ? (
        <RoleGate allowedRoles={item.roles} userRole={role} key={key}>
          {children}
        </RoleGate>
      ) : (
        <React.Fragment key={key}>{children}</React.Fragment>
      );

    return (
      <Wrapper>
        <Link
          href={item.href}
          className={cn(
            "sidebar-item group",
            active && "sidebar-item-active"
          )}
        >
          <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", active && "text-primary")} />
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge ? (
            <Badge variant={active ? "default" : "muted"} className="text-[10px] px-1.5">
              {item.badge}
            </Badge>
          ) : null}
        </Link>
      </Wrapper>
    );
  };

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col w-72 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-card/40 backdrop-blur-xl",
        className
      )}
    >
      {/* Logo */}
      <div className="px-6 h-20 flex items-center gap-3 border-b border-white/5">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
            <Disc3 className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-neon-green border-2 border-card" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-wide neon-text">ARNIX</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Studio Dashboard</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Ana İş Akışı
          </div>
          <div className="space-y-0.5">
            {MAIN_NAV.map((item, i) => renderItem(item, `main-${i}`))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Kütüphane
          </div>
          <div className="space-y-0.5">
            {LIBRARY_NAV.map((item, i) => renderItem(item, `lib-${i}`))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Stüdyo Yönetimi
          </div>
          <div className="space-y-0.5">
            {STUDIO_NAV.map((item, i) => renderItem(item, `std-${i}`))}
          </div>
        </div>
      </nav>

      {/* EQ animasyon */}
      <div className="mx-3 my-3 p-3 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-end h-5 gap-0.5">
            <span className="eq-bar h-4" />
            <span className="eq-bar" />
            <span className="eq-bar h-3" />
            <span className="eq-bar h-5" />
            <span className="eq-bar h-2" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">Şu an çalıyor...</div>
            <div className="text-[10px] text-muted-foreground truncate">Midnight Vibes - v3 Final</div>
          </div>
        </div>
      </div>

      {/* Bottom User Card */}
      <div className="px-3 pb-4">
        <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
          <Avatar
            name="Kullanıcı"
            size="md"
            className="ring-2 ring-primary/30"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Hoş geldin</div>
            <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
              <span className="status-dot bg-neon-green animate-pulse" />
              Çevrimiçi
            </div>
          </div>
          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
