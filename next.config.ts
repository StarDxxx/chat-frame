import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer", "@puppeteer/browsers", "puppeteer-core", "@sparticuz/chromium"],
};

export default nextConfig;
