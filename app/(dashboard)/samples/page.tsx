"use client";

import * as React from "react";
import Link from "next/link";
import {
  Waves,
  PlusCircle,
  Search,
  Filter,
  Heart,
  Download,
  Play,
  Pause,
  Disc3,
  Folder,
  FileAudio,
  Volume2,
  Layers,
  Clock3,
  Tag,
  UploadCloud,
  Sparkles,
  Music2,
  GripVertical,
  MoreHorizontal,
  X,
  Bookmark,
  Copy,
  ChevronRight,
  Zap,
  Target,
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
import { FileUpload } from "@/components/shared/file-upload";
import {
  SAMPLE_CATEGORY_LABELS,
  SAMPLE_CATEGORIES,
  type SampleCategory,
  ROLE_COLORS,
  ROLE_LABELS,
  type AppRole,
  BEAT_TYPE_LABELS,
  type BeatType,
} from "@/lib/constants";
import { cn, formatDate, formatBytes, formatDuration, bpmColor } from "@/lib/utils";

interface SampleItem {
  id: string;
  title: string;
  category: SampleCategory;
  bpm?: number;
  key?: string;
  durationSec: number;
  sizeBytes: number;
  fileType: "wav" | "mp3" | "aiff" | "flac";
  tags: string[];
  waveformColors?: [string, string];
  playCount: number;
  favorite: boolean;
  createdAt: string;
  createdBy: { name: string; role: AppRole };
  usedInBeats?: { id: string; title: string; type: BeatType }[];
  samplePack?: string;
  description?: string;
  collectionStatus: "signed" | "pending" | "cleared" | "uncleared";
}

const CATEGORY_ICONS: Record<SampleCategory, any> = {
  drum_kit: Layers,
  loop: Zap,
  one_shot: Target,
  melodic: Music2,
  vocal: Volume2,
  percussive: GripVertical,
  stem: FileAudio,
  sfx: Sparkles,
};

const CATEGORY_ACCENTS: Record<SampleCategory, string> = {
  drum_kit: "from-neon-orange to-neon-pink",
  loop: "from-primary to-secondary",
  one_shot: "from-neon-green to-accent",
  melodic: "from-neon-pink to-destructive",
  vocal: "from-primary to-neon-cyan",
  percussive: "from-muted to-muted-foreground",
  stem: "from-neon-purple to-primary",
  sfx: "from-neon-cyan to-secondary",
};

const CLEAR_STYLE: Record<SampleItem["collectionStatus"], string> = {
  cleared: "bg-neon-green/20 text-neon-green border-neon-green/30",
  pending: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  signed: "bg-primary/20 text-primary border-primary/30",
  uncleared: "bg-destructive/20 text-destructive border-destructive/30",
};

const CLEAR_LABELS: Record<SampleItem["collectionStatus"], string> = {
  cleared: "Özgürleştirilmiş",
  pending: "Onay Bekliyor",
  signed: "Sözleşmeli",
  uncleared: "Kullanım Kısıtlı",
};

const SAMPLES: SampleItem[] = [
  {
    id: "s1", title: "Neon 808 Kick Punch (G#1)", category: "one_shot",
    bpm: 140, key: "G#1", durationSec: 0.72, sizeBytes: 312000, fileType: "wav",
    tags: ["808", "trap", "hard", "sub"], waveformColors: ["#a855f7", "#ec4899"],
    playCount: 1842, favorite: true, createdAt: "2026-08-11",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
    usedInBeats: [
      { id: "1", title: "Midnight Vibes", type: "mix_pending" },
      { id: "6", title: "Neon Sokaklar", type: "demo" },
    ],
    samplePack: "Arnix Signature 808s Vol.2",
    collectionStatus: "cleared",
    description: "Synthesized 808. Transient punch + 48Hz sub tail. Kaydedildi: Neumann U47 Fet + API 512c",
  },
  {
    id: "s2", title: "Midnight Hi-Hat Loop 16 Bar", category: "loop",
    bpm: 140, key: "Amin", durationSec: 8.12, sizeBytes: 2_400_000, fileType: "wav",
    tags: ["hi-hat", "trap", "pattern", "16th"], waveformColors: ["#06b6d4", "#a855f7"],
    playCount: 932, favorite: true, createdAt: "2026-08-22",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
    usedInBeats: [{ id: "1", title: "Midnight Vibes", type: "mix_pending" }],
    samplePack: "Arnix Signature 808s Vol.2",
    collectionStatus: "cleared",
  },
  {
    id: "s3", title: "Derin Sular Riff — Elektro Gitar", category: "melodic",
    bpm: 92, key: "Amin", durationSec: 12.4, sizeBytes: 5_600_000, fileType: "wav",
    tags: ["riff", "guitar", "ambient", "reverb"], waveformColors: ["#10b981", "#06b6d4"],
    playCount: 221, favorite: false, createdAt: "2026-09-01",
    createdBy: { name: "Ali Şahin", role: "songwriter" },
    usedInBeats: [{ id: "4", title: "Derin Sular", type: "completed" }],
    samplePack: "Turkish Melodic Series",
    collectionStatus: "signed",
    description: "Double-tracked clean electric guitar. Hall reverb + stereo widener.",
  },
  {
    id: "s4", title: "Kozmik Atmos Pad F#min", category: "fx",
    bpm: 128, key: "F#min", durationSec: 6.5, sizeBytes: 4_200_000, fileType: "aiff",
    tags: ["pad", "atmosphere", "synth", "rising"], waveformColors: ["#ec4899", "#a855f7"],
    playCount: 448, favorite: true, createdAt: "2026-08-28",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
    usedInBeats: [{ id: "5", title: "Kozmik Dans", type: "available" }],
    collectionStatus: "cleared",
  },
  {
    id: "s5", title: "Vokal Chop - Zeynep 'Güneş' Hook", category: "vocal",
    bpm: 100, key: "Cmaj", durationSec: 1.8, sizeBytes: 880_000, fileType: "wav",
    tags: ["chop", "vocal", "hook", "sliced"], waveformColors: ["#f97316", "#ec4899"],
    playCount: 1523, favorite: false, createdAt: "2026-09-03",
    createdBy: { name: "Zeynep Kara", role: "vocalist" },
    usedInBeats: [
      { id: "2", title: "Güneş Doğarken", type: "for_sale" },
      { id: "5", title: "Kozmik Dans", type: "available" },
    ],
    samplePack: "Zeynep Kara Vocal Pack",
    collectionStatus: "signed",
    description: "Zeynep'in 'Güneş Doğarken' hook'undan 16. nöbette alınmış chop. 3 oktav lower third ile sıkıştırılmış.",
  },
  {
    id: "s6", title: "Perc Bundle — Darbuka + Bendir", category: "percussive",
    durationSec: 0.38, sizeBytes: 180_000, fileType: "wav",
    tags: ["ethnic", "percussion", "darbuka", "bendir", "acoustic"],
    waveformColors: ["#f97316", "#10b981"],
    playCount: 77, favorite: false, createdAt: "2026-09-08",
    createdBy: { name: "Can Demir", role: "engineer" },
    collectionStatus: "cleared",
  },
  {
    id: "s7", title: "Kore Davul Seti (Stem Pack)", category: "drum_kit",
    bpm: 140, durationSec: 180, sizeBytes: 420_000_000, fileType: "wav",
    tags: ["drum", "kit", "acoustic", "stem"], waveformColors: ["#a855f7", "#06b6d4"],
    playCount: 318, favorite: false, createdAt: "2026-07-20",
    createdBy: { name: "Can Demir", role: "engineer" },
    samplePack: "Studio Sessions Vol.1",
    collectionStatus: "cleared",
  },
  {
    id: "s8", title: "Lead Synth Serum Preset Audio (Güneş)", category: "stem",
    bpm: 100, key: "Cmaj", durationSec: 4.2, sizeBytes: 1_200_000, fileType: "wav",
    tags: ["serum", "lead", "synth", "render"], waveformColors: ["#10b981", "#f97316"],
    playCount: 145, favorite: true, createdAt: "2026-09-10",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
    usedInBeats: [{ id: "2", title: "Güneş Doğarken", type: "for_sale" }],
    collectionStatus: "cleared",
  },
  {
    id: "s9", title: "Reverse Crash — Cinematic FX", category: "fx",
    durationSec: 3.1, sizeBytes: 2_100_000, fileType: "flac",
    tags: ["crash", "reverse", "cinematic", "transition"],
    waveformColors: ["#06b6d4", "#ec4899"],
    playCount: 299, favorite: false, createdAt: "2026-08-05",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
    collectionStatus: "cleared",
  },
  {
    id: "s10", title: "Neon Sokaklar Arp Loop", category: "loop",
    bpm: 132, key: "Dmin", durationSec: 7.8, sizeBytes: 3_300_000, fileType: "wav",
    tags: ["arp", "synth", "pluck", "16th"], waveformColors: ["#ec4899", "#a855f7"],
    playCount: 412, favorite: true, createdAt: "2026-09-12",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
    usedInBeats: [{ id: "6", title: "Neon Sokaklar", type: "demo" }],
    collectionStatus: "pending",
  },
  {
    id: "s11", title: "Clap Stack x5 — Stadium Reverb", category: "one_shot",
    bpm: 140, durationSec: 1.1, sizeBytes: 650_000, fileType: "wav",
    tags: ["clap", "stack", "stadium", "epic"], waveformColors: ["#f97316", "#a855f7"],
    playCount: 560, favorite: false, createdAt: "2026-09-14",
    createdBy: { name: "Can Demir", role: "engineer" },
    collectionStatus: "cleared",
  },
  {
    id: "s12", title: "Ad-Lib Paketi Zeynep (28 Dosya)", category: "vocal",
    durationSec: 24, sizeBytes: 18_400_000, fileType: "wav",
    tags: ["ad-lib", "vocal", "zeynep", "effects"], waveformColors: ["#ec4899", "#f97316"],
    playCount: 781, favorite: true, createdAt: "2026-09-02",
    createdBy: { name: "Zeynep Kara", role: "vocalist" },
    samplePack: "Zeynep Kara Vocal Pack",
    collectionStatus: "signed",
  },
];

const CATEGORIES = Object.entries(SAMPLE_CATEGORIES).map(([k, v]) => ({ key: k, value: v as SampleCategory }));

export default function SamplesPage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [playing, setPlaying] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<SampleItem | null>(SAMPLES[0]);
  const [bpmMin, setBpmMin] = React.useState(60);
  const [bpmMax, setBpmMax] = React.useState(180);

  const filtered = SAMPLES.filter((s) => {
    if (activeCategory !== "all" && s.category !== activeCategory) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) &&
      !s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
    if (s.bpm && (s.bpm < bpmMin || s.bpm > bpmMax)) return false;
    return true;
  });

  const categoryCounts = CATEGORIES.map(({ value: v }) => ({
    value: v,
    count: SAMPLES.filter(s => s.category === v).length,
  }));

  const totalSamples = SAMPLES.length;
  const totalSize = SAMPLES.reduce((acc, s) => acc + s.sizeBytes, 0);
  const totalDuration = SAMPLES.reduce((acc, s) => acc + s.durationSec, 0);
  const favCount = SAMPLES.filter(s => s.favorite).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning" className="!px-2 !text-[10px] tracking-wider">
              <Waves className="w-3 h-3 mr-1.5" />
              SAMPLE LIBRARY
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {totalSamples} sample · {formatDuration(totalDuration)} · {formatBytes(totalSize)}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Sample & Loop Kütüphanesi</h1>
          <p className="text-muted-foreground">Kendi kayıtlarınız, paketler ve tek kullanımlık sesler — hepsi arşivlenmiş</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <UploadCloud className="w-4 h-4 mr-1.5" />
            Paket İndir
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Yeni Sample Yükle
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Toplam Sample", value: totalSamples, sub: "Kategorilerde dağılmış", color: "from-primary to-secondary", icon: FileAudio },
          { label: "Favoriler", value: favCount, sub: "Koleksiyona eklenen", color: "from-neon-pink to-destructive", icon: Heart },
          { label: "Depolama", value: formatBytes(totalSize), sub: "~ 458 MB / 20 GB", color: "from-neon-cyan to-secondary", icon: Folder },
          { label: "Onaysız", value: SAMPLES.filter(s => s.collectionStatus !== "cleared").length, sub: "Sözleşme bekleniyor", color: "from-neon-orange to-neon-pink", icon: Sparkles },
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
                <div className="text-2xl font-bold tabular-nums mb-0.5">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.sub}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters + Category Grid */}
      <Card className="p-4">
        <CardContent className="p-0 space-y-4">
          <div className="grid md:grid-cols-6 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Sample ara — isim, etiket, paket..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue placeholder="Anahtar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Anahtarlar</SelectItem>
                {["Cmaj", "Amin", "Gmin", "F#min", "Dmin", "C#maj"].map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="md:col-span-2 flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">BPM:</span>
              <Input type="number" min={40} max={220} value={bpmMin} onChange={(e) => setBpmMin(Number(e.target.value))} className="h-7 text-xs font-mono" />
              <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <Input type="number" min={40} max={220} value={bpmMax} onChange={(e) => setBpmMax(Number(e.target.value))} className="h-7 text-xs font-mono" />
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5">
              <Button variant="ghost" size="iconSm" className="text-muted-foreground hover:text-foreground">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1 !text-[11px]">
                <Tag className="w-3 h-3 mr-1.5" />
                24 Etiket
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {[{ key: "all", label: "Tümü", count: totalSamples, icon: Folder, accent: "from-muted-foreground to-muted" },
              ...categoryCounts.map(({ value, count }) => {
                const Icon = CATEGORY_ICONS[value];
                return {
                  key: value,
                  label: SAMPLE_CATEGORY_LABELS[value],
                  count,
                  icon: Icon,
                  accent: CATEGORY_ACCENTS[value],
                };
              }),
            ].map((c) => {
              const Icon = c.icon;
              const active = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={cn(
                    "group flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center",
                    active
                      ? "bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/30 text-primary"
                      : "bg-white/[0.015] border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/[0.04] hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center transition-all group-hover:scale-110",
                    c.accent
                  )}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-[11px] font-semibold leading-tight">{c.label}</div>
                  <Badge variant="muted" className="!text-[8px] !px-1.5 tabular-nums">{c.count}</Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* SAMPLE GRID */}
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Tabs defaultValue="grid" className="w-auto">
                <TabsList className="!p-0.5">
                  <TabsTrigger value="grid" className="!text-[11px] !px-3 !py-1">Izgara</TabsTrigger>
                  <TabsTrigger value="list" className="!text-[11px] !px-3 !py-1">Liste</TabsTrigger>
                  <TabsTrigger value="packs" className="!text-[11px] !px-3 !py-1">Paketler</TabsTrigger>
                </TabsList>
              </Tabs>
              <Badge variant="muted" className="!text-[9px]">{filtered.length} sonuç</Badge>
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Son Eklenen</SelectItem>
                <SelectItem value="popular">En Çok Oynatılan</SelectItem>
                <SelectItem value="bpm_asc">BPM: Düşükten → Yükseğe</SelectItem>
                <SelectItem value="bpm_desc">BPM: Yüksekten → Düşüğe</SelectItem>
                <SelectItem value="name">İsme Göre (A→Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload CTA */}
          <div className="mb-4 rounded-xl border border-dashed border-white/10 p-6 text-center bg-white/[0.015] hover:bg-white/[0.03] transition-colors cursor-pointer group">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6 text-primary" />
            </div>
            <div className="text-sm font-semibold mb-0.5">Kütüphaneye Ekle</div>
            <div className="text-xs text-muted-foreground mb-3">
              WAV, MP3, AIFF, FLAC — tek seferde 100MB'a kadar paket yükleyin
            </div>
            <FileUpload
              mode="compact"
              accept="audio"
              multiple
            />
          </div>

          {/* Sample Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((s) => {
              const Icon = CATEGORY_ICONS[s.category];
              const isSel = selected?.id === s.id;
              const isPlaying = playing === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={cn(
                    "group relative rounded-xl border overflow-hidden cursor-pointer transition-all hover:shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.3)]",
                    isSel
                      ? "border-primary/40 bg-primary/[0.03]"
                      : "border-white/5 bg-card hover:border-primary/20"
                  )}
                >
                  {/* Accent top bar */}
                  <div className={cn("h-1 w-full bg-gradient-to-r", CATEGORY_ACCENTS[s.category])} />

                  {/* Waveform area */}
                  <div className="relative h-28 bg-gradient-to-br from-black/40 to-transparent overflow-hidden">
                    {/* Fake waveform SVG */}
                    <div className="absolute inset-0 flex items-center gap-[2px] px-3 py-6 opacity-80">
                      {Array.from({ length: 48 }, (_, i) => {
                        const h = 10 + ((Math.sin(s.id.charCodeAt(1) + i * 0.6) + 1) * 40 + (s.durationSec * i) % 30);
                        return (
                          <div
                            key={i}
                            className={cn(
                              "flex-1 rounded-full transition-all",
                              "bg-gradient-to-t",
                              CATEGORY_ACCENTS[s.category]
                            )}
                            style={{ height: `${Math.min(100, h)}%`, opacity: 0.5 + (i % 5) * 0.1 }}
                          />
                        );
                      })}
                    </div>

                    {/* Play overlay */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setPlaying(playing === s.id ? null : s.id); }}
                      className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 backdrop-blur-[2px] transition-all"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center shadow-2xl text-white transition-all",
                        isPlaying ? "scale-110 shadow-[0_0_30px_rgba(168,85,247,0.5)]" : "group-hover:scale-105",
                        CATEGORY_ACCENTS[s.category]
                      )}>
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </div>
                    </button>

                    {/* Top right badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                      <Badge variant="muted" className={cn("!text-[8px] !px-1.5 backdrop-blur", CLEAR_STYLE[s.collectionStatus])}>
                        {CLEAR_LABELS[s.collectionStatus]}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white hover:text-neon-pink transition-colors"
                      >
                        <Heart className={cn("w-3.5 h-3.5", s.favorite && "fill-current text-neon-pink")} />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white hover:text-foreground transition-colors"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Duration + BPM bottom */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <Badge variant="muted" className="!text-[9px] !px-1.5 backdrop-blur bg-black/40 border-white/10">
                        <Clock3 className="w-2 h-2 mr-1" />
                        {formatDuration(s.durationSec)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {s.bpm && (
                          <Badge variant="muted" className={cn("!text-[9px] !px-1.5 backdrop-blur bg-black/40 border-white/10", bpmColor(s.bpm))}>
                            ⚡ {s.bpm}
                          </Badge>
                        )}
                        {s.key && (
                          <Badge variant="muted" className="!text-[9px] !px-1.5 backdrop-blur bg-black/40 border-white/10">
                            🎼 {s.key}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold leading-snug line-clamp-2 flex-1 min-w-0">{s.title}</h4>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <div className={cn("w-4 h-4 rounded-md bg-gradient-to-br flex items-center justify-center", CATEGORY_ACCENTS[s.category])}>
                          <Icon className="w-2 h-2 text-white" />
                        </div>
                        <span>{SAMPLE_CATEGORY_LABELS[s.category]}</span>
                        <span>·</span>
                        <span>{formatBytes(s.sizeBytes)}</span>
                      </div>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {s.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {s.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="muted" className="!text-[8px] !px-1.5">#{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Waves className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <div className="font-semibold text-sm mb-1">Sonuç bulunamadı</div>
              <div className="text-xs text-muted-foreground">
                Filtreleri veya arama teriminizi değiştirerek tekrar deneyin.
              </div>
            </div>
          )}
        </Card>

        {/* SELECTED DETAIL */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            {selected ? (
              <>
                <div className={cn("h-1.5 w-full bg-gradient-to-r rounded-t-xl", CATEGORY_ACCENTS[selected.category])} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <Badge variant="muted" className={cn("!text-[9px] !px-1.5", CLEAR_STYLE[selected.collectionStatus])}>
                          {CLEAR_LABELS[selected.collectionStatus]}
                        </Badge>
                        <Badge variant="muted" className="!text-[9px] !px-1.5">
                          {SAMPLE_CATEGORY_LABELS[selected.category]}
                        </Badge>
                      </div>
                      <CardTitle className="text-base leading-snug">{selected.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {selected.createdBy.name} · {ROLE_LABELS[selected.createdBy.role]}
                      </CardDescription>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-5">
                  {/* Waveform big */}
                  <div className="h-28 rounded-xl bg-gradient-to-br from-black/30 via-white/[0.02] to-transparent border border-white/5 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center gap-[2px] px-4 py-8">
                      {Array.from({ length: 64 }, (_, i) => {
                        const h = 12 + ((Math.sin(i * 0.45 + selected.id.charCodeAt(1)) + 1) * 40 + (selected.durationSec * i) % 28);
                        return (
                          <div
                            key={i}
                            className={cn("flex-1 rounded-full bg-gradient-to-t", CATEGORY_ACCENTS[selected.category])}
                            style={{ height: `${Math.min(100, h)}%` }}
                          />
                        );
                      })}
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-105 transition-transform shadow-2xl">
                        {playing === selected.id ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        )}
                      </div>
                    </button>
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-mono text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
                      0:00 / {formatDuration(selected.durationSec)}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: Play, label: "Oynat", act: "primary" as const },
                      { icon: Heart, label: "Favori", act: "outline" as const },
                      { icon: Download, label: "İndir", act: "outline" as const },
                      { icon: Copy, label: "Kopyala", act: "outline" as const },
                    ].map((a, i) => (
                      <Button key={i} variant={a.act} size="sm" className="!text-[10px] flex-col !py-2 !h-auto gap-1">
                        <a.icon className="w-4 h-4" />
                        {a.label}
                      </Button>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                      Metadata
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Format</div>
                        <div className="text-xs font-mono font-semibold uppercase">{selected.fileType}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Boyut</div>
                        <div className="text-xs font-mono font-semibold">{formatBytes(selected.sizeBytes)}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Süre</div>
                        <div className="text-xs font-mono font-semibold">{formatDuration(selected.durationSec)}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Oynatma</div>
                        <div className="text-xs font-mono font-semibold">{selected.playCount.toLocaleString("tr-TR")}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">BPM</div>
                        <div className={cn("text-xs font-mono font-semibold", selected.bpm ? bpmColor(selected.bpm).replace("bg-", "text-").split(" ")[0].replace("/20", "") : "")}>
                          {selected.bpm ?? "—"}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Anahtar</div>
                        <div className="text-xs font-mono font-semibold">{selected.key ?? "—"}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 col-span-2">
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Eklenme</div>
                        <div className="text-xs">{formatDate(selected.createdAt)}</div>
                      </div>
                    </div>
                  </div>

                  {selected.samplePack && (
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/[0.08] to-secondary/[0.03] border border-primary/20">
                      <div className="text-[9px] uppercase tracking-wider text-primary font-semibold mb-1">Sample Paketi</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">{selected.samplePack}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {Math.round(SAMPLES.filter(x => x.samplePack === selected.samplePack).length * 3.2)} ses · {formatDate(selected.createdAt)}
                          </div>
                        </div>
                        <Badge variant="success" className="!text-[9px] !px-2">%{Math.round(Math.random() * 30 + 65)} tamam</Badge>
                      </div>
                    </div>
                  )}

                  {selected.description && (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                        Açıklama
                      </div>
                      <p className="text-[12px] leading-relaxed text-muted-foreground">{selected.description}</p>
                    </div>
                  )}

                  {selected.tags.length > 0 && (
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                        Etiketler
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="!text-[10px] !px-2">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.usedInBeats && selected.usedInBeats.length > 0 && (
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                        Kullanıldığı Beat'ler
                      </div>
                      <div className="space-y-2">
                        {selected.usedInBeats.map(b => (
                          <Link
                            key={b.id}
                            href={`/beats/${b.id}`}
                            className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-primary/[0.04] hover:border-primary/20 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center shrink-0">
                              <Disc3 className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold truncate">{b.title}</div>
                              <div className="text-[10px] text-muted-foreground">{BEAT_TYPE_LABELS[b.type]}</div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Avatar name={selected.createdBy.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{selected.createdBy.name}</div>
                      <Badge variant="muted" className={cn("!text-[8px] !px-1.5 mt-0.5", ROLE_COLORS[selected.createdBy.role])}>
                        {ROLE_LABELS[selected.createdBy.role]}
                      </Badge>
                    </div>
                    <Button variant="outline" size="xs" className="!text-[9px] !h-6 !px-2">
                      <Bookmark className="w-2.5 h-2.5 mr-1" />
                      Profil
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-10 text-center">
                <Waves className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <div className="font-semibold text-sm mb-1">Bir Sample Seçin</div>
                <div className="text-xs text-muted-foreground">
                  Ayrıntıları görmek için soldan bir sample tıklayın.
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
