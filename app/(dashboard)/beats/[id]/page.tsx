"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";
import {
  ArrowLeft,
  Edit3,
  Archive,
  Share2,
  Disc3,
  Gauge,
  Piano,
  Music2,
  Users,
  FileSpreadsheet,
  CheckSquare,
  MessageSquare,
  Mic2,
  Upload,
  Clock,
  Tag,
  Download,
  Volume2,
  SlidersHorizontal,
  PartyPopper,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { WavesurferPlayer } from "@/components/audio/wavesurfer-player";
import { FileUpload } from "@/components/shared/file-upload";
import {
  BEAT_TYPE_LABELS,
  BEAT_TYPE_COLORS,
  ROLE_COLORS,
  ROLE_LABELS,
  type AppRole,
  type BeatType,
  SPLIT_ROLE_LABELS,
  type SplitRole,
  STORAGE_BUCKETS,
} from "@/lib/constants";
import { cn, bpmColor, formatBytes, formatDateTime, formatDuration, timeAgo } from "@/lib/utils";
import { useSupabaseQueryOne, useSupabaseMutations, useSupabaseQuery } from "@/lib/hooks/use-supabase-query";
import { useProfile } from "@/lib/hooks/use-profile";

const BEAT = {
  id: "1",
  title: "Midnight Vibes",
  bpm: 140,
  key: "C# Minor",
  genre: "Drill",
  type: "mix_pending" as BeatType,
  tags: ["dark", "aggressive", "uk", "808"],
  description: "Gece sürüş hissi, agresif 808'ler ve melankolik melodiler. UK Drill alt yapısı.",
  cover: null,
  projectArchiveUrl: "/archives/midnight-vibes-v3.zip",
  projectArchiveSize: 184000000,
  createdAt: "2026-09-01T14:22:00Z",
  updatedAt: "2026-09-17T20:34:00Z",
  createdBy: { name: "Mert Yılmaz", role: "producer" as AppRole },
  collaborators: [
    { name: "Mert Yılmaz", role: "producer" as AppRole },
    { name: "Zeynep Kara", role: "vocalist" as AppRole },
    { name: "Can Demir", role: "engineer" as AppRole },
    { name: "Ali Şahin", role: "songwriter" as AppRole },
  ],
};

const VERSIONS = [
  {
    id: "v1",
    name: "v1",
    audioUrl: "/demo-audio.mp3",
    notes: "İskelet demo. Kick ve 808 yeri, melodi tanıtıldı.",
    duration: 142,
    fileSize: 18200000,
    by: "Mert Yılmaz",
    byRole: "producer" as AppRole,
    date: "2026-09-01",
  },
  {
    id: "v2",
    name: "v2 - Vocal Demo",
    audioUrl: "/demo-audio-2.mp3",
    notes: "Zeynep'in vokal demosu eklendi. Hook kısmı için ref yazıldı.",
    duration: 162,
    fileSize: 25400000,
    by: "Zeynep Kara",
    byRole: "vocalist" as AppRole,
    date: "2026-09-05",
  },
  {
    id: "v3",
    name: "v3 - Mix 2",
    audioUrl: "/demo-audio-3.mp3",
    notes: "Sidechain basıncı artırıldı. Vokal compressor revize. Hala reverb denemesi sürüyor.",
    duration: 178,
    fileSize: 28600000,
    by: "Can Demir",
    byRole: "engineer" as AppRole,
    date: "2026-09-17",
  },
];

const TASKS = [
  { id: 1, title: "Hook sözlerini gözden geçir", status: "Tamamlandı", by: "Ali Şahin", date: "2026-09-14", done: true },
  { id: 2, title: "Bridge kısmını 8 bar uzat", status: "Yapıldı", by: "Mert Yılmaz", date: "2026-09-12", done: true },
  { id: 3, title: "Vokal ad-lib ve double-track", status: "Devam ediyor", by: "Zeynep Kara", date: "2026-09-18", done: false },
  { id: 4, title: "Master revizyon - LUFS -14 target", status: "Bekliyor", by: "Can Demir", date: "2026-09-20", done: false },
];

const COMMENTS = [
  { id: 1, time: 42, by: "Can Demir", byRole: "engineer" as AppRole, text: "Kick bu saniyede biraz yumuşak gelebilir, yan effect ön plana çıkmış.", resolved: false, when: "2 gün önce" },
  { id: 2, time: 86, by: "Mert Yılmaz", byRole: "producer" as AppRole, text: "808'leri bass boost yapalım mı? Biraz patlamıyor şu an.", resolved: true, when: "1 gün önce" },
  { id: 3, time: null, by: "Zeynep Kara", byRole: "vocalist" as AppRole, text: "Genel hava bence çok iyi. Sadece son chorus'ta vokal arka planda kalmış.", resolved: false, when: "5 saat önce" },
];

const LYRICS = [
  { id: 1, section: "Intro", text: "(instrumental build-up)", start: 0, end: 12, order: 0 },
  { id: 2, section: "Verse 1", text: "Gece sokaklar benimle konuşur\nNefesimde soğuk, kalbim hüzür\nHer adımım bir şarkı yazar\nSiyah gökyüzünde yıldız biziz", start: 12, end: 48, order: 1 },
  { id: 3, section: "Pre-Hook", text: "Ve hissettiğim anların içinde\nBiliyorum kaybedersem bile seninle", start: 48, end: 62, order: 2 },
  { id: 4, section: "Hook", text: "Midnight vibes, gece ve ben\nAdımızı yazdık rüzgara inan\nMidnight vibes, yanımda sensen\nDüşünmem hiç bitmeyeceğini", start: 62, end: 92, order: 3 },
  { id: 5, section: "Verse 2", text: "", start: 92, end: 128, order: 4 },
  { id: 6, section: "Bridge", text: "", start: 128, end: 148, order: 5 },
  { id: 7, section: "Hook (x2)", text: "", start: 148, end: 178, order: 6 },
];

const SPLIT = [
  { who: "Mert Yılmaz", role: "producer" as SplitRole, master: 50, mechanical: 30 },
  { who: "Zeynep Kara", role: "vocalist" as SplitRole, master: 20, mechanical: 25 },
  { who: "Ali Şahin", role: "songwriter" as SplitRole, master: 10, mechanical: 45 },
  { who: "Can Demir", role: "producer" as SplitRole, master: 20, mechanical: 0 },
];

const FALLBACK_BEAT = BEAT;
const FALLBACK_VERSIONS = VERSIONS;
const FALLBACK_TASKS = TASKS;
const FALLBACK_COMMENTS = COMMENTS;
const FALLBACK_LYRICS = LYRICS;
const FALLBACK_SPLIT = SPLIT;

export default function BeatDetailPage() {
  const params = useParams<{ id: string }>();
  const { initialized } = useProfile();
  const id = typeof params === "object" && params ? String(params.id) : undefined;

  const {
    data: beatRaw,
    loading: beatLoading,
    error: beatError,
  } = useSupabaseQueryOne<typeof FALLBACK_BEAT>("beats", id, {
    select: "*, created_by:profiles!beats_created_by_fkey(id, full_name, role)",
    fallback: FALLBACK_BEAT,
    enabled: (initialized || typeof window === "undefined") && !!id,
  });

  const { data: versionsRaw, error: versionsError } = useSupabaseQuery<any>("beat_versions", {
    filters: id ? [{ field: "beat_id", op: "eq", value: id }] : [],
    fallback: FALLBACK_VERSIONS,
    order: { field: "createdAt", ascending: true },
    enabled: (initialized || typeof window === "undefined") && !!id,
  });

  const beatVersionOptions = React.useMemo(() => {
    if (!versionsRaw) return [];
    return versionsRaw.map((v) => ({
      id: v.id,
      name: v.version_name || v.name || `v${v.id}`,
      audioUrl: v.audio_url || v.audioUrl || "/demo-audio.mp3",
      notes: v.notes,
      duration: v.duration_seconds ?? 0,
      fileSize: v.file_size_bytes,
      by: v.created_by,
      byRole: v.created_by ? (v.role as AppRole) ?? "producer" : "producer",
      date: v.created_at,
    }));
  }, [versionsRaw]);

  const { data: tasksRaw } = useSupabaseQuery<typeof FALLBACK_TASKS[number]>("tasks", {
    filters: id ? [{ field: "beat_id", op: "eq", value: id }] : [],
    fallback: FALLBACK_TASKS,
    enabled: (initialized || typeof window === "undefined") && !!id,
  });

  const { data: commentsRaw } = useSupabaseQuery<typeof FALLBACK_COMMENTS[number]>("comments", {
    filters: id ? [{ field: "beat_id", op: "eq", value: id }] : [],
    fallback: FALLBACK_COMMENTS,
    enabled: (initialized || typeof window === "undefined") && !!id,
  });

  const { data: lyricsRaw } = useSupabaseQuery<typeof FALLBACK_LYRICS[number]>("lyric_lines", {
    filters: id ? [{ field: "beat_id", op: "eq", value: id }] : [],
    fallback: FALLBACK_LYRICS,
    order: { field: "order", ascending: true },
    enabled: (initialized || typeof window === "undefined") && !!id,
  });

  const { data: splitRaw } = useSupabaseQuery<typeof FALLBACK_SPLIT[number]>("split_splits", {
    filters: id ? [{ field: "beat_id", op: "eq", value: id }] : [],
    fallback: FALLBACK_SPLIT,
    enabled: (initialized || typeof window === "undefined") && !!id,
  });

  const beat = React.useMemo(() => {
    const b: any = beatRaw ?? FALLBACK_BEAT;
    return {
      ...FALLBACK_BEAT,
      ...b,
      key: (b as any).musical_key ?? b.key ?? FALLBACK_BEAT.key,
      createdBy: (b as any).createdBy ?? {
        name:
          ((b as any).created_by as any)?.full_name ??
          FALLBACK_BEAT.createdBy.name,
        role:
          ((b as any).created_by as any)?.role ??
          FALLBACK_BEAT.createdBy.role,
      },
    } as typeof FALLBACK_BEAT;
  }, [beatRaw]);

  const versions = beatVersionOptions.length ? beatVersionOptions : FALLBACK_VERSIONS;
  const tasks = tasksRaw?.length ? tasksRaw : FALLBACK_TASKS;
  const comments = commentsRaw?.length ? commentsRaw : FALLBACK_COMMENTS;
  const lyrics = lyricsRaw?.length ? lyricsRaw : FALLBACK_LYRICS;
  const split = splitRaw?.length ? splitRaw : FALLBACK_SPLIT;

  const latest = versions[versions.length - 1] ?? FALLBACK_VERSIONS[FALLBACK_VERSIONS.length - 1];
  const totalMaster = split.reduce((a, s) => a + (s as any).master, 0);
  const totalMech = split.reduce((a, s) => a + (s as any).mechanical, 0);

  if (beatLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <div className="font-semibold">Beat yükleniyor...</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {beatError && (
        <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            Supabase bağlantı hatası — demo veriler gösteriliyor. <span className="font-mono opacity-70">.env.local</span> dosyasını kontrol edin.
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <Link href="/beats" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Beat Deposu · Tüm beat'ler
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/25 to-accent/30 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_40px_hsl(var(--primary)/0.25)] hidden sm:flex">
              <Disc3 className="w-10 h-10 text-white/90 animate-spin-slow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Badge variant="muted" className={cn("!px-2", BEAT_TYPE_COLORS[(beat.type as BeatType) ?? FALLBACK_BEAT.type])}>
                  {BEAT_TYPE_LABELS[(beat.type as BeatType) ?? FALLBACK_BEAT.type]}
                </Badge>
                <Badge variant="muted" className="!text-[10px]">
                  {versions.length} sürüm · {latest.name || "v1"}
                </Badge>
                <Badge variant="muted" className="!text-[10px]">
                  <PartyPopper className="w-2.5 h-2.5 mr-1" />
                  Oluşturulma {timeAgo(beat.createdAt ?? FALLBACK_BEAT.createdAt)}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1.5">{beat.title}</h1>
              <p className="text-muted-foreground mb-3 max-w-2xl">{beat.description}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className={cn("font-mono font-bold", bpmColor(beat.bpm ?? FALLBACK_BEAT.bpm))}>
                  <Gauge className="w-4 h-4 inline mr-1 -mt-0.5" />
                  {beat.bpm ?? FALLBACK_BEAT.bpm} BPM
                </span>
                <span className="font-mono inline-flex items-center gap-1">
                  <Piano className="w-4 h-4" />
                  {beat.key}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Music2 className="w-4 h-4" />
                  {beat.genre}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Son güncelleme {formatDateTime(beat.updatedAt ?? FALLBACK_BEAT.updatedAt)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {(beat.tags || FALLBACK_BEAT.tags).map((t: string) => (
                  <Badge key={t} variant="muted" className="!text-[11px] !px-2">
                    <Tag className="w-2.5 h-2.5 mr-1 opacity-60" />
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-1.5" />
            Düzenle
          </Button>
          {(beat.projectArchiveUrl || FALLBACK_BEAT.projectArchiveUrl) && (
            <a href={beat.projectArchiveUrl || FALLBACK_BEAT.projectArchiveUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-1.5" />
                Projeyi İndir
                <span className="ml-1.5 text-[10px] text-muted-foreground">
                  ({formatBytes(beat.projectArchiveSize || FALLBACK_BEAT.projectArchiveSize)})
                </span>
              </Button>
            </a>
          )}
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1.5" />
            Paylaş
          </Button>
        </div>
      </div>

      {/* Top Player */}
      <WavesurferPlayer
        audioUrl={latest.audioUrl}
        title={`${beat.title} — ${latest.name || "latest"}}`
        description={`${latest.by || "—"} tarafından ${formatDateTime(latest.date || new Date())}`}
        audioName={(latest.audioUrl || "").split("/").pop()}
        duration={latest.duration}
        fileSize={latest.fileSize}
        downloadableUrl={latest.audioUrl}
        showDownload
      />

      {/* Main Tabs */}
      <Tabs defaultValue="versions" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="versions">
            <Disc3 className="w-3.5 h-3.5 mr-1.5" />
            Sürümler ({versions.length})
          </TabsTrigger>
          <TabsTrigger value="lyrics">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
            Sözler
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
            Görevler ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Yorumlar ({comments.length})
          </TabsTrigger>
          <TabsTrigger value="split">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Split Sheet
          </TabsTrigger>
          <TabsTrigger value="team">
            <Mic2 className="w-3.5 h-3.5 mr-1.5" />
            Ekip & Detay
          </TabsTrigger>
        </TabsList>

        {/* VERSIONS */}
        <TabsContent value="versions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sürüm Geçmişi (Beat Versions)</h2>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1.5" />
              Yeni Sürüm Ekle
            </Button>
          </div>
          <FileUpload
            accept="audio"
            maxFiles={5}
            maxSizeMB={300}
            compact
            label="Yeni vokal demo / versiyonu yükle"
            description={`Yüklenen dosyalar ${STORAGE_BUCKETS.BEAT_AUDIO} bucketına kaydedilir. Buraya sürükleyerek yeni bir beat versiyonu ekle`}
          />
          <div className="space-y-3">
            {versions.map((v: any, i: number) => {
              const isLatest = i === versions.length - 1;
              return (
                <Card key={v.id || v.version || i} className={cn("overflow-hidden", isLatest && "neon-border")}>
                  <CardContent className="p-4 md:p-5 space-y-3">
                    <div className="flex flex-wrap items-start md:items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-3">
                        <Badge variant={isLatest ? "default" : "outline"} className="!text-[11px] !px-2.5">
                          {v.name || v.version || `v${i + 1}`}
                          {isLatest && <span className="ml-1.5 text-[9px] opacity-80">· EN YENİ</span>}
                        </Badge>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                          <Avatar name={v.by || v.uploadedBy || "—"} size="sm" />
                          <span>{v.by || v.uploadedBy || "—"}</span>
                          <Badge variant="muted" className={cn("!text-[9px] !px-1", ROLE_COLORS[(v.byRole || v.uploader_role || "producer") as AppRole] || "bg-white/10")}>
                            {ROLE_LABELS[(v.byRole || v.uploader_role || "producer") as AppRole] || "—"}
                          </Badge>
                          <span>· {formatDate(v.date || v.createdAt || new Date())}</span>
                          <span>· {formatDuration(v.duration ?? 0)} · {formatBytes(v.fileSize ?? 0)}</span>
                        </div>
                      </div>
                      <a href={v.audioUrl || v.url} download target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="sm">
                          <Download className="w-3.5 h-3.5 mr-1" />
                          İndir
                        </Button>
                      </a>
                    </div>
                    <WavesurferPlayer
                      audioUrl={v.audioUrl || v.url}
                      duration={v.duration ?? 0}
                      variant="compact"
                      showDownload={false}
                    />
                    {(v.notes || v.description) && (
                      <div className="text-xs text-muted-foreground italic bg-white/[0.02] border-l-2 border-primary/50 rounded-r-lg p-2.5 pl-3">
                        <SlidersHorizontal className="w-3 h-3 inline mr-1.5 opacity-60" />
                        {v.notes || v.description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* LYRICS */}
        <TabsContent value="lyrics" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Senkronize Sözler (Lyric Pad)</h2>
              <p className="text-sm text-muted-foreground">Beat çalarken sözler otomatik olarak takip edilir.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-1.5" />
                Sözleri Düzenle
              </Button>
              <Button size="sm">
                <Volume2 className="w-4 h-4 mr-1.5" />
                Lyric Pad Aç
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_320px] gap-4">
            <Card>
              <CardContent className="p-5 space-y-0">
                {lyrics.map((l: any, idx: number) => (
                  <div key={l.id || idx} className={cn(
                    "py-3 px-3 rounded-lg -mx-3 mb-1 border-l-2 transition-colors",
                    idx === 3
                      ? "bg-primary/5 border-primary/60"
                      : "border-transparent hover:bg-white/[0.02] hover:border-white/5"
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="muted" className="!text-[10px] !px-2 bg-primary/10 text-primary border-primary/20">
                        {l.section || `Satır ${(l.order ?? idx) + 1}`}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">
                        {formatDuration(l.start ?? 0)} — {formatDuration(l.end ?? 0)}
                      </span>
                    </div>
                    <p className={cn(
                      "whitespace-pre-wrap text-sm leading-relaxed",
                      !l.text && "italic text-muted-foreground/70"
                    )}>
                      {l.text || "[henüz yazılmadı]"}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="h-fit sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Canlı Söz Modu</CardTitle>
                <CardDescription className="text-xs">
                  Beat oynatılırken, aktif bölüm vurgulanır.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <WavesurferPlayer audioUrl={latest.audioUrl} variant="compact" duration={latest.duration} showDownload={false} />
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-white/5">
                  <div className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">Şu an</div>
                  <div className="font-bold text-lg mb-1">{lyrics[3]?.section || "Aktif Bölüm"}</div>
                  <p className="text-sm leading-relaxed">{lyrics[3]?.text || "[henüz yazılmadı]"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TASKS */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Proje Görevleri</h2>
            <Button size="sm"><CheckSquare className="w-4 h-4 mr-1.5" />Yeni Görev</Button>
          </div>
          <div className="space-y-2">
            {tasks.map((t: any, idx: number) => {
              const isDone = t.done ?? (t.status === "Tamamlandı" || t.status === "completed" || false);
              return (
                <div key={t.id || idx} className={cn(
                  "p-4 rounded-xl border transition-all flex items-center gap-4",
                  isDone ? "bg-neon-green/5 border-neon-green/20" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded-md border-2 shrink-0 flex items-center justify-center",
                    isDone ? "bg-neon-green border-neon-green/30" : "border-white/10"
                  )}>
                    {isDone && <CheckSquare className="w-4 h-4 text-dark" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("font-medium text-sm", isDone && "line-through text-muted-foreground")}>
                      {t.title || t.name || "Görev başlığı"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <Avatar name={t.by || t.assigned_to || "—"} size="sm" />
                      {t.by || t.assigned_to || "Atanmamış"} · {formatDate(t.date || t.due_date || t.createdAt || new Date())}
                    </div>
                  </div>
                  <Badge variant={isDone ? "success" : "muted"} className="!text-[10px] !px-2">
                    {t.status || (isDone ? "Tamamlandı" : "Bekliyor")}
                  </Badge>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* COMMENTS */}
        <TabsContent value="comments" className="space-y-4">
          <h2 className="text-xl font-semibold">Zaman Damgalı Yorumlar</h2>
          <Card>
            <CardContent className="p-0">
              <WavesurferPlayer audioUrl={latest.audioUrl} duration={latest.duration} showDownload={false} />
              <div className="p-5 border-t border-white/5 space-y-3">
                {comments.map((c: any, idx: number) => {
                  const by = c.by || c.author || "—";
                  const byRole = (c.byRole || c.author_role || "producer") as AppRole;
                  const resolved = c.resolved ?? false;
                  return (
                    <div key={c.id || idx} className={cn(
                      "p-3 rounded-xl border flex gap-3",
                      resolved ? "bg-neon-green/5 border-neon-green/15" : "bg-white/[0.02] border-white/5"
                    )}>
                      <Avatar name={by} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{by}</span>
                          <Badge variant="muted" className={cn("!px-1.5 !text-[9px]", ROLE_COLORS[byRole] || "bg-white/10")}>
                            {ROLE_LABELS[byRole] || "—"}
                          </Badge>
                          {c.time !== null && c.time !== undefined && (
                            <Badge variant="accent" className="!text-[9px] !px-2 font-mono">
                              ⏱ {formatDuration(c.time)}
                            </Badge>
                          )}
                          <span className="ml-auto text-[10px] text-muted-foreground">{c.when || (c.createdAt ? timeAgo(c.createdAt) : "—")}</span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{c.text || c.content || ""}</p>
                        {resolved && (
                          <Badge variant="success" className="!text-[10px] mt-2">
                            ✅ Çözüldü
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SPLIT */}
        <TabsContent value="split" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Telif Payı (Split Sheet)</h2>
              <p className="text-sm text-muted-foreground">Master ve Mechanical % payları</p>
            </div>
            <Button size="sm">Split'i Kaydet</Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Sharing — {beat.title}</span>
                <AvatarGroup size="sm">
                  {split.map((s: any, idx: number) => (
                    <Avatar key={s.who || s.name || idx} name={s.who || s.name || "—"} size="sm" />
                  ))}
                </AvatarGroup>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {split.map((s: any, idx: number) => {
                const who = s.who || s.name || "—";
                const role = (s.role || "producer") as SplitRole;
                const master = s.master ?? 0;
                const mechanical = s.mechanical ?? 0;
                return (
                  <div key={who + idx} className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={who} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{who}</span>
                          <Badge variant="muted" className={cn("!text-[9px] !px-1.5", ROLE_COLORS[role as unknown as AppRole] || "bg-white/10")}>
                            {SPLIT_ROLE_LABELS[role] || "—"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-3 text-xs tabular-nums">
                        <div className="text-right min-w-[70px]">
                          <div className="text-muted-foreground">Master</div>
                          <div className="font-bold text-primary">%{master}</div>
                        </div>
                        <div className="text-right min-w-[70px]">
                          <div className="text-muted-foreground">Mech.</div>
                          <div className="font-bold text-secondary">%{mechanical}</div>
                        </div>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-neon-purple"
                        style={{ width: `${master}%` }}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-neon-cyan to-secondary"
                        style={{ width: `${mechanical}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 mt-2 border-t border-white/5 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Master Toplam</div>
                  <div className={cn("text-2xl font-bold tabular-nums", totalMaster === 100 ? "text-neon-green" : "text-destructive")}>
                    %{totalMaster}
                    <span className="ml-1 text-xs font-normal opacity-70">{totalMaster === 100 ? "✓" : "düzelt"}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                  <div className="text-xs text-muted-foreground mb-1">Mechanical Toplam</div>
                  <div className={cn("text-2xl font-bold tabular-nums", totalMech === 100 ? "text-neon-green" : "text-destructive")}>
                    %{totalMech}
                    <span className="ml-1 text-xs font-normal opacity-70">{totalMech === 100 ? "✓" : "düzelt"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEAM */}
        <TabsContent value="team" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Katkıda Bulunanlar</CardTitle>
                <CardDescription className="text-xs">Bu beat üzerinde çalışan ekip üyeleri</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {((beatRaw as any)?.collaborators ?? FALLBACK_BEAT.collaborators).map((c: any, idx: number) => (
                    <li key={c.name || idx} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                      <Avatar name={c.name || "—"} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{c.name || "—"}</div>
                        <Badge variant="muted" className={cn("!text-[10px] !px-1.5 mt-0.5", ROLE_COLORS[c.role as AppRole] || "bg-white/10")}>
                          {ROLE_LABELS[c.role as AppRole] || "—"}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meta Bilgiler</CardTitle>
                <CardDescription className="text-xs">Beat dosyaları ve arşivi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <InfoRow label="Oluşturan">{beat.createdBy.name}</InfoRow>
                <InfoRow label="Oluşturulma">{formatDateTime(beat.createdAt)}</InfoRow>
                <InfoRow label="Son güncelleme">{formatDateTime(beat.updatedAt)}</InfoRow>
                <InfoRow label="Beat ID"><span className="font-mono text-xs">{beat.id}</span></InfoRow>
                <InfoRow label="Proje Arşivi">
                  {beat.projectArchiveUrl ? (
                    <a className="text-primary hover:underline inline-flex items-center gap-1.5" href={beat.projectArchiveUrl} download>
                      <Archive className="w-3.5 h-3.5" />
                      {(beat.projectArchiveUrl || "").split("/").pop() || "proje.zip"} · {formatBytes(beat.projectArchiveSize || 0)}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Yüklenmedi</span>
                  )}
                </InfoRow>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/[0.02]">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium">{children}</span>
    </div>
  );
}

function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}
