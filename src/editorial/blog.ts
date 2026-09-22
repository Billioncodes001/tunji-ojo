import { features } from './articles';
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  cover?: { url: string; description: string; credit: string; source: string };
  author?: { name: string; slug: string; bio: string };
  updatedAt?: string;
  correction?: string;
  date: string;
  period: string;
  takeaway: string;
  sections: { id: string; title: string; paragraphs: string[]; html?: string; sources?: number[] }[];
  sources: { title: string; url: string; date: string }[];
  relatedPage: { route: string; title: string };
}

// Publication dates belong to these original research notes, not to the historical events.
export const blogPosts: BlogPost[] = [
  ...features,
  {
    slug: 'tunji-ojo-airport-e-gates',
    title: 'Nigeria’s airport e-gates: from installation to operation',
    excerpt: 'Follow the dated public record of Olubunmi Tunji-Ojo’s airport e-gates programme, from the Abuja inspection in 2024 to the 2025 operational update.',
    category: 'Immigration', image: 'bto-inspection-egates', date: '2026-09-22', period: 'February 2024 – April 2025',
    takeaway: 'An installation announcement and an operational update describe different stages. Reading them together gives a clearer account of the programme.',
    sections: [
      { id: 'installation', title: 'The installation stage', paragraphs: [
        'On 19 February 2024, the Federal Ministry of Information and National Orientation published an account of Tunji-Ojo’s inspection at Nnamdi Azikiwe International Airport, Abuja. Four of ten planned e-verification gates had been installed at that point. The release placed the gates within a wider e-immigration programme.',
        'The inspection also covered the command-and-control centre and a border data centre at the Nigeria Immigration Service headquarters. The minister described biometric checks and watchlist screening as intended functions. The release’s projected processing time and completion dates were targets reported at the time, rather than independent measurements of performance.'
      ], sources: [0] },
      { id: 'operation', title: 'The operational update', paragraphs: [
        'A government release dated 10 April 2025 described e-gates at Lagos and Abuja as operational. It attributed their installation to cooperation between the Interior and Aviation ministries, with support from the Federal Airports Authority of Nigeria.',
        'That briefing also discussed the Advanced Passenger Information System, an automated visa system, and digital arrival and departure cards. These are related parts of border administration, but they are separate services. The existence of an airport gate does not, by itself, establish the availability of every digital immigration service.'
      ], sources: [1] },
      { id: 'reading-record', title: 'How to read the record', paragraphs: [
        'The useful comparison is between the dated stages: equipment being installed in February 2024, followed by a report of operation in April 2025. It helps avoid treating a proposal, a construction milestone and an operating service as the same achievement.',
        'Neither release provides an independently audited, nationwide series of passenger waiting times. This article therefore records the announcements and their dates without turning them into a claim about every airport or every traveller’s experience. The photographs illustrate the wider inspection programme; they do not establish the date of each milestone.'
      ] },
      { id: 'travellers', title: 'For travellers today', paragraphs: [
        'This is a historical explainer, not a live airport-service notice. For current entry requirements, eligibility and passport services, use the Nigeria Immigration Service and the relevant airport’s official information. Our contact directory links to those public channels, while the Interior record brings together the wider documented programme.'
      ] }
    ],
    sources: [
      { title: 'Ministry of Information: Abuja e-verification gates inspection', url: 'https://fmino.gov.ng/minister-of-interior-inspects-e-verification-gates-for-enhanced-security-travel-experience/', date: '19 February 2024' },
      { title: 'Ministry of Information: border security and travel collaboration', url: 'https://fmino.gov.ng/fg-strengthens-border-security-travel-experience-through-inter-ministerial-collaboration/', date: '10 April 2025' }
    ], relatedPage: { route: 'interior', title: 'Explore the Interior record' }
  },
  {
    slug: 'ministry-of-interior-public-services',
    title: 'Finding the right Ministry of Interior service',
    excerpt: 'A practical starting point for finding official passport information, ministry services and Olubunmi Tunji-Ojo’s public contact channels.',
    category: 'Public services', image: 'at-desk-2023', date: '2026-09-22', period: 'Service directory · historical context from January 2024',
    takeaway: 'Use the responsible agency for service applications and the official office for correspondence. This independent profile does not process either.',
    sections: [
      { id: 'access', title: 'Access was part of the stated agenda', paragraphs: [
        'In a release published on 19 January 2024, the Ministry of Information reported Tunji-Ojo’s pledge to extend access to Interior services across Nigeria. The remarks came during a visit by traditional rulers from Offa and Ijagbo. Passport administration in Offa was one of the subjects discussed.',
        'The statement describes an intention to make services more accessible. It should not be read as a current list of operating offices or as a guarantee that a particular service is available in every location.'
      ], sources: [0] },
      { id: 'passport', title: 'Passport and immigration information', paragraphs: [
        'Start at the Nigeria Immigration Service website for passport and immigration information. Follow the service links published there rather than treating a biography, blog post or social-media comment as an application channel.',
        'Our Connect page provides a direct link to the agency. We do not collect passport details, take application payments or offer appointment bookings. Keeping the directory separate from the application itself makes it clearer who is responsible for the service.'
      ] },
      { id: 'ministry', title: 'Ministry information and correspondence', paragraphs: [
        'For ministry information, begin with the Federal Ministry of Interior. For correspondence intended for Tunji-Ojo’s office, our directory links to the contact page on his official personal website. His public social channels are listed separately so readers can distinguish a public update from an official service instruction.',
        'Different needs lead to different destinations. Reading about a reform belongs in the public record; checking a service requirement belongs with the agency; sending correspondence belongs with the office’s published contact channel.'
      ] },
      { id: 'before-you-start', title: 'Before you start', paragraphs: [
        'Check the destination and the date of the information you are reading. Service requirements can change after an article is published. Use the agency’s current instructions for your application, and keep historical reports as context rather than a substitute for those instructions.',
        'The directory is deliberately short: official public channels, clear labels and direct links. No account is needed to browse this website, and there is no form here that asks for identity documents or payment details.'
      ] }
    ],
    sources: [{ title: 'Ministry of Information: access to Interior services', url: 'https://fmino.gov.ng/fg-promises-to-make-interior-services-available-to-nigerians/', date: '19 January 2024' }],
    relatedPage: { route: 'connect', title: 'Open the official contact directory' }
  },
  {
    slug: 'interior-reform-institutions-accountability',
    title: 'Interior reform: institutions, targets and accountability',
    excerpt: 'Two October 2024 government releases show how performance targets and correctional oversight fit into the Ministry of Interior’s public record.',
    category: 'Institutions', image: 'bto-retreat-2024', date: '2026-09-22', period: 'October 2024',
    takeaway: 'A reform programme is easier to assess when its stated targets, oversight processes and measured results are kept distinct.',
    sections: [
      { id: 'shared-targets', title: 'Setting shared targets', paragraphs: [
        'The Ministry of Interior began a two-day performance contracting retreat in Abuja on 28 October 2024. The government’s release describes a meeting of the minister, permanent secretary, directors and agency heads to align their work around national security objectives.',
        'Tunji-Ojo called for ambitious targets and accountability. The release connected the roles of immigration and correctional services to the ministry’s broader responsibilities. It establishes what was discussed and the expectations expressed at the meeting; it does not constitute a completed performance evaluation.'
      ], sources: [0] },
      { id: 'oversight', title: 'Oversight alongside delivery', paragraphs: [
        'A separate release on 21 October 2024 reported the presentation of the first phase of an independent investigative panel’s work on alleged misconduct within the Nigerian Correctional Service. The minister set out a commitment to disciplinary action where wrongdoing was established and to a service focused on rehabilitation.',
        'The significance for this record is the oversight process itself: an investigation, a published account of its first phase, and stated commitments to further reform. A first-phase report should not be described as the completion of every investigation or the resolution of every institutional problem.'
      ], sources: [1] },
      { id: 'assessment', title: 'Three questions for assessing reform', paragraphs: [
        'What was promised? Look for a specific target, a date and an institution responsible for delivering it. What was implemented? Seek evidence of a service or process actually operating. What changed? Look for published results that allow a comparison over time.',
        'These questions help separate a ministerial announcement from an institutional outcome. Both belong in a public record, but they answer different questions. Reading the original documents also makes clear which statements come from the ministry and which conclusions belong to the reader.'
      ] },
      { id: 'further-reading', title: 'Continue through the record', paragraphs: [
        'The Interior section groups dated entries by service so readers can move from a broad reform theme to the underlying reports. The Sources page explains the site’s approach to attribution. This blog adds context to that archive without presenting itself as a government bulletin.',
        'The accompanying photograph comes from the official website’s June 2024 retreat archive. It illustrates ministry activity and is not a photograph of either October event discussed here.'
      ] }
    ],
    sources: [
      { title: 'Ministry of Information: performance contracting retreat', url: 'https://fmino.gov.ng/ministry-of-interior-holds-performance-contracting-retreat-to-strengthen-national-security/', date: '28 October 2024' },
      { title: 'Ministry of Information: phase-one correctional reform report', url: 'https://fmino.gov.ng/fg-unveils-phase-1-report-on-correctional-system-reforms/', date: '21 October 2024' }
    ], relatedPage: { route: 'interior', title: 'Browse the institutions and their record' }
  }
];
export const blogAuthor = 'Olubunmi Tunji-Ojo — Independent Profile';
export const postRoute = (post: BlogPost) => `blog/${post.slug}`;
export const readMinutes = (post: BlogPost) => Math.max(1, Math.ceil(post.sections.flatMap(s => s.paragraphs).join(' ').split(/\s+/).length / 200));
export const displayDate = (date: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T00:00:00Z'));
