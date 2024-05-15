import GameGrid from "../components/GameGrid";

function Games() {
  return (
    <div className=" bg-streak bg-cover pt-36">
      <div className="flex items-center justify-center">
        <h1 className="font-bayon text-6xl text-white justify-center">
          GAMES
        </h1>
      </div>
      <div className="flex items-center flex-col">

        <GameGrid />
      </div>
    </div>
  );
}

export default Games;

