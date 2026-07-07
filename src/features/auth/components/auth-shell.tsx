import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
};

export function AuthShell({
  children,
  title,
  description,
  className,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-onboarding-background p-6">
      <div className={cn("w-full max-w-md space-y-6", className)}>
        <div className="text-center">
          <p className="text-2xl font-semibold text-onboarding-primary">bonds</p>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-onboarding-foreground">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm text-onboarding-muted">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </main>
  );
}
