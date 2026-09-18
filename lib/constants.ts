import type { LucideIcon } from "lucide-react";

export const APP_ROLES = {
  ADMIN: "admin",
  PRODUCER: "producer",
  VOCALIST: "vocalist",
  SONGWRITER: "songwriter",
  ENGINEER: "engineer",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Yönetici",
  producer: "Yapımcı",
  vocalist: "Vokalist",
  songwriter: "Söz Yazarı",
  engineer: "Ses Mühendisi",
};

export const ROLE_COLORS: Record<AppRole, string> = {
  admin: "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
  producer: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  vocalist: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
  songwriter: "bg-neon-green/20 text-neon-green border-neon-green/30",
  engineer: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
};

export const BEAT_TYPES = {
  AVAILABLE: "available",
  FOR_SALE: "for_sale",
  DEMO: "demo",
  MIX_PENDING: "mix_pending",
  COMPLETED: "completed",
} as const;

export type BeatType = (typeof BEAT_TYPES)[keyof typeof BEAT_TYPES];

export const BEAT_TYPE_LABELS: Record<BeatType, string> = {
  available: "Boşta",
  for_sale: "Satışta",
  demo: "Demo",
  mix_pending: "Mix Bekliyor",
  completed: "Tamamlandı",
};

export const BEAT_TYPE_COLORS: Record<BeatType, string> = {
  available: "bg-neon-green/20 text-neon-green border-neon-green/30",
  for_sale: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  demo: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
  mix_pending: "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
  completed: "bg-primary/20 text-primary border-primary/30",
};

export const MUSICAL_KEYS = [
  "C Major", "C Minor", "C# Major", "C# Minor",
  "D Major", "D Minor", "D# Major", "D# Minor",
  "E Major", "E Minor",
  "F Major", "F Minor", "F# Major", "F# Minor",
  "G Major", "G Minor", "G# Major", "G# Minor",
  "A Major", "A Minor", "A# Major", "A# Minor",
  "B Major", "B Minor",
];

export const GENRES = [
  "Trap",
  "Hip-Hop",
  "R&B",
  "Pop",
  "Drill",
  "Lo-Fi",
  "Afrobeat",
  "Reggaeton",
  "House",
  "Electronic",
  "Rock",
  "Rap",
  "Deep House",
  "Synthwave",
  "Moombahton",
  "Slow",
  "Jazz",
  "Diğer",
];

export const TASK_STATUSES = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  DONE: "done",
} as const;

export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Yapılacak",
  in_progress: "Devam Ediyor",
  review: "İncelemede",
  done: "Tamamlandı",
};

export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES];

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  urgent: "Acil",
};

export const BOOKING_TYPES = {
  RECORDING: "recording",
  MIXING: "mixing",
  MASTERING: "mastering",
  SONGWRITING: "songwriting",
  REHEARSAL: "rehearsal",
} as const;

export type BookingType = (typeof BOOKING_TYPES)[keyof typeof BOOKING_TYPES];

export const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  recording: "Kayıt",
  mixing: "Mix",
  mastering: "Mastering",
  songwriting: "Şarkı Yazımı",
  rehearsal: "Prova",
};

export const BOOKING_TYPE_COLORS: Record<BookingType, string> = {
  recording: "#a855f7",
  mixing: "#ec4899",
  mastering: "#06b6d4",
  songwriting: "#10b981",
  rehearsal: "#f97316",
};

export const EQUIPMENT_CATEGORIES = {
  MICROPHONE: "microphone",
  AUDIO_INTERFACE: "audio_interface",
  HEADPHONE: "headphone",
  SPEAKER: "speaker",
  MIDI_CONTROLLER: "midi_controller",
  CABLE: "cable",
  PLUGIN_LICENSE: "plugin_license",
  OTHER: "other",
} as const;

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[keyof typeof EQUIPMENT_CATEGORIES];

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  microphone: "Mikrofon",
  audio_interface: "Ses Kartı",
  headphone: "Kulak Üstü",
  speaker: "Monitör Hoparlör",
  midi_controller: "MIDI Kontrolcü",
  cable: "Kablo",
  plugin_license: "Plug-in Lisansı",
  other: "Diğer",
};

export const EQUIPMENT_STATUSES = {
  AVAILABLE: "available",
  IN_USE: "in_use",
  MAINTENANCE: "maintenance",
  BROKEN: "broken",
  LOST: "lost",
} as const;

export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[keyof typeof EQUIPMENT_STATUSES];

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  available: "Müsait",
  in_use: "Kullanımda",
  maintenance: "Bakımda",
  broken: "Arızalı",
  lost: "Kayıp",
};

export const PRESET_CATEGORIES = {
  VST_PRESET: "vst_preset",
  MIC_CHAIN: "mic_chain",
  MIX_TEMPLATE: "mix_template",
  MASTERING_CHAIN: "mastering_chain",
} as const;

export type PresetCategory = (typeof PRESET_CATEGORIES)[keyof typeof PRESET_CATEGORIES];

export const PRESET_CATEGORY_LABELS: Record<PresetCategory, string> = {
  vst_preset: "Plug-in Preseti",
  mic_chain: "Mikrofon Zinciri",
  mix_template: "Mix Şablonu",
  mastering_chain: "Mastering Zinciri",
};

export const SAMPLE_CATEGORIES = {
  DRUM_KIT: "drum_kit",
  LOOP: "loop",
  ONE_SHOT: "one_shot",
  MELODIC: "melodic",
  VOCAL: "vocal",
  PERCUSSIVE: "percussive",
  STEM: "stem",
  SFX: "sfx",
} as const;

export type SampleCategory = (typeof SAMPLE_CATEGORIES)[keyof typeof SAMPLE_CATEGORIES];

export const SAMPLE_CATEGORY_LABELS: Record<SampleCategory, string> = {
  drum_kit: "Davul Seti",
  loop: "Loop",
  one_shot: "One-Shot",
  melodic: "Melodik",
  vocal: "Vokal",
  percussive: "Percussive",
  stem: "Stem",
  sfx: "SFX / Ses Efekti",
};

export const SAMPLE_SOURCE_TYPES = {
  ROYALTY_FREE: "royalty_free",
  ORIGINAL_PRODUCTION: "original_production",
  LICENSED: "licensed",
} as const;

export type SampleSourceType = (typeof SAMPLE_SOURCE_TYPES)[keyof typeof SAMPLE_SOURCE_TYPES];

export const SAMPLE_SOURCE_TYPE_LABELS: Record<SampleSourceType, string> = {
  royalty_free: "Royalty-Free",
  original_production: "Özel Prodüksiyon",
  licensed: "Lisanslı",
};

export const TEAM_STATUS = {
  AVAILABLE: "available",
  BUSY: "busy",
  STUDIO: "studio",
  OFFLINE: "offline",
} as const;

export type TeamStatus = (typeof TEAM_STATUS)[keyof typeof TEAM_STATUS];

export const TEAM_STATUS_LABELS: Record<TeamStatus, string> = {
  available: "Müsait",
  busy: "Meşgul",
  studio: "Stüdyoda",
  offline: "Çevrimdışı",
};

export const TEAM_STATUS_COLORS: Record<TeamStatus, string> = {
  available: "bg-neon-green",
  busy: "bg-neon-orange",
  studio: "bg-neon-purple",
  offline: "bg-muted",
};

export const RELEASE_PLATFORMS = [
  "spotify",
  "apple_music",
  "youtube_music",
  "soundcloud",
  "deezer",
  "tidal",
  "tr_durum",
  "fizy",
] as const;

export type ReleasePlatform = (typeof RELEASE_PLATFORMS)[number];

export const RELEASE_PLATFORM_LABELS: Record<ReleasePlatform, string> = {
  spotify: "Spotify",
  apple_music: "Apple Music",
  youtube_music: "YouTube Music",
  soundcloud: "SoundCloud",
  deezer: "Deezer",
  tidal: "Tidal",
  tr_durum: "TR DURUM",
  fizy: "Fizy",
};

export const RELEASE_STATUSES = {
  PLANNED: "planned",
  SUBMITTED: "submitted",
  RELEASED: "released",
} as const;

export type ReleaseStatus = (typeof RELEASE_STATUSES)[keyof typeof RELEASE_STATUSES];

export const RELEASE_STATUS_LABELS: Record<ReleaseStatus, string> = {
  planned: "Planlandı",
  submitted: "Gönderildi",
  released: "Yayınlandı",
};

export const SPLIT_ROLES = {
  PRODUCER: "producer",
  VOCALIST: "vocalist",
  SONGWRITER: "songwriter",
  FEATURE: "feature",
  EXECUTIVE: "executive",
} as const;

export type SplitRole = (typeof SPLIT_ROLES)[keyof typeof SPLIT_ROLES];

export const SPLIT_ROLE_LABELS: Record<SplitRole, string> = {
  producer: "Yapımcı",
  vocalist: "Vokalist",
  songwriter: "Söz Yazarı",
  feature: "Konuk Sanatçı",
  executive: "Yönetici Yapımcı",
};

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: "task_assigned",
  BEAT_VERSION: "beat_version",
  COMMENT: "comment",
  BOOKING_REMINDER: "booking_reminder",
  PRESET_SHARED: "preset_shared",
  SPLIT_CREATED: "split_created",
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export const FINANCE_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export type FinanceType = (typeof FINANCE_TYPES)[keyof typeof FINANCE_TYPES];

export const FINANCE_TYPE_LABELS: Record<FinanceType, string> = {
  income: "Gelir",
  expense: "Gider",
};

export const FINANCE_CATEGORIES_INCOME = [
  "beat_sale",
  "studio_rent",
  "stream_royalty",
  "performance",
  "other_income",
];

export const FINANCE_CATEGORIES_EXPENSE = [
  "equipment",
  "plugins",
  "studio_rent_pay",
  "marketing",
  "mix_master_pay",
  "utilities",
  "other_expense",
];

export const FINANCE_CATEGORY_LABELS: Record<string, string> = {
  beat_sale: "Beat Satışı",
  studio_rent: "Stüdyo Kirası (Gelir)",
  stream_royalty: "Stream Telifi",
  performance: "Konser / Performans",
  other_income: "Diğer Gelir",
  equipment: "Ekipman Alımı",
  plugins: "Plug-in / Lisans",
  studio_rent_pay: "Stüdyo Kirası (Gider)",
  marketing: "Pazarlama / Reklam",
  mix_master_pay: "Mix/Master Ödemesi",
  utilities: "Faturalar (Elektrik, İnternet)",
  other_expense: "Diğer Gider",
};

export const AUDIO_FILE_EXTENSIONS = [
  ".mp3", ".wav", ".aiff", ".flac", ".ogg", ".m4a", ".aac",
];

export const PROJECT_ARCHIVE_EXTENSIONS = [
  ".zip", ".rar", ".7z", ".tar", ".tar.gz", ".tgz",
];

export const PRESET_FILE_EXTENSIONS = [
  ".fxp", ".fxb", ".nki", ".nkm", ".alp", ".adg",
  ".agr", ".bnk", ".drumatrix", ".fxp",
  ".als", ".logicx", ".ptx", ".aup3", ".sesx",
];

export const STORAGE_BUCKETS = {
  BEAT_AUDIO: "beat_audio",
  BEAT_COVERS: "beat_covers",
  PROJECT_ARCHIVES: "project_archives",
  PRESETS: "presets",
  SAMPLES: "samples",
  SESSION_ATTACHMENTS: "session_attachments",
  AVATARS: "avatars",
  FINANCE_ATTACHMENTS: "finance_attachments",
  RELEASE_COVERS: "release_covers",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export const STORAGE_BUCKET_LABELS: Record<StorageBucket, string> = {
  beat_audio: "Beat Ses Dosyaları",
  beat_covers: "Beat Kapakları",
  project_archives: "Proje Arşivleri (ZIP/RAR)",
  presets: "Presetler",
  samples: "Sample'lar",
  session_attachments: "Seans Ekleri",
  avatars: "Kullanıcı Avatarları",
  finance_attachments: "Fiş / Faturalar",
  release_covers: "Yayın Kapakları",
};

export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  admin: ["*"],
  producer: [
    "beats:read", "beats:create", "beats:update", "beats:delete",
    "beat_versions:read", "beat_versions:create", "beat_versions:update",
    "presets:read", "presets:create", "presets:download",
    "samples:read", "samples:create",
    "studio_bookings:read", "studio_bookings:create",
    "tasks:read", "tasks:create", "tasks:update",
    "lyrics:read", "lyrics:create", "lyrics:update",
    "comments:read", "comments:create",
    "split_sheets:read", "split_sheets:create", "split_sheets:update",
    "session_notes:read", "session_notes:create", "session_notes:update",
    "release_plans:read", "release_plans:create", "release_plans:update",
    "finances:read",
    "reference_tracks:read", "reference_tracks:create",
  ],
  vocalist: [
    "beats:read",
    "beat_versions:read", "beat_versions:create",
    "presets:read", "presets:download",
    "samples:read",
    "studio_bookings:read", "studio_bookings:create",
    "tasks:read", "tasks:update",
    "lyrics:read", "lyrics:create", "lyrics:update",
    "comments:read", "comments:create",
    "split_sheets:read",
    "session_notes:read", "session_notes:create",
    "release_plans:read",
    "reference_tracks:read", "reference_tracks:create",
  ],
  songwriter: [
    "beats:read",
    "beat_versions:read",
    "presets:read", "presets:download",
    "samples:read",
    "studio_bookings:read", "studio_bookings:create",
    "tasks:read",
    "lyrics:read", "lyrics:create", "lyrics:update",
    "comments:read", "comments:create",
    "split_sheets:read",
    "session_notes:read", "session_notes:create",
    "release_plans:read",
  ],
  engineer: [
    "beats:read", "beats:update",
    "beat_versions:read", "beat_versions:create", "beat_versions:update",
    "presets:read", "presets:create", "presets:download",
    "equipment:read", "equipment:update",
    "studio_bookings:read", "studio_bookings:create", "studio_bookings:update",
    "tasks:read", "tasks:create", "tasks:update",
    "comments:read", "comments:create",
    "session_notes:read", "session_notes:create", "session_notes:update",
    "mix_checklists:read", "mix_checklists:update",
    "finances:read",
    "inventory:read", "inventory:update",
  ],
};

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  roles?: AppRole[];
}
