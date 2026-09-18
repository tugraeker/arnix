"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileSignature,
  PlusCircle,
  Users,
  Music2,
  Copyright,
  Percent,
  UserPlus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Disc3,
  Download,
  Share2,
  TrendingUp,
  Calculator,
  Scale,
  FileCheck2,
  Landmark,
  Mail,
  MoreHorizontal,
  ChevronDown,
  Search,
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
import { type AppRole, type BeatType, BEAT_TYPE_LABELS, ROLE_COLORS, ROLE_LABELS } from "@/lib/constants";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { useSupabaseQuery } from "@/lib/hooks/use-supabase-query";

type RightType = "master" | "mechanical" | "performance" | "sync" | "print";

const RIGHT_LABELS: Record<RightType, string> = {
  master: "Master (Recording)",
  mechanical: "Mekanik",
  performance: "Performans",
  sync: "Senkronizasyon",
  print: "Baskı",
};

const RIGHT_COLORS: Record<RightType, string> = {
  master: "from-primary to-neon-purple",
  mechanical: "from-neon-cyan to-secondary",
  performance: "from-neon-green to-accent",
  sync: "from-neon-orange to-neon-pink",
  print: "from-muted to-muted-foreground",
};

interface Member {
  id: string;
  name: string;
  role: AppRole;
  proName?: string;
  ipi?: string;
  isSigned?: boolean;
  signedAt?: string;
}

interface Contributor {
  memberId: string;
  share: Record<RightType, number>;
  note?: string;
}

interface SplitSheet {
  id: string;
  beat: { id: string; title: string; type: BeatType; bpm: number; key: string };
  title: string;
  version: string;
  status: "draft" | "sent" | "signed" | "disputed";
  createdAt: string;
  updatedAt: string;
  members: Member[];
  contributors: Contributor[];
  notes?: string;
}

const MEMBERS: Member[] = [
  { id: "m1", name: "Mert Yılmaz", role: "producer", proName: "MESAM", ipi: "00445892311", isSigned: true, signedAt: "2026-09-15" },
  { id: "m2", name: "Zeynep Kara", role: "vocalist", proName: "MÜYORBİR", ipi: "00338765492", isSigned: true, signedAt: "2026-09-16" },
  { id: "m3", name: "Ali Şahin", role: "songwriter", proName: "MESAM", ipi: "00119283746", isSigned: false },
  { id: "m4", name: "Can Demir", role: "engineer", proName: "MÜYORBİR", ipi: "00774819203", isSigned: true, signedAt: "2026-09-14" },
  { id: "m5", name: "Selin Öztürk", role: "admin", proName: "MSG", ipi: "00226738491", isSigned: false },
];

const SPLIT_SHEETS: SplitSheet[] = [
  {
    id: "s1",
    beat: { id: "4", title: "Derin Sular", type: "completed", bpm: 92, key: "Amin" },
    title: "Derin Sular — Official Release Split",
    version: "v1.2",
    status: "sent",
    createdAt: "2026-09-10",
    updatedAt: "2026-09-17",
    members: MEMBERS.slice(0, 4),
    contributors: [
      { memberId: "m1", share: { master: 40, mechanical: 25, performance: 25, sync: 30, print: 25 }, note: "Ana yapımcı & besteci" },
      { memberId: "m2", share: { master: 25, mechanical: 30, performance: 40, sync: 25, print: 30 }, note: "Vokal & melodik yazarlık" },
      { memberId: "m3", share: { master: 10, mechanical: 30, performance: 25, sync: 25, print: 30 }, note: "Söz yazarı" },
      { memberId: "m4", share: { master: 25, mechanical: 15, performance: 10, sync: 20, print: 15 }, note: "Mix & mastering katkısı" },
    ],
    notes: "Spotify ve iTunes üzerinden dijital yayın. DMC ve YouTube Content ID aktif.",
  },
  {
    id: "s2",
    beat: { id: "1", title: "Midnight Vibes", type: "mix_pending", bpm: 140, key: "Gmin" },
    title: "Midnight Vibes — Teaser Split",
    version: "v0.3",
    status: "draft",
    createdAt: "2026-09-15",
    updatedAt: "2026-09-18",
    members: MEMBERS.slice(0, 3),
    contributors: [
      { memberId: "m1", share: { master: 55, mechanical: 40, performance: 35, sync: 40, print: 40 } },
      { memberId: "m2", share: { master: 25, mechanical: 35, performance: 45, sync: 35, print: 35 } },
      { memberId: "m3", share: { master: 20, mechanical: 25, performance: 20, sync: 25, print: 25 } },
    ],
  },
  {
    id: "s3",
    beat: { id: "2", title: "Güneş Doğarken", type: "for_sale", bpm: 100, key: "Cmaj" },
    title: "Güneş Doğarken — Lisanslı Split",
    version: "v2.0",
    status: "signed",
    createdAt: "2026-08-20",
    updatedAt: "2026-09-05",
    members: MEMBERS.slice(0, 2).concat([MEMBERS[4]]),
    contributors: [
      { memberId: "m1", share: { master: 45, mechanical: 30, performance: 30, sync: 35, print: 30 } },
      { memberId: "m2", share: { master: 30, mechanical: 35, performance: 45, sync: 35, print: 35 } },
      { memberId: "m5", share: { master: 25, mechanical: 35, performance: 25, sync: 30, print: 35 } },
    ],
    notes: "Yapımcı ve Sanatçı arasında çift taraflı anlaşma. Yayıncı %25 komisyon.",
  },
  {
    id: "s4",
    beat: { id: "5", title: "Kozmik Dans", type: "available", bpm: 128, key: "F#min" },
    title: "Kozmik Dans — House Remix",
    version: "v0.8",
    status: "disputed",
    createdAt: "2026-09-01",
    updatedAt: "2026-09-12",
    members: MEMBERS.slice(0, 4),
    contributors: [
      { memberId: "m1", share: { master: 35, mechanical: 25, performance: 25, sync: 30, print: 25 } },
      { memberId: "m2", share: { master: 30, mechanical: 25, performance: 40, sync: 25, print: 25 } },
      { memberId: "m3", share: { master: 15, mechanical: 25, performance: 20, sync: 25, print: 25 } },
      { memberId: "m4", share: { master: 20, mechanical: 25, performance: 15, sync: 20, print: 25 } },
    ],
    notes: "Remix katkısı tartışılıyor — Ali Şahin söz katkısı %30 talep ediyor.",
  },
];

const STATUS_STYLE: Record<SplitSheet["status"], string> = {
  draft: "bg-muted text-muted-foreground border-white/5",
  sent: "bg-primary/20 text-primary border-primary/30",
  signed: "bg-neon-green/20 text-neon-green border-neon-green/30",
  disputed: "bg-destructive/20 text-destructive border-destructive/30",
};

const STATUS_LABELS: Record<SplitSheet["status"], string> = {
  draft: "Taslak",
  sent: "İmzalanıyor",
  signed: "Tamamlandı",
  disputed: "Tartışmalı",
};

const RIGHTS: RightType[] = ["master", "mechanical", "performance", "sync", "print"];

export default function SplitSheetsPage() {
  const { data: splitSheets, loading } = useSupabaseQuery<SplitSheet>("split_splits", {
    select: "*",
    fallback: SPLIT_SHEETS,
    enabled: typeof window !== "undefined",
  });
  const [simRevenue, setSimRevenue] = React.useState<number>(10000);
  const activeSheet = splitSheets?.[0] ?? SPLIT_SHEETS[0];
  const signed = activeSheet?.contributors?.filter(c => MEMBERS.find(m => m.id === c.memberId)?.isSigned).length ?? 
    SPLIT_SHEETS[0]?.contributors?.filter(c => MEMBERS.find(m => m.id === c.memberId)?.isSigned).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning" className="!px-2 !text-[10px] tracking-wider">
              <FileSignature className="w-3 h-3 mr-1.5" />
              ROYALTY SPLITS
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {SPLIT_SHEETS.length} sheet · {SPLIT_SHEETS.filter(s => s.status === "signed").length} imzalı
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Telif Payları & Split Sheets</h1>
          <p className="text-muted-foreground">Master, mekanik, performans, senkronizasyon ve baskı haklarını şeffafca paylaş</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Landmark className="w-4 h-4 mr-1.5" />
            MESAM Entegrasyonu
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Yeni Split Sheet
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Aktif Sheet", value: splitSheets?.length ?? SPLIT_SHEETS.length, sub: "Bu ay 3 yeni", color: "from-primary to-secondary", icon: FileSignature },
          { label: "İmzalanan", value: (splitSheets?.filter(s => s.status === "signed")?.length ?? SPLIT_SHEETS.filter(s => s.status === "signed").length).toString().padStart(1, "0") + "/" + (splitSheets?.length ?? SPLIT_SHEETS.length).toString().padStart(1, "0"), sub: `Ort. ${Math.round(100 * (splitSheets?.filter(s => s.status === "signed")?.length ?? SPLIT_SHEETS.filter(s => s.status === "signed").length) / (splitSheets?.length ?? SPLIT_SHEETS.length))}% tamam`, color: "from-neon-green to-accent", icon: CheckCircle2 },
          { label: "Bekleyen İmza", value: MEMBERS.filter(m => !m.isSigned).length, sub: `${signed}/${activeSheet?.contributors?.length ?? SPLIT_SHEETS[0]?.contributors?.length ?? 0} Derin Sular`, color: "from-neon-orange to-neon-pink", icon: Clock },
          { label: "Tahmini Yıllık Gelir", value: "₺1.2M", sub: "12 parça · Dijital yayın", color: "from-neon-cyan to-secondary", icon: TrendingUp },
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
                <div className="text-3xl font-bold tabular-nums mb-0.5">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.sub}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="sheet" className="w-full">
        <TabsList>
          <TabsTrigger value="sheet">
            <FileSignature className="w-3.5 h-3.5 mr-1.5" />
            Split Sheet Detayı
          </TabsTrigger>
          <TabsTrigger value="calculator">
            <Calculator className="w-3.5 h-3.5 mr-1.5" />
            Gelir Simülatörü
          </TabsTrigger>
          <TabsTrigger value="list">
            <Scale className="w-3.5 h-3.5 mr-1.5" />
            Tüm Sheet'ler
          </TabsTrigger>
        </TabsList>

        {/* SPLIT DETAIL */}
        <TabsContent value="sheet">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Sheet Info */}
            <Card className="lg:col-span-1 space-y-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Disc3 className="w-4 h-4 text-primary" />
                  {activeSheet.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  Oluşturuldu: {formatDate(activeSheet.createdAt)} · Güncellendi: {formatDate(activeSheet.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <Link href={`/beats/${activeSheet.beat.id}`} className="block p-4 rounded-xl bg-gradient-to-br from-primary/[0.08] to-secondary/[0.05] border border-primary/20 hover:from-primary/[0.12] transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">{activeSheet.beat.title}</div>
                      <div className="text-[11px] text-muted-foreground">{activeSheet.beat.bpm} BPM · {activeSheet.beat.key}</div>
                    </div>
                    <Badge variant="muted" className="!text-[9px]">{BEAT_TYPE_LABELS[activeSheet.beat.type]}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="muted" className={cn("!text-[9px] !px-1.5", STATUS_STYLE[activeSheet.status])}>
                      {STATUS_LABELS[activeSheet.status]}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">{activeSheet.version}</span>
                  </div>
                </Link>

                {/* Members signatures */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      İmza Durumu
                    </div>
                    <Badge variant="muted" className="!text-[9px]">
                      {signed}/{activeSheet.contributors.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {activeSheet.contributors.map((c) => {
                      const m = MEMBERS.find(x => x.id === c.memberId)!;
                      return (
                        <div key={c.memberId} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar name={m.name} size="sm" />
                            <div className="min-w-0">
                              <div className="text-xs font-medium truncate">{m.name}</div>
                              <Badge variant="muted" className={cn("!text-[8px] !px-1 mt-0.5", ROLE_COLORS[m.role])}>
                                {ROLE_LABELS[m.role]}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            {m.isSigned ? (
                              <div className="flex flex-col items-end gap-0.5">
                                <Badge variant="success" className="!text-[9px] !px-1.5">
                                  <CheckCircle2 className="w-2 h-2 mr-0.5" />
                                  İmzalı
                                </Badge>
                                <span className="text-[9px] text-muted-foreground font-mono">{m.signedAt}</span>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" className="!text-[9px] !h-6 !px-2">
                                <Mail className="w-2.5 h-2.5 mr-1" />
                                Hatırlat
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress ring sum */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs font-semibold mb-3">Oran Toplam Kontrolü (Her hak türü %100 olmalı)</div>
                  <div className="space-y-2.5">
                    {RIGHTS.map((r) => {
                      const total = activeSheet.contributors.reduce((acc, c) => acc + (c.share[r] ?? 0), 0);
                      const ok = total === 100;
                      return (
                        <div key={r}>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", RIGHT_COLORS[r])} />
                              {RIGHT_LABELS[r]}
                            </span>
                            <span className={cn("font-mono font-semibold", ok ? "text-neon-green" : "text-destructive")}>
                              {total}% {!ok && <AlertTriangle className="inline w-2.5 h-2.5 ml-1" />}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden flex">
                            {activeSheet.contributors.map((c, i) => (
                              <div
                                key={c.memberId}
                                className={cn("h-full bg-gradient-to-r", RIGHT_COLORS[r])}
                                style={{ width: `${c.share[r] ?? 0}%`, opacity: 1 - i * 0.18 }}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {activeSheet.notes && (
                  <div className="p-3 rounded-xl bg-neon-purple/[0.05] border border-neon-purple/20">
                    <div className="text-[10px] uppercase tracking-wider text-neon-purple mb-1.5 font-semibold">Notlar</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{activeSheet.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    PDF İndir
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    Paylaş
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Matrix (Ana görünüm) */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Percent className="w-4 h-4 text-primary" />
                    Hak Paylaşım Matrisi
                  </CardTitle>
                  <CardDescription className="text-xs">Her üye için 5 ayrı hak türünde oranı düzenle</CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm">
                    <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                    Katılımcı Ekle
                  </Button>
                  <Button size="sm">
                    <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
                    Otomatik Dengele
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground sticky left-0 bg-card z-10 w-[220px]">Katılımcı</th>
                        {RIGHTS.map((r) => (
                          <th key={r} className="text-right p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground min-w-[100px]">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", RIGHT_COLORS[r])} />
                              {RIGHT_LABELS[r]}
                            </div>
                          </th>
                        ))}
                        <th className="p-3 w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {activeSheet.contributors.map((c) => {
                        const m = MEMBERS.find(x => x.id === c.memberId)!;
                        return (
                          <tr key={c.memberId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-3 sticky left-0 bg-card z-10">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Avatar name={m.name} size="sm" />
                                <div className="min-w-0">
                                  <div className="font-medium text-sm truncate">{m.name}</div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <Badge variant="muted" className={cn("!text-[8px] !px-1", ROLE_COLORS[m.role])}>
                                      {ROLE_LABELS[m.role]}
                                    </Badge>
                                    {m.isSigned && (
                                      <Badge variant="success" className="!text-[8px] !px-1">
                                        İmzalı
                                      </Badge>
                                    )}
                                  </div>
                                  {c.note && (
                                    <div className="text-[10px] text-muted-foreground mt-1 italic truncate">{c.note}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            {RIGHTS.map((r) => (
                              <td key={r} className="p-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="relative w-20">
                                    <Input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={c.share[r]}
                                      className="h-8 text-xs font-mono text-right pr-6"
                                    />
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">%</span>
                                  </div>
                                </div>
                              </td>
                            ))}
                            <td className="p-2 text-right">
                              <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {/* Totals row */}
                      <tr className="bg-primary/[0.03] border-t-2 border-primary/30">
                        <td className="p-3 sticky left-0 bg-primary/[0.03] z-10">
                          <div className="font-semibold text-sm flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-primary" />
                            Toplam (100% olmalı)
                          </div>
                        </td>
                        {RIGHTS.map((r) => {
                          const total = activeSheet.contributors.reduce((acc, c) => acc + (c.share[r] ?? 0), 0);
                          const ok = total === 100;
                          return (
                            <td key={r} className="p-3 text-right">
                              <div className={cn(
                                "inline-flex items-center gap-1.5 font-mono font-bold text-sm px-2 py-1 rounded-lg",
                                ok ? "bg-neon-green/10 text-neon-green" : "bg-destructive/10 text-destructive"
                              )}>
                                {total}%
                                {ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              </div>
                            </td>
                          );
                        })}
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Legend / Visual stacked bar */}
                <div className="mt-5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                    <Copyright className="w-3.5 h-3.5 text-muted-foreground" />
                    Birleşik Görsel Dağılım — Tüm Hak Türleri
                  </div>
                  <div className="space-y-3">
                    {activeSheet.contributors.map((c) => {
                      const m = MEMBERS.find(x => x.id === c.memberId)!;
                      const avg = Math.round(RIGHTS.reduce((acc, r) => acc + (c.share[r] ?? 0), 0) / RIGHTS.length);
                      return (
                        <div key={c.memberId}>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <div className="flex items-center gap-1.5">
                              <Avatar name={m.name} size="sm" />
                              <span className="font-medium">{m.name}</span>
                              <span className="text-muted-foreground text-[10px]">
                                ({ROLE_LABELS[m.role]})
                              </span>
                            </div>
                            <span className="font-mono font-semibold text-muted-foreground">
                              Ort. %{avg}
                            </span>
                          </div>
                          <div className="h-3 rounded-full bg-white/5 overflow-hidden flex">
                            {RIGHTS.map((r) => (
                              <div
                                key={r}
                                className={cn("h-full bg-gradient-to-r", RIGHT_COLORS[r])}
                                style={{ width: `${c.share[r]}%`, mixBlendMode: "normal" }}
                                title={`${RIGHT_LABELS[r]}: ${c.share[r]}%`}
                              />
                            ))}
                          </div>
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {RIGHTS.map((r) => (
                              <Badge key={r} variant="muted" className="!text-[8px] !px-1.5 !font-mono">
                                {RIGHT_LABELS[r].split(" ")[0]}: {c.share[r]}%
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CALCULATOR SIM */}
        <TabsContent value="calculator">
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-primary" />
                  Gelir Senaryosu
                </CardTitle>
                <CardDescription className="text-xs">Toplam geliri değiştirerek herkesin payını gör</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="font-medium">Toplam Gelir (TL)</label>
                    <span className="font-mono font-bold text-primary">{formatPrice(simRevenue, "TRY")}</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="number"
                      value={simRevenue}
                      onChange={(e) => setSimRevenue(Number(e.target.value))}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[5000, 25000, 100000, 500000, 1000000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setSimRevenue(v)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-colors",
                          simRevenue === v
                            ? "bg-primary/20 border-primary/40 text-primary"
                            : "bg-white/5 border-white/5 text-muted-foreground hover:text-foreground hover:border-white/10"
                        )}
                      >
                        ₺{(v / 1000).toFixed(0)}K
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Parça Seç</div>
                  <Select defaultValue={activeSheet?.id}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {splitSheets?.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          <span className="flex items-center gap-2">
                            <Music2 className="w-3 h-3" />
                            {s.beat?.title}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-xl bg-neon-green/[0.05] border border-neon-green/20">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-wider text-neon-green font-semibold">Net Ödenecek</div>
                    <Badge variant="success" className="!text-[9px]">
                      <TrendingUp className="w-2 h-2 mr-0.5" />
                      +%12 geçen aya göre
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold tabular-nums mt-1">
                    {formatPrice(simRevenue, "TRY")}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Komisyonlar (%15 yapımcı payı) düşüldükten sonra
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Kişi Başına Gelir Dağılımı
                </CardTitle>
                <CardDescription className="text-xs">Hak türüne göre tahmini kazançlar</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-5">
                {activeSheet.contributors.map((c) => {
                  const m = MEMBERS.find(x => x.id === c.memberId)!;
                  const earnings = RIGHTS.reduce((acc, r) => acc + (simRevenue * (c.share[r] / 100) * 0.2), 0);
                  const totalShare = RIGHTS.reduce((a, r) => a + c.share[r], 0) / RIGHTS.length;
                  return (
                    <div key={c.memberId} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.name} size="md" />
                          <div>
                            <div className="font-semibold">{m.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="muted" className={cn("!text-[9px] !px-1.5", ROLE_COLORS[m.role])}>
                                {ROLE_LABELS[m.role]}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {m.proName} · IPI: {m.ipi}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold tabular-nums bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {formatPrice(earnings, "TRY")}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            Ort. %{totalShare.toFixed(1)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {RIGHTS.map((r) => {
                          const val = (simRevenue * c.share[r]) / 100 * 0.2;
                          const pct = c.share[r];
                          return (
                            <div key={r} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                              <div className="flex items-center gap-1 mb-2">
                                <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", RIGHT_COLORS[r])} />
                                <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">
                                  {RIGHT_LABELS[r].split(" ")[0]}
                                </span>
                              </div>
                              <div className="text-xs font-mono font-bold mb-1">{formatPrice(val, "TRY")}</div>
                              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-1">
                                <div className={cn("h-full rounded-full bg-gradient-to-r", RIGHT_COLORS[r])} style={{ width: `${pct}%` }} />
                              </div>
                              <div className="text-[9px] text-muted-foreground font-mono">%{pct}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ALL LIST */}
        <TabsContent value="list">
          <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-4">
            {splitSheets?.map((s) => {
              const sc = s?.contributors?.length ?? SPLIT_SHEETS[0]?.contributors?.length ?? 0;
              const totalMembers = s?.members?.length ?? SPLIT_SHEETS[0]?.members?.length ?? 0;
              return (
                <Card key={s.id} className="group hover:border-primary/30 transition-all overflow-hidden">
                  <div className={cn("h-1.5 w-full bg-gradient-to-r",
                    s.status === "signed" ? "from-neon-green to-accent" :
                    s.status === "sent" ? "from-primary to-secondary" :
                    s.status === "disputed" ? "from-destructive to-neon-orange" : "from-muted to-muted-foreground"
                  )} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="muted" className={cn("!text-[9px] !px-1.5", STATUS_STYLE[s.status])}>
                            {STATUS_LABELS[s.status]}
                          </Badge>
                          <Badge variant="muted" className="!text-[9px] !font-mono">{s.version}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-0.5">{s.title}</h3>
                        <div className="text-[11px] text-muted-foreground">
                          Güncellendi: {formatDate(s.updatedAt)}
                        </div>
                      </div>
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <Link href={`/beats/${s.beat.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-primary/[0.05] to-secondary/[0.03] border border-white/5 mb-4 hover:from-primary/[0.08] transition-colors">
                      <Disc3 className="w-8 h-8 text-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm truncate">{s.beat.title}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {s.beat.bpm} BPM · {s.beat.key} · {BEAT_TYPE_LABELS[s.beat.type]}
                        </div>
                      </div>
                    </Link>

                    {/* Quick split preview */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                        <span>Hızlı Bakış (Master)</span>
                        <span className="font-mono">{sc} katılımcı</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden flex">
                        {s.contributors.map((c, i) => (
                          <div
                            key={c.memberId}
                            className={cn("h-full bg-gradient-to-r", RIGHT_COLORS.master)}
                            style={{ width: `${c.share.master}%`, opacity: 1 - i * 0.18 }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <AvatarGroup size="sm">
                          {s.members.map(m => (
                            <Avatar key={m.id} name={m.name} size="sm" />
                          ))}
                        </AvatarGroup>
                        <Badge variant="muted" className="!text-[9px]">
                          {s.contributors.filter(c => MEMBERS.find(m => m.id === c.memberId)?.isSigned).length}/{sc} imzalı
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileSignature className="w-3.5 h-3.5 mr-1.5" />
                        Aç
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Dışa Aktar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
