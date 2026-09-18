# Arnix Phase-D — Ürün Gereksinim Dokümanı

## Overview
- **Summary**: Kombine geçiş: 17 dashboard sayfasındaki hardcoded mock array yerine Supabase canlı veri + Storage bağlantısı → Presets placeholder bitir + polish → Tam RBAC kablolama.
- **Purpose**: Mock data ile demo olmayan, canlı DB/Storage kullanan, rollere göre sıkı erişim denetimi olan prodüksiyona hazır dashboard elde etmek.
- **Target Users**: Admin / Producer / Vocalist / Songwriter / Engineer (5 rol).

## Goals
- Supabase: 17 sayfayı mock array → canlı select+CRUD + Auth akışı + Storage (9 bucket) bağla
- Polish: Presets kategori sekmelerini tamamla, genel UI tutarlılığı
- RBAC: Her sayfa + buton için RoleGate uygula (ROLE_PERMISSINGS matrisine göre)
- Kullanıcı .env.local'ı doldurup migration çalıştırınca her şey çalışsın

## Non-Goals
- Yeni sayfa / yeni modül eklemek (17 sayı korunacak)
- Supabase şemasını değiştirmek (0001 migration korunacak)
- UI tema / renk / dil değişikliği (neon tema + Türkçe korunacak)
- Unit / e2e test yazmak (manuel doğrulama yeterli)

## Background & Context
- 17 sayfa UI-tam, sadece Presets kategori placeholder var
- 26 tablo + 9 bucket migration hazır (0001_arnix_initial_schema.sql)
- lib/types 20 interface migration ile %95 uyumlu
- ROLE_PERMISSIONS matrisi + RoleGate component hazır, sayfalarda kullanımı yok

## Functional Requirements
- **FR-1**: Her sayfa initial render'da Supabase'den veri çeker (hata varsa kullanıcıya gösterir, yükleme state'i olur)
- **FR-2**: Create/Update/Delete formları Supabase üzerinde çalışır, işlem sonrası liste yenilenir
- **FR-3**: WavesurferPlayer Supabase Storage public URL'si ile çalışır
- **FR-4**: FileUpload 9 bucket'dan uygun olana upload eder, URL'yi ilgili kaydeder
- **FR-5**: Presets sayfasında 5 kategori sekmesi (vst_preset / mic_chain / mix_template / mastering_chain / benim_yüklediklerim) gerçek veriyle dolar
- **FR-6**: Login/Register Supabase Auth ile çalışır, session yoksa /login'e yönlendirir
- **FR-7**: Her sayfa RoleGate ile korunur (izin yoksa fallback görünür)
- **FR-8**: Her create/edit/delete/download butonu RoleGate ile korunur

## Non-Functional Requirements
- **NFR-1**: Supabase çağrıları try/catch ile hataları yakalar, boş array döndürmez
- **NFR-2**: Loading state (skeleton/spinner) her listede olur
- **NFR-3**: Demo localStorage rolü Supabase profil rolü ile senkron: DB rolü öncelikli
- **NFR-4**: Mevcut mock veri yapısı bozulmaz (fallback olarak kademeli geçiş

## Constraints
- **Teknik**: Next.js App Router + Supabase SSR + Client Components (use client) korunur
- **İş**: 5 AppRole + ROLE_PERMISSINGS değişmeden korunur
- **Bağımlılık**: Kullanıcı .env.local NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY doldurmak zorunda (manuel)

## Assumptions
- Kullanıcı .env.local anahtarlarını dolduracak
- Migration 0001 remote Supabase'e uygulanacak
- İlk test kayıtlar manuel eklenecek (seed script opsiyonel)

## Acceptance Criteria

### AC-1: Beats sayfası canlı veri
- **Type**: `rule`
- **Given**: .env.local geçerli URL+anon key, migration uygulanmış, beats tablosunda kayıt var
- **When**: /beats açılır
- **Then**: Listeyi DB'den gelir, filtreler çalışır, kartlar render olur, detaya girer
- **Pass Condition**: Ağ panelde 404/500 hatası olmaz
- **Evidence**: Browser console hata ücretsiz, Network tabında supabase istekleri başarılı

### AC-2: FileUpload Storage bağlantısı
- **Type**: `rule`
- **Given**: Bucket public URL + policy izinleri uygun
- **When**: /beats/new'den yeni beat ses dosyası yüklenir
- **Then**: Storage'a yüklenir, kaydedilen URL kaydedilir, sonra wavesurfer'da çalar
- **Pass Condition**: Supabase Storage > Bucket'de dosya görünür
- **Evidence**: Storage bucket list + wavesurfer player çalışır

### AC-3: Presets kategori sekmeleri
- **Type**: `rule`
- **Given**: Presets tablosunda 4 kategori için kayıt var
- **When**: /presets açılır, her sekmeye tıklanır
- **Then**: İlgili kategorinin kart grid'i render olur, "listelenecek..." görünmez
- **Pass Condition**: 4 sekmenin hepsinde grid var
- **Evidence**: Her sekme için ayrı grid + kategori filtre + sayfaya özel upload CTA

### AC-4: RBAC sayfa koruması
- **Type**: `rule`
- **Given**: Demo rolü seçilebilir, RoleGate mevcut
- **When**: Vocalist rolü ile /finances /inventory /equipment sayfasına gidilir
- **Then**: Yetkisiz görünür, fallback UI gösterilir
- **Pass Condition**: 5 rol için ROLE_PERMISSINGS matrisi uyar
- **Evidence**: Her rolde erişim denemeleri + console log

### AC-5: Genel tutarlılık (rubric)
- **Type**: `rubric`
- **Dimension**: Tüm 17 sayfada mock → canlı geçiş oranı
- **Scale**: 1-5
- **Anchors**: 1=0 sayfa; 3=8 sayfa; 5=17/17
- **Pass Threshold**: >= 3 (en az 8 kritik sayfa)
- **Evidence**: tasks.md biten her sayfa status = completed listesi

## Open Questions
- [x] Hangi sırada sayfalar bağlanacak? → Önce en kritik: beats → sessions → tasks → splits → finances → calendar → equipment/inventory → presets/samples/references → release/lyric → settings/team/dashboard
