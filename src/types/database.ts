export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          onboarding_completed: boolean;
          assessment_completed: boolean;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          onboarding_completed?: boolean;
          assessment_completed?: boolean;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          onboarding_completed?: boolean;
          assessment_completed?: boolean;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      onboarding_answers: {
        Row: {
          id: string;
          user_id: string;
          question_key: string;
          answer_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_key: string;
          answer_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_key?: string;
          answer_text?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessment_answers: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string | null;
          question_key: string;
          answer_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id?: string | null;
          question_key: string;
          answer_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string | null;
          question_key?: string;
          answer_text?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sections: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          section_id: string;
          title: string;
          description: string | null;
          content_type: Database["public"]["Enums"]["exercise_content_type"];
          content_text: string | null;
          content_url: string | null;
          order_index: number;
          duration_min: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          title: string;
          description?: string | null;
          content_type?: Database["public"]["Enums"]["exercise_content_type"];
          content_text?: string | null;
          content_url?: string | null;
          order_index: number;
          duration_min?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          title?: string;
          description?: string | null;
          content_type?: Database["public"]["Enums"]["exercise_content_type"];
          content_text?: string | null;
          content_url?: string | null;
          order_index?: number;
          duration_min?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exercise_progress: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          status: Database["public"]["Enums"]["exercise_progress_status"];
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          status?: Database["public"]["Enums"]["exercise_progress_status"];
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string;
          status?: Database["public"]["Enums"]["exercise_progress_status"];
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      exercise_content_type: "audio" | "text" | "video" | "mixed";
      exercise_progress_status: "not_started" | "in_progress" | "completed";
    };
    CompositeTypes: Record<string, never>;
  };
};
