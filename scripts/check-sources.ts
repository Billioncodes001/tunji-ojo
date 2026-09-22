import { blogPosts } from "../src/editorial/blog";
import { existsSync } from "node:fs";
import { allFacts } from "../src/content/index";
import { imageCredits } from "../src/content/images";
import { photographs, films } from "../src/editorial/media";
const URL_RE = /^https?:\/\/[^\s]+$/;
const facts = allFacts();
const errors: string[] = [];
for (const f of facts)
  if (!URL_RE.test(f.source) || !f.text?.trim())
    errors.push(`Unsourced fact: ${f.text.slice(0, 80)}`);
for (const c of [...imageCredits, ...photographs])
  if (!URL_RE.test(c.source) || !c.credit?.trim())
    errors.push(`Uncredited image: ${c.file}`);
for (const p of photographs)
  if (!existsSync(`public/images/optimized/${p.id}.webp`))
    errors.push(`Missing gallery photograph: ${p.id}`);
for (const f of films) {
  if (
    !URL_RE.test(f.source) ||
    !f.publisher ||
    !f.youtube?.match(/^[\w-]{11}$/)
  )
    errors.push(`Invalid film provenance: ${f.id}`);
  if (!existsSync(`public/images/video-${f.id}.jpg`))
    errors.push(`Missing film poster: ${f.id}`);
}
for (const file of [
  "public/media/tunji-ojo-airport-hd.webm",
  "public/media/tunji-ojo-airport-hd.mp4",
  "public/images/hero-film-poster.jpg",
  "public/images/hero-film-poster-mobile.jpg",
  "public/media/tunji-ojo-airport-mobile.webm",
  "public/media/tunji-ojo-airport-mobile.mp4",
]) {
  if (!existsSync(file)) errors.push(`Missing hero media: ${file}`);
}
const slugs = new Set<string>();
for (const post of blogPosts) {
  if (slugs.has(post.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) errors.push(`Invalid or duplicate blog slug: ${post.slug}`);
  slugs.add(post.slug);
  if (!post.sources.length || post.sources.some(source => !URL_RE.test(source.url))) errors.push(`Missing blog sources: ${post.slug}`);
  if (!photographs.some(photo => photo.id === post.image)) errors.push(`Uncredited blog photograph: ${post.slug}`);
  const sectionIds = new Set<string>();
  for (const section of post.sections) {
    if (sectionIds.has(section.id)) errors.push(`Duplicate article anchor: ${post.slug}#${section.id}`);
    sectionIds.add(section.id);
    if (section.sources?.some(index => !post.sources[index])) errors.push(`Broken article citation: ${post.slug}#${section.id}`);
  }
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  `✓ ${facts.length} facts, ${imageCredits.length} original credits, ${photographs.length} gallery photographs and ${films.length} films and ${blogPosts.length} blog articles have attribution; selected media files exist.`,
);
