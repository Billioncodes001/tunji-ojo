import type { Fact } from './types';
import { identity, prologue } from './profile';
import { education } from './education';
import { professional, legislator, constituency, callToServe } from './career';
import { ministryGroups, stats, recognition, quotes } from './ministry';
import { news, coreValues, siteProfile } from './news';

export * from './types';
export { profile, identity, prologue } from './profile';
export { education } from './education';
export { professional, legislator, constituency, callToServe } from './career';
export { ministryGroups, stats, recognition, quotes } from './ministry';
export { letter } from './letter';
export { imageCredits } from './images';
export { news, socials, officialSite, coreValues, siteProfile } from './news';
export type { NewsItem, SocialLink } from './news';

/** Every fact that will be rendered — used by scripts/check-sources.ts. */
export function allFacts(): Fact[] {
  return [
    ...identity,
    ...prologue,
    ...education,
    ...professional,
    ...legislator,
    ...constituency,
    ...callToServe,
    ...ministryGroups.flatMap((g) => g.items),
    ...stats,
    ...recognition,
    ...quotes,
    ...news,
    coreValues,
    ...siteProfile,
  ];
}
