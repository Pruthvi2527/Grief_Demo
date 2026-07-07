"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  enrichSectionSlots,
  getSectionBadgeVariant,
} from "../lib/slot-display";
import type { SectionSummary } from "../types";
import { CourseSlotList } from "./CourseSlotList";
import { SectionCompletionBadge, SectionProgress } from "./SectionProgress";

type CourseSectionAccordionProps = {
  section: SectionSummary;
  sectionNumber: number;
  isExpanded: boolean;
  onToggle: () => void;
  currentExerciseId: string | null;
};

export function CourseSectionAccordion({
  section,
  sectionNumber,
  isExpanded,
  onToggle,
  currentExerciseId,
}: CourseSectionAccordionProps) {
  const badgeVariant = getSectionBadgeVariant(section);
  const slots = enrichSectionSlots(
    section.slots,
    section.isLocked,
    currentExerciseId,
  );
  const panelId = `section-panel-${section.id}`;
  const triggerId = `section-trigger-${section.id}`;

  return (
    <li>
      <article
        className={cn(
          "overflow-hidden rounded-2xl border transition-colors",
          section.isLocked
            ? "border-onboarding-border/70 bg-onboarding-surface/30"
            : section.isCurrent
              ? "border-onboarding-primary/30 bg-white shadow-sm"
              : "border-onboarding-border bg-white/80",
        )}
      >
        <button
          id={triggerId}
          type="button"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            "flex w-full items-start gap-4 px-5 py-4 text-left transition-colors",
            "hover:bg-onboarding-surface/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-onboarding-primary",
          )}
        >
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-onboarding-muted">
                  Section {sectionNumber}
                </p>
                <h3 className="text-lg font-semibold text-onboarding-foreground">
                  {section.title}
                </h3>
              </div>
              <SectionCompletionBadge variant={badgeVariant} />
            </div>

            {section.description ? (
              <p className="text-sm leading-relaxed text-onboarding-muted">
                {section.description}
              </p>
            ) : null}

            <SectionProgress section={section} />
          </div>

          <ChevronDown
            className={cn(
              "mt-1 size-5 shrink-0 text-onboarding-muted transition-transform duration-300 ease-in-out",
              isExpanded && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-in-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="border-t border-onboarding-border/60 px-5 py-4">
              <CourseSlotList slots={slots} />
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}
