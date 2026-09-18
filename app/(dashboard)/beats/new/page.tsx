"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  Music2,
  Gauge,
  Piano,
  Tag,
  Disc3,
  Archive,
  FileAudio,
  ImagePlus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload, type FileItem } from "@/components/shared/file-upload";
import { WavesurferPlayer } from "@/components/audio/wavesurfer-player";
import {
  BEAT_TYPES,
  BEAT_TYPE_LABELS,
  BEAT_TYPE_COLORS,
  type BeatType,
  GENRES,
  MUSICAL_KEYS,
  type AppRole,
  STORAGE_BUCKETS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/hooks/use-profile";
import { useSupabaseMutations } from "@/lib/hooks/use-supabase-query";
import { uploadToStorage } from "@/lib/supabase/helpers";

export default function NewBeatPage() {
  const router = useRouter();
  const { profile, initialized } = useProfile();
  const { insert, error: insertError, loading: insertLoading } = useSupabaseMutations<any>("beats");

  const [title, setTitle] = React.useState("");
  const [bpm, setBpm] = React.useState<number>(120);
  const [key, setKey] = React.useState<string>("C Minor");
  const [genre, setGenre] = React.useState<string>("Trap");
  const [type, setType] = React.useState<BeatType>("demo");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [audioFiles, setAudioFiles] = React.useState<FileItem[]>([]);
  const [archiveFiles, setArchiveFiles] = React.useState<FileItem[]>([]);
  const [coverFiles, setCoverFiles] = React.useState<FileItem[]>([]);
  const [versionName, setVersionName] = React.useState("v1");
  const [versionNotes, setVersionNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t.toLowerCase())) {
      setTags([...tags, t.toLowerCase()]);
    }
    setTagInput("");
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  const canSave = title.length >= 2 && bpm >= 40 && bpm <= 250;
  const loading = saving || insertLoading;

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setUploadError(null);

    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60) || `beat-${Date.now()}`;

      let coverUrl: string | null = null;
      let coverPath: string | null = null;
      if (coverFiles[0]?.file) {
        const res = await uploadToStorage(
          STORAGE_BUCKETS.BEAT_COVERS,
          `${slug}/${Date.now()}-${coverFiles[0].file.name}`,
          coverFiles[0].file
        );
        if (res.error) {
          setUploadError(`Kapak yüklenemedi: ${res.error.message}`);
        } else {
          coverUrl = res.publicUrl;
          coverPath = res.path;
        }
      }

      let archiveUrl: string | null = null;
      let archiveSize = 0;
      if (archiveFiles[0]?.file) {
        const res = await uploadToStorage(
          STORAGE_BUCKETS.PROJECT_ARCHIVES,
          `${slug}/${Date.now()}-${archiveFiles[0].file.name}`,
          archiveFiles[0].file
        );
        if (res.error) {
          setUploadError(`Arşiv yüklenemedi: ${res.error.message}`);
        } else {
          archiveUrl = res.publicUrl;
          archiveSize = archiveFiles[0].file.size;
        }
      }

      let firstAudioUrl: string | null = null;
      if (audioFiles[0]?.file) {
        const res = await uploadToStorage(
          STORAGE_BUCKETS.BEAT_AUDIO,
          `${slug}/${Date.now()}-${audioFiles[0].file.name}`,
          audioFiles[0].file
        );
        if (res.error) {
          setUploadError(`Ses dosyası yüklenemedi: ${res.error.message}`);
        } else {
          firstAudioUrl = res.publicUrl;
        }
      }

      const now = new Date().toISOString();
      const createdById = profile?.id || undefined;

      const row: any = {
        title,
        bpm,
        musical_key: key,
        genre,
        type,
        description: description || null,
        tags,
        cover: coverUrl,
        cover_path: coverPath,
        project_archive_url: archiveUrl,
        project_archive_size: archiveSize || null,
        latest_audio_url: firstAudioUrl,
        created_by: createdById,
        created_at: now,
        updated_at: now,
      };

      const inserted = await insert(row);

      setSaving(false);
      setSaved(true);

      setTimeout(() => {
        if (inserted && (inserted as any).id) {
          router.push(`/beats/${(inserted as any).id}`);
        } else {
          router.push("/beats");
        }
        router.refresh();
      }, 700);
    } catch (e: any) {
      setSaving(false);
      setUploadError(e?.message || "Kaydedilirken hata oluştu");
      setTimeout(() => setUploadError(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {(uploadError || insertError) && (
        <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            {uploadError || insertError?.message || "Supabase bağlantı hatası — demo modda kaydediliyor."}
            <div className="text-[11px] opacity-70 mt-0.5">.env.local dosyanızda NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı mı kontrol edin.</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <Link href="/beats" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Beat Deposuna Geri Dön
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Taslak olarak kaydet
          </Button>
          <Button size="sm" disabled={!canSave || loading} onClick={onSave}>
            {saved ? (
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
            ) : loading ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1.5" />
            )}
            {saved ? "Kaydedildi!" : "Beat'i Kaydet"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-primary" />
                Beat Bilgileri
              </CardTitle>
              <CardDescription>
                Temel meta veriler. Bu alanlar beat'i ararken ve filtrelerken kullanılacak.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title">Başlık <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Midnight Vibes, Neon Şehir, Derin Sular..."
                    className="pl-10"
                    maxLength={80}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                    {title.length}/80
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>BPM <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={40}
                      max={250}
                      value={bpm}
                      onChange={(e) => setBpm(Number(e.target.value))}
                      className="pl-10 font-mono text-base font-bold"
                    />
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={250}
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full accent-primary mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>40 (Slow)</span>
                    <span>~140 (Trap/Drill)</span>
                    <span>250</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Ton (Key) <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Piano className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                    <Select value={key} onValueChange={setKey}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Seç" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="grid grid-cols-4 gap-0.5 p-1">
                          {MUSICAL_KEYS.map((k) => (
                            <SelectItem key={k} value={k} className="justify-center text-xs font-mono px-1.5 py-1">
                              {k}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Tür / Stil <span className="text-destructive">*</span></Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seç" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Durum</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(Object.keys(BEAT_TYPE_LABELS) as BeatType[]).map((k) => {
                    const selected = k === type;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setType(k)}
                        className={cn(
                          "px-2.5 py-2 rounded-xl border text-xs font-medium transition-all flex flex-col items-start gap-1",
                          selected
                            ? "border-primary/50 bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                            : "border-white/5 bg-white/[0.02] hover:bg-white/5 text-muted-foreground"
                        )}
                      >
                        <Badge
                          variant="muted"
                          className={cn("!text-[9px] !px-1.5", BEAT_TYPE_COLORS[k])}
                        >
                          {BEAT_TYPE_LABELS[k]}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground/80 leading-tight">
                          {k === "available" && "Kullanım için boş"}
                          {k === "for_sale" && "Satışa hazır"}
                          {k === "demo" && "İskelet/Demo"}
                          {k === "mix_pending" && "Mix sırası bekliyor"}
                          {k === "completed" && "Tamamlandı"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Etiketler</Label>
                <form onSubmit={addTag} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="dark, melodic, 808... +Enter"
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm">
                    Ekle
                  </Button>
                </form>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.length === 0 && (
                    <span className="text-[11px] text-muted-foreground italic">
                      Henüz etiket yok · Beat'leri bulmak için 3-5 tane önerilir
                    </span>
                  )}
                  {tags.map((t) => (
                    <Badge key={t} variant="outline" className="!text-[11px] !px-2 group cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                      onClick={() => removeTag(t)}
                    >
                      {t}
                      <span className="ml-1 opacity-50 group-hover:opacity-100">×</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Notlar / Açıklama</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu beat'in havası, referans parçalar, notlar, kısıtlamalar..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="w-5 h-5 text-neon-pink" />
                Ses Dosyası &nbsp;
                <Badge variant="muted" className="!text-[10px] !px-2">SURUM 1 (V1)</Badge>
              </CardTitle>
              <CardDescription>
                MP3/WAV/AIFF yükle · Waveform otomatik olarak oluşturulur · İsteğe bağlı v1 notları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                accept="audio"
                maxFiles={3}
                maxSizeMB={200}
                label="Ana ses dosyasını yükle"
                description="Beat'in ana mix/versiyonu. İstersen demo, inst ve akapella olarak 3 dosya birden yükle."
                onFilesChange={setAudioFiles}
                compact={false}
                showDetails
              />
              {audioFiles[0] && (
                <div className="pt-2 animate-slide-up">
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Waveform Önizleme · {audioFiles[0].file.name}
                  </div>
                  <WavesurferPlayer
                    audioUrl={URL.createObjectURL(audioFiles[0].file)}
                    title={title || "Yeni Beat Önizleme"}
                    audioName={audioFiles[0].file.name}
                    fileSize={audioFiles[0].file.size}
                    variant="full"
                    showDownload={false}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Sürüm Adı</Label>
                  <Input value={versionName} onChange={(e) => setVersionName(e.target.value)} placeholder="v1, v2-master, demo-vocal" />
                </div>
                <div className="space-y-1.5">
                  <Label>Sürüm Notları</Label>
                  <Input value={versionNotes} onChange={(e) => setVersionNotes(e.target.value)} placeholder="Kick revize edildi, vokal eklendi..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Archive (ZIP/RAR) */}
          <Card className="border-neon-purple/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-neon-purple" />
                Proje Arşivi (ZIP / RAR)
              </CardTitle>
              <CardDescription>
                Ableton Live, Logic, Pro Tools, FL Studio proje dosyalarını ZIP/RAR olarak yükle
                · Tüm ekip proje kaynak dosyalarına ulaşsın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept="archive"
                maxFiles={1}
                maxSizeMB={2000}
                label="Proje ZIP/RAR dosyasını yükle"
                description="Örn: beat-ismi-ableton-v3.zip · Toplam boyut 2GB'a kadar"
                onFilesChange={setArchiveFiles}
              />
              {archiveFiles.length === 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="font-medium text-foreground/70 mb-1">.als / .alp</div>
                    <div>Ableton Live Set / Pack</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="font-medium text-foreground/70 mb-1">.logicx / .ptx</div>
                    <div>Logic Pro / Pro Tools Session</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="font-medium text-foreground/70 mb-1">.flp / .cpr</div>
                    <div>FL Studio / Cubase Project</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Side Info */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-neon-orange" />
                Kapak Görseli
              </CardTitle>
              <CardDescription>
                3000x3000px önerilir · Spotify/Apple standardı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept="image"
                maxFiles={1}
                maxSizeMB={20}
                label="Kapak seç"
                description="PNG/JPG · Kare (1:1) format"
                onFilesChange={setCoverFiles}
                compact
              />
              <div className="mt-4 aspect-square rounded-xl bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 border border-white/5 flex items-center justify-center overflow-hidden">
                {coverFiles[0]?.preview ? (
                  <img src={coverFiles[0].preview} alt="kapak" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-5">
                    <UploadCloud className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Kapak görseli seçilmedi
                      <br />
                      Beat, yayın aşamasında kullanılmak üzere uygun bir kapakla yüklenmelidir.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kayıt Özeti</CardTitle>
              <CardDescription className="text-xs">Formun geçerli mi, bak</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <SummaryRow label="Başlık" ok={title.length >= 2}>
                {title || "Boş"}
              </SummaryRow>
              <SummaryRow label="BPM" ok={bpm >= 40 && bpm <= 250}>
                {bpm.toString()}
              </SummaryRow>
              <SummaryRow label="Ton" ok={!!key}>
                {key}
              </SummaryRow>
              <SummaryRow label="Tür" ok={!!genre}>
                {genre}
              </SummaryRow>
              <SummaryRow label="Etiketler" ok={tags.length >= 0}>
                {tags.length || 0} adet
              </SummaryRow>
              <SummaryRow label="Ses" ok={audioFiles.length > 0}>
                {audioFiles.length || 0} dosya
              </SummaryRow>
              <SummaryRow label="Proje Arşivi" ok={archiveFiles.length > 0}>
                {archiveFiles.length ? "Yüklü" : "İsteğe bağlı"}
              </SummaryRow>

              <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border border-white/5">
                <div className="text-xs font-semibold mb-1">İstersen daha sonra ekle:</div>
                <ul className="text-[11px] text-muted-foreground list-disc list-inside space-y-0.5 leading-relaxed">
                  <li>Telif payları (split sheet)</li>
                  <li>Görev listesi & TODO</li>
                  <li>Referans parçalar (Spotify/YT)</li>
                  <li>Mix/Master checklist</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, ok, children }: { label: string; ok?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/[0.02]">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn(
        "text-xs font-medium inline-flex items-center gap-1.5",
        ok ? "text-foreground" : "text-muted-foreground"
      )}>
        {ok !== undefined && (
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            ok ? "bg-neon-green" : "bg-muted"
          )} />
        )}
        {children}
      </span>
    </div>
  );
}
