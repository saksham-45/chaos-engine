import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // the math playground was renamed /mystery → /lab (КБ-14 figures appendix)
      { source: "/mystery", destination: "/lab", permanent: true },
    ];
  },
};

export default nextConfig;
