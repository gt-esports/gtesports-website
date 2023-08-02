import type { Game } from "../pages/Games";

function GameCard({ game }: { game: Game }) {
  return (
    <div className="flex w-11/12 rounded-md border-l-8 border-light-purple p-2 text-light-purple shadow-md lg:w-1/2">
      <img
        src={game.icon}
        className="my-auto h-16 w-16 rounded-full md:h-32 md:w-32"
      />
      <div className="ml-4 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold">{game.name}</h1>
          <p>{game.desc}</p>
        </div>
        <a
          href={game.discord}
          target="_blank"
          className="cursor-pointer text-blue-500 transition-colors duration-200 ease-in hover:text-blue-600"
        >
          Discord
        </a>
      </div>
    </div>
  );
}

export default GameCard;
