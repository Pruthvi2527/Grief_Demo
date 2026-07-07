import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import { ProfileService } from "@/features/profile/services/profile.service";
import type { Profile } from "@/features/profile/types";

import type { AssessmentQuestionKey } from "../lib/question-keys";
import type { AssessmentWizardValues } from "../schemas";

type AssessmentAnswerInsert =
  Database["public"]["Tables"]["assessment_answers"]["Insert"];

export class AssessmentService {
  constructor(
    private readonly supabase: Awaited<ReturnType<typeof createClient>>,
    private readonly profileService: ProfileService,
  ) {}

  static async create() {
    const supabase = await createClient();
    const profileService = new ProfileService(supabase);
    return new AssessmentService(supabase, profileService);
  }

  async getInitialAnswers(userId: string): Promise<Partial<AssessmentWizardValues>> {
    const { data, error } = await this.supabase
      .from("assessment_answers")
      .select("*")
      .eq("user_id", userId)
      .is("exercise_id", null)
      .order("updated_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to load assessment answers: ${error.message}`);
    }

    const map: Partial<AssessmentWizardValues> = {};
    const seen = new Set<string>();

    for (const answer of data ?? []) {
      if (seen.has(answer.question_key)) {
        continue;
      }

      seen.add(answer.question_key);

      switch (answer.question_key) {
        case "current_feelings":
          map.current_feelings = this.parseArrayAnswer(answer.answer_text);
          break;
        case "grief_weight":
          map.grief_weight = answer.answer_text;
          break;
        case "energy_level":
          map.energy_level = answer.answer_text;
          break;
      }
    }

    return map;
  }

  async saveAnswer(
    userId: string,
    questionKey: AssessmentQuestionKey,
    value: string | string[],
  ) {
    await this.supabase
      .from("assessment_answers")
      .delete()
      .eq("user_id", userId)
      .eq("question_key", questionKey)
      .is("exercise_id", null);

    const payload: AssessmentAnswerInsert = {
      user_id: userId,
      question_key: questionKey,
      answer_text: this.serializeAnswer(value),
      exercise_id: null,
    };

    const { error } = await this.supabase
      .from("assessment_answers")
      .insert(payload);

    if (error) {
      throw new Error(`Failed to save assessment answer: ${error.message}`);
    }
  }

  async completeAssessment(userId: string): Promise<Profile> {
    return this.profileService.markAssessmentComplete(userId);
  }

  private serializeAnswer(value: string | string[]): string {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }

    return value;
  }

  private parseArrayAnswer(answerText: string): string[] {
    try {
      const parsed: unknown = JSON.parse(answerText);

      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return answerText ? [answerText] : [];
    }

    return [];
  }
}
