"use client";

import { type ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type StepTransitionProps = {
  stepKey: string;
  direction: "forward" | "backward";
  children: ReactNode;
  className?: string;
};

export function StepTransition({
  stepKey,
  direction,
  children,
  className,
}: StepTransitionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [stepKey]);

  return (
    <div
      key={stepKey}
      className={cn(
        "transition-all duration-300 ease-out",
        visible
          ? "translate-x-0 opacity-100"
          : direction === "forward"
            ? "translate-x-4 opacity-0"
            : "-translate-x-4 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
