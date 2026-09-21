import { expect, test } from "@playwright/test";

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
  }));
  expect(state).toMatchObject({ muted: true, loop: true, inline: true });
  expect(state.duration).toBeGreaterThan(5);
  expect(state.duration).toBeLessThan(10);
  expect(state.src).toContain("/tunji-ojo/media/tunji-ojo-egates-loop.");
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
    await page.goto("http://127.0.0.1:4175/tunji-ojo/");
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
    page.getByRole("link", { name: "Watch the full report" }),
  ).toBeVisible();
});
