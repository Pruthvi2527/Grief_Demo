type ProgressRingProps = {
  percent: number;
  completedExercises: number;
  totalExercises: number;
  size?: number;
};

export function ProgressRing({
  percent,
  completedExercises,
  totalExercises,
  size = 168,
}: ProgressRingProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`Overall progress ${clampedPercent} percent`}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-onboarding-border"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-onboarding-primary transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold text-onboarding-foreground">
            {clampedPercent}%
          </span>
          <span className="text-xs uppercase tracking-wide text-onboarding-muted">
            Complete
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-onboarding-muted">
        {completedExercises} of {totalExercises} exercises completed
      </p>
    </div>
  );
}
