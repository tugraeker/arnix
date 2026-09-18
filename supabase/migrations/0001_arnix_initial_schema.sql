-- =====================================================
-- ARNIX - Müzik Stüdyosu İş İstasyonu | Supabase Schema
-- =====================================================

-- ========== EXTENSIONS ==========
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========== ENUM TİPLERİ ==========
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('admin', 'producer', 'vocalist', 'songwriter', 'engineer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE beat_type AS ENUM ('available', 'for_sale', 'demo', 'mix_pending', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE team_status AS ENUM ('available', 'busy', 'studio', 'offline');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE booking_type AS ENUM ('recording', 'mixing', 'mastering', 'songwriting', 'rehearsal');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE equipment_category AS ENUM ('microphone', 'audio_interface', 'headphone', 'speaker', 'midi_controller', 'cable', 'plugin_license', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE equipment_status AS ENUM ('available', 'in_use', 'maintenance', 'broken', 'lost');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE preset_category AS ENUM ('vst_preset', 'mic_chain', 'mix_template', 'mastering_chain');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE sample_category AS ENUM ('drum_kit', 'loop', 'one_shot', 'vocal_chopped', 'sfx');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE sample_source_type AS ENUM ('royalty_free', 'original_production', 'licensed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE split_role AS ENUM ('producer', 'vocalist', 'songwriter', 'feature', 'executive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE release_status AS ENUM ('planned', 'submitted', 'released');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('task_assigned', 'beat_version', 'comment', 'booking_reminder', 'preset_shared', 'split_created');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE finance_type AS ENUM ('income', 'expense');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE inventory_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ========== PROFİL TABLOSU (auth.users ile 1:1) ==========
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    role app_role NOT NULL DEFAULT 'vocalist',
    avatar_url TEXT,
    bio TEXT,
    status team_status NOT NULL DEFAULT 'offline',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========== BEATS ==========
CREATE TABLE IF NOT EXISTS public.beats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    bpm INTEGER NOT NULL DEFAULT 120,
    musical_key TEXT NOT NULL DEFAULT 'C Minor',
    genre TEXT NOT NULL DEFAULT 'Trap',
    tags TEXT[] NOT NULL DEFAULT '{}',
    type beat_type NOT NULL DEFAULT 'demo',
    cover_image_url TEXT,
    description TEXT,
    project_archive_url TEXT,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_beats_created_by ON public.beats(created_by);
CREATE INDEX IF NOT EXISTS idx_beats_type ON public.beats(type);
CREATE INDEX IF NOT EXISTS idx_beats_genre ON public.beats(genre);

-- ========== BEAT VERSIONS ==========
CREATE TABLE IF NOT EXISTS public.beat_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id UUID NOT NULL REFERENCES public.beats(id) ON DELETE CASCADE,
    version_name TEXT NOT NULL DEFAULT 'v1',
    audio_url TEXT NOT NULL,
    notes TEXT,
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_beat_versions_beat ON public.beat_versions(beat_id);
CREATE INDEX IF NOT EXISTS idx_beat_versions_created ON public.beat_versions(created_at DESC);

-- ========== ZAMAN DAMGALI YORUMLAR ==========
CREATE TABLE IF NOT EXISTS public.timecoded_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_version_id UUID NOT NULL REFERENCES public.beat_versions(id) ON DELETE CASCADE,
    commenter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    timestamp_seconds NUMERIC(8, 2),
    content TEXT NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_version ON public.timecoded_comments(beat_version_id);

-- ========== SÖZLER (LYRIC PAD) ==========
CREATE TABLE IF NOT EXISTS public.lyrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id UUID NOT NULL REFERENCES public.beats(id) ON DELETE CASCADE,
    section TEXT,
    content TEXT,
    timestamp_start NUMERIC(8, 2),
    timestamp_end NUMERIC(8, 2),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lyrics_beat ON public.lyrics(beat_id);
CREATE INDEX IF NOT EXISTS idx_lyrics_order ON public.lyrics(order_index);

-- ========== STÜDYO RANDEVULARI ==========
CREATE TABLE IF NOT EXISTS public.studio_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    booked_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    booking_type booking_type NOT NULL DEFAULT 'recording',
    color TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_start ON public.studio_bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_booker ON public.studio_bookings(booked_by);

-- ========== EKİPMANLAR ==========
CREATE TABLE IF NOT EXISTS public.equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category equipment_category NOT NULL DEFAULT 'other',
    serial_number TEXT,
    purchase_date DATE,
    warranty_end DATE,
    current_holder_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status equipment_status NOT NULL DEFAULT 'available',
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_status ON public.equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON public.equipment(category);

-- ========== EKİPMAN TESLİM KAYITLARI ==========
CREATE TABLE IF NOT EXISTS public.equipment_checkout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
    checked_out_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    checked_out_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    returned_at TIMESTAMPTZ,
    condition_notes TEXT
);

-- ========== ENVANTER (Küçük ekipmanlar) ==========
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    location TEXT,
    status inventory_status NOT NULL DEFAULT 'in_stock',
    notes TEXT,
    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========== SPLIT SHEET (TELİF PAYI) ==========
CREATE TABLE IF NOT EXISTS public.split_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id UUID REFERENCES public.beats(id) ON DELETE CASCADE UNIQUE,
    title TEXT NOT NULL,
    master_percentage_total NUMERIC(5, 2) NOT NULL DEFAULT 100,
    mechanical_percentage_total NUMERIC(5, 2) NOT NULL DEFAULT 100,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.split_sheet_contributors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    split_sheet_id UUID NOT NULL REFERENCES public.split_sheets(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    contributor_name TEXT,
    role split_role NOT NULL DEFAULT 'producer',
    master_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    mechanical_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_split_contributors_sheet ON public.split_sheet_contributors(split_sheet_id);

-- ========== PRESETLER ==========
CREATE TABLE IF NOT EXISTS public.presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    plugin_name TEXT,
    category preset_category NOT NULL DEFAULT 'vst_preset',
    type TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT,
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    download_count INTEGER NOT NULL DEFAULT 0,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_presets_category ON public.presets(category);
CREATE INDEX IF NOT EXISTS idx_presets_uploader ON public.presets(uploader_id);

-- ========== GÖREVLER ==========
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id UUID REFERENCES public.beats(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status task_status NOT NULL DEFAULT 'todo',
    priority task_priority NOT NULL DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_beat ON public.project_tasks(beat_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.project_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.project_tasks(status);

-- ========== REFERANS PARÇALAR ==========
CREATE TABLE IF NOT EXISTS public.reference_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id UUID NOT NULL REFERENCES public.beats(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    artist TEXT,
    url TEXT,
    file_url TEXT,
    notes TEXT,
    added_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========== MIX CHECKLIST ==========
CREATE TABLE IF NOT EXISTS public.mix_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id UUID NOT NULL REFERENCES public.beats(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INTEGER NOT NULL DEFAULT 0,
    checked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    checked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mixchecklist_beat ON public.mix_checklists(beat_id);

-- ========== SEANS NOTLARI ==========
CREATE TABLE IF NOT EXISTS public.session_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_booking_id UUID REFERENCES public.studio_bookings(id) ON DELETE SET NULL,
    beat_id UUID REFERENCES public.beats(id) ON DELETE SET NULL,
    title TEXT,
    content TEXT NOT NULL,
    microphone_used TEXT,
    preamp_used TEXT,
    acoustics_notes TEXT,
    artist_notes TEXT,
    best_take_info TEXT,
    written_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========== SAMPLE & LOOP YÖNETİMİ ==========
CREATE TABLE IF NOT EXISTS public.samples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category sample_category NOT NULL DEFAULT 'loop',
    genre TEXT,
    source_type sample_source_type NOT NULL DEFAULT 'royalty_free',
    source_url TEXT,
    copyright_info TEXT,
    file_url TEXT NOT NULL,
    bpm INTEGER,
    musical_key TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sample_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sample_id UUID NOT NULL REFERENCES public.samples(id) ON DELETE CASCADE,
    beat_id UUID NOT NULL REFERENCES public.beats(id) ON DELETE CASCADE,
    notes TEXT,
    UNIQUE(sample_id, beat_id)
);

CREATE INDEX IF NOT EXISTS idx_samples_category ON public.samples(category);

-- ========== GELİR/GİDER ==========
CREATE TABLE IF NOT EXISTS public.finance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type finance_type NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    related_beat_id UUID REFERENCES public.beats(id) ON DELETE SET NULL,
    recorded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_date ON public.finance_records(date);
CREATE INDEX IF NOT EXISTS idx_finance_type ON public.finance_records(type);

-- ========== YAYIN TAKVİMİ ==========
CREATE TABLE IF NOT EXISTS public.release_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beat_id UUID REFERENCES public.beats(id) ON DELETE SET NULL,
    song_title TEXT NOT NULL,
    artist_name TEXT,
    cover_image_url TEXT,
    release_date TIMESTAMPTZ NOT NULL,
    platforms TEXT[] NOT NULL DEFAULT '{}',
    status release_status NOT NULL DEFAULT 'planned',
    social_media_caption TEXT,
    hashtags TEXT[] NOT NULL DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_release_date ON public.release_plans(release_date);
CREATE INDEX IF NOT EXISTS idx_release_status ON public.release_plans(status);

-- ========== BAŞARIMLAR ==========
CREATE TABLE IF NOT EXISTS public.team_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    badge_icon TEXT,
    awarded_to UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    awarded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    beat_id UUID REFERENCES public.beats(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========== BİLDİRİMLER ==========
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    related_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- ========== updated_at TRIGGER ==========
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'profiles','beats','lyrics','split_sheets','presets',
        'project_tasks','session_notes','release_plans'
    ] LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I_updated_at_trigger ON %I', t, t);
        EXECUTE format('CREATE TRIGGER %I_updated_at_trigger
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t, t);
    END LOOP;
END $$;

-- ========== AUTH.USERS -> PROFILES TRIGGER ==========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(
            (NEW.raw_user_meta_data->>'role')::app_role,
            'vocalist'::app_role
        ),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== RLS ENABLE ==========
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beat_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timecoded_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_checkout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.split_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.split_sheet_contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mix_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ========== YARDIMCI FONKSİYON ==========
CREATE OR REPLACE FUNCTION public.get_profile_role(uid UUID)
RETURNS app_role AS $$
    SELECT role FROM public.profiles WHERE id = uid LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- ========== RLS POLICIES ==========

-- PROFILES
DROP POLICY IF EXISTS "Profiles: okuma" ON public.profiles;
CREATE POLICY "Profiles: okuma" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Profiles: kendi güncelle" ON public.profiles;
CREATE POLICY "Profiles: kendi güncelle" ON public.profiles FOR UPDATE
USING (id = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- BEATS (Tüm kayıtlı kullanıcılar okur, yaratıcı ve admin değiştirir)
DROP POLICY IF EXISTS "Beats: okuma" ON public.beats;
CREATE POLICY "Beats: okuma" ON public.beats FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Beats: ekleme" ON public.beats;
CREATE POLICY "Beats: ekleme" ON public.beats FOR INSERT
WITH CHECK (created_by = auth.uid() OR public.get_profile_role(auth.uid()) IN ('admin','producer','engineer'));

DROP POLICY IF EXISTS "Beats: güncelleme" ON public.beats;
CREATE POLICY "Beats: güncelleme" ON public.beats FOR UPDATE
USING (created_by = auth.uid() OR public.get_profile_role(auth.uid()) IN ('admin','producer','engineer'));

DROP POLICY IF EXISTS "Beats: silme" ON public.beats;
CREATE POLICY "Beats: silme" ON public.beats FOR DELETE
USING (created_by = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- BEAT VERSIONS
DROP POLICY IF EXISTS "BeatVersions: okuma" ON public.beat_versions;
CREATE POLICY "BeatVersions: okuma" ON public.beat_versions FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "BeatVersions: ekleme" ON public.beat_versions;
CREATE POLICY "BeatVersions: ekleme" ON public.beat_versions FOR INSERT
WITH CHECK (created_by = auth.uid() OR public.get_profile_role(auth.uid()) IN ('admin','producer','engineer','vocalist'));

DROP POLICY IF EXISTS "BeatVersions: güncelleme" ON public.beat_versions;
CREATE POLICY "BeatVersions: güncelleme" ON public.beat_versions FOR UPDATE
USING (created_by = auth.uid() OR public.get_profile_role(auth.uid()) IN ('admin','producer','engineer'));

DROP POLICY IF EXISTS "BeatVersions: silme" ON public.beat_versions;
CREATE POLICY "BeatVersions: silme" ON public.beat_versions FOR DELETE
USING (created_by = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- TIMECODED COMMENTS
DROP POLICY IF EXISTS "Comments: okuma" ON public.timecoded_comments;
CREATE POLICY "Comments: okuma" ON public.timecoded_comments FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Comments: ekleme" ON public.timecoded_comments;
CREATE POLICY "Comments: ekleme" ON public.timecoded_comments FOR INSERT
WITH CHECK (commenter_id = auth.uid());

DROP POLICY IF EXISTS "Comments: güncelleme" ON public.timecoded_comments;
CREATE POLICY "Comments: güncelleme" ON public.timecoded_comments FOR UPDATE
USING (commenter_id = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- LYRICS
DROP POLICY IF EXISTS "Lyrics: okuma" ON public.lyrics;
CREATE POLICY "Lyrics: okuma" ON public.lyrics FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Lyrics: yazma" ON public.lyrics;
CREATE POLICY "Lyrics: yazma" ON public.lyrics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Lyrics: güncelleme" ON public.lyrics;
CREATE POLICY "Lyrics: güncelleme" ON public.lyrics FOR UPDATE
USING (created_by = auth.uid() OR public.get_profile_role(auth.uid()) IN ('admin','vocalist','songwriter','producer'));

DROP POLICY IF EXISTS "Lyrics: silme" ON public.lyrics;
CREATE POLICY "Lyrics: silme" ON public.lyrics FOR DELETE
USING (created_by = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- STUDIO BOOKINGS
DROP POLICY IF EXISTS "Bookings: okuma" ON public.studio_bookings;
CREATE POLICY "Bookings: okuma" ON public.studio_bookings FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Bookings: ekleme" ON public.studio_bookings;
CREATE POLICY "Bookings: ekleme" ON public.studio_bookings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Bookings: güncelleme" ON public.studio_bookings;
CREATE POLICY "Bookings: güncelleme" ON public.studio_bookings FOR UPDATE
USING (booked_by = auth.uid() OR public.get_profile_role(auth.uid()) IN ('admin','engineer'));

DROP POLICY IF EXISTS "Bookings: silme" ON public.studio_bookings;
CREATE POLICY "Bookings: silme" ON public.studio_bookings FOR DELETE
USING (booked_by = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- EQUIPMENT
DROP POLICY IF EXISTS "Equipment: okuma" ON public.equipment;
CREATE POLICY "Equipment: okuma" ON public.equipment FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Equipment: admin tüm işlemler" ON public.equipment;
CREATE POLICY "Equipment: admin tüm işlemler" ON public.equipment FOR ALL
USING (public.get_profile_role(auth.uid()) IN ('admin','engineer'))
WITH CHECK (public.get_profile_role(auth.uid()) IN ('admin','engineer'));

-- EQUIPMENT CHECKOUT LOGS
DROP POLICY IF EXISTS "CheckoutLogs: okuma" ON public.equipment_checkout_logs;
CREATE POLICY "CheckoutLogs: okuma" ON public.equipment_checkout_logs FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "CheckoutLogs: yazma" ON public.equipment_checkout_logs;
CREATE POLICY "CheckoutLogs: yazma" ON public.equipment_checkout_logs FOR INSERT
WITH CHECK (public.get_profile_role(auth.uid()) IN ('admin','engineer'));

DROP POLICY IF EXISTS "CheckoutLogs: güncelleme" ON public.equipment_checkout_logs;
CREATE POLICY "CheckoutLogs: güncelleme" ON public.equipment_checkout_logs FOR UPDATE
USING (public.get_profile_role(auth.uid()) IN ('admin','engineer'));

-- INVENTORY
DROP POLICY IF EXISTS "Inventory: okuma" ON public.inventory_items;
CREATE POLICY "Inventory: okuma" ON public.inventory_items FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Inventory: admin/engineer" ON public.inventory_items;
CREATE POLICY "Inventory: admin/engineer" ON public.inventory_items FOR ALL
USING (public.get_profile_role(auth.uid()) IN ('admin','engineer'))
WITH CHECK (public.get_profile_role(auth.uid()) IN ('admin','engineer'));

-- SPLIT SHEETS
DROP POLICY IF EXISTS "SplitSheets: okuma" ON public.split_sheets;
CREATE POLICY "SplitSheets: okuma" ON public.split_sheets FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "SplitSheets: yazma" ON public.split_sheets;
CREATE POLICY "SplitSheets: yazma" ON public.split_sheets FOR INSERT
WITH CHECK (public.get_profile_role(auth.uid()) IN ('admin','producer'));

DROP POLICY IF EXISTS "SplitSheets: güncelleme" ON public.split_sheets;
CREATE POLICY "SplitSheets: güncelleme" ON public.split_sheets FOR UPDATE
USING (created_by = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- Split Sheet Contributors
DROP POLICY IF EXISTS "SplitContributors: okuma" ON public.split_sheet_contributors;
CREATE POLICY "SplitContributors: okuma" ON public.split_sheet_contributors FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "SplitContributors: yazma" ON public.split_sheet_contributors;
CREATE POLICY "SplitContributors: yazma" ON public.split_sheet_contributors FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.split_sheets s WHERE s.id = split_sheet_id
      AND (s.created_by = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin'))
);

-- PRESETS
DROP POLICY IF EXISTS "Presets: okuma" ON public.presets;
CREATE POLICY "Presets: okuma" ON public.presets FOR SELECT
USING (is_public = TRUE OR uploader_id = auth.uid() OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Presets: ekleme" ON public.presets;
CREATE POLICY "Presets: ekleme" ON public.presets FOR INSERT
WITH CHECK (uploader_id = auth.uid());

DROP POLICY IF EXISTS "Presets: güncelleme" ON public.presets;
CREATE POLICY "Presets: güncelleme" ON public.presets FOR UPDATE
USING (uploader_id = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Presets: silme" ON public.presets;
CREATE POLICY "Presets: silme" ON public.presets FOR DELETE
USING (uploader_id = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- PROJECT TASKS
DROP POLICY IF EXISTS "Tasks: okuma" ON public.project_tasks;
CREATE POLICY "Tasks: okuma" ON public.project_tasks FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Tasks: ekleme" ON public.project_tasks;
CREATE POLICY "Tasks: ekleme" ON public.project_tasks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Tasks: güncelleme" ON public.project_tasks;
CREATE POLICY "Tasks: güncelleme" ON public.project_tasks FOR UPDATE
USING (
    created_by = auth.uid() OR
    assignee_id = auth.uid() OR
    public.get_profile_role(auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Tasks: silme" ON public.project_tasks;
CREATE POLICY "Tasks: silme" ON public.project_tasks FOR DELETE
USING (created_by = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- REFERENCE TRACKS
DROP POLICY IF EXISTS "Reference: okuma" ON public.reference_tracks;
CREATE POLICY "Reference: okuma" ON public.reference_tracks FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Reference: yazma" ON public.reference_tracks;
CREATE POLICY "Reference: yazma" ON public.reference_tracks FOR ALL
USING (added_by = auth.uid() OR public.get_profile_role(auth.uid()) IN ('admin','producer','vocalist'));

-- MIX CHECKLIST
DROP POLICY IF EXISTS "MixChecklist: okuma" ON public.mix_checklists;
CREATE POLICY "MixChecklist: okuma" ON public.mix_checklists FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "MixChecklist: yazma" ON public.mix_checklists;
CREATE POLICY "MixChecklist: yazma" ON public.mix_checklists FOR ALL
USING (public.get_profile_role(auth.uid()) IN ('admin','engineer','producer'));

-- SESSION NOTES
DROP POLICY IF EXISTS "Session: okuma" ON public.session_notes;
CREATE POLICY "Session: okuma" ON public.session_notes FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Session: yazma" ON public.session_notes;
CREATE POLICY "Session: yazma" ON public.session_notes FOR INSERT
WITH CHECK (written_by = auth.uid() OR public.get_profile_role(auth.uid()) IN ('admin','engineer','producer','vocalist'));

DROP POLICY IF EXISTS "Session: güncelleme" ON public.session_notes;
CREATE POLICY "Session: güncelleme" ON public.session_notes FOR UPDATE
USING (written_by = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Session: silme" ON public.session_notes;
CREATE POLICY "Session: silme" ON public.session_notes FOR DELETE
USING (written_by = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- SAMPLES
DROP POLICY IF EXISTS "Samples: okuma" ON public.samples;
CREATE POLICY "Samples: okuma" ON public.samples FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Samples: ekleme" ON public.samples;
CREATE POLICY "Samples: ekleme" ON public.samples FOR INSERT
WITH CHECK (uploader_id = auth.uid() OR public.get_profile_role(auth.uid()) IN ('admin','producer'));

DROP POLICY IF EXISTS "Samples: güncelleme" ON public.samples;
CREATE POLICY "Samples: güncelleme" ON public.samples FOR UPDATE
USING (uploader_id = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Samples: silme" ON public.samples;
CREATE POLICY "Samples: silme" ON public.samples FOR DELETE
USING (uploader_id = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- SAMPLE USAGES
DROP POLICY IF EXISTS "SampleUsages: okuma" ON public.sample_usages;
CREATE POLICY "SampleUsages: okuma" ON public.sample_usages FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "SampleUsages: yazma" ON public.sample_usages;
CREATE POLICY "SampleUsages: yazma" ON public.sample_usages FOR ALL
USING (public.get_profile_role(auth.uid()) IN ('admin','producer'));

-- FINANCE RECORDS
DROP POLICY IF EXISTS "Finance: okuma" ON public.finance_records;
CREATE POLICY "Finance: okuma" ON public.finance_records FOR SELECT
USING (public.get_profile_role(auth.uid()) IN ('admin','producer','engineer'));

DROP POLICY IF EXISTS "Finance: yazma" ON public.finance_records;
CREATE POLICY "Finance: yazma" ON public.finance_records FOR ALL
USING (public.get_profile_role(auth.uid()) = 'admin');

-- RELEASE PLANS
DROP POLICY IF EXISTS "Release: okuma" ON public.release_plans;
CREATE POLICY "Release: okuma" ON public.release_plans FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Release: yazma" ON public.release_plans;
CREATE POLICY "Release: yazma" ON public.release_plans FOR ALL
USING (public.get_profile_role(auth.uid()) IN ('admin','producer'));

-- TEAM ACHIEVEMENTS
DROP POLICY IF EXISTS "Achievements: okuma" ON public.team_achievements;
CREATE POLICY "Achievements: okuma" ON public.team_achievements FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Achievements: yazma" ON public.team_achievements;
CREATE POLICY "Achievements: yazma" ON public.team_achievements FOR ALL
USING (public.get_profile_role(auth.uid()) = 'admin');

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Notifications: kendi okuma" ON public.notifications;
CREATE POLICY "Notifications: kendi okuma" ON public.notifications FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Notifications: kendi güncelle" ON public.notifications;
CREATE POLICY "Notifications: kendi güncelle" ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Notifications: sistem ekleme" ON public.notifications;
CREATE POLICY "Notifications: sistem ekleme" ON public.notifications FOR INSERT
WITH CHECK (user_id = auth.uid() OR public.get_profile_role(auth.uid()) = 'admin');

-- ========== STORAGE BUCKET'LARI ==========
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('beat_audio', 'beat_audio', TRUE),
    ('beat_covers', 'beat_covers', TRUE),
    ('project_archives', 'project_archives', FALSE),
    ('presets', 'presets', FALSE),
    ('samples', 'samples', TRUE),
    ('session_attachments', 'session_attachments', FALSE),
    ('avatars', 'avatars', TRUE),
    ('finance_attachments', 'finance_attachments', FALSE),
    ('release_covers', 'release_covers', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ========== STORAGE POLICIES ==========
-- Beat Audio (genel okuma)
DROP POLICY IF EXISTS "BeatAudio: okuma" ON storage.objects;
CREATE POLICY "BeatAudio: okuma" ON storage.objects FOR SELECT
USING (bucket_id = 'beat_audio' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "BeatAudio: yazma" ON storage.objects;
CREATE POLICY "BeatAudio: yazma" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'beat_audio' AND (public.get_profile_role(auth.uid()) IN ('admin','producer','engineer','vocalist')));

-- Beat Covers
DROP POLICY IF EXISTS "BeatCovers: okuma" ON storage.objects;
CREATE POLICY "BeatCovers: okuma" ON storage.objects FOR SELECT
USING (bucket_id = 'beat_covers');

DROP POLICY IF EXISTS "BeatCovers: yazma" ON storage.objects;
CREATE POLICY "BeatCovers: yazma" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'beat_covers' AND auth.uid() IS NOT NULL);

-- Project Archives (ZIP/RAR) - sadece giriş yapmış
DROP POLICY IF EXISTS "ProjectArchives: okuma" ON storage.objects;
CREATE POLICY "ProjectArchives: okuma" ON storage.objects FOR SELECT
USING (bucket_id = 'project_archives' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "ProjectArchives: yazma" ON storage.objects;
CREATE POLICY "ProjectArchives: yazma" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project_archives' AND (public.get_profile_role(auth.uid()) IN ('admin','producer','engineer')));

-- Presets
DROP POLICY IF EXISTS "Presets: okuma" ON storage.objects;
CREATE POLICY "Presets: okuma" ON storage.objects FOR SELECT
USING (bucket_id = 'presets' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Presets: yazma" ON storage.objects;
CREATE POLICY "Presets: yazma" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'presets' AND auth.uid() IS NOT NULL);

-- Samples
DROP POLICY IF EXISTS "Samples: okuma" ON storage.objects;
CREATE POLICY "Samples: okuma" ON storage.objects FOR SELECT
USING (bucket_id = 'samples');

DROP POLICY IF EXISTS "Samples: yazma" ON storage.objects;
CREATE POLICY "Samples: yazma" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'samples' AND (public.get_profile_role(auth.uid()) IN ('admin','producer')));

-- Session Attachments
DROP POLICY IF EXISTS "Session: okuma" ON storage.objects;
CREATE POLICY "Session: okuma" ON storage.objects FOR SELECT
USING (bucket_id = 'session_attachments' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Session: yazma" ON storage.objects;
CREATE POLICY "Session: yazma" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'session_attachments' AND auth.uid() IS NOT NULL);

-- Avatars
DROP POLICY IF EXISTS "Avatars: okuma" ON storage.objects;
CREATE POLICY "Avatars: okuma" ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatars: yazma" ON storage.objects;
CREATE POLICY "Avatars: yazma" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

-- Finance Attachments
DROP POLICY IF EXISTS "Finance: okuma" ON storage.objects;
CREATE POLICY "Finance: okuma" ON storage.objects FOR SELECT
USING (bucket_id = 'finance_attachments' AND public.get_profile_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Finance: yazma" ON storage.objects;
CREATE POLICY "Finance: yazma" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'finance_attachments' AND public.get_profile_role(auth.uid()) = 'admin');

-- Release Covers
DROP POLICY IF EXISTS "ReleaseCovers: okuma" ON storage.objects;
CREATE POLICY "ReleaseCovers: okuma" ON storage.objects FOR SELECT
USING (bucket_id = 'release_covers');

DROP POLICY IF EXISTS "ReleaseCovers: yazma" ON storage.objects;
CREATE POLICY "ReleaseCovers: yazma" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'release_covers' AND (public.get_profile_role(auth.uid()) IN ('admin','producer')));
