import GameGrid from "../components/GameGrid";
import { useState } from "react";
// import { comp_games, casual_games } from "../data/gamesData";

function Games() {

  // const items = ['Item 1', 'Item 2', 'Item 3'];

  const [comp, setComp] = useState(true);


  return (
    <div className="flex flex-col w-full bg-streak bg-cover pt-36">
      <div className="flex items-center justify-center">
        <h1 className="font-bayon text-7xl tracking-wide text-white justify-center">
          GAMES
        </h1>
      </div>
      <div className="px-4 pb-2 justify-left text-xl pl-[150px]">
            <button className={comp ? "text-bright-buzz underline px-2" : "text-white underline-offset-4 duration-500 hover:text-bright-buzz px-2"} onClick={() => setComp(true)}>Competitive</button>
            <button className={!comp ? "text-bright-buzz underline px-2" : "text-white underline-offset-4 duration-500 hover:text-bright-buzz px-2"} onClick={() => setComp(false)}>Casual</button>
        </div>
      <div className="flex items-center flex-col">

        <GameGrid gameType={comp}/>
      </div>
    </div>
  );
}

export default Games;

