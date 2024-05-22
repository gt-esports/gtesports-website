import GameCard from "./GameCard";
import { games, casual_games } from "../data/gamesData";
import { useState } from "react";

function GameGrid() {
  const [comp, setComp] = useState(true);

  return (
    <div className="flex flex-wrap justify-center px-[100px]">
      <div className="xl:right:24 absolute left-60 w-full pb-4 font-barlow text-xl 2xl:left-56">
        <button
          className={
            comp
              ? "px-2 text-bright-buzz underline underline-offset-8"
              : "px-2 text-white underline-offset-4 duration-500 hover:text-bright-buzz"
          }
          onClick={() => setComp(true)}
        >
          Competitive
        </button>
        <button
          className={
            !comp
              ? "px-2 text-bright-buzz underline underline-offset-8"
              : "px-2 text-white underline-offset-4 duration-500 hover:text-bright-buzz"
          }
          onClick={() => setComp(false)}
        >
          Casual
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center py-12">
        {Object.entries(comp ? games : casual_games).map(
          ([name, game], index) => (
            <div className="p-3">
              <GameCard
                key={index}
                image={game.image}
                name={name}
                link={game.pageLink}
                discordLink={game.discordLink}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default GameGrid;
