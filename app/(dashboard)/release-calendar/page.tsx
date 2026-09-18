"use client";

import * as React from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  CalendarPlus2,
  Disc3,
  Album,
  Music4,
  Sparkles,
  Clock3,
  Tag,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  Users,
  Share2,
  ArrowRight,
  ExternalLink,
  MoreHorizontal,
  Target,
  Percent,
  Rocket,
  Star,
  GripVertical,
  Music2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn, formatDate, formatPrice, timeAgo } from "@/lib/utils";

type ReleaseType = "Single" | "EP" | "Albüm" | "Remix" | "Compilation";
type ReleaseStatus = "Gelecek" | "Pre-Save" | "Yakında" | "Yayında" | "Tasarım" | "İptal";
type Platform = "Spotify" | "Apple" | "YouTube" | "TikTok" | "Deezer" | "Amazon";

interface Release {
  id: string;
  title: string;
  artist: string;
  type: ReleaseType;
  status: ReleaseStatus;
  date: string; // YYYY-MM-DD
  tracks?: number;
  duration?: number; // dk
  genre: string;
  label: string;
  distributor: string;
  imageAccent: string;
  Icon: any;
  platforms: Platform[];
  art?: boolean;
  mixing?: boolean;
  mastering?: boolean;
  metadata?: boolean;
  preSaveLink?: boolean;
  coverWork?: boolean;
  pressKit?: boolean;
  manager?: string;
  engineer?: string;
  goal: string;
  expected?: number;
  streams?: number;
  sales?: number;
  playlists?: number;
  colors: string[];
  notes?: string;
}

const TYPE_STYLE: Record<ReleaseType, { gradient: string; pill: string; label: string; Icon: any }> = {
  Single: { gradient: "from-primary to-neon-pink", pill: "bg-primary/15 text-primary border-primary/25", label: "Single", Icon: Disc3 },
  EP: { gradient: "from-neon-cyan via-secondary to-primary", pill: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/25", label: "EP", Icon: Album },
  Albüm: { gradient: "from-neon-purple via-primary to-secondary", pill: "bg-neon-purple/15 text-neon-purple border-neon-purple/25", label: "Albüm", Icon: Music4 },
  Remix: { gradient: "from-neon-orange via-destructive to-neon-pink", pill: "bg-neon-orange/15 text-neon-orange border-neon-orange/25", label: "Remix", Icon: Sparkles },
  Compilation: { gradient: "from-neon-green via-accent to-neon-cyan", pill: "bg-neon-green/15 text-neon-green border-neon-green/25", label: "Compilation", Icon: Sparkles },
};

const STATUS_STYLE: Record<ReleaseStatus, string> = {
  Gelecek: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/25",
  "Pre-Save": "bg-primary/15 text-primary border-primary/25",
  Yakında: "bg-neon-orange/15 text-neon-orange border-neon-orange/25",
  Yayında: "bg-neon-green/15 text-neon-green border-neon-green/25",
  Tasarım: "bg-secondary/15 text-secondary border-secondary/25",
  İptal: "bg-destructive/15 text-destructive border-destructive/25",
};

const PLATFORM_ICON: Partial<Record<Platform, any>> = {};
const PLATFORM_PILL: Record<Platform, string> = {
  Spotify: "bg-[#1DB954]/15 text-[#1DB954] border-[#1DB954]/25",
  Apple: "bg-[#FC3C44]/15 text-[#FC3C44] border-[#FC3C44]/25",
  YouTube: "bg-[#FF0000]/15 text-[#FF0000] border-[#FF0000]/25",
  TikTok: "bg-[#25F4EE]/15 text-[#25F4EE] border-[#25F4EE]/25",
  Deezer: "bg-[#00C7F2]/15 text-[#00C7F2] border-[#00C7F2]/25",
  Amazon: "bg-[#FF9900]/15 text-[#FF9900] border-[#FF9900]/25",
};

const RELEASES: Release[] = [
  {
    id: "rl1", title: "Aurora Lights", artist: "Can Demir",
    type: "Albüm", status: "Yakında", date: "2026-09-18",
    tracks: 12, duration: 44, genre: "Alt R&B / Pop",
    label: "Arnix Records", distributor: "The Orchard",
    imageAccent: "from-primary via-neon-purple to-neon-pink",
    Icon: Music4,
    platforms: ["Spotify", "Apple", "YouTube", "TikTok", "Deezer"],
    art: true, mixing: true, mastering: true, metadata: true, preSaveLink: true, coverWork: true, pressKit: true,
    manager: "Ayşe Yılmaz", engineer: "Can Demir",
    goal: "Resmi albüm lansmanı, 5 playlist girişi",
    expected: 500_000, streams: 0, sales: 0, playlists: 5,
    colors: ["#a855f7", "#ec4899", "#06b6d4"],
    notes: "Lansman konseri 25 Eylül Harbiye",
  },
  {
    id: "rl2", title: "Midnight Pulse", artist: "Ege Yıldız",
    type: "Single", status: "Gelecek", date: "2026-09-27",
    tracks: 1, duration: 3, genre: "House / Dance",
    label: "Arnix Records", distributor: "DistroKid",
    imageAccent: "from-neon-cyan via-accent to-neon-green",
    Icon: Disc3,
    platforms: ["Spotify", "Apple", "TikTok"],
    art: true, mixing: true, mastering: true, metadata: true, preSaveLink: true, coverWork: true, pressKit: false,
    manager: "Ayşe Yılmaz", engineer: "Ege Yıldız",
    goal: "Spotify Turkey Dance playlist",
    expected: 120_000, playlists: 2,
    colors: ["#06b6d4", "#10b981", "#22d3ee"],
  },
  {
    id: "rl3", title: "Sinyal (EP)", artist: "Kaan Arslan",
    type: "EP", status: "Pre-Save", date: "2026-10-03",
    tracks: 6, duration: 21, genre: "Trap / Rap",
    label: "Arnix Records", distributor: "The Orchard",
    imageAccent: "from-neon-orange via-neon-pink to-destructive",
    Icon: Album,
    platforms: ["Spotify", "Apple", "YouTube", "Deezer", "Amazon"],
    art: true, mixing: true, mastering: true, metadata: true, preSaveLink: true, coverWork: true, pressKit: true,
    manager: "Burak Koç", engineer: "Mert Şahin",
    goal: "Müzik marketleri 1. sıra, 4 official playlist",
    expected: 280_000, playlists: 4,
    colors: ["#f97316", "#ec4899", "#ef4444"],
    notes: "Presave kampanyası başladı · 8.200 kayıt",
  },
  {
    id: "rl4", title: "Dedikodu", artist: "Zeynep Kaya",
    type: "Single", status: "Tasarım", date: "2026-10-10",
    tracks: 1, duration: 3, genre: "Pop",
    label: "Arnix Records", distributor: "Believe",
    imageAccent: "from-neon-pink via-primary to-neon-purple",
    Icon: Disc3,
    platforms: ["Spotify", "Apple", "YouTube", "TikTok"],
    art: false, mixing: true, mastering: true, metadata: false, preSaveLink: false, coverWork: false, pressKit: false,
    manager: "Burak Koç", engineer: "Zeynep Kaya",
    goal: "TikTok viral + 1M streams ilk 2 hafta",
    expected: 420_000,
    colors: ["#ec4899", "#a855f7", "#6366f1"],
    notes: "Vocal mastering devam ediyor, kapak fotoğrafı çekilecek",
  },
  {
    id: "rl5", title: "Arnix Vol. 1 (Comp)", artist: "Various Artists",
    type: "Compilation", status: "Gelecek", date: "2026-10-24",
    tracks: 18, duration: 62, genre: "Karışık / Label Comp",
    label: "Arnix Records", distributor: "The Orchard",
    imageAccent: "from-neon-purple via-secondary to-neon-cyan",
    Icon: Sparkles,
    platforms: ["Spotify", "Apple", "YouTube", "TikTok", "Deezer", "Amazon"],
    art: true, mixing: true, mastering: true, metadata: false, preSaveLink: false, coverWork: true, pressKit: false,
    manager: "Ayşe Yılmaz", engineer: "Mert Şahin",
    goal: "Label awareness, 3 major editorial",
    expected: 320_000, playlists: 3,
    colors: ["#a855f7", "#64748b", "#06b6d4"],
  },
  {
    id: "rl6", title: "Gece Rüzgârı (Remixes)", artist: "Can Demir",
    type: "Remix", status: "Tasarım", date: "2026-11-01",
    tracks: 5, duration: 22, genre: "Remix Pack",
    label: "Arnix Records", distributor: "The Orchard",
    imageAccent: "from-neon-green via-accent to-neon-cyan",
    Icon: Sparkles,
    platforms: ["Spotify", "Apple", "Deezer", "Amazon"],
    art: false, mixing: true, mastering: false, metadata: false, preSaveLink: false, coverWork: false, pressKit: false,
    manager: "Ayşe Yılmaz", engineer: "Ege Yıldız",
    goal: "Beatport chart giriş + club promo",
    expected: 90_000, playlists: 1,
    colors: ["#10b981", "#06b6d4", "#22d3ee"],
  },
  {
    id: "rl7", title: "İlkbahar", artist: "Zeynep Kaya",
    type: "Albüm", status: "Gelecek", date: "2026-11-28",
    tracks: 14, duration: 51, genre: "Pop / Türkçe Pop",
    label: "Arnix Records", distributor: "Believe",
    imageAccent: "from-primary via-neon-cyan to-secondary",
    Icon: Music4,
    platforms: ["Spotify", "Apple", "YouTube", "TikTok", "Deezer", "Amazon"],
    art: false, mixing: true, mastering: false, metadata: false, preSaveLink: false, coverWork: false, pressKit: false,
    manager: "Burak Koç", engineer: "Zeynep Kaya",
    goal: "Yıl sonu promo turu · 1M streams",
    expected: 1_200_000,
    colors: ["#a855f7", "#06b6d4", "#64748b"],
  },
  {
    id: "rl8", title: "Neon Düşler", artist: "Mert Şahin",
    type: "Single", status: "Yayında", date: "2026-08-14",
    tracks: 1, duration: 3, genre: "Synth Pop",
    label: "Arnix Records", distributor: "DistroKid",
    imageAccent: "from-neon-orange via-neon-pink to-primary",
    Icon: Disc3,
    platforms: ["Spotify", "Apple", "YouTube", "TikTok"],
    art: true, mixing: true, mastering: true, metadata: true, preSaveLink: true, coverWork: true, pressKit: true,
    manager: "Ayşe Yılmaz", engineer: "Mert Şahin",
    goal: "Radyo rota + 2 editorial",
    expected: 180_000,
    streams: 128_400, sales: 1_248, playlists: 3,
    colors: ["#f97316", "#ec4899", "#a855f7"],
    notes: "6 haftada 128K stream · +28% geçen hafta",
  },
  {
    id: "rl9", title: "Yıldızlar", artist: "Kaan Arslan",
    type: "Single", status: "Yayında", date: "2026-07-22",
    tracks: 1, duration: 3, genre: "Trap / Rap",
    label: "Arnix Records", distributor: "The Orchard",
    imageAccent: "from-neon-cyan via-primary to-neon-purple",
    Icon: Disc3,
    platforms: ["Spotify", "Apple", "YouTube", "TikTok"],
    art: true, mixing: true, mastering: true, metadata: true, preSaveLink: true, coverWork: true, pressKit: true,
    manager: "Burak Koç", engineer: "Kaan Arslan",
    goal: "Rap Türkiye #10",
    expected: 350_000,
    streams: 392_620, sales: 1_840, playlists: 5,
    colors: ["#06b6d4", "#a855f7", "#6366f1"],
    notes: "Beklenenden %12 iyi · Rakip çalışma listesi",
  },
  {
    id: "rl10", title: "Kalan Şarkılar", artist: "Can Demir",
    type: "EP", status: "Yayında", date: "2026-05-09",
    tracks: 5, duration: 17, genre: "R&B / Soul",
    label: "Arnix Records", distributor: "The Orchard",
    imageAccent: "from-neon-purple via-destructive to-neon-orange",
    Icon: Album,
    platforms: ["Spotify", "Apple", "YouTube", "TikTok", "Deezer"],
    art: true, mixing: true, mastering: true, metadata: true, preSaveLink: true, coverWork: true, pressKit: true,
    manager: "Ayşe Yılmaz", engineer: "Can Demir",
    goal: "R&B Türkiye #3",
    expected: 600_000,
    streams: 712_480, sales: 2_960, playlists: 7,
    colors: ["#a855f7", "#ef4444", "#f97316"],
    notes: "4.5 ayda 712K · Sertifika bekleniyor (Silver)",
  },
];

const CHECKLIST: { key: keyof Pick<Release, "art"|"mixing"|"mastering"|"metadata"|"preSaveLink"|"coverWork"|"pressKit">; label: string; Icon: any }[] = [
  { key: "art", label: "Sanatçı Onayı", Icon: CheckCircle2 },
  { key: "mixing", label: "Mix Bitti", Icon: CheckCircle2 },
  { key: "mastering", label: "Mastering", Icon: CheckCircle2 },
  { key: "metadata", label: "Metadata", Icon: Tag },
  { key: "coverWork", label: "Kapak Tasarımı", Icon: Sparkles },
  { key: "preSaveLink", label: "Pre-Save", Icon: Rocket },
  { key: "pressKit", label: "Press Kit", Icon: Users },
];

// Ay isimleri
const MONTHS_TR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y: number, m: number) {
  const d = new Date(y, m, 1).getDay(); // 0 Sun .. 6 Sat
  return (d + 6) % 7; // 0 Pzt .. 6 Paz
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function parseDate(s: string): Date { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }

export default function ReleaseCalendarPage() {
  const now = new Date();
  const [cursor, setCursor] = React.useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
  const [view, setView] = React.useState<"month" | "timeline" | "pipeline">("month");
  const [filterType, setFilterType] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [selectedId, setSelectedId] = React.useState<string>("rl1");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const totalDays = daysInMonth(year, month);
  const firstWD = firstWeekday(year, month);
  const grid: (Date | null)[] = [];
  for (let i = 0; i < firstWD; i++) grid.push(null);
  for (let d = 1; d <= totalDays; d++) grid.push(new Date(year, month, d));
  while (grid.length % 7 !== 0) grid.push(null);

  const selected = RELEASES.find(r => r.id === selectedId) ?? RELEASES[0];

  const filtered = RELEASES.filter(r => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  // Ay ve status bazında stat
  const monthReleases = (y: number, m: number) => filtered.filter(r => {
    const d = parseDate(r.date);
    return d.getFullYear() === y && d.getMonth() === m;
  });
  const stats = {
    total: RELEASES.length,
    upcoming: RELEASES.filter(r => parseDate(r.date) >= new Date(now.getFullYear(), now.getMonth(), now.getDate())).length,
    totalExpected: RELEASES.reduce((a, r) => a + (r.expected ?? 0), 0),
    totalStreams: RELEASES.reduce((a, r) => a + (r.streams ?? 0), 0),
    publishedThisMonth: monthReleases(now.getFullYear(), now.getMonth()).length,
    labels: Array.from(new Set(RELEASES.map(r => r.label))).length,
  };

  const tasks = CHECKLIST.map(c => ({ ...c, val: !!selected[c.key], done: selected[c.key] === true }));
  const doneCount = tasks.filter(t => t.done).length;

  // Timeline görünümü için 8 hafta grid
  const todayWeekStart = (() => {
    const n = new Date();
    const dow = (n.getDay() + 6) % 7;
    n.setDate(n.getDate() - dow);
    return n;
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="info" className="!px-2 !text-[10px] tracking-wider">
              <CalendarDays className="w-3 h-3 mr-1.5" />
              RELEASE ROADMAP
            </Badge>
            <Badge variant="muted" className="!text-[10px]">{stats.upcoming} yaklaşan · {RELEASES.length} toplam</Badge>
            <Badge variant="success" className="!text-[10px]">{stats.totalStreams.toLocaleString("tr-TR")} streams · {formatPrice(stats.totalExpected * 0.004, "TRY")} tahmini gelir</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Yayın Takvimi</h1>
          <p className="text-muted-foreground">Single/EP/Albüm lansman planı — onay listesi, playlist tahmini ve platform takibi</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1.5" />
            Takvimi Paylaş
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            iCS Dışa Aktar
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Yayın Ekle
          </Button>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="p-3 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-neon-pink opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">Toplam</Badge>
              <Disc3 className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-xl font-bold tabular-nums">{stats.total}</div>
            <div className="text-[9px] text-muted-foreground">{stats.labels} label · 4 distributor</div>
          </CardContent>
        </Card>
        <Card className="p-3 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-primary opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">Aylık</Badge>
              <CalendarDays className="w-3.5 h-3.5 text-neon-cyan" />
            </div>
            <div className="text-xl font-bold tabular-nums">{stats.publishedThisMonth}</div>
            <div className="text-[9px] text-muted-foreground">{MONTHS_TR[now.getMonth()]} lansman</div>
          </CardContent>
        </Card>
        <Card className="p-3 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-neon-orange to-neon-pink opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">Yaklaşan</Badge>
              <Rocket className="w-3.5 h-3.5 text-neon-orange" />
            </div>
            <div className="text-xl font-bold tabular-nums text-neon-orange">{stats.upcoming}</div>
            <div className="text-[9px] text-muted-foreground">önümüzdeki 90 gün</div>
          </CardContent>
        </Card>
        <Card className="p-3 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-accent opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">Toplam Stream</Badge>
              <TrendingUp className="w-3.5 h-3.5 text-neon-green" />
            </div>
            <div className="text-xl font-bold tabular-nums">{(stats.totalStreams / 1000).toFixed(1)}K</div>
            <div className="text-[9px] text-neon-green">+18.4% önceki çeyrek</div>
          </CardContent>
        </Card>
        <Card className="p-3 relative overflow-hidden md:col-span-2">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple via-primary to-secondary opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">Tahmini Gelir</Badge>
              <Target className="w-3.5 h-3.5 text-secondary" />
            </div>
            <div className="text-xl font-bold tabular-nums">{formatPrice(stats.totalExpected * 0.004, "TRY")}</div>
            <div className="text-[9px] text-muted-foreground">
              {stats.totalExpected.toLocaleString("tr-TR")} planlanan stream × 0.004₺ (DSP ort)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + view toggle */}
      <Card className="p-4">
        <CardContent className="p-0 grid md:grid-cols-7 gap-3">
          <Tabs
            defaultValue={view}
            onValueChange={(v) => setView(v as any)}
            className="md:col-span-4 w-full"
          >
            <TabsList className="!p-1 w-full grid grid-cols-3">
              <TabsTrigger value="month" className="!text-[11px]">
                <CalendarDays className="w-3 h-3 mr-1.5" />
                Ay Görünümü
              </TabsTrigger>
              <TabsTrigger value="timeline" className="!text-[11px]">
                <GripVertical className="w-3 h-3 mr-1.5" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="!text-[11px]">
                <Target className="w-3 h-3 mr-1.5" />
                Pipeline
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="md:col-span-3 grid grid-cols-3 gap-2">
            <div className="flex items-center justify-between gap-1 rounded-lg border border-white/5 p-1.5 bg-white/[0.02]">
              <Button variant="ghost" size="xs" onClick={() => setCursor(new Date(year, month - 1, 1))}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <div className="text-xs font-semibold whitespace-nowrap">
                {MONTHS_TR[month]} {year}
              </div>
              <Button variant="ghost" size="xs" onClick={() => setCursor(new Date(year, month + 1, 1))}>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <select
              className="bg-white/[0.02] border border-white/5 rounded-lg text-[11px] px-2 py-1 outline-none focus:border-primary/40"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">Tüm Türler</option>
              {(Object.keys(TYPE_STYLE) as ReleaseType[]).map(t => (
                <option key={t} value={t}>{TYPE_STYLE[t].label}</option>
              ))}
            </select>
            <select
              className="bg-white/[0.02] border border-white/5 rounded-lg text-[11px] px-2 py-1 outline-none focus:border-primary/40"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              {(Object.keys(STATUS_STYLE) as ReleaseStatus[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid xl:grid-cols-3 gap-4">
        {/* Sol ana görünüm */}
        <div className="xl:col-span-2 space-y-4">
          <TabsContent value="month">
            <Card className="p-0 overflow-hidden">
              <div className="grid grid-cols-7 bg-white/[0.02] border-b border-white/5">
                {DAYS_TR.map(d => (
                  <div key={d} className="p-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-center border-r border-white/5 last:border-r-0">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {grid.map((dt, i) => {
                  const dayReleases = dt ? monthReleases(dt.getFullYear(), dt.getMonth()).filter(r => parseDate(r.date).getDate() === dt.getDate()) : [];
                  const isToday = dt ? isSameDay(dt, now) : false;
                  const isCursorMonth = dt ? dt.getMonth() === month : false;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "min-h-[110px] border-b border-r border-white/5 p-1.5 transition-colors",
                        (i + 1) % 7 === 0 && "border-r-0",
                        !dt ? "bg-card/60" : isToday ? "bg-primary/5" : !isCursorMonth ? "bg-white/[0.01] text-muted-foreground/50" : ""
                      )}
                    >
                      {dt && (
                        <>
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn(
                              "text-[10px] font-bold tabular-nums w-5 h-5 rounded flex items-center justify-center",
                              isToday && "bg-gradient-to-br from-primary to-secondary text-white shadow-[0_0_10px_hsl(var(--primary)/0.4)]"
                            )}>
                              {dt.getDate()}
                            </span>
                            {dayReleases.length > 0 && (
                              <span className="text-[8px] font-mono px-1 rounded bg-white/5 text-muted-foreground">{dayReleases.length}</span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {dayReleases.slice(0, 3).map(r => {
                              const ts = TYPE_STYLE[r.type];
                              const TIcon = ts.Icon;
                              return (
                                <button
                                  key={r.id}
                                  onClick={() => setSelectedId(r.id)}
                                  className={cn(
                                    "group w-full text-left p-1.5 rounded-md border relative overflow-hidden transition-all",
                                    selectedId === r.id ? "border-primary/50 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]" : "border-transparent hover:border-white/10"
                                  )}
                                >
                                  <div className={cn("absolute inset-0 opacity-15 bg-gradient-to-r", ts.gradient)} />
                                  <div className="relative flex items-center gap-1">
                                    <TIcon className={cn("w-2.5 h-2.5 shrink-0 text-foreground/70")} />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[10px] font-bold truncate leading-tight">{r.title}</div>
                                      <div className="text-[8px] text-muted-foreground truncate leading-tight">{r.artist}</div>
                                    </div>
                                  </div>
                                  <div className="relative flex items-center gap-0.5 mt-0.5 flex-wrap">
                                    <Badge variant="muted" className={cn("!text-[7px] !px-1 !py-0 leading-[11px]", STATUS_STYLE[r.status])}>
                                      {r.status}
                                    </Badge>
                                    <Badge variant="muted" className={cn("!text-[7px] !px-1 !py-0 leading-[11px]", ts.pill)}>
                                      {r.type}
                                    </Badge>
                                  </div>
                                </button>
                              );
                            })}
                            {dayReleases.length > 3 && (
                              <div className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground inline-block">
                                +{dayReleases.length - 3} daha
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="p-4 space-y-6">
              {/* 8 haftalık bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold flex items-center gap-2">
                    <CalendarPlus2 className="w-4 h-4 text-primary" />
                    8 Haftalık Timeline
                  </div>
                  <Badge variant="muted" className="!text-[9px]">
                    {formatDate(todayWeekStart)} — {formatDate(new Date(todayWeekStart.getTime() + (7 * 8 - 1) * 86_400_000))}
                  </Badge>
                </div>
                {/* Haftalar header */}
                <div className="grid grid-cols-8 gap-1 pl-28 mb-1">
                  {Array.from({ length: 8 }, (_, i) => {
                    const d = new Date(todayWeekStart);
                    d.setDate(d.getDate() + i * 7);
                    return (
                      <div key={i} className="text-[9px] text-center font-mono text-muted-foreground">
                        {d.getDate()}/{(d.getMonth() + 1).toString().padStart(2, "0")}
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-1.5">
                  {filtered.slice(0, 8).map(r => {
                    const d = parseDate(r.date);
                    const weekStartIdx = Math.max(0, Math.min(7, Math.round((d.getTime() - todayWeekStart.getTime()) / (7 * 86_400_000))));
                    const ts = TYPE_STYLE[r.type];
                    const TIcon = ts.Icon;
                    const nowPassed = d < now;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className={cn(
                          "grid grid-cols-8 gap-1 items-center cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors",
                          selectedId === r.id && "bg-primary/[0.04] ring-1 ring-primary/30"
                        )}
                      >
                        <div className="col-span-2 pr-2 flex items-center gap-2 min-w-0">
                          <div className={cn("w-7 h-7 rounded-md bg-gradient-to-br flex items-center justify-center shrink-0", ts.gradient)}>
                            <TIcon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold truncate leading-tight">{r.title}</div>
                            <div className="text-[9px] text-muted-foreground truncate leading-tight">{r.artist}</div>
                          </div>
                        </div>
                        <div className="col-span-6 relative h-10 rounded-md bg-white/[0.02] border border-white/5 overflow-hidden">
                          <div
                            className={cn(
                              "absolute top-1 bottom-1 rounded-md flex items-center justify-between px-2 py-1 overflow-hidden",
                              "shadow-[0_0_12px_-3px_hsl(var(--primary)/0.3)]"
                            )}
                            style={{
                              left: `${(weekStartIdx / 8) * 100}%`,
                              width: `${Math.max(12, 100 / 8 - 2)}%`,
                              background: `linear-gradient(90deg, ${r.colors[0]}, ${r.colors[1]}, ${r.colors[2] || r.colors[1]})`,
                              opacity: nowPassed ? 0.85 : 1,
                            }}
                          >
                            <div className="text-white text-[8px] font-bold truncate flex items-center gap-1">
                              <Clock3 className="w-2 h-2" />
                              {formatDate(r.date, "short")}
                            </div>
                            <div className="text-white/90 text-[7.5px] flex items-center gap-0.5 shrink-0">
                              <Badge variant="muted" className="!bg-black/35 !border-white/10 !text-white !text-[7px] !px-1 !py-0 leading-[10px]">
                                {r.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Yaklaşanlar list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-neon-orange" />
                    Yaklaşan Yayınlar
                  </div>
                  <Badge variant="warning" className="!text-[9px]">{stats.upcoming} yayın</Badge>
                </div>
                <div className="space-y-2">
                  {[...RELEASES].filter(r => parseDate(r.date) >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)).sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()).slice(0, 6).map(r => {
                    const ts = TYPE_STYLE[r.type];
                    const TIcon = ts.Icon;
                    const diff = Math.ceil((parseDate(r.date).getTime() - now.getTime()) / 86_400_000);
                    const future = diff >= 0;
                    return (
                      <div key={r.id} onClick={() => setSelectedId(r.id)} className="p-2.5 rounded-xl border border-white/5 hover:border-primary/30 bg-white/[0.02] cursor-pointer transition-all flex items-center gap-3">
                        <div className={cn("relative shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br overflow-hidden flex items-center justify-center", r.imageAccent)}>
                          <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
                            backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 55%)",
                          }} />
                          <TIcon className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={1.4} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold truncate">{r.title}</h3>
                            <Badge variant="muted" className={cn("!text-[8px] !px-1.5", ts.pill)}>{r.type}</Badge>
                            <Badge variant="muted" className={cn("!text-[8px] !px-1.5", STATUS_STYLE[r.status])}>{r.status}</Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">{r.artist} · {r.label} · {r.genre}</div>
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {r.platforms.slice(0, 4).map(p => (
                              <Badge key={p} variant="muted" className={cn("!text-[7.5px] !px-1", PLATFORM_PILL[p])}>
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={cn("text-lg font-bold tabular-nums leading-none",
                            !future ? "text-muted-foreground/60 line-through" :
                            diff <= 3 ? "text-neon-pink" :
                            diff <= 14 ? "text-neon-orange" :
                            "text-neon-cyan"
                          )}>
                            {future ? `${diff}` : `${Math.abs(diff)}`}
                          </div>
                          <div className="text-[9px] text-muted-foreground">{future ? "gün kaldı" : "gün önce"}</div>
                          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{formatDate(r.date, "short")}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline">
            <Card className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-bold flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Lansman Pipeline (Onay Listesi)
                </div>
                <Badge variant="muted" className="!text-[9px]">{CHECKLIST.length} adım · {RELEASES.reduce((a, r) => a + CHECKLIST.filter(c => r[c.key]).length, 0)}/{RELEASES.length * CHECKLIST.length}</Badge>
              </div>
              <div className="grid md:grid-cols-5 gap-3">
                {/* Stages */}
                {(["Tasarım", "Pre-Save", "Yakında", "Yayında"] as ReleaseStatus[]).map((stage, stageIdx) => {
                  const stageReleases = filtered.filter(r => r.status === stage);
                  const pctDone = stageReleases.length > 0
                    ? Math.round(stageReleases.reduce((a, r) => a + (CHECKLIST.filter(c => r[c.key]).length), 0) / (stageReleases.length * CHECKLIST.length) * 100)
                    : 0;
                  return (
                    <div key={stage} className="space-y-2">
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="muted" className={cn("!text-[8px] !px-1.5", STATUS_STYLE[stage])}>{stage}</Badge>
                          <span className="text-[9px] font-bold tabular-nums">{stageReleases.length}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                          <div className={cn("h-full rounded-full bg-gradient-to-r",
                            stageIdx === 0 ? "from-muted-foreground to-muted" :
                            stageIdx === 1 ? "from-primary to-neon-purple" :
                            stageIdx === 2 ? "from-neon-orange to-neon-pink" :
                            "from-neon-green to-accent"
                          )} style={{ width: `${pctDone}%` }} />
                        </div>
                        <div className="text-[9px] text-muted-foreground font-semibold">{pctDone}% tamam</div>
                      </div>
                      <div className="space-y-1.5">
                        {stageReleases.map(r => {
                          const ts = TYPE_STYLE[r.type];
                          const TIcon = ts.Icon;
                          return (
                            <div
                              key={r.id}
                              onClick={() => setSelectedId(r.id)}
                              className={cn(
                                "p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:border-primary/30 cursor-pointer transition-all relative overflow-hidden",
                                selectedId === r.id && "ring-1 ring-primary/40"
                              )}
                            >
                              <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", ts.gradient)} />
                              <div className="pt-1 space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <TIcon className="w-3 h-3 text-primary" />
                                  <div className="text-xs font-bold truncate flex-1 leading-tight">{r.title}</div>
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate leading-tight">{r.artist}</div>
                                <div className="flex items-center gap-0.5">
                                  {CHECKLIST.slice(0, 7).map((c, j) => (
                                    <div key={c.key} className={cn("w-1.5 h-1.5 rounded-full",
                                      r[c.key] ? (
                                        j < 2 ? "bg-primary" :
                                        j < 4 ? "bg-neon-green" :
                                        j < 6 ? "bg-neon-cyan" : "bg-neon-orange"
                                      ) : "bg-white/10"
                                    )} />
                                  ))}
                                </div>
                                <div className="text-[9px] font-mono text-muted-foreground flex items-center justify-between">
                                  <span>{formatDate(r.date, "short")}</span>
                                  <span>{r.playlists ? `${r.playlists} Playlist` : "Hazırlanıyor"}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {stageReleases.length === 0 && (
                          <div className="text-[10px] text-muted-foreground/60 text-center py-5 bg-white/[0.01] rounded-lg border border-dashed border-white/5">
                            Bu aşamada yayın yok
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* İstatistik stat */}
                <div className="md:col-span-5 grid grid-cols-4 gap-2 mt-1">
                  {[
                    { label: "Beklenen Stream", value: `${(stats.totalExpected / 1_000_000).toFixed(2)}M`, Icon: TrendingUp, color: "from-primary to-secondary" },
                    { label: "Onaylanan Maddeler", value: `${(RELEASES.reduce((a, r) => a + CHECKLIST.filter(c => r[c.key]).length, 0) / (RELEASES.length * CHECKLIST.length) * 100).toFixed(0)}%`, Icon: CheckCircle2, color: "from-neon-green to-accent" },
                    { label: "Playlist Hedefi", value: `${RELEASES.reduce((a, r) => a + (r.playlists ?? 0), 0)} toplam`, Icon: Star, color: "from-neon-orange to-neon-pink" },
                    { label: "Aktif Kullanıcı", value: "8 label", Icon: Users, color: "from-neon-cyan to-primary" },
                  ].map(s => (
                    <Card key={s.label} className="p-3">
                      <CardContent className="p-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</span>
                          <div className={cn("w-6 h-6 rounded-md bg-gradient-to-br flex items-center justify-center", s.color)}>
                            <s.Icon className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="text-base font-bold tabular-nums">{s.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </div>

        {/* Seçili yayın detay paneli */}
        <div className="xl:col-span-1 space-y-4">
          <Card className="p-0 overflow-hidden sticky top-4 self-start">
            <div className={cn("h-36 relative bg-gradient-to-br overflow-hidden", selected.imageAccent)}>
              <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3), transparent 55%)`,
              }} />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <Badge variant="muted" className={cn("!text-[8px] !px-1.5 !bg-black/40 backdrop-blur-sm !border-white/10", STATUS_STYLE[selected.status])}>
                  {selected.status}
                </Badge>
                <button className="p-1.5 rounded-md bg-black/30 backdrop-blur-sm ring-1 ring-white/10 text-white">
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1 mb-1">
                  {(() => {
                    const TypeIcon = TYPE_STYLE[selected.type].Icon;
                    return (
                      <Badge variant="muted" className={cn("!text-[7.5px] !px-1 !bg-black/40 !border-white/10", TYPE_STYLE[selected.type].pill)}>
                        <TypeIcon className="w-1.5 h-1.5 mr-0.5" />
                        {selected.type}
                      </Badge>
                    );
                  })()}
                  {selected.tracks && <Badge variant="muted" className="!text-[7.5px] !px-1 !bg-black/40 !border-white/10 text-white">{selected.tracks} parça</Badge>}
                  {selected.duration && <Badge variant="muted" className="!text-[7.5px] !px-1 !bg-black/40 !border-white/10 text-white">{selected.duration} dk</Badge>}
                </div>
                <div className="text-2xl font-bold leading-tight drop-shadow-md">{selected.title}</div>
                <div className="text-[12px] opacity-90 flex items-center gap-1">
                  <Avatar className="w-3.5 h-3.5" />
                  <span>{selected.artist}</span>
                  <span className="opacity-60">·</span>
                  <span>{selected.label}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              {/* Tarih ve Countdown */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/[0.08] to-transparent border border-primary/15">
                  <div className="flex items-center gap-1 text-[9px] uppercase text-muted-foreground font-semibold">
                    <CalendarDays className="w-2.5 h-2.5" />
                    Yayın
                  </div>
                  <div className="text-sm font-bold tabular-nums mt-0.5">{formatDate(selected.date)}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {`${Math.max(0, Math.ceil((parseDate(selected.date).getTime() - now.getTime()) / 86_400_000))} gün sonra`}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-neon-green/[0.08] to-transparent border border-neon-green/15">
                  <div className="flex items-center gap-1 text-[9px] uppercase text-muted-foreground font-semibold">
                    <Percent className="w-2.5 h-2.5" />
                    Hazırlık
                  </div>
                  <div className="text-sm font-bold tabular-nums mt-0.5">{Math.round(doneCount / CHECKLIST.length * 100)}%</div>
                  <div className="h-1 mt-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className={cn("h-full rounded-full bg-gradient-to-r", TYPE_STYLE[selected.type].gradient)}
                      style={{ width: `${Math.round(doneCount / CHECKLIST.length * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Onay listesi */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Onay Listesi</div>
                  <Badge variant="muted" className="!text-[8px]">{doneCount}/{CHECKLIST.length}</Badge>
                </div>
                <div className="space-y-1">
                  {tasks.map(t => (
                    <div key={t.key} className={cn(
                      "flex items-center justify-between p-1.5 rounded-md text-[10.5px] border",
                      t.done
                        ? "bg-neon-green/5 border-neon-green/15 text-neon-green"
                        : "bg-white/[0.02] border-white/5 text-muted-foreground"
                    )}>
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-3.5 h-3.5 rounded-full flex items-center justify-center",
                          t.done ? "bg-neon-green text-background" : "bg-white/5 text-muted-foreground/60"
                        )}>
                          <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={3} />
                        </div>
                        {t.label}
                      </div>
                      <span className="font-mono text-[9px]">{t.done ? "OK" : "Bekliyor"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platformlar */}
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Platformlar</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {selected.platforms.map(p => (
                    <button key={p} className={cn(
                      "p-2 rounded-md border transition-all flex items-center justify-center gap-1 text-[9px] font-semibold",
                      "bg-white/[0.02] border-white/5 hover:border-primary/30 hover:bg-white/[0.04]"
                    )}>
                      <ExternalLink className="w-2 h-2 text-primary" />
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* KPI */}
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Performans</div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {[
                    { label: "Beklenen", value: selected.expected ? `${(selected.expected / 1000).toFixed(1)}K` : "-", c: "text-primary" },
                    { label: "Stream", value: (selected.streams ?? 0) > 0 ? `${((selected.streams ?? 0) / 1000).toFixed(1)}K` : "-", c: "text-neon-green" },
                    { label: "Playlist", value: selected.playlists ?? "-", c: "text-secondary" },
                  ].map(k => (
                    <div key={k.label} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className={cn("text-[8px] uppercase text-muted-foreground")}>{k.label}</div>
                      <div className={cn("text-sm font-bold tabular-nums mt-0.5", k.c)}>{k.value}</div>
                    </div>
                  ))}
                </div>
                {selected.sales !== undefined && selected.sales > 0 && (
                  <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-neon-orange/10 to-neon-pink/10 border border-neon-orange/15 flex items-center justify-between">
                    <div className="text-[10px] font-semibold flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-neon-orange" />
                      Satış Geliri
                    </div>
                    <div className="text-sm font-bold tabular-nums text-neon-orange">{formatPrice(selected.sales * 45, "TRY")}</div>
                  </div>
                )}
              </div>

              {/* Hedef + Ekip */}
              <div className="space-y-3 border-t border-white/5 pt-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Hedef / Not</div>
                  <Card className="p-2.5 bg-primary/[0.03] border-primary/15">
                    <p className="text-[11px] leading-relaxed">{selected.goal}</p>
                  </Card>
                  {selected.notes && (
                    <p className="text-[10.5px] mt-1.5 text-muted-foreground flex items-start gap-1.5">
                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0 text-neon-orange" />
                      {selected.notes}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-muted-foreground mb-0.5 uppercase text-[8px]">Manager</div>
                    <div className="font-semibold flex items-center gap-1">
                      <Avatar className="w-3 h-3" /> {selected.manager}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-muted-foreground mb-0.5 uppercase text-[8px]">Mühendis</div>
                    <div className="font-semibold flex items-center gap-1">
                      <Avatar className="w-3 h-3" /> {selected.engineer}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-muted-foreground mb-0.5 uppercase text-[8px]">Distribütör</div>
                    <div className="font-semibold truncate">{selected.distributor}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-muted-foreground mb-0.5 uppercase text-[8px]">Tür</div>
                    <div className="font-semibold truncate">{selected.genre}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button variant="outline" size="sm">
                  <Share2 className="w-3 h-3 mr-1.5" />
                  Paylaş
                </Button>
                <Button size="sm" className="overflow-hidden relative">
                  <span className="absolute inset-0 opacity-40" style={{
                    background: `linear-gradient(90deg, ${selected.colors[0]}, ${selected.colors[1]}, ${selected.colors[2] || selected.colors[1]})`,
                  }} />
                  <span className="relative flex items-center gap-1.5">
                    <Rocket className="w-3 h-3" />
                    Detaylar <ArrowRight className="w-3 h-3" />
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
