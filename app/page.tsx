"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-muted-foreground animate-pulse">Arnix Yükleniyor...</div>
    </div>
  );
}
