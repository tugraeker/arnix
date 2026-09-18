"use client";

import * as React from "react";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  PackageOpen,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Layers,
  Download,
  Archive,
  MoreHorizontal,
  Box,
  Tag,
  History,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  BarChart3,
  Percent,
  Truck,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { cn, formatDate, formatPrice } from "@/lib/utils";

type ItemType = "CD" | "Vinil" | "Tişört" | "Sweatshirt" | "Poster" | "Kapüşonlu" | "Sample Pack" | "Şapka" | "Aksesuar";
type ItemStatus = "yeterli" | "düşük" | "kritik" | "tükendi";
type Size = "Yok" | "S" | "M" | "L" | "XL" | "2XL";

interface InvItem {
  id: string;
  sku: string;
  name: string;
  artist?: string;
  type: ItemType;
  variant?: string;
  size: Size;
  stock: number;
  reorder: number;
  target: number;
  price: number;
  cost: number;
  status: ItemStatus;
  category: string;
  imageAccent: string;
  Icon: any;
  lastRestock?: string;
  moSold?: number;
  moRevenue?: number;
  warehouse?: "Depo A" | "Depo B" | "Ofis";
}

const ITEMS: InvItem[] = [
  {
    id: "i1", sku: "CD-AL-001", name: "Aurora Lights — CD (Jewel Case)", artist: "Can Demir",
    type: "CD", size: "Yok", stock: 342, reorder: 150, target: 500,
    price: 350, cost: 42, status: "yeterli", category: "Fiziksel Medya",
    imageAccent: "from-primary to-neon-purple", Icon: Package,
    lastRestock: "2026-08-02", moSold: 184, moRevenue: 55_200, warehouse: "Depo A",
  },
  {
    id: "i2", sku: "VL-AL-001", name: "Aurora Lights — 180g Vinil (Siyah)", artist: "Can Demir",
    type: "Vinil", size: "Yok", stock: 48, reorder: 80, target: 200,
    price: 1250, cost: 220, status: "düşük", category: "Fiziksel Medya",
    imageAccent: "from-neon-purple via-neon-pink to-destructive", Icon: Layers,
    lastRestock: "2026-06-15", moSold: 96, moRevenue: 120_000, warehouse: "Depo A",
  },
  {
    id: "i3", sku: "VL-AL-002", name: "Aurora Lights — 180g Vinil (Mor Splatter)", artist: "Can Demir",
    type: "Vinil", size: "Yok", stock: 12, reorder: 30, target: 100,
    price: 1650, cost: 260, status: "kritik", category: "Fiziksel Medya",
    imageAccent: "from-neon-cyan via-primary to-neon-purple", Icon: Layers,
    lastRestock: "2026-04-10", moSold: 88, moRevenue: 145_200, warehouse: "Depo A",
  },
  {
    id: "i4", sku: "TS-ARN-001", name: "Arnix Studio Logo Tee — Beyaz",
    type: "Tişört", size: "S", stock: 18, reorder: 25, target: 60,
    price: 650, cost: 110, status: "yeterli", category: "Merch",
    imageAccent: "from-neon-green via-accent to-neon-cyan", Icon: ShirtIcon,
    lastRestock: "2026-07-20", moSold: 44, moRevenue: 28_600, warehouse: "Depo B",
  },
  {
    id: "i5", sku: "TS-ARN-002", name: "Arnix Studio Logo Tee — Siyah",
    type: "Tişört", size: "M", stock: 22, reorder: 30, target: 80,
    price: 650, cost: 110, status: "yeterli", category: "Merch",
    imageAccent: "from-primary via-secondary to-neon-cyan", Icon: ShirtIcon,
    lastRestock: "2026-07-20", moSold: 78, moRevenue: 50_700, warehouse: "Depo B",
  },
  {
    id: "i6", sku: "TS-ARN-003", name: "Arnix Studio Logo Tee — Siyah",
    type: "Tişört", size: "L", stock: 11, reorder: 30, target: 80,
    price: 650, cost: 110, status: "düşük", category: "Merch",
    imageAccent: "from-neon-pink via-destructive to-neon-orange", Icon: ShirtIcon,
    lastRestock: "2026-07-20", moSold: 92, moRevenue: 59_800, warehouse: "Depo B",
  },
  {
    id: "i7", sku: "TS-ARN-004", name: "Arnix Studio Logo Tee — Siyah",
    type: "Tişört", size: "XL", stock: 4, reorder: 20, target: 50,
    price: 650, cost: 110, status: "kritik", category: "Merch",
    imageAccent: "from-neon-orange via-neon-pink to-destructive", Icon: ShirtIcon,
    lastRestock: "2026-07-20", moSold: 66, moRevenue: 42_900, warehouse: "Depo B",
  },
  {
    id: "i8", sku: "HD-ARN-101", name: "Arnix Hoodie — Oversize Gri",
    type: "Kapüşonlu", size: "M", stock: 0, reorder: 15, target: 40,
    price: 1450, cost: 260, status: "tükendi", category: "Merch",
    imageAccent: "from-neon-purple via-primary to-secondary", Icon: ShirtIcon,
    lastRestock: "2026-03-15", moSold: 52, moRevenue: 75_400, warehouse: "Depo B",
  },
  {
    id: "i9", sku: "SW-ARN-202", name: "Crewneck Sweatshirt — Mor",
    type: "Sweatshirt", size: "L", stock: 16, reorder: 20, target: 50,
    price: 1100, cost: 190, status: "yeterli", category: "Merch",
    imageAccent: "from-neon-pink via-neon-purple to-primary", Icon: ShirtIcon,
    lastRestock: "2026-07-01", moSold: 34, moRevenue: 37_400, warehouse: "Depo B",
  },
  {
    id: "i10", sku: "PT-ARN-501", name: "Neon Studio Poster A2",
    type: "Poster", size: "Yok", stock: 220, reorder: 100, target: 300,
    price: 180, cost: 22, status: "yeterli", category: "Aksesuar",
    imageAccent: "from-neon-cyan via-secondary to-primary", Icon: Box,
    lastRestock: "2026-08-10", moSold: 286, moRevenue: 51_480, warehouse: "Ofis",
  },
  {
    id: "i11", sku: "PT-ARN-502", name: "Aurora Lights Albüm Posteri A1", artist: "Can Demir",
    type: "Poster", size: "Yok", stock: 92, reorder: 80, target: 200,
    price: 280, cost: 38, status: "yeterli", category: "Aksesuar",
    imageAccent: "from-neon-orange via-primary to-neon-purple", Icon: Box,
    lastRestock: "2026-07-28", moSold: 188, moRevenue: 52_640, warehouse: "Ofis",
  },
  {
    id: "i12", sku: "CAP-ARN-007", name: "Arnix Dad Cap — Siyah",
    type: "Şapka", size: "Yok", stock: 6, reorder: 20, target: 60,
    price: 520, cost: 85, status: "kritik", category: "Aksesuar",
    imageAccent: "from-primary via-destructive to-neon-orange", Icon: Package,
    lastRestock: "2026-05-05", moSold: 58, moRevenue: 30_160, warehouse: "Ofis",
  },
  {
    id: "i13", sku: "SP-ARX-901", name: "Arnix Signature: Trap Vol. 3",
    type: "Sample Pack", size: "Yok", stock: 8_999_999, reorder: 0, target: 0,
    price: 2200, cost: 0, status: "yeterli", category: "Dijital Ürün",
    imageAccent: "from-neon-green via-neon-cyan to-primary", Icon: Download,
    lastRestock: "2026-07-01", moSold: 1842, moRevenue: 3_924_400,
  },
  {
    id: "i14", sku: "SP-ARX-902", name: "Arnix Signature: R&B Vocals",
    type: "Sample Pack", size: "Yok", stock: 9_999_999, reorder: 0, target: 0,
    price: 2900, cost: 0, status: "yeterli", category: "Dijital Ürün",
    imageAccent: "from-neon-purple via-neon-cyan to-secondary", Icon: Download,
    lastRestock: "2026-08-01", moSold: 1528, moRevenue: 4_313_200,
  },
  {
    id: "i15", sku: "SP-ARX-903", name: "Arnix Signature: Serum Presets",
    type: "Sample Pack", size: "Yok", stock: 4_999_999, reorder: 0, target: 0,
    price: 1600, cost: 0, status: "yeterli", category: "Dijital Ürün",
    imageAccent: "from-neon-orange via-neon-pink to-neon-purple", Icon: Download,
    lastRestock: "2026-06-15", moSold: 2208, moRevenue: 3_532_800,
  },
  {
    id: "i16", sku: "AK-ARN-701", name: "Arnix Sticker Pack (12li)",
    type: "Aksesuar", size: "Yok", stock: 418, reorder: 100, target: 500,
    price: 95, cost: 12, status: "yeterli", category: "Aksesuar",
    imageAccent: "from-neon-pink via-neon-cyan to-neon-green", Icon: Tag,
    lastRestock: "2026-08-15", moSold: 1820, moRevenue: 172_900, warehouse: "Ofis",
  },
];

const STATUS_STYLE: Record<ItemStatus, string> = {
  yeterli: "bg-neon-green/20 text-neon-green border-neon-green/30",
  düşük: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  kritik: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  tükendi: "bg-destructive/20 text-destructive border-destructive/30",
};

const TYPES: ItemType[] = ["CD", "Vinil", "Tişört", "Kapüşonlu", "Sweatshirt", "Poster", "Şapka", "Sample Pack", "Aksesuar"];
const CAT_STYLE: Record<string, string> = {
  "Fiziksel Medya": "bg-primary/10 text-primary border-primary/20",
  "Merch": "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
  "Aksesuar": "bg-neon-green/10 text-neon-green border-neon-green/20",
  "Dijital Ürün": "bg-neon-orange/10 text-neon-orange border-neon-orange/20",
};

function ShirtIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  );
}

export default function InventoryPage() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");
  const [category, setCategory] = React.useState<string>("all");

  const filtered = ITEMS.filter(i => {
    if (type !== "all" && i.type !== type) return false;
    if (status !== "all" && i.status !== status) return false;
    if (category !== "all" && i.category !== category) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!i.name.toLowerCase().includes(s) && !i.sku.toLowerCase().includes(s) && !(i.artist ?? "").toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const stats = {
    totalSKU: ITEMS.filter(i => i.type !== "Sample Pack").length,
    totalStock: ITEMS.filter(i => i.type !== "Sample Pack").reduce((a, b) => a + b.stock, 0),
    value: ITEMS.reduce((a, b) => a + b.stock * b.cost, 0),
    lowCount: ITEMS.filter(i => i.status === "kritik" || i.status === "tükendi").length,
    digitalMo: ITEMS.filter(i => i.type === "Sample Pack").reduce((a, b) => a + (b.moRevenue ?? 0), 0),
    physMo: ITEMS.filter(i => i.type !== "Sample Pack").reduce((a, b) => a + (b.moRevenue ?? 0), 0),
  };

  const top = [...ITEMS].sort((a, b) => (b.moRevenue ?? 0) - (a.moRevenue ?? 0)).slice(0, 5);
  const restock = ITEMS.filter(i => i.status === "düşük" || i.status === "kritik" || i.status === "tükendi").sort((a, b) => a.stock - b.stock);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" className="!px-2 !text-[10px] tracking-wider">
              <Archive className="w-3 h-3 mr-1.5" />
              INVENTORY & FULFILLMENT
            </Badge>
            <Badge variant="muted" className="!text-[10px]">{stats.totalSKU} SKU · {stats.totalStock.toLocaleString("tr-TR")} stok</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Stok Yönetimi</h1>
          <p className="text-muted-foreground">Fiziksel ürünler, medya ve dijital ürün envanteri — yeniden sipariş uyarıları</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-1.5" />
            Hareketler
          </Button>
          <Button variant="outline" size="sm">
            <Truck className="w-4 h-4 mr-1.5" />
            Tedarikçiler
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            CSV Aktar
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Ürün Ekle
          </Button>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="p-3 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">SKU</Badge>
              <Box className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-xl font-bold tabular-nums">{stats.totalSKU}</div>
            <div className="text-[9px] text-muted-foreground">{stats.totalStock.toLocaleString("tr-TR")} adet</div>
          </CardContent>
        </Card>
        <Card className="p-3 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-accent opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">Stok Değeri</Badge>
              <PackageOpen className="w-3.5 h-3.5 text-neon-green" />
            </div>
            <div className="text-xl font-bold tabular-nums">{formatPrice(stats.value, "TRY")}</div>
            <div className="text-[9px] text-muted-foreground">COGS bazında</div>
          </CardContent>
        </Card>
        <Card className="p-3 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-destructive to-neon-orange opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">Aksiyon</Badge>
              <AlertTriangle className="w-3.5 h-3.5 text-neon-orange" />
            </div>
            <div className="text-xl font-bold tabular-nums text-neon-orange">{stats.lowCount}</div>
            <div className="text-[9px] text-muted-foreground">tükendi / kritik</div>
          </CardContent>
        </Card>
        <Card className="p-3 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-primary opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">Fiziksel Aylık</Badge>
              <ShoppingCart className="w-3.5 h-3.5 text-neon-cyan" />
            </div>
            <div className="text-xl font-bold tabular-nums">{formatPrice(stats.physMo, "TRY")}</div>
            <div className="text-[9px] text-muted-foreground">+14.8% vs önceki</div>
          </CardContent>
        </Card>
        <Card className="p-3 relative overflow-hidden md:col-span-2">
          <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-neon-orange to-neon-pink opacity-20 blur-2xl" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="muted" className="!text-[9px] !px-1.5">Dijital Aylık</Badge>
              <TrendingUp className="w-3.5 h-3.5 text-neon-orange" />
            </div>
            <div className="text-xl font-bold tabular-nums">{formatPrice(stats.digitalMo, "TRY")}</div>
            <div className="text-[9px] text-muted-foreground">{ITEMS.filter(i=>i.type==="Sample Pack").reduce((a,b)=>a+(b.moSold||0),0).toLocaleString("tr-TR")} paket satışı · +22.4%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + filters */}
      <Card className="p-4">
        <CardContent className="p-0 space-y-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="!p-1">
              <TabsTrigger value="all" className="!text-[11px] !px-3 !py-1.5">Tümü</TabsTrigger>
              <TabsTrigger value="phys" className="!text-[11px] !px-3 !py-1.5">Fiziksel</TabsTrigger>
              <TabsTrigger value="merch" className="!text-[11px] !px-3 !py-1.5">Merch</TabsTrigger>
              <TabsTrigger value="media" className="!text-[11px] !px-3 !py-1.5">Fiziksel Medya</TabsTrigger>
              <TabsTrigger value="digital" className="!text-[11px] !px-3 !py-1.5">Dijital</TabsTrigger>
              <TabsTrigger value="restock" className="!text-[11px] !px-3 !py-1.5">Yeniden Sipariş ({restock.length})</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid md:grid-cols-7 gap-2">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Ürün, SKU, sanatçı ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 !text-xs h-8" />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="!text-xs !h-8"><SelectValue placeholder="Tür" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                {TYPES.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="!text-xs !h-8"><SelectValue placeholder="Durum" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                {(Object.keys(STATUS_STYLE) as ItemStatus[]).map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="!text-xs !h-8"><SelectValue placeholder="Kategori" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {Object.keys(CAT_STYLE).map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="md:col-span-2 !text-xs !h-8">
              <Filter className="w-3 h-3 mr-1.5" />
              Gelişmiş Filtrele
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid xl:grid-cols-3 gap-4">
        {/* Ana tablo */}
        <Card className="xl:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <div className="text-sm font-bold">Ürün Listesi</div>
              <Badge variant="muted" className="!text-[9px]">{filtered.length} sonuç</Badge>
            </div>
            <Button variant="outline" size="xs" className="!text-[10px]">
              Yenile <RefreshCw className="w-2.5 h-2.5 ml-1" />
            </Button>
          </div>
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Ürün</th>
                  <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden md:table-cell">SKU · Beden</th>
                  <th className="text-right p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Stok / Hedef</th>
                  <th className="text-right p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden sm:table-cell">Aylık</th>
                  <th className="text-right p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => {
                  const pct = i.target ? Math.min(100, Math.round(i.stock / i.target * 100)) : 100;
                  return (
                    <tr key={i.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0", i.imageAccent)}>
                            <i.Icon className="w-4.5 h-4.5 text-white" strokeWidth={1.8} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{i.name}</div>
                            <div className="flex items-center gap-1 flex-wrap mt-0.5">
                              <Badge variant="outline" className={cn("!text-[8px] !px-1.5", CAT_STYLE[i.category])}>
                                {i.category}
                              </Badge>
                              <Badge variant="muted" className={cn("!text-[8px] !px-1.5", STATUS_STYLE[i.status])}>
                                {i.status}
                              </Badge>
                              {i.artist && <Badge variant="muted" className="!text-[8px] !px-1.5">{i.artist}</Badge>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="text-[10px] font-mono text-muted-foreground">{i.sku}</div>
                        <Badge variant="outline" className="!text-[8px] !px-1.5 mt-0.5">
                          {i.size === "Yok" ? "Standart" : i.size}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="text-right">
                            <div className={cn("text-xs font-bold tabular-nums",
                              i.status === "tükendi" ? "text-destructive" :
                              i.status === "kritik" ? "text-neon-pink" :
                              i.status === "düşük" ? "text-neon-orange" : ""
                            )}>
                              {i.type === "Sample Pack" ? "∞" : i.stock.toLocaleString("tr-TR")}
                            </div>
                            {i.target > 0 && <div className="text-[9px] text-muted-foreground font-mono">/ {i.target}</div>}
                          </div>
                          <div className="w-16 hidden xl:block">
                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div className={cn("h-full rounded-full",
                                i.status === "tükendi" ? "bg-destructive" :
                                i.status === "kritik" ? "bg-neon-pink" :
                                i.status === "düşük" ? "bg-neon-orange" : "bg-gradient-to-r from-neon-green to-primary"
                              )} style={{ width: `${i.type === "Sample Pack" ? 100 : pct}%` }} />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell text-right">
                        <div className="text-xs font-semibold tabular-nums">{(i.moSold ?? 0).toLocaleString("tr-TR")} satış</div>
                        <div className="text-[10px] text-neon-green tabular-nums">{formatPrice(i.moRevenue ?? 0, "TRY")}</div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="text-xs font-bold tabular-nums">{formatPrice(i.price, "TRY")}</div>
                        <div className="text-[9px] text-muted-foreground tabular-nums">
                          Maliyet {formatPrice(i.cost, "TRY")}
                          <span className="ml-1 text-neon-green font-semibold">
                            {i.cost > 0 ? `+${Math.round((i.price - i.cost) / i.cost * 100)}%` : "∞"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Yan panel */}
        <div className="space-y-4">
          {/* Yeniden sipariş */}
          <Card className="p-4 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-neon-orange to-destructive opacity-10 blur-3xl" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neon-orange" />
                <div className="text-sm font-bold">Yeniden Sipariş Görevleri</div>
              </div>
              <Badge variant="warning" className="!text-[9px]">{restock.length} ürün</Badge>
            </div>
            <div className="space-y-2">
              {restock.slice(0, 6).map(i => (
                <div key={i.id} className="p-2 rounded-lg border border-white/5 hover:border-white/10 transition-colors bg-white/[0.02]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn("w-7 h-7 rounded-md bg-gradient-to-br flex items-center justify-center shrink-0", i.imageAccent)}>
                        <i.Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold truncate">{i.name}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">{i.sku}</div>
                      </div>
                    </div>
                    <Badge variant="muted" className={cn("!text-[8px] !px-1.5 shrink-0", STATUS_STYLE[i.status])}>
                      {i.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="text-[10px] tabular-nums">
                      <span className={cn(i.stock === 0 ? "text-destructive" : i.stock <= i.reorder / 2 ? "text-neon-pink" : "text-neon-orange", "font-bold")}>
                        {i.stock} adet
                      </span>
                      <span className="text-muted-foreground"> / hedef {i.target}</span>
                    </div>
                    <Button size="xs" variant="outline" className="!text-[9px] !px-2">
                      Sipariş <PlusCircle className="w-2 h-2 ml-0.5" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="xs" className="w-full !text-[10px] mt-1">
                Tümünü Gör ({restock.length}) <ArrowRight className="w-2.5 h-2.5 ml-1" />
              </Button>
            </div>
          </Card>

          {/* Çok satanlar */}
          <Card className="p-4 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-neon-purple opacity-10 blur-3xl" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <div className="text-sm font-bold">En Çok Satanlar</div>
              </div>
              <Badge variant="muted" className="!text-[9px]">Aylık</Badge>
            </div>
            <div className="space-y-2">
              {top.map((i, idx) => {
                const max = top[0].moRevenue ?? 1;
                const w = Math.round((i.moRevenue ?? 0) / max * 100);
                return (
                  <div key={i.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[9px] font-bold w-4 tabular-nums text-muted-foreground">{idx + 1}.</span>
                        <div className={cn("w-5 h-5 rounded-md bg-gradient-to-br flex items-center justify-center shrink-0", i.imageAccent)}>
                          <i.Icon className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="font-semibold truncate">{i.name}</span>
                      </div>
                      <span className="tabular-nums font-bold text-neon-green">{formatPrice(i.moRevenue ?? 0, "TRY")}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className={cn("h-full rounded-full bg-gradient-to-r", i.imageAccent)} style={{ width: `${w}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Kategori dökümü */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-secondary" />
                <div className="text-sm font-bold">Kategori Dökümü</div>
              </div>
            </div>
            <div className="space-y-2.5">
              {Object.entries(CAT_STYLE).map(([c, s]) => {
                const items = ITEMS.filter(i => i.category === c);
                const val = items.reduce((a, b) => a + b.stock * b.cost, 0);
                const tot = ITEMS.reduce((a, b) => a + b.stock * b.cost, 0);
                const p = Math.round(val / tot * 100);
                return (
                  <div key={c} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <Badge variant="muted" className={cn("!text-[8px] !px-1.5", s)}>{c}</Badge>
                      <span className="font-bold tabular-nums">{p}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={cn("h-full rounded-full bg-gradient-to-r",
                        c === "Fiziksel Medya" ? "from-primary to-neon-purple" :
                        c === "Merch" ? "from-neon-cyan to-secondary" :
                        c === "Aksesuar" ? "from-neon-green to-accent" :
                        "from-neon-orange to-neon-pink"
                      )} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
