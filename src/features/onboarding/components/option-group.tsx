"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type OptionCardProps = {
  label: string;
  selected: boolean;
  mode: "single" | "multiple";
  onSelect: () => void;
};

export function OptionCard({ label, selected, mode, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200",
        "hover:border-onboarding-primary/40 hover:bg-white",
        selected
          ? "border-onboarding-primary bg-white shadow-sm"
          : "border-onboarding-border bg-onboarding-surface/60",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center border transition-colors",
          mode === "single" ? "rounded-full" : "rounded-md",
          selected
            ? "border-onboarding-primary bg-onboarding-primary text-white"
            : "border-onboarding-border bg-white",
        )}
      >
        {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
      <span className="text-base font-medium text-onboarding-foreground">
        {label}
      </span>
    </button>
  );
}

type OptionGroupProps = {
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string | string[];
  mode: "single" | "multiple";
  onChange: (value: string | string[]) => void;
};

export function OptionGroup({
  options,
  value,
  mode,
  onChange,
}: OptionGroupProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (optionValue: string) => {
    if (mode === "single") {
      onChange(optionValue);
      return;
    }

    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((item) => item !== optionValue));
      return;
    }

    onChange([...selectedValues, optionValue]);
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <OptionCard
          key={option.value}
          label={option.label}
          mode={mode}
          selected={selectedValues.includes(option.value)}
          onSelect={() => handleSelect(option.value)}
        />
      ))}
    </div>
  );
}
