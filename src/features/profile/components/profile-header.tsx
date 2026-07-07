import type { ProfilePageData } from "../types/profile-page";
import { getDisplayName, getInitials } from "../lib/profile-formatters";
import { ProfileCard } from "./profile-card";

export function ProfileHeader() {
  return (
    <header className="space-y-2">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-onboarding-muted">
        Account
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-onboarding-foreground sm:text-4xl">
        My Profile
      </h1>
      <p className="max-w-2xl text-base text-onboarding-muted">
        Manage your personal information and healing journey.
      </p>
    </header>
  );
}

type ProfileIdentityCardProps = {
  data: Pick<
    ProfilePageData,
    "fullName" | "email" | "avatarUrl" | "authProvider"
  >;
};

export function ProfileIdentityCard({ data }: ProfileIdentityCardProps) {
  const initials = getInitials(data.fullName, data.email);
  const displayName = getDisplayName(data.fullName, data.email);

  return (
    <ProfileCard title="Profile">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        {data.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.avatarUrl}
            alt=""
            className="size-20 rounded-full border border-onboarding-border object-cover"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full bg-onboarding-primary/10 text-xl font-semibold text-onboarding-primary">
            {initials}
          </div>
        )}

        <dl className="min-w-0 flex-1 space-y-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-onboarding-muted">
              Full Name
            </dt>
            <dd className="mt-1 text-lg font-medium text-onboarding-foreground">
              {displayName}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-onboarding-muted">
              Email
            </dt>
            <dd className="mt-1 text-base text-onboarding-foreground">
              {data.email ?? "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-onboarding-muted">
              Authentication Provider
            </dt>
            <dd className="mt-1 text-base text-onboarding-foreground">
              {data.authProvider}
            </dd>
          </div>
        </dl>
      </div>
    </ProfileCard>
  );
}
