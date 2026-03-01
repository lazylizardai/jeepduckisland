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
      duck_sightings: {
        Row: {
          created_at: string
          duck_id: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          notes: string | null
          rarity: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          duck_id?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          notes?: string | null
          rarity?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          duck_id?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          notes?: string | null
          rarity?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "duck_sightings_duck_id_fkey"
            columns: ["duck_id"]
            isOneToOne: false
            referencedRelation: "ducks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duck_sightings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ducks: {
        Row: {
          created_at: string
          current_owner_id: string | null
          description: string | null
          emoji_code: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          message: string | null
          name: string | null
          nft_token_id: string | null
          qr_code: string | null
          rarity: string | null
          serial_number: string | null
          zone: string | null
        }
        Insert: {
          created_at?: string
          current_owner_id?: string | null
          description?: string | null
          emoji_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          message?: string | null
          name?: string | null
          nft_token_id?: string | null
          qr_code?: string | null
          rarity?: string | null
          serial_number?: string | null
          zone?: string | null
        }
        Update: {
          created_at?: string
          current_owner_id?: string | null
          description?: string | null
          emoji_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          message?: string | null
          name?: string | null
          nft_token_id?: string | null
          qr_code?: string | null
          rarity?: string | null
          serial_number?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ducks_current_owner_id_fkey"
            columns: ["current_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_emoji: string | null
          created_at: string
          ducks_spotted: number | null
          id: string
          level: number | null
          quack_tokens: number | null
          rank: number | null
          updated_at: string
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_emoji?: string | null
          created_at?: string
          ducks_spotted?: number | null
          id: string
          level?: number | null
          quack_tokens?: number | null
          rank?: number | null
          updated_at?: string
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_emoji?: string | null
          created_at?: string
          ducks_spotted?: number | null
          id?: string
          level?: number | null
          quack_tokens?: number | null
          rank?: number | null
          updated_at?: string
          username?: string | null
          xp?: number | null
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
