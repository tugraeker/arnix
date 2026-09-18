import type { AppRole, BeatType, TeamStatus } from "@/lib/constants";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  role: AppRole;
  avatar_url: string | null;
  bio: string | null;
  status: TeamStatus;
  created_at: string;
  updated_at: string | null;
}

export interface Beat {
  id: string;
  title: string;
  bpm: number;
  musical_key: string;
  genre: string;
  tags: string[];
  type: BeatType;
  cover_image_url: string | null;
  description: string | null;
  project_archive_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string | null;
}

export interface BeatWithRelations extends Beat {
  creator?: Profile;
  versions?: BeatVersion[];
  tasks_count?: number;
  comments_count?: number;
}

export interface BeatVersion {
  id: string;
  beat_id: string;
  version_name: string;
  audio_url: string;
  notes: string | null;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  created_by: string;
  created_at: string;
}

export interface StudioBooking {
  id: string;
  title: string;
  description: string | null;
  booked_by: string;
  start_time: string;
  end_time: string;
  booking_type: string;
  color: string | null;
  created_at: string;
  booker?: Profile;
}

export interface SplitSheet {
  id: string;
  beat_id: string | null;
  title: string;
  master_percentage_total: number;
  mechanical_percentage_total: number;
  created_by: string;
  created_at: string;
  updated_at: string | null;
}

export interface ProjectTask {
  id: string;
  beat_id: string | null;
  title: string;
  description: string | null;
  assignee_id: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  order_index: number;
  created_by: string;
  created_at: string;
  updated_at: string | null;
  assignee?: Profile;
}

export interface TimecodedComment {
  id: string;
  beat_version_id: string;
  commenter_id: string;
  timestamp_seconds: number | null;
  content: string;
  is_resolved: boolean;
  created_at: string;
  commenter?: Profile;
}

export interface Preset {
  id: string;
  name: string;
  plugin_name: string | null;
  category: string;
  type: string | null;
  tags: string[];
  description: string | null;
  file_url: string;
  file_name: string;
  file_size_bytes: number | null;
  uploader_id: string;
  download_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string | null;
  uploader?: Profile;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  serial_number: string | null;
  purchase_date: string | null;
  warranty_end: string | null;
  current_holder_id: string | null;
  status: string;
  notes: string | null;
  image_url: string | null;
  created_at: string;
  holder?: Profile;
}

export interface SessionNote {
  id: string;
  studio_booking_id: string | null;
  beat_id: string | null;
  title: string | null;
  content: string;
  microphone_used: string | null;
  preamp_used: string | null;
  acoustics_notes: string | null;
  artist_notes: string | null;
  best_take_info: string | null;
  written_by: string;
  created_at: string;
  updated_at: string | null;
}

export interface Sample {
  id: string;
  name: string;
  category: string;
  genre: string | null;
  source_type: string;
  source_url: string | null;
  copyright_info: string | null;
  file_url: string;
  bpm: number | null;
  musical_key: string | null;
  tags: string[];
  uploader_id: string;
  created_at: string;
}

export interface LyricLine {
  id: string;
  beat_id: string;
  section: string | null;
  content: string | null;
  timestamp_start: number | null;
  timestamp_end: number | null;
  order_index: number;
  created_by: string;
  updated_at: string | null;
}

export interface ReferenceTrack {
  id: string;
  beat_id: string;
  title: string;
  artist: string | null;
  url: string | null;
  file_url: string | null;
  notes: string | null;
  added_by: string;
  created_at: string;
}

export interface MixChecklist {
  id: string;
  beat_id: string;
  item: string;
  is_done: boolean;
  order_index: number;
  checked_by: string | null;
  checked_at: string | null;
}

export interface ReleasePlan {
  id: string;
  beat_id: string | null;
  song_title: string;
  artist_name: string | null;
  cover_image_url: string | null;
  release_date: string;
  platforms: string[];
  status: string;
  social_media_caption: string | null;
  hashtags: string[];
  created_by: string;
  created_at: string;
  updated_at: string | null;
}

export interface FinanceRecord {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string | null;
  date: string;
  related_beat_id: string | null;
  recorded_by: string;
  created_at: string;
}

export interface TeamAchievement {
  id: string;
  title: string;
  description: string | null;
  badge_icon: string | null;
  awarded_to: string;
  awarded_by: string;
  beat_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string | null;
  related_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string | null;
  quantity: number;
  location: string | null;
  status: string;
  notes: string | null;
  last_checked_at: string | null;
}

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AppRole[];
  badge?: number | null;
};
