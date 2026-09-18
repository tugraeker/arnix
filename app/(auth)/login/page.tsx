"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Music, LogIn, AtSign, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { APP_ROLES, ROLE_LABELS, ROLE_COLORS, type AppRole } from "@/lib/constants";
import { setStoredRole } from "@/components/shared/role-gate";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const supabase = createClient();

  const [tab, setTab] = React.useState<"login" | "register">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [role, setRole] = React.useState<AppRole>("vocalist");
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user?.id)
        .single();
      if (profile?.role) setStoredRole(profile.role);
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });
      if (error) throw error;
      setStoredRole(role);
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Kayıt başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const onMagicLink = async () => {
    if (!email) {
      setError("Lütfen önce e-posta adresinizi yazın.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setError("E-postanıza giriş bağlantısı gönderildi ✅ (Demo: Supabase kurulumu sonrası çalışır)");
    } catch (err: any) {
      setError(err?.message || "Sihirli bağlantı gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const onDemo = async (demoRole: AppRole) => {
    setStoredRole(demoRole);
    router.push("/dashboard?demo=true");
  };

  return (
    <Card className="w-full max-w-md border border-white/10 bg-card/70 backdrop-blur-2xl shadow-[0_20px_80px_-20px_hsl(var(--primary)/0.4)]">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 border border-white/10 flex items-center justify-center">
          <Music className="w-7 h-7 text-primary neon-text" />
        </div>
        <CardTitle className="text-2xl tracking-tight">
          Stüdyoya Giriş
        </CardTitle>
        <CardDescription className="text-sm pt-1">
          Ekibinle ritmi yakalamaya hazır mısın?
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-5">
            <TabsTrigger value="login">Giriş</TabsTrigger>
            <TabsTrigger value="register">Hesap Oluştur</TabsTrigger>
          </TabsList>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-sm text-destructive animate-slide-up">
              {error}
            </div>
          )}

          <TabsContent value="login">
            <form onSubmit={onLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">E-posta</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="isim@arnix.studio"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Şifre</Label>
                  <button type="button" className="text-xs text-primary hover:underline">
                    Şifremi unuttum
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Giriş Yap
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={onMagicLink}
                disabled={loading}
              >
                ✉️ E-posta ile Sihirli Bağlantı Gönder
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={onRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Ad Soyad</Label>
                <Input
                  placeholder="Ahmet Yılmaz"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>E-posta</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="isim@arnix.studio"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Şifre (en az 6 karakter)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Rolün</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(ROLE_LABELS) as AppRole[]).map((r) => {
                    const selected = r === role;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={cn(
                          "relative text-left p-3 rounded-lg border text-sm transition-all",
                          selected
                            ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                            : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                        )}
                      >
                        <Badge
                          variant="muted"
                          className={cn("!px-1.5 mb-1.5", ROLE_COLORS[r])}
                        >
                          {ROLE_LABELS[r]}
                        </Badge>
                        <div className="text-[11px] text-muted-foreground leading-tight">
                          {r === "admin" && "Tam yetki, kullanıcı yönetimi"}
                          {r === "producer" && "Beat üret, proje yönet"}
                          {r === "vocalist" && "Vokal kaydet, söz yaz"}
                          {r === "songwriter" && "Söz odaklı çalış"}
                          {r === "engineer" && "Mix/Master, ekipman"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Hesabımı Oluştur
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* DEMO LOGIN */}
        <div className="mt-6 pt-5 border-t border-white/5">
          <div className="mb-3 text-center text-[11px] uppercase tracking-wider text-muted-foreground/80">
            Demo modda keşfet (Supabase kurmadan)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => onDemo(APP_ROLES.ADMIN)}>
              <Badge variant="muted" className={cn("!px-1.5 !text-[9px]", ROLE_COLORS.admin)}>
                {ROLE_LABELS.admin}
              </Badge>
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDemo(APP_ROLES.PRODUCER)}>
              <Badge variant="muted" className={cn("!px-1.5 !text-[9px]", ROLE_COLORS.producer)}>
                {ROLE_LABELS.producer}
              </Badge>
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDemo(APP_ROLES.VOCALIST)}>
              <Badge variant="muted" className={cn("!px-1.5 !text-[9px]", ROLE_COLORS.vocalist)}>
                {ROLE_LABELS.vocalist}
              </Badge>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-muted-foreground">Yükleniyor...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
