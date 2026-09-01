export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "admin" | "owner" | "staff";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "artwork_review"
  | "proof_pending"
  | "proof_approved"
  | "in_production"
  | "quality_check"
  | "ready"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          company_name: string | null;
          email: string;
          phone: string | null;
          role: UserRole;
          status: string;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          company_name?: string | null;
          email: string;
          phone?: string | null;
          role?: UserRole;
          status?: string;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          company_name?: string | null;
          email?: string;
          phone?: string | null;
          role?: UserRole;
          status?: string;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          actor_id: string;
          target_id: string | null;
          action: string;
          details: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id: string;
          target_id?: string | null;
          action: string;
          details?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string;
          target_id?: string | null;
          action?: string;
          details?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admin_audit_logs_target_id_fkey";
            columns: ["target_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          full_name: string;
          phone: string;
          line1: string;
          line2: string | null;
          landmark: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string | null;
          full_name: string;
          phone: string;
          line1: string;
          line2?: string | null;
          landmark?: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string | null;
          full_name?: string;
          phone?: string;
          line1?: string;
          line2?: string | null;
          landmark?: string | null;
          city?: string;
          state?: string;
          pincode?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          invoice_number: string | null;
          status: OrderStatus;
          payment_status: PaymentStatus;
          payment_method: string | null;
          payment_reference: string | null;
          subtotal: number;
          tax: number;
          shipping: number;
          discount: number;
          total: number;
          customer_snapshot: Json;
          delivery_snapshot: Json;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          invoice_number?: string | null;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: string | null;
          payment_reference?: string | null;
          subtotal: number;
          tax: number;
          shipping: number;
          discount?: number;
          total: number;
          customer_snapshot: Json;
          delivery_snapshot: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          invoice_number?: string | null;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: string | null;
          payment_reference?: string | null;
          subtotal?: number;
          tax?: number;
          shipping?: number;
          discount?: number;
          total?: number;
          customer_snapshot?: Json;
          delivery_snapshot?: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_title: string;
          sku: string | null;
          quantity: number;
          unit_price: number;
          line_price: number;
          selected_options: Json;
          artwork_summary: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_title: string;
          sku?: string | null;
          quantity: number;
          unit_price: number;
          line_price: number;
          selected_options?: Json;
          artwork_summary?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_title?: string;
          sku?: string | null;
          quantity?: number;
          unit_price?: number;
          line_price?: number;
          selected_options?: Json;
          artwork_summary?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      order_events: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          title: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          title: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      transition_order_status: {
        Args: {
          p_order_id: string;
          p_target_status: string;
          p_expected_current_status?: string | null;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
