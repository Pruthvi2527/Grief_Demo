import { cn } from "@/lib/utils";

type AuthErrorAlertProps = {
  message?: string | null;
  className?: string;
};

export function AuthErrorAlert({ message, className }: AuthErrorAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
        className,
      )}
      role="alert"
    >
      {message}
    </p>
  );
}

type AuthSuccessAlertProps = {
  message?: string | null;
  className?: string;
};

export function AuthSuccessAlert({ message, className }: AuthSuccessAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-md border border-onboarding-primary/20 bg-onboarding-primary/10 px-3 py-2 text-sm text-onboarding-primary",
        className,
      )}
      role="status"
    >
      {message}
    </p>
  );
}
