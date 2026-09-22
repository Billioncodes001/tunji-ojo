import { expect, test } from "@playwright/test";
import { testBase, previewUrl } from "./site-settings";

test("hero plays a short muted local film and respects pause through dialogs", async ({
  page,
}) => {
  await page.goto("./");
  const video = page.locator("[data-hero-video]");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0.15);
  const state = await video.evaluate((v: HTMLVideoElement) => ({
    muted: v.muted,
    loop: v.loop,
    inline: v.playsInline,
    duration: v.duration,
    src: v.currentSrc,
    width: v.videoWidth,
    height: v.videoHeight,
  }));
  expect(state).toMatchObject({ muted: true, loop: true, inline: true, width: 1920, height: 1080 });
  expect(state.duration).toBeGreaterThan(5);
  expect(state.duration).toBeLessThan(10);
  expect(state.src).toContain(`${testBase}media/tunji-ojo-airport-hd.`);
  const openPages = page.context().pages().length;
  await page.getByRole("link", { name: "Watch the full film" }).click();
  await expect(page.getByRole("dialog", { name: "A welcome to Nigeria." })).toBeVisible();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  expect(page.context().pages()).toHaveLength(openPages);
  await page.keyboard.press("Escape");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  await page
    .getByRole("button", { name: "Pause background video", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Play background video", exact: true }),
  ).toBeVisible();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page
    .getByRole("button", { name: "Play background video", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(false);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(false);
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await page.locator(".hero").scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(false);
});

test("reduced motion and Save-Data avoid video downloads until explicitly requested", async ({
  browser,
}) => {
  for (const preference of ["reduce", "save-data"]) {
    const context = await browser.newContext({
      reducedMotion: preference === "reduce" ? "reduce" : "no-preference",
    });
    if (preference === "save-data")
      await context.addInitScript(() =>
        Object.defineProperty(navigator, "connection", {
          value: { saveData: true, addEventListener() {} },
        }),
      );
    const page = await context.newPage();
    const requests: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/media/")) requests.push(r.url());
    });
    await page.goto(previewUrl);
    const video = page.locator("[data-hero-video]");
    await expect(
      page.getByRole("button", { name: "Play background video", exact: true }),
    ).toBeVisible();
    expect(await video.evaluate((v: HTMLVideoElement) => v.currentSrc)).toBe(
      "",
    );
    expect(requests).toEqual([]);
    await page
      .getByRole("button", { name: "Play background video", exact: true })
      .click();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
      .toBeGreaterThan(0.15);
    await context.close();
  }
});

test("MP4 fallback plays if the WebM resource is unavailable", async ({
  page,
}) => {
  await page.route("**/media/*.webm", (r) => r.abort());
  await page.goto("./");
  const video = page.locator("[data-hero-video]");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentSrc))
    .toMatch(/\.mp4$/);
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0.15);
});

test("failed media retains the poster and the full-report link", async ({
  page,
}) => {
  await page.route("**/media/*", (r) => r.abort());
  await page.goto("./");
  await expect(page.locator(".hero")).not.toHaveClass(/has-film/);
  await expect(page.locator("[data-hero-toggle]")).toBeHidden();
  await expect(page.locator(".hero-image img")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Watch the full film" }),
  ).toBeVisible();
});


test("phones load only the portrait film at native resolution", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const mediaRequests: string[] = [];
  page.on("request", request => {
    if (/\/media\/.*\.(mp4|webm)/.test(request.url())) mediaRequests.push(request.url());
  });
  await page.goto("./");
  const video = page.locator("[data-hero-video]");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.15);
  expect(await video.evaluate((v: HTMLVideoElement) => [v.videoWidth, v.videoHeight])).toEqual([720, 1080]);
  expect(mediaRequests.length).toBeGreaterThan(0);
  expect(mediaRequests.every(url => url.includes("tunji-ojo-airport-mobile."))).toBe(true);
  expect(await page.locator(".hero-image img").evaluate((img: HTMLImageElement) => img.currentSrc)).toContain("hero-film-poster-mobile.jpg");
});
