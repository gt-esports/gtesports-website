import { GameCardProps } from "../types";

function GameCard(props: GameCardProps) {
  return (
    <div className="card flex flex-col items-center">
      <img
        src={props.image}
        alt={`${props.name}`}
        loading="lazy"
        className="card-image h-[285px] w-[220px] rounded-2xl pb-2 pl-3 pr-3 pt-3"
      />
      <h1 className="pb-2 font-barlow text-xl text-white">{props.name}</h1>
      <div className="mb-3 flex w-full justify-between">
        <button className="learn-more-btn text-barlow ml-3 flex items-center justify-center">
          Learn More
        </button>
        {(props.discordLink && props.discordLink != "") ?
        <a href={props.discordLink} target="_blank">
          <button className="discord-btn mr-3"></button>
        </a> : null}
      </div>
    </div>
  );
}

export default GameCard;
