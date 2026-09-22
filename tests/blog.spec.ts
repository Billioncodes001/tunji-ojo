import { test, expect } from '@playwright/test';
import { blogPosts, postRoute } from '../src/editorial/blog';
import { pages } from '../src/editorial/render';
import { testSiteUrl } from './site-settings';

test('blog search and topic filters combine and recover from empty results', async ({ page }) => {
 await page.goto('./blog/');
 await expect(page.locator('[data-blog-card]:visible')).toHaveCount(3);
 await page.getByRole('button', { name: 'Immigration', exact: true }).click();
 await expect(page.locator('[data-blog-card]:visible')).toHaveCount(1);
 await expect(page.locator('[data-blog-card]:visible')).toContainText('airport e-gates');
 await page.getByRole('searchbox', { name: 'Find a story' }).fill('no-match');
 await expect(page.getByRole('heading', { name: 'No stories found.' })).toBeVisible();
 await expect(page.locator('#blog-status')).toHaveText('0 articles');
 await page.getByRole('button', { name: 'Clear search & filters' }).click();
 await expect(page.locator('[data-blog-card]:visible')).toHaveCount(3);
 await page.getByRole('searchbox', { name: 'Find a story' }).fill('accountability');
 await expect(page.locator('[data-blog-card]:visible')).toHaveCount(1);
 await page.locator('[data-blog-card]:visible a').click();
 await expect(page).toHaveURL(/blog\/interior-reform-institutions-accountability\/$/);
});

test('articles are complete without JavaScript and expose consistent search metadata', async ({ browser, request }) => {
 const context = await browser.newContext({ javaScriptEnabled: false });
 const page = await context.newPage();
 const base = test.info().project.use.baseURL!;
 const sitemap = await (await request.get('./sitemap.xml')).text();
 const feed = await (await request.get('./feed.xml')).text();
 for (const post of blogPosts) {
  const route = postRoute(post) + '/';
  await page.goto(new URL(route, base).href);
  await expect(page.locator('main h1')).toHaveText(post.title);
  for (const section of post.sections) await expect(page.locator(`#${section.id} h2`)).toHaveText(section.title);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', testSiteUrl + route);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  const article = schema['@graph'].find((n: Record<string, unknown>) => n['@type'] === 'BlogPosting');
  expect(article.headline).toBe(post.title);
  expect(article.mainEntityOfPage['@id']).toBe(testSiteUrl + route);
  expect(article.author.name).toContain('Independent Profile');
  expect(article.citation).toEqual(post.sources.map(s => s.url));
  expect(sitemap).toContain(`<loc>${testSiteUrl}${route}</loc>`);
  expect(feed).toContain(`<link>${testSiteUrl}${route}</link>`);
 }
 await page.goto(new URL('blog/', base).href);
 await expect(page.locator('[data-blog-card]')).toHaveCount(3);
 await expect(page.locator('[data-blog-tools]')).toBeHidden();
 await context.close();
});

test('timeline works with keyboard and article contents work on narrow screens', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('./');
 await page.locator('[data-year="2025"]').focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('#year-2025')).toBeVisible();
 await expect(page.locator('#year-2019')).toBeHidden();
 await expect(page.locator('[data-year="2025"]')).toHaveAttribute('aria-current', 'true');
 await page.setViewportSize({ width: 320, height: 740 });
 for (const post of blogPosts) {
  await page.goto('./' + postRoute(post) + '/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.getByRole('navigation', { name: 'Article contents' }).getByRole('link', { name: 'Sources & further reading' }).click();
  await expect(page).toHaveURL(/#article-sources$/);
  await expect(page.locator('#article-sources h2')).toBeInViewport();
 }
});

test('all indexable routes have distinct descriptive metadata', async ({ page }) => {
 const titles = new Set<string>();
 const descriptions = new Set<string>();
 const routes = [...pages.map(p => p[0]), ...blogPosts.map(postRoute)];
 for (const route of routes) {
  await page.goto(`./${route ? route + '/' : ''}`);
  const title = await page.title();
  const description = (await page.locator('meta[name="description"]').getAttribute('content'))!;
  expect(titles.has(title), route).toBe(false);
  expect(descriptions.has(description), route).toBe(false);
  expect(description.length, route).toBeGreaterThan(60);
  titles.add(title); descriptions.add(description);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow, max-image-preview:large');
 }
});
