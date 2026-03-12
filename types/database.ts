/**
 * Supabase Database type definitions for HIEA MVP.
 * Mirrors the schema in supabase/migrations/001_initial_schema.sql.
 */
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "editor" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "editor" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: "editor" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          title: string | null;
          slug: string | null;
          content: Record<string, unknown> | null;
          excerpt: string | null;
          category_id: string | null;
          status: "draft" | "pending" | "published";
          author_id: string | null;
          featured_image_url: string | null;
          attachment_url: string | null;
          is_member_only: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          slug?: string | null;
          content?: Record<string, unknown> | null;
          excerpt?: string | null;
          category_id?: string | null;
          status?: "draft" | "pending" | "published";
          author_id?: string | null;
          featured_image_url?: string | null;
          attachment_url?: string | null;
          is_member_only?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          slug?: string | null;
          content?: Record<string, unknown> | null;
          excerpt?: string | null;
          category_id?: string | null;
          status?: "draft" | "pending" | "published";
          author_id?: string | null;
          featured_image_url?: string | null;
          attachment_url?: string | null;
          is_member_only?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "articles_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
