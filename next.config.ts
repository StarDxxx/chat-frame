import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer", "@puppeteer/browsers", "puppeteer-core", "@sparticuz/chromium"],
  // @sparticuz/chromium keeps its Chromium binary in a `bin/` directory that
  // Next.js static file tracing misses because it's accessed dynamically at
  // runtime. Explicitly include it so it lands in the Lambda deployment bundle.
  outputFileTracingIncludes: {
    "/api/parse": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
};

export default nextConfig;
