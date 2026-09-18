"use client";

import Link from "next/link";
import * as React from "react";
import {
  Disc3,
  Filter,
  Search,
  PlusCircle,
  SlidersHorizontal,
  Grid3X3,
  List,
  Archive,
  Tag,
  Music2,
  Gauge,
  Piano,
  Sparkles,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { WavesurferPlayer } from "@/components/audio/wavesurfer-player";
import {
  BEAT_TYPE_LABELS,
  BEAT_TYPE_COLORS,
  type BeatType,
  GENRES,
  MUSICAL_KEYS,
  ROLE_COLORS,
  ROLE_LABELS,
  type AppRole,
} from "@/lib/constants";
import { cn, bpmColor, formatDateTime } from "@/lib/utils";
import { useSupabaseQuery, type QueryFilter } from "@/lib/hooks/use-supabase-query";
import { useProfile } from "@/lib/hooks/use-profile";
import { useDebounced } from "@/lib/hooks/use-debounce";

const FILTER_BEATS = [
  {
    id: "1",
    title: "Midnight Vibes",
    bpm: 140,
    musical_key: "C# Minor",
    genre: "Drill",
    type: "mix_pending" as BeatType,
    tags: ["dark", "aggressive", "uk"],
    versions: 5,
    lastVersion: "v5-mix2",
    duration: 178,
    fileSize: 28600000,
    cover: null,
    projectArchive: true,
    creators: [
      { name: "Mert Yılmaz", role: "producer" as AppRole },
      { name: "Zeynep Kara", role: "vocalist" as AppRole },
    ],
    updatedAt: "2026-09-17T20:34:00Z",
    audioUrl: "/demo-audio.mp3",
  },
  {
    id: "2",
    title: "Güneş Doğarken",
    bpm: 92,
    musical_key: "E Minor",
    genre: "R&B",
    type: "for_sale" as BeatType,
    tags: ["melodic", "smooth", "vibe"],
    versions: 2,
    lastVersion: "v2-master",
    duration: 203,
    fileSize: 36100000,
    cover: null,
    projectArchive: true,
    creators: [
      { name: "Mert Yılmaz", role: "producer" as AppRole },
    ],
    updatedAt: "2026-09-16T14:10:00Z",
    audioUrl: "/demo-audio-2.mp3",
  },
  {
    id: "3",
    title: "Trap City Anthem",
    bpm: 155,
    musical_key: "F Minor",
    genre: "Trap",
    type: "demo" as BeatType,
    tags: ["808", "trap", "epic"],
    versions: 1,
    lastVersion: "v1",
    duration: 156,
    fileSize: 21200000,
    cover: null,
    projectArchive: false,
    creators: [
      { name: "Can Demir", role: "producer" as AppRole },
    ],
    updatedAt: "2026-09-15T09:22:00Z",
    audioUrl: "/demo-audio-3.mp3",
  },
  {
    id: "4",
    title: "Derin Sular",
    bpm: 86,
    musical_key: "G Major",
    genre: "Lo-Fi",
    type: "completed" as BeatType,
    tags: ["chill", "sad", "lofi"],
    versions: 7,
    lastVersion: "v7-final",
    duration: 221,
    fileSize: 44800000,
    cover: null,
    projectArchive: true,
    creators: [
      { name: "Mert Yılmaz", role: "producer" as AppRole },
      { name: "Ali Şahin", role: "songwriter" as AppRole },
      { name: "Zeynep Kara", role: "vocalist" as AppRole },
    ],
    updatedAt: "2026-09-12T23:05:00Z",
    audioUrl: "/demo-audio.mp3",
  },
  {
    id: "5",
    title: "Kozmik Dans",
    bpm: 128,
    musical_key: "A Minor",
    genre: "House",
    type: "available" as BeatType,
    tags: ["synth", "dance", "euphoric"],
    versions: 3,
    lastVersion: "v3",
    duration: 192,
    fileSize: 31500000,
    cover: null,
    projectArchive: false,
    creators: [
      { name: "Can Demir", role: "engineer" as AppRole },
    ],
    updatedAt: "2026-09-09T17:48:00Z",
    audioUrl: "/demo-audio.mp3",
  },
  {
    id: "6",
    title: "Neon Sokaklar",
    bpm: 160,
    musical_key: "D Major",
    genre: "Drill",
    type: "demo" as BeatType,
    tags: ["neon", "retro", "drill"],
    versions: 1,
    lastVersion: "v1",
    duration: 140,
    fileSize: 19100000,
    cover: null,
    projectArchive: false,
    creators: [
      { name: "Mert Yılmaz", role: "producer" as AppRole },
    ],
    updatedAt: "2026-09-08T11:30:00Z",
    audioUrl: "/demo-audio.mp3",
  },
];

export default function BeatsPage() {
  const { initialized } = useProfile();
  const [search, setSearch] = React.useState("");
  const [genre, setGenre] = React.useState<string>("all");
  const [key, setKey] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const searchDebounced = useDebounced(search, 300);

  const filters: QueryFilter[] = React.useMemo(() => {
    const out: QueryFilter[] = [];
    if (searchDebounced) out.push({ field: "title", op: "ilike", value: searchDebounced });
    if (genre !== "all") out.push({ field: "genre", op: "eq", value: genre });
    if (key !== "all") out.push({ field: "musical_key", op: "eq", value: key });
    if (typeFilter !== "all") out.push({ field: "type", op: "eq", value: typeFilter });
    return out;
  }, [searchDebounced, genre, key, typeFilter]);

  const {
    data: beats,
    loading,
    error,
    count,
  } = useSupabaseQuery<(typeof FILTER_BEATS)[number]>("beats", {
    select: "*, versions(count)",
    filters,
    order: { field: "updatedAt", ascending: false },
    fallback: FILTER_BEATS,
    enabled: initialized || typeof window === "undefined",
  });

  const filtered = React.useMemo(() => {
    if (!beats) return [];
    return beats.filter((b) => {
      if (searchDebounced) {
        const q = searchDebounced.toLowerCase();
        const hit =
          b.title.toLowerCase().includes(q) ||
          (b.genre || "").toLowerCase().includes(q) ||
          (b.tags || []).some((t: string) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (genre !== "all" && (b as any).genre !== genre) return false;
      if (key !== "all" && (b as any).musical_key !== key) return false;
      if (typeFilter !== "all" && (b.type as any) !== typeFilter) return false;
      return true;
    });
  }, [beats, searchDebounced, genre, key, typeFilter]);

  const totalVersions = React.useMemo(
    () => filtered.reduce((a, b) => a + ((b as any).versions?.count ?? b.versions ?? 0), 0),
    [filtered]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" className="!px-2 !text-[10px] tracking-wider">
              <Disc3 className="w-3 h-3 mr-1.5 animate-spin-slow" />
              AUDIO VAULT
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {count ?? filtered.length} beat · {totalVersions} sürüm
            </Badge>
            {loading && (
              <Badge variant="muted" className="!text-[10px]">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Yükleniyor
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Beat Deposu</h1>
          <p className="text-muted-foreground">
            Tüm beat'ler, sürümler, proje arşivleri ve kapak görselleri
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1.5" />
            Filtrele
          </Button>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-1.5" />
            Sırala
          </Button>
          <Link href="/beats/new">
            <Button size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Yeni Beat Yükle
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            Supabase bağlantı hatası — demo veriler gösteriliyor. <span className="font-mono opacity-70">.env.local</span> dosyasını kontrol edin.
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <CardContent className="p-0 grid md:grid-cols-5 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Beat ara - başlık, etiket, tür..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Tür" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Türler</SelectItem>
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={key} onValueChange={setKey}>
            <SelectTrigger>
              <SelectValue placeholder="Ton" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Tonlar</SelectItem>
              {MUSICAL_KEYS.map((k) => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/[0.03] border border-white/5">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", ...Object.keys(BEAT_TYPE_LABELS)] as const).map((key, i) => {
          const label = key === "all" ? "Tümü" : BEAT_TYPE_LABELS[key as BeatType];
          const active = (i === 0 && typeFilter === "all") || typeFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTypeFilter(key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                active
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "border-white/5 bg-white/[0.02] text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Beat Grid */}
      <div className={cn(
        "grid gap-4",
        viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
      )}>
        {loading && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <Card key={i} className="p-5 animate-pulse">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="shrink-0 md:w-40 h-40 md:h-40 w-full rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-2/3 rounded bg-white/5" />
                    <div className="h-3 w-1/2 rounded bg-white/5" />
                    <div className="h-3 w-1/3 rounded bg-white/5" />
                    <div className="h-16 w-full rounded bg-white/5 mt-4" />
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
        {!loading && filtered.length === 0 && (
          <Card className="p-8 col-span-full text-center">
            <Music2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <div className="font-semibold">Eşleşen beat bulunamadı</div>
            <div className="text-sm text-muted-foreground mt-1">Filtreleri değiştirmeyi veya yeni beat yüklemeyi dene.</div>
          </Card>
        )}
        {!loading && filtered.map((beat) => (
          <Card key={beat.id} className="p-5 hover:border-primary/30 transition-all group">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Cover */}
              <Link href={`/beats/${beat.id}`} className="shrink-0 md:w-40 h-40 md:h-40 w-full rounded-xl overflow-hidden relative cursor-pointer">
                <div className="w-full h-full bg-gradient-to-br from-primary/25 via-secondary/20 to-accent/20 flex items-end justify-center">
                  <div className="flex items-end gap-[3px] pb-5 px-4 h-3/4">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[4px] audio-wave-bar rounded-t"
                        style={{
                          height: `${((i * 5 + beat.bpm) % 90) + 10}%`,
                          opacity: 0.5 + ((i * 7) % 50) / 100,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <Badge
                  variant="muted"
                  className={cn(
                    "absolute top-3 left-3 !px-2 !text-[10px]",
                    BEAT_TYPE_COLORS[beat.type]
                  )}
                >
                  {BEAT_TYPE_LABELS[beat.type]}
                </Badge>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {beat.projectArchive && (
                    <div className="p-1.5 rounded-lg bg-background/70 backdrop-blur text-neon-purple" title="Proje arşivi (ZIP/RAR) mevcut">
                      <Archive className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="px-2 py-1 rounded-lg bg-background/70 backdrop-blur text-[10px] font-mono font-bold text-white/90">
                    {beat.lastVersion}
                  </div>
                </div>
              </Link>

              {/* Meta */}
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <Link href={`/beats/${beat.id}`} className="font-bold text-lg md:text-xl hover:underline underline-offset-2">
                    {beat.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
                    <span className={cn("font-mono font-bold", bpmColor(beat.bpm))}>
                      <Gauge className="w-3 h-3 inline mr-1 -mt-0.5" />
                      {beat.bpm} BPM
                    </span>
                    <span className="font-mono inline-flex items-center gap-1">
                      <Piano className="w-3 h-3" />
                      {beat.musical_key}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Music2 className="w-3 h-3" />
                      {beat.genre}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {beat.tags.map((t) => (
                    <Badge key={t} variant="muted" className="!text-[10px] !px-2">
                      <Tag className="w-2.5 h-2.5 mr-1 opacity-60" />
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <AvatarGroup max={3} size="sm">
                    {beat.creators.map((c) => (
                      <div key={c.name} className="relative" title={`${c.name} (${ROLE_LABELS[c.role]})`}>
                        <Avatar name={c.name} size="sm" />
                      </div>
                    ))}
                  </AvatarGroup>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground">Son güncelleme</div>
                    <div className="text-[11px] font-medium">{formatDateTime(beat.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Player */}
            <WavesurferPlayer
              audioUrl={beat.audioUrl}
              title={beat.title}
              duration={beat.duration}
              fileSize={beat.fileSize}
              variant="compact"
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5" />
                {beat.versions} sürüm
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/beats/${beat.id}`}>
                  <Button variant="ghost" size="sm">
                    Detaylar
                    <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
                  </Button>
                </Link>
                <Link href={`/beats/${beat.id}`}>
                  <Button size="sm" variant="outline">
                    <Archive className="w-3.5 h-3.5 mr-1.5" />
                    Projeyi Aç
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
