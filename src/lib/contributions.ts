import { GITHUB_USERNAME } from "@/lib/github";

export interface Day {
  d: string; // date
  r: number; // weekday row
  c: number; // week column
  l: number; // level 0-4
  n: number; // contributions that day
}

/* GitHub's public contribution calendar, parsed from the HTML its profile page loads.
   shortcut: scrapes markup GitHub can change; if this starts failing, switch to the GraphQL API with a token. */
export function parseCalendar(html: string) {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/for="contribution-day-component-(\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    counts.set(m[1], parseInt(m[2].replace(/,/g, ""), 10) || 0);
  }
  const days: Day[] = [];
  for (const m of html.matchAll(/data-date="([\d-]+)" id="contribution-day-component-(\d+)-(\d+)" data-level="(\d)"/g)) {
    days.push({
      d: m[1],
      r: +m[2],
      c: +m[3],
      l: +m[4],
      n: counts.get(`${m[2]}-${m[3]}`) ?? 0,
    });
  }
  const total = parseInt(/([\d,]+)\s+contributions\s+in the last year/.exec(html)?.[1].replace(/,/g, "") ?? "", 10);
  return {
    total: Number.isFinite(total) ? total : days.reduce((s, x) => s + x.n, 0),
    days,
  };
}

export const CALENDAR_URL = `https://github.com/users/${GITHUB_USERNAME}/contributions`;
