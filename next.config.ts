import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer", "@puppeteer/browsers", "puppeteer-core"],
};

export default nextConfig;
