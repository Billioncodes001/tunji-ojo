import type { BlogPost } from './blog';
const date = '2026-09-22';
export const features: BlogPost[] = [
 {
  slug: 'olubunmi-tunji-ojo-education-engineering-background', title: 'Before public office: Tunji-Ojo’s engineering and consultancy background',
  excerpt: 'The education and early career behind Olubunmi Tunji-Ojo’s move into public service, drawn from his published biography.',
  category: 'Background', image: 'official-portrait', date, period: 'Education and career before the National Assembly',
  takeaway: 'His published biography traces a route through engineering, communications and consulting before elected office.',
  sections: [
   { id: 'engineering', title: 'An education in engineering', paragraphs: [
    'Olubunmi Tunji-Ojo’s official biography describes an engineering education that began at Obafemi Awolowo University, Ile-Ife. It says he subsequently continued his studies in London, graduating in Electronics and Communication Engineering in 2005 and completing a master’s degree in Digital Communication and Networking in 2006.',
    'The same account identifies the London institution through its historical connection to the University of North London and London Metropolitan University. These are biographical statements published by his office; this article does not present them as a separate verification of university records.'
   ], sources: [0] },
   { id: 'consultancy', title: 'The consulting years', paragraphs: [
    'The biography places Tunji-Ojo at Matrix IT Solutions Limited as chief executive at 24. It describes work spanning technology, project management and other business sectors. It also records professional training in ethical hacking.',
    'Those details establish how his office presents the pre-political part of his career. They are more useful than a list of unexplained titles: readers can distinguish university study, professional training and executive responsibility.'
   ], sources: [0] },
   { id: 'public-life', title: 'Reading a professional background alongside public service', paragraphs: [
    'A technical background gives context to a political biography. It does not, on its own, prove that a later programme was successful. The relevant evidence for a public service remains its implementation record, the experience of people using it and the information institutions release about its performance.',
    'That distinction is useful when reading about digital immigration systems. An academic qualification belongs to the person’s background; an airport installation or an operational update belongs to the record of an institution. Keeping those strands separate makes both easier to understand.',
    'Our Story page follows the broader biography. The Public Office timeline then provides the next chapter, while the Interior archive links policy announcements to their dates and original sources.'
   ] }
  ],
  sources: [{ title: 'Olubunmi Tunji-Ojo: official biography', url: 'https://bto.ng/about/', date: 'Accessed 22 September 2026' }],
  relatedPage: { route: 'story', title: 'Read the wider biography' }
 },
 {
  slug: 'tunji-ojo-national-assembly-ministry-of-interior', title: 'From the National Assembly to the Ministry of Interior',
  excerpt: 'A guide to the different responsibilities in Tunji-Ojo’s public-office record, and why parliamentary oversight and executive delivery should be read separately.',
  category: 'Public office', image: 'at-desk-2023', date, period: '2019–2023',
  takeaway: 'A constituency seat, a committee chairmanship and a ministerial portfolio represent different forms of public responsibility.',
  sections: [
   { id: 'committee', title: 'The parliamentary chapter', paragraphs: [
    'In July 2019, Tunji-Ojo was named chair of the House committee responsible for the Niger Delta Development Commission.',
    'A committee role is one part of a parliamentary record. To assess it, readers need to distinguish the committee’s proceedings from the work of the organisation it scrutinises. The chair of a legislative committee and the head of an executive agency do not hold the same job.'
   ], sources: [0] },
   { id: 'transition', title: 'A change of office in 2023', paragraphs: [
    'Contemporary reporting in August 2023 records Tunji-Ojo’s resignation from the House of Representatives following his ministerial appointment. His constituency was Akoko North-East/North-West in Ondo State. The move marked the end of that period of representation and the beginning of a different public-office chapter.',
    'The dated timeline on this website separates nomination, portfolio assignment and entry into office. That approach avoids making a single announcement date stand in for every stage of the transition.'
   ], sources: [1] },
   { id: 'responsibility', title: 'Three questions for reading the record', paragraphs: [
    'First, which office did he hold at the time? A constituency intervention, a committee hearing and a ministry directive should be attributed to the role involved.',
    'Second, what is the document actually reporting? A proposed measure, an oversight recommendation and a completed project are distinct. The description should preserve that distinction even when all three appear in the same career timeline.',
    'Third, what happened next? An initial report is a starting point for further reporting. Where a later source establishes implementation, it should be linked to the earlier announcement rather than quietly replacing it.',
    'This is the organising principle of our Public Office section: a chronological record that helps readers locate a statement in the right institutional setting.'
   ] }
  ],
  sources: [
   { title: 'Vanguard: House standing committee appointments', url: 'https://www.vanguardngr.com/2019/07/gbajabiamila-announces-house-standing-committees/', date: '25 July 2019' },
   { title: 'Premium Times: minister resigns from House of Representatives', url: 'https://www.premiumtimesng.com/news/top-news/617122-minister-resigns-from-house-of-representatives.html', date: 'August 2023' }
  ], relatedPage: { route: 'offices', title: 'Follow the public-office timeline' }
 },
 {
  slug: 'border-governance-data-iom-cooperation', title: 'Beyond the airport gate: the data behind border governance',
  excerpt: 'Two 2024 ministry briefings connect border cooperation, information systems and the planned immigration data centre.',
  category: 'Immigration', image: 'bto-inspection-egates', date, period: 'April–May 2024',
  takeaway: 'The visible airport gate is one part of a wider programme involving information, infrastructure and cooperation between institutions.',
  sections: [
   { id: 'cooperation', title: 'The cooperation agenda', paragraphs: [
    'A government release on 24 April 2024 described a meeting between Tunji-Ojo and the International Organization for Migration’s Nigeria mission. The discussion covered cooperation with the Nigeria Immigration Service and the Migration Information and Data Analysis System, known as MIDAS.',
    'The minister also discussed connecting that system with INTERPOL’s I-24/7 network. The release records an integration priority expressed at the meeting; it does not provide a technical acceptance report establishing that every connection was complete.'
   ], sources: [0] },
   { id: 'infrastructure', title: 'The planned data centre', paragraphs: [
    'On 20 May 2024, a separate government briefing reported plans for a data centre with a stated capacity of 1.4 petabytes. Tunji-Ojo discussed the proposal during a meeting with representatives of Nigerian associations in Italy.',
    'The same meeting included requests about passport front offices and support for Nigerians abroad. The account places digital infrastructure alongside the practical needs raised by a diaspora delegation. Its projected launch date remains a statement of intent in that particular source, rather than proof of completion.'
   ], sources: [1] },
   { id: 'connections', title: 'Why the connections matter', paragraphs: [
    'These reports concern different layers of a service. One describes cooperation and information exchange; another describes storage infrastructure. Neither should be treated as a substitute for an operating report on the airport gates themselves.',
    'A useful public record follows those layers over time. It asks what was proposed, what was installed, what became operational and what evidence exists about performance. The questions are straightforward even where the underlying technology is complex.',
    'For the next stage in this archive, our e-gates explainer compares the February 2024 installation report with the April 2025 operational update. Current travel and application requirements should always be checked with the responsible agency.'
   ] }
  ],
  sources: [
   { title: 'Ministry of Information: IOM and border governance', url: 'https://fmino.gov.ng/fg-partners-iom-to-strengthen-border-governance/', date: '24 April 2024' },
   { title: 'Ministry of Information: planned data centre', url: 'https://fmino.gov.ng/fg-set-to-launch-state-of-the-art-data-centre/', date: '20 May 2024' }
  ], relatedPage: { route: 'interior', title: 'Explore the immigration record' }
 },
 {
  slug: 'youth-development-interior-collaboration', title: 'Where youth development meets the Interior portfolio',
  excerpt: 'A June 2024 meeting considered enterprise clusters, mentoring and cooperation between the Youth and Interior ministries.',
  category: 'Community', image: 'bto-retreat-2024', date, period: 'June 2024',
  takeaway: 'The meeting established an agenda for cooperation. It should be read as a proposal record, with implementation assessed through subsequent evidence.',
  sections: [
   { id: 'meeting', title: 'The June discussion', paragraphs: [
    'On 14 June 2024, the Ministry of Information published an account of a visit by Youth Development Minister Jamila Bio Ibrahim to Tunji-Ojo. The discussion proposed cooperation on youth unemployment and support for enterprise clusters.',
    'The report describes possible involvement by the Nigeria Security and Civil Defence Corps in protecting those clusters. It also outlines a proposed mentoring role for agencies supervised by the Interior Ministry. These were ideas discussed in the meeting, not a published tally of jobs created.'
   ], sources: [0] },
   { id: 'mentoring', title: 'Mentoring as part of the proposal', paragraphs: [
    'The Youth Development minister raised a volunteer and mentoring platform involving Interior agencies. Tunji-Ojo expressed openness to cooperation and discussed the correctional-service agenda. The account therefore records contributions by both ministries, rather than attributing the entire proposal to one office.',
    'That attribution matters. A collaboration is best understood by identifying the responsibilities each institution was asked to take on and then looking for evidence of how those responsibilities were carried out.'
   ], sources: [0] },
   { id: 'follow-through', title: 'What follow-through would show', paragraphs: [
    'For readers interested in youth opportunity, the next useful evidence would be an operating programme: who administers it, where it runs, how people participate and what results have been reported. Those details turn a policy discussion into information a person can use.',
    'This article preserves the date and scope of the original discussion. It is not an application notice, and it does not invite readers to submit personal information or pay an enrolment fee.',
    'Our Community section covers a separate strand of the public record: constituency work and locally reported interventions. Reading the two together can help distinguish community projects from proposals developed through federal institutions.'
   ] }
  ], sources: [{ title: 'Ministry of Information: Youth and Interior collaboration', url: 'https://fmino.gov.ng/youth-and-interior-ministries-to-collaborate-in-order-to-combat-youth-unemployment-in-nigeria/', date: '14 June 2024' }],
  relatedPage: { route: 'community', title: 'Explore the community record' }
 }
];
