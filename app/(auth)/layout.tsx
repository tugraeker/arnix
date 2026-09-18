import Link from "next/link";
import { Disc3 } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-secondary/15 blur-[140px] animate-pulse-slow" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Grid background overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center">
        <Link href="/" className="mb-10 group flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-[0_0_40px_hsl(var(--primary)/0.5)] group-hover:scale-105 transition-transform">
              <Disc3 className="w-7 h-7 text-white animate-spin-slow" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-neon-green border-4 border-background" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-3xl tracking-wide neon-text">ARNIX</span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Studio Dashboard
            </span>
          </div>
        </Link>

        {children}

        <p className="mt-10 text-xs text-muted-foreground text-center max-w-md">
          © {new Date().getFullYear()} Arnix Studio Dashboard. Ekibin, müziğin, yönetimin.
          <br className="md:hidden" />
          <span className="opacity-60"> Sadece 5 kişilik özel ekibin için tasarlandı.</span>
        </p>
      </div>
    </div>
  );
}
