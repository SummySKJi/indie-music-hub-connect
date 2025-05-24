export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          apple_music_profile: string | null
          bio: string | null
          country: string
          created_at: string | null
          email: string
          facebook_page: string | null
          gender: string | null
          genres: string[] | null
          id: string
          instagram_id: string | null
          languages: string[]
          name: string
          phone: string
          spotify_profile: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          whatsapp: string | null
          youtube_channel: string | null
        }
        Insert: {
          apple_music_profile?: string | null
          bio?: string | null
          country: string
          created_at?: string | null
          email: string
          facebook_page?: string | null
          gender?: string | null
          genres?: string[] | null
          id?: string
          instagram_id?: string | null
          languages: string[]
          name: string
          phone: string
          spotify_profile?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
          youtube_channel?: string | null
        }
        Update: {
          apple_music_profile?: string | null
          bio?: string | null
          country?: string
          created_at?: string | null
          email?: string
          facebook_page?: string | null
          gender?: string | null
          genres?: string[] | null
          id?: string
          instagram_id?: string | null
          languages?: string[]
          name?: string
          phone?: string
          spotify_profile?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
          youtube_channel?: string | null
        }
        Relationships: []
      }
      generated_covers: {
        Row: {
          cover_path: string
          created_at: string
          id: string
          model_id: string
          original_song_path: string
          settings: Json | null
          title: string
          user_id: string
        }
        Insert: {
          cover_path: string
          created_at?: string
          id?: string
          model_id: string
          original_song_path: string
          settings?: Json | null
          title: string
          user_id: string
        }
        Update: {
          cover_path?: string
          created_at?: string
          id?: string
          model_id?: string
          original_song_path?: string
          settings?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_covers_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "voice_models"
            referencedColumns: ["id"]
          },
        ]
      }
      labels: {
        Row: {
          bio: string | null
          country: string
          created_at: string | null
          email: string
          facebook_page: string | null
          genres: string[] | null
          id: string
          instagram_id: string | null
          languages: string[]
          name: string
          phone: string
          updated_at: string | null
          user_id: string | null
          website: string | null
          whatsapp: string | null
          youtube_channel: string | null
        }
        Insert: {
          bio?: string | null
          country: string
          created_at?: string | null
          email: string
          facebook_page?: string | null
          genres?: string[] | null
          id?: string
          instagram_id?: string | null
          languages: string[]
          name: string
          phone: string
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
          youtube_channel?: string | null
        }
        Update: {
          bio?: string | null
          country?: string
          created_at?: string | null
          email?: string
          facebook_page?: string | null
          genres?: string[] | null
          id?: string
          instagram_id?: string | null
          languages?: string[]
          name?: string
          phone?: string
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
          youtube_channel?: string | null
        }
        Relationships: []
      }
      oac_requests: {
        Row: {
          admin_notes: string | null
          artist_id: string | null
          created_at: string | null
          id: string
          label_id: string | null
          singer_channel_link: string
          status: string | null
          topic_channel_link: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          artist_id?: string | null
          created_at?: string | null
          id?: string
          label_id?: string | null
          singer_channel_link: string
          status?: string | null
          topic_channel_link: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          artist_id?: string | null
          created_at?: string | null
          id?: string
          label_id?: string | null
          singer_channel_link?: string
          status?: string | null
          topic_channel_link?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oac_requests_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oac_requests_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          admin_notes: string | null
          artist_id: string | null
          audio_file: string | null
          copyright: string
          cover_art: string | null
          created_at: string | null
          id: string
          instagram_id: string | null
          label_id: string | null
          language: string
          lyrics_name: string[] | null
          music_producer: string | null
          platforms: string[] | null
          publisher: string | null
          release_date: string | null
          song_name: string
          status: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          artist_id?: string | null
          audio_file?: string | null
          copyright: string
          cover_art?: string | null
          created_at?: string | null
          id?: string
          instagram_id?: string | null
          label_id?: string | null
          language: string
          lyrics_name?: string[] | null
          music_producer?: string | null
          platforms?: string[] | null
          publisher?: string | null
          release_date?: string | null
          song_name: string
          status?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          artist_id?: string | null
          audio_file?: string | null
          copyright?: string
          cover_art?: string | null
          created_at?: string | null
          id?: string
          instagram_id?: string | null
          label_id?: string | null
          language?: string
          lyrics_name?: string[] | null
          music_producer?: string | null
          platforms?: string[] | null
          publisher?: string | null
          release_date?: string | null
          song_name?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "releases_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "releases_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
        ]
      }
      royalty_reports: {
        Row: {
          created_at: string | null
          file_path: string
          file_type: string
          id: string
          report_period: string
          upload_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_type: string
          id?: string
          report_period: string
          upload_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_type?: string
          id?: string
          report_period?: string
          upload_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      takedown_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          id: string
          label_id: string | null
          release_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          youtube_video_link: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          label_id?: string | null
          release_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          youtube_video_link: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          label_id?: string | null
          release_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          youtube_video_link?: string
        }
        Relationships: [
          {
            foreignKeyName: "takedown_requests_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "takedown_requests_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      voice_models: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          quality: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          quality?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          quality?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_samples: {
        Row: {
          created_at: string
          duration: number
          file_path: string
          id: string
          model_id: string
        }
        Insert: {
          created_at?: string
          duration: number
          file_path: string
          id?: string
          model_id: string
        }
        Update: {
          created_at?: string
          duration?: number
          file_path?: string
          id?: string
          model_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_samples_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "voice_models"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          bank_account_holder: string | null
          bank_account_number: string | null
          bank_ifsc: string | null
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          upi_id: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          bank_account_holder?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          upi_id?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          bank_account_holder?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          upi_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
