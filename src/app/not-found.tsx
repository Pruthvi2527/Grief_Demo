import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <FileQuestion className="size-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="max-w-md text-center text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Go home
      </Link>
    </div>
  );
}
