import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">{siteConfig.name}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
      </div>
    </main>
  );
}
