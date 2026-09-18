"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Crown,
  Trophy,
  Headphones,
  Mic2,
  Guitar,
  Music2,
  CheckCircle2,
  Clock3,
  Eye,
  ShieldCheck,
  Star,
  Crown as CoFounder,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  MoreHorizontal,
  X,
  Send,
  Ban,
  Pencil,
  FolderKanban,
  Disc3,
  FileAudio,
  Activity,
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
  APP_ROLES,
  type AppRole,
  ROLE_LABELS,
  ROLE_COLORS,
  ROLE_PERMISSIONS,
} from "@/lib/constants";
import { cn, formatDate, timeAgo } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  role: AppRole;
  title: string;
  email: string;
  phone?: string;
  location: string;
  joinedAt: string;
  lastActive: string;
  status: "online" | "busy" | "offline" | "away";
  bio: string;
  tags: string[];
  stats: {
    tasksCompleted: number;
    tasksTotal: number;
    studioHours: number;
    tracksInvolved: number;
    beatsProduced: number;
    sessionsThisMonth: number;
  };
  currentProject?: string;
  weeklyHours: number[];
  efficiency: number;
  streak: number;
  badges: string[];
  level: number;
  rating: number;
  team?: string;
}

const MEMBERS: Member[] = [
  {
    id: "u1", name: "Selin Öztürk", role: "admin", title: "Stüdyo Yöneticisi",
    email: "selin@arnix.studio", phone: "+90 532 123 45 67", location: "İstanbul",
    joinedAt: "2024-03-15", lastActive: "2026-09-18T14:20:00", status: "online",
    bio: "10+ yıl müzik endüstrisi deneyimi. Arnix'i kurdum, 150+ albüm projesi.",
    tags: ["Proje Yöneticisi", "A&R", "İlk Kurucu"],
    stats: { tasksCompleted: 142, tasksTotal: 148, studioHours: 86, tracksInvolved: 89, beatsProduced: 0, sessionsThisMonth: 24 },
    currentProject: "Midnight Vibes - Zeynep Kara Albüm",
    weeklyHours: [8, 9, 7, 10, 6, 4, 3],
    efficiency: 96, streak: 187, level: 42, rating: 4.9,
    badges: ["Co-Founder", "Ayın En Başarılısı x3", "1000+ Saat Stüdyo"],
    team: "Arayüz Yönetimi",
  },
  {
    id: "u2", name: "Mert Yılmaz", role: "producer", title: "Kıdemli Yapımcı",
    email: "mert@arnix.studio", phone: "+90 505 987 65 43", location: "Ankara / İstanbul",
    joinedAt: "2024-05-02", lastActive: "2026-09-18T13:58:00", status: "busy",
    bio: "Trap, R&B ve hip-hop tarzlarında 80+ hit beat. Universal ile sözleşmeli.",
    tags: ["808 Uzmanı", "Mix Designer", "Beat Maker"],
    stats: { tasksCompleted: 89, tasksTotal: 94, studioHours: 124, tracksInvolved: 112, beatsProduced: 68, sessionsThisMonth: 31 },
    currentProject: "Kozmik Dans - EP",
    weeklyHours: [9, 10, 11, 9, 8, 6, 4],
    efficiency: 94, streak: 41, level: 38, rating: 4.8,
    badges: ["Ayın Yapımcısı x5", "Top 50 Producer TR", "Beat Master"],
    team: "Yapım Ekibi A",
  },
  {
    id: "u3", name: "Zeynep Kara", role: "vocalist", title: "Kontralto Sanatçı",
    email: "zeynep@arnix.studio", location: "İzmir / İstanbul",
    joinedAt: "2024-07-12", lastActive: "2026-09-18T11:15:00", status: "away",
    bio: "2 albüm, 30+ single. X Factor Türkiye 2022 finalisti.",
    tags: ["R&B", "Pop", "Jazz", "Backing Vocal"],
    stats: { tasksCompleted: 54, tasksTotal: 58, studioHours: 72, tracksInvolved: 63, beatsProduced: 0, sessionsThisMonth: 18 },
    currentProject: "Albüm Kayıtları (Güneş Doğarken)",
    weeklyHours: [4, 6, 3, 8, 7, 2, 1],
    efficiency: 93, streak: 12, level: 29, rating: 4.9,
    badges: ["Altın Single (2x)", "En İyi Yeni Ses", "Albüm 1 Milyon Dinleme"],
    team: "Sanatçılar",
  },
  {
    id: "u4", name: "Can Demir", role: "engineer", title: "Ana Kayıt & Mastering",
    email: "can@arnix.studio", phone: "+90 541 222 33 44", location: "İstanbul",
    joinedAt: "2024-04-20", lastActive: "2026-09-18T15:02:00", status: "online",
    bio: "15 yıl ses mühendisliği. SSL, Neve ve analog donanım uzmanı. 3x Altın Albüm.",
    tags: ["SSL Konsol", "Analog Mastering", "Dolby Atmos"],
    stats: { tasksCompleted: 76, tasksTotal: 79, studioHours: 188, tracksInvolved: 147, beatsProduced: 0, sessionsThisMonth: 42 },
    currentProject: "Derin Sular - Mix & Master",
    weeklyHours: [10, 11, 9, 12, 10, 5, 2],
    efficiency: 96, streak: 28, level: 36, rating: 5.0,
    badges: ["Mastering Uzmanı", "Analog Kralı", "2000+ Saat Stüdyo", "Mükemmellik Sertifikası"],
    team: "Teknik Ekip",
  },
  {
    id: "u5", name: "Ayşe Şahin", role: "songwriter", title: "Söz & Beste Yazarı",
    email: "ayse@arnix.studio", location: "Ankara",
    joinedAt: "2024-09-08", lastActive: "2026-09-18T09:42:00", status: "online",
    bio: "200+ şarkı sözü, 30+ radyo numarası. TRT Popüler Beste Yarışması 2023.",
    tags: ["Söz Yazarı", "Beste", "Top 40", "Slow Balad"],
    stats: { tasksCompleted: 61, tasksTotal: 66, studioHours: 48, tracksInvolved: 72, beatsProduced: 2, sessionsThisMonth: 14 },
    currentProject: "Zeynep Kara - Albüm Sözleri",
    weeklyHours: [5, 7, 6, 8, 4, 3, 2],
    efficiency: 92, streak: 5, level: 24, rating: 4.7,
    badges: ["En Çok Yayınlanan Söz Yazarı", "Radyo 1 Numara x2"],
    team: "Söz & Beste",
  },
  {
    id: "u6", name: "Kaan Arslan", role: "producer", title: "Electronic Producer",
    email: "kaan@arnix.studio", location: "Bursa",
    joinedAt: "2025-01-18", lastActive: "2026-09-17T22:10:00", status: "offline",
    bio: "Deep House, Techno ve Future Bass tarzları. Beatport top 10 deneyimi.",
    tags: ["Synth Uzmanı", "Sound Design", "Remix"],
    stats: { tasksCompleted: 41, tasksTotal: 48, studioHours: 82, tracksInvolved: 54, beatsProduced: 38, sessionsThisMonth: 21 },
    currentProject: "Neon Nights EP",
    weeklyHours: [2, 4, 5, 6, 8, 7, 5],
    efficiency: 85, streak: 3, level: 22, rating: 4.6,
    badges: ["Beatport Top 10", "New Generation Producer"],
    team: "Yapım Ekibi B",
  },
  {
    id: "u7", name: "Deniz Kaya", role: "vocalist", title: "Tenor / Rapçi",
    email: "deniz@arnix.studio", location: "İstanbul",
    joinedAt: "2025-03-03", lastActive: "2026-09-18T12:30:00", status: "busy",
    bio: "Hip-hop, trap ve rap artist. 40M+ toplam YouTube izlenmesi.",
    tags: ["Rap", "Melodik Hook", "Ad-lib Uzmanı"],
    stats: { tasksCompleted: 32, tasksTotal: 36, studioHours: 54, tracksInvolved: 41, beatsProduced: 0, sessionsThisMonth: 16 },
    currentProject: "Gözlerim Kanıyor - Single",
    weeklyHours: [3, 5, 4, 6, 5, 2, 1],
    efficiency: 89, streak: 9, level: 19, rating: 4.5,
    badges: ["Yeni Nesil Sanatçı", "40M+ İzlenme"],
    team: "Sanatçılar",
  },
  {
    id: "u8", name: "Berna Gül", role: "engineer", title: "Kayıt & Edit Asistanı",
    email: "berna@arnix.studio", location: "İstanbul",
    joinedAt: "2025-06-22", lastActive: "2026-09-18T14:55:00", status: "online",
    bio: "Pro Tools Uzmanı, vocal comping ve düzenleme alanında uzman.",
    tags: ["Pro Tools", "Vocal Comping", "Edit"],
    stats: { tasksCompleted: 28, tasksTotal: 30, studioHours: 62, tracksInvolved: 38, beatsProduced: 0, sessionsThisMonth: 27 },
    currentProject: "Çeşitli vocal düzenleme",
    weeklyHours: [6, 7, 8, 7, 5, 3, 1],
    efficiency: 93, streak: 14, level: 17, rating: 4.7,
    badges: ["Pro Tools Certified", "En Hızlı Editör"],
    team: "Teknik Ekip",
  },
];

const ROLE_ICON: Record<AppRole, any> = {
  admin: ShieldCheck,
  producer: Headphones,
  vocalist: Mic2,
  songwriter: Guitar,
  engineer: Music2,
};

const INVITATIONS = [
  { email: "emre.yildiz@yahoo.com", role: "producer" as AppRole, sentAt: "2026-09-16", expiresAt: "2026-09-23", by: "Selin Ö." },
  { email: "melike.celik@gmail.com", role: "songwriter" as AppRole, sentAt: "2026-09-17", expiresAt: "2026-09-24", by: "Selin Ö." },
  { email: "ugur.kaya@outlook.com", role: "engineer" as AppRole, sentAt: "2026-09-12", expiresAt: "2026-09-19", by: "Selin Ö.", remind: true },
  { email: "nilay.aksoy@icloud.com", role: "vocalist" as AppRole, sentAt: "2026-09-15", expiresAt: "2026-09-22", by: "Mert Y." },
];

const PERMISSION_LABELS: Record<string, string> = {
  beats: "Beat Deposu",
  beat_versions: "Beat Sürümleri",
  presets: "Presetler",
  samples: "Sample Kütüphanesi",
  studio_bookings: "Stüdyo Randevu",
  tasks: "Görevler",
  lyrics: "Sözler / Lyric Pad",
  comments: "Yorumlar",
  split_sheets: "Telif Payları",
  session_notes: "Seans Notları",
  release_plans: "Yayın Takvimi",
  finances: "Muhasebe",
  reference_tracks: "Referans Şarkılar",
  team: "Ekip Yönetimi",
  settings: "Sistem Ayarları",
};

const STATUS_STYLE: Record<Member["status"], string> = {
  online: "bg-neon-green",
  busy: "bg-neon-orange",
  away: "bg-neon-pink",
  offline: "bg-muted-foreground",
};
const STATUS_LABELS: Record<Member["status"], string> = {
  online: "Çevrimiçi",
  busy: "Meşgul",
  away: "Uzakta",
  offline: "Çevrimdışı",
};

function hasPerm(role: AppRole, perm: string): "*" | "full" | "read" | "write" | "none" {
  const p = ROLE_PERMISSIONS[role];
  if (p.includes("*")) return "*";
  if (p.includes(`${perm}:delete`)) return "full";
  if (p.includes(`${perm}:create`) || p.includes(`${perm}:update`)) return "write";
  if (p.includes(`${perm}:read`)) return "read";
  return "none";
}

export default function TeamPage() {
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");
  const [permView, setPermView] = React.useState<"matrix" | "details">("matrix");

  const filtered = React.useMemo(() => {
    return MEMBERS.filter(m => {
      if (role !== "all" && m.role !== role) return false;
      if (status !== "all" && m.status !== status) return false;
      if (search && !(
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )) return false;
      return true;
    });
  }, [search, role, status]);

  const permGroups = [
    { key: "beats", label: "Beat Deposu" },
    { key: "presets", label: "Presetler" },
    { key: "samples", label: "Sample Kütüphanesi" },
    { key: "studio_bookings", label: "Stüdyo Randevu" },
    { key: "tasks", label: "Görevler" },
    { key: "lyrics", label: "Lyric Pad" },
    { key: "split_sheets", label: "Telif Payları" },
    { key: "session_notes", label: "Seans Notları" },
    { key: "release_plans", label: "Yayın Takvimi" },
    { key: "finances", label: "Muhasebe" },
    { key: "team", label: "Ekip" },
    { key: "settings", label: "Ayarlar" },
  ];

  const leaderboard = [...MEMBERS].sort((a, b) => (b.stats.tasksCompleted + b.efficiency) - (a.stats.tasksCompleted + a.efficiency)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" className="!px-2 !text-[10px] tracking-wider">
              <Users className="w-3 h-3 mr-1.5" />
              TEAM CENTER
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {MEMBERS.length} üye · {MEMBERS.filter(m => m.status === "online").length} çevrimiçi
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Ekip & İzin Yönetimi</h1>
          <p className="text-muted-foreground">Üyeler, roller, davetler ve izin matrisi — hepsi bir yerde</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <FileAudio className="w-4 h-4 mr-1.5" />
            Raporla
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Üye Davet Et
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary opacity-15 blur-3xl" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Toplam Üye</Badge>
              <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold tabular-nums mb-1">{MEMBERS.length}</div>
            <div className="text-[11px] text-muted-foreground">
              Son 30 günde <span className="font-semibold text-neon-green">+3</span> yeni üye
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-neon-green to-accent opacity-15 blur-3xl" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Aktif (Bugün)</Badge>
              <div className="w-8 h-8 rounded-lg bg-neon-green/15 text-neon-green flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold tabular-nums mb-1 text-neon-green">{MEMBERS.filter(m => m.status === "online").length}/{MEMBERS.length}</div>
            <div className="text-[11px] text-muted-foreground">
              {MEMBERS.filter(m => m.status === "busy").length} meşgul · {MEMBERS.filter(m => m.status === "offline").length} çevrimdışı
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-neon-pink to-neon-orange opacity-15 blur-3xl" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Bekleyen Davet</Badge>
              <div className="w-8 h-8 rounded-lg bg-neon-pink/15 text-neon-pink flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold tabular-nums mb-1 text-neon-pink">{INVITATIONS.length}</div>
            <div className="text-[11px] text-muted-foreground">
              {INVITATIONS.filter(i => i.remind).length} hatırlatma bekleniyor
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple opacity-15 blur-3xl" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Görev Tamamlama</Badge>
              <div className="w-8 h-8 rounded-lg bg-neon-cyan/15 text-neon-cyan flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold tabular-nums mb-1 text-neon-cyan">
              {Math.round(MEMBERS.reduce((a, b) => a + (b.stats.tasksCompleted / b.stats.tasksTotal), 0) / MEMBERS.length * 100)}%
            </div>
            <div className="text-[11px] text-muted-foreground">
              Aylık ort. <span className="font-semibold">{MEMBERS.reduce((a, b) => a + b.stats.sessionsThisMonth, 0)}</span> seans
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <CardContent className="p-0 grid md:grid-cols-5 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Üye ara — isim, mail, etiket, unvan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-muted-foreground inline" />
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Roller</SelectItem>
              {(Object.keys(ROLE_LABELS) as AppRole[]).map(r => (
                <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <Activity className="w-3.5 h-3.5 mr-1.5 text-muted-foreground inline" />
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              {(Object.keys(STATUS_LABELS) as Member["status"][]).map(s => (
                <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="flex-1 !text-[11px]">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              Gelişmiş
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(m => {
          const RoleIcon = ROLE_ICON[m.role];
          const compPct = Math.round((m.stats.tasksCompleted / m.stats.tasksTotal) * 100);
          const weeklyTotal = m.weeklyHours.reduce((a, b) => a + b, 0);
          return (
            <Card key={m.id} className="p-0 overflow-hidden group hover:border-primary/40 transition-all">
              {/* Gradient header */}
              <div className={cn("h-24 relative overflow-hidden",
                m.role === "admin" && "bg-gradient-to-br from-primary via-neon-purple to-secondary",
                m.role === "producer" && "bg-gradient-to-br from-neon-pink via-primary to-secondary",
                m.role === "vocalist" && "bg-gradient-to-br from-neon-cyan via-primary to-neon-purple",
                m.role === "songwriter" && "bg-gradient-to-br from-neon-green via-accent to-neon-cyan",
                m.role === "engineer" && "bg-gradient-to-br from-neon-orange via-neon-pink to-primary",
              )}>
                <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
                  backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15), transparent 50%)"
                }} />
                {/* Level & streak */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant="muted" className="!text-[9px] !bg-black/40 backdrop-blur-md border-white/10">
                    <Award className="w-2.5 h-2.5 mr-1 text-primary" />
                    Seviye {m.level}
                  </Badge>
                  <Badge variant="muted" className="!text-[9px] !bg-black/40 backdrop-blur-md border-white/10">
                    <Zap className="w-2.5 h-2.5 mr-1 text-neon-orange" />
                    {m.streak} gün
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <Badge variant="muted" className="!text-[9px] !bg-black/40 backdrop-blur-md border-white/10 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                    {m.rating}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 -mt-10 relative">
                {/* Avatar + status */}
                <div className="flex items-end justify-between mb-3 relative">
                  <div className="relative">
                    <Avatar name={m.name} size="xl" className="!w-20 !h-20 ring-4 ring-[hsl(var(--card))] shadow-xl" />
                    <div className={cn("absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full ring-4 ring-[hsl(var(--card))] flex items-center justify-center",
                      m.role === "admin" && "bg-gradient-to-br from-primary to-secondary",
                      m.role === "producer" && "bg-gradient-to-br from-neon-pink to-primary",
                      m.role === "vocalist" && "bg-gradient-to-br from-neon-cyan to-neon-purple",
                      m.role === "songwriter" && "bg-gradient-to-br from-neon-green to-accent",
                      m.role === "engineer" && "bg-gradient-to-br from-neon-orange to-neon-pink",
                    )}>
                      <RoleIcon className="w-3 h-3 text-white" />
                    </div>
                    <div className={cn(
                      "absolute bottom-1 left-1 w-5 h-5 rounded-full ring-4 ring-[hsl(var(--card))] flex items-center justify-center",
                      STATUS_STYLE[m.status]
                    )}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name & role */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold tracking-tight">{m.name}</h3>
                    {m.id === "u1" && <CoFounder className="w-4 h-4 text-primary fill-primary/20" title="Kurucu" />}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="muted" className={cn("!text-[10px] !px-2 !font-semibold", ROLE_COLORS[m.role])}>
                      <RoleIcon className="w-2.5 h-2.5 mr-1" />
                      {ROLE_LABELS[m.role]}
                    </Badge>
                    <Badge variant="outline" className="!text-[9px]">
                      {m.title}
                    </Badge>
                    <Badge variant="muted" className="!text-[9px]">
                      {STATUS_LABELS[m.status]}
                    </Badge>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{m.bio}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {m.tags.map(t => (
                    <Badge key={t} variant="outline" className="!text-[8px] !px-1.5 !bg-white/[0.02] border-white/5">
                      #{t}
                    </Badge>
                  ))}
                </div>

                {/* Contact */}
                <div className="space-y-1 mb-3 text-[11px] text-muted-foreground border border-white/5 rounded-lg p-2.5 bg-white/[0.01]">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate font-mono">{m.email}</span>
                  </div>
                  {m.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 shrink-0" />
                      <span className="font-mono">{m.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{formatDate(m.joinedAt)} tarihinden beri üye</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-3 h-3 shrink-0" />
                    <span>Son görünme: {timeAgo(m.lastActive)}</span>
                  </div>
                </div>

                {/* Current project */}
                {m.currentProject && (
                  <Link href="/tasks" className="mb-3 flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/15 hover:bg-primary/10 transition-colors">
                    <FolderKanban className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] uppercase tracking-wider text-primary font-semibold">Aktif Proje</div>
                      <div className="text-[11px] font-semibold truncate">{m.currentProject}</div>
                    </div>
                  </Link>
                )}

                {/* Stats mini */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Görev</div>
                    <div className="font-bold text-sm tabular-nums">{m.stats.tasksCompleted}<span className="text-xs text-muted-foreground font-normal">/{m.stats.tasksTotal}</span></div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Stüdyo</div>
                    <div className="font-bold text-sm tabular-nums">{m.stats.studioHours}<span className="text-[10px] text-muted-foreground ml-0.5">sa</span></div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Parça</div>
                    <div className="font-bold text-sm tabular-nums">{m.stats.tracksInvolved}</div>
                  </div>
                </div>

                {/* Task completion bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span className="inline-flex items-center gap-1"><Target className="w-2.5 h-2.5" />Görev tamamlanma oranı</span>
                    <span className="font-mono font-semibold text-foreground">{compPct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all",
                        compPct >= 90 ? "bg-gradient-to-r from-neon-green to-accent" :
                        compPct >= 75 ? "bg-gradient-to-r from-primary to-secondary" :
                        compPct >= 60 ? "bg-gradient-to-r from-neon-orange to-neon-pink" :
                        "bg-gradient-to-r from-destructive to-neon-orange"
                      )}
                      style={{ width: `${compPct}%` }}
                    />
                  </div>
                </div>

                {/* Efficiency */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span className="inline-flex items-center gap-1"><Zap className="w-2.5 h-2.5" />Verimlilik skoru</span>
                    <span className="font-mono font-semibold">{m.efficiency}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-primary to-neon-pink transition-all"
                      style={{ width: `${m.efficiency}%` }}
                    />
                  </div>
                </div>

                {/* Weekly hours */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                    <span className="inline-flex items-center gap-1"><Clock3 className="w-2.5 h-2.5" />Bu hafta · {weeklyTotal} saat</span>
                    <Badge variant="muted" className="!text-[8px]">
                      {weeklyTotal >= 40 ? <TrendingUp className="w-2 h-2 mr-0.5 text-neon-green" /> : <TrendingDown className="w-2 h-2 mr-0.5 text-neon-orange" />}
                      Hedef %{Math.round((weeklyTotal / 40) * 100)}
                    </Badge>
                  </div>
                  <div className="h-14 grid grid-cols-7 gap-1 items-end">
                    {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d, i) => (
                      <div key={d} className="flex flex-col items-center gap-0.5">
                        <div className="w-full h-full flex items-end">
                          <div
                            className="w-full rounded-t-sm bg-gradient-to-t from-primary/50 to-secondary/80 hover:from-primary hover:to-secondary transition-colors"
                            style={{ height: `${Math.max(10, (m.weeklyHours[i] / 12) * 100)}%` }}
                            title={`${d}: ${m.weeklyHours[i]} saat`}
                          />
                        </div>
                        <div className="text-[8px] font-mono text-muted-foreground">{d}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                {m.badges.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                      <Award className="w-2.5 h-2.5" />
                      Rozetler · {m.badges.length}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.badges.slice(0, 3).map(b => (
                        <Badge key={b} variant="info" className="!text-[8px] !px-1.5">
                          {b}
                        </Badge>
                      ))}
                      {m.badges.length > 3 && (
                        <Badge variant="outline" className="!text-[8px] !px-1.5">
                          +{m.badges.length - 3} daha
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Invitations + Leaderboard */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Invitations */}
        <Card className="lg:col-span-3 p-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="text-base font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Bekleyen Davetler
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Ekibinize katılmaları için gönderilen davetler — 7 gün içinde süresi doluyor
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="xs" variant="outline">Toplu Davet</Button>
              <Button size="xs"><PlusCircle className="w-3 h-3 mr-1" /> Yeni Davet</Button>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Alıcı</th>
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden md:table-cell">Rol</th>
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden md:table-cell">Gönderen / Tarih</th>
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden sm:table-cell">Süre</th>
                  <th className="text-right p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {INVITATIONS.map((inv, i) => {
                  const RoleIcon = ROLE_ICON[inv.role];
                  return (
                    <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{inv.email}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{inv.by} tarafından gönderildi</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge variant="muted" className={cn("!text-[10px] !px-2", ROLE_COLORS[inv.role])}>
                          <RoleIcon className="w-2.5 h-2.5 mr-1" />
                          {ROLE_LABELS[inv.role]}
                        </Badge>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="text-xs font-mono">{formatDate(inv.sentAt)}</div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        {inv.remind ? (
                          <Badge variant="warning" className="!text-[9px] !px-1.5">
                            <Clock3 className="w-2 h-2 mr-1" />
                            Son 2 gün
                          </Badge>
                        ) : (
                          <Badge variant="info" className="!text-[9px] !px-1.5">
                            Bitiş: {formatDate(inv.expiresAt)}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {inv.remind && (
                            <Button size="xs" variant="warning">
                              <Send className="w-2.5 h-2.5 mr-1" />
                              Hatırlat
                            </Button>
                          )}
                          <Button size="xs" variant="outline">
                            <Pencil className="w-2.5 h-2.5 mr-1" />
                            Düzenle
                          </Button>
                          <Button size="xs" variant="ghost" className="text-muted-foreground hover:text-destructive">
                            <X className="w-2.5 h-2.5 mr-1" />
                            İptal
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Leaderboard */}
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-base font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Performans Sıralaması
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Eylül ayı</div>
            </div>
            <Tabs defaultValue="monthly" className="w-auto">
              <TabsList className="!p-0.5">
                <TabsTrigger value="weekly" className="!text-[10px] !px-2.5 !py-0.5">Haftalık</TabsTrigger>
                <TabsTrigger value="monthly" className="!text-[10px] !px-2.5 !py-0.5">Aylık</TabsTrigger>
                <TabsTrigger value="yearly" className="!text-[10px] !px-2.5 !py-0.5">Yıllık</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((m, i) => {
              const points = m.stats.tasksCompleted * 10 + m.efficiency * 5 + m.stats.sessionsThisMonth * 2;
              const max = leaderboard[0].stats.tasksCompleted * 10 + leaderboard[0].efficiency * 5 + leaderboard[0].stats.sessionsThisMonth * 2;
              const pct = Math.round((points / max) * 100);
              return (
                <div key={m.id} className="p-3 rounded-xl border border-white/5 hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                  {i === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-orange/5 via-transparent to-primary/5" />
                  )}
                  <div className="relative flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0",
                      i === 0 ? "bg-gradient-to-br from-neon-orange to-yellow-400 text-black shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)]" :
                      i === 1 ? "bg-gradient-to-br from-muted to-muted-foreground text-black" :
                      i === 2 ? "bg-gradient-to-br from-[#CD7F32] to-[#B8860B] text-black" :
                      "bg-white/[0.03] border border-white/5 text-muted-foreground"
                    )}>
                      {i === 0 ? <Crown className="w-5 h-5" /> : <span>#{i + 1}</span>}
                    </div>
                    <Avatar name={m.name} size="md" className="!w-11 !h-11" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm truncate">{m.name}</span>
                        <Badge variant="muted" className={cn("!text-[8px] !px-1.5", ROLE_COLORS[m.role])}>
                          {ROLE_LABELS[m.role]}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5 text-neon-green" />{m.stats.tasksCompleted} görev</span>
                        <span className="inline-flex items-center gap-1"><Zap className="w-2.5 h-2.5 text-neon-orange" />{m.efficiency}%</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black tabular-nums bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {points.toLocaleString("tr-TR")}
                      </div>
                      <div className="text-[9px] font-mono text-muted-foreground">PUAN</div>
                    </div>
                  </div>
                  <div className="relative h-1 mt-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all",
                        i === 0 ? "bg-gradient-to-r from-neon-orange via-neon-pink to-primary" :
                        i === 1 ? "bg-gradient-to-r from-muted-foreground to-primary" :
                        i === 2 ? "bg-gradient-to-r from-neon-orange to-primary" :
                        "bg-gradient-to-r from-primary to-secondary"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Permissions */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Rol İzinleri Matrisi
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Her rolün modül bazında erişim ve işlem izinleri — değişiklikler tüm ekibi etkiler
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Tabs defaultValue="matrix" value={permView} onValueChange={(v) => setPermView(v as any)} className="w-auto">
              <TabsList className="!p-0.5">
                <TabsTrigger value="matrix" className="!text-[10px] !px-3 !py-1">Matris</TabsTrigger>
                <TabsTrigger value="details" className="!text-[10px] !px-3 !py-1">Detay</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="xs">
              <Pencil className="w-2.5 h-2.5 mr-1" />
              Rol Düzenle
            </Button>
          </div>
        </div>

        <TabsContent value="matrix">
          <div className="rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground w-[200px] sticky left-0 bg-[hsl(var(--card))] z-10">Modül</th>
                  {(Object.keys(ROLE_LABELS) as AppRole[]).map(r => (
                    <th key={r} className="text-center p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground min-w-[110px]">
                      <div className="flex items-center justify-center gap-1.5 flex-col">
                        <Badge variant="muted" className={cn("!text-[9px] !px-2 !font-semibold", ROLE_COLORS[r])}>
                          {ROLE_LABELS[r]}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permGroups.map((p, idx) => (
                  <tr key={p.key} className={cn("border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors", idx % 2 === 1 && "bg-white/[0.01]")}>
                    <td className="p-3 sticky left-0 bg-[hsl(var(--card))] hover:bg-white/[0.02] z-10">
                      <div className="font-medium text-sm">{p.label}</div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{p.key}:*</div>
                    </td>
                    {(Object.keys(ROLE_LABELS) as AppRole[]).map(r => {
                      const perm = hasPerm(r, p.key);
                      const cell = perm === "*"
                        ? { label: "Tam Erişim", cls: "bg-primary/20 text-primary border-primary/30", icon: Crown as any }
                        : perm === "full"
                        ? { label: "CRUD", cls: "bg-neon-green/20 text-neon-green border-neon-green/30", icon: CheckCircle2 }
                        : perm === "write"
                        ? { label: "Ok+Yaz", cls: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30", icon: Pencil }
                        : perm === "read"
                        ? { label: "Okuma", cls: "bg-neon-purple/20 text-neon-purple border-neon-purple/30", icon: Eye }
                        : { label: "Yok", cls: "bg-white/[0.02] text-muted-foreground border-white/5", icon: Ban };
                      const Icon = cell.icon;
                      return (
                        <td key={r} className="p-3 text-center">
                          <Badge variant="muted" className={cn("!text-[9px] !px-1.5 !font-semibold", cell.cls)}>
                            <Icon className="w-2.5 h-2.5 mr-1" />
                            {cell.label}
                          </Badge>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Gösterim:</span>
              <Badge variant="muted" className="!text-[9px] bg-primary/20 text-primary border-primary/30"><Crown className="w-2 h-2 mr-1" />Tam Erişim (Admin)</Badge>
              <Badge variant="muted" className="!text-[9px] bg-neon-green/20 text-neon-green border-neon-green/30"><CheckCircle2 className="w-2 h-2 mr-1" />Oku + Yaz + Sil</Badge>
              <Badge variant="muted" className="!text-[9px] bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30"><Pencil className="w-2 h-2 mr-1" />Oku + Yaz</Badge>
              <Badge variant="muted" className="!text-[9px] bg-neon-purple/20 text-neon-purple border-neon-purple/30"><Eye className="w-2 h-2 mr-1" />Sadece Okuma</Badge>
              <Badge variant="muted" className="!text-[9px] !bg-white/[0.02] text-muted-foreground border-white/5"><Ban className="w-2 h-2 mr-1" />Erişim Yok</Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              ROLE_PERMISSIONS · {Object.keys(ROLE_PERMISSIONS).length} rol · {permGroups.length} modül
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid md:grid-cols-5 gap-3">
            {(Object.keys(ROLE_LABELS) as AppRole[]).map(r => {
              const perms = ROLE_PERMISSIONS[r];
              const isAdmin = perms.includes("*");
              const RoleIcon = ROLE_ICON[r];
              return (
                <div key={r} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center",
                        r === "admin" && "bg-gradient-to-br from-primary to-secondary",
                        r === "producer" && "bg-gradient-to-br from-neon-pink to-primary",
                        r === "vocalist" && "bg-gradient-to-br from-neon-cyan to-neon-purple",
                        r === "songwriter" && "bg-gradient-to-br from-neon-green to-accent",
                        r === "engineer" && "bg-gradient-to-br from-neon-orange to-neon-pink",
                      )}>
                        <RoleIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{ROLE_LABELS[r]}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{perms.length === 1 && isAdmin ? "∞ izin" : `${perms.length} izin`}</div>
                      </div>
                    </div>
                    <Badge variant="muted" className={cn("!text-[9px] !px-1.5", ROLE_COLORS[r])}>
                      {MEMBERS.filter(m => m.role === r).length} kişi
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                    {isAdmin ? (
                      <div className="w-full p-3 rounded-lg bg-primary/5 border border-primary/15 space-y-1.5">
                        <div className="text-[10px] text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" /> Tam Yönetici
                        </div>
                        <div className="text-xs text-foreground">Sistemdeki tüm modüller için sınırsız erişim. Ayarlardan roller ve izinleri yönetebilir.</div>
                      </div>
                    ) : (
                      permGroups.map(p => {
                        const h = hasPerm(r, p.key);
                        if (h === "none") return null;
                        const badge = h === "full" ? "success" : h === "write" ? "info" : "muted";
                        const Icon = h === "full" ? CheckCircle2 : h === "write" ? Pencil : Eye;
                        return (
                          <Badge key={p.key} variant={badge as any} className="!text-[9px] !px-1.5 !font-medium">
                            <Icon className="w-2 h-2 mr-1" />
                            {p.label}
                          </Badge>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Card>
    </div>
  );
}
