import { useCallback, useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { games, casual_games, type GameData } from "../data/gamesData";
import GameCard from "./GameCard";
import GameModal from "./GameModal";

type Category = "Competitive" | "Casual";
type SelectedGame = GameData & { name: string; category: Category };

export default function GameGrid() {
  const [category, setCategory] = useState<Category>("Competitive");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);
  const closeModal = useCallback(() => setSelectedGame(null), []);
  const gamesToDisplay = useMemo(() => Object.entries(category === "Competitive" ? games : casual_games)
    .filter(([name]) => name.toLowerCase().includes(searchTerm.trim().toLowerCase())), [category, searchTerm]);

  return (
    <div className="w-full max-w-7xl px-6 pb-16 sm:px-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Game category" className="flex w-full rounded-full border border-white/10 bg-white/[0.03] p-1 sm:w-auto">
          {(["Competitive", "Casual"] as const).map((item) => (
            <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}
              className={`min-h-[44px] flex-1 rounded-full px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold sm:flex-none ${category === item ? "bg-tech-gold text-deep-space" : "text-gray-400 hover:text-white"}`}>{item}</button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <label htmlFor="game-search" className="sr-only">Search games</label>
          <FiSearch aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input id="game-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Find your game"
            className="min-h-[48px] w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 transition-colors focus:border-tech-gold/60 focus:outline-none focus:ring-1 focus:ring-tech-gold/60" />
        </div>
      </div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-outfit text-lg font-semibold text-white">{category === "Competitive" ? "Find your next team" : "Find your next community"}</h2>
        <p aria-live="polite" aria-atomic="true" className="shrink-0 text-xs text-gray-500">{gamesToDisplay.length} {gamesToDisplay.length === 1 ? "game" : "games"}</p>
      </div>
      <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {gamesToDisplay.map(([name, game]) => (
          <GameCard key={name} image={game.image} name={name} link={game.pageLink} discordLink={game.discordLink}
            category={category} highlightLink={game.highlightLink} onLearnMore={() => setSelectedGame({ ...game, name, category })} />
        ))}
      </div>
      {gamesToDisplay.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
        <FiSearch aria-hidden="true" className="mx-auto mb-4 text-2xl text-tech-gold" />
        <h3 className="font-outfit text-xl font-semibold text-white">No games found</h3>
        <p className="mt-2 text-sm text-gray-400">Try another name or switch game categories.</p>
        <button type="button" onClick={() => setSearchTerm("")} className="mx-auto mt-6 flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-gray-200 hover:text-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold"><FiX aria-hidden="true" /> Clear search</button>
      </div>}
      {selectedGame && <GameModal key={selectedGame.name} isOpen onClose={closeModal} gameName={selectedGame.name}
        gameDescription={selectedGame.description} gameImage={selectedGame.image} discordLink={selectedGame.discordLink}
        category={selectedGame.category} highlightLink={selectedGame.highlightLink} />}
    </div>
  );
}
