import "@solar-sales/env/web";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [new URL("https://img.daisyui.com/images/stock/**")],
  },
  reactCompiler: true,
};

export default nextConfig;
