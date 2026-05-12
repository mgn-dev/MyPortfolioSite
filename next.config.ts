import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev requests (HMR, RSC payloads, source maps) from devices on the
  // local network during `next dev`. Without this, Next.js 16 blocks them
  // and hydration/interactivity can break when you open the dev URL on a
  // phone via the host IP. Production builds are unaffected.
  allowedDevOrigins: ["192.168.8.107"],
};

export default nextConfig;
