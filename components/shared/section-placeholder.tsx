import Link from "next/link";
import { ArrowLeft, Sparkles, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SectionPlaceholderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  progress?: string;
  features?: string[];
  backHref?: string;
  variant?: "coming-soon" | "skeleton";
}

export function SectionPlaceholder({
  icon: Icon,
  title,
  description,
  progress,
  features,
  backHref,
  variant = "coming-soon",
}: SectionPlaceholderProps) {
  return (
    <div className="space-y-6">
      {backHref && (
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Link>
      )}

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-8 md:p-12 relative">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary blur-2xl opacity-30 rounded-full" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 border border-white/10 flex items-center justify-center shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
                <Icon className="w-9 h-9 text-primary" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {variant === "coming-soon" ? (
                <Badge variant="warning" className="!text-[10px] !tracking-widest">
                  <Wrench className="w-3 h-3 mr-1.5" />
                  YAPIM AŞAMASINDA
                </Badge>
              ) : (
                <Badge variant="accent" className="!text-[10px] !tracking-widest">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  GELİŞTİRİLİYOR
                </Badge>
              )}
              {progress && (
                <Badge variant="muted" className="!text-[10px]">
                  {progress}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{title}</h1>
            <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>

            {features && features.length > 0 && (
              <div className="w-full mb-6 text-left">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center">
                  Planlanan Özellikler
                </div>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-xs text-foreground/90 leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Kontrol Paneline Dön</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
