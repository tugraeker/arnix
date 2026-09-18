"use client";

import * as React from "react";
import Link from "next/link";
import {
  StickyNote,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Clock3,
  Mic2,
  Disc3,
  Headphones,
  Sparkles,
  FileText,
  Pin,
  Star,
  Tag,
  MoreHorizontal,
  ArrowRight,
  Volume2,
  Guitar,
  Users,
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
  SESSION_NOTES,
  type SessionNote,
  type AppRole,
} from "@/lib/constants";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { useSupabaseQuery } from "@/lib/hooks/use-supabase-query";

interface SessionNote {
  id: string;
  title: string;
  content: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  engineer: string;
  attendees: string[];
  studio: "Stüdyo A" | "Stüdyo B" | "Mix Room" | "Booth";
  beat?: { id: string; title: string; type?: string };
  tags: string[];
  mood: string;
  todo: string[];
  pinned: boolean;
  starred: boolean;
  recordingsCount: number;
  totalTakes: number;
  bpm: number;
  key: string;
  gear: string[];
  updatedAt: string;
  status: "draft" | "in_progress" | "completed";
}

const SESSIONS: SessionNote[] = [
  {
    id: "s1", title: "Albüm Gün 8 — Güneş Doğarken Vokal Kaydı",
    content: `Bugün Zeynep ile albümün 3. single'ı Güneş Doğarken için ana vokal kayıtları yaptık. Intro, verse 1-2 ve chorus kısımları 3'er take. En iyi take'ler: V2, V4, C3.

Notlar:
• U87ai'de polar pattern cardioid — pop filtre + 3cm mesafe
• Avalon 737sp ile preamp, kompresyon 2:1, 3dB GR
• Chorus'ta hafif double track önerildi (2 track)
• Bridge'de vibrato kontrolü — Zeynep'in yorumuyla stili yakaladık

Plan: Yarın backing vocal + ad-lib kaydı.`,
    sessionDate: "2026-09-18", startTime: "14:00", endTime: "19:30",
    engineer: "Can Demir",
    attendees: ["Zeynep Kara", "Ayşe Şahin", "Can Demir", "Mert Yılmaz"],
    studio: "Stüdyo A",
    beat: { id: "2", title: "Güneş Doğarken", type: "for_sale" },
    tags: ["Albüm", "Vokal", "Ana Kayıt", "Lead"],
    mood: "Romantik - Duygusal",
    todo: ["Backing vocal al", "Ad-libler", "Comping (Can)", "Muhalefet"],
    pinned: true, starred: true,
    recordingsCount: 18, totalTakes: 27,
    bpm: 92, key: "Am",
    gear: ["Neumann U87 Ai", "Avalon 737sp", "Manley VoxBox", "Pro Tools HDX", "Genelec 8351A"],
    updatedAt: "2026-09-18T19:30:00",
    status: "in_progress",
  },
  {
    id: "s2", title: "Kozmik Dans — Beat Revision + Mix Taslak",
    content: "Kaan ile beat revizyonu. 2. drop'ta 808 subs basıkıldı. Hi-hat'lar 1/32 shuffle, gümbürültü efekt eklendi. Hook'ta FM synth lead revize edildi.",
    sessionDate: "2026-09-17", startTime: "11:00", endTime: "16:00",
    engineer: "Berna Gül",
    attendees: ["Kaan Arslan", "Berna Gül"],
    studio: "Mix Room",
    beat: { id: "5", title: "Kozmik Dans", type: "available" },
    tags: ["Beat", "Revizyon", "Mix Draft"],
    mood: "Neşeli - Dans",
    todo: ["Mastering denemesi", "Enstrüman revizyonları"],
    pinned: false, starred: true,
    recordingsCount: 6, totalTakes: 9,
    bpm: 128, key: "Fm",
    gear: ["Ableton Live 12", "SSL UC1", "FabFilter Pro-Q3", "UAD Studer A800"],
    updatedAt: "2026-09-17T16:10:00",
    status: "completed",
  },
  {
    id: "s3", title: "Derin Sular — Mix & Master Ana Seans",
    content: "Derin Sular Albüm track master. 6 saat mix çalışması. Kick + bass ilişkisi oturtuldu, tınlama giderildi. Vokal kalınlığı 2.5dB arttırıldı. Reverb return A+B denemeleri.",
    sessionDate: "2026-09-19", startTime: "10:00", endTime: "18:00",
    engineer: "Can Demir",
    attendees: ["Can Demir", "Mert Yılmaz"],
    studio: "Mix Room",
    beat: { id: "4", title: "Derin Sular", type: "completed" },
    tags: ["Mix", "Master", "SSL"],
    mood: "Melankolik - Derin",
    todo: ["Alternatif master", "Dolby Atmos uyarlama"],
    pinned: true, starred: false,
    recordingsCount: 12, totalTakes: 16,
    bpm: 85, key: "Cm",
    gear: ["SSL 4000E", "Neve 1073 x8", "Manley Variable Mu", "TC Electronic System 6000"],
    updatedAt: "2026-09-18T21:45:00",
    status: "in_progress",
  },
  {
    id: "s4", title: "Rap Seans — Deniz Kaya Single",
    content: "Gözlerim Kanıyor single için rap + melodik hook kayıtları. 4 strophe + 2 chorus + 2 bridge. En iyi take'ler not edildi. Ad-lib havuzu 48 kayıt.",
    sessionDate: "2026-09-15", startTime: "21:00", endTime: "02:30",
    engineer: "Berna Gül",
    attendees: ["Deniz Kaya", "Berna Gül"],
    studio: "Booth",
    tags: ["Rap", "Ad-lib", "Vokal"],
    mood: "Agresif - Melodik",
    todo: ["Comping", "Vocal effect chains"],
    pinned: false, starred: false,
    recordingsCount: 58, totalTakes: 72,
    bpm: 140, key: "Gm",
    gear: ["Shure SM7B", "Neve 1073", "Universal Audio LA-2A", "Ableton"],
    updatedAt: "2026-09-15T02:30:00",
    status: "completed",
  },
  {
    id: "s5", title: "Neon Nights — Vokal + Gitar Akustiği",
    content: "Kaan EP'si Neon Nights 5. parça için akustik gitar (Taylor 814ce) + vokal kaydı. Ambient miking 2x SM57 + C414.",
    sessionDate: "2026-09-13", startTime: "13:00", endTime: "17:30",
    engineer: "Can Demir",
    attendees: ["Kaan Arslan", "Can Demir"],
    studio: "Stüdyo B",
    tags: ["Akustik", "Gitar", "Folk"],
    mood: "Düşünceli - Huzurlu",
    todo: ["Double gitar + reverb"],
    pinned: false, starred: false,
    recordingsCount: 22, totalTakes: 31,
    bpm: 95, key: "Dm",
    gear: ["Taylor 814ce", "AKG C414", "Shure SM57 x2", "API 512c"],
    updatedAt: "2026-09-13T17:30:00",
    status: "completed",
  },
  {
    id: "s6", title: "Demo Review — Yeni Beat Havuzu",
    content: "Mert ile yeni 12 beat demo review. 7 tanesi albüm için aday. Shortlist: Night Drive, Derin Sular 2, Ay Işığı.",
    sessionDate: "2026-09-10", startTime: "15:00", endTime: "17:00",
    engineer: "Selin Öztürk",
    attendees: ["Mert Yılmaz", "Selin Öztürk", "Zeynep Kara"],
    studio: "Stüdyo A",
    tags: ["Review", "A&R"],
    mood: "Profesyonel",
    todo: ["Shortlist revizyonu"],
    pinned: false, starred: true,
    recordingsCount: 0, totalTakes: 0,
    bpm: 100, key: "-",
    gear: ["Genelec 8351A", "Lynx Aurora(n)"],
    updatedAt: "2026-09-10T17:05:00",
    status: "completed",
  },
];

const STATUS_COLORS: Record<SessionNote["status"], string> = {
  draft: "bg-muted text-muted-foreground border-white/5",
  in_progress: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
  completed: "bg-neon-green/20 text-neon-green border-neon-green/30",
};
const STATUS_LABELS: Record<SessionNote["status"], string> = {
  draft: "Taslak",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
};

const STUDIO_COLORS: Record<SessionNote["studio"], string> = {
  "Stüdyo A": "from-primary to-neon-purple",
  "Stüdyo B": "from-neon-cyan to-secondary",
  "Mix Room": "from-neon-pink to-destructive",
  "Booth": "from-neon-orange to-neon-pink",
};

export default function SessionNotesPage() {
  const { data: sessions, loading, error } = useSupabaseQuery<SessionNote>("session_notes", {
    select: "*",
    order: { field: "updatedAt", ascending: false },
    fallback: SESSIONS,
    enabled: typeof window !== "undefined",
  });
  const [search, setSearch] = React.useState("");
  const [activeId, setActiveId] = React.useState(sessions?.[0]?.id ?? SESSIONS[0].id);
  const active = sessions?.find(s => s.id === activeId) ?? SESSIONS.find(s => s.id === activeId)!;
  const [filterStudio, setFilterStudio] = React.useState("all");
  const [tab, setTab] = React.useState<"list" | "board" | "timeline">("list");

  const filtered = sessions?.filter(s => {
    if (search && !(s.title.toLowerCase().includes(search.toLowerCase()) || s.content.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterStudio !== "all" && s.studio !== filterStudio) return false;
    return true;
  }) ?? SESSIONS.filter(s => {
    if (search && !(s.title.toLowerCase().includes(search.toLowerCase()) || s.content.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterStudio !== "all" && s.studio !== filterStudio) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" className="!px-2 !text-[10px] tracking-wider">
              <StickyNote className="w-3 h-3 mr-1.5" />
              SESSION NOTES
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {SESSIONS.length} seans · {SESSIONS.filter(s => s.status === "in_progress").length} devam ediyor
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Seans Notları</h1>
          <p className="text-muted-foreground">Her kayıt seansının detayları, alınan take'ler, kullanılan ekipmanlar ve yapılacaklar</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-1.5" />
            Şablon Yönet
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Yeni Seans Notu
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Toplam Seans</Badge>
              <Mic2 className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-bold tabular-nums">{sessions?.length ?? SESSIONS.length}</div>
            <div className="text-[11px] text-muted-foreground">Bu ay +2 yeni</div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Kayıtlı Take</Badge>
              <Headphones className="w-4 h-4 text-neon-cyan" />
            </div>
            <div className="text-3xl font-bold tabular-nums">{sessions?.reduce((a, b) => a + b.totalTakes, 0) ?? SESSIONS.reduce((a, b) => a + b.totalTakes, 0)}</div>
            <div className="text-[11px] text-muted-foreground">Ort. {Math.round((sessions?.reduce((a, b) => a + b.totalTakes, 0) ?? SESSIONS.reduce((a, b) => a + b.totalTakes, 0)) / (sessions?.length ?? SESSIONS.length))} take/seans</div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Saat</Badge>
              <Clock3 className="w-4 h-4 text-neon-green" />
            </div>
            <div className="text-3xl font-bold tabular-nums">124.5</div>
            <div className="text-[11px] text-muted-foreground">Bu ay stüdyo saati</div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Tamamlanan</Badge>
              <Sparkles className="w-4 h-4 text-neon-pink" />
            </div>
            <div className="text-3xl font-bold tabular-nums">
              {sessions?.filter(s => s.status === "completed").length ?? SESSIONS.filter(s => s.status === "completed").length}
              <span className="text-base text-muted-foreground font-normal">/{sessions?.length ?? SESSIONS.length}</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              %{Math.round((sessions?.filter(s => s.status === "completed").length ?? SESSIONS.filter(s => s.status === "completed").length) / (sessions?.length ?? SESSIONS.length) * 100)} tamamlanma
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + tabs */}
      <Card className="p-4">
        <CardContent className="p-0 space-y-3">
          <div className="grid md:grid-cols-5 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Seans notu ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterStudio} onValueChange={setFilterStudio}>
              <SelectTrigger>
                <Disc3 className="w-3.5 h-3.5 mr-1.5 inline text-muted-foreground" />
                <SelectValue placeholder="Stüdyo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Stüdyolar</SelectItem>
                <SelectItem value="Stüdyo A">Stüdyo A</SelectItem>
                <SelectItem value="Stüdyo B">Stüdyo B</SelectItem>
                <SelectItem value="Mix Room">Mix Room</SelectItem>
                <SelectItem value="Booth">Vokal Booth</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="!text-[11px]">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              Gelişmiş Filtre
            </Button>
            <Tabs defaultValue="list" value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList className="w-full !p-0.5">
                <TabsTrigger value="list" className="!text-[10px] !px-3 !py-1 flex-1">Liste</TabsTrigger>
                <TabsTrigger value="board" className="!text-[10px] !px-3 !py-1 flex-1">Board</TabsTrigger>
                <TabsTrigger value="timeline" className="!text-[10px] !px-3 !py-1 flex-1">Zaman Çiz.</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <TabsContent value="list">
        <div className="grid lg:grid-cols-12 gap-4">
          {/* List */}
          <Card className="lg:col-span-5 p-0 overflow-hidden">
            <div className="p-3 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="text-sm font-semibold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                {filtered.length} Seans
              </div>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[130px] !h-7 !text-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">En Yeni</SelectItem>
                  <SelectItem value="oldest">En Eski</SelectItem>
                  <SelectItem value="pinned">Sabitle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-[780px] overflow-y-auto">
              {filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.updatedAt as any) - (a.updatedAt as any)).map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "w-full text-left p-4 border-b border-white/5 transition-all relative overflow-hidden",
                    activeId === s.id ? "bg-primary/5" : "hover:bg-white/[0.02]",
                  )}
                >
                  {activeId === s.id && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b from-primary to-secondary" />
                  )}
                  <div className="pl-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          {s.pinned && <Pin className="w-3.5 h-3.5 text-neon-pink fill-neon-pink" />}
                          {s.starred && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
                          <div className="text-sm font-bold truncate flex-1 min-w-0">{s.title}</div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="muted" className={cn("!text-[8px] !px-1.5", STATUS_COLORS[s.status])}>
                            {STATUS_LABELS[s.status]}
                          </Badge>
                          <Badge variant="outline" className="!text-[8px] !px-1.5">
                            {s.studio}
                          </Badge>
                          <Badge variant="outline" className="!text-[8px] !px-1.5">
                            {s.bpm} BPM · {s.key}
                          </Badge>
                        </div>
                      </div>
                      <button className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDate(s.sessionDate)}
                      </span>
                      <span>·</span>
                      <span className="font-mono">{s.startTime}-{s.endTime}</span>
                      <span>·</span>
                      <span>{s.engineer}</span>
                    </div>
                    {s.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {s.tags.slice(0, 3).map(t => (
                          <Badge key={t} variant="muted" className="!text-[7px] !px-1.5">
                            <Tag className="w-1.5 h-1.5 mr-0.5" />
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <AvatarGroup size="xs">
                        {s.attendees.slice(0, 4).map(a => <Avatar key={a} name={a} />)}
                      </AvatarGroup>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-0.5"><Mic2 className="w-2.5 h-2.5" />{s.totalTakes}</span>
                        <span>·</span>
                        <span>{timeAgo(s.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Detail */}
          <Card className="lg:col-span-7 p-0 overflow-hidden">
            {/* Detail header */}
            <div className={cn("h-20 relative overflow-hidden bg-gradient-to-br", STUDIO_COLORS[active.studio])}>
              <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{
                backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3), transparent 60%)"
              }} />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-2 flex-wrap">
                <div className="text-white space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {active.pinned && <Pin className="w-4 h-4 fill-white text-white" />}
                    {active.starred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                    <h2 className="text-xl font-bold">{active.title}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-[11px] flex-wrap">
                    <Badge variant="muted" className={cn("!bg-black/40 backdrop-blur-sm !text-[9px] !px-1.5 !border-white/10", STATUS_COLORS[active.status])}>
                      {STATUS_LABELS[active.status]}
                    </Badge>
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(active.sessionDate)}</span>
                    <span>·</span>
                    <span className="font-mono">{active.startTime} - {active.endTime}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{active.attendees.length} katılımcı</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-colors"><Pin className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-colors"><Star className="w-4 h-4" /></button>
                  <Button size="xs" className="!text-[10px] bg-white/90 text-black hover:bg-white"><Sparkles className="w-3 h-3 mr-1" />AI Özet</Button>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[700px] overflow-y-auto">
              {/* Meta grid */}
              <div className="grid md:grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    <Mic2 className="w-3 h-3" />Mühendis
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Avatar name={active.engineer} size="xs" />
                    <span className="text-xs font-semibold">{active.engineer}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    <Disc3 className="w-3 h-3" />Stüdyo
                  </div>
                  <div className="text-xs font-bold flex items-center gap-1">
                    <span className={cn("w-2 h-2 rounded-full bg-gradient-to-r", STUDIO_COLORS[active.studio])} />
                    {active.studio}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    <Volume2 className="w-3 h-3" />Kayıtlar
                  </div>
                  <div className="text-xs font-bold tabular-nums">
                    {active.recordingsCount} <span className="text-muted-foreground font-normal text-[10px]">· {active.totalTakes} take</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    <Guitar className="w-3 h-3" />Beat
                  </div>
                  {active.beat ? (
                    <Link href={`/beats/${active.beat.id}`} className="text-xs font-semibold text-primary hover:underline underline-offset-2 truncate inline-flex items-center gap-1">
                      {active.beat.title} <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">Bağlı değil</div>
                  )}
                </div>
              </div>

              {/* Attendees */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold flex items-center gap-1">
                  <Users className="w-3 h-3" /> Katılımcılar ({active.attendees.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {active.attendees.map(a => (
                    <div key={a} className="flex items-center gap-1.5 p-1 pr-2 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                      <Avatar name={a} size="xs" />
                      <span className="text-xs font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mood + BPM */}
              <div className="grid md:grid-cols-3 gap-2">
                <div className="md:col-span-1 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Atmosfer</div>
                  <div className="text-sm font-bold">{active.mood}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">BPM</div>
                  <div className="text-2xl font-black tabular-nums text-primary">{active.bpm}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Anahtar</div>
                  <div className="text-2xl font-black tabular-nums text-secondary">{active.key}</div>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold flex items-center gap-1">
                  <StickyNote className="w-3 h-3" /> Seans Notları
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[13px] leading-relaxed whitespace-pre-wrap font-mono text-foreground/90">
                  {active.content}
                </div>
              </div>

              {/* Gear */}
              <div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold flex items-center gap-1">
                  <Headphones className="w-3 h-3" /> Kullanılan Ekipmanlar ({active.gear.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {active.gear.map(g => (
                    <Badge key={g} variant="outline" className="!text-[10px] !px-2 !bg-white/[0.02] border-white/5">
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Etiketler
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {active.tags.map(t => (
                    <Badge key={t} variant="info" className="!text-[9px] !px-2">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Todo */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Yapılacaklar ({active.todo.length})
                  </div>
                  <Button size="xs" variant="outline" className="!text-[9px]">Yeni</Button>
                </div>
                <div className="space-y-1.5">
                  {active.todo.map((t, i) => (
                    <div key={i} className={cn(
                      "flex items-center gap-2 p-2.5 rounded-lg border transition-all",
                      i === 0
                        ? "bg-neon-green/5 border-neon-green/20 line-through text-muted-foreground"
                        : "bg-white/[0.01] border-white/5 hover:bg-white/[0.02]"
                    )}>
                      <div className={cn(
                        "w-4 h-4 rounded-md border flex items-center justify-center shrink-0",
                        i === 0 ? "bg-neon-green/80 border-neon-green" : "border-white/20"
                      )}>
                        {i === 0 && <span className="text-[8px] text-black font-black">✓</span>}
                      </div>
                      <span className="text-xs flex-1">{t}</span>
                      <div className="text-[10px] text-muted-foreground">
                        {i === 0 ? "Tamam" : `Kalan ${i === 1 ? "24s" : i === 2 ? "48s" : "72s"}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5 flex-wrap">
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock3 className="w-3 h-3" />
                  Son güncelleme: {timeAgo(active.updatedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Button size="xs" variant="outline">Dışa Aktar</Button>
                  <Button size="xs"><Sparkles className="w-3 h-3 mr-1" />Kaydet</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="board">
        <div className="grid md:grid-cols-3 gap-4">
          {(["draft", "in_progress", "completed"] as const).map(st => (
            <div key={st} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Badge variant="muted" className={cn("!text-[10px] !px-2", STATUS_COLORS[st])}>
                    {STATUS_LABELS[st]}
                  </Badge>
                  <div className="text-xs font-bold text-muted-foreground">
                    {SESSIONS.filter(s => s.status === st).length}
                  </div>
                </div>
                <PlusCircle className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-2 min-h-[400px] rounded-xl bg-white/[0.02] border border-dashed border-white/5 p-2">
                {SESSIONS.filter(s => s.status === st).map(s => (
                  <Card key={s.id} className="p-3 hover:border-primary/30 transition-all cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-1">
                        <div className="text-xs font-semibold line-clamp-2 flex-1">{s.title}</div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {s.pinned && <Pin className="w-3 h-3 text-neon-pink fill-neon-pink" />}
                          {s.starred && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge variant="outline" className="!text-[8px] !px-1.5">{s.studio}</Badge>
                        <Badge variant="outline" className="!text-[8px] !px-1.5">{s.bpm} · {s.key}</Badge>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar className="w-2.5 h-2.5" />
                          {formatDate(s.sessionDate)}
                        </div>
                        <AvatarGroup size="xxs">
                          {s.attendees.slice(0, 3).map(a => <Avatar key={a} name={a} />)}
                        </AvatarGroup>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="timeline">
        <Card className="p-5">
          <div className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-primary" />
            Seanslar Zaman Çizelgesi
          </div>
          <div className="relative border-l border-white/10 pl-6 pb-2 space-y-6 ml-3">
            {[...SESSIONS].sort((a, b) => (b.sessionDate as any) - (a.sessionDate as any)).map((s, i) => (
              <div key={s.id} className="relative">
                <div className={cn(
                  "absolute -left-[34px] top-2 w-6 h-6 rounded-full ring-4 ring-[hsl(var(--card))] flex items-center justify-center z-10 bg-gradient-to-br",
                  STUDIO_COLORS[s.studio]
                )}>
                  <Mic2 className="w-2.5 h-2.5 text-white" />
                </div>
                <Card className="p-4 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                    <div>
                      <div className="text-sm font-bold mb-1">{s.title}</div>
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-muted-foreground">
                        <span>{formatDate(s.sessionDate)}</span>
                        <span>·</span>
                        <span className="font-mono">{s.startTime} - {s.endTime}</span>
                        <span>·</span>
                        <span>{s.engineer}</span>
                      </div>
                    </div>
                    <Badge variant="muted" className={cn("!text-[8px] !px-1.5", STATUS_COLORS[s.status])}>
                      {STATUS_LABELS[s.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <Badge variant="outline" className="!text-[8px] !px-1.5">{s.studio}</Badge>
                    {s.tags.slice(0, 4).map(t => (
                      <Badge key={t} variant="muted" className="!text-[8px] !px-1.5">#{t}</Badge>
                    ))}
                  </div>
                  <p className="text-[12px] text-muted-foreground line-clamp-2">{s.content}</p>
                </Card>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
    </div>
  );
}
