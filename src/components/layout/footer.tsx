import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn("border-t border-border py-6 text-center text-sm text-muted-foreground", className)}
    >
      <p>
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </p>
    </footer>
  );
}
