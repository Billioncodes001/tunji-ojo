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
  "public/media/tunji-ojo-egates-loop.webm",
  "public/media/tunji-ojo-egates-loop.mp4",
  "public/images/hero-film-poster.jpg",
]) {
  if (!existsSync(file)) errors.push(`Missing hero media: ${file}`);
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  `✓ ${facts.length} facts, ${imageCredits.length} original credits, ${photographs.length} gallery photographs and ${films.length} films have attribution; selected media files exist.`,
);
