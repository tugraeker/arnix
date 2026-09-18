"use client";

import * as React from "react";
import {
  Upload,
  FileAudio,
  FileArchive,
  FileCog,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderUp,
  Sparkles,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AUDIO_FILE_EXTENSIONS,
  PROJECT_ARCHIVE_EXTENSIONS,
  PRESET_FILE_EXTENSIONS,
} from "@/lib/constants";

export type FileKind = "audio" | "archive" | "preset" | "image" | "any";

export interface FileItem {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  uploadedUrl?: string;
}

interface FileUploadProps {
  onFilesChange?: (files: FileItem[]) => void;
  onUpload?: (file: File) => Promise<string | undefined>;
  accept?: FileKind | FileKind[];
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  className?: string;
  compact?: boolean;
  initialFiles?: FileItem[];
  showDetails?: boolean;
}

function kindToAccept(kind: FileKind | FileKind[]): string {
  const arr = Array.isArray(kind) ? kind : [kind];
  const out: string[] = [];
  if (arr.includes("any")) return "*";
  if (arr.includes("audio")) out.push("audio/*", ...AUDIO_FILE_EXTENSIONS);
  if (arr.includes("archive")) out.push(...PROJECT_ARCHIVE_EXTENSIONS);
  if (arr.includes("preset")) out.push(...PRESET_FILE_EXTENSIONS);
  if (arr.includes("image")) out.push("image/*");
  return out.join(",");
}

function getKindLabel(kind: FileKind): string {
  switch (kind) {
    case "audio":
      return "Ses";
    case "archive":
      return "Arşiv (ZIP/RAR)";
    case "preset":
      return "Preset";
    case "image":
      return "Görsel";
    default:
      return "Dosya";
  }
}

function getKindIcon(kind: FileKind): React.ComponentType<{ className?: string }> {
  switch (kind) {
    case "audio":
      return FileAudio;
    case "archive":
      return FileArchive;
    case "preset":
      return FileCog;
    case "image":
    default:
      return FileAudio;
  }
}

function detectKind(file: File, accepted: FileKind | FileKind[]): FileKind | null {
  const arr = Array.isArray(accepted) ? accepted : [accepted];
  const name = file.name.toLowerCase();
  if (arr.includes("audio") &&
      (file.type.startsWith("audio/") ||
        AUDIO_FILE_EXTENSIONS.some((e) => name.endsWith(e))))
    return "audio";
  if (arr.includes("archive") &&
      PROJECT_ARCHIVE_EXTENSIONS.some((e) => name.endsWith(e)))
    return "archive";
  if (arr.includes("preset") &&
      PRESET_FILE_EXTENSIONS.some((e) => name.endsWith(e)))
    return "preset";
  if (arr.includes("image") && file.type.startsWith("image/")) return "image";
  if (arr.includes("any")) return "any";
  return null;
}

export function FileUpload({
  onFilesChange,
  onUpload,
  accept = "any",
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 500,
  label,
  description,
  className,
  compact = false,
  initialFiles = [],
  showDetails = true,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [files, setFiles] = React.useState<FileItem[]>(initialFiles);

  React.useEffect(() => {
    onFilesChange?.(files);
  }, [files]);

  const addFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    setFiles((prev) => {
      let next = [...prev];
      for (const f of list) {
        if (next.length >= maxFiles) break;
        const kind = detectKind(f, accept);
        if (!kind && accept !== "any") continue;
        if ((f.size / 1024 / 1024) > maxSizeMB) {
          next.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            file: f,
            progress: 0,
            status: "error",
            error: `Maksimum ${maxSizeMB}MB olabilir`,
          });
          continue;
        }
        const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
        next.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file: f,
          preview,
          progress: 0,
          status: "pending",
        });
      }
      return next.slice(0, maxFiles);
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!e.dataTransfer.files?.length) return;
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const startUpload = async () => {
    if (!onUpload) return;
    for (const item of files) {
      if (item.status !== "pending") continue;
      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "uploading", progress: 5 } : f))
      );
      try {
        const result = await onUpload(item.file);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: "done", progress: 100, uploadedUrl: result }
              : f
          )
        );
      } catch (err: any) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: "error", error: err?.message || "Yükleme başarısız" }
              : f
          )
        );
      }
    }
  };

  const openPicker = () => inputRef.current?.click();
  const acceptStr = kindToAccept(accept);

  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        <div
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "group cursor-pointer rounded-xl border-2 border-dashed transition-all",
            dragOver
              ? "border-primary/60 bg-primary/5"
              : "border-white/10 hover:border-primary/40 hover:bg-white/[0.02]"
          )}
        >
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <FolderUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium">
                  {label ?? "Dosya yüklemek için tıkla veya sürükle"}
                </div>
                {description && (
                  <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
                )}
              </div>
            </div>
            <Button size="sm" variant="outline" type="button">
              Seç
            </Button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptStr}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        {files.length > 0 && <CompactFileList files={files} onRemove={removeFile} />}
      </div>
    );
  }

  const acceptArr = Array.isArray(accept) ? accept : accept === "any" ? (["audio", "archive", "preset", "image"] as FileKind[]) : [accept];

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onClick={openPicker}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
          dragOver
            ? "border-primary/70 bg-primary/5 shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
            : "border-white/10 hover:border-primary/40 bg-white/[0.015] hover:bg-white/[0.03]"
        )}
      >
        {dragOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none animate-pulse-slow" />
        )}
        <div className="p-8 md:p-10 text-center relative">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/15 border border-white/10 flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.15)]">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          <div className="text-lg font-semibold mb-1.5">
            {label ?? "Dosyaları buraya sürükle veya seç"}
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {description ??
              "Sürükle bırak yap veya aşağıdaki butona tıkla. Birden fazla dosya yükleyebilirsin."}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-2 mt-5 mb-5">
            {acceptArr.map((k) => {
              const Icon = getKindIcon(k);
              return (
                <Badge key={k} variant="muted" className="!px-2 !py-1 !text-[11px]">
                  <Icon className="w-3 h-3 mr-1.5" />
                  {getKindLabel(k)}
                </Badge>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button type="button" size="lg">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Dosyaları Seç
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={(e) => e.stopPropagation()} disabled={files.filter(f => f.status === "pending").length === 0 || !onUpload} onClickCapture={startUpload}>
              {files.some(f => f.status === "uploading") ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-1.5" />
              )}
              Yüklemeyi Başlat
            </Button>
          </div>

          <div className="mt-4 text-[11px] text-muted-foreground flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>En fazla {maxFiles} dosya</span>
            <span className="opacity-40">·</span>
            <span>Dosya boyutu ≤ {maxSizeMB}MB</span>
            <span className="opacity-40">·</span>
            <span>
              {acceptArr.map(getKindLabel).join(", ")} destekli
            </span>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptStr}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <FileRow
              key={f.id}
              item={f}
              acceptedKinds={accept}
              onRemove={() => removeFile(f.id)}
              showDetails={showDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileRow({
  item,
  acceptedKinds,
  onRemove,
  showDetails,
}: {
  item: FileItem;
  acceptedKinds: FileKind | FileKind[];
  onRemove: () => void;
  showDetails: boolean;
}) {
  const kind = detectKind(item.file, acceptedKinds);
  const Icon = kind ? getKindIcon(kind) : FileAudio;
  return (
    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3 animate-slide-up">
      <div
        className={cn(
          "p-2.5 rounded-lg shrink-0",
          kind === "audio" && "bg-primary/15 text-primary",
          kind === "archive" && "bg-neon-purple/15 text-neon-purple",
          kind === "preset" && "bg-neon-cyan/15 text-neon-cyan",
          kind === "image" && "bg-neon-pink/15 text-neon-pink",
          !kind && "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      {item.preview && (
        <img
          src={item.preview}
          alt={item.file.name}
          className="h-12 w-12 object-cover rounded-lg shrink-0 border border-white/5"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{item.file.name}</span>
          {item.status === "done" && (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-neon-green" />
          )}
          {item.status === "error" && (
            <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
          )}
        </div>
        {showDetails && (
          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
            <span>{formatBytes(item.file.size)}</span>
            {item.error && <span className="text-destructive">· {item.error}</span>}
          </div>
        )}
        {(item.status === "uploading" || item.status === "pending") && (
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                item.status === "uploading"
                  ? "bg-gradient-to-r from-primary to-secondary animate-pulse"
                  : "bg-white/10"
              )}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>

      <button
        onClick={onRemove}
        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function CompactFileList({
  files,
  onRemove,
}: {
  files: FileItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {files.map((f) => (
        <div
          key={f.id}
          className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 animate-slide-up"
        >
          <span className="text-xs font-medium truncate flex-1 min-w-0">{f.file.name}</span>
          <Badge variant="muted" className="!text-[10px] !px-1.5">
            {formatBytes(f.file.size)}
          </Badge>
          <button
            onClick={() => onRemove(f.id)}
            className="p-1 rounded text-muted-foreground hover:text-destructive"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
