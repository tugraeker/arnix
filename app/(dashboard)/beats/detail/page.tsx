"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Disc3 } from "lucide-react";
import { Card } from "@/components/ui/card";

function BeatDetailInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "1";

  return (
    <div className="space-y-6">
      <Link href="/beats" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        Beatlere Dön
      </Link>
      <Card className="p-8">
        <div className="flex items-center gap-3">
          <Disc3 className="w-8 h-8 text-primary animate-spin" />
          <div>
            <div className="font-semibold text-lg">Beat #{id}</div>
            <div className="text-sm text-muted-foreground">Beat detayı — Supabase bağlantısı kurulduktan sonra tam veri burada gösterilecek.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function BeatDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Yükleniyor...</div>}>
      <BeatDetailInner />
    </Suspense>
  );
}
