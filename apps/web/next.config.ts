import "@solar-sales/env/web";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.daisyui.com",
        pathname: "/images/stock/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
