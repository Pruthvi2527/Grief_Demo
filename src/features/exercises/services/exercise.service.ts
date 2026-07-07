import { buildDashboardViewModel } from "@/features/dashboard/lib/compute-dashboard";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import { buildExerciseNavigation } from "../lib/exercise-navigation";
import { getPersonalizedIntroductionPlaceholder } from "../lib/personalized-intro";
import type { ExercisePageData } from "../types";

type SectionRow = Database["public"]["Tables"]["sections"]["Row"];
type ExerciseRow = Database["public"]["Tables"]["exercises"]["Row"];
type ProgressRow = Database["public"]["Tables"]["exercise_progress"]["Row"];

export class ExerciseService {
  constructor(
    private readonly supabase: Awaited<ReturnType<typeof createClient>>,
  ) {}

  static async create() {
    const supabase = await createClient();
    return new ExerciseService(supabase);
  }

  async getExercisePageData(
    userId: string,
    exerciseId: string,
    userName: string | null,
  ): Promise<ExercisePageData | null> {
    const [exerciseResult, courseContext] = await Promise.all([
      this.supabase
        .from("exercises")
        .select(
          "id, section_id, title, description, content_type, content_text, content_url, order_index, duration_min",
        )
        .eq("id", exerciseId)
        .maybeSingle(),
      this.loadCourseContext(userId),
    ]);

    if (exerciseResult.error) {
      throw new Error(`Failed to load exercise: ${exerciseResult.error.message}`);
    }

    if (!exerciseResult.data) {
      return null;
    }

    const exercise = exerciseResult.data;

    const { data: section, error: sectionError } = await this.supabase
      .from("sections")
      .select("id, title, order_index")
      .eq("id", exercise.section_id)
      .maybeSingle();

    if (sectionError) {
      throw new Error(`Failed to load section: ${sectionError.message}`);
    }

    if (!section) {
      throw new Error("Exercise section not found");
    }

    const navigationMeta = buildExerciseNavigation(
      courseContext.sections,
      exerciseId,
    );

    if (!navigationMeta.isAccessible) {
      return null;
    }

    const progressStatus =
      courseContext.progressMap.get(exerciseId) ?? "not_started";

    if (progressStatus === "not_started") {
      await this.markStarted(userId, exerciseId);
    }

    const personalizedIntroduction = await this.resolvePersonalizedIntroduction(
      userId,
      exerciseId,
      exercise.title,
      section.title,
      userName,
    );

    return {
      exercise: {
        id: exercise.id,
        sectionId: exercise.section_id,
        title: exercise.title,
        description: exercise.description,
        contentType: exercise.content_type,
        contentText: exercise.content_text,
        contentUrl: exercise.content_url,
        durationMin: exercise.duration_min,
        orderIndex: exercise.order_index,
      },
      section: {
        id: section.id,
        title: section.title,
        orderIndex: section.order_index,
      },
      progress: {
        status: progressStatus === "not_started" ? "in_progress" : progressStatus,
        overallProgressPercent: courseContext.overallProgressPercent,
        completedExercises: courseContext.completedExercises,
        totalExercises: courseContext.totalExercises,
      },
      navigation: {
        previousExerciseId: navigationMeta.previousExerciseId,
        previousExerciseTitle: navigationMeta.previousExerciseTitle,
        nextExerciseId: navigationMeta.nextExerciseId,
        nextExerciseTitle: navigationMeta.nextExerciseTitle,
        positionInCourse: navigationMeta.positionInCourse,
        totalExercises: navigationMeta.totalExercises,
      },
      personalizedIntroduction,
      userName,
    };
  }

  /**
   * Week 2: call AI service with onboarding + assessment answers to generate framing.
   */
  async resolvePersonalizedIntroduction(
    _userId: string,
    _exerciseId: string,
    exerciseTitle: string,
    sectionTitle: string,
    userName: string | null,
  ): Promise<string> {
    return getPersonalizedIntroductionPlaceholder(
      exerciseTitle,
      sectionTitle,
      userName,
    );
  }

  async markStarted(userId: string, exerciseId: string): Promise<void> {
    const { data: existing, error: selectError } = await this.supabase
      .from("exercise_progress")
      .select("status, started_at")
      .eq("user_id", userId)
      .eq("exercise_id", exerciseId)
      .maybeSingle();

    if (selectError) {
      throw new Error(
        `Failed to read exercise progress: ${selectError.message}`,
      );
    }

    if (existing?.status === "completed" || existing?.status === "in_progress") {
      return;
    }

    const now = new Date().toISOString();
    const { error } = await this.supabase.from("exercise_progress").upsert(
      {
        user_id: userId,
        exercise_id: exerciseId,
        status: "in_progress",
        started_at: now,
        completed_at: null,
      },
      { onConflict: "user_id,exercise_id" },
    );

    if (error) {
      throw new Error(`Failed to mark exercise started: ${error.message}`);
    }
  }

  async markCompleted(
    userId: string,
    exerciseId: string,
  ): Promise<{ nextExerciseId: string | null }> {
    const now = new Date().toISOString();

    const { data: existing, error: selectError } = await this.supabase
      .from("exercise_progress")
      .select("started_at")
      .eq("user_id", userId)
      .eq("exercise_id", exerciseId)
      .maybeSingle();

    if (selectError) {
      throw new Error(
        `Failed to read exercise progress: ${selectError.message}`,
      );
    }

    const { error } = await this.supabase.from("exercise_progress").upsert(
      {
        user_id: userId,
        exercise_id: exerciseId,
        status: "completed",
        started_at: existing?.started_at ?? now,
        completed_at: now,
      },
      { onConflict: "user_id,exercise_id" },
    );

    if (error) {
      throw new Error(`Failed to complete exercise: ${error.message}`);
    }

    const courseContext = await this.loadCourseContext(userId);
    const navigationMeta = buildExerciseNavigation(
      courseContext.sections,
      exerciseId,
    );

    return {
      nextExerciseId: navigationMeta.nextExerciseId,
    };
  }

  private async loadCourseContext(userId: string) {
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
    const progressMap = new Map(
      progress.map((item) => [item.exercise_id, item.status]),
    );

    return {
      ...computed,
      progressMap,
    };
  }
}
