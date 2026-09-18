"use client";

import * as React from "react";
import Link from "next/link";
import {
  Receipt,
  PlusCircle,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  CalendarClock,
  Disc3,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  UploadCloud,
  CreditCard,
  Landmark,
  CircleDollarSign,
  Sparkles,
  PieChart,
  MoreHorizontal,
  Eye,
  FileText,
  Repeat2,
  Users,
  BarChart3,
  CalendarRange,
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
  FINANCE_TYPE_LABELS,
  FINANCE_CATEGORY_LABELS,
  FINANCE_CATEGORIES_INCOME,
  FINANCE_CATEGORIES_EXPENSE,
  type FinanceType,
  BEAT_TYPE_LABELS,
  type BeatType,
  ROLE_COLORS,
  ROLE_LABELS,
  type AppRole,
} from "@/lib/constants";
import { cn, formatDate, formatPrice, timeAgo } from "@/lib/utils";
import { useSupabaseQuery } from "@/lib/hooks/use-supabase-query";

type TxCategory = (typeof FINANCE_CATEGORIES_INCOME)[number] | (typeof FINANCE_CATEGORIES_EXPENSE)[number];

const INCOME_CATS = FINANCE_CATEGORIES_INCOME as TxCategory[];
const EXPENSE_CATS = FINANCE_CATEGORIES_EXPENSE as TxCategory[];

const CAT_ACCENT: Record<string, string> = {
  beat_sale: "from-primary to-neon-purple",
  studio_rent: "from-neon-cyan to-secondary",
  stream_royalty: "from-neon-green to-accent",
  performance: "from-neon-pink to-destructive",
  other_income: "from-muted to-muted-foreground",
  equipment: "from-neon-orange to-neon-pink",
  plugins: "from-neon-cyan to-primary",
  studio_rent_pay: "from-neon-purple to-secondary",
  marketing: "from-neon-pink to-neon-purple",
  mix_master_pay: "from-neon-orange to-primary",
  utilities: "from-muted to-muted-foreground",
  team_salary: "from-primary to-neon-cyan",
  other_expense: "from-muted-foreground to-muted",
};

type TxStatus = "paid" | "pending" | "overdue" | "draft";
type PaymentMethod = "bank" | "credit_card" | "stripe" | "cash" | "eft" | "papara";

const PM_LABELS: Record<PaymentMethod, string> = {
  bank: "Banka",
  credit_card: "Kredi Kartı",
  stripe: "Stripe",
  cash: "Nakit",
  eft: "EFT / Havale",
  papara: "Papara",
};

const PM_ICONS: Record<PaymentMethod, any> = {
  bank: Landmark,
  credit_card: CreditCard,
  stripe: CircleDollarSign,
  cash: Wallet,
  eft: Landmark,
  papara: Sparkles,
};

interface Tx {
  id: string;
  type: FinanceType;
  category: TxCategory;
  amount: number;
  currency: "TRY" | "USD" | "EUR";
  date: string;
  title: string;
  description?: string;
  status: TxStatus;
  paymentMethod: PaymentMethod;
  linkedBeat?: { id: string; title: string; type: BeatType };
  related?: { name: string; role: AppRole };
  recurring?: { freq: "monthly" | "yearly"; next: string };
  attachments?: number;
  taxPct?: number;
}

const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const MONTHLY = [
  { m: 0, income: 78000, expense: 32000 },
  { m: 1, income: 95000, expense: 38000 },
  { m: 2, income: 120000, expense: 41000 },
  { m: 3, income: 112000, expense: 46000 },
  { m: 4, income: 145000, expense: 52000 },
  { m: 5, income: 168000, expense: 58000 },
  { m: 6, income: 182000, expense: 61000 },
  { m: 7, income: 175000, expense: 59000 },
  { m: 8, income: 210000, expense: 72000 },
  { m: 9, income: 198000, expense: 68000 },
  { m: 10, income: 225000, expense: 71000 },
  { m: 11, income: 248000, expense: 76000 },
];

const TRANSACTIONS: Tx[] = [
  {
    id: "tx1", type: "income", category: "stream_royalty",
    amount: 42500, currency: "TRY", date: "2026-09-17",
    title: "Spotify + Apple Music Ağustos Ödemesi",
    description: "12 parça · 482.340 stream · DMC oranları",
    status: "paid", paymentMethod: "stripe",
    attachments: 3, taxPct: 20,
  },
  {
    id: "tx2", type: "income", category: "beat_sale",
    amount: 18500, currency: "TRY", date: "2026-09-15",
    title: "Güneş Doğarken — Exclusive Lisans",
    status: "paid", paymentMethod: "eft",
    linkedBeat: { id: "2", title: "Güneş Doğarken", type: "for_sale" },
    related: { name: "Zeynep Kara", role: "vocalist" },
    attachments: 2, taxPct: 10,
  },
  {
    id: "tx3", type: "expense", category: "mix_master_pay",
    amount: -16000, currency: "TRY", date: "2026-09-18",
    title: "Can Demir — Derin Sular Mix + Master",
    description: "6 saat mix · 3 saat mastering · SSL konsol",
    status: "pending", paymentMethod: "bank",
    linkedBeat: { id: "4", title: "Derin Sular", type: "completed" },
    related: { name: "Can Demir", role: "engineer" },
    attachments: 1,
  },
  {
    id: "tx4", type: "income", category: "studio_rent",
    amount: 22500, currency: "TRY", date: "2026-09-14",
    title: "Misafir Sanatçı — 3 Gün Stüdyo Kirası",
    description: "Stüdyo A + Kontrol Odası · 18 saat",
    status: "paid", paymentMethod: "eft",
    related: { name: "Selin Öztürk", role: "admin" },
    recurring: { freq: "monthly", next: "2026-10-14" },
  },
  {
    id: "tx5", type: "expense", category: "plugins",
    amount: -3450, currency: "USD", date: "2026-09-12",
    title: "FabFilter Pro Bundle + SSL Native (sınırsız)",
    status: "paid", paymentMethod: "credit_card",
    attachments: 1,
  },
  {
    id: "tx6", type: "expense", category: "team_salary",
    amount: -48000, currency: "TRY", date: "2026-09-01",
    title: "Ağustos Maaşları — Ekip (4 kişi)",
    status: "paid", paymentMethod: "eft",
    related: { name: "Selin Öztürk", role: "admin" },
    attachments: 5,
  },
  {
    id: "tx7", type: "income", category: "performance",
    amount: 38000, currency: "TRY", date: "2026-09-20",
    title: "İstanbul Konseri — Organizasyon Ödemesi",
    description: "45 dakika sahne · Backline dahil",
    status: "pending", paymentMethod: "bank",
    attachments: 2, taxPct: 15,
  },
  {
    id: "tx8", type: "expense", category: "equipment",
    amount: -82000, currency: "TRY", date: "2026-09-08",
    title: "Neumann U87 Ai + Avalon 737sp",
    description: "ProSound Türkiye · 12 ay vade fırsatı",
    status: "pending", paymentMethod: "credit_card",
    recurring: { freq: "monthly", next: "2026-10-08" },
    attachments: 4,
  },
  {
    id: "tx9", type: "income", category: "beat_sale",
    amount: 9500, currency: "TRY", date: "2026-09-11",
    title: "Kozmik Dans — Basic Lease",
    status: "paid", paymentMethod: "papara",
    linkedBeat: { id: "5", title: "Kozmik Dans", type: "available" },
    related: { name: "Mert Yılmaz", role: "producer" },
  },
  {
    id: "tx10", type: "expense", category: "marketing",
    amount: -12500, currency: "TRY", date: "2026-09-05",
    title: "Instagram + TikTok Reklam Kampanyası",
    description: "Midnight Vibes teaser · 7 gün · hedef 500K görüntülenme",
    status: "paid", paymentMethod: "credit_card",
    attachments: 2,
  },
  {
    id: "tx11", type: "income", category: "other_income",
    amount: 6000, currency: "TRY", date: "2026-09-09",
    title: "Sample Pack Satışı — Arnix Signature 808s",
    status: "paid", paymentMethod: "stripe",
  },
  {
    id: "tx12", type: "expense", category: "studio_rent_pay",
    amount: -25000, currency: "TRY", date: "2026-09-01",
    title: "Aylık Stüdyo Kirası (Eylül)",
    description: "Adres: Beşiktaş · 180 m² + Kontrol Odası",
    status: "overdue", paymentMethod: "eft",
    recurring: { freq: "monthly", next: "2026-10-01" },
  },
  {
    id: "tx13", type: "expense", category: "utilities",
    amount: -3800, currency: "TRY", date: "2026-09-03",
    title: "Elektrik + Internet + Doğalgaz",
    status: "paid", paymentMethod: "bank",
    recurring: { freq: "monthly", next: "2026-10-03" },
  },
  {
    id: "tx14", type: "income", category: "stream_royalty",
    amount: 8800, currency: "EUR", date: "2026-09-16",
    title: "Spotify AB Region Ağustos",
    status: "paid", paymentMethod: "stripe",
  },
  {
    id: "tx15", type: "expense", category: "other_expense",
    amount: -2400, currency: "TRY", date: "2026-09-07",
    title: "Stüdyo Temizlik & Catering",
    status: "paid", paymentMethod: "cash",
  },
];

const _calcIncome = (txs: Tx[]) => txs.filter(t => t.type === "income").reduce((a, b) => a + Math.abs(b.amount) * (b.currency === "USD" ? 35 : b.currency === "EUR" ? 40 : 1), 0);
const _calcExpense = (txs: Tx[]) => txs.filter(t => t.type === "expense").reduce((a, b) => a + Math.abs(b.amount) * (b.currency === "USD" ? 35 : b.currency === "EUR" ? 40 : 1), 0);

const STATUS_STYLE: Record<TxStatus, string> = {
  paid: "bg-neon-green/20 text-neon-green border-neon-green/30",
  pending: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  overdue: "bg-destructive/20 text-destructive border-destructive/30",
  draft: "bg-muted text-muted-foreground border-white/5",
};
const STATUS_LABELS: Record<TxStatus, string> = {
  paid: "Ödendi",
  pending: "Bekliyor",
  overdue: "Gecikti",
  draft: "Taslak",
};
const STATUS_ICONS: Record<TxStatus, any> = {
  paid: CheckCircle2,
  pending: Clock3,
  overdue: AlertTriangle,
  draft: FileText,
};

export default function FinancesPage() {
  const { data: transactions, loading } = useSupabaseQuery<Tx>("finances", {
    select: "*",
    order: { field: "date", ascending: false },
    fallback: TRANSACTIONS,
    enabled: typeof window !== "undefined",
  });
  const [range, setRange] = React.useState("this_year");
  const [account, setAccount] = React.useState("all");
  const [member, setMember] = React.useState("all");
  const [cat, setCat] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");

  const TOTAL_INCOME = _calcIncome(transactions ?? TRANSACTIONS);
  const TOTAL_EXPENSE = _calcExpense(transactions ?? TRANSACTIONS);
  const TOTAL_NET = TOTAL_INCOME - TOTAL_EXPENSE;
  const PENDING = (transactions ?? TRANSACTIONS).filter(t => t.status === "pending" || t.status === "overdue").length;

  const filtered = transactions?.filter(t => {
    if (range !== "all" && t.date) {
      const tDate = new Date(t.date);
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      if (range === "this_year" && tDate.getFullYear() !== now.getFullYear()) return false;
      if (range === "this_quarter" && tDate < startOfQuarter) return false;
      if (range === "this_month" && tDate < startOfMonth) return false;
      if (range === "last_year" && tDate.getFullYear() !== now.getFullYear() - 1) return false;
    }
    if (account !== "all" && t.paymentMethod !== account) return false;
    if (member !== "all" && t.related?.name !== member) return false;
    if (cat !== "all" && t.category !== cat) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) ?? TRANSACTIONS.filter(t => {
    if (range !== "all" && t.date) {
      const tDate = new Date(t.date);
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      if (range === "this_year" && tDate.getFullYear() !== now.getFullYear()) return false;
      if (range === "this_quarter" && tDate < startOfQuarter) return false;
      if (range === "this_month" && tDate < startOfMonth) return false;
      if (range === "last_year" && tDate.getFullYear() !== now.getFullYear() - 1) return false;
    }
    if (account !== "all" && t.paymentMethod !== account) return false;
    if (member !== "all" && t.related?.name !== member) return false;
    if (cat !== "all" && t.category !== cat) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Category breakdown
  const incomeBreakdown = INCOME_CATS.map(c => ({
    category: c,
    amount: (transactions?.filter(t => t.type === "income" && t.category === c)?.reduce((a, b) => a + Math.abs(b.amount), 0) ?? TRANSACTIONS.filter(t => t.type === "income" && t.category === c).reduce((a, b) => a + Math.abs(b.amount), 0)),
  })).filter(x => x.amount > 0);

  const expenseBreakdown = EXPENSE_CATS.map(c => ({
    category: c,
    amount: (transactions?.filter(t => t.type === "expense" && t.category === c)?.reduce((a, b) => a + Math.abs(b.amount), 0) ?? TRANSACTIONS.filter(t => t.type === "expense" && t.category === c).reduce((a, b) => a + Math.abs(b.amount), 0)),
  })).filter(x => x.amount > 0);

  const totalIncomeCat = incomeBreakdown.reduce((a, b) => a + b.amount, 0);
  const totalExpenseCat = expenseBreakdown.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" className="!px-2 !text-[10px] tracking-wider">
              <Receipt className="w-3 h-3 mr-1.5" />
              FINANCE CENTER
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {(transactions?.length ?? TRANSACTIONS.length)} işlem · {(transactions?.filter(t => t.status !== "paid")?.length ?? TRANSACTIONS.filter(t => t.status !== "paid").length)} bekliyor
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Muhasebe & Gelir-Gider</h1>
          <p className="text-muted-foreground">Beat satışları, stream ödemeleri, stüdyo kiralama, ekipman giderleri — hepsi bir yerde</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Rapor Dışa Aktar
          </Button>
          <Button variant="outline" size="sm">
            <UploadCloud className="w-4 h-4 mr-1.5" />
            Fatura Yükle
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Yeni İşlem
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-neon-green to-accent opacity-15 blur-3xl group-hover:opacity-25 transition-opacity" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Toplam Gelir</Badge>
              <div className="w-8 h-8 rounded-lg bg-neon-green/15 text-neon-green flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold tabular-nums mb-1 text-neon-green">
              {formatPrice(TOTAL_INCOME, "TRY")}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Badge variant="success" className="!text-[8px] !px-1.5">
                <ArrowUpRight className="w-2 h-2 mr-0.5" />
                %24.3
              </Badge>
              geçen yıl aynı döneme göre
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-destructive to-neon-orange opacity-15 blur-3xl group-hover:opacity-25 transition-opacity" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Toplam Gider</Badge>
              <div className="w-8 h-8 rounded-lg bg-destructive/15 text-destructive flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold tabular-nums mb-1 text-destructive">
              {formatPrice(TOTAL_EXPENSE, "TRY")}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Badge variant="destructive" className="!text-[8px] !px-1.5">
                <ArrowUpRight className="w-2 h-2 mr-0.5" />
                %18.7
              </Badge>
              geçen yıl aynı döneme göre
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 blur-3xl group-hover:opacity-30 transition-opacity" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Net Kâr</Badge>
              <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className={cn("text-3xl font-bold tabular-nums mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent")}>
              {formatPrice(TOTAL_NET, "TRY")}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Kâr marjı: <span className="font-semibold text-foreground">{Math.round((TOTAL_NET / TOTAL_INCOME) * 100)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-neon-orange to-neon-pink opacity-15 blur-3xl group-hover:opacity-25 transition-opacity" />
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="muted" className="!text-[10px] !px-2">Bekleyen</Badge>
              <div className="w-8 h-8 rounded-lg bg-neon-orange/15 text-neon-orange flex items-center justify-center">
                <CalendarClock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold tabular-nums mb-1 text-neon-orange">
              {(transactions?.filter(t => t.status === "pending" || t.status === "overdue")?.length ?? TRANSACTIONS.filter(t => t.status === "pending" || t.status === "overdue").length)}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {formatPrice(
                (transactions?.filter(t => t.status === "pending" || t.status === "overdue")?.reduce((a, b) => a + Math.abs(b.amount) * (b.currency === "USD" ? 35 : b.currency === "EUR" ? 40 : 1), 0) ?? TRANSACTIONS.filter(t => t.status === "pending" || t.status === "overdue").reduce((a, b) => a + Math.abs(b.amount) * (b.currency === "USD" ? 35 : b.currency === "EUR" ? 40 : 1), 0)), "TRY"
              )} · {(transactions?.filter(t => t.status === "overdue")?.length ?? TRANSACTIONS.filter(t => t.status === "overdue").length)} gecikmiş
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + quick */}
      <Card className="p-4">
        <CardContent className="p-0 space-y-3">
          <div className="grid md:grid-cols-6 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="İşlem ara — fatura, kategori, başlık..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger>
                <CalendarRange className="w-3.5 h-3.5 mr-1.5 text-muted-foreground inline" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_year">Bu Yıl</SelectItem>
                <SelectItem value="this_quarter">Bu Çeyrek</SelectItem>
                <SelectItem value="this_month">Bu Ay</SelectItem>
                <SelectItem value="last_year">Geçen Yıl</SelectItem>
                <SelectItem value="custom">Özel Aralık</SelectItem>
              </SelectContent>
            </Select>
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger>
                <Wallet className="w-3.5 h-3.5 mr-1.5 text-muted-foreground inline" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Hesaplar</SelectItem>
                <SelectItem value="bank">Ziraat Bankası</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="papara">Papara</SelectItem>
                <SelectItem value="cash">Nakit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={member} onValueChange={setMember}>
              <SelectTrigger>
                <Users className="w-3.5 h-3.5 mr-1.5 text-muted-foreground inline" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kişiler</SelectItem>
                <SelectItem value="mert">Mert Yılmaz (Yapımcı)</SelectItem>
                <SelectItem value="zeynep">Zeynep Kara (Sanatçı)</SelectItem>
                <SelectItem value="can">Can Demir (Mühendis)</SelectItem>
                <SelectItem value="selin">Selin Öztürk (Yönetici)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="flex-1 !text-[11px]">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                Filtre
              </Button>
              <Button variant="outline" size="iconSm">
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Accounts */}
          <div className="grid md:grid-cols-4 gap-2 pt-1">
            {[
              { name: "Ziraat Bankası", no: "TR98 0001 0012 3456 7890 1234 56", bal: 342_500, cur: "TRY", color: "from-primary to-neon-purple", icon: Landmark, key: "bank" },
              { name: "Stripe", no: "acct_1N4xqLJk8m", bal: 18_320, cur: "USD", color: "from-neon-purple to-neon-cyan", icon: CircleDollarSign, key: "stripe" },
              { name: "Papara", no: "555 ** ** 432", bal: 42_800, cur: "TRY", color: "from-neon-pink to-neon-orange", icon: Sparkles, key: "papara" },
              { name: "Nakit Kasa", no: "Petty Cash", bal: 15_250, cur: "TRY", color: "from-neon-green to-accent", icon: Wallet, key: "cash" },
            ].map(acc => {
              const Icon = acc.icon;
              return (
                <div key={acc.key} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-md", acc.color)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <Badge variant="muted" className="!text-[8px] !px-1.5">{acc.cur}</Badge>
                  </div>
                  <div className="text-lg font-bold tabular-nums mb-0.5">
                    {acc.name === "Stripe" ? formatPrice(acc.bal, "USD") : formatPrice(acc.bal, "TRY")}
                  </div>
                  <div className="text-[11px] font-semibold truncate">{acc.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate">{acc.no}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* CHART + TRANSACTIONS */}
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <div className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Aylık Gelir & Gider Akışı
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                2026 · Genel Muhasebe Özeti
              </div>
            </div>
            <Tabs defaultValue="chart" className="w-auto">
              <TabsList className="!p-0.5">
                <TabsTrigger value="chart" className="!text-[11px] !px-3 !py-1">Çubuk</TabsTrigger>
                <TabsTrigger value="line" className="!text-[11px] !px-3 !py-1">Çizgi</TabsTrigger>
                <TabsTrigger value="quarter" className="!text-[11px] !px-3 !py-1">Çeyrek</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Bar chart */}
          <div className="h-72 grid grid-cols-[auto_repeat(12,1fr)] gap-2 items-end mb-4">
            <div className="flex flex-col justify-between items-end pr-3 py-1 text-[9px] font-mono text-muted-foreground">
              {[250, 200, 150, 100, 50, 0].map(v => (
                <div key={v} className="tabular-nums">₺{v}K</div>
              ))}
            </div>
            {MONTHLY.map(m => {
              const max = 250000;
              const ih = Math.max(4, Math.round((m.income / max) * 260));
              const eh = Math.max(4, Math.round((m.expense / max) * 260));
              return (
                <div key={m.m} className="flex items-end justify-center gap-1 h-full relative group">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    <div className="p-2.5 rounded-xl bg-card border border-primary/20 shadow-2xl text-[10px] space-y-1 backdrop-blur-md">
                      <div className="font-semibold text-sm">{MONTHS[m.m]}</div>
                      <div className="flex items-center gap-1.5"><TrendingUp className="w-2.5 h-2.5 text-neon-green" /><span>Gelir: {formatPrice(m.income, "TRY")}</span></div>
                      <div className="flex items-center gap-1.5"><TrendingDown className="w-2.5 h-2.5 text-destructive" /><span>Gider: {formatPrice(m.expense, "TRY")}</span></div>
                      <div className="pt-1 border-t border-white/10 mt-1">
                        <span className="text-primary font-semibold">Net: {formatPrice(m.income - m.expense, "TRY")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 items-center h-full justify-end">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary to-neon-purple hover:from-primary/90 hover:to-neon-purple/90 transition-all shadow-[0_-4px_20px_-5px_hsl(var(--primary)/0.3)]"
                      style={{ height: `${ih}px` }}
                    />
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-destructive/80 to-neon-orange/80 hover:from-destructive hover:to-neon-orange transition-all opacity-90"
                      style={{ height: `${eh}px` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* X axis */}
          <div className="grid grid-cols-[auto_repeat(12,1fr)] gap-2 text-[10px] text-muted-foreground font-mono">
            <div />
            {MONTHS.map((m, i) => (
              <div key={m} className={cn(
                "text-center",
                i === 8 && "text-primary font-bold"
              )}>{m}</div>
            ))}
          </div>

          {/* Legend + Aggregate */}
          <div className="flex items-center justify-between mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex-wrap gap-3">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-gradient-to-t from-primary to-neon-purple" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Gelir</div>
                  <div className="font-bold tabular-nums">{formatPrice(MONTHLY.reduce((a, b) => a + b.income, 0), "TRY")}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-gradient-to-t from-destructive/80 to-neon-orange/80" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Gider</div>
                  <div className="font-bold tabular-nums text-destructive">{formatPrice(MONTHLY.reduce((a, b) => a + b.expense, 0), "TRY")}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-gradient-to-t from-neon-green to-accent" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Net Kâr</div>
                  <div className="font-bold tabular-nums text-neon-green">{formatPrice(MONTHLY.reduce((a, b) => a + (b.income - b.expense), 0), "TRY")}</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="success" className="!text-[9px] !px-2 mb-1">
                <Repeat2 className="w-2 h-2 mr-1" />
                ABONELİK
              </Badge>
              <div className="font-mono font-semibold text-sm">₺25.000 / ay sabit gider</div>
            </div>
          </div>

          {/* Transaction table */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                Son İşlemler
              </div>
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger className="w-[180px] !h-8 !text-[11px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  <div className="p-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-white/5 mb-1">Gelir</div>
                  {INCOME_CATS.map(c => <SelectItem key={c} value={c}>{FINANCE_CATEGORY_LABELS[c]}</SelectItem>)}
                  <div className="p-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-white/5 my-1">Gider</div>
                  {EXPENSE_CATS.map(c => <SelectItem key={c} value={c}>{FINANCE_CATEGORY_LABELS[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground w-[40%]">İşlem</th>
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden md:table-cell">Tarih</th>
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground hidden lg:table-cell">Yöntem</th>
                    <th className="text-left p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Durum</th>
                    <th className="text-right p-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const Icon = t.type === "income" ? ArrowUpRight : ArrowDownRight;
                    const StatIcon = STATUS_ICONS[t.status];
                    const PMIcon = PM_ICONS[t.paymentMethod];
                    return (
                      <tr key={t.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <td className="p-3">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                              t.type === "income"
                                ? "bg-gradient-to-br from-neon-green/20 to-accent/10 text-neon-green"
                                : "bg-gradient-to-br from-destructive/15 to-neon-orange/10 text-destructive"
                            )}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <div className="text-sm font-semibold truncate">{t.title}</div>
                                {t.recurring && (
                                  <Badge variant="info" className="!text-[8px] !px-1.5">
                                    <Repeat2 className="w-1.5 h-1.5 mr-0.5" />
                                    {t.recurring.freq === "monthly" ? "Aylık" : "Yıllık"}
                                  </Badge>
                                )}
                                {t.taxPct && (
                                  <Badge variant="muted" className="!text-[8px] !px-1.5">KDV %{t.taxPct}</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                <Badge variant="outline" className={cn("!text-[9px] !px-1.5 !bg-white/[0.02] border-white/5")}>
                                  <span className={cn("w-1.5 h-1.5 rounded-full mr-1 bg-gradient-to-r", CAT_ACCENT[t.category])} />
                                  {FINANCE_CATEGORY_LABELS[t.category]}
                                </Badge>
                                {t.linkedBeat && (
                                  <Link href={`/beats/${t.linkedBeat.id}`} className="text-[10px] text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                                    <Disc3 className="w-2.5 h-2.5" />
                                    <span className="underline underline-offset-2">{t.linkedBeat.title}</span>
                                  </Link>
                                )}
                                {t.related && (
                                  <div className="inline-flex items-center gap-1">
                                    <Avatar name={t.related.name} size="sm" />
                                    <span className="text-[10px] text-muted-foreground">{t.related.name}</span>
                                  </div>
                                )}
                                {t.attachments && (
                                  <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                                    <FileText className="w-2.5 h-2.5" />
                                    {t.attachments} ek
                                  </span>
                                )}
                              </div>
                              {t.description && (
                                <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{t.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <div className="text-xs font-mono">{formatDate(t.date)}</div>
                          {t.recurring && (
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              Sonraki: {formatDate(t.recurring.next)}
                            </div>
                          )}
                        </td>
                        <td className="p-3 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-center">
                              <PMIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs">{PM_LABELS[t.paymentMethod]}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="muted" className={cn("!text-[9px] !px-1.5", STATUS_STYLE[t.status])}>
                            <StatIcon className="w-2 h-2 mr-1" />
                            {STATUS_LABELS[t.status]}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <div className={cn(
                            "font-bold tabular-nums text-sm",
                            t.type === "income" ? "text-neon-green" : "text-destructive"
                          )}>
                            {t.type === "income" ? "+" : "−"} {t.currency === "USD" ? "$" : t.currency === "EUR" ? "€" : ""}
                            {formatPrice(Math.abs(t.amount), t.currency)}
                          </div>
                          <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity mt-1 ml-auto">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Breakdown + invoices */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                Kategori Dökümü
              </div>
              <Tabs defaultValue="income" className="w-auto">
                <TabsList className="!p-0.5">
                  <TabsTrigger value="income" className="!text-[10px] !px-2.5 !py-0.5">Gelir</TabsTrigger>
                  <TabsTrigger value="expense" className="!text-[10px] !px-2.5 !py-0.5">Gider</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <TabsContent value="income">
              <div className="space-y-3">
                {incomeBreakdown.sort((a, b) => b.amount - a.amount).map(row => {
                  const pct = Math.round((row.amount / totalIncomeCat) * 100);
                  return (
                    <div key={row.category}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full bg-gradient-to-r", CAT_ACCENT[row.category])} />
                          <span className="text-xs font-medium">{FINANCE_CATEGORY_LABELS[row.category]}</span>
                        </div>
                        <div className="text-xs font-mono font-semibold tabular-nums text-neon-green">
                          {formatPrice(row.amount, "TRY")} <span className="text-muted-foreground text-[9px]">%{pct}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r", CAT_ACCENT[row.category])}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Toplam</span>
                  <span className="font-mono font-bold text-neon-green">{formatPrice(totalIncomeCat, "TRY")}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="expense">
              <div className="space-y-3">
                {expenseBreakdown.sort((a, b) => b.amount - a.amount).map(row => {
                  const pct = Math.round((row.amount / totalExpenseCat) * 100);
                  return (
                    <div key={row.category}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full bg-gradient-to-r", CAT_ACCENT[row.category])} />
                          <span className="text-xs font-medium">{FINANCE_CATEGORY_LABELS[row.category]}</span>
                        </div>
                        <div className="text-xs font-mono font-semibold tabular-nums text-destructive">
                          {formatPrice(row.amount, "TRY")} <span className="text-muted-foreground text-[9px]">%{pct}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r", CAT_ACCENT[row.category])}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Toplam</span>
                  <span className="font-mono font-bold text-destructive">{formatPrice(totalExpenseCat, "TRY")}</span>
                </div>
              </div>
            </TabsContent>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-neon-orange" />
                Bekleyen Faturalar & Ödemeler
              </div>
              <Badge variant="warning" className="!text-[9px] !px-1.5">
                {TRANSACTIONS.filter(t => t.status === "pending" || t.status === "overdue").length} Öğe
              </Badge>
            </div>
            <div className="space-y-2">
              {TRANSACTIONS.filter(t => t.status === "pending" || t.status === "overdue").map(t => {
                const StatIcon = STATUS_ICONS[t.status];
                const overdue = t.status === "overdue";
                return (
                  <div key={t.id} className={cn(
                    "p-3 rounded-xl border flex items-start gap-3 transition-all hover:bg-white/[0.02]",
                    overdue ? "border-destructive/30 bg-destructive/[0.03]" : "border-white/5 bg-white/[0.01]"
                  )}>
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      overdue ? "bg-destructive/15 text-destructive" : "bg-neon-orange/15 text-neon-orange"
                    )}>
                      <StatIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="text-xs font-semibold truncate">{t.title}</div>
                        {overdue && (
                          <Badge variant="destructive" className="!text-[8px] !px-1.5">GECİKTİ</Badge>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-2 flex-wrap">
                        <span><CalendarClock className="inline w-2.5 h-2.5 mr-0.5" />{formatDate(t.date)}</span>
                        {t.recurring && (
                          <span><Repeat2 className="inline w-2.5 h-2.5 mr-0.5" />Aylık otomatik</span>
                        )}
                        <span><Eye className="inline w-2.5 h-2.5 mr-0.5" />{FINANCE_CATEGORY_LABELS[t.category]}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={cn("font-mono font-bold text-sm",
                        t.type === "income" ? "text-neon-green" : "text-destructive"
                      )}>
                        {t.type === "income" ? "+" : "−"}{formatPrice(Math.abs(t.amount), t.currency)}
                      </div>
                      <div className="flex items-center gap-1">
                        {overdue && (
                          <Button size="xs" variant="destructive" className="!text-[9px] !h-6 !px-2">
                            Şimdi Öde
                          </Button>
                        )}
                        {!overdue && t.type === "income" && (
                          <Button size="xs" variant="success" className="!text-[9px] !h-6 !px-2">
                            Hatırlat
                          </Button>
                        )}
                        <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-4">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-primary" />
              Hızlı İşlemler
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: UploadCloud, label: "Fatura Kes", act: "default" as const },
                { icon: Download, label: "Ödeme Kaydet", act: "outline" as const },
                { icon: Repeat2, label: "Abonelik Ekle", act: "outline" as const },
                { icon: FileText, label: "Fiş Yükle", act: "outline" as const },
              ].map((a, i) => {
                const Icon = a.icon;
                return (
                  <Button key={i} variant={a.act} size="sm" className="!h-auto !py-2.5 flex-col gap-1">
                    <Icon className="w-4 h-4" />
                    <span className="!text-[10px]">{a.label}</span>
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
