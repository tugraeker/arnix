"use client";

import * as React from "react";
import {
  MicVocal,
  Speaker,
  Headphones,
  Settings2,
  GuitarElectric,
  Piano,
  Drum,
  KeyRound,
  Cable,
  HardDrive,
  PlusCircle,
  Search,
  Filter,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Clock3,
  Calendar,
  Star,
  MoreHorizontal,
  BatteryMedium,
  Activity,
  Tag,
  FileText,
  Box,
  ArrowRight,
  Shield,
  ScanLine,
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

type EqType = "mikrofon" | "kulaklık" | "monitör" | "konsol" | "preamp" | "enstrüman" | "arayüz" | "kablo" | "depolama" | "efekt";
type EqStatus = "kullanımda" | "boşta" | "bakım" | "ödünçte" | "arıza";
type EqLocation = "Stüdyo A" | "Stüdyo B" | "Mix Room" | "Booth" | "Depo";

interface Equipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: EqType;
  status: EqStatus;
  location: EqLocation;
  serial: string;
  purchaseDate: string;
  warrantyUntil: string;
  price: number;
  lastService?: string;
  nextService?: string;
  user?: string;
  condition: "yeni" | "çok iyi" | "iyi" | "orta" | "aşınmış";
  category: string[];
  usedHours?: number;
  features: string[];
  rating: number;
  imageAccent: string;
  Icon: any;
}

const EQUIPMENTS: Equipment[] = [
  {
    id: "e1", name: "Neumann U87 Ai", brand: "Neumann", model: "U87 Ai",
    type: "mikrofon", status: "kullanımda", location: "Stüdyo A",
    serial: "U87AI-22938-TR", purchaseDate: "2024-02-10", warrantyUntil: "2029-02-10",
    price: 125000, lastService: "2026-06-15", nextService: "2026-12-15", user: "Can Demir",
    condition: "çok iyi", category: ["Kondenser", "Büyük Diyafram", "Multi-Pattern"],
    usedHours: 1842,
    features: ["3 Polar Pattern", "K67 Kapasitör", "10dB Pad", "High Pass"],
    rating: 5, imageAccent: "from-neon-cyan via-primary to-neon-purple",
    Icon: MicVocal,
  },
  {
    id: "e2", name: "Avalon Design VT-737sp", brand: "Avalon", model: "VT-737sp",
    type: "preamp", status: "kullanımda", location: "Stüdyo A",
    serial: "AVL737-9812", purchaseDate: "2024-01-05", warrantyUntil: "2027-01-05",
    price: 218000, lastService: "2026-03-01", user: "Can Demir",
    condition: "çok iyi", category: ["Tüp Preamp", "Kompresör", "EQ"],
    usedHours: 2104,
    features: ["Class A Tüp", "Opto Kompresör", "4 Band EQ"],
    rating: 5, imageAccent: "from-neon-orange via-neon-pink to-destructive",
    Icon: Settings2,
  },
  {
    id: "e3", name: "Genelec 8351B", brand: "Genelec", model: "8351B (Pair)",
    type: "monitör", status: "boşta", location: "Mix Room",
    serial: "GN-8351-7781-PAIR", purchaseDate: "2023-11-20", warrantyUntil: "2028-11-20",
    price: 285000, lastService: "2026-05-10", nextService: "2026-11-10",
    condition: "yeni", category: ["3 Yollu", "SAM Aktif", "Coaxial"],
    usedHours: 3840,
    features: ["GLM Kalibrasyon", "846W / kanal", "38Hz-40kHz"],
    rating: 5, imageAccent: "from-neon-green via-accent to-neon-cyan",
    Icon: Speaker,
  },
  {
    id: "e4", name: "SSL 4000E Konsol", brand: "Solid State Logic", model: "4000E 48ch",
    type: "konsol", status: "kullanımda", location: "Mix Room",
    serial: "SSL4KE-88234", purchaseDate: "2022-08-12", warrantyUntil: "-",
    price: 1_250_000, lastService: "2026-04-01", nextService: "2026-10-01", user: "Can Demir",
    condition: "iyi", category: ["Analog", "48 Kanal", "E-Serisi"],
    usedHours: 8820,
    features: ["48 Kanal", "SSL E-Series EQ", "VCA Grup", "Total Recall"],
    rating: 5, imageAccent: "from-neon-purple via-primary to-secondary",
    Icon: Gauge,
  },
  {
    id: "e5", name: "Manley Variable Mu", brand: "Manley Labs", model: "Variable Mu Mastering",
    type: "efekt", status: "bakım", location: "Depo",
    serial: "MNLY-VM-2210", purchaseDate: "2024-06-12", warrantyUntil: "2029-06-12",
    price: 198000, nextService: "2026-09-20",
    condition: "orta", category: ["Mastering", "Tüp Kompresör", "Vari-Mu"],
    usedHours: 982,
    features: ["Tüp Kompresör", "Sidechain EQ", "M/S Modu"],
    rating: 4, imageAccent: "from-neon-pink via-destructive to-neon-orange",
    Icon: KeyRound,
  },
  {
    id: "e6", name: "Sony C-800G Pac", brand: "Sony", model: "C-800G",
    type: "mikrofon", status: "boşta", location: "Stüdyo B",
    serial: "SNY-C8G-5502", purchaseDate: "2024-10-10", warrantyUntil: "2027-10-10",
    price: 442000, lastService: "2026-06-01",
    condition: "yeni", category: ["Kondenser", "Büyük Diyafram", "Tüp"],
    usedHours: 240,
    features: ["6AU6 Tüp", "Soğutma Sistemi", "2 Polar Pattern"],
    rating: 5, imageAccent: "from-neon-cyan via-secondary to-neon-green",
    Icon: MicVocal,
  },
  {
    id: "e7", name: "Focal Clear MG Pro", brand: "Focal", model: "Clear MG Pro",
    type: "kulaklık", status: "boşta", location: "Stüdyo B",
    serial: "FCL-CMG-882", purchaseDate: "2025-01-18", warrantyUntil: "2028-01-18",
    price: 58000,
    condition: "çok iyi", category: ["Stüdyo", "Açık Arka", "Referans"],
    usedHours: 1240,
    features: ["Magnesium Kabuk", "5Hz-40kHz", "104dB SPL"],
    rating: 5, imageAccent: "from-primary via-neon-purple to-secondary",
    Icon: Headphones,
  },
  {
    id: "e8", name: "Taylor 814ce", brand: "Taylor", model: "814ce LTD",
    type: "enstrüman", status: "kullanımda", location: "Stüdyo B", user: "Kaan Arslan",
    serial: "TY-814-120924", purchaseDate: "2023-04-20", warrantyUntil: "2026-04-20",
    price: 128000,
    condition: "iyi", category: ["Akustik Gitar", "Cutaway", "Elektro"],
    usedHours: 480,
    features: ["Sitka Ladin", "Gül Ağacı", "Expression Sistem 2"],
    rating: 5, imageAccent: "from-neon-orange via-neon-green to-accent",
    Icon: GuitarElectric,
  },
  {
    id: "e9", name: "Rhodes MK8", brand: "Rhodes", model: "MK8 73",
    type: "enstrüman", status: "kullanımda", location: "Mix Room",
    serial: "RDS-MK8-381", purchaseDate: "2024-09-02", warrantyUntil: "2029-09-02",
    price: 396000, lastService: "2026-06-18", nextService: "2026-12-18",
    condition: "çok iyi", category: ["Elektrikli Piyano", "73 Tuş"],
    usedHours: 168,
    features: ["73 Tuş", "Dahili Preamp", "Tone Bar", "Vibrato"],
    rating: 5, imageAccent: "from-neon-pink via-neon-orange to-neon-green",
    Icon: Piano,
  },
  {
    id: "e10", name: "Roland VAD706", brand: "Roland", model: "VAD706 Kit",
    type: "enstrüman", status: "kullanımda", location: "Stüdyo A", user: "Kaan Arslan",
    serial: "RL-VAD-456", purchaseDate: "2025-03-03", warrantyUntil: "2028-03-03",
    price: 186000,
    condition: "çok iyi", category: ["Elektronik Davul", "Acrylic", "TD-50X"],
    usedHours: 310,
    features: ["5 Tom", "2 Kick", "2 Ride/Crash", "TD-50X Modül"],
    rating: 4, imageAccent: "from-neon-purple via-destructive to-neon-orange",
    Icon: Drum,
  },
  {
    id: "e11", name: "Universal Audio Apollo x16", brand: "Universal Audio", model: "Apollo x16 Gen 2",
    type: "arayüz", status: "boşta", location: "Mix Room",
    serial: "UAD-APX16-238", purchaseDate: "2024-04-11", warrantyUntil: "2029-04-11",
    price: 142000, lastService: "2026-02-12",
    condition: "yeni", category: ["Thunderbolt 3", "16x16", "UAD DSP"],
    usedHours: 1580,
    features: ["16x16 I/O", "4x Unison Pre", "HEXA UAD Core"],
    rating: 5, imageAccent: "from-neon-cyan via-neon-purple to-primary",
    Icon: HardDrive,
  },
  {
    id: "e12", name: "Lynx Aurora(n) 32", brand: "Lynx Studio", model: "Aurora(n) 32",
    type: "arayüz", status: "arıza", location: "Depo",
    serial: "LYN-AUR-32-211", purchaseDate: "2023-12-18", warrantyUntil: "2026-12-18",
    price: 318000, lastService: "2026-05-18", nextService: "2026-09-21",
    condition: "aşınmış", category: ["32 Kanal", "AD/DA", "Pro Tools HD"],
    usedHours: 4120,
    features: ["32ch AD/DA", "LT-HD Card", "192kHz"],
    rating: 4, imageAccent: "from-neon-orange via-destructive to-primary",
    Icon: Cable,
  },
];

const STATUS_STYLE: Record<EqStatus, string> = {
  kullanımda: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
  boşta: "bg-neon-green/20 text-neon-green border-neon-green/30",
  bakım: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  ödünçte: "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
  arıza: "bg-destructive/20 text-destructive border-destructive/30",
};
const STATUS_ICONS: Record<EqStatus, any> = {
  kullanımda: Activity,
  boşta: CheckCircle2,
  bakım: Wrench,
  ödünçte: Shield,
  arıza: AlertTriangle,
};
const COND_LABELS: Record<Equipment["condition"], string> = {
  yeni: "Sıfır",
  "çok iyi": "Çok İyi",
  iyi: "İyi",
  orta: "Orta",
  aşınmış: "Aşınmış",
};

const TYPE_LABELS: Record<EqType, string> = {
  mikrofon: "Mikrofon",
  kulaklık: "Kulaklık",
  monitör: "Monitör",
  konsol: "Konsol",
  preamp: "Preamp",
  enstrüman: "Enstrüman",
  arayüz: "Arayüz",
  kablo: "Kablo",
  depolama: "Depolama",
  efekt: "Efekt",
};

const LOC_COLORS: Record<EqLocation, string> = {
  "Stüdyo A": "from-primary to-neon-purple",
  "Stüdyo B": "from-neon-cyan to-secondary",
  "Mix Room": "from-neon-pink to-destructive",
  "Booth": "from-neon-orange to-neon-pink",
  "Depo": "from-muted-foreground to-muted",
};

export default function StudioEquipmentPage() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");
  const [location, setLocation] = React.useState<string>("all");
  const [view, setView] = React.useState<"grid" | "table">("grid");

  const filtered = EQUIPMENTS.filter(e => {
    if (type !== "all" && e.type !== type) return false;
    if (status !== "all" && e.status !== status) return false;
    if (location !== "all" && e.location !== location) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!e.name.toLowerCase().includes(s) && !e.brand.toLowerCase().includes(s) && !e.model.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const stats = {
    total: EQUIPMENTS.length,
    value: EQUIPMENTS.reduce((a, b) => a + b.price, 0),
    usage: Math.round(EQUIPMENTS.filter(e => e.status === "kullanımda").length / EQUIPMENTS.length * 100),
    issue: EQUIPMENTS.filter(e => e.status === "arıza" || e.status === "bakım").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" className="!px-2 !text-[10px] tracking-wider">
              <Settings2 className="w-3 h-3 mr-1.5" />
              STUDIO INVENTORY
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {EQUIPMENTS.length} cihaz · {stats.usage}% kullanım
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Stüdyo Ekipmanları</h1>
          <p className="text-muted-foreground">Kullanılan envanter — konum, durum, servis takibi ve sigorta bilgileri</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-1.5" />
            Servis Raporu
          </Button>
          <Button variant="outline" size="sm">
            <ScanLine className="w-4 h-4 mr-1.5" />
            Barkod Tara
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Cihaz Ekle
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary opacity-15 blur-3xl" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Toplam Cihaz</Badge>
              <Box className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-bold tabular-nums">{stats.total}</div>
            <div className="text-[11px] text-muted-foreground">{(Object.values(EQUIPMENTS.reduce((a: any, b) => { a[b.type] = 1; return a; }, {})).length)} farklı tür</div>
          </CardContent>
        </Card>
        <Card className="p-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-neon-green to-accent opacity-15 blur-3xl" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Envanter Değeri</Badge>
              <BatteryMedium className="w-4 h-4 text-neon-green" />
            </div>
            <div className="text-3xl font-bold tabular-nums">{formatPrice(stats.value, "TRY")}</div>
            <div className="text-[11px] text-muted-foreground">Sigorta kapsamında</div>
          </CardContent>
        </Card>
        <Card className="p-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-neon-cyan to-primary opacity-15 blur-3xl" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Aktif Kullanım</Badge>
              <Activity className="w-4 h-4 text-neon-cyan" />
            </div>
            <div className="text-3xl font-bold tabular-nums">{stats.usage}%</div>
            <div className="h-1.5 mt-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-primary" style={{ width: `${stats.usage}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-destructive to-neon-orange opacity-15 blur-3xl" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Bakım / Arıza</Badge>
              <AlertTriangle className="w-4 h-4 text-neon-orange" />
            </div>
            <div className="text-3xl font-bold tabular-nums text-neon-orange">{stats.issue}</div>
            <div className="text-[11px] text-muted-foreground">
              {EQUIPMENTS.filter(e => e.status === "arıza").length} arıza · {EQUIPMENTS.filter(e => e.status === "bakım").length} bakımda
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <CardContent className="p-0 grid md:grid-cols-7 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cihaz, model, marka ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Tür" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Türler</SelectItem>
              {(Object.keys(TYPE_LABELS) as EqType[]).map(t => (
                <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Durum" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              {(Object.keys(STATUS_STYLE) as EqStatus[]).map(s => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger><SelectValue placeholder="Konum" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Konumlar</SelectItem>
              {(Object.keys(LOC_COLORS) as EqLocation[]).map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="md:col-span-2 flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="flex-1 !text-[11px]">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              Gelişmiş
            </Button>
            <Tabs defaultValue="grid" value={view} onValueChange={(v) => setView(v as any)} className="w-auto">
              <TabsList className="!p-0.5">
                <TabsTrigger value="grid" className="!text-[10px] !px-2.5 !py-0.5">Grid</TabsTrigger>
                <TabsTrigger value="table" className="!text-[10px] !px-2.5 !py-0.5">Tablo</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <TabsContent value="grid">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(e => {
            const StatusIcon = STATUS_ICONS[e.status];
            const Icon = e.Icon;
            return (
              <Card key={e.id} className="p-0 overflow-hidden group hover:border-primary/30 transition-all">
                {/* Accent header */}
                <div className={cn("h-24 relative overflow-hidden bg-gradient-to-br", e.imageAccent)}>
                  <div className="absolute inset-0 opacity-35 mix-blend-overlay" style={{
                    backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15), transparent 50%)"
                  }} />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge variant="muted" className={cn("!text-[8px] !px-1.5 !bg-black/40 backdrop-blur-sm !border-white/10", STATUS_STYLE[e.status])}>
                      <StatusIcon className="w-1.5 h-1.5 mr-0.5" />
                      {e.status}
                    </Badge>
                    {e.user && (
                      <Badge variant="muted" className="!text-[8px] !bg-black/40 backdrop-blur-sm !border-white/10 text-white">
                        <Activity className="w-1.5 h-1.5 mr-0.5" />
                        {e.user}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={cn("w-3 h-3", i < e.rating ? "fill-yellow-400 text-yellow-400" : "fill-black/30 text-white/50")} />
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <Icon className="w-14 h-14 text-white/90 drop-shadow-xl" strokeWidth={1.2} />
                    <div className="text-right text-white">
                      <Badge variant="muted" className={cn("!text-[8px] !px-1.5 !bg-black/40 backdrop-blur-sm !border-white/10 flex items-center gap-1 inline-flex w-auto")}>
                        <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", LOC_COLORS[e.location])} />
                        {e.location}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{e.brand}</div>
                        <h3 className="text-base font-bold">{e.name}</h3>
                      </div>
                      <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <Badge variant="outline" className="!text-[8px] !px-1.5">{TYPE_LABELS[e.type]}</Badge>
                      <Badge variant="outline" className="!text-[8px] !px-1.5">{COND_LABELS[e.condition]}</Badge>
                      {e.usedHours && (
                        <Badge variant="outline" className="!text-[8px] !px-1.5">{e.usedHours.toLocaleString("tr-TR")} saat</Badge>
                      )}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-muted-foreground text-[9px] uppercase mb-0.5">Seri No</div>
                      <div className="font-mono text-[10px]">{e.serial}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-muted-foreground text-[9px] uppercase mb-0.5">Alım</div>
                      <div className="font-mono text-[10px]">{formatDate(e.purchaseDate)}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-muted-foreground text-[9px] uppercase mb-0.5">Garanti</div>
                      <div className="font-mono text-[10px]">{e.warrantyUntil}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-muted-foreground text-[9px] uppercase mb-0.5">Değer</div>
                      <div className="font-semibold text-[11px] tabular-nums">{formatPrice(e.price, "TRY")}</div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1">
                    {e.category.map(c => (
                      <Badge key={c} variant="muted" className="!text-[8px] !px-1.5 bg-white/[0.03] border-white/5">
                        <Tag className="w-1.5 h-1.5 mr-0.5" />
                        {c}
                      </Badge>
                    ))}
                  </div>

                  {/* Features */}
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Özellikler</div>
                    <div className="flex flex-wrap gap-1">
                      {e.features.map(f => (
                        <span key={f} className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/5 border border-primary/15 text-primary">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Service info */}
                  {(e.lastService || e.nextService) && (
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 flex-wrap">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                        {e.lastService && (
                          <span className="inline-flex items-center gap-1">
                            <Wrench className="w-2.5 h-2.5" />
                            Son: {formatDate(e.lastService)}
                          </span>
                        )}
                        {e.nextService && (
                          <span className={cn("inline-flex items-center gap-1",
                            new Date(e.nextService) < new Date() ? "text-destructive" : "text-foreground"
                          )}>
                            <Calendar className="w-2.5 h-2.5" />
                            Sonraki: {formatDate(e.nextService)}
                          </span>
                        )}
                      </div>
                      <Button size="xs" variant="outline" className="!text-[9px]">
                        Detaylar <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="table">
        <Card className="p-0 overflow-hidden">
          <div className="rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Cihaz</th>
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden md:table-cell">Tür</th>
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden lg:table-cell">Konum</th>
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Durum</th>
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden md:table-cell">Seri / Alım</th>
                  <th className="text-right p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Değer</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => {
                  const SI = STATUS_ICONS[e.status];
                  const Icon = e.Icon;
                  return (
                    <tr key={e.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", e.imageAccent)}>
                            <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold">{e.name}</div>
                            <div className="text-[10px] text-muted-foreground truncate font-mono">{e.brand} {e.model}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge variant="outline" className="!text-[9px] !px-1.5">{TYPE_LABELS[e.type]}</Badge>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <Badge variant="muted" className="!text-[9px] !px-1.5 flex items-center gap-1 w-auto">
                          <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", LOC_COLORS[e.location])} />
                          {e.location}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="muted" className={cn("!text-[9px] !px-1.5", STATUS_STYLE[e.status])}>
                          <SI className="w-2 h-2 mr-1" />
                          {e.status}
                        </Badge>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="text-[10px] font-mono">{e.serial}</div>
                        <div className="text-[10px] text-muted-foreground">{formatDate(e.purchaseDate)}</div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="text-xs font-bold tabular-nums">{formatPrice(e.price, "TRY")}</div>
                        {e.usedHours && <div className="text-[9px] text-muted-foreground font-mono">{e.usedHours.toLocaleString("tr-TR")} saat</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </TabsContent>
    </div>
  );
}
