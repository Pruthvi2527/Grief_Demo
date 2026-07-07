"use client";

import { Bell, Loader2, Lock, LogOut, Pencil, Shield } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { signOutUser } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

import { ProfileCard } from "./profile-card";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 bg-onboarding-primary text-white hover:bg-onboarding-primary/90"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </>
      )}
    </Button>
  );
}

type DisabledSettingButtonProps = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function DisabledSettingButton({ label, icon: Icon }: DisabledSettingButtonProps) {
  return (
    <button
      type="button"
      disabled
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-11 w-full justify-start border-onboarding-border text-onboarding-muted opacity-70",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
      <span className="ml-auto text-xs uppercase tracking-wide">Soon</span>
    </button>
  );
}

export function AccountSettingsCard() {
  return (
    <ProfileCard title="Account Settings">
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-start border-onboarding-border"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit Profile
        </Button>

        <form action={signOutUser}>
          <LogoutSubmitButton />
        </form>

        <div className="mt-2 space-y-3 border-t border-onboarding-border/60 pt-5">
          <DisabledSettingButton label="Notifications" icon={Bell} />
          <DisabledSettingButton label="Privacy" icon={Shield} />
          <DisabledSettingButton label="Change Password" icon={Lock} />
        </div>
      </div>
    </ProfileCard>
  );
}
