import type { Game } from "../pages/Games";

function GameCard({ game }: { game: Game }) {
  return (
    <div className="mx-auto flex w-[250px] flex-col items-center rounded-md border-t-8 border-light-purple shadow-md transition-all duration-300 hover:shadow-xl md:mx-4">
      <img
        src={game.icon}
        className="my-2 w-1/2 rounded-full border-4 border-light-purple"
      />
      <div className="mb-4 flex h-full flex-col justify-between px-4">
        <div>
          <h1 className="text-center text-lg font-bold">{game.name}</h1>
          <p className="my-2 text-center">{game.desc}</p>
        </div>
        <p className="text-center text-blue-500">
          <a href={game.discord} target="_blank">
            Discord
          </a>
        </p>
      </div>
    </div>
  );
}

export default GameCard;
