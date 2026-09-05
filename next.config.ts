import type { NextConfig } from "next";

// ADR-010: the browser only ever talks to this origin. /api/v1/* is proxied to
// the NestJS backend (no CORS anywhere; cookies stay first-party/same-origin).
const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_INTERNAL_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
