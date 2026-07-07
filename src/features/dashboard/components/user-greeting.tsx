type UserGreetingProps = {
  name: string | null;
};

function getFirstName(fullName: string | null): string | null {
  if (!fullName?.trim()) {
    return null;
  }

  return fullName.trim().split(/\s+/)[0] ?? null;
}

export function UserGreeting({ name }: UserGreetingProps) {
  const firstName = getFirstName(name);

  return (
    <header className="space-y-2">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-onboarding-muted">
        My Tree
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-onboarding-foreground sm:text-4xl">
        {firstName ? `Hello, ${firstName}` : "Hello there"}
      </h1>
      <p className="max-w-2xl text-base text-onboarding-muted">
        Pick up where you left off and continue your course at your own pace.
      </p>
    </header>
  );
}
