import type { Fact } from './types';

/** A news item published on the Minister's official site, bto.ng. `text` is the headline; `source` is the post URL. */
export interface NewsItem extends Fact {
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  category?: string;
}

export interface SocialLink {
  network: string;
  handle: string;
  url: string;
}

export const officialSite = { name: 'bto.ng', url: 'https://bto.ng/' };

/** Only links that resolve. bto.ng also lists a Facebook handle, but its link is broken and the page could not be verified. */
export const socials: SocialLink[] = [
  { network: 'X', handle: '@BTOofficial', url: 'https://x.com/BTOofficial' },
  { network: 'Email', handle: 'contact@bto.ng', url: 'mailto:contact@bto.ng' },
];

/** From bto.ng/about — "My Core Values". */
export const coreValues: Fact = {
  text: 'Do good · Change lives · Improve · Never stop learning · Be grateful · Always give back',
  source: 'https://bto.ng/about/',
  sourceLabel: 'bto.ng — About',
};

/** Profile lines published on the official site. */
export const siteProfile: Fact[] = [
  { text: 'Describes himself as a business management and consulting executive with over seventeen years across the public and private sectors, specialising in project and strategic management.', source: 'https://bto.ng/about/', sourceLabel: 'bto.ng — About' },
  { text: 'Lists sector experience in oil and gas, information technology, agriculture, research, finance, management consultancy and manufacturing.', source: 'https://bto.ng/about/', sourceLabel: 'bto.ng — About' },
  { text: 'The site’s standing invitation: “Join me in renewing hope together.”', source: 'https://bto.ng/', sourceLabel: 'bto.ng — Home' },
];

/** Every post on bto.ng at the time of research (four, all published 25 June 2024). */
export const news: NewsItem[] = [
  { date: '2024-06-25', text: 'E-gates inspection at Lagos', excerpt: 'Inspection of 21 electronic gates being installed at Murtala Muhammed International Airport, Terminal 2; Abuja complete and awaiting commissioning, with Kano, Port Harcourt and Enugu to follow, all linked to a new command-and-control centre in Abuja.', category: 'Activities', source: 'https://bto.ng/2024/06/25/e-gates-inspection/', sourceLabel: 'bto.ng, 25 Jun 2024' },
  { date: '2024-06-25', text: '2023 Personality of the Year', excerpt: 'On receiving Vanguard’s 2023 Personality of the Year award in Lagos, crediting the Renewed Hope government’s first year: “Our creed will always remain Nigeria first, Nigeria second, and Nigeria always.”', category: 'Activities', source: 'https://bto.ng/2024/06/25/2023-personality-of-the-year/', sourceLabel: 'bto.ng, 25 Jun 2024' },
  { date: '2024-06-25', text: 'Top management retreat', excerpt: 'A weekend retreat for the Ministry and its agencies — NSCDC, NIS, NCoS, FFS and CDCFIB — with guests from the EFCC, ICPC, CCB and ONSA, to refine operations around building strong institutions.', category: 'Activities', source: 'https://bto.ng/2024/06/25/top-management-retreat/', sourceLabel: 'bto.ng, 25 Jun 2024' },
  { date: '2024-06-25', text: 'The new face of the Kuje Correctional Centre', excerpt: 'Thanks to the President for his commitment to the welfare of vulnerable citizens, as extensive renovations bring the Kuje Correctional Centre up to international standards.', category: 'Activities', source: 'https://bto.ng/2024/06/25/new-face-of-the-kuje-correctional-centre/', sourceLabel: 'bto.ng, 25 Jun 2024' },
];
