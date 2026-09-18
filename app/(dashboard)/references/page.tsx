"use client";

import * as React from "react";
import {
  Music2,
  Search,
  Filter,
  PlayCircle,
  PauseCircle,
  Heart,
  BookmarkPlus,
  PlusCircle,
  Upload,
  Library,
  Star,
  Disc3,
  Headphones,
  Guitar,
  Clock3,
  Sparkles,
  Volume2,
  ListMusic,
  Hash,
  ExternalLink,
  Info,
  User2,
  Mic2,
  Waves,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
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
import { cn, formatDate, formatPrice, timeAgo } from "@/lib/utils";

type RefMood = "R&B" | "Pop" | "Trap" | "House";

interface ReferenceTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year: number;
  mood: RefMood;
  genre: string;
  bpm: number;
  key: string;
  duration: number; // sn
  engineerNote?: string;
  vocalRange?: string;
  language: string;
  tags: string[];
  waveforms: number[];
  imageAccent: string;
  rating: number;
  addedBy?: string;
  addedDate: string;
  spotify?: string;
  youtube?: string;
  platforms: { name: string; Icon?: any }[];
  Icon: any;
}

const MOOD_LABELS: Record<RefMood, { label: string; gradient: string; pill: string; Icon: any }> = {
  "R&B": { label: "R&B / Soul", gradient: "from-neon-purple via-primary to-neon-pink", pill: "bg-neon-purple/15 text-neon-purple border-neon-purple/25", Icon: Headphones },
  "Pop": { label: "Pop / Top 40", gradient: "from-neon-pink via-destructive to-neon-orange", pill: "bg-neon-pink/15 text-neon-pink border-neon-pink/25", Icon: Sparkles },
  "Trap": { label: "Trap / Hip-Hop", gradient: "from-neon-orange via-primary to-neon-cyan", pill: "bg-neon-orange/15 text-neon-orange border-neon-orange/25", Icon: Guitar },
  "House": { label: "House / Dance", gradient: "from-neon-cyan via-accent to-neon-green", pill: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/25", Icon: Waves },
};

const KEYS = ["All", "C", "Cm", "C#", "D", "Dm", "Eb", "E", "Em", "F", "F#", "G", "Gm", "A", "Am", "Bb", "B"];

// Fake waveform generator
function wf(seed: number, n = 60, base = 0.28, peak = 0.95, variance = 0.32) {
  const arr: number[] = [];
  let x = seed;
  for (let i = 0; i < n; i++) {
    x = (x * 9301 + 49297) % 233280;
    const r = x / 233280;
    const wave = Math.sin(i * 0.28 + seed) * 0.35 + 0.5 + (r - 0.5) * variance;
    const w = Math.max(base, Math.min(peak, wave));
    arr.push(+(w.toFixed(3)));
  }
  return arr;
}
function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

const TRACKS: ReferenceTrack[] = [
  {
    id: "r1", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", year: 2020,
    mood: "Pop", genre: "Synthwave Pop",
    bpm: 171, key: "F#m", duration: 200, language: "EN",
    engineerNote: "Otomotiv ve retro 80s synth ler; lead synth sidechain, kalın bass sub, 4/4 kick + snare 2&4. Reverb kısa (1.6s) + Chorus Micro.",
    vocalRange: "E3 — A4",
    tags: ["Retro", "Synth", "Sidechain", "Hit Chorus"],
    waveforms: wf(121), imageAccent: "from-neon-pink via-destructive to-neon-orange",
    rating: 5, addedBy: "Can Demir", addedDate: "2026-06-02",
    spotify: "https://open.spotify.com", youtube: "https://youtube.com",
    platforms: [{ name: "Spotify" }, { name: "Apple" }, { name: "YouTube" }],
    Icon: Disc3,
  },
  {
    id: "r2", title: "Snooze", artist: "SZA", album: "SOS", year: 2022,
    mood: "R&B", genre: "Contemporary R&B",
    bpm: 96, key: "Bb", duration: 203, language: "EN",
    engineerNote: "R&B mid; kalın analog low-end (sub 60-80Hz), Rhodes + pad katmanları, vocal delay 1/4 dotted, air band 10kHz +3dB.",
    vocalRange: "G3 — D6",
    tags: ["Vocal-Driven", "Lush", "Analog Low"],
    waveforms: wf(88), imageAccent: "from-neon-purple via-primary to-neon-pink",
    rating: 4, addedBy: "Zeynep Kaya", addedDate: "2026-07-15",
    platforms: [{ name: "Spotify" }, { name: "Apple" }, { name: "Tidal" }],
    Icon: Headphones,
  },
  {
    id: "r3", title: "Rich Flex", artist: "Drake & 21 Savage", album: "Her Loss", year: 2022,
    mood: "Trap", genre: "Trap",
    bpm: 152, key: "Cm", duration: 239, language: "EN",
    engineerNote: "Trap 808ler + glitch vocal chops; kick + 808 kayması 2-3 snare, stereo mid+side bass temiz, vocal doubles harmoniye zengin.",
    vocalRange: "C3 — B4",
    tags: ["808", "Bass Heavy", "Vocal Chop"],
    waveforms: wf(16), imageAccent: "from-neon-orange via-primary to-neon-cyan",
    rating: 4, addedBy: "Kaan Arslan", addedDate: "2026-05-10",
    platforms: [{ name: "Spotify" }, { name: "YouTube" }],
    Icon: Guitar,
  },
  {
    id: "r4", title: "Rush", artist: "Ayra Starr", album: "19 & Dangerous", year: 2022,
    mood: "Pop", genre: "Afro-Fusion Pop",
    bpm: 104, key: "G", duration: 190, language: "EN",
    engineerNote: "Afrobeat groove, 16th note güitrar arpeggio, perküsyon delay, vocal wide stereo doubles, snare room reverb.",
    tags: ["Afro", "Dance", "Summer"],
    waveforms: wf(234), imageAccent: "from-neon-orange via-neon-pink to-neon-purple",
    rating: 5, addedBy: "Mert Şahin", addedDate: "2026-08-02",
    platforms: [{ name: "Spotify" }, { name: "Apple" }],
    Icon: Sparkles,
  },
  {
    id: "r5", title: "Kill Bill", artist: "SZA", album: "SOS", year: 2022,
    mood: "R&B", genre: "Alt R&B",
    bpm: 137, key: "Fm", duration: 153, language: "EN",
    engineerNote: "Emotional mid, hazy pad atmosferi; low-mid maskesi temiz, vocal AutoTune hafif (±10), delay sends yumuşak.",
    vocalRange: "E3 — C6",
    tags: ["Emotional", "Hazy", "Alt R&B"],
    waveforms: wf(57), imageAccent: "from-primary via-neon-purple to-destructive",
    rating: 5, addedBy: "Zeynep Kaya", addedDate: "2026-07-22",
    platforms: [{ name: "Spotify" }, { name: "YouTube" }, { name: "Tidal" }],
    Icon: Headphones,
  },
  {
    id: "r6", title: "Miracle", artist: "Calvin Harris & Ellie Goulding", year: 2023,
    mood: "House", genre: "Progressive House",
    bpm: 133, key: "A", duration: 169, language: "EN",
    engineerNote: "Eurodance progressive; kick 909, super sidechain bass, supersaw pad, vocal reverb 4s big hall; droptaşıma kompakt.",
    tags: ["Drop", "Supersaw", "909", "Dance-Floor"],
    waveforms: wf(987), imageAccent: "from-neon-cyan via-accent to-neon-green",
    rating: 4, addedBy: "Ege Yıldız", addedDate: "2026-06-20",
    platforms: [{ name: "Spotify" }, { name: "Beatport" }],
    Icon: Waves,
  },
  {
    id: "r7", title: "FE!N", artist: "Travis Scott ft. Playboi Carti", album: "UTOPIA", year: 2023,
    mood: "Trap", genre: "Experimental Trap",
    bpm: 148, key: "Dm", duration: 191, language: "EN",
    engineerNote: "Industrial+Trap, bass distorted, bitcrush sampler; low-end 50Hz çok derin, stereo width %70.",
    tags: ["Experimental", "Distorted", "Industrial"],
    waveforms: wf(412), imageAccent: "from-neon-orange via-primary to-destructive",
    rating: 4, addedBy: "Kaan Arslan", addedDate: "2026-08-05",
    platforms: [{ name: "Spotify" }, { name: "Apple" }],
    Icon: Guitar,
  },
  {
    id: "r8", title: "Baddadan", artist: "Chase & Status, Bou", year: 2023,
    mood: "House", genre: "Drum & Bass",
    bpm: 174, key: "Em", duration: 210, language: "EN",
    engineerNote: "DnB Reece bass, AMEN break, vocal sample FX chain, high pass at 30Hz, master clipper.",
    tags: ["DnB", "Reece", "Amen", "UK"],
    waveforms: wf(69), imageAccent: "from-neon-cyan via-primary to-neon-purple",
    rating: 5, addedBy: "Ege Yıldız", addedDate: "2026-07-28",
    platforms: [{ name: "Spotify" }, { name: "Beatport" }, { name: "YouTube" }],
    Icon: Waves,
  },
  {
    id: "r9", title: "Deli", artist: "Ice Spice", year: 2023,
    mood: "Trap", genre: "NY Drill",
    bpm: 140, key: "G#m", duration: 135, language: "EN",
    engineerNote: "NY Drill 808 slide, spazmik snare roll, vocal grit + distortion, kick headroom.",
    tags: ["Drill", "NYC", "Slide"],
    waveforms: wf(420), imageAccent: "from-primary via-neon-pink to-neon-orange",
    rating: 3, addedBy: "Kaan Arslan", addedDate: "2026-08-15",
    platforms: [{ name: "Spotify" }],
    Icon: Guitar,
  },
  {
    id: "r10", title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", year: 2019,
    mood: "Pop", genre: "Pop-Rock",
    bpm: 113, key: "D", duration: 174, language: "EN",
    engineerNote: "Güitarlı pop, brass section, snare long decay (1.8s), tape saturation master, air 12kHz.",
    tags: ["Summer", "Brass", "Organic"],
    waveforms: wf(91), imageAccent: "from-neon-green via-neon-orange to-destructive",
    rating: 5, addedBy: "Zeynep Kaya", addedDate: "2026-06-18",
    platforms: [{ name: "Spotify" }, { name: "Apple" }, { name: "YouTube" }],
    Icon: Sparkles,
  },
  {
    id: "r11", title: "Sunflower", artist: "Post Malone & Swae Lee", year: 2018,
    mood: "R&B", genre: "Hip-Hop Soul",
    bpm: 90, key: "Am", duration: 158, language: "EN",
    engineerNote: "Lo-fi soul, 808 bounce, vocal harmonizer octaves, delay slapback, lo-fi tape hiss.",
    tags: ["Lo-Fi", "Bounce", "Vocal Harmony"],
    waveforms: wf(123), imageAccent: "from-neon-purple via-accent to-neon-green",
    rating: 4, addedBy: "Mert Şahin", addedDate: "2026-07-01",
    platforms: [{ name: "Spotify" }, { name: "YouTube" }],
    Icon: Headphones,
  },
  {
    id: "r12", title: "One Kiss", artist: "Calvin Harris & Dua Lipa", year: 2018,
    mood: "House", genre: "Pop House",
    bpm: 126, key: "Cm", duration: 219, language: "EN",
    engineerNote: "Piano House, 909 classic, piano bright (+2 at 5kHz), bass warm analog, chorus hook.",
    tags: ["Piano", "Summer", "Vocal Hook"],
    waveforms: wf(555), imageAccent: "from-neon-green via-neon-cyan to-primary",
    rating: 4, addedBy: "Ege Yıldız", addedDate: "2026-06-30",
    platforms: [{ name: "Spotify" }, { name: "Beatport" }],
    Icon: Waves,
  },
  {
    id: "r13", title: "Prada", artist: "Cassö, Raye, D-Block Europe", year: 2023,
    mood: "House", genre: "Tech House",
    bpm: 128, key: "Bb", duration: 142, language: "EN",
    engineerNote: "Tech House; bass subline, catchy vocal flip, reverb short, snare punchy.",
    tags: ["Tech", "Vocal Flip", "UK"],
    waveforms: wf(777), imageAccent: "from-neon-cyan via-secondary to-neon-purple",
    rating: 5, addedBy: "Ege Yıldız", addedDate: "2026-08-10",
    platforms: [{ name: "Spotify" }, { name: "Apple" }],
    Icon: Waves,
  },
  {
    id: "r14", title: "Calm Down", artist: "Rema & Selena Gomez", year: 2022,
    mood: "Pop", genre: "Afrobeats",
    bpm: 107, key: "F", duration: 239, language: "EN",
    engineerNote: "Afrobeats; 16th hi-hat, melodic kalimba, Latin percussion, wide pan guitars.",
    tags: ["Afrobeats", "Global", "Kalimba"],
    waveforms: wf(13), imageAccent: "from-neon-orange via-neon-green to-accent",
    rating: 5, addedBy: "Mert Şahin", addedDate: "2026-07-10",
    platforms: [{ name: "Spotify" }, { name: "Apple" }, { name: "YouTube" }],
    Icon: Sparkles,
  },
];

export default function ReferencesPage() {
  const [mood, setMood] = React.useState<RefMood | "all">("all");
  const [keyF, setKeyF] = React.useState<string>("All");
  const [bpmRange, setBpmRange] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [playing, setPlaying] = React.useState<string | null>(null);
  const [liked, setLiked] = React.useState<Set<string>>(new Set(["r1", "r5"]));
  const [saved, setSaved] = React.useState<Set<string>>(new Set(["r8", "r4"]));
  const [selectedId, setSelectedId] = React.useState<string>("r1");

  const filtered = TRACKS.filter(t => {
    if (mood !== "all" && t.mood !== mood) return false;
    if (keyF !== "All" && t.key !== keyF) return false;
    if (bpmRange !== "all") {
      const [lo, hi] = bpmRange.split("-").map(Number);
      if (t.bpm < lo || t.bpm > hi) return false;
    }
    if (search) {
      const s = search.toLowerCase();
      if (!t.title.toLowerCase().includes(s) && !t.artist.toLowerCase().includes(s) && !(t.album ?? "").toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const selected = TRACKS.find(t => t.id === selectedId) ?? TRACKS[0];
  const toggle = (set: Set<string>, setter: any, id: string) => {
    const n = new Set(set);
    n.has(id) ? n.delete(id) : n.add(id);
    setter(n);
  };

  const counts = {
    all: TRACKS.length,
    ...(Object.keys(MOOD_LABELS) as RefMood[]).reduce((a: any, k) => { a[k] = TRACKS.filter(t => t.mood === k).length; return a; }, {} as Record<RefMood, number>),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="info" className="!px-2 !text-[10px] tracking-wider">
              <Library className="w-3 h-3 mr-1.5" />
              REFERENCE LIBRARY
            </Badge>
            <Badge variant="muted" className="!text-[10px]">{TRACKS.length} parça · 4 mood</Badge>
            <Badge variant="success" className="!text-[10px]">{liked.size} beğeni · {saved.size} kaydedildi</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Referans Şarkılar</h1>
          <p className="text-muted-foreground">Proje ve prodüksiyon için referans parçalar — tarz, ses, tempo ve ses mühendisi notları</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1.5" />
            Yükle
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1.5" />
            Playlist Paylaş
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Yeni Referans
          </Button>
        </div>
      </div>

      {/* Mood Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setMood(v as any)}>
        <TabsList className="!p-1 w-full grid grid-cols-5">
          <TabsTrigger value="all" className="!text-[11px]">
            <ListMusic className="w-3 h-3 mr-1.5" />
            Tümü <Badge variant="muted" className="!text-[8px] !px-1 ml-1">{counts.all}</Badge>
          </TabsTrigger>
          {(Object.keys(MOOD_LABELS) as RefMood[]).map(m => {
            const md = MOOD_LABELS[m];
            const MI = md.Icon;
            return (
              <TabsTrigger key={m} value={m} className="!text-[11px]">
                <MI className="w-3 h-3 mr-1.5" />
                {md.label.split(" ")[0]}
                <Badge variant="muted" className="!text-[8px] !px-1 ml-1">{counts[m]}</Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card className="p-4">
        <CardContent className="p-0 grid md:grid-cols-6 gap-3">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Başlık, sanatçı, albüm ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={keyF} onValueChange={setKeyF}>
            <SelectTrigger><SelectValue placeholder="Ton (Key)" /></SelectTrigger>
            <SelectContent className="max-h-80">
              {KEYS.map(k => (<SelectItem key={k} value={k}>{k === "All" ? "Tüm Tonlar" : k}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={bpmRange} onValueChange={setBpmRange}>
            <SelectTrigger><SelectValue placeholder="BPM Aralığı" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm BPM</SelectItem>
              <SelectItem value="70-100">70 – 100 (Slow/R&B)</SelectItem>
              <SelectItem value="100-130">100 – 130 (Pop)</SelectItem>
              <SelectItem value="130-160">130 – 160 (Trap/House)</SelectItem>
              <SelectItem value="160-200">160+ (DnB/Dance)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="!text-xs">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Gelişmiş
          </Button>
        </CardContent>
      </Card>

      <div className="grid xl:grid-cols-3 gap-4">
        {/* Track list */}
        <div className="xl:col-span-2 space-y-2.5">
          {filtered.length === 0 && (
            <Card className="p-8 text-center">
              <CardContent className="p-0 space-y-3">
                <Info className="w-10 h-10 mx-auto text-muted-foreground" />
                <div className="font-bold">Eşleşen referans yok</div>
                <div className="text-sm text-muted-foreground">Filtreleri temizle veya yeni bir parça ekle.</div>
              </CardContent>
            </Card>
          )}
          {filtered.map(t => {
            const md = MOOD_LABELS[t.mood];
            const MI = md.Icon;
            const isPlay = playing === t.id;
            const Ic = t.Icon;
            const isSel = selectedId === t.id;
            return (
              <Card
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={cn("p-3 overflow-hidden cursor-pointer transition-all group relative",
                  isSel && "ring-1 ring-primary/60 border-primary/40 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)]"
                )}
              >
                {isSel && <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b", md.gradient)} />}
                <div className="flex gap-3 items-start">
                  {/* Accent + waveform */}
                  <div className={cn("relative shrink-0 w-44 h-28 rounded-xl overflow-hidden bg-gradient-to-br", t.imageAccent)}>
                    <div className="absolute inset-0 opacity-35 mix-blend-overlay" style={{
                      backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2), transparent 50%)"
                    }} />
                    <button
                      onClick={(e) => { e.stopPropagation(); setPlaying(isPlay ? null : t.id); }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center ring-1 ring-white/20 hover:scale-105 transition-transform">
                        {isPlay
                          ? <PauseCircle className="w-7 h-7 text-white" fill="white" stroke="black" strokeWidth={1} />
                          : <PlayCircle className="w-7 h-7 text-white" fill="white" stroke="black" strokeWidth={1} />
                        }
                      </div>
                    </button>
                    {/* Waveform bottom */}
                    <div className="absolute bottom-1.5 left-2 right-2 h-7">
                      <div className="flex items-end gap-[1.5px] h-full opacity-90">
                        {t.waveforms.slice(0, 40).map((w, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex-1 rounded-full transition-all",
                              isPlay ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.5)]" : "bg-white/80"
                            )}
                            style={{ height: `${w * 100}%`, animationDelay: `${i * 20}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Duration */}
                    <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                      <Badge variant="muted" className="!text-[8px] !bg-black/45 backdrop-blur-sm !border-white/10 text-white">
                        <Clock3 className="w-1.5 h-1.5 mr-0.5" />
                        {fmtDuration(t.duration)}
                      </Badge>
                      <Badge variant="muted" className={cn("!text-[8px] !px-1.5 !bg-black/45 backdrop-blur-sm !border-white/10", md.pill)}>
                        <MI className="w-1.5 h-1.5 mr-0.5" />
                        {t.mood}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold truncate">{t.title}</h3>
                          <Badge variant="outline" className="!text-[8px] !px-1.5">{t.year}</Badge>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={cn("w-2.5 h-2.5", i < t.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted/20 text-muted-foreground")} />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                          <User2 className="w-3 h-3" />
                          <span className="font-medium text-foreground/90">{t.artist}</span>
                          {t.album && <>
                            <span>·</span>
                            <Disc3 className="w-3 h-3" />
                            <span className="truncate">{t.album}</span>
                          </>}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggle(liked, setLiked, t.id); }}
                          className={cn("p-1.5 rounded-md transition-colors",
                            liked.has(t.id) ? "text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:text-destructive hover:bg-white/5"
                          )}
                        >
                          <Heart className={cn("w-3.5 h-3.5", liked.has(t.id) && "fill-current")} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggle(saved, setSaved, t.id); }}
                          className={cn("p-1.5 rounded-md transition-colors",
                            saved.has(t.id) ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-white/5"
                          )}
                        >
                          <BookmarkPlus className={cn("w-3.5 h-3.5", saved.has(t.id) && "fill-current")} />
                        </button>
                        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meta tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="muted" className="!text-[9px] !px-1.5">
                        <Hash className="w-1.5 h-1.5 mr-0.5" />
                        {t.bpm} BPM
                      </Badge>
                      <Badge variant="muted" className="!text-[9px] !px-1.5">
                        <Music2 className="w-1.5 h-1.5 mr-0.5" />
                        {t.key}
                      </Badge>
                      <Badge variant="muted" className="!text-[9px] !px-1.5">
                        <Mic2 className="w-1.5 h-1.5 mr-0.5" />
                        {t.language}
                      </Badge>
                      <Badge variant="muted" className="!text-[9px] !px-1.5">
                        <Star className="w-1.5 h-1.5 mr-0.5" />
                        {t.genre}
                      </Badge>
                      {t.vocalRange && (
                        <Badge variant="outline" className="!text-[8px] !px-1.5">
                          Vokal {t.vocalRange}
                        </Badge>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {t.tags.map(tg => (
                        <Badge key={tg} variant="outline" className="!text-[8px] !px-1.5 bg-primary/5 border-primary/15 text-primary">
                          {tg}
                        </Badge>
                      ))}
                    </div>

                    {/* Footnote */}
                    <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="w-4 h-4" />
                        <span>{t.addedBy}</span>
                        <span>·</span>
                        <span>{formatDate(t.addedDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {t.platforms.map(p => (
                          <Badge key={p.name} variant="muted" className="!text-[8px] !px-1.5">
                            {p.name}
                          </Badge>
                        ))}
                        <button className="text-primary hover:underline ml-1 inline-flex items-center gap-0.5">
                          Aç <ExternalLink className="w-2 h-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Selected detail panel */}
        <Card className="p-0 overflow-hidden sticky top-4 self-start h-fit xl:max-h-[calc(100vh-8rem)] xl:overflow-auto">
          <div className={cn("h-40 relative bg-gradient-to-br overflow-hidden", selected.imageAccent)}>
            <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{
              backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25), transparent 55%)"
            }} />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <Badge variant="muted" className={cn("!text-[8px] !px-1.5 !bg-black/40 backdrop-blur-sm !border-white/10", MOOD_LABELS[selected.mood].pill)}>
                <selected.Icon className="w-1.5 h-1.5 mr-0.5" />
                {selected.mood}
              </Badge>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={cn("w-3 h-3", i < selected.rating ? "fill-yellow-400 text-yellow-400" : "fill-black/30 text-white/50")} />
                ))}
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-3 text-white">
                <selected.Icon className="w-12 h-12 opacity-95 drop-shadow-lg" strokeWidth={1.1} />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider opacity-80 mb-0.5">{MOOD_LABELS[selected.mood].label}</div>
                  <div className="text-xl font-bold truncate">{selected.title}</div>
                  <div className="text-[12px] opacity-80 truncate">{selected.artist} {selected.album ? `· ${selected.album}` : ""}</div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-4 space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[9px] uppercase text-muted-foreground">BPM</div>
                <div className="text-base font-bold tabular-nums text-primary">{selected.bpm}</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[9px] uppercase text-muted-foreground">Key</div>
                <div className="text-base font-bold tabular-nums text-secondary">{selected.key}</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[9px] uppercase text-muted-foreground">Süre</div>
                <div className="text-base font-bold tabular-nums text-neon-cyan">{fmtDuration(selected.duration)}</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[9px] uppercase text-muted-foreground">Yıl</div>
                <div className="text-base font-bold tabular-nums text-neon-orange">{selected.year}</div>
              </div>
            </div>

            {/* Play back waveform */}
            <Card className="p-3 border-primary/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-1 ring-primary/30">
                    <PlayCircle className="w-5 h-5 text-white" fill="white" stroke="black" strokeWidth={1} />
                  </button>
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground">Ses Analizi</div>
                    <div className="text-xs font-bold">Waveform Önizle</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <Volume2 className="w-3 h-3 text-primary" />
                  <span className="tabular-nums">-2.3 LUFS</span>
                </div>
              </div>
              <div className="relative h-16 rounded-lg bg-black/20 p-2">
                <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 flex items-center gap-[2px] h-12">
                  {selected.waveforms.map((w, i) => {
                    const middle = Math.floor(selected.waveforms.length * 0.38);
                    const played = i <= middle;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 rounded-full",
                          played ? "bg-gradient-to-t from-primary to-neon-purple shadow-[0_0_4px_hsl(var(--primary)/0.6)]" : "bg-white/15"
                        )}
                        style={{ height: `${w * 100}%` }}
                      />
                    );
                  })}
                </div>
                <div className="absolute left-[38%] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>0:00</span>
                  <span>1:16</span>
                  <span>{fmtDuration(selected.duration)}</span>
                </div>
              </div>
            </Card>

            {/* Engineer Note */}
            {selected.engineerNote && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-primary" />
                    Ses Mühendisi Notu
                  </div>
                  <Badge variant="info" className="!text-[8px]">{selected.addedBy}</Badge>
                </div>
                <Card className="p-3 bg-primary/[0.03] border-primary/15">
                  <p className="text-[11.5px] leading-relaxed text-foreground/90">{selected.engineerNote}</p>
                </Card>
              </div>
            )}

            {/* Tags */}
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                Mood Tagleri
              </div>
              <div className="flex flex-wrap gap-1">
                {selected.tags.map(tg => (
                  <Badge key={tg} variant="muted" className="!text-[9px] !px-1.5 bg-secondary/10 text-secondary border-secondary/20">
                    #{tg}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3" />
                Platformlar
              </div>
              <div className="grid grid-cols-2 gap-2">
                {selected.platforms.map(p => (
                  <button key={p.name} className="flex items-center justify-between gap-2 p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/20 transition-all text-xs">
                    <span className="font-semibold">{p.name}</span>
                    <ExternalLink className="w-3 h-3 text-primary" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button variant="outline" size="sm">
                <Heart className="w-3 h-3 mr-1.5" /> Beğen
              </Button>
              <Button variant="outline" size="sm">
                <BookmarkPlus className="w-3 h-3 mr-1.5" /> Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
