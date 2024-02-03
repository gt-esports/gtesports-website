import GameGrid from "../components/GameGrid";

function Games() {

  // const items = ['Item 1', 'Item 2', 'Item 3'];

  return (
    <div className="flex flex-colg w-full bg-streak bg-cover pt-36">
      <div className="flex items-center justify-center">
        <h1 className="font-bayon text-7xl tracking-wide text-white">
          GAMES
        </h1>
      </div>
      <div className="flex items-center justify-center">
        <GameGrid />
      </div>
    </div>
  );
}

export default Games;
  