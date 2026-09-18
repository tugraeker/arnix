"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckSquare,
  PlusCircle,
  Filter,
  SortDesc,
  Users,
  CalendarClock,
  Flag,
  Circle,
  Clock,
  Flame,
  CheckCircle2,
  Search,
  Disc3,
  MoreHorizontal,
  GripVertical,
  ChevronDown,
  ListTodo,
  LayoutGrid,
  CalendarDays,
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
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  type TaskStatus,
  type TaskPriority,
  ROLE_COLORS,
  ROLE_LABELS,
  type AppRole,
  type BeatType,
  BEAT_TYPE_LABELS,
  SPLIT_ROLE_LABELS,
  type SplitRole,
} from "@/lib/constants";
import { cn, formatDate, timeAgo, formatBytes } from "@/lib/utils";
import { useSupabaseQuery } from "@/lib/hooks/use-supabase-query";

const FALLBACK_TASKS = [
  {
    id: "t1",
    title: "Midnight Vibes final mix revizyonu — Kick yan effect kontrolü",
    description: "42. saniyedeki yan effect çok önde, biraz geri çek. Kick'in transient'ını koru.",
    status: "in_progress",
    priority: "urgent",
    assignee: { name: "Can Demir", role: "engineer" },
    beat: { id: "1", title: "Midnight Vibes", type: "mix_pending" },
    dueDate: "2026-09-19",
    tags: ["mix", "revizyon"],
    orderIndex: 0,
    subtasksDone: 2,
    subtasksTotal: 5,
    comments: 4,
    createdAt: "2026-09-17T09:15:00Z",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
  },
  {
    id: "t2",
    title: "Derin Sular split sheet oluştur",
    description: "Üyelerle toplantı yaptıktan sonra oranları kesinleştir.",
    status: "todo",
    priority: "high",
    assignee: { name: "Mert Yılmaz", role: "producer" },
    beat: { id: "4", title: "Derin Sular", type: "completed" },
    dueDate: "2026-09-20",
    tags: ["split", "yasal"],
    orderIndex: 1,
    comments: 2,
    createdAt: "2026-09-16T14:00:00Z",
    createdBy: { name: "Selin Öztürk", role: "admin" },
  },
  {
    id: "t3",
    title: "Yeni beat kapak görselleri 4 boyut hazırla",
    description: "Spotify Canvas, Instagram kare, SoundCloud banner, YouTube thumbnail.",
    status: "review",
    priority: "medium",
    assignee: { name: "Zeynep Kara", role: "vocalist" },
    dueDate: "2026-09-22",
    tags: ["grafik", "sosyal medya"],
    orderIndex: 0,
    attachments: 6,
    comments: 1,
    createdAt: "2026-09-15T11:30:00Z",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
  },
  {
    id: "t4",
    title: "Preset klasörünü düzenle (Serum)",
    description: "Kırmızı klasör: Trap / Mavi: R&B / Yeşil: Drill. İsimlendirme standardını belirle.",
    status: "done",
    priority: "low",
    assignee: { name: "Can Demir", role: "engineer" },
    dueDate: "2026-09-15",
    tags: ["organizasyon"],
    orderIndex: 0,
    subtasksDone: 8,
    subtasksTotal: 8,
    comments: 0,
    createdAt: "2026-09-10T08:00:00Z",
    createdBy: { name: "Can Demir", role: "engineer" },
  },
  {
    id: "t5",
    title: "Vokal ad-lib ve double-track (Midnight Vibes)",
    description: "Hook sonlarına ad-lib kaydet. Double track chorus için 2 take daha.",
    status: "in_progress",
    priority: "high",
    assignee: { name: "Zeynep Kara", role: "vocalist" },
    beat: { id: "1", title: "Midnight Vibes", type: "mix_pending" },
    dueDate: "2026-09-18",
    tags: ["vokal", "kayıt"],
    orderIndex: 1,
    comments: 3,
    createdAt: "2026-09-17T18:22:00Z",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
  },
  {
    id: "t6",
    title: "Master revizyon - LUFS -14 target (Derin Sular)",
    description: "True peak -1dB. Ozone 11 Maximizer + FabFilter Pro-L 2 dene.",
    status: "todo",
    priority: "urgent",
    assignee: { name: "Can Demir", role: "engineer" },
    beat: { id: "4", title: "Derin Sular", type: "completed" },
    dueDate: "2026-09-20",
    tags: ["mastering"],
    orderIndex: 2,
    subtasksDone: 0,
    subtasksTotal: 3,
    createdAt: "2026-09-17T21:00:00Z",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
  },
  {
    id: "t7",
    title: "Güneş Doğarken R&B vokal arrangement",
    description: "Bridge kısmında vokaller kalabalıklaşmış, 1 katman düşür.",
    status: "review",
    priority: "medium",
    assignee: { name: "Ali Şahin", role: "songwriter" },
    beat: { id: "2", title: "Güneş Doğarken", type: "for_sale" },
    dueDate: "2026-09-21",
    tags: ["arrangement"],
    orderIndex: 1,
    comments: 5,
    createdAt: "2026-09-16T10:45:00Z",
    createdBy: { name: "Zeynep Kara", role: "vocalist" },
  },
  {
    id: "t8",
    title: "Neon Sokaklar yeni versiyonu — synth bass ekle",
    description: "Drop'ta 808'e ek olarak synth bass layer.",
    status: "todo",
    priority: "medium",
    assignee: { name: "Mert Yılmaz", role: "producer" },
    beat: { id: "6", title: "Neon Sokaklar", type: "demo" },
    dueDate: "2026-09-24",
    tags: ["production"],
    orderIndex: 3,
    comments: 1,
    createdAt: "2026-09-18T08:00:00Z",
    createdBy: { name: "Mert Yılmaz", role: "producer" },
  },
  {
    id: "t9",
    title: "Stüdyo mikrofon zinciri revizyonu",
    description: "Neumann U87 + Avalon 737 + 1176 setup'ını test et. Örnek vokal kaydı al.",
    status: "in_progress",
    priority: "low",
    assignee: { name: "Can Demir", role: "engineer" },
    dueDate: "2026-09-25",
    tags: ["ekipman", "test"],
    orderIndex: 2,
    attachments: 2,
    createdAt: "2026-09-14T13:00:00Z",
    createdBy: { name: "Can Demir", role: "engineer" },
  },
  {
    id: "t10",
    title: "Yayın takvimi — EP kapak görseli onayı",
    description: "Mert ve Zeynep kapak görselini onaylasın. Sonra DistroKid'a gönder.",
    status: "done",
    priority: "high",
    assignee: { name: "Selin Öztürk", role: "admin" },
    beat: { id: "4", title: "Derin Sular", type: "completed" },
    dueDate: "2026-09-14",
    tags: ["yayın", "onay"],
    orderIndex: 0,
    subtasksDone: 4,
    subtasksTotal: 4,
    comments: 7,
    createdAt: "2026-09-10T09:00:00Z",
    createdBy: { name: "Selin Öztürk", role: "admin" },
  },
  {
    id: "t11",
    title: "Kozmik Dans House remix — bass güçlendir",
    description: "Drop'taki bass sub freq 60Hz'de zayıf, boost +5dB.",
    status: "review",
    priority: "high",
    assignee: { name: "Mert Yılmaz", role: "producer" },
    beat: { id: "5", title: "Kozmik Dans", type: "available" },
    dueDate: "2026-09-23",
    tags: ["remix", "bass"],
    orderIndex: 2,
    comments: 2,
    createdAt: "2026-09-17T15:10:00Z",
    createdBy: { name: "Can Demir", role: "engineer" },
  },
];

type ProjectTask = (typeof FALLBACK_TASKS)[number];
type TaskItem = ProjectTask;

const STATUS_ICONS: Record<TaskStatus, any> = {
  todo: Circle,
  in_progress: Clock,
  review: Flame,
  done: CheckCircle2,
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "border-muted-foreground/20",
  in_progress: "border-primary/40 bg-primary/[0.02]",
  review: "border-neon-orange/30 bg-neon-orange/[0.03]",
  done: "border-neon-green/30 bg-neon-green/[0.02]",
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: "bg-destructive/20 text-destructive border-destructive/30",
  high: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  medium: "bg-secondary/20 text-secondary border-secondary/30",
  low: "bg-muted text-muted-foreground border-white/5",
};

const COLUMNS: { key: TaskStatus; accent: string; label: string }[] = [
  { key: "todo", accent: "from-muted to-muted-foreground/40", label: "Yapılacaklar" },
  { key: "in_progress", accent: "from-primary to-secondary", label: "Devam Ediyor" },
  { key: "review", accent: "from-neon-orange to-neon-pink", label: "İncelemede" },
  { key: "done", accent: "from-neon-green to-accent", label: "Tamamlandı" },
];

export default function TasksContent() {
  const [filterAssignee, setFilterAssignee] = React.useState<string>("all");
  const [filterPriority, setFilterPriority] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");

  const { data: tasks, loading, error } = useSupabaseQuery<ProjectTask>("tasks", {
    select: "*",
    order: { field: "createdAt", ascending: false },
    fallback: FALLBACK_TASKS,
    enabled: typeof window !== "undefined",
  });

  const filtered = tasks?.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterAssignee !== "all" && t.assignee?.name !== filterAssignee) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    return true;
  }) ?? FALLBACK_TASKS;

  const byStatus = (s: TaskStatus) => filtered.filter((t) => t.status === s);

  const members = Array.from(new Map((tasks ?? FALLBACK_TASKS).filter(t => t.assignee).map((t) => [t.assignee!.name, t.assignee!] as const)).values());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success" className="!px-2 !text-[10px] tracking-wider">
              <CheckSquare className="w-3 h-3 mr-1.5" />
              TASK CENTER
            </Badge>
            <Badge variant="muted" className="!text-[10px]">
              {(tasks ?? FALLBACK_TASKS).length} görev · {(tasks ?? FALLBACK_TASKS).filter(t => t.status === "done").length} tamamlandı
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Görev Yöneticisi</h1>
          <p className="text-muted-foreground">Beat, kayıt, mix ve yayın akışlarını Kanban tahtası üzerinden takip et</p>
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
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Yeni Görev
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {COLUMNS.map((c) => {
          const count = (tasks ?? FALLBACK_TASKS).filter(t => t.status === c.key).length;
          return (
            <Card key={c.key} className="p-4">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="muted" className="!text-[10px] !px-2">{c.label}</Badge>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${c.accent}`} />
                </div>
                <div className="text-3xl font-bold mb-0.5 tabular-nums">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="p-4">
        <CardContent className="p-0 grid md:grid-cols-5 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Görev ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger><SelectValue placeholder="Atanan kişi" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kişiler</SelectItem>
              {members.map((m) => m && <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger><SelectValue placeholder="Öncelik" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Öncelikler</SelectItem>
              {(["urgent","high","medium","low"] as TaskPriority[]).map(p => (
                <SelectItem key={p} value={p}>
                  <span className="flex items-center gap-2">
                    <Flag className="w-3 h-3" />
                    {TASK_PRIORITY_LABELS[p]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban"><LayoutGrid className="w-3.5 h-3.5 mr-1.5" />Kanban</TabsTrigger>
          <TabsTrigger value="list"><ListTodo className="w-3.5 h-3.5 mr-1.5" />Liste</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarDays className="w-3.5 h-3.5 mr-1.5" />Son Tarih</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLUMNS.map((col) => (
              <div key={col.key} className="min-w-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${col.accent}`} />
                    <div className="text-sm font-semibold">{col.label}</div>
                    <Badge variant="muted" className="!text-[9px] !px-1.5">{byStatus(col.key).length}</Badge>
                  </div>
                </div>
                <div className={cn("rounded-2xl border border-white/5 bg-white/[0.015] p-2 space-y-2 min-h-[300px]", STATUS_COLORS[col.key])}>
                  {byStatus(col.key).length === 0 && (
                    <div className="p-8 text-center text-xs text-muted-foreground italic">Bu kolonda henüz görev yok</div>
                  )}
                  {byStatus(col.key).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="text-left p-3.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Görev</th>
                    <th className="text-left p-3.5 font-medium text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Beat</th>
                    <th className="text-left p-3.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Atanan</th>
                    <th className="text-left p-3.5 font-medium text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Öncelik</th>
                    <th className="text-left p-3.5 font-medium text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Durum</th>
                    <th className="text-left p-3.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Son Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const taskStatus = t.status ?? "todo";
                    const taskPriority = t.priority ?? "low";
                    const taskBeat = t.beat ?? { id: "", title: "Beat yok", type: "available" as BeatType };
                    const taskTags = t.tags ?? [];
                    return (
                      <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5">
                          <div className={cn("font-medium text-sm", taskStatus === "done" && "line-through text-muted-foreground")}>{t.title}</div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {taskTags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="muted" className="!text-[9px] !px-1.5">{tag}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5 hidden md:table-cell">
                          {taskBeat.id ? (
                            <Link href={`/beats/detail?id=${taskBeat.id}`} className="inline-flex items-center gap-2 hover:text-primary">
                              <Disc3 className="w-3.5 h-3.5" />
                              <span className="text-xs truncate max-w-[140px]">{taskBeat.title}</span>
                            </Link>
                          ) : <span className="text-[11px] text-muted-foreground italic">—</span>}
                        </td>
                        <td className="p-3.5">
                          {t.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar name={t.assignee.name} size="sm" />
                              <span className="text-xs">{t.assignee.name}</span>
                            </div>
                          ) : <Badge variant="muted" className="!text-[9px]">Atanmamış</Badge>}
                        </td>
                        <td className="p-3.5 hidden lg:table-cell">
                          <Badge variant="muted" className={cn("!text-[9px] !px-1.5", PRIORITY_COLORS[taskPriority])}>{TASK_PRIORITY_LABELS[taskPriority]}</Badge>
                        </td>
                        <td className="p-3.5 hidden lg:table-cell">
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            {React.createElement(STATUS_ICONS[taskStatus], { className: cn("w-3.5 h-3.5", taskStatus === "done" && "text-neon-green") })}
                            {TASK_STATUS_LABELS[taskStatus]}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {t.dueDate ? (
                            <span className="inline-flex items-center gap-1.5 text-xs">
                              <CalendarClock className="w-3 h-3 text-muted-foreground" />
                              {formatDate(t.dueDate)}
                            </span>
                          ) : <span className="text-[11px] text-muted-foreground italic">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {["Bu Gün", "Bu Hafta", "Gelecek Hafta"].map((group, gi) => {
              const groupTasks = filtered.filter((t, i) => i % 3 === gi);
              return (
                <Card key={group}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CalendarClock className="w-4 h-4 text-primary" />
                      {group}
                    </CardTitle>
                    <CardDescription className="text-xs">{groupTasks.length} görev</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {groupTasks.map((t) => (
                      <div key={t.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]">
                        <div className="flex items-center justify-between mb-1.5">
                          <Badge variant="muted" className={cn("!text-[9px] !px-1.5", PRIORITY_COLORS[t.priority])}>{TASK_PRIORITY_LABELS[t.priority]}</Badge>
                          {t.dueDate && <span className="text-[10px] text-muted-foreground">{formatDate(t.dueDate)}</span>}
                        </div>
                        <div className={cn("text-sm font-medium leading-snug mb-1.5", t.status === "done" && "line-through text-muted-foreground")}>{t.title}</div>
                        <div className="flex items-center justify-between">
                          {t.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar name={t.assignee.name} size="sm" />
                              <span className="text-xs">{t.assignee.name}</span>
                            </div>
                          ) : <span />}
                        </div>
                      </div>
                    ))}
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

function TaskCard({ task }: { task: TaskItem }) {
  const StatusIcon = STATUS_ICONS[task.status];
  const done = task.status === "done";

  return (
    <div className="group relative p-3.5 rounded-xl border border-white/5 bg-card hover:border-primary/30 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge variant="muted" className={cn("!text-[9px] !px-1.5", PRIORITY_COLORS[task.priority])}>
          <Flag className="w-2 h-2 mr-1" />
          {TASK_PRIORITY_LABELS[task.priority]}
        </Badge>
      </div>
      <div className={cn("text-sm font-medium leading-snug mb-2", done && "line-through text-muted-foreground")}>{task.title}</div>
      {task.description && (
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5">
        {task.assignee ? (
          <div className="flex items-center gap-2">
            <Avatar name={task.assignee.name} size="sm" />
            <span className="text-[11px] font-medium">{task.assignee.name}</span>
          </div>
        ) : <Badge variant="muted" className="!text-[9px]">Atanmamış</Badge>}
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          {React.createElement(StatusIcon, { className: cn("w-3 h-3", done && "text-neon-green", task.status === "in_progress" && "text-primary", task.status === "review" && "text-neon-orange") })}
        </span>
      </div>
    </div>
  );
}
