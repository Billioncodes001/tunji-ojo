import { siteConfig } from "../scripts/site-config";
const settings = siteConfig({ SITE_URL: process.env.TEST_SITE_URL });
export const testSiteUrl = settings.url;
export const testBase = settings.base;
export const previewUrl = `http://127.0.0.1:4175${testBase}`;
