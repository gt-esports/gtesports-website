import type { GameCardProps } from "../types";
import { FaDiscord } from "react-icons/fa";
import { FiArrowUpRight, FiPlay } from "react-icons/fi";

export default function GameCard({ image, name, discordLink, onLearnMore, highlightLink, category }: GameCardProps) {
  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-tech-gold/40 focus-within:border-tech-gold/50">
      <h2 className="sr-only">{name}</h2>
      <button type="button" onClick={(event) => { event.currentTarget.focus(); onLearnMore(); }} aria-label={`View ${name} details`} aria-haspopup="dialog"
        className="relative block w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-tech-gold">
        <img src={image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-space via-deep-space/15 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-deep-space/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-200 backdrop-blur-md">{category}</span>
        {highlightLink && <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-deep-space/80 text-tech-gold" title="Highlight available"><FiPlay size={14} aria-hidden="true" /></span>}
        <span aria-hidden="true" className="absolute bottom-4 left-4 right-4 font-outfit text-xl font-bold leading-tight text-white">{name}</span>
      </button>
      <div className="mt-auto flex items-center gap-3 border-t border-white/5 px-4 py-4">
        <button type="button" onClick={(event) => { event.currentTarget.focus(); onLearnMore(); }} aria-label={`Learn more about ${name}`} aria-haspopup="dialog"
          className="flex min-h-[44px] flex-1 items-center justify-between gap-2 rounded-xl px-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-white/5 hover:text-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold">
          Learn more <FiArrowUpRight aria-hidden="true" />
        </button>
        {discordLink && <a href={discordLink} target="_blank" rel="noopener noreferrer" aria-label={`Join the ${name} Discord`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-colors hover:border-tech-gold/30 hover:bg-tech-gold/10 hover:text-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold"><FaDiscord size={20} aria-hidden="true" /></a>}
      </div>
    </article>
  );
}
