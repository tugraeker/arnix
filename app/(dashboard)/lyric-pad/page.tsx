"use client";

import * as React from "react";
import Link from "next/link";
import {
  FilePen,
  PlusCircle,
  Save,
  Disc3,
  Users,
  Music2,
  Clock3,
  Target,
  Eye,
  Share2,
  Search,
  Filter,
  Sparkles,
  Download,
  Trash2,
  MoreHorizontal,
  Star,
  History,
  Mic2,
  Ruler,
  Palette,
  AlignLeft,
  ListOrdered,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn, formatDate, timeAgo } from "@/lib/utils";

interface LyricVersion {
  id: string;
  title: string;
  content: string;
  mood: "melankolik" | "neşeli" | "agresif" | "romantik" | "düşünceli";
  key: string;
  bpm: number;
  lang: "TR" | "EN" | "TR+EN";
  author: string;
  authorRole: "songwriter" | "vocalist" | "producer";
  updatedAt: string;
  stars: number;
  beat?: { id: string; title: string };
}

const INITIAL_LYRICS = `[Intro: Zeynep Kara]
Hmm...

[Verse 1]
Şehrin ışıkları sönsün de
Sessizlik sana fısıldasın
Kalbimdeki o eski şarkı
Bugün de sana hasret çekiyor

[Pre-Chorus]
Ne olur geri gel, geceler uzuyor
Her nefeste sesin duyuluyor

[Chorus]
Güneş doğarken gözlerini görmek istiyorum
Sonsuzluğa bir adım attık o gece
Her sözümüz bir yıldız olarak takıldı
Gökyüzünde parlıyorlar hâlâ

[Verse 2]
Fotoğraflarımıza baktım dün gece
İçimde bir yer acıyor hala
Seni geçmek demek — bilmem ki,
Belki de hiç istemiyorum aslında

[Bridge]
Eğer geri dönersen her şeyi unuturum
Yalvarırım son bir kez seni görmek isterim`;

const VERSIONS: LyricVersion[] = [
  {
    id: "v1", title: "Albüm — Güneş Doğarken (Ana Söz)",
    content: INITIAL_LYRICS,
    mood: "romantik", key: "Am", bpm: 92, lang: "TR",
    author: "Ayşe Şahin", authorRole: "songwriter",
    updatedAt: "2026-09-18T13:22:00", stars: 12,
    beat: { id: "2", title: "Güneş Doğarken" },
  },
  {
    id: "v2", title: "Güneş Doğarken — Hook Alternatif",
    content: INITIAL_LYRICS.replace("Güneş doğarken gözlerini görmek istiyorum", "Güneş batarken gözlerinden gözlüyorum"),
    mood: "düşünceli", key: "Am", bpm: 92, lang: "TR",
    author: "Zeynep Kara", authorRole: "vocalist",
    updatedAt: "2026-09-16T22:05:00", stars: 4,
    beat: { id: "2", title: "Güneş Doğarken" },
  },
  {
    id: "v3", title: "Derin Sular — Albüm Sözleri",
    content: "[Verse 1]\nDeniz kadar derin, okyanus kadar geniş\nSeni anmak gözyaşlarımı kurutmuyor hiç...\n\n[Chorus]\nSular derin, derin, derin kalbimizin ötesinde\nYüzdüm ben yıllarca, seni buldum mu sandım?",
    mood: "melankolik", key: "Cm", bpm: 85, lang: "TR",
    author: "Ayşe Şahin", authorRole: "songwriter",
    updatedAt: "2026-09-17T11:40:00", stars: 8,
    beat: { id: "4", title: "Derin Sular" },
  },
  {
    id: "v4", title: "Kozmik Dans — EN Hook",
    content: "[Hook - Deniz Kaya]\n\nOh — cosmic dance tonight\nUnder neon, you and I\nLose control, we touch the sky\nCosmic dance — you and I",
    mood: "neşeli", key: "Fm", bpm: 128, lang: "EN",
    author: "Deniz Kaya", authorRole: "vocalist",
    updatedAt: "2026-09-14T18:12:00", stars: 6,
    beat: { id: "5", title: "Kozmik Dans" },
  },
  {
    id: "v5", title: "Neon Nights — Verse Rap",
    content: "[Verse]\n\nİstanbul'u geziyorum gece yarısı\nSokaklar ışığı saçıyor takımı\nHerkes bir yerlere koşuyor kendi hikâyesine\nBen durdum, nefes aldım, etrafıma baktım\nZaman dondu, anı dondum\nKendimi burada buldum",
    mood: "agresif", key: "Gm", bpm: 140, lang: "TR",
    author: "Deniz Kaya", authorRole: "vocalist",
    updatedAt: "2026-09-12T04:18:00", stars: 3,
  },
  {
    id: "v6", title: "Midnight Vibes — Demo Söz",
    content: "[Intro — spoken] \"Son kez...\"\n\n[Verse]\nGece yarısı vaktinde uyanırım\nHayaller kurarım, hayata karışırım\nNefesimi tutarım, beklerim seni\nYıllar geçse de hep aynı yerdeyim",
    mood: "düşünceli", key: "Dm", bpm: 72, lang: "TR",
    author: "Ayşe Şahin", authorRole: "songwriter",
    updatedAt: "2026-08-28T09:31:00", stars: 2,
  },
];

const MOOD_STYLE: Record<LyricVersion["mood"], string> = {
  melankolik: "bg-neon-purple/15 text-neon-purple border-neon-purple/30",
  neşeli: "bg-neon-green/15 text-neon-green border-neon-green/30",
  agresif: "bg-destructive/15 text-destructive border-destructive/30",
  romantik: "bg-neon-pink/15 text-neon-pink border-neon-pink/30",
  düşünceli: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30",
};

export default function LyricPadPage() {
  const [active, setActive] = React.useState(VERSIONS[0].id);
  const [content, setContent] = React.useState(VERSIONS[0].content);
  const [search, setSearch] = React.useState("");

  const activeV = VERSIONS.find(v => v.id === active)!;
  React.useEffect(() => {
    setContent(activeV.content);
  }, [active]);

  const lines = content.split("\n").length;
  const words = content.split(/\s+/).filter(x => x).length;
  const chars = content.length;
  const syllableGuess = Math.round(words * 1.6);
  const durationGuess = Math.round(syllableGuess / 3); // ~3 hece/saniye

  const filtered = VERSIONS.filter(v => {
    if (search && !v.title.toLowerCase().includes(search.toLowerCase()) && !v.author.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Rhyme suggestions (demo)
  const LAST_WORDS = ["sönsün", "fısıldasın", "şarkı", "çekiyor", "uzuyor", "duyuluyor", "istiyorum", "gece", "parlıyorlar", "hâlâ", "gece", "acıyor", "unuturum", "isterim"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" className="!px-2 !text-[10px] tracking-wider">
              <FilePen className="w-3 h-3 mr-1.5" />
              LYRIC PAD
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {VERSIONS.length} söz · 3 beat bağlantılı
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Söz Yazma Panosu</h1>
          <p className="text-muted-foreground">Şarkı sözlerini yaz, sürümleri kaydet, beat'lere bağla, ekiple paylaş</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Dışa Aktar (.txt)
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1.5" />
            Paylaş
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Yeni Söz
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        {/* Left: Versions list */}
        <Card className="lg:col-span-3 p-4">
          <div className="mb-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Söz ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 !text-[11px]" />
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="flex-1 !text-[10px]"><Filter className="w-3 h-3 mr-1" />Filtre</Button>
              <Button variant="outline" size="sm" className="!text-[10px]"><Sparkles className="w-3 h-3" /></Button>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[720px] overflow-y-auto pr-1">
            {filtered.map(v => (
              <button
                key={v.id}
                onClick={() => setActive(v.id)}
                className={cn(
                  "w-full text-left p-2.5 rounded-xl border transition-all relative overflow-hidden",
                  active === v.id
                    ? "bg-primary/5 border-primary/30"
                    : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"
                )}
              >
                {active === v.id && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-primary via-neon-purple to-secondary" />
                )}
                <div className="pl-0.5 space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <div className="text-xs font-semibold truncate flex-1 min-w-0">{v.title}</div>
                    <button className="shrink-0 p-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge variant="muted" className={cn("!text-[8px] !px-1.5", MOOD_STYLE[v.mood])}>
                      {v.mood}
                    </Badge>
                    <Badge variant="outline" className="!text-[8px] !px-1.5">
                      {v.key} · {v.bpm}
                    </Badge>
                    <Badge variant="outline" className="!text-[8px] !px-1.5">{v.lang}</Badge>
                  </div>
                  {v.beat && (
                    <Link href={`/beats/${v.beat.id}`} className="text-[10px] text-primary inline-flex items-center gap-1 hover:underline underline-offset-2">
                      <Disc3 className="w-2.5 h-2.5" />
                      {v.beat.title}
                    </Link>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Avatar name={v.author} size="sm" />
                    <div className="text-[9px] text-muted-foreground truncate min-w-0 flex-1">{v.author}</div>
                    <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground shrink-0">
                      <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                      <span className="font-semibold">{v.stars}</span>
                    </div>
                  </div>
                  <div className="text-[9px] text-muted-foreground flex items-center gap-1">
                    <Clock3 className="w-2.5 h-2.5" />
                    {timeAgo(v.updatedAt)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Middle: Editor */}
        <Card className="lg:col-span-6 p-0 overflow-hidden">
          {/* Toolbar */}
          <div className="p-3 border-b border-white/5 flex items-center justify-between gap-2 flex-wrap bg-white/[0.01]">
            <div className="flex items-center gap-1">
              {[Bold, Italic, Underline, AlignLeft, ListOrdered, Palette, Ruler].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <History className="w-3.5 h-3.5" />
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Mic2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="success" className="!text-[9px] !px-1.5 flex items-center gap-0.5">
                <Save className="w-2 h-2 mr-0.5" />
                Otomatik kaydedildi
              </Badge>
              <Badge variant="muted" className="!text-[9px] !px-1.5">{timeAgo(activeV.updatedAt)}</Badge>
              <Button size="sm" variant="outline"><Eye className="w-2.5 h-2.5 mr-1" />Önizle</Button>
              <Button size="sm"><Save className="w-2.5 h-2.5 mr-1" />Kaydet</Button>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <Input value={activeV.title} className="!text-xl !font-bold !bg-transparent !border-none !p-0 !pl-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0" />
              <div className="flex items-center gap-1 flex-wrap">
                <Badge variant="muted" className={cn("!text-[9px] !px-1.5", MOOD_STYLE[activeV.mood])}>
                  <Palette className="w-2 h-2 mr-0.5" />
                  {activeV.mood}
                </Badge>
                <Badge variant="outline" className="!text-[9px] !px-1.5">{activeV.key} · {activeV.bpm} BPM</Badge>
                <Badge variant="outline" className="!text-[9px] !px-1.5">{activeV.lang}</Badge>
              </div>
            </div>

            {activeV.beat && (
              <Link href={`/beats/${activeV.beat.id}`} className="mb-3 flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/15 hover:bg-primary/10 transition-colors">
                <Disc3 className="w-4 h-4 text-primary shrink-0 animate-spin-slow" />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] uppercase tracking-wider text-primary font-semibold">Bağlı Beat</div>
                  <div className="text-sm font-semibold truncate">{activeV.beat.title}</div>
                </div>
                <Badge variant="info" className="!text-[9px] !px-1.5">Beat {activeV.bpm} BPM · {activeV.key}</Badge>
              </Link>
            )}

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              spellCheck={false}
              className="w-full min-h-[520px] resize-y bg-white/[0.02] border border-white/5 rounded-xl p-5 font-mono text-[13px] leading-relaxed tracking-wide focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
              placeholder="[Verse 1]&#10;Buraya yazmaya başla..."
            />
          </div>
        </Card>

        {/* Right: Stats + Rhymes */}
        <div className="lg:col-span-3 space-y-4">
          {/* Stats card */}
          <Card className="p-4">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Söz İstatistikleri
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: "Satır", val: lines, icon: ListOrdered },
                { label: "Kelime", val: words, icon: AlignLeft },
                { label: "Karakter", val: chars, icon: FilePen },
                { label: "Tah. Süre", val: `${durationGuess}s`, icon: Clock3 },
              ].map((s, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-1 mb-1">
                    <s.icon className="w-2.5 h-2.5 text-muted-foreground" />
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{s.val}</div>
                </div>
              ))}
            </div>
            <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/15 space-y-1">
              <div className="flex items-center gap-1.5">
                <Avatar name={activeV.author} size="sm" />
                <div className="text-[11px] font-semibold">{activeV.author}</div>
              </div>
              <div className="text-[10px] text-muted-foreground pl-8">
                Son düzenleme: {timeAgo(activeV.updatedAt)}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <Star className="w-4 h-4 fill-primary text-primary" />
                <Star className="w-4 h-4 fill-primary text-primary" />
                <Star className="w-4 h-4 fill-primary text-primary" />
                <Star className="w-4 h-4 fill-primary/20 text-primary/60" />
                <div className="text-xs font-bold ml-1">4.{activeV.stars % 5 || 5}</div>
              </div>
              <Badge variant="muted" className="!text-[9px]">{activeV.stars} yıldız</Badge>
            </div>
          </Card>

          {/* Rhyme suggestions */}
          <Card className="p-4">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Rhyme Asistanı
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Son hece önerileri</div>
            <div className="space-y-1.5 mb-4 max-h-60 overflow-y-auto pr-1">
              {LAST_WORDS.map((w, i) => {
                const rhymes = [
                  `${w} — ${["akmak", "almak", "yormak", "düşmek"][i % 4]}`,
                  `${w} — ${["sevmek", "varmak", "bulmak", "görmek"][(i + 1) % 4]}`,
                  `${w} — ${["bilmek", "söylemek", "hatırlamak", "özlemek"][(i + 2) % 4]}`,
                ];
                return (
                  <div key={w + i} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="text-[11px] font-bold font-mono mb-0.5 text-primary">{w}</div>
                    <div className="text-[10px] text-muted-foreground space-y-0.5">
                      {rhymes.map((r, j) => (
                        <div key={j} className="font-mono">{r}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" size="sm" className="w-full !text-[10px]">
              <Sparkles className="w-3 h-3 mr-1" />
              AI ile Alternatif Sözler Üret
            </Button>
          </Card>

          {/* Collaborators */}
          <Card className="p-4">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Ortak Yazarlar
            </div>
            <div className="space-y-2">
              {[
                { n: "Ayşe Şahin", r: "Söz Yazarı", p: true },
                { n: "Zeynep Kara", r: "Vokal", p: true },
                { n: "Mert Yılmaz", r: "Yapımcı", p: false },
              ].map((u, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="relative">
                    <Avatar name={u.n} size="md" />
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-[hsl(var(--card))]",
                      u.p ? "bg-neon-green" : "bg-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{u.n}</div>
                    <div className="text-[10px] text-muted-foreground">{u.r}</div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground p-1">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 !text-[10px]">
              <Users className="w-3 h-3 mr-1" />
              Kişi Davet Et
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
