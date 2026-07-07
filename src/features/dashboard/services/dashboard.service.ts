import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { CourseDatabase, SlotAssignmentType } from "@/types/database.course";

import { buildSlotDashboardViewModel } from "../lib/compute-slot-dashboard";
import { buildDashboardViewModel } from "../lib/compute-dashboard";
import type { DashboardData } from "../types";

type SectionRow = Database["public"]["Tables"]["sections"]["Row"];
type ExerciseRow = Database["public"]["Tables"]["exercises"]["Row"];
type ProgressRow = Database["public"]["Tables"]["exercise_progress"]["Row"];

type Supabase = Awaited<ReturnType<typeof createClient>>;

type CourseClient = {
  from: (
    table: keyof CourseDatabase["public"]["Tables"] | keyof Database["public"]["Tables"],
  ) => ReturnType<Supabase["from"]>;
};

type CourseSectionRow = {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
};

type CourseSlotRow = {
  id: string;
  section_id: string;
  title: string;
  order_index: number;
  assignment_type: SlotAssignmentType;
  fixed_exercise_id: string | null;
};

type ExerciseLibraryRow = {
  id: string;
  title: string;
  duration_min: number | null;
};

type AssignmentRow = {
  slot_id: string;
  exercise_id: string;
  user_course_id: string;
};

function getCourseClient(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase as unknown as CourseClient;
}

export class DashboardService {
  constructor(
    private readonly supabase: Awaited<ReturnType<typeof createClient>>,
  ) {}

  static async create() {
    const supabase = await createClient();
    return new DashboardService(supabase);
  }

  async getDashboardData(
    userId: string,
    userName: string | null,
  ): Promise<DashboardData> {
    const v2Data = await this.tryGetV2DashboardData(userId);

    if (v2Data) {
      return { userName, ...v2Data };
    }

    return this.getLegacyDashboardData(userId, userName);
  }

  async hasCourseContent(): Promise<boolean> {
    const courseClient = getCourseClient(this.supabase);

    const { count: v2Count, error: v2Error } = await courseClient
      .from("course_sections")
      .select("id", { count: "exact", head: true });

    if (!v2Error && (v2Count ?? 0) > 0) {
      return true;
    }

    const { count, error } = await this.supabase
      .from("sections")
      .select("id", { count: "exact", head: true });

    if (error) {
      throw new Error(`Failed to check course content: ${error.message}`);
    }

    return (count ?? 0) > 0;
  }

  private async tryGetV2DashboardData(userId: string) {
    const courseClient = getCourseClient(this.supabase);

    const [
      sectionsResult,
      slotsResult,
      exercisesResult,
      progressResult,
    ] = await Promise.all([
      courseClient
        .from("course_sections")
        .select("id, title, description, order_index")
        .eq("status", "published")
        .order("order_index", { ascending: true }),
      courseClient
        .from("course_slots")
        .select(
          "id, section_id, title, order_index, assignment_type, fixed_exercise_id",
        )
        .order("order_index", { ascending: true }),
      courseClient
        .from("exercise_library")
        .select("id, title, duration_min")
        .eq("status", "published"),
      this.supabase
        .from("exercise_progress")
        .select("exercise_id, status")
        .eq("user_id", userId),
    ]);

    if (
      sectionsResult.error?.message.includes("relation") ||
      slotsResult.error?.message.includes("relation") ||
      exercisesResult.error?.message.includes("relation")
    ) {
      return null;
    }

    if (sectionsResult.error) {
      throw new Error(
        `Failed to load course sections: ${sectionsResult.error.message}`,
      );
    }

    if (!sectionsResult.data?.length) {
      return null;
    }

    if (slotsResult.error) {
      throw new Error(`Failed to load course slots: ${slotsResult.error.message}`);
    }

    if (exercisesResult.error) {
      throw new Error(
        `Failed to load exercise library: ${exercisesResult.error.message}`,
      );
    }

    if (progressResult.error) {
      throw new Error(
        `Failed to load exercise progress: ${progressResult.error.message}`,
      );
    }

    const assignments = await this.loadUserAssignments(userId);

    return buildSlotDashboardViewModel(
      sectionsResult.data as CourseSectionRow[],
      (slotsResult.data ?? []) as CourseSlotRow[],
      (exercisesResult.data ?? []) as ExerciseLibraryRow[],
      assignments,
      (progressResult.data ?? []) as Pick<
        ProgressRow,
        "exercise_id" | "status"
      >[],
    );
  }

  private async loadUserAssignments(userId: string) {
    const courseClient = getCourseClient(this.supabase);

    const { data: userCourse, error: userCourseError } = await courseClient
      .from("user_courses")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (userCourseError?.message.includes("relation")) {
      return [];
    }

    if (userCourseError) {
      throw new Error(`Failed to load user course: ${userCourseError.message}`);
    }

    if (!userCourse?.id) {
      return [];
    }

    const { data, error } = await courseClient
      .from("user_course_assignments")
      .select("slot_id, exercise_id, user_course_id")
      .eq("user_course_id", userCourse.id);

    if (error) {
      throw new Error(`Failed to load assignments: ${error.message}`);
    }

    return ((data ?? []) as AssignmentRow[]).map((item) => ({
      slot_id: item.slot_id,
      exercise_id: item.exercise_id,
    }));
  }

  private async getLegacyDashboardData(
    userId: string,
    userName: string | null,
  ): Promise<DashboardData> {
    const [sectionsResult, exercisesResult, progressResult] = await Promise.all([
      this.supabase
        .from("sections")
        .select("id, title, description, order_index")
        .order("order_index", { ascending: true }),
      this.supabase
        .from("exercises")
        .select("id, section_id, title, description, order_index, duration_min")
        .order("order_index", { ascending: true }),
      this.supabase
        .from("exercise_progress")
        .select("exercise_id, status")
        .eq("user_id", userId),
    ]);

    if (sectionsResult.error) {
      throw new Error(`Failed to load sections: ${sectionsResult.error.message}`);
    }

    if (exercisesResult.error) {
      throw new Error(`Failed to load exercises: ${exercisesResult.error.message}`);
    }

    if (progressResult.error) {
      throw new Error(
        `Failed to load exercise progress: ${progressResult.error.message}`,
      );
    }

    const legacy = buildDashboardViewModel(
      (sectionsResult.data ?? []) as Pick<
        SectionRow,
        "id" | "title" | "description" | "order_index"
      >[],
      (exercisesResult.data ?? []) as Pick<
        ExerciseRow,
        "id" | "section_id" | "title" | "description" | "order_index" | "duration_min"
      >[],
      (progressResult.data ?? []) as Pick<
        ProgressRow,
        "exercise_id" | "status"
      >[],
    );

    return {
      userName,
      ...legacy,
    };
  }
}
