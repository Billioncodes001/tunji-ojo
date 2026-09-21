/** One production address drives assets, canonical links and sharing. */
export function siteConfig(env: Record<string, string | undefined> = process.env) {
  const fallback = "https://billioncodes001.github.io/tunji-ojo/";
  const address = new URL(env.SITE_URL || (env.SITE_ORIGIN ? `${env.SITE_ORIGIN}${env.SITE_BASE || "/"}` : fallback));
  if (address.protocol !== "https:" || address.username || address.password || address.search || address.hash)
    throw new Error("SITE_URL must be a public HTTPS address without credentials, query or fragment.");
  const base = env.SITE_BASE || `${address.pathname.replace(/\/$/, "")}/`;
  if (!base.startsWith("/") || !base.endsWith("/")) throw new Error("SITE_BASE must start and end with /.");
  if (env.SITE_URL && base !== `${address.pathname.replace(/\/$/, "")}/`)
    throw new Error("SITE_BASE must match the path in SITE_URL.");
  return { base, origin: address.origin, url: `${address.origin}${base}` };
}
