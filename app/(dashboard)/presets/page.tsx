"use client";

import Link from "next/link";
import * as React from "react";
import {
  SlidersVertical,
  Search,
  PlusCircle,
  Download,
  UploadCloud,
  FolderUp,
  Filter,
  SortDesc,
  Sparkles,
  FileCog,
  Mic2,
  Disc3,
  Volume2,
  Tag,
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
import { FileUpload } from "@/components/shared/file-upload";
import {
  PRESET_CATEGORIES,
  PRESET_CATEGORY_LABELS,
  type PresetCategory,
  ROLE_COLORS,
  ROLE_LABELS,
  type AppRole,
} from "@/lib/constants";
import { cn, formatBytes, timeAgo } from "@/lib/utils";
import { useSupabaseQuery, type QueryFilter } from "@/lib/hooks/use-supabase-query";
import { useProfile } from "@/lib/hooks/use-profile";
import { useDebounced } from "@/lib/hooks/use-debounce";

const PRESETS: {
  id: string;
  name: string;
  pluginName: string;
  category: PresetCategory;
  type: string;
  tags: string[];
  description: string;
  fileName: string;
  fileSize: number;
  uploader: string;
  uploaderRole: AppRole;
  downloads: number;
  uploadedAt: string;
}[] = [
  {
    id: "1",
    name: "Vokal Chain - Pop & R&B",
    pluginName: "Ableton Effects Rack",
    category: "mic_chain",
    type: "Vokal",
    tags: ["pop", "rnb", "vocal", "chain"],
    description: "Neumann U87 + 1176 + FabFilter Pro-Q 3 + LA-2A setup. Hemen hemen tüm vokal türleri için.",
    fileName: "VocalChain-PopRnB.adg",
    fileSize: 1240000,
    uploader: "Can Demir",
    uploaderRole: "engineer",
    downloads: 38,
    uploadedAt: "2026-09-16T11:00:00Z",
  },
  {
    id: "2",
    name: "Serum - Trap Pluck Pack",
    pluginName: "Serum",
    category: "vst_preset",
    type: "Pluck",
    tags: ["trap", "serum", "pluck", "uk"],
    description: "12 adet pluck preset - UK Drill'den pop trap'e geniş spektrum.",
    fileName: "Serum-TrapPlucks-Pack.fxp",
    fileSize: 4800000,
    uploader: "Mert Yılmaz",
    uploaderRole: "producer",
    downloads: 124,
    uploadedAt: "2026-09-12T15:30:00Z",
  },
  {
    id: "3",
    name: "Master Bus Template",
    pluginName: "Ableton Live",
    category: "mastering_chain",
    type: "Master",
    tags: ["mastering", "template", "bus", "final"],
    description: "Ozone 11 + FabFilter Pro-L 2 + Analog Heat simülasyonu. Stream-ready (-14 LUFS).",
    fileName: "Mastering-Bus-Template-v3.als",
    fileSize: 88900000,
    uploader: "Can Demir",
    uploaderRole: "engineer",
    downloads: 72,
    uploadedAt: "2026-09-09T19:12:00Z",
  },
  {
    id: "4",
    name: "Mix Şablonu - Drill",
    pluginName: "Logic Pro",
    category: "mix_template",
    type: "Mix",
    tags: ["drill", "logic", "mix", "template"],
    description: "Kick + 808 bus, vocal bus, reverb/send fx kanalları dahil.",
    fileName: "Drill-MixTemplate-LogicX.logicx.zip",
    fileSize: 215000000,
    uploader: "Mert Yılmaz",
    uploaderRole: "producer",
    downloads: 21,
    uploadedAt: "2026-09-05T08:45:00Z",
  },
  {
    id: "5",
    name: "808 Bass - Kontakt Patch",
    pluginName: "Kontakt 7",
    category: "vst_preset",
    type: "Bass",
    tags: ["bass", "808", "kontakt", "trap"],
    description: "Kendimize özel kayıt 808 sampler. 30 farklı ton, slide ve pitch modu dahil.",
    fileName: "Arnix-808s-Kontakt.nki",
    fileSize: 152000000,
    uploader: "Ali Şahin",
    uploaderRole: "songwriter",
    downloads: 56,
    uploadedAt: "2026-08-28T14:20:00Z",
  },
  {
    id: "6",
    name: "Rap Vocal - Compact",
    pluginName: "FabFilter + Waves",
    category: "mic_chain",
    type: "Rap Vokal",
    tags: ["rap", "vocal", "compact", "quick"],
    description: "Hızlı rap kayıtları için. 5 plugin, düşük CPU kullanımı. AT2020+ için optimize.",
    fileName: "RapVocal-Compact-Preset.agr",
    fileSize: 650000,
    uploader: "Zeynep Kara",
    uploaderRole: "vocalist",
    downloads: 18,
    uploadedAt: "2026-08-20T22:00:00Z",
  },
];

const PRESET_ICON: Record<PresetCategory, any> = {
  vst_preset: SlidersVertical,
  mic_chain: Mic2,
  mix_template: Disc3,
  mastering_chain: Volume2,
};

const PRESET_COLOR: Record<PresetCategory, string> = {
  vst_preset: "from-primary to-secondary",
  mic_chain: "from-neon-cyan to-neon-green",
  mix_template: "from-neon-pink to-primary",
  mastering_chain: "from-neon-orange to-neon-purple",
};

type Preset = (typeof PRESETS)[number];

function PresetCard({ p }: { p: Preset }) {
  return (
    <Card key={p.id} className="p-5 hover:border-primary/30 transition-all group relative overflow-hidden">
      <div className={cn(
        "absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br opacity-20 blur-2xl",
        PRESET_COLOR[p.category]
      )} />
      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className={cn(
            "p-3 rounded-xl text-white bg-gradient-to-br shadow-lg shrink-0",
            PRESET_COLOR[p.category]
          )}>
            {(() => {
              const Icon = PRESET_ICON[p.category];
              return <Icon className="w-5 h-5" />;
            })()}
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="muted" className="!text-[10px] !px-2">
              {PRESET_CATEGORY_LABELS[p.category]}
            </Badge>
            <Link href="#" className="p-1.5 rounded-lg bg-white/[0.03] text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="İndir">
              <Download className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-bold text-base truncate pr-4 mb-1">{p.name}</div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="muted" className="!text-[10px] !px-1.5 bg-primary/10 text-primary border-primary/20">
              <FileCog className="w-2.5 h-2.5 mr-1" />
              {p.pluginName}
            </Badge>
            <Badge variant="outline" className="!text-[10px] !px-1.5">
              {p.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
            {p.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {p.tags.map((t) => (
              <Badge key={t} variant="muted" className="!text-[9px] !px-1.5">
                <Tag className="w-2 h-2 mr-1 opacity-60" />
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Avatar name={p.uploader} size="sm" />
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">{p.uploader}</div>
              <div className="flex items-center gap-1">
                <Badge variant="muted" className={cn("!text-[8px] !px-1", ROLE_COLORS[p.uploaderRole])}>
                  {ROLE_LABELS[p.uploaderRole]}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{timeAgo(p.uploadedAt)}</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-muted-foreground">İndirme</div>
            <div className="text-xs font-semibold text-primary inline-flex items-center gap-1">
              {p.downloads} <Download className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
        <div className="pt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          <FolderUp className="w-3 h-3" />
          <span className="font-mono truncate">{p.fileName}</span>
          <span className="ml-auto shrink-0">{formatBytes(p.fileSize)}</span>
        </div>
      </div>
    </Card>
  );
}

export default function PresetsPage() {
  const { initialized, profile } = useProfile();
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounced(search, 300);

  const filters: QueryFilter[] = React.useMemo(() => {
    const out: QueryFilter[] = [];
    if (debouncedSearch) out.push({ field: "name", op: "ilike", value: debouncedSearch });
    return out;
  }, [debouncedSearch]);

  const {
    data: presets,
    loading,
    count,
  } = useSupabaseQuery<Preset>("presets", {
    filters,
    order: { field: "uploadedAt", ascending: false },
    fallback: PRESETS,
    enabled: initialized || typeof window === "undefined",
  });

  const filtered = React.useMemo(() => {
    if (!presets) return [];
    return presets.filter((p) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const haystack = [p.name, p.pluginName, p.type, ...(p.tags || [])]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [presets, debouncedSearch]);

  const categoryCount = React.useCallback(
    (c: PresetCategory) => filtered.filter((p) => p.category === c).length,
    [filtered]
  );
  const totalSize = React.useMemo(
    () => filtered.reduce((a, b) => a + b.fileSize, 0),
    [filtered]
  );
  const mine = React.useMemo(
    () =>
      profile?.full_name
        ? filtered.filter((p) => p.uploader === profile.full_name)
        : [],
    [filtered, profile]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="!px-2 !text-[10px] tracking-wider">
              <Sparkles className="w-3 h-3 mr-1.5" />
              PRESET LIBRARY
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {count ?? filtered.length} preset · Toplam {formatBytes(totalSize)}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Preset Deposu</h1>
          <p className="text-muted-foreground">
            Plug-in presetleri, mikrofon zincirleri, mix şablonları ve mastering ayarları · Yükle, paylaş, indir
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1.5" />
            Filtrele
          </Button>
          <Button variant="outline" size="sm">
            <SortDesc className="w-4 h-4 mr-1.5" />
            Sırala
          </Button>
          <Button variant="outline" size="sm">
            <FolderUp className="w-4 h-4 mr-1.5" />
            Toplu Yükle
          </Button>
        </div>
      </div>

      {/* Upload + Tabs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-primary" />
            Yeni Preset Yükle
          </CardTitle>
          <CardDescription>
            .fxp, .nki, .als, .logicx, .adg, .ptx ve daha fazlası · Toplu olarak ZIP ile de yükleyebilirsin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            accept={["preset", "archive"]}
            maxFiles={20}
            maxSizeMB={1000}
            label="Preset dosyalarını sürükle veya seç"
            description="Tek preset veya toplu ZIP. Hemen takımınla paylaşılır."
          />
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(PRESET_CATEGORY_LABELS) as PresetCategory[]).map((c) => {
              const Icon = PRESET_ICON[c];
              const n = categoryCount(c);
              return (
                <div key={c} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      "p-2.5 rounded-xl text-white bg-gradient-to-br shadow-lg",
                      PRESET_COLOR[c]
                    )}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <Badge variant="muted" className="!text-[10px]">
                      {n} adet
                    </Badge>
                  </div>
                  <div className="font-semibold">{PRESET_CATEGORY_LABELS[c]}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {c === "vst_preset" && "Serum, Kontakt, FabFilter..."}
                    {c === "mic_chain" && "Kayıt zinciri presetleri"}
                    {c === "mix_template" && "Proje template'leri"}
                    {c === "mastering_chain" && "Master bus presetleri"}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Preset ara - isim, plug-in, etiket..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1" />
      </div>

      {/* Presets List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tümü ({count ?? filtered.length})</TabsTrigger>
          {(Object.keys(PRESET_CATEGORY_LABELS) as PresetCategory[]).map((c) => (
            <TabsTrigger key={c} value={c}>
              {PRESET_CATEGORY_LABELS[c]} ({categoryCount(c)})
            </TabsTrigger>
          ))}
          <TabsTrigger value="mine">Benim Yüklediklerim ({mine.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-5 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-white/5" />
                    <div className="h-5 w-2/3 rounded bg-white/5" />
                    <div className="h-3 w-1/2 rounded bg-white/5" />
                    <div className="h-16 w-full rounded bg-white/5" />
                  </div>
                </Card>
              ))}
            {!loading && filtered.length === 0 && (
              <Card className="p-10 col-span-full text-center">
                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <div className="font-semibold">Eşleşen preset bulunamadı</div>
                <div className="text-sm text-muted-foreground mt-1">Filtreleri değiştirmeyi veya yeni preset yüklemeyi dene.</div>
              </Card>
            )}
            {!loading && filtered.map((p) => (
              <PresetCard key={p.id} p={p} />
            ))}
          </div>
        </TabsContent>

        {(Object.keys(PRESET_CATEGORY_LABELS) as PresetCategory[]).map((c) => (
          <TabsContent key={c} value={c}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {loading &&
                Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i} className="p-5 animate-pulse">
                    <div className="h-36 bg-white/5 rounded" />
                  </Card>
                ))}
              {!loading &&
                (() => {
                  const list = filtered.filter((p) => p.category === c);
                  if (list.length === 0) {
                    return (
                      <Card className="p-10 col-span-full text-center">
                        <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br opacity-25 flex items-center justify-center text-white"
                          style={{
                            backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                          }}>
                          {React.createElement(PRESET_ICON[c], { className: "w-6 h-6" })}
                        </div>
                        <div className="font-semibold">
                          {PRESET_CATEGORY_LABELS[c]} kategorisinde henüz preset yok
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          İlk presetini yüklemeyi dene.
                        </div>
                      </Card>
                    );
                  }
                  return list.map((p) => <PresetCard key={p.id} p={p} />);
                })()}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="mine">
          {mine.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015]">
              <PlusCircle className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <div className="font-medium text-foreground/80 mb-1">
                {profile?.full_name
                  ? `${profile.full_name}, henüz bir preset yüklemedin`
                  : "Yüklediğin presetler burada listelenecek"}
              </div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Hemen yukarıdaki alandan ilk presetini yükle, takımın faydalanmaya başlasın.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mine.map((p) => (
                <PresetCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
