import { Clock3, FileText, Headphones, Layers, Video } from "lucide-react";

import type { ExerciseDetail } from "../types";

type ExerciseContentProps = {
  exercise: ExerciseDetail;
};

function ContentTypeLabel({ contentType }: { contentType: ExerciseDetail["contentType"] }) {
  const labels = {
    audio: { icon: Headphones, label: "Audio exercise" },
    text: { icon: FileText, label: "Reading exercise" },
    video: { icon: Video, label: "Video exercise" },
    mixed: { icon: Layers, label: "Guided exercise" },
  } as const;

  const { icon: Icon, label } = labels[contentType];

  return (
    <p className="inline-flex items-center gap-2 text-sm font-medium text-onboarding-muted">
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </p>
  );
}

function DefaultExerciseBody({ exercise }: ExerciseContentProps) {
  const paragraphs = exercise.contentText
    ? exercise.contentText.split(/\n{2,}/).filter(Boolean)
    : [
        exercise.description ??
          "Take a few quiet moments with this exercise. Move slowly and notice what comes up without judgment.",
        "When you feel ready, mark the exercise complete to save your progress and continue your journey.",
      ];

  return (
    <div className="space-y-4 text-base leading-relaxed text-onboarding-foreground">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph.trim()}</p>
      ))}
    </div>
  );
}

export function ExerciseContent({ exercise }: ExerciseContentProps) {
  return (
    <section aria-labelledby="exercise-content-heading" className="space-y-6">
      <div className="space-y-3">
        <ContentTypeLabel contentType={exercise.contentType} />
        <h2
          id="exercise-content-heading"
          className="text-xl font-semibold text-onboarding-foreground"
        >
          Exercise
        </h2>
        {exercise.durationMin ? (
          <p className="inline-flex items-center gap-2 text-sm text-onboarding-muted">
            <Clock3 className="size-4" aria-hidden="true" />
            About {exercise.durationMin} minutes
          </p>
        ) : null}
      </div>

      {(exercise.contentType === "audio" || exercise.contentType === "mixed") &&
      exercise.contentUrl ? (
        <div className="rounded-2xl border border-onboarding-border bg-white p-4">
          <audio controls className="w-full" src={exercise.contentUrl}>
            Your browser does not support audio playback.
          </audio>
        </div>
      ) : null}

      {(exercise.contentType === "video" ||
        (exercise.contentType === "mixed" && exercise.contentUrl?.includes(".mp4"))) &&
      exercise.contentUrl ? (
        <div className="overflow-hidden rounded-2xl border border-onboarding-border bg-black/5">
          <video controls className="w-full" src={exercise.contentUrl}>
            Your browser does not support video playback.
          </video>
        </div>
      ) : null}

      <DefaultExerciseBody exercise={exercise} />
    </section>
  );
}
