
// Custom type definitions that extend or complement Supabase types
// Import database types from Supabase when needed with:
// import type { Database } from '@/integrations/supabase/types';

// Add your custom type definitions here
export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  gender?: string;
  youtube_channel?: string;
  instagram_id?: string;
  facebook_page?: string;
  bio?: string;
  spotify_profile?: string;
  apple_music_profile?: string;
  country: string;
  genres: string[];
  languages: string[];
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  youtube_channel?: string;
  instagram_id?: string;
  facebook_page?: string;
  bio?: string;
  country: string;
  genres: string[];
  languages: string[];
  created_at: string;
  updated_at: string;
}

export interface Release {
  id: string;
  user_id: string;
  type: 'single' | 'album' | 'ep';
  song_name: string;
  artist_id: string;
  instagram_id?: string;
  lyrics_name: string[];
  music_producer?: string;
  copyright: string;
  publisher?: string;
  language: string;
  release_date: string;
  label_id: string;
  audio_file?: string;
  cover_art?: string;
  platforms: string[];
  status: 'pending' | 'approved' | 'rejected' | 'live' | 'takedown_requested' | 'takedown_completed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  upi_id?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_account_holder?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TakedownRequest {
  id: string;
  user_id: string;
  release_id: string;
  youtube_video_link: string;
  label_id: string;
  status: 'pending' | 'in_process' | 'approved' | 'rejected' | 'completed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OACRequest {
  id: string;
  user_id: string;
  artist_id: string;
  singer_channel_link: string;
  topic_channel_link: string;
  label_id: string;
  status: 'pending' | 'in_process' | 'approved' | 'rejected' | 'completed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RoyaltyReport {
  id: string;
  user_id: string;
  report_period: string;
  file_path: string;
  file_type: 'pdf' | 'csv' | 'xml' | 'xlsx';
  upload_date: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export const INDIAN_LANGUAGES = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu',
  'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Maithili', 'Sanskrit',
  'Nepali', 'Konkani', 'Manipuri', 'Sindhi', 'Dogri', 'Kashmiri', 'Santhali',
  'Bodo', 'Rajasthani', 'Haryanvi', 'Bhojpuri', 'Awadhi', 'Magahi', 'Bajjika'
];

export const MUSIC_GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Classical', 'Jazz', 'Blues', 'Country',
  'Folk', 'R&B', 'Reggae', 'Punk', 'Metal', 'Alternative', 'Indie', 'Bollywood',
  'Devotional', 'Sufi', 'Qawwali', 'Ghazal', 'Thumri', 'Bhajan', 'Kirtan',
  'Fusion', 'World Music', 'Instrumental', 'Ambient', 'Lofi', 'Trap', 'Drill'
];

export const DISTRIBUTION_PLATFORMS = [
  'Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'JioSaavn', 'Gaana',
  'Wynk Music', 'Hungama Music', 'Resso', 'Instagram', 'Facebook', 'TikTok',
  'Deezer', 'Tidal', 'SoundCloud', 'Bandcamp', 'Pandora', 'iHeartRadio',
  'Shazam', 'Anghami', 'Boomplay', 'NetEase', 'QQ Music', 'Kuwo', 'KuGou',
  'Audiomack', 'Napster', 'Yandex Music', 'VK Music', 'MelOn', 'Bugs',
  'Genie Music', 'Line Music', 'AWA', 'Rakuten Music', 'mora', 'Recochoku'
];
