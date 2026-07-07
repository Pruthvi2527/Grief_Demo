import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import { buildDashboardViewModel } from "../lib/compute-dashboard";
import type { DashboardData } from "../types";

type SectionRow = Database["public"]["Tables"]["sections"]["Row"];
type ExerciseRow = Database["public"]["Tables"]["exercises"]["Row"];
type ProgressRow = Database["public"]["Tables"]["exercise_progress"]["Row"];

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

    const sections = (sectionsResult.data ?? []) as Pick<
      SectionRow,
      "id" | "title" | "description" | "order_index"
    >[];
    const exercises = (exercisesResult.data ?? []) as Pick<
      ExerciseRow,
      "id" | "section_id" | "title" | "description" | "order_index" | "duration_min"
    >[];
    const progress = (progressResult.data ?? []) as Pick<
      ProgressRow,
      "exercise_id" | "status"
    >[];

    const computed = buildDashboardViewModel(sections, exercises, progress);

    return {
      userName,
      ...computed,
    };
  }

  async hasCourseContent(): Promise<boolean> {
    const { count, error } = await this.supabase
      .from("sections")
      .select("id", { count: "exact", head: true });

    if (error) {
      throw new Error(`Failed to check course content: ${error.message}`);
    }

    return (count ?? 0) > 0;
  }
}
