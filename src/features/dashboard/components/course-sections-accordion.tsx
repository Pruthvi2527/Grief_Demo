"use client";

import { useState } from "react";

import { getDefaultExpandedSectionIds } from "../lib/exercise-display";
import type { SectionSummary } from "../types";
import { CourseSectionAccordion } from "./CourseSectionAccordion";

type CourseSectionsAccordionProps = {
  sections: SectionSummary[];
  currentExerciseId: string | null;
  /**
   * Week 2+: AI-recommended exercise id. Highlights a row without changing layout.
   */
  recommendedExerciseId?: string | null;
};

export function CourseSectionsAccordion({
  sections,
  currentExerciseId,
  recommendedExerciseId = null,
}: CourseSectionsAccordionProps) {
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(
    () => new Set(getDefaultExpandedSectionIds(sections)),
  );

  function toggleSection(sectionId: string) {
    setExpandedSectionIds((previous) => {
      const next = new Set(previous);

      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }

      return next;
    });
  }

  return (
    <section aria-labelledby="course-sections-heading" className="space-y-4">
      <div>
        <h2
          id="course-sections-heading"
          className="text-xl font-semibold text-onboarding-foreground"
        >
          Course sections
        </h2>
        <p className="mt-1 text-sm text-onboarding-muted">
          Complete each section to unlock the next part of your journey.
        </p>
      </div>

      <ol className="space-y-3">
        {sections.map((section, index) => (
          <CourseSectionAccordion
            key={section.id}
            section={section}
            sectionNumber={index + 1}
            isExpanded={expandedSectionIds.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            currentExerciseId={currentExerciseId}
            recommendedExerciseId={recommendedExerciseId}
          />
        ))}
      </ol>
    </section>
  );
}
