import type { CompetitorTeam } from "./model";

export const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-deep-space px-3 py-2.5 text-white focus:border-tech-gold focus:outline-none focus:ring-1 focus:ring-tech-gold";
export const primary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-tech-gold px-4 py-2.5 text-sm font-semibold text-deep-space transition hover:bg-gold-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-gold disabled:opacity-50";
export const secondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-gold disabled:opacity-50";
export const panel = "rounded-2xl border border-white/10 bg-white/[0.03]";
export const teamLabel = (team: CompetitorTeam) =>
  `${team.game} · ${team.name} · ${team.season}`;
