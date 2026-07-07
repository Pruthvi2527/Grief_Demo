import type { EnrichedSlot } from "../lib/slot-display";
import { CourseSlot } from "./CourseSlot";

type CourseSlotListProps = {
  slots: EnrichedSlot[];
};

export function CourseSlotList({ slots }: CourseSlotListProps) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-onboarding-muted">
        No course slots are available in this section yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {slots.map((slot) => (
        <li key={slot.id}>
          <CourseSlot slot={slot} />
        </li>
      ))}
    </ul>
  );
}
