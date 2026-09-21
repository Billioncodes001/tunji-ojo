import { defineConfig } from "@playwright/test";
import { testSiteUrl, testBase, previewUrl } from "./tests/site-settings";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  workers: 2,
  use: {
    baseURL: previewUrl,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "bun run build && bun run preview --host 127.0.0.1 --port 4175 --strictPort",
    url: previewUrl,
    env: { SITE_URL: testSiteUrl, SITE_BASE: testBase },
    reuseExistingServer: false,
  },
});
