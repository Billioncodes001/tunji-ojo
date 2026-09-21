import { expect, test } from "@playwright/test";
import { pages } from "../src/editorial/render";

test("every published page is readable without JavaScript and has working local links and assets", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const assets = new Set<string>();
  for (const [route] of pages) {
    const response = await page.goto(
      `http://127.0.0.1:4175/tunji-ojo/${route ? route + "/" : ""}`,
    );
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toHaveAttribute("data-route", route);
    expect(await page.locator("link[rel=canonical]").getAttribute("href")).toBe(
      `https://billioncodes001.github.io/tunji-ojo/${route ? route + "/" : ""}`,
    );
    expect(await page.locator("meta[name=description]").count()).toBe(1);
    expect(await page.locator('meta[property="og:description"]').count()).toBe(
      1,
    );
    expect(
      await page
        .locator('a[href^="#"]')
        .evaluateAll(
          (links) =>
            links.filter(
              (a) => !document.getElementById(a.getAttribute("href")!.slice(1)),
            ).length,
        ),
    ).toBe(0);
    for (const src of await page
      .locator("img")
      .evaluateAll((imgs) => imgs.map((i) => i.src)))
      assets.add(src);
  }
  for (const src of assets) {
    expect(src).toContain("/tunji-ojo/images/");
    expect((await request.get(src)).status(), src).toBe(200);
  }
  await context.close();
});

test("menu supports keyboard dismissal, focus restoration and deep navigation", async ({
  page,
}) => {
  await page.goto("./");
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  await expect(
    page.getByRole("dialog", { name: "Explore the record" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "The story" })
    .click();
  await expect(page).toHaveURL(/\/story\/$/);
  await expect(page.locator("h1")).toContainText("FROM AKOKO.");
  await page.reload();
  await expect(page.locator("main")).toHaveAttribute("data-route", "story");
});

test("gallery filters restrict keyboard browsing and closing restores focus", async ({
  page,
}) => {
  await page.goto("./media/");
  await page.getByRole("button", { name: "Portraits", exact: true }).click();
  await expect(page.locator("#gallery-status")).toHaveText("2 photographs");
  const photo = page.getByRole("button", {
    name: "Open photograph: The minister",
    exact: true,
  });
  await photo.click();
  await expect(page.locator("#media-title")).toHaveText("The minister");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#media-title")).toHaveText("In London");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#media-title")).toHaveText("The minister");
  await page.keyboard.press("Escape");
  await expect(photo).toBeFocused();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator("#gallery-status")).toHaveText("18 photographs");
});

test("film embeds connect only after a play request and are removed on close", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.route("https://www.youtube-nocookie.com/**", (r) =>
    r.fulfill({
      status: 200,
      body: "<p>Player test fixture</p>",
      contentType: "text/html",
    }),
  );
  await page.goto("./media/");
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(requests.some((u) => u.includes("youtube"))).toBe(false);
  await page
    .getByRole("button", { name: "Watch Service, on the ground." })
    .click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/PpDF6Dj47vg/,
  );
  await page.getByRole("button", { name: "Close media" }).click();
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("all pages fit a narrow mobile viewport with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 740 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const [route] of pages) {
    await page.goto(`./${route ? route + "/" : ""}`);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      route,
    ).toBe(320);
  }
  await page.goto("./");
  await expect(page.locator(".hero h1")).toHaveCSS("animation-name", "none");
  expect(errors).toEqual([]);
});

test("FAQ answers expand and the full attributed letter is present", async ({
  page,
}) => {
  await page.goto("./faq/");
  await page
    .locator("summary")
    .filter({ hasText: "Is this an official government website?" })
    .click();
  await expect(
    page.getByText("This is an independent documented profile.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.goto("./letter/");
  await expect(page.locator(".signature")).toContainText(
    "Comr. Adeyemo Josiah Kayode",
  );
  await expect(page.locator(".letter-body")).toContainText(
    "assessment of its authors",
  );
});
