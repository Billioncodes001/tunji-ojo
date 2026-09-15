/** Every published claim carries the URL it was verified against. */
export interface Fact {
  text: string;
  source: string;
  sourceLabel?: string;
}

export interface Entry extends Fact {
  year: string;
  title: string;
}

export interface Stat extends Fact {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface Quote extends Fact {
  context: string;
  speaker?: string;
}

export interface ImageCredit {
  file: string;
  description: string;
  credit: string;
  source: string;
}

export interface AgencyGroup {
  key: string;
  name: string;
  intro: string;
  image: string;
  imageAlt: string;
  items: Entry[];
}
