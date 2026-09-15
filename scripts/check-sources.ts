import { allFacts } from '../src/content/index';
import { imageCredits } from '../src/content/images';

const URL_RE = /^https?:\/\/[^\s]+$/;
const facts = allFacts();
const bad = facts.filter((f) => !URL_RE.test(f.source) || !f.text?.trim());
const badImg = imageCredits.filter((c) => !URL_RE.test(c.source) || !c.credit?.trim());

if (bad.length || badImg.length) {
  for (const f of bad) console.error(`✗ unsourced fact: ${f.text.slice(0, 80)}`);
  for (const c of badImg) console.error(`✗ uncredited image: ${c.file}`);
  throw new Error(`${bad.length + badImg.length} entries fail the source check`);
}
console.log(`✓ ${facts.length} facts and ${imageCredits.length} image credits all carry a source URL`);
