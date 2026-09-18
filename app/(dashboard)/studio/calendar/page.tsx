"use client";

import * as React from "react";
import {
  CalendarDays,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Mic2,
  LayoutDashboard,
  Volume2,
  Headphones,
  Radio,
  Clock3,
  Disc3,
  Users,
  Circle,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Coffee,
  MoreHorizontal,
  Search,
  Filter,
  ChevronDown,
  Music4,
  Grip,
  X,
  CalendarCheck2,
  Timer,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ROLE_COLORS,
  ROLE_LABELS,
  type AppRole,
  BOOKING_TYPE_LABELS,
  type BookingType,
} from "@/lib/constants";
import { cn, formatDate, formatDuration, timeAgo } from "@/lib/utils";

type ResourceKey = "studio_a" | "studio_b" | "control_room" | "mix_room" | "booth";

interface Resource {
  key: ResourceKey;
  name: string;
  capacity: number;
  icon: any;
  color: string;
  hourly: number;
}

const RESOURCES: Resource[] = [
  { key: "studio_a", name: "Stüdyo A — Canlı Kayıt", capacity: 8, icon: Mic2, color: "from-primary to-neon-purple", hourly: 1250 },
  { key: "studio_b", name: "Stüdyo B — Prodüksiyon", capacity: 4, icon: Music4, color: "from-neon-cyan to-secondary", hourly: 950 },
  { key: "control_room", name: "Kontrol Odası (SSL)", capacity: 3, icon: LayoutDashboard, color: "from-neon-orange to-neon-pink", hourly: 2000 },
  { key: "mix_room", name: "Mix Room (Dolby Atmos)", capacity: 2, icon: Volume2, color: "from-neon-green to-accent", hourly: 1750 },
  { key: "booth", name: "Vokal Booth", capacity: 2, icon: Headphones, color: "from-muted to-muted-foreground", hourly: 650 },
];

const TYPE_COLORS: Record<BookingType, string> = {
  recording: "from-primary to-neon-purple",
  mixing: "from-neon-cyan to-secondary",
  mastering: "from-neon-orange to-neon-pink",
  production: "from-neon-purple to-primary",
  rehearsal: "from-muted to-muted-foreground",
  meeting: "from-neon-green to-accent",
  live_stream: "from-neon-pink to-destructive",
  other: "from-muted-foreground to-muted",
};

type BookedBy = { name: string; role: AppRole };

interface Booking {
  id: string;
  title: string;
  type: BookingType;
  resource: ResourceKey;
  day: number; // 0=Mon ... 6=Sun
  startHour: number; // 9..24
  durationH: number; // 1..8
  bookedBy: BookedBy[];
  beat?: { id: string; title: string };
  engineer?: BookedBy;
  notes?: string;
  status: "confirmed" | "pending" | "cancelled";
  totalPrice?: number;
}

// Haftanın günleri (18 Eylül 2026 = Cuma → ayarlıyoruz: 0=14.Pzt 1=15.Salı ... 6=20.Paz)
const WEEK_DAYS = [
  { d: 0, date: 14, day: "Pzt", month: "Eyl", isToday: false, isWeekend: false },
  { d: 1, date: 15, day: "Sal", month: "Eyl", isToday: false, isWeekend: false },
  { d: 2, date: 16, day: "Çar", month: "Eyl", isToday: false, isWeekend: false },
  { d: 3, date: 17, day: "Per", month: "Eyl", isToday: false, isWeekend: false },
  { d: 4, date: 18, day: "Cum", month: "Eyl", isToday: true, isWeekend: false },
  { d: 5, date: 19, day: "Cmt", month: "Eyl", isToday: false, isWeekend: true },
  { d: 6, date: 20, day: "Paz", month: "Eyl", isToday: false, isWeekend: true },
];

const HOURS = Array.from({ length: 15 }, (_, i) => 9 + i);

const BOOKINGS: Booking[] = [
  {
    id: "b1",
    title: "Midnight Vibes — Vokal Kaydı",
    type: "recording",
    resource: "booth",
    day: 0, startHour: 11, durationH: 3,
    bookedBy: [{ name: "Zeynep Kara", role: "vocalist" }],
    beat: { id: "1", title: "Midnight Vibes" },
    engineer: { name: "Can Demir", role: "engineer" },
    status: "confirmed", totalPrice: 1950,
    notes: "U87 + Avalon 737 + 1176 zinciri. Ad-lib ve double track.",
  },
  {
    id: "b2",
    title: "Derin Sular — Mix Session",
    type: "mixing",
    resource: "control_room",
    day: 1, startHour: 14, durationH: 6,
    bookedBy: [{ name: "Mert Yılmaz", role: "producer" }, { name: "Zeynep Kara", role: "vocalist" }],
    beat: { id: "4", title: "Derin Sular" },
    engineer: { name: "Can Demir", role: "engineer" },
    status: "confirmed", totalPrice: 12000,
    notes: "Final mix. SSL konsol + outboard EQ/Comp. 3 revizyon hakkı.",
  },
  {
    id: "b3",
    title: "Yeni beat prodüksiyon",
    type: "production",
    resource: "studio_b",
    day: 4, startHour: 10, durationH: 4,
    bookedBy: [{ name: "Mert Yılmaz", role: "producer" }],
    status: "confirmed", totalPrice: 3800,
    notes: "Trap x Drill fusion. 140 BPM hedefi.",
  },
  {
    id: "b4",
    title: "Midnight Vibes — Mastering",
    type: "mastering",
    resource: "mix_room",
    day: 4, startHour: 15, durationH: 2,
    bookedBy: [{ name: "Can Demir", role: "engineer" }],
    beat: { id: "1", title: "Midnight Vibes" },
    status: "pending", totalPrice: 3500,
    notes: "Dolby Atmos mix + stereo master. LUFS -14 target.",
  },
  {
    id: "b5",
    title: "EP toplantısı — Takvim planı",
    type: "meeting",
    resource: "studio_b",
    day: 4, startHour: 18, durationH: 2,
    bookedBy: [
      { name: "Mert Yılmaz", role: "producer" },
      { name: "Zeynep Kara", role: "vocalist" },
      { name: "Selin Öztürk", role: "admin" },
      { name: "Ali Şahin", role: "songwriter" },
    ],
    status: "confirmed",
    notes: "Yayın takvimi, kapak görseli, distribütör görüşmesi.",
  },
  {
    id: "b6",
    title: "Canlı Performans prova",
    type: "rehearsal",
    resource: "studio_a",
    day: 5, startHour: 12, durationH: 5,
    bookedBy: [{ name: "Zeynep Kara", role: "vocalist" }, { name: "Ali Şahin", role: "songwriter" }],
    status: "pending", totalPrice: 6250,
    notes: "4 parça prova. Backing track setup.",
  },
  {
    id: "b7",
    title: "Neon Sokaklar — Vokal düzenleme",
    type: "recording",
    resource: "booth",
    day: 2, startHour: 13, durationH: 2,
    bookedBy: [{ name: "Zeynep Kara", role: "vocalist" }],
    beat: { id: "6", title: "Neon Sokaklar" },
    engineer: { name: "Can Demir", role: "engineer" },
    status: "confirmed", totalPrice: 1300,
  },
  {
    id: "b8",
    title: "Kozmik Dans Remix — Atmos Mix",
    type: "mixing",
    resource: "mix_room",
    day: 3, startHour: 10, durationH: 5,
    bookedBy: [{ name: "Can Demir", role: "engineer" }, { name: "Mert Yılmaz", role: "producer" }],
    beat: { id: "5", title: "Kozmik Dans" },
    status: "confirmed", totalPrice: 8750,
    notes: "7.1.4 speaker calibration. Stem print.",
  },
  {
    id: "b9",
    title: "Söz yazım workshop",
    type: "meeting",
    resource: "studio_b",
    day: 4, startHour: 14, durationH: 3,
    bookedBy: [{ name: "Ali Şahin", role: "songwriter" }, { name: "Zeynep Kara", role: "vocalist" }],
    status: "confirmed",
    notes: "EP'nin kalan 2 parçası için söz tamamlama.",
  },
  {
    id: "b10",
    title: "İstanbul Konseri Canlı Yayın",
    type: "live_stream",
    resource: "control_room",
    day: 6, startHour: 19, durationH: 4,
    bookedBy: [{ name: "Selin Öztürk", role: "admin" }, { name: "Can Demir", role: "engineer" }],
    status: "pending", totalPrice: 8000,
    notes: "YouTube + Instagram canlı yayın. 4 kamera setup.",
  },
  {
    id: "b11",
    title: "Derin Sular Final Master",
    type: "mastering",
    resource: "mix_room",
    day: 5, startHour: 10, durationH: 3,
    bookedBy: [{ name: "Can Demir", role: "engineer" }],
    beat: { id: "4", title: "Derin Sular" },
    status: "confirmed", totalPrice: 5250,
  },
  {
    id: "b12",
    title: "Misafir Sanatçı — Vokal Kayıt",
    type: "recording",
    resource: "studio_a",
    day: 4, startHour: 20, durationH: 3,
    bookedBy: [{ name: "Mert Yılmaz", role: "producer" }],
    status: "pending",
    notes: "A.Ş. - featured artist. NDA imzalandı.",
  },
];

const STATUS_STYLE: Record<Booking["status"], string> = {
  confirmed: "bg-neon-green/20 text-neon-green border-neon-green/30",
  pending: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function StudioCalendarPage() {
  const [activeResources, setActiveResources] = React.useState<ResourceKey[]>(
    RESOURCES.map(r => r.key)
  );
  const [activeTypes, setActiveTypes] = React.useState<BookingType[]>(
    ["recording", "mixing", "mastering", "production", "rehearsal", "meeting", "live_stream", "other"]
  );
  const [viewMode, setViewMode] = React.useState<"week" | "resource" | "day">("week");
  const [search, setSearch] = React.useState("");

  const todayBookings = BOOKINGS.filter(b => b.day === 4);
  const totalHours = BOOKINGS.reduce((acc, b) => acc + b.durationH, 0);
  const totalRevenue = BOOKINGS.reduce((acc, b) => acc + (b.totalPrice ?? 0), 0);

  const filteredBookings = React.useMemo(() =>
    BOOKINGS.filter(b => {
      if (!activeResources.includes(b.resource)) return false;
      if (!activeTypes.includes(b.type)) return false;
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()) &&
        !b.bookedBy.some(by => by.name.toLowerCase().includes(search.toLowerCase())))
        return false;
      return true;
    }), [activeResources, activeTypes, search]);

  const resourceUtil = React.useMemo(() => {
    return RESOURCES.map(r => {
      const hours = filteredBookings.filter(b => b.resource === r.key).reduce((a, b) => a + b.durationH, 0);
      const maxHours = 7 * 12; // 7 gün x 12 saat
      return { ...r, hours, pct: Math.min(100, Math.round((hours / maxHours) * 100)) };
    });
  }, [filteredBookings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" className="!px-2 !text-[10px] tracking-wider">
              <CalendarDays className="w-3 h-3 mr-1.5" />
              STUDIO BOOKING
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {filteredBookings.length} randevu · {totalHours} saat · {formatPrice(totalRevenue, "TRY")}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Stüdyo Takvimi</h1>
          <p className="text-muted-foreground">Kayıt, mix, mastering odalarını ve kaynakları planla</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl border border-white/5 bg-white/[0.02]">
            <Button variant="ghost" size="iconSm"><ChevronLeft className="w-4 h-4" /></Button>
            <div className="px-3 text-xs font-medium">14 — 20 Eylül 2026</div>
            <Button variant="ghost" size="iconSm"><ChevronRight className="w-4 h-4" /></Button>
          </div>
          <Button variant="outline" size="sm">
            <CalendarCheck2 className="w-4 h-4 mr-1.5" />
            Bugüne Atla
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Yeni Randevu
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Bugünkü Randevu", value: todayBookings.length, sub: `${todayBookings.reduce((a, b) => a + b.durationH, 0)} saat dolu`, color: "from-primary to-secondary", icon: CalendarDays },
          { label: "Onaylanan", value: BOOKINGS.filter(b => b.status === "confirmed").length, sub: "Bu hafta", color: "from-neon-green to-accent", icon: CheckCircle2 },
          { label: "Bekleyen", value: BOOKINGS.filter(b => b.status === "pending").length, sub: "Onay gerekiyor", color: "from-neon-orange to-neon-pink", icon: Clock3 },
          { label: "Tahmini Ciro", value: formatPrice(totalRevenue, "TRY"), sub: "Haftalık", color: "from-neon-cyan to-secondary", icon: Timer },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4 relative overflow-hidden">
              <div className={cn("absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br opacity-15 blur-3xl", s.color)} />
              <CardContent className="p-0 relative">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="muted" className="!text-[10px] !px-2">{s.label}</Badge>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold tabular-nums mb-0.5">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.sub}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters + Resource toggles */}
      <Card className="p-4">
        <CardContent className="p-0 space-y-3">
          <div className="grid md:grid-cols-7 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Randevu veya kişi ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="md:col-span-3 flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5 overflow-x-auto">
              {RESOURCES.map(r => {
                const Icon = r.icon;
                const active = activeResources.includes(r.key);
                return (
                  <button
                    key={r.key}
                    onClick={() => setActiveResources(active
                      ? activeResources.filter(k => k !== r.key)
                      : [...activeResources, r.key])}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all",
                      active
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {r.name.split(" — ")[0]}
                  </button>
                );
              })}
            </div>
            <div className="md:col-span-1 flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/5">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
                <TabsList className="w-full !bg-transparent !p-0">
                  <TabsTrigger value="week" className="!text-[11px] !py-1 flex-1">Hafta</TabsTrigger>
                  <TabsTrigger value="resource" className="!text-[11px] !py-1 flex-1">Kaynak</TabsTrigger>
                  <TabsTrigger value="day" className="!text-[11px] !py-1 flex-1">Gün</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="flex-1">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                Filtre
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Türü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Türler</SelectItem>
                  {(["recording","mixing","mastering","production","rehearsal","meeting"] as BookingType[]).map(t => (
                    <SelectItem key={t} value={t}>{BOOKING_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resource utilization */}
          <div className="grid md:grid-cols-5 gap-3 pt-2">
            {resourceUtil.map(r => {
              const Icon = r.icon;
              return (
                <div key={r.key} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-6 h-6 rounded-lg bg-gradient-to-br flex items-center justify-center", r.color)}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[11px] font-semibold truncate max-w-[90px]">{r.name.split(" — ")[0]}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{r.hours}s</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-1">
                    <div className={cn("h-full rounded-full bg-gradient-to-r", r.color)} style={{ width: `${r.pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground font-mono">
                    <span>%{r.pct} doluluk</span>
                    <span>{formatPrice(r.hourly, "TRY")}/saat</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ==== WEEK VIEW ==== */}
      {viewMode === "week" && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Days header */}
              <div className="grid grid-cols-[70px_repeat(7,1fr)] border-b border-white/5 bg-white/[0.02]">
                <div className="p-3 border-r border-white/5 sticky left-0 bg-card z-10" />
                {WEEK_DAYS.map((d) => (
                  <div
                    key={d.d}
                    className={cn(
                      "p-3 border-r border-white/5 last:border-r-0 text-center",
                      d.isToday && "bg-primary/[0.06]",
                      d.isWeekend && "bg-white/[0.015]"
                    )}
                  >
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{d.day}</div>
                    <div className={cn(
                      "text-2xl font-bold tabular-nums",
                      d.isToday && "bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent"
                    )}>
                      {d.date}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">{d.month}</div>
                    <div className="mt-1">
                      {d.isToday && (
                        <Badge variant="success" className="!text-[8px] !px-1.5">BUGÜN</Badge>
                      )}
                      {filteredBookings.filter(b => b.day === d.d).length > 0 && !d.isToday && (
                        <Badge variant="muted" className="!text-[8px] !px-1.5">
                          {filteredBookings.filter(b => b.day === d.d).length} randevu
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours grid */}
              <div className="grid grid-cols-[70px_repeat(7,1fr)] relative">
                {HOURS.map((h) => (
                  <React.Fragment key={h}>
                    {/* Hour label */}
                    <div
                      className="p-2 border-r border-b border-white/5 bg-white/[0.01] sticky left-0 bg-card z-10 text-[10px] text-muted-foreground font-mono text-right pr-3 h-[88px]"
                    >
                      {String(h).padStart(2, "0")}:00
                    </div>
                    {/* Day cells */}
                    {WEEK_DAYS.map((d) => (
                      <div
                        key={`${d.d}-${h}`}
                        className={cn(
                          "relative border-r border-b border-white/5 last:border-r-0 h-[88px]",
                          d.isToday && "bg-primary/[0.02]",
                          d.isWeekend && "bg-white/[0.008]",
                          (h < 12 || h >= 22) && "bg-white/[0.005]"
                        )}
                      >
                        {/* Current time indicator */}
                        {d.isToday && h === 14 && (
                          <div className="absolute top-3 left-0 right-0 h-px bg-gradient-to-r from-primary via-neon-pink to-secondary z-10" />
                        )}
                        {d.isToday && h === 14 && (
                          <div className="absolute top-2 left-0 w-2 h-2 rounded-full bg-neon-pink shadow-[0_0_8px_hsl(var(--neon-pink))] -translate-y-1 -translate-x-1 z-10" />
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}

                {/* Bookings overlay */}
                {filteredBookings.map((b) => {
                  const resource = RESOURCES.find(r => r.key === b.resource)!;
                  const top = ((b.startHour - 9) * 88) + 4;
                  const height = (b.durationH * 88) - 6;
                  const left = 70 + (b.day * 100 / 7) + (b.day === 0 ? 0 : 0);
                  return null; // placeholder; grid positioning via absolute below
                })}
              </div>

              {/* Positioned bookings (absolute over the grid) */}
              <div className="grid grid-cols-[70px_repeat(7,1fr)] relative -mt-[1320px] pointer-events-none pb-0">
                <div />
                {WEEK_DAYS.map((d) => (
                  <div key={`pos-${d.d}`} className="relative border-r border-white/0 last:border-r-0 h-[1320px]">
                    {filteredBookings.filter(b => b.day === d.d).map((b) => {
                      const resource = RESOURCES.find(r => r.key === b.resource)!;
                      const top = ((b.startHour - 9) * 88) + 2;
                      const height = (b.durationH * 88) - 4;
                      return (
                        <div
                          key={b.id}
                          className={cn(
                            "absolute left-1 right-1 rounded-lg p-2 overflow-hidden pointer-events-auto cursor-pointer transition-all hover:z-20 hover:shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.4)]",
                            "bg-gradient-to-br text-white",
                            TYPE_COLORS[b.type],
                            "opacity-95 backdrop-blur-sm",
                            b.status === "cancelled" && "line-through opacity-50",
                            b.status === "pending" && "ring-2 ring-white/20 ring-dashed"
                          )}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <div className="w-full h-full flex flex-col gap-1 overflow-hidden">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1 min-w-0">
                                <resource.icon className="w-3 h-3 shrink-0" />
                                <span className="text-[10px] font-bold truncate leading-tight">{b.title}</span>
                              </div>
                              <span className="text-[9px] bg-black/25 backdrop-blur-sm px-1 rounded font-mono shrink-0">
                                {String(b.startHour).padStart(2, "0")}:00
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] bg-black/20 px-1.5 py-0.5 rounded font-mono shrink-0">
                                {b.durationH}s
                              </span>
                              <span className="text-[9px] opacity-90 truncate">
                                {resource.name.split(" — ")[0]}
                              </span>
                            </div>
                            <div className="mt-auto">
                              <AvatarGroup size="xs" className="justify-start">
                                {b.bookedBy.slice(0, 3).map((by, i) => (
                                  <Avatar key={i} name={by.name} size="xs" />
                                ))}
                              </AvatarGroup>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="h-[1320px]" />
            </div>
          </div>
        </Card>
      )}

      {/* ==== RESOURCE VIEW ==== */}
      {viewMode === "resource" && (
        <div className="space-y-4">
          {RESOURCES.filter(r => activeResources.includes(r.key)).map(r => {
            const Icon = r.icon;
            const rbookings = filteredBookings.filter(b => b.resource === r.key).sort((a, b) => a.day - b.day || a.startHour - b.startHour);
            return (
              <Card key={r.key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", r.color)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{r.name}</CardTitle>
                        <CardDescription className="text-xs flex items-center gap-2 mt-0.5">
                          <span><Users className="inline w-3 h-3 mr-0.5" />{r.capacity} kişi kapasite</span>
                          <span>·</span>
                          <span>{formatPrice(r.hourly, "TRY")}/saat</span>
                          <span>·</span>
                          <span>{rbookings.length} randevu</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                      Rezerve Et
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {rbookings.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground italic rounded-xl bg-white/[0.015] border border-dashed border-white/10">
                      Bu kaynak için bu hafta henüz randevu yok
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {rbookings.map((b) => {
                        const d = WEEK_DAYS.find(w => w.d === b.day)!;
                        return (
                          <div key={b.id} className="group p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/20 transition-all">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div className={cn(
                                  "w-14 rounded-lg p-2 text-center bg-gradient-to-br flex-shrink-0 text-white shadow-md",
                                  TYPE_COLORS[b.type]
                                )}>
                                  <div className="text-[9px] uppercase tracking-wider opacity-90">{d.day}</div>
                                  <div className="text-lg font-bold tabular-nums leading-none my-0.5">{d.date}</div>
                                  <div className="text-[9px] font-mono opacity-90">
                                    {String(b.startHour).padStart(2, "0")}:00
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                    <h4 className="font-semibold text-sm truncate">{b.title}</h4>
                                    <Badge variant="muted" className={cn("!text-[8px] !px-1.5", STATUS_STYLE[b.status])}>
                                      {b.status === "confirmed" ? "Onaylandı" : b.status === "pending" ? "Bekliyor" : "İptal"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2 flex-wrap">
                                    <span className="inline-flex items-center gap-1">
                                      <Clock3 className="w-3 h-3" />
                                      {formatDuration(b.durationH * 60)}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <Coffee className="w-3 h-3" />
                                      {(() => { const C: any = BOOKING_TYPE_LABELS; return C[b.type]; })()}
                                    </span>
                                    {b.totalPrice && (
                                      <span className="inline-flex items-center gap-1">
                                        <span className="font-mono text-neon-green font-semibold">
                                          {formatPrice(b.totalPrice, "TRY")}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-muted-foreground">Katılımcılar:</span>
                                      <AvatarGroup size="xs">
                                        {b.bookedBy.map((by, i) => (
                                          <Avatar key={i} name={by.name} size="xs" />
                                        ))}
                                      </AvatarGroup>
                                    </div>
                                    {b.engineer && (
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] text-muted-foreground">Mühendis:</span>
                                        <div className="flex items-center gap-1.5">
                                          <Avatar name={b.engineer.name} size="xs" />
                                          <span className="text-[10px]">{b.engineer.name}</span>
                                        </div>
                                      </div>
                                    )}
                                    {b.beat && (
                                      <Badge variant="outline" className="!text-[9px] !px-1.5">
                                        <Disc3 className="w-2 h-2 mr-1" />
                                        {b.beat.title}
                                      </Badge>
                                    )}
                                  </div>
                                  {b.notes && (
                                    <div className="mt-2 text-[11px] text-muted-foreground italic p-2 rounded-lg bg-white/[0.015] border border-white/5">
                                      📝 {b.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ==== DAY VIEW (today) ==== */}
      {viewMode === "day" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarCheck2 className="w-4 h-4 text-primary" />
                      Bugünün Planı
                    </CardTitle>
                    <CardDescription className="text-xs">
                      18 Eylül 2026 · Cuma · {todayBookings.length} randevu
                    </CardDescription>
                  </div>
                  <Badge variant="success" className="!text-[9px]">CANLI</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {todayBookings.sort((a, b) => a.startHour - b.startHour).map(b => {
                  const r = RESOURCES.find(x => x.key === b.resource)!;
                  const Icon = r.icon;
                  return (
                    <div
                      key={b.id}
                      className={cn(
                        "p-3 rounded-xl border transition-all",
                        "bg-gradient-to-br opacity-95 text-white",
                        TYPE_COLORS[b.type],
                        "hover:scale-[1.01] hover:shadow-lg cursor-pointer"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-[10px] font-mono opacity-90 mb-1">
                            {String(b.startHour).padStart(2, "0")}:00 — {String(b.startHour + b.durationH).padStart(2, "0")}:00
                          </div>
                          <div className="font-bold text-sm leading-snug mb-0.5">{b.title}</div>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-black/25 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] opacity-90">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          {r.name.split(" — ")[0]}
                        </span>
                        <span>{b.durationH} saat</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                        <AvatarGroup size="xs">
                          {b.bookedBy.map((by, i) => (
                            <Avatar key={i} name={by.name} size="xs" />
                          ))}
                        </AvatarGroup>
                        <Badge variant="muted" className={cn("!text-[8px] !px-1.5 !bg-black/25 !text-white !border-white/20", STATUS_STYLE[b.status])}>
                          {b.status === "confirmed" ? "Onay" : "Bekliyor"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                {/* Break slots */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center gap-2 text-muted-foreground">
                  <Coffee className="w-4 h-4" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">Öğle Arası</div>
                    <div className="text-[10px]">12:30 — 13:30 (otomatik engellendi)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" />
                  Gün İçi Detaylı Zaman Çizelgesi
                </CardTitle>
                <CardDescription className="text-xs">Her kaynak için 15 dakikalık dilimler</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-[90px_repeat(5,1fr)] gap-0 border border-white/5 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="p-3 border-r border-b border-white/5 bg-white/[0.03]" />
                  {RESOURCES.map(r => {
                    const Icon = r.icon;
                    return (
                      <div key={r.key} className="p-3 border-r border-b border-white/5 last:border-r-0 bg-white/[0.02] text-center">
                        <div className={cn("w-8 h-8 rounded-lg mx-auto bg-gradient-to-br flex items-center justify-center mb-1", r.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-[10px] font-semibold leading-tight">{r.name.split(" — ")[0]}</div>
                      </div>
                    );
                  })}

                  {/* Rows: 10:00 to 23:00 */}
                  {HOURS.filter(h => h >= 10 && h <= 23).map(h => (
                    <React.Fragment key={h}>
                      <div className="p-2 border-r border-b border-white/5 last:border-b-0 text-[10px] font-mono text-right text-muted-foreground pr-3 flex items-center justify-end">
                        {String(h).padStart(2, "0")}:00
                      </div>
                      {RESOURCES.map(r => {
                        const booking = todayBookings.find(b =>
                          b.resource === r.key && h >= b.startHour && h < b.startHour + b.durationH
                        );
                        const isStart = booking && booking.startHour === h;
                        const span = booking ? booking.durationH : 1;
                        if (booking && !isStart) return null;
                        return (
                          <div
                            key={`${h}-${r.key}`}
                            rowSpan={booking ? booking.durationH : 1}
                            className={cn(
                              "border-r border-b border-white/5 last:border-r-0 relative",
                              booking
                                ? cn("bg-gradient-to-br text-white p-1", TYPE_COLORS[booking.type])
                                : "h-[60px] hover:bg-primary/[0.04] cursor-pointer group"
                            )}
                            style={booking ? { minHeight: `${60 * span}px` } : undefined}
                          >
                            {booking ? (
                              <div className="w-full h-full flex flex-col">
                                <div className="text-[10px] font-bold truncate leading-tight p-1">{booking.title}</div>
                                <div className="mt-auto p-1 text-[9px] bg-black/25 backdrop-blur-sm rounded mx-1 mb-1">
                                  {formatDuration(booking.durationH * 60)}
                                </div>
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlusCircle className="w-4 h-4 text-primary" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-neon-orange" />
                  Çakışma & Uyarılar
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {[
                  { type: "warn", title: "Stüdyo A — Cumartesi 12:00 prova ile Can Demir arasında çakışma riski", sub: "Can Demir aynı anda Mix Room'da mastering yapmakta" },
                  { type: "info", title: "Kontrol Odası — SSL konsol kalibrasyonu Pazar 10:00", sub: "2 saat planlanmış servis aralığı" },
                  { type: "warn", title: "Midnight Vibes mastering (Bugün 15:00) henüz onaylanmadı", sub: "Mühendis onayı bekleniyor" },
                ].map((w, i) => (
                  <div key={i} className={cn(
                    "p-3 rounded-xl border flex items-start gap-3",
                    w.type === "warn" ? "bg-neon-orange/[0.04] border-neon-orange/20" : "bg-primary/[0.03] border-primary/20"
                  )}>
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                      w.type === "warn" ? "bg-neon-orange/15 text-neon-orange" : "bg-primary/15 text-primary"
                    )}>
                      {w.type === "warn" ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-0.5">{w.title}</div>
                      <div className="text-[10px] text-muted-foreground">{w.sub}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Legend */}
      <Card className="p-4">
        <CardContent className="p-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Randevu Türleri</div>
          <div className="flex flex-wrap gap-2">
            {(["recording", "mixing", "mastering", "production", "rehearsal", "meeting", "live_stream"] as BookingType[]).map(t => (
              <div key={t} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                <span className={cn("w-2.5 h-2.5 rounded-full bg-gradient-to-r", TYPE_COLORS[t])} />
                <span className="text-[11px] font-medium">
                  {(() => { const C: any = BOOKING_TYPE_LABELS; return C[t]; })()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
