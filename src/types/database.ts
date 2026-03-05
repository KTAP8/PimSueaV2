// Generated from live schema. Regenerate with:
// npx supabase gen types typescript --project-id razmsdzkoydstpzdgcbr > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: { key: string; updated_at: string; value: string }
        Insert: { key: string; updated_at?: string; value: string }
        Update: { key?: string; updated_at?: string; value?: string }
        Relationships: []
      }
      cart_items: {
        Row: {
          added_at: string
          design_id: string
          id: string
          quantity: number
          user_id: string
          variant_id: string
        }
        Insert: {
          added_at?: string
          design_id: string
          id?: string
          quantity?: number
          user_id: string
          variant_id: string
        }
        Update: {
          added_at?: string
          design_id?: string
          id?: string
          quantity?: number
          user_id?: string
          variant_id?: string
        }
        Relationships: [
          { foreignKeyName: "cart_items_design_id_fkey"; columns: ["design_id"]; isOneToOne: false; referencedRelation: "designs"; referencedColumns: ["id"] },
          { foreignKeyName: "cart_items_variant_id_fkey"; columns: ["variant_id"]; isOneToOne: false; referencedRelation: "product_variants"; referencedColumns: ["id"] },
        ]
      }
      designs: {
        Row: {
          aabb_h_cm: number | null
          aabb_w_cm: number | null
          canvas_json: Json
          created_at: string
          id: string
          name: string | null
          preview_url: string | null
          print_tier: string | null
          printing_type: string | null
          product_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aabb_h_cm?: number | null
          aabb_w_cm?: number | null
          canvas_json?: Json
          created_at?: string
          id?: string
          name?: string | null
          preview_url?: string | null
          print_tier?: string | null
          printing_type?: string | null
          product_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aabb_h_cm?: number | null
          aabb_w_cm?: number | null
          canvas_json?: Json
          created_at?: string
          id?: string
          name?: string | null
          preview_url?: string | null
          print_tier?: string | null
          printing_type?: string | null
          product_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          { foreignKeyName: "designs_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
        ]
      }
      group_order_submissions: {
        Row: {
          color_preference: string | null
          flag_reason: string | null
          group_order_id: string
          id: string
          is_flagged: boolean
          member_name: string
          member_phone: string | null
          payment_confirmed_at: string | null
          payment_status: string
          quantity: number
          size: string
          submitted_at: string
          unit_price_thb: number | null
        }
        Insert: {
          color_preference?: string | null
          flag_reason?: string | null
          group_order_id: string
          id?: string
          is_flagged?: boolean
          member_name: string
          member_phone?: string | null
          payment_confirmed_at?: string | null
          payment_status?: string
          quantity?: number
          size: string
          submitted_at?: string
          unit_price_thb?: number | null
        }
        Update: {
          color_preference?: string | null
          flag_reason?: string | null
          group_order_id?: string
          id?: string
          is_flagged?: boolean
          member_name?: string
          member_phone?: string | null
          payment_confirmed_at?: string | null
          payment_status?: string
          quantity?: number
          size?: string
          submitted_at?: string
          unit_price_thb?: number | null
        }
        Relationships: [
          { foreignKeyName: "group_order_submissions_group_order_id_fkey"; columns: ["group_order_id"]; isOneToOne: false; referencedRelation: "group_orders"; referencedColumns: ["id"] },
        ]
      }
      group_orders: {
        Row: {
          created_at: string
          deadline: string
          design_id: string
          id: string
          min_quantity: number | null
          organizer_id: string
          share_code: string
          status: string
          title: string | null
        }
        Insert: {
          created_at?: string
          deadline: string
          design_id: string
          id?: string
          min_quantity?: number | null
          organizer_id: string
          share_code: string
          status?: string
          title?: string | null
        }
        Update: {
          created_at?: string
          deadline?: string
          design_id?: string
          id?: string
          min_quantity?: number | null
          organizer_id?: string
          share_code?: string
          status?: string
          title?: string | null
        }
        Relationships: [
          { foreignKeyName: "group_orders_design_id_fkey"; columns: ["design_id"]; isOneToOne: false; referencedRelation: "designs"; referencedColumns: ["id"] },
        ]
      }
      order_items: {
        Row: {
          design_id: string
          id: string
          order_id: string
          print_tier: string
          printing_type: string
          quantity: number
          unit_price_thb: number
          variant_id: string
        }
        Insert: {
          design_id: string
          id?: string
          order_id: string
          print_tier: string
          printing_type: string
          quantity: number
          unit_price_thb: number
          variant_id: string
        }
        Update: {
          design_id?: string
          id?: string
          order_id?: string
          print_tier?: string
          printing_type?: string
          quantity?: number
          unit_price_thb?: number
          variant_id?: string
        }
        Relationships: [
          { foreignKeyName: "order_items_design_id_fkey"; columns: ["design_id"]; isOneToOne: false; referencedRelation: "designs"; referencedColumns: ["id"] },
          { foreignKeyName: "order_items_order_id_fkey"; columns: ["order_id"]; isOneToOne: false; referencedRelation: "orders"; referencedColumns: ["id"] },
          { foreignKeyName: "order_items_variant_id_fkey"; columns: ["variant_id"]; isOneToOne: false; referencedRelation: "product_variants"; referencedColumns: ["id"] },
        ]
      }
      order_status_log: {
        Row: {
          changed_at: string
          changed_by: string
          from_status: string | null
          id: string
          notification_sent: boolean
          order_id: string
          to_status: string
        }
        Insert: {
          changed_at?: string
          changed_by: string
          from_status?: string | null
          id?: string
          notification_sent?: boolean
          order_id: string
          to_status: string
        }
        Update: {
          changed_at?: string
          changed_by?: string
          from_status?: string | null
          id?: string
          notification_sent?: boolean
          order_id?: string
          to_status?: string
        }
        Relationships: [
          { foreignKeyName: "order_status_log_order_id_fkey"; columns: ["order_id"]; isOneToOne: false; referencedRelation: "orders"; referencedColumns: ["id"] },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_note: string | null
          group_order_id: string | null
          id: string
          order_number: string
          payment_confirmed_at: string | null
          payment_method: string | null
          print_file_url: string | null
          shipping_tracking: string | null
          status: string
          total_thb: number
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_note?: string | null
          group_order_id?: string | null
          id?: string
          order_number: string
          payment_confirmed_at?: string | null
          payment_method?: string | null
          print_file_url?: string | null
          shipping_tracking?: string | null
          status?: string
          total_thb: number
          user_id: string
        }
        Update: {
          created_at?: string
          customer_note?: string | null
          group_order_id?: string | null
          id?: string
          order_number?: string
          payment_confirmed_at?: string | null
          payment_method?: string | null
          print_file_url?: string | null
          shipping_tracking?: string | null
          status?: string
          total_thb?: number
          user_id?: string
        }
        Relationships: [
          { foreignKeyName: "orders_group_order_id_fkey"; columns: ["group_order_id"]; isOneToOne: false; referencedRelation: "group_orders"; referencedColumns: ["id"] },
        ]
      }
      print_pricing: {
        Row: {
          color_name: string | null
          dtf_film_cost_thb: number | null
          id: string
          max_h_cm: number
          max_qty: number | null
          max_w_cm: number
          min_qty: number
          price_per_unit_thb: number
          size_tier: string
          type_code: string
          updated_at: string
        }
        Insert: {
          color_name?: string | null
          dtf_film_cost_thb?: number | null
          id?: string
          max_h_cm: number
          max_qty?: number | null
          max_w_cm: number
          min_qty: number
          price_per_unit_thb: number
          size_tier: string
          type_code: string
          updated_at?: string
        }
        Update: {
          color_name?: string | null
          dtf_film_cost_thb?: number | null
          id?: string
          max_h_cm?: number
          max_qty?: number | null
          max_w_cm?: number
          min_qty?: number
          price_per_unit_thb?: number
          size_tier?: string
          type_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_templates: {
        Row: {
          face: string
          id: string
          mockup_image_url: string
          print_area_max_h_cm: number
          print_area_max_w_cm: number
          print_area_x_cm: number
          print_area_y_cm: number
          product_id: string
        }
        Insert: {
          face: string
          id?: string
          mockup_image_url: string
          print_area_max_h_cm: number
          print_area_max_w_cm: number
          print_area_x_cm: number
          print_area_y_cm: number
          product_id: string
        }
        Update: {
          face?: string
          id?: string
          mockup_image_url?: string
          print_area_max_h_cm?: number
          print_area_max_w_cm?: number
          print_area_x_cm?: number
          print_area_y_cm?: number
          product_id?: string
        }
        Relationships: [
          { foreignKeyName: "product_templates_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
        ]
      }
      product_variants: {
        Row: {
          color_hex: string
          color_name: string
          id: string
          is_available: boolean
          product_id: string
          size: string
          sku: string
        }
        Insert: {
          color_hex: string
          color_name: string
          id?: string
          is_available?: boolean
          product_id: string
          size: string
          sku: string
        }
        Update: {
          color_hex?: string
          color_name?: string
          id?: string
          is_available?: boolean
          product_id?: string
          size?: string
          sku?: string
        }
        Relationships: [
          { foreignKeyName: "product_variants_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
        ]
      }
      products: {
        Row: {
          base_price_thb: number
          care_instructions: string | null
          clothes_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          size_guide_url: string | null
          supported_printing_types: string[]
        }
        Insert: {
          base_price_thb: number
          care_instructions?: string | null
          clothes_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          size_guide_url?: string | null
          supported_printing_types?: string[]
        }
        Update: {
          base_price_thb?: number
          care_instructions?: string | null
          clothes_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          size_guide_url?: string | null
          supported_printing_types?: string[]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          line_user_id: string | null
          phone: string | null
          role: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          line_user_id?: string | null
          phone?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          line_user_id?: string | null
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      shirt_pricing: {
        Row: {
          color_name: string
          id: string
          max_qty: number | null
          min_qty: number
          price_per_unit_thb: number
          product_id: string
          size: string
          updated_at: string
        }
        Insert: {
          color_name: string
          id?: string
          max_qty?: number | null
          min_qty: number
          price_per_unit_thb: number
          product_id: string
          size: string
          updated_at?: string
        }
        Update: {
          color_name?: string
          id?: string
          max_qty?: number | null
          min_qty?: number
          price_per_unit_thb?: number
          product_id?: string
          size?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "shirt_pricing_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends { Row: infer R } ? R : never

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Insert: infer I } ? I : never

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Update: infer U } ? U : never
