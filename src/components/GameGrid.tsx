import GameCard from "./GameCard";
import { games, casual_games } from "../data/gamesData";
import { useState } from "react";
import SearchBar from "./SearchBar";

function GameGrid() {
  const [comp, setComp] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = Object.entries(comp ? games : casual_games).map(([name, game], index) => name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
    <div className="p-3">
      <GameCard
        key={index}
        image={game.image}
        name={name}
        link={game.pageLink}
        discordLink={game.discordLink}
      />
    </div>
  ) : null);

  function handleFilter(input: string) {
    setSearchTerm(input);
  }

  return (
    <div className="flex flex-wrap justify-center px-[100px]">
      <div className="w-full flex flex-col items-center">
        <div className="flex justify-center w-full pb-4 font-barlow text-xl">
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
        <div className="pb-4">
          <SearchBar searchTerm={searchTerm} placeholder={"Search games..."} handleInput={handleFilter} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center">
        {filteredGames}
      </div>
    </div>
  );
}

export default GameGrid;
