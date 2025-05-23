
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
  spotify_link?: string;
  apple_music_link?: string;
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
  audio_file: string;
  cover_art: string;
  platforms: string[];
  status: 'pending' | 'approved' | 'rejected' | 'live' | 'takedown';
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

export interface Transaction {
  id: string;
  user_id: string;
  type: 'earning' | 'withdrawal';
  amount: number;
  description?: string;
  status: 'pending' | 'completed' | 'rejected';
  payment_details?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  payment_method: 'upi' | 'bank_transfer';
  payment_details: Record<string, any>;
  status: 'pending' | 'processed' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TakedownRequest {
  id: string;
  user_id: string;
  release_id: string;
  youtube_link: string;
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
  channel_link: string;
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
  report_file: string;
  file_type: 'pdf' | 'csv' | 'xml' | 'xlsx';
  created_at: string;
  uploaded_by: string;
}

export interface DistributionPlatform {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'user';
