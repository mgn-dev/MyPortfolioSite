import type { NextConfig } from "next";

function pocketBaseRemotePattern():
  | { protocol: "https" | "http"; hostname: string; pathname: string }
  | undefined {
  const raw = process.env.NEXT_PUBLIC_POCKETBASE_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return {
      protocol: url.protocol === "http:" ? "http" : "https",
      hostname: url.hostname,
      pathname: "/api/files/**",
    };
  } catch {
    return undefined;
  }
}

const pbPattern = pocketBaseRemotePattern();

const nextConfig: NextConfig = {
  images: pbPattern ? { remotePatterns: [pbPattern] } : undefined,
  // Allow dev requests (HMR, RSC payloads, source maps) from devices on the
  // local network during `next dev`. Without this, Next.js 16 blocks them
  // and hydration/interactivity can break when you open the dev URL on a
  // phone via the host IP. Production builds are unaffected.
  allowedDevOrigins: ["192.168.8.107"],
};

export default nextConfig;
