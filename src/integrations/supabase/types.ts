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
      admin_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
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
      calls: {
        Row: {
          call_type: string | null
          caller_id: string | null
          conversation_id: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          call_type?: string | null
          caller_id?: string | null
          conversation_id?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          call_type?: string | null
          caller_id?: string | null
          conversation_id?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          added_at: string | null
          contact_name: string | null
          contact_user_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          contact_name?: string | null
          contact_user_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          contact_name?: string | null
          contact_user_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string | null
          id: string
          joined_at: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      message_status: {
        Row: {
          id: string
          message_id: string | null
          status: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message_id?: string | null
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message_id?: string | null
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_status_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string | null
          file_url: string | null
          id: string
          message_type: string | null
          reply_to: string | null
          sender_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          reply_to?: string | null
          sender_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          reply_to?: string | null
          sender_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
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
      platform_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
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
      get_or_create_conversation: {
        Args: { participant_ids: string[] }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
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
