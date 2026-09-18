"use client";

import * as React from "react";
import WaveSurfer from "wavesurfer.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Download,
  Clock,
  Radio,
} from "lucide-react";
import { cn, formatBytes, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface WavesurferPlayerProps {
  audioUrl: string;
  title?: string;
  description?: string;
  audioName?: string;
  duration?: number | null;
  fileSize?: number | null;
  onReady?: (duration: number) => void;
  onTimeUpdate?: (current: number, total: number) => void;
  onFinish?: () => void;
  className?: string;
  variant?: "full" | "compact";
  showDownload?: boolean;
  downloadableUrl?: string;
  waveColor?: string;
  progressColor?: string;
}

export function WavesurferPlayer({
  audioUrl,
  title,
  description,
  audioName,
  duration: initialDuration,
  fileSize,
  onReady,
  onTimeUpdate,
  onFinish,
  className,
  variant = "full",
  showDownload = true,
  downloadableUrl,
  waveColor = "hsl(var(--primary) / 0.35)",
  progressColor = "hsl(var(--primary))",
}: WavesurferPlayerProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const wsRef = React.useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [totalDuration, setTotalDuration] = React.useState(initialDuration ?? 0);
  const [volume, setVolume] = React.useState(0.8);
  const [muted, setMuted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      cursorColor: "hsl(var(--secondary))",
      cursorWidth: 2,
      barWidth: 3,
      barGap: 2,
      barRadius: 2,
      height: variant === "compact" ? 48 : 80,
      normalize: true,
      backend: "WebAudio",
    });

    wsRef.current = ws;
    ws.load(audioUrl);

    ws.on("ready", () => {
      setLoading(false);
      const d = ws.getDuration();
      setTotalDuration(d);
      onReady?.(d);
    });

    ws.on("audioprocess", () => {
      const c = ws.getCurrentTime();
      const t = ws.getDuration();
      setCurrentTime(c);
      onTimeUpdate?.(c, t);
    });

    ws.on("seeking", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => {
      setIsPlaying(false);
      onFinish?.();
    });

    return () => {
      ws.destroy();
      wsRef.current = null;
    };
  }, [audioUrl, variant, waveColor, progressColor]);

  React.useEffect(() => {
    wsRef.current?.setVolume(muted ? 0 : volume);
  }, [volume, muted]);

  const togglePlay = () => wsRef.current?.playPause();
  const skipBackward = () => wsRef.current?.skip(-5);
  const skipForward = () => wsRef.current?.skip(5);

  const onVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (v > 0) setMuted(false);
  };

  if (variant === "compact") {
    return (
      <div className={cn("p-3 rounded-xl bg-card border border-white/5", className)}>
        <div className="flex items-center gap-3">
          <Button
            size="iconSm"
            variant="default"
            onClick={togglePlay}
            className="shrink-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <div className="flex-1 min-w-0">
            {title && (
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium truncate">{title}</span>
                {loading && (
                  <Badge variant="muted" className="!text-[9px] !px-1.5">
                    <Radio className="w-2.5 h-2.5 mr-1 animate-pulse" />
                    yükleniyor
                  </Badge>
                )}
              </div>
            )}
            <div ref={containerRef} className="w-full h-12" />
          </div>
          <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-muted-foreground tabular-nums shrink-0">
            <span>{formatDuration(currentTime)}</span>
            <span className="opacity-40 mx-1">/</span>
            <span>{formatDuration(totalDuration)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-5 rounded-2xl glass-card", className)}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          {title && (
            <h3 className="font-semibold text-base md:text-lg truncate neon-text">
              {title}
            </h3>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
            {audioName && <span className="font-mono truncate">{audioName}</span>}
            {fileSize && (
              <span className="inline-flex items-center gap-1">
              <Download className="w-3 h-3" />
              {formatBytes(fileSize)}
            </span>
            )}
            {loading ? (
              <Badge variant="muted" className="!text-[9px] !px-1.5">
              <Radio className="w-2.5 h-2.5 mr-1 animate-pulse" />
              waveform yükleniyor
            </Badge>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(totalDuration)}
              </span>
            )}
          </div>
        </div>
        {showDownload && downloadableUrl && (
          <a
            href={downloadableUrl}
            download
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1.5" />
              İndir
            </Button>
          </a>
        )}
      </div>

      <div ref={containerRef} className="w-full min-h-[80px] mb-4" />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="iconSm" onClick={skipBackward}>
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button variant="default" size="icon" onClick={togglePlay} className={cn(loading && "opacity-50 cursor-not-allowed")}>
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="iconSm" onClick={skipForward}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="hidden md:block text-sm font-mono text-muted-foreground tabular-nums">
          <span>{formatDuration(currentTime)}</span>
          <span className="mx-2 opacity-40">/</span>
          <span>{formatDuration(totalDuration)}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground"
          >
            {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={onVolumeSlider}
            className="w-24 md:w-32 accent-primary"
          />
        </div>
      </div>
    </div>
  );
}
