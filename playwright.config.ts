import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:4175/tunji-ojo/",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "SITE_BASE=/tunji-ojo/ bun run build && SITE_BASE=/tunji-ojo/ bun run preview --host 127.0.0.1 --port 4175 --strictPort",
    url: "http://127.0.0.1:4175/tunji-ojo/",
    reuseExistingServer: false,
  },
});
