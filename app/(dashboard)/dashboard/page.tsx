import Link from "next/link";
import {
  Disc3,
  CalendarClock,
  Users,
  Wallet,
  Music2,
  Clock,
  TrendingUp,
  TrendingDown,
  UploadCloud,
  Mic2,
  Headphones,
  SlidersVertical,
  CalendarPlus,
  CheckCircle2,
  Circle,
  ArrowRight,
  Flame,
  PartyPopper,
  Volume2,
  Archive,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { cn, formatDate, formatDateTime, timeAgo, bpmColor } from "@/lib/utils";
import {
  BEAT_TYPE_LABELS,
  BEAT_TYPE_COLORS,
  BOOKING_TYPE_LABELS,
  BOOKING_TYPE_COLORS,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  ROLE_LABELS,
  ROLE_COLORS,
  TEAM_STATUS_LABELS,
  TEAM_STATUS_COLORS,
  type BeatType,
  type BookingType,
  type AppRole,
  type TeamStatus,
} from "@/lib/constants";

const STATS = [
  {
    label: "Toplam Beat",
    value: "128",
    change: "+12",
    positive: true,
    icon: Disc3,
    color: "from-primary to-secondary",
  },
  {
    label: "Aktif Proje",
    value: "17",
    change: "+3",
    positive: true,
    icon: Music2,
    color: "from-accent to-neon-cyan",
  },
  {
    label: "Bu Ay Stüdyo Saati",
    value: "84s",
    change: "%22",
    positive: true,
    icon: Clock,
    color: "from-neon-pink to-primary",
  },
  {
    label: "Gelir (Bu Ay)",
    value: "₺24.800",
    change: "-%4",
    positive: false,
    icon: Wallet,
    color: "from-neon-green to-accent",
  },
];

const RECENT_BEATS: {
  title: string;
  bpm: number;
  key: string;
  genre: string;
  type: BeatType;
  author: string;
  authorRole: AppRole;
  date: string;
  versions: number;
}[] = [
  {
    title: "Midnight Vibes",
    bpm: 140,
    key: "C# Minor",
    genre: "Drill",
    type: "mix_pending",
    author: "Mert Yılmaz",
    authorRole: "producer",
    date: "2026-09-17",
    versions: 5,
  },
  {
    title: "Güneş Doğarken",
    bpm: 92,
    key: "E Minor",
    genre: "R&B",
    type: "for_sale",
    author: "Zeynep Kara",
    authorRole: "vocalist",
    date: "2026-09-16",
    versions: 2,
  },
  {
    title: "Trap City Anthem",
    bpm: 155,
    key: "F Minor",
    genre: "Trap",
    type: "demo",
    author: "Can Demir",
    authorRole: "producer",
    date: "2026-09-15",
    versions: 1,
  },
  {
    title: "Derin Sular",
    bpm: 86,
    key: "G Major",
    genre: "Lo-Fi",
    type: "completed",
    author: "Mert Yılmaz",
    authorRole: "producer",
    date: "2026-09-12",
    versions: 7,
  },
];

const TODAY_BOOKINGS: {
  time: string;
  title: string;
  type: BookingType;
  by: string;
  byRole: AppRole;
  notes?: string;
}[] = [
  {
    time: "10:00 - 12:00",
    title: "Vokal Kayıt - Derin Sular",
    type: "recording",
    by: "Zeynep Kara",
    byRole: "vocalist",
    notes: "Neumann U87 + 1176 setup",
  },
  {
    time: "13:30 - 16:00",
    title: "Mix Session - Midnight Vibes",
    type: "mixing",
    by: "Can Demir",
    byRole: "engineer",
  },
  {
    time: "18:00 - 20:00",
    title: "Şarkı Yazım - Yeni EP",
    type: "songwriting",
    by: "Ali Şahin",
    byRole: "songwriter",
    notes: "3 şarkı fikri hazir",
  },
];

const TASKS: {
  title: string;
  priority: keyof typeof TASK_PRIORITY_LABELS;
  status: keyof typeof TASK_STATUS_LABELS;
  dueDate: string;
  assignee: string;
}[] = [
  {
    title: "Midnight Vibes final mix revizyonu",
    priority: "urgent",
    status: "in_progress",
    dueDate: "2026-09-19",
    assignee: "Can Demir",
  },
  {
    title: "Derin Sular split sheet oluştur",
    priority: "high",
    status: "todo",
    dueDate: "2026-09-20",
    assignee: "Mert Yılmaz",
  },
  {
    title: "Yeni beat kapak görselleri",
    priority: "medium",
    status: "review",
    dueDate: "2026-09-22",
    assignee: "Zeynep Kara",
  },
  {
    title: "Preset klasörünü düzenle (Serum)",
    priority: "low",
    status: "done",
    dueDate: "2026-09-15",
    assignee: "Can Demir",
  },
];

const TEAM: { name: string; role: AppRole; status: TeamStatus }[] = [
  { name: "Mert Yılmaz", role: "producer", status: "studio" },
  { name: "Zeynep Kara", role: "vocalist", status: "available" },
  { name: "Can Demir", role: "engineer", status: "busy" },
  { name: "Ali Şahin", role: "songwriter", status: "available" },
  { name: "Selin Öztürk", role: "admin", status: "offline" },
];

const ACTIVITY = [
  { icon: UploadCloud, text: "Mert yeni bir beat yükledi: 'Midnight Vibes v3'", time: "2 saat önce", color: "text-primary" },
  { icon: Mic2, text: "Zeynep stüdyo randevusu oluşturdu", time: "5 saat önce", color: "text-neon-cyan" },
  { icon: SlidersVertical, text: "Can 3 yeni preset yükledi (Mix Chain)", time: "8 saat önce", color: "text-neon-pink" },
  { icon: PartyPopper, text: "🎉 'Derin Sular' yayınlandı, hayırlı olsun!", time: "1 gün önce", color: "text-neon-green" },
  { icon: CheckCircle2, text: "Zeynep 'Final Vocal' görevini tamamladı", time: "1 gün önce", color: "text-accent" },
];

const TASK_PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-destructive/20 text-destructive border-destructive/30",
  high: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  medium: "bg-secondary/20 text-secondary border-secondary/30",
  low: "bg-muted text-muted-foreground border-white/5",
};

const TASK_STATUS_ICONS: Record<string, any> = {
  todo: Circle,
  in_progress: Clock,
  review: Flame,
  done: CheckCircle2,
};

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="!px-2 !text-[10px] tracking-wider">
              <span className="status-dot bg-neon-green animate-pulse mr-1.5" />
              Stüdyo Canlı · Cuma 18 Eylül
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            İyi çalışmalar,{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Arnix Ekibi
            </span>
            <span className="text-2xl ml-1">🎵</span>
          </h1>
          <p className="text-muted-foreground">
            Bugün kayıt, mix ve yayın için 3 randevun var. 7 görev bekliyor.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/studio/calendar">
            <Button variant="outline" size="sm">
              <CalendarPlus className="h-4 w-4" />
              Yeni Randevu
            </Button>
          </Link>
          <Link href="/beats/new">
            <Button size="sm">
              <UploadCloud className="h-4 w-4" />
              Beat Yükle
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <Card key={s.label} className="relative overflow-hidden group">
            <div
              className={cn(
                "absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br opacity-20 blur-3xl group-hover:opacity-30 transition-opacity",
                s.color
              )}
            />
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-2.5 rounded-xl bg-gradient-to-br text-white shadow-lg",
                  s.color
                )}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  s.positive ? "bg-neon-green/15 text-neon-green" : "bg-destructive/15 text-destructive"
                )}>
                  {s.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change}
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Beats */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-4 pb-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Music2 className="w-5 h-5 text-primary" />
                Son Beat'ler
              </CardTitle>
              <CardDescription>Ekibin en son yüklediği ve üzerinde çalıştığı parçalar</CardDescription>
            </div>
            <Link href="/beats" className="shrink-0">
              <Button variant="ghost" size="sm">
                Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {RECENT_BEATS.map((b) => (
                <div
                  key={b.title}
                  className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
                >
                  {/* Waveform preview */}
                  <div className="relative shrink-0 w-20 h-14 rounded-lg bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 border border-white/10 flex items-end justify-center overflow-hidden">
                    <div className="flex items-end gap-[2px] pb-2 px-2 h-full">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-[3px] audio-wave-bar rounded-sm"
                          style={{
                            height: `${20 + ((i * 7 + b.bpm) % 80)}%`,
                            opacity: 0.6 + ((i * 3) % 40) / 100,
                          }}
                        />
                      ))}
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Volume2 className="w-6 h-6 text-white drop-shadow" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold truncate">{b.title}</div>
                      <Badge variant="muted" className={cn("!px-1.5", BEAT_TYPE_COLORS[b.type])}>
                        {BEAT_TYPE_LABELS[b.type]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className={cn("font-mono font-semibold", bpmColor(b.bpm))}>{b.bpm} BPM</span>
                      <span className="font-mono">{b.key}</span>
                      <span>{b.genre}</span>
                      <span>· {b.versions} sürüm</span>
                      <span>· {timeAgo(b.date)}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-3 shrink-0">
                    <Avatar
                      name={b.author}
                      size="sm"
                    />
                    <div className="text-right">
                      <div className="text-sm font-medium truncate">{b.author}</div>
                      <Badge variant="muted" className={cn("!px-1.5 !text-[9px]", ROLE_COLORS[b.authorRole])}>
                        {ROLE_LABELS[b.authorRole]}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Team Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-4 h-5 text-neon-cyan" />
                Ekip Durumu
              </CardTitle>
              <CardDescription className="text-xs">5 kişi · {TEAM.filter(t => t.status !== "offline").length} çevrimiçi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TEAM.map((m) => (
                  <div key={m.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="relative">
                      <Avatar name={m.name} size="sm" />
                      <span className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card shadow",
                        TEAM_STATUS_COLORS[m.status]
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{m.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="muted" className={cn("!px-1.5 !text-[9px]", ROLE_COLORS[m.role])}>
                          {ROLE_LABELS[m.role]}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{TEAM_STATUS_LABELS[m.status]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="w-4 h-5 text-neon-orange" />
                Son Aktiviteler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {ACTIVITY.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={cn("mt-0.5 p-1.5 rounded-lg bg-white/5 shrink-0", a.color)}>
                      <a.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-snug">{a.text}</p>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">{a.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today Bookings */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-secondary" />
              Bugünkü Randevular
            </CardTitle>
            <CardDescription className="text-xs">{TODAY_BOOKINGS.length} seans bugün planlandı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6">
              <div className="absolute left-[11px] top-1 bottom-1 w-px bg-gradient-to-b from-primary/40 via-secondary/40 to-transparent" />
              <ul className="space-y-4">
                {TODAY_BOOKINGS.map((b, i) => (
                  <li key={i} className="relative">
                    <span
                      className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full border-[3px] border-card shadow-lg"
                      style={{ background: BOOKING_TYPE_COLORS[b.type] }}
                    />
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono text-muted-foreground font-semibold">{b.time}</span>
                      <Badge variant="muted" className="!px-1.5 !text-[9px]"
                        style={{
                          background: `${BOOKING_TYPE_COLORS[b.type]}22`,
                          color: BOOKING_TYPE_COLORS[b.type],
                          borderColor: `${BOOKING_TYPE_COLORS[b.type]}44`,
                        }}
                      >
                        {BOOKING_TYPE_LABELS[b.type]}
                      </Badge>
                    </div>
                    <div className="font-medium text-sm mb-0.5">{b.title}</div>
                    {b.notes && <div className="text-[11px] text-muted-foreground mb-1.5">💡 {b.notes}</div>}
                    <div className="flex items-center gap-2">
                      <Avatar name={b.by} size="sm" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{b.by}</span>
                        <Badge variant="muted" className={cn("!px-1.5 !text-[9px]", ROLE_COLORS[b.byRole])}>
                          {ROLE_LABELS[b.byRole]}
                        </Badge>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex-row items-center justify-between gap-4 pb-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-neon-green" />
                Yürüyen Görevler
              </CardTitle>
              <CardDescription className="text-xs">
                {TASKS.filter(t => t.status !== "done").length} açık · {TASKS.filter(t => t.status === "done").length} tamamlanan
              </CardDescription>
            </div>
            <Link href="/tasks">
              <Button variant="ghost" size="sm">
                Tümü <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {TASKS.map((t) => {
                const StatusIcon = TASK_STATUS_ICONS[t.status];
                return (
                  <div key={t.title} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-start gap-2 mb-2">
                      <StatusIcon className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        t.status === "done" ? "text-neon-green" :
                        t.status === "in_progress" ? "text-primary animate-pulse" :
                        t.status === "review" ? "text-neon-orange" : "text-muted-foreground"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-sm font-medium", t.status === "done" && "line-through text-muted-foreground")}>
                          {t.title}
                        </div>
                      </div>
                      <Badge variant="muted" className={cn("!px-1.5 !text-[9px]", TASK_PRIORITY_COLORS[t.priority])}>
                        {TASK_PRIORITY_LABELS[t.priority]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pl-6">
                      <Badge variant="muted" className="!text-[10px] !px-1.5 bg-white/5">
                        {TASK_STATUS_LABELS[t.status]}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{formatDate(t.dueDate)}</span>
                        <Avatar name={t.assignee} size="sm" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Presets & Projects */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-neon-pink" />
              Hızlı Erişim
            </CardTitle>
            <CardDescription className="text-xs">Presetler ve proje arşivleri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground/80 mb-2 flex items-center justify-between">
                <span>Popüler Presetler</span>
                <Link href="/presets" className="text-primary hover:underline normal-case tracking-normal text-[11px] font-medium">
                  24 preset →
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Vocal Chain - Pop", by: "Can Demir", tag: "Vokal", icon: Mic2, color: "neon-cyan" },
                  { name: "Serum - Trap Pluck", by: "Mert Yılmaz", tag: "Serum", icon: SlidersVertical, color: "primary" },
                  { name: "Master Bus Template", by: "Can Demir", tag: "Mastering", icon: UploadCloud, color: "neon-green" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className={cn(
                      "p-2 rounded-lg bg-white/5 shrink-0",
                      p.color === "neon-cyan" && "text-neon-cyan",
                      p.color === "primary" && "text-primary",
                      p.color === "neon-green" && "text-neon-green"
                    )}>
                      <p.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">@ {p.by} · {p.tag}</div>
                    </div>
                    <Button variant="ghost" size="iconSm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DownloadIcon />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground/80 mb-2 flex items-center justify-between">
                <span>Proje Arşivleri (ZIP)</span>
                <Link href="/beats" className="text-primary hover:underline normal-case tracking-normal text-[11px] font-medium">
                  Arşivi aç →
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { name: "MidnightVibes_v3.zip", size: "184 MB", beat: "Midnight Vibes" },
                  { name: "Gunes-Dogarken-ABLETON.zip", size: "221 MB", beat: "Güneş Doğarken" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gradient-to-r from-neon-purple/5 to-transparent border border-neon-purple/10">
                    <div className="p-2 rounded-lg text-neon-purple">
                      <Archive className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono truncate">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{p.beat} · {p.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
