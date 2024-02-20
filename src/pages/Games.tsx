import GameGrid from "../components/GameGrid";
import { useState } from "react";
// import { comp_games, casual_games } from "../data/gamesData";

function Games() {

  // const items = ['Item 1', 'Item 2', 'Item 3'];

  const [comp, setComp] = useState(true);
  return (
    <div className="flex flex-col w-full bg-streak bg-cover pt-36">
      <div className="flex items-center justify-center">
        <h1 className="font-bayon text-7xl tracking-wide text-white">
          GAMES
        </h1>
      </div>
      <div className="p-4 pl-14 text-xl text-white flex">
        <ul>
          <button onClick={() => setComp(true)}>Competitive</button>
          <button onClick={() => setComp(false)}>Casual</button>
        </ul>
      </div>
      <div className="flex items-center justify-center pl-7">
        <GameGrid gameType={comp}/>
      </div>
    </div>
  );
}

export default Games;

