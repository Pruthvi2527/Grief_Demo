import Link from "next/link";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  MOBILE_SIDEBAR_NAV,
  PRIMARY_SIDEBAR_NAV,
  PROFILE_SIDEBAR_NAV,
  type SidebarNavId,
  type SidebarNavItem,
} from "../lib/sidebar-nav";

type DashboardShellProps = {
  children: React.ReactNode;
  activeNav?: SidebarNavId;
};

function SidebarNavLink({
  item,
  isActive,
  layout,
}: {
  item: SidebarNavItem;
  isActive: boolean;
  layout: "desktop" | "mobile";
}) {
  const Icon = item.icon;

  if (item.disabled) {
    if (layout === "mobile") {
      return (
        <span className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] text-onboarding-muted/60">
          <Icon className="size-5" aria-hidden="true" />
          {item.label}
        </span>
      );
    }

    return (
      <span
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-onboarding-muted/70"
        aria-disabled="true"
      >
        <Icon className="size-5" aria-hidden="true" />
        {item.label}
        <span className="ml-auto text-xs uppercase tracking-wide">Soon</span>
      </span>
    );
  }

  if (layout === "mobile") {
    return (
      <Link
        href={item.href}
        className={cn(
          "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition-colors",
          isActive ? "text-onboarding-primary" : "text-onboarding-muted",
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon className="size-5" aria-hidden="true" />
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
        isActive
          ? "bg-onboarding-primary text-white"
          : "text-onboarding-foreground hover:bg-onboarding-surface",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="size-5" aria-hidden="true" />
      {item.label}
    </Link>
  );
}

export function DashboardShell({
  children,
  activeNav = "tree",
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-onboarding-background lg:h-screen lg:overflow-hidden">
      <aside className="relative hidden border-r border-onboarding-border/70 bg-onboarding-surface/40 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:h-screen lg:w-[280px] lg:flex-col lg:overflow-y-auto">
        <div className="flex flex-1 flex-col gap-10 p-8">
          <p className="text-2xl font-semibold text-onboarding-primary">bonds</p>

          <nav aria-label="Main navigation" className="space-y-1">
            {PRIMARY_SIDEBAR_NAV.map((item) => (
              <SidebarNavLink
                key={item.id}
                item={item}
                isActive={item.id === activeNav}
                layout="desktop"
              />
            ))}
          </nav>

          <nav aria-label="Account navigation" className="mt-auto space-y-1">
            <SidebarNavLink
              item={PROFILE_SIDEBAR_NAV}
              isActive={activeNav === "profile"}
              layout="desktop"
            />
          </nav>
        </div>

        <div className="p-8">
          <div className="rounded-2xl bg-gradient-to-br from-[#dfe8df] via-[#edf2e8] to-[#f6f1e8] p-6">
            <div className="mx-auto h-32 w-32 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f8efe2,transparent_55%),radial-gradient(circle_at_70%_60%,#b8c9b0,transparent_50%)]" />
            <p className="mt-4 text-sm leading-relaxed text-onboarding-primary/80">
              Your healing journey grows one exercise at a time.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:ml-[280px] lg:h-screen lg:min-h-0 lg:overflow-hidden">
        <header className="shrink-0 border-b border-onboarding-border/60 px-6 py-5 lg:hidden">
          <p className="text-center text-xl font-semibold text-onboarding-primary">
            bonds
          </p>
        </header>

        <main className="min-h-0 flex-1 px-6 py-8 sm:px-8 lg:overflow-y-auto lg:scroll-smooth lg:px-12 lg:py-10">
          {children}
        </main>

        <nav
          aria-label="Mobile navigation"
          className="sticky bottom-0 shrink-0 border-t border-onboarding-border/70 bg-onboarding-background/95 px-2 py-3 backdrop-blur lg:hidden"
        >
          <ul className="grid grid-cols-5 gap-1">
            {MOBILE_SIDEBAR_NAV.map((item) => (
              <li key={item.id}>
                <SidebarNavLink
                  item={item}
                  isActive={item.id === activeNav}
                  layout="mobile"
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function DashboardLockIcon() {
  return <Lock className="size-4 shrink-0 text-onboarding-muted" aria-hidden="true" />;
}
