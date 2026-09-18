import Link from "next/link";
import { ArrowLeft, User, Shield, Bell, Palette, Database, UploadCloud, KeyRound, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileUpload } from "@/components/shared/file-upload";
import {
  ROLE_LABELS,
  ROLE_COLORS,
  TEAM_STATUS_LABELS,
  TEAM_STATUS_COLORS,
  type AppRole,
  type TeamStatus,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const demoRole: AppRole = "producer";
  const demoStatus: TeamStatus = "studio";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="w-4 h-4" />
          Kontrol Paneline Dön
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">Profil, bildirim ve arayüz tercihlerin</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">
            <User className="w-3.5 h-3.5 mr-1.5" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-3.5 h-3.5 mr-1.5" />
            Güvenlik
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-3.5 h-3.5 mr-1.5" />
            Bildirimler
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-3.5 h-3.5 mr-1.5" />
            Görünüm
          </TabsTrigger>
          <TabsTrigger value="supabase">
            <Database className="w-3.5 h-3.5 mr-1.5" />
            Supabase
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Kişisel Bilgiler</CardTitle>
                <CardDescription>
                  Ekibin seni nasıl göreceğini buradan yönet.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-5 p-4 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border border-white/5">
                  <Avatar name="Mert Yılmaz" size="xl" />
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold">Mert Yılmaz</h2>
                      <Badge variant="muted" className={cn("!text-[10px] !px-2", ROLE_COLORS[demoRole])}>
                        {ROLE_LABELS[demoRole]}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className={cn("w-2 h-2 rounded-full", TEAM_STATUS_COLORS[demoStatus])} />
                        <span className="text-muted-foreground">{TEAM_STATUS_LABELS[demoStatus]}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">mert@arnix.studio</div>
                    <FileUpload accept="image" maxFiles={1} maxSizeMB={5} compact label="Avatarını güncelle" description="JPG/PNG · 500x500 önerilir" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Ad Soyad</Label>
                    <Input defaultValue="Mert Yılmaz" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Kullanıcı Adı</Label>
                    <Input defaultValue="mert" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>E-posta</Label>
                    <Input type="email" defaultValue="mert@arnix.studio" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mevcut Rol</Label>
                    <Input readOnly value={ROLE_LABELS[demoRole]} className="bg-white/[0.02]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Üye Durumu</Label>
                    <Input readOnly value={TEAM_STATUS_LABELS[demoStatus]} className="bg-white/[0.02]" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Hakkımda / Biyografi</Label>
                    <Textarea
                      rows={3}
                      placeholder="Kendini ve uzmanlık alanlarını kısaca tanıt..."
                      defaultValue="Producer & Mix Engineer • 8 yıl • Trap, Drill, R&B alanlarında çalışıyorum."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm">Değişiklikleri İptal Et</Button>
                  <Button size="sm">Kaydet</Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Stüdyo Durumu</CardTitle>
                  <CardDescription className="text-xs">Ekibin seni hangi etiketle göreceğini seç</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {(Object.keys(TEAM_STATUS_LABELS) as TeamStatus[]).map((k) => (
                    <button key={k} className={cn(
                      "px-2.5 py-3 rounded-lg border text-xs font-medium transition-all",
                      k === demoStatus
                        ? "border-primary/40 bg-primary/10"
                        : "border-white/5 bg-white/[0.02] text-muted-foreground hover:bg-white/5"
                    )}>
                      <div className={cn("w-2 h-2 rounded-full mx-auto mb-1", TEAM_STATUS_COLORS[k])} />
                      {TEAM_STATUS_LABELS[k]}
                    </button>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Takılmamış Linkler</CardTitle>
                  <CardDescription className="text-xs">Platform hesaplarını bağla</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Spotify for Artists", icon: "🎧" },
                    { label: "DistroKid", icon: "📤" },
                    { label: "Instagram", icon: "📷" },
                    { label: "YouTube Channel", icon: "📺" },
                  ].map((x) => (
                    <button key={x.label} className="w-full flex items-center justify-between p-2.5 rounded-lg border border-white/5 hover:bg-white/5 text-xs">
                      <span className="flex items-center gap-2"><span>{x.icon}</span>{x.label}</span>
                      <Badge variant="muted" className="!text-[10px]">Bağlan</Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-neon-green" />
                Şifre & Güvenlik
              </CardTitle>
              <CardDescription className="text-xs">Hesabını güvende tutmak için öneriler</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-5">
              <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-sm font-semibold mb-2">Şifreyi Değiştir</div>
                <div className="space-y-2">
                  <Label>Mevcut Şifre</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Yeni Şifre</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Yeni Şifre (Tekrar)</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button size="sm" className="w-full">Şifremi Güncelle</Button>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-neon-green mb-0.5">İki Faktörlü Doğrulama (2FA)</div>
                    <p className="text-xs text-muted-foreground">Ek güvenlik için Google Authenticator / Authy önerilir.</p>
                    <Badge variant="warning" className="!text-[10px] mt-2">Aktif Değil · Ayarla</Badge>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                  <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-primary mb-0.5">Aktif Oturumlar</div>
                    <p className="text-xs text-muted-foreground">Chrome · Windows · 18.09.2026 17:04 · Sadece bu cihazda açık.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Bildirim Tercihleri</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["Yeni beat versiyonu yüklendiğinde", true],
                ["Sana görev atandığında", true],
                ["Stüdyo randevusundan 1 saat önce hatırlat", true],
                ["Yeni yorum & geri bildirim", true],
                ["Split sheet paylaşıldığında", true],
                ["Haftalık takım özeti (Pazartesi)", false],
                ["Preset paylaşıldığında", true],
                ["Güvenlik bildirimleri", true],
              ].map(([label, on]) => (
                <div key={label as string} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span>{label as string}</span>
                  <div className={cn(
                    "relative w-11 h-6 rounded-full transition-colors",
                    on ? "bg-primary" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
                      on ? "translate-x-6" : "translate-x-1"
                    )} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Tema ve Görünüm</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="mb-2 block">Arayüz Modu</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Karanlık (Stüdyo)", icon: "🌙", active: true },
                    { label: "Koyu Mor", icon: "🔮", active: false },
                    { label: "Güneşli (Clasic)", icon: "☀️", active: false },
                  ].map((t) => (
                    <button key={t.label} className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      t.active ? "border-primary/50 bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]" : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                    )}>
                      <div className="text-2xl mb-1">{t.icon}</div>
                      <div className="text-sm font-semibold">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supabase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary" />
                Supabase Bağlantısı
              </CardTitle>
              <CardDescription>
                Aşağıdaki URL ve anon key bilgilerini <code>.env.local</code> içine doldurduktan sonra Supabase panelinden <strong>SQL Editor</strong> sekmesine girip <code>supabase/migrations/0001_arnix_initial_schema.sql</code> dosyasını çalıştırarak tüm tabloları oluşturabilirsin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>NEXT_PUBLIC_SUPABASE_URL</Label>
                <Input readOnly defaultValue="https://your-project.supabase.co" className="font-mono text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label>NEXT_PUBLIC_SUPABASE_ANON_KEY</Label>
                <Input readOnly defaultValue="eyJhbGciOi... (anon key)" className="font-mono text-xs" />
              </div>
              <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/20 text-xs leading-relaxed">
                <div className="font-semibold text-neon-green mb-1.5">✅ 1. Aşama Hazır: Kod İskeleti (Klasör yapısı, tema, sayfalar, UI, tüm tipler)</div>
                <div className="text-muted-foreground">
                  2. aşamada Supabase projeni oluşturup URL ve key&apos;i kopyalayabilirsin. Ardından migration SQL&apos;i çalıştırıp Auth → Politikalarından e-postayla üye eklemeye başlayabilirsin.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
