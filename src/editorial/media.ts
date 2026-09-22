import { imageCredits } from "../content/images";

export interface Photograph {
  id: string;
  title: string;
  category:
    | "Portraits"
    | "Public service"
    | "In the field"
    | "International"
    | "Recognition";
  file: string;
  description: string;
  credit: string;
  source: string;
}

const selected: [string, string, Photograph["category"]][] = [
  ["official-portrait", "The minister", "Portraits"],
  ["hero-portrait", "In London", "Portraits"],
  ["at-desk-2023", "At work", "Public service"],
  ["podium-speech", "Making the case", "Public service"],
  ["house-of-reps", "The Green Chamber", "Public service"],
  ["uk-bilateral", "Across the table", "International"],
  ["sectoral-retreat-2026", "A shared responsibility", "Public service"],
  ["vanguard-award", "Recognition", "Recognition"],
  ["leadership-plaque-2025", "A moment of recognition", "Recognition"],
  ["nameplate", "On the record", "Public service"],
  ["e-gates-lagos", "At the border", "In the field"],
  ["kuje-custodial", "At Kuje", "In the field"],
];

export const photographs: Photograph[] = selected.map(
  ([id, title, category]) => {
    const credit = imageCredits.find((c) => c.file === `/images/${id}.jpg`)!;
    return { ...credit, id, title, category };
  },
);

const additional: [string, string, string, string][] = [
  [
    "bto-inspection-egates",
    "On the ground",
    "Tunji-Ojo with immigration officials during an airport inspection, published June 2024.",
    "e1.jpeg",
  ],
  [
    "bto-kuje-visit",
    "A visit to Kuje",
    "An official visit to the Medium Security Custodial Centre, Kuje, Abuja, published June 2024.",
    "GQDh6HhWoAA-rjB.jpeg",
  ],
  [
    "bto-kuje-courtyard",
    "Inside the grounds",
    "The courtyard of the Kuje custodial centre, published June 2024.",
    "GQDh6HhW4AAVkJx.jpeg",
  ],
  [
    "bto-kuje-building",
    "The physical record",
    "A building at the Kuje custodial centre, published June 2024.",
    "GQDh6EbXsAAk1PV.jpeg",
  ],
  [
    "bto-retreat-2024",
    "Building institutions",
    "Tunji-Ojo at the Ministry of Interior top management retreat, published June 2024.",
    "GOmTa1xXQAAZJ_R.jpeg",
  ],
  [
    "bto-public-service",
    "Opening the doors",
    "Tunji-Ojo at a ribbon-cutting ceremony, photograph published on his official website.",
    "GOsjj-_WIAE9Ab6.jpeg",
  ],
];
photographs.push(
  ...additional.map(([id, title, description, sourceFile]) => ({
    id,
    title,
    description,
    category: (id === "bto-retreat-2024"
      ? "Public service"
      : "In the field") as Photograph["category"],
    file: `/images/${id}.jpg`,
    credit: "Office of Hon. Olubunmi Tunji-Ojo / bto.ng",
    source: `https://bto.ng/wp-content/uploads/2024/06/${sourceFile}`,
  })),
);

export interface Film {
  id: string;
  title: string;
  description: string;
  date: string;
  publisher: string;
  youtube?: string;
  file?: string;
  poster: string;
  source: string;
}
export const films: Film[] = [
  {
    id: "airport-commissioning",
    title: "A welcome to Nigeria.",
    description: "An event film of the commissioning of the remodelled Arrival E at Lagos airport in December 2023. The homepage uses a short, silent excerpt. Film published by Olumide Mikel Pictures in August 2025.",
    date: "December 2023",
    publisher: "Olumide Mikel Pictures (OMP)",
    youtube: "fMgmL2v1ZpY",
    poster: "bto-inspection-egates",
    source: "https://www.youtube.com/watch?v=fMgmL2v1ZpY",
  },
  {
    id: "passport-inspection",
    title: "Service, on the ground.",
    description:
      "An unannounced visit to Abuja passport offices. Tunji-Ojo questions delays and stresses the need for efficient service.",
    date: "21 January 2026",
    publisher: "Channels Television",
    youtube: "PpDF6Dj47vg",
    poster: "bto-inspection-egates",
    source:
      "https://www.channelstv.com/2026/01/21/video-tunji-ojo-pays-unscheduled-visit-to-abuja-passport-offices-warns-against-corrupt-practices/",
  },
  {
    id: "passport-automation",
    title: "Rethinking the passport.",
    description:
      "A broadcast interview on automating Nigeria’s passport application process.",
    date: "28 November 2023",
    publisher: "Channels Television",
    youtube: "0Aq8ixXj0Bc",
    poster: "at-desk-2023",
    source:
      "https://www.channelstv.com/2023/11/28/99-done-tunji-ojo-vows-automated-passport-application-going-live-next-week/",
  },
  {
    id: "egates-inspection",
    title: "At the border.",
    description:
      "TVC News follows Tunji-Ojo’s inspection of the electronic gates at Murtala Muhammed International Airport, Lagos.",
    date: "May 2024",
    publisher: "TVC News Nigeria",
    youtube: "joitS7ST3Pc",
    poster: "bto-inspection-egates",
    source: "https://www.youtube.com/watch?v=joitS7ST3Pc",
  },
];

export const photoById = (id: string): Photograph =>
  photographs.find((p) => p.id === id) ?? photographs[0];
