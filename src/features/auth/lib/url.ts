import { headers } from "next/headers";

export function getAppUrlFromEnv() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function getAppUrl() {
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (origin) {
    return origin;
  }

  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  return getAppUrlFromEnv();
}

export function getCallbackUrl(appUrl: string, callbackPath: string) {
  return `${appUrl.replace(/\/$/, "")}${callbackPath}`;
}
