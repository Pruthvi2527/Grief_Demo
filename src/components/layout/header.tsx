import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur",
        className,
      )}
    >
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="font-semibold">
          {siteConfig.name}
        </Link>
      </div>
    </header>
  );
}
