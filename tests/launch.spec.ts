import { test, expect } from "@playwright/test";
import { testSiteUrl } from "./site-settings";
import { channels, officialContact } from "../src/editorial/channels";

test("launch metadata, sharing and contact references use the configured site", async ({ page, request }) => {
  await page.goto("./connect/");
  await expect(page.locator("main h1")).toContainText("CONVERSATION");
  for (const c of channels) {
    await expect(page.locator(`main a[href="${c.url}"]`)).toBeVisible();
    await expect(page.locator(`footer a[href="${c.url}"]`)).toBeVisible();
  }
  await expect(page.getByRole("link", { name: "Contact the official office" })).toHaveAttribute("href", officialContact);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${testSiteUrl}images/share-card.jpg`);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", `${testSiteUrl}images/share-card.jpg`);
  const person = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(person.url).toBe(testSiteUrl);
  expect(person.sameAs).toEqual(expect.arrayContaining(channels.map(c => c.url)));
  await page.goto("./share/");
  await expect(page.locator("#share-message")).toContainText(testSiteUrl);
  const sitemap = await (await request.get("./sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>${testSiteUrl}connect/</loc>`);
  expect(await (await request.get("./robots.txt")).text()).toContain(`${testSiteUrl}sitemap.xml`);
  await page.goto("./404.html");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
});
