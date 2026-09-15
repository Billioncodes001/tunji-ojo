import type { AgencyGroup, Stat, Entry, Quote } from './types';

export const ministryGroups: AgencyGroup[] = [
  {
    key: 'ministry',
    name: 'Federal Ministry of Interior',
    intro: 'Revenue, people and the administration of citizenship.',
    image: '/images/sectoral-retreat-2026.jpg',
    imageAlt: 'The Minister with the heads of the Immigration, Correctional, Civil Defence and Fire services at the 2026 sectoral retreat',
    items: [
      { year: 'Dec 2023', title: 'Revenue doubles the target', text: 'The Ministry generates N1.195bn between January and October 2023 against a budget target of N600m.', source: 'https://nairametrics.com/2023/12/07/interior-ministry-generates-n1-195-billion-as-revenue-in-10-months-tunji-ojo/', sourceLabel: 'Nairametrics, 7 Dec 2023' },
      { year: 'Dec 2023', title: 'Six new marriage registries', text: 'Federal Marriage Registries approved for Asaba, Akure, Ibadan, Jalingo, Uyo and Makurdi, adding to six automated registries.', source: 'https://leadership.ng/fg-to-set-up-more-marriage-registries/', sourceLabel: 'Leadership, Dec 2023' },
      { year: 'Jul 2024', title: 'A 35% quota for women', text: 'Directs that 35% of recruitment into the paramilitary services be reserved for women.', source: 'https://www.pulse.ng/articles/news/local/tunji-ojo-orders-35-recruitment-slot-for-women-into-paramilitary-agencies-2024072623121138908', sourceLabel: 'Pulse, 26 Jul 2024' },
      { year: 'Jan 2025', title: 'N6bn and 20,851 promotions', text: 'Revenue passes N6bn in 2024 against a N2bn target; 20,851 officers promoted in the year and 10,783 recruited across 2023–24.', source: 'https://nairametrics.com/2025/01/28/ministry-of-interior-generated-over-n6-billion-in-2024-tunji-ojo/', sourceLabel: 'Nairametrics, 28 Jan 2025' },
      { year: 'Jun 2025', title: '30,150 new recruits approved', text: 'The President approves the recruitment of 30,150 personnel into the Ministry’s services.', source: 'https://factcheckafrica.net/fact-check-tinubu-approves-recruitment-of-30150-not-30350-youths-into-immigration-nscdc-and-other-services/', sourceLabel: 'FactCheckAfrica, Jun 2025' },
      { year: 'Aug 2025', title: 'Lifetime pay for senior retirees', text: 'Presidential approval of lifetime salary for officers retiring at Deputy Comptroller-General level and above; more than 50,000 promotions in two years.', source: 'https://leadership.ng/tinubu-okays-lifetime-salary-for-retiring-senior-officers-interior-minister/', sourceLabel: 'Leadership, 28 Aug 2025' },
      { year: 'Nov 2025', title: 'ECOWAS biometric identity card', text: 'Nigeria becomes the seventh ECOWAS member to issue the ECOWAS National Biometric Identity Card, launched in Abuja on 28 November 2025.', source: 'https://nairametrics.com/2025/11/28/fg-launches-ecowas-biometric-id-card-to-boost-regional-security/', sourceLabel: 'Nairametrics, 28 Nov 2025' },
    ],
  },
  {
    key: 'nis',
    name: 'Nigeria Immigration Service',
    intro: 'Passports, borders and the visa regime.',
    image: '/images/e-gates-lagos.jpg',
    imageAlt: 'A row of newly installed immigration e-gates at Murtala Muhammed International Airport, Lagos',
    items: [
      { year: 'Oct 2023', title: '204,332 passports cleared', text: 'A backlog of 204,332 passport applications is cleared in about three weeks, with a standing two-week processing timeline announced.', source: 'https://www.vanguardngr.com/2023/10/fg-issues-2-week-timeline-for-passport-processing-clears-over-204000-backlog/', sourceLabel: 'Vanguard, 4 Oct 2023' },
      { year: 'Jan 2024', title: 'Fully automated passport portal', text: 'The NIN-based online passport application portal goes live on 8 January 2024.', source: 'https://www.thisdaylive.com/index.php/2024/01/08/tunji-ojo-launches-online-passport-application-portal', sourceLabel: 'ThisDay, 8 Jan 2024' },
      { year: 'May 2024', title: 'E-gates at Lagos and Abuja', text: 'Twenty-one e-gates installed at Lagos; Abuja’s installation declared complete in June, with Kano, Enugu and Port Harcourt to follow.', source: 'https://www.arise.tv/interior-minister-tunji-ojo-inspects-new-e-gates-at-lagos-airport-promises-improved-efficiency/', sourceLabel: 'Arise News, 26 May 2024' },
      { year: 'Nov 2024', title: 'Contactless renewal for the diaspora', text: 'Contactless passport renewal launches in Canada on 1 November 2024, then across Europe from 7 February 2025.', source: 'https://www.biometricupdate.com/202411/nigerias-contactless-biometric-passport-app-launches', sourceLabel: 'Biometric Update, Nov 2024' },
      { year: 'Dec 2024', title: 'BATTIC commissioned', text: 'President Tinubu commissions the Bola Ahmed Tinubu Technology Innovation Complex at NIS headquarters: a command-and-control centre, an 8.3-petabyte data centre and monitoring of over 200 border points.', source: 'https://blueprint.ng/tinubu-to-tunji-ojo-for-ease-of-visa-passport-applications-youve-made-nigeria-proud-globally/', sourceLabel: 'Blueprint, 11 Dec 2024' },
      { year: 'May 2025', title: 'E-visa and the Nigeria Visa Policy 2025', text: 'Visa-on-arrival is replaced by an e-visa from 1 May 2025; overstay penalties and a revised expatriate quota regime take effect.', source: 'https://kpmg.com/ng/en/home/insights/2025/04/federal-ministry-of-interior-announces-major-reforms-in-expatriate-administration-and-visa-policy.html', sourceLabel: 'KPMG Nigeria, Apr 2025' },
      { year: 'Jul 2025', title: '14,000 e-visas in six weeks', text: 'More than 14,000 visa applications are processed through the new e-visa system in its first six weeks.', source: 'https://guardian.ng/news/nigeria/national/over-14000-applications-processed-via-new-e-visa-system-interior-minister/', sourceLabel: 'The Guardian Nigeria, Jul 2025' },
      { year: 'Sep 2025', title: 'One passport hub, 5,000 a day', text: 'A Centralised Passport Personalisation Centre opens at NIS headquarters, the first in the Service’s 62 years, replacing 96 production points with capacity for 5,000 passports a day.', source: 'https://nairametrics.com/2025/09/18/nis-unveils-centralised-passport-centre-with-capacity-to-produce-5000-passports-daily/', sourceLabel: 'Nairametrics, 18 Sep 2025' },
      { year: 'Sep 2026', title: 'UK passport intervention', text: 'A special passport exercise in London enrols 1,477 applicants in its first four days.', source: 'https://www.vanguardngr.com/2026/09/uk-passport-intervention-no-extra-charges-tunji-ojo-clarifies/', sourceLabel: 'Vanguard, Sep 2026' },
    ],
  },
  {
    key: 'ncos',
    name: 'Nigerian Correctional Service',
    intro: 'From incarceration to reformation.',
    image: '/images/kuje-custodial.jpg',
    imageAlt: 'Correctional officers at the Medium Security Custodial Centre, Kuje, Abuja',
    items: [
      { year: 'Nov 2023', title: '4,068 inmates freed', text: 'N585m raised from individuals and companies pays the fines of indigent convicts; 4,068 inmates released from centres holding 80,804 people against a capacity under 50,000.', source: 'https://www.pulse.ng/news/local/prisons-decongestion-4068-inmates-released-so-far-says-minister/83njztw', sourceLabel: 'Pulse, 18 Nov 2023' },
      { year: 'Sep 2024', title: 'An independent panel', text: 'An Independent Investigative Panel on alleged corruption and abuses in the Service is inaugurated; it goes on to visit 86 centres in 23 states.', source: 'https://interior.gov.ng/the-investigative-panels-main-report-on-alleged-corruption-and-other-violations-against-the-nigerian-correctional-service-ncos-the-panel-was-constituted-to-investigate-allegations-of-misconduct-w/', sourceLabel: 'Ministry of Interior', },
      { year: 'Oct 2024', title: 'Over 10,000 released', text: 'Cumulative releases pass 10,000; the Minister puts the saving in feeding costs at about N3bn a year.', source: 'https://www.vanguardngr.com/2024/10/nigeria-saves-n3bn-by-decongesting-correctional-centre-tunji-ojo/', sourceLabel: 'Vanguard, 8 Oct 2024' },
      { year: 'Jun 2026', title: 'Recidivism down to 1,382', text: 'Receiving the panel’s report, the Minister reports repeat offending falling from 11,616 in 2023 to 3,156 in 2024 and 1,382 in 2025; the President approves a 50% rise in the inmate feeding allowance.', source: 'https://realnewsmagazine.net/correctional-reforms-reduce-re-offenders-to-1382-in-3-years-tunji-ojo/', sourceLabel: 'Realnews, 3 Jun 2026' },
      { year: 'Jul 2026', title: 'Education behind the walls', text: '9,582 inmates in vocational training, 1,125 in formal education, 261 undergraduates and 62 postgraduates across 18 National Open University centres; three years without a custodial centre breached by attack.', source: 'https://www.vanguardngr.com/2026/07/93-percent-of-inmates-are-state-offenders-half-dont-need-jail-tunji-ojo/', sourceLabel: 'Vanguard, 16 Jul 2026' },
    ],
  },
  {
    key: 'nscdc',
    name: 'Nigeria Security and Civil Defence Corps',
    intro: 'Guarding critical infrastructure and the mining fields.',
    image: '/images/nscdc-salute.jpg',
    imageAlt: 'The Commandant-General of the Nigeria Security and Civil Defence Corps in ceremonial uniform',
    items: [
      { year: 'Oct 2023', title: 'Armed cover for firefighters', text: 'The Corps is directed to provide armed protection for Federal Fire Service crews on call.', source: 'https://www.vanguardngr.com/2023/10/fg-to-expand-scope-of-federal-fire-service-directs-nscdc-to-provide-armed-cover-for-firefighters/', sourceLabel: 'Vanguard, Oct 2023' },
      { year: 'Mar 2024', title: 'Mining Marshals', text: 'A 2,220-strong Mining Marshals unit is inaugurated with the Minister of Solid Minerals to confront illegal mining.', source: 'https://nannews.ng/2024/03/21/minister-inaugurates-mining-marshals-to-combat-illegal-mining/', sourceLabel: 'NAN, 21 Mar 2024' },
      { year: 'Jul 2026', title: '671 arrests, 397 charged', text: 'The Marshals report 671 arrests since 2024, with 397 suspects charged at the Federal High Court and 133 sites raided in the first half of 2026.', source: 'https://guardian.ng/news/nscdc-reports-671-arrests-in-anti-illegal-mining-drive/', sourceLabel: 'The Guardian Nigeria, 14 Jul 2026' },
    ],
  },
  {
    key: 'ffs',
    name: 'Federal Fire Service',
    intro: 'Equipment, stations and a national academy.',
    image: '/images/fire-station.jpg',
    imageAlt: 'A Federal Fire Service station at Ojuelegba, Lagos',
    items: [
      { year: 'Oct 2023', title: '21 new fire-fighting vehicles', text: 'Fifteen rapid-response vehicles and six fire trucks are commissioned at Fire Service headquarters, Abuja.', source: 'https://interior.gov.ng/press-release/fg-acquires-21-fire-fighting-vehicles/', sourceLabel: 'Ministry of Interior, Oct 2023' },
      { year: 'Jun 2024', title: 'A new station in Bayelsa', text: 'The Minister commissions a new fire station at Toru-Orua, Bayelsa State.', source: 'https://www.vanguardngr.com/2024/06/fg-commissions-new-fire-station-in-bayelsa/', sourceLabel: 'Vanguard, 27 Jun 2024' },
      { year: 'Feb 2026', title: 'National Fire Academy, Sheda', text: 'Inspection of the National Fire Academy at Sheda, Abuja, about 65% complete, planned to train crews in hazardous-materials and urban search-and-rescue response.', source: 'https://interior.gov.ng/dr-tunji-ojo-inspects-national-fire-academy-reaffirms-commitment-to-fire-safety-reform/', sourceLabel: 'Ministry of Interior, 13 Feb 2026' },
      { year: 'Apr 2026', title: 'War on fake extinguishers', text: 'The Nigeria Fire Extinguisher Control initiative introduces digital traceability for extinguishers, with a target of more than 150,000 jobs.', source: 'https://guardian.ng/news/interior-minister-declares-war-on-fake-fire-extinguishers-with-new-150000-job-safety-initiative/', sourceLabel: 'The Guardian Nigeria, Apr 2026' },
    ],
  },
];

export const stats: Stat[] = [
  { value: 204332, label: 'passport applications cleared from the backlog in three weeks', text: 'Backlog of 204,332 cleared, October 2023', source: 'https://www.vanguardngr.com/2023/10/fg-issues-2-week-timeline-for-passport-processing-clears-over-204000-backlog/', sourceLabel: 'Vanguard, 4 Oct 2023' },
  { value: 5000, label: 'passports a day from the new centralised personalisation centre', text: 'Capacity of 5,000 passports daily', source: 'https://nairametrics.com/2025/09/18/nis-unveils-centralised-passport-centre-with-capacity-to-produce-5000-passports-daily/', sourceLabel: 'Nairametrics, 18 Sep 2025' },
  { value: 14000, prefix: '', suffix: '+', label: 'e-visa applications processed in the first six weeks', text: 'Over 14,000 e-visas in six weeks', source: 'https://guardian.ng/news/nigeria/national/over-14000-applications-processed-via-new-e-visa-system-interior-minister/', sourceLabel: 'The Guardian Nigeria, Jul 2025' },
  { value: 1382, label: 'repeat offenders in 2025, down from 11,616 in 2023', text: 'Recidivism 11,616 to 1,382', source: 'https://realnewsmagazine.net/correctional-reforms-reduce-re-offenders-to-1382-in-3-years-tunji-ojo/', sourceLabel: 'Realnews, 3 Jun 2026' },
  { value: 6, prefix: 'N', suffix: 'bn+', label: 'ministry revenue in 2024, against a N2bn target', text: 'Over N6bn revenue in 2024', source: 'https://nairametrics.com/2025/01/28/ministry-of-interior-generated-over-n6-billion-in-2024-tunji-ojo/', sourceLabel: 'Nairametrics, 28 Jan 2025' },
  { value: 30150, label: 'new personnel approved for the paramilitary services in 2025', text: '30,150 recruits approved', source: 'https://factcheckafrica.net/fact-check-tinubu-approves-recruitment-of-30150-not-30350-youths-into-immigration-nscdc-and-other-services/', sourceLabel: 'FactCheckAfrica, Jun 2025' },
  { value: 671, label: 'illegal-mining arrests by the Mining Marshals since 2024', text: '671 arrests', source: 'https://guardian.ng/news/nscdc-reports-671-arrests-in-anti-illegal-mining-drive/', sourceLabel: 'The Guardian Nigeria, 14 Jul 2026' },
  { value: 4068, label: 'inmates released in the first decongestion drive of November 2023', text: '4,068 released', source: 'https://www.pulse.ng/news/local/prisons-decongestion-4068-inmates-released-so-far-says-minister/83njztw', sourceLabel: 'Pulse, 18 Nov 2023' },
];

export const recognition: Entry[] = [
  { year: '2019', title: 'Sir Ahmadu Bello Platinum Leadership Award of Excellence', text: 'Received in his first year in the House.', source: 'https://leadership.ng/hon-olubunmi-tunji-ojos-inspiring-journey-to-42/', sourceLabel: 'Leadership, Apr 2024' },
  { year: '2021', title: 'Honorary Doctorate, Joseph Ayo Babalola University', text: 'Doctor of Public Administration, honoris causa, 22 January 2021.', source: 'https://bto.ng/rep/jabu-honours-federal-lawmaker-olubunmi-tunji-ojo-with-phd-in-public-administration', sourceLabel: 'bto.ng' },
  { year: '2023', title: 'Public Service Person of the Year', text: 'Leadership Newspaper Awards, December 2023.', source: 'https://conferences.leadership.ng/public-service-person-of-the-year/', sourceLabel: 'Leadership Conferences' },
  { year: '2024', title: 'Vanguard Personality of the Year', text: 'Presented 24 May 2024.', source: 'https://www.vanguardngr.com/2024/05/onyema-tunji-ojo-bag-vanguard-personality-of-the-year-award/', sourceLabel: 'Vanguard, 24 May 2024' },
  { year: '2025', title: 'Minister of the Year', text: 'Aljazirah Newspapers Personality of the Year Awards, 2025.', source: 'https://leadership.ng/tinubu-tunji-ojo-ojulari-6-governors-make-aljazirah-2025-honours-list/', sourceLabel: 'Leadership, 2025' },
  { year: '2025', title: 'OAU Award of Excellence in Public Service', text: 'Obafemi Awolowo University, 13 December 2025.', source: 'https://gazettengr.com/interior-minister-tunji-ojo-urges-youths-to-persevere-amid-economic-hardship/', sourceLabel: 'Peoples Gazette, 13 Dec 2025' },
  { year: '2026', title: 'Vanguard Personality of the Year, again', text: 'Presented by Chief Olusegun Osoba at Eko Hotels, Lagos, 24 April 2026; he dedicated it to the President.', source: 'https://www.vanguardngr.com/2026/04/tunji-ojo-wins-vanguard-personality-of-the-year-award/', sourceLabel: 'Vanguard, 24 Apr 2026' },
];

export const quotes: Quote[] = [
  { text: 'Visa is a privilege but passport is a right.', context: 'On clearing the passport backlog, October 2023', source: 'https://www.vanguardngr.com/2023/10/fg-issues-2-week-timeline-for-passport-processing-clears-over-204000-backlog/', sourceLabel: 'Vanguard, 4 Oct 2023' },
  { text: 'For an organisation to develop, you have to concentrate on building strong institutions rather than strong personalities.', context: 'On rewriting the NDDC Act, March 2021', source: 'https://www.vanguardngr.com/2021/03/nddc-why-nass-is-repealing-act-tunji-ojo/', sourceLabel: 'Vanguard, 4 Mar 2021' },
  { text: 'Life was not rosy for us while growing up, but my mother never ceased to fighting for a better reality for me even after losing her husband.', context: 'On his mother’s birthday, January 2022', source: 'https://trianglemagazine.news.blog/2022/01/16/bto-celebrates-mums-on-her-birthday-anniversary/', sourceLabel: 'Triangle Magazine, 16 Jan 2022' },
  { text: 'A prison is a place of incarceration, whereas a correctional centre should focus on reformation, transformation, and rehabilitation.', context: 'On correctional reform, October 2024', source: 'https://www.vanguardngr.com/2024/10/nigeria-saves-n3bn-by-decongesting-correctional-centre-tunji-ojo/', sourceLabel: 'Vanguard, 8 Oct 2024' },
  { text: 'You are the keepers of the future. Your ideas, courage, conviction and curiosity will determine the direction of our nation.', context: 'To students of Obafemi Awolowo University, December 2025', source: 'https://gazettengr.com/interior-minister-tunji-ojo-urges-youths-to-persevere-amid-economic-hardship/', sourceLabel: 'Peoples Gazette, 13 Dec 2025' },
  { text: 'Yesterday belongs to history. What truly defines our future is what we do today.', context: 'Ministry management retreat, March 2026', source: 'https://interior.gov.ng/tunji-ojo-emphasises-accountability-reforms-and-measurable-impact/', sourceLabel: 'Ministry of Interior, 5 Mar 2026' },
  { text: 'What you have achieved in passport alone has given this country great reputation internationally.', context: 'Commissioning BATTIC, December 2024', speaker: 'President Bola Ahmed Tinubu', source: 'https://blueprint.ng/tinubu-to-tunji-ojo-for-ease-of-visa-passport-applications-youve-made-nigeria-proud-globally/', sourceLabel: 'Blueprint, 11 Dec 2024' },
];
