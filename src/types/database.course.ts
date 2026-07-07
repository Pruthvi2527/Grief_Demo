/**
 * Course architecture schema types (v2).
 * Complements legacy types in database.ts — does not replace MVP table types.
 *
 * Apply migration: supabase/migrations/20260708120000_course_architecture_refactor.sql
 */

import type { Json } from "./database";

export type CourseSectionStatus = "draft" | "published" | "archived";
export type SlotAssignmentType = "fixed" | "rule_based" | "ai_selected";
export type ExerciseLibraryStatus = "draft" | "published" | "archived";
export type UserCourseAssignmentStatus =
  | "assigned"
  | "in_progress"
  | "completed"
  | "skipped";

export type CourseDatabase = {
  public: {
    Tables: {
      course_sections: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          order_index: number;
          status: CourseSectionStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          order_index: number;
          status?: CourseSectionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          status?: CourseSectionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      course_slots: {
        Row: {
          id: string;
          section_id: string;
          slug: string;
          title: string;
          description: string | null;
          order_index: number;
          assignment_type: SlotAssignmentType;
          fixed_exercise_id: string | null;
          selection_rule: Json | null;
          ai_selection_config: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          slug: string;
          title: string;
          description?: string | null;
          order_index: number;
          assignment_type: SlotAssignmentType;
          fixed_exercise_id?: string | null;
          selection_rule?: Json | null;
          ai_selection_config?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          assignment_type?: SlotAssignmentType;
          fixed_exercise_id?: string | null;
          selection_rule?: Json | null;
          ai_selection_config?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_slots_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "course_sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_slots_fixed_exercise_id_fkey";
            columns: ["fixed_exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercise_library";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_library: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          content: string | null;
          content_type: "audio" | "text" | "video" | "mixed";
          duration_min: number | null;
          media_url: string | null;
          metadata: Json;
          status: ExerciseLibraryStatus;
          legacy_exercise_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          content?: string | null;
          content_type?: "audio" | "text" | "video" | "mixed";
          duration_min?: number | null;
          media_url?: string | null;
          metadata?: Json;
          status?: ExerciseLibraryStatus;
          legacy_exercise_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          content?: string | null;
          content_type?: "audio" | "text" | "video" | "mixed";
          duration_min?: number | null;
          media_url?: string | null;
          metadata?: Json;
          status?: ExerciseLibraryStatus;
          legacy_exercise_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      capability_types: {
        Row: {
          id: string;
          key: string;
          label: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          label: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          label?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      exercise_library_capabilities: {
        Row: {
          exercise_id: string;
          capability_id: string;
          created_at: string;
        };
        Insert: {
          exercise_id: string;
          capability_id: string;
          created_at?: string;
        };
        Update: {
          exercise_id?: string;
          capability_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      exercise_tags: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      exercise_library_tags: {
        Row: {
          exercise_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          exercise_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          exercise_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_courses: {
        Row: {
          id: string;
          user_id: string;
          course_version: string;
          assigned_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_version?: string;
          assigned_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_version?: string;
          assigned_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_course_assignments: {
        Row: {
          id: string;
          user_course_id: string;
          slot_id: string;
          exercise_id: string;
          assignment_type: SlotAssignmentType;
          selection_context: Json;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          user_course_id: string;
          slot_id: string;
          exercise_id: string;
          assignment_type: SlotAssignmentType;
          selection_context?: Json;
          assigned_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      user_course_assignment_progress: {
        Row: {
          assignment_id: string;
          status: UserCourseAssignmentStatus;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          assignment_id: string;
          status?: UserCourseAssignmentStatus;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          assignment_id?: string;
          status?: UserCourseAssignmentStatus;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_current_state: {
        Row: {
          user_id: string;
          emotion: string | null;
          body_state: string | null;
          loss_type: string | null;
          loss_date: string | null;
          healing_goal: string | null;
          latest_diagnostic_id: string | null;
          current_section_id: string | null;
          current_slot_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          emotion?: string | null;
          body_state?: string | null;
          loss_type?: string | null;
          loss_date?: string | null;
          healing_goal?: string | null;
          latest_diagnostic_id?: string | null;
          current_section_id?: string | null;
          current_slot_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          emotion?: string | null;
          body_state?: string | null;
          loss_type?: string | null;
          loss_date?: string | null;
          healing_goal?: string | null;
          latest_diagnostic_id?: string | null;
          current_section_id?: string | null;
          current_slot_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      diagnostic_responses: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string | null;
          slot_id: string | null;
          assignment_id: string | null;
          question_key: string;
          answer_text: string;
          answer_json: Json | null;
          responded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id?: string | null;
          slot_id?: string | null;
          assignment_id?: string | null;
          question_key: string;
          answer_text: string;
          answer_json?: Json | null;
          responded_at?: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      course_section_status: CourseSectionStatus;
      slot_assignment_type: SlotAssignmentType;
      exercise_library_status: ExerciseLibraryStatus;
      user_course_assignment_status: UserCourseAssignmentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

/** Domain helpers for application services (not stored as DB columns). */

export type ExerciseCapabilityKey = "audio" | "video" | "diagnostic";

export type RuleBasedSelectionRule = {
  tag_slugs?: string[];
  capability_keys?: ExerciseCapabilityKey[];
  metadata_filters?: Record<string, Json>;
  exclude_exercise_ids?: string[];
  max_duration_min?: number;
};

export type AiSelectionConfig = {
  model?: string;
  prompt_version?: string;
  candidate_tag_slugs?: string[];
  candidate_capability_keys?: ExerciseCapabilityKey[];
  max_candidates?: number;
  temperature?: number;
};

export type UserCourseAssignmentWithProgress =
  CourseDatabase["public"]["Tables"]["user_course_assignments"]["Row"] & {
    progress: CourseDatabase["public"]["Tables"]["user_course_assignment_progress"]["Row"] | null;
    exercise: CourseDatabase["public"]["Tables"]["exercise_library"]["Row"];
    slot: CourseDatabase["public"]["Tables"]["course_slots"]["Row"];
  };

export type ExerciseLibraryWithRelations =
  CourseDatabase["public"]["Tables"]["exercise_library"]["Row"] & {
    capabilities: CourseDatabase["public"]["Tables"]["capability_types"]["Row"][];
    tags: CourseDatabase["public"]["Tables"]["exercise_tags"]["Row"][];
  };
