import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import { ProfileService } from "@/features/profile/services/profile.service";
import type { Profile } from "@/features/profile/types";

import type { OnboardingQuestionKey } from "../lib/question-keys";
import type { OnboardingWizardValues } from "../schemas";

type OnboardingAnswerRow =
  Database["public"]["Tables"]["onboarding_answers"]["Row"];
type OnboardingAnswerInsert =
  Database["public"]["Tables"]["onboarding_answers"]["Insert"];

export class OnboardingService {
  constructor(
    private readonly supabase: Awaited<ReturnType<typeof createClient>>,
    private readonly profileService: ProfileService,
  ) {}

  static async create() {
    const supabase = await createClient();
    const profileService = new ProfileService(supabase);
    return new OnboardingService(supabase, profileService);
  }

  async getAnswers(userId: string): Promise<OnboardingAnswerRow[]> {
    const { data, error } = await this.supabase
      .from("onboarding_answers")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to load onboarding answers: ${error.message}`);
    }

    return data ?? [];
  }

  async getAnswersMap(userId: string): Promise<Partial<OnboardingWizardValues>> {
    const answers = await this.getAnswers(userId);
    const map: Partial<OnboardingWizardValues> = {};

    for (const answer of answers) {
      const parsed = this.parseAnswerText(answer.answer_text);

      switch (answer.question_key) {
        case "grieving_who":
          map.grieving_who = Array.isArray(parsed) ? parsed : [];
          break;
        case "loss_timeline":
          map.loss_timeline = typeof parsed === "string" ? parsed : "";
          break;
      }
    }

    return map;
  }

  async upsertAnswer(
    userId: string,
    questionKey: OnboardingQuestionKey,
    value: string | string[],
  ) {
    const payload: OnboardingAnswerInsert = {
      user_id: userId,
      question_key: questionKey,
      answer_text: this.serializeAnswer(value),
    };

    const { error } = await this.supabase
      .from("onboarding_answers")
      .upsert(payload, { onConflict: "user_id,question_key" });

    if (error) {
      throw new Error(`Failed to save onboarding answer: ${error.message}`);
    }
  }

  async completeOnboarding(userId: string): Promise<Profile> {
    return this.profileService.markOnboardingComplete(userId);
  }

  private serializeAnswer(value: string | string[]): string {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }

    return value;
  }

  private parseAnswerText(answerText: string): string | string[] {
    try {
      const parsed: unknown = JSON.parse(answerText);

      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return answerText;
    }

    return answerText;
  }
}
