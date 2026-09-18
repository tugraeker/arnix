# Arnix Phase-D — Uygulama Planı

## Task 1: useSupabaseQuery hook + data helpers
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Yeniden kullanılabilir `useSupabaseQuery(table, options) custom hook: select, loading, error, data döndürür
  - `createCRUDHelpers(table)` yardımcı: insert/update/delete + revalidate
  - Supabase null safe (window guard mevcut client'ı kullan
  - Hook Demo fallback: Supabase erişilemezse eski mock array geri döndürür (kullanıcı .env doldurmayınca canlıya geçiş sorunsuz)
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `rule` TR-1.1: Hook import edilip herhangi bir sayfada test edildiğinde loading/data state'i correct; Supabase yoksa mock fallback data döndürür, console error ve crash yok
  - `rule` TR-1.2: createCRUDHelpers insert/update delete çağırınca değişiklik yansır, tekrar select ile veri güncellenir
  - `rubric` TR-1.3: Hook esneklik; ölçek; 1-5; 1=tek tablo; 3=8 tablo; 5=tüm 26 tablo; >=3

## Task 2: Auth akışı — login/page + profile middleware entegrasyon
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - /login + /register Supabase Auth signInWithPassword + signUp
  - handle_new_user trigger ile profile.id auth.users.id'den profiles tablosuna kayıt eklenir
  - Middleware'da session check → dashboard/login yönlendirme çalışır
  - Profile rolü → localStorage arnix_user_role ile senkron; DB'deki profile.role öncelikli
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `rule` TR-2.1: Giriş yapınca /dashboard'a yönlendirilir
  - `rule` TR-2.2: Session yoksa /dashboard route'ları /login'e düşer
  - `rule` TR-2.3: Çıkış yapınca localStorage temizlenir, /login'e yönlendirilir

## Task 3: Storage bağlantısı — WavesurferPlayer + FileUpload Storage'a bağla
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - FileUpload `onUpload` default prop: belirtilen bucket_id + path + supabase.storage.from(...).upload + publicUrl → Promise
  - WavesurferPlayer storage public url ile düzgün waveform çizer
  - 9 bucket id constants'tan uygun olanı (presets / samples / beats_audio vb her yerde kullanılır
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `rule` TR-3.1: Audio dosya yükle → bucket'da görünür → URL döner
  - `rule` TR-3.2: Wavesurfer bu URL ile play düzgün waveform çalar (compact+full varyant
  - `rule` TR-3.3: Hata (dosya çok büyük / tip yanlış / bucket yok) → kullanıcıya error gösterir, crash olmaz

## Task 4: Kritik sayfalar — Beats (list, detail, new) canlı Supabase bağlantısı
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1, 3
- **Description**:
  - /beats (liste): BEATS mock yerine useSupabaseQuery + filters / beats tablosu (relations: versions, created_by profile)
  - /beats/[id] (detay): supabase select + split/task/comment ilişkileri
  - /beats/new (form): insert + upload beat kaydet → supabase insert → Storage'a audio/artwork/archive yükle → sonra detaya yönlendir
  - Filtrerleme (search, tür, anahtar) client-side değil, client filter yerine supabase filter kullan (eq, ilike, gte vb)
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `rule` TR-4.1: /beats açılır → loading → data → filters → kartlar → detay → geri gelir (çökme yok
  - `rule` TR-4.2: Yeni beat kaydedilir (form valid) → /beats/:id yönlendirme → Wavesurfer player yüklenen dosyayı çalar
  - `rule` TR-4.3: Genre/Key/BPM filter'lari supabase ile filtreler doğru sonuçlar true dönüyor

## Task 5: Kritik sayfalar — Tasks + Sessions + Split Sheets canlı bağlantı
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - tasks: KANBAN/LİSTE/SON TARİH viewları, assignee relation, beat relation, due_date
  - session-notes: LIST/BOARD/TIMELINE
  - split-sheets: 3 TAB, 5 hak paylaşımları tablosu, imzalar, gelir simülatör client-side (düz SQL)
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `rule` TR-5.1: /tasks kanban kolonlarında status göre gruplanmış veriler doğru gösterilir
  - `rule` TR-5.2: Session notes (3 view modu hepsi) çalışır, yeni not ekler
  - `rule` TR-5.3: Split Sheets create form kaydedilir, ilişkili kişi ekler, oran toplam %100 check UI doğru

## Task 6: Kritik sayfalar — Finans + Calendar + Equipment/Inventory
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 5
- **Description**:
  - finances: 15 aylık bar chart data (agg), banka kart, işlem tablosu, faturalar
  - studio/calendar: WEEK / RESOURCE / DAY view, kaynak kullanım oranları
  - equipment + inventory: CRUD list+grid+table+detail
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `rule` TR-6.1: Finans toplamlar ve 12 aylık chart correct
  - `rule` TR-6.2: Calendar booking çakışma alerti çalışır
  - `rule` TR-6.3: Equipment + Inventory stok + yeniden sipariş hesapları doğru

## Task 7: Polish — Presets kategori tabları UI + tüm placeholder doldur
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 6
- **Description**:
  - /presets (L357-367) 4 kategori (vst_preset, mic_chain, mix_template, mastering_chain) TabsContent yerine gerçek PRESETS benzer grid + category filtresi ekle
  - Tüm sayfalarda küçük polish: scroll/responsive/hizalama hatalar düzelt (varsa)
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `rule` TR-7.1: 4 kategori sekmesi açılır açılmaz grid render olur
  - `rule` TR-7.2: "Benim yüklediklerim" sekmesine upload edilince orada görünür
  - `rubric` TR-7.3: UI tutarlılığı; 1-5; 1=kırık; 3=uygun; 5=akıcı; >=3

## Task 8: RBAC tüm sayfalar + butonlar
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 7
- **Description**:
  - /dashboard ana giriş RoleGate dashboard:admin, producer, vocalist, songwriter, engineer → fallback
  - Sayfalar: ROLE_PERMISSIONS'a göre her sayfa için permission="modül:action"
  - Butonlar: create/edit/delete/download her buton için RoleGate + ROLE_PERMISSIONS (permission match
  - Topbar Quick actions rollere göre gizle
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `rule` TR-8.1: Her rol için erişim engellenen sayfalar fallback görünür (hatasız)
  - `rule` TR-8.2: Her buton (create/delete) rolü olmayan kullanıcıda görünmez / fallback göster
  - `rule` TR-8.3: Topbar demo rol değişimi → sidebar / sayfa izinleri anlık güncellenir

## Task 9: Kalan sayfalar (Samples / References / Release Calendar / Lyric Pad / Team / Settings / Home Dashboard
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 8
- **Description**:
  - Bütün kalan sayfaları canlı Supabase bağla (önceki paterni kullan, bitmemiş 9 sayfa
  - Home Dashboard: Bugünkü bookings / tasks / son beats / ekip online → birleştirilmiş veri 4 query
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `rule` TR-9.1: Her kalan her sayfada Supabase'den veri çekilir
  - `rule` TR-9.2: Release Calendar 3 view (MONTH / TIMELINE / PIPELINE)
  - `rule` TR-9.3: Settings / Team profil + davetler + leaderboard correct
