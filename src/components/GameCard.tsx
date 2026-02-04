import { GameCardProps } from "../types";
import { FaDiscord } from "react-icons/fa";

function GameCard(props: GameCardProps) {
  return (
    <div className="group relative flex h-[350px] w-[260px] flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:scale-105 hover:border-tech-gold/50 hover:shadow-2xl hover:shadow-tech-gold/20">
      {/* Image with gradient overlay */}
      <div className="relative h-[80%] w-full overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40"></div>
        <img
          src={props.image}
          alt={`${props.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Name overlay on image */}
        <div className="absolute bottom-0 left-0 z-20 w-full p-4">
          <h1 className="font-outfit text-xl font-bold uppercase tracking-wider text-white drop-shadow-md">
            {props.name}
          </h1>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex h-[20%] w-full items-center justify-between gap-2 bg-black/40 px-4 backdrop-blur-sm">
        {/* <button className="flex-1 rounded-md bg-white/10 py-2 font-outfit text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-tech-gold hover:text-white">
          Details
        </button> */}

        {props.discordLink && (
          <a
            href={props.discordLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center rounded-md bg-[#5865F2]/20 py-2 text-[#5865F2] transition-colors hover:bg-[#5865F2] hover:text-white"
            title="Join Discord"
          >
            <FaDiscord size={18} />
          </a>
        )}
      </div>
    </div>
  );
}

export default GameCard;
