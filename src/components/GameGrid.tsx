import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { games, casual_games } from "../data/gamesData";
import GameCard from "./GameCard";
import { FiSearch } from "react-icons/fi";

function GameGrid() {
  const [isCompetitive, setIsCompetitive] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const gamesToDisplay = useMemo(() => {
    const source = isCompetitive ? games : casual_games;
    return Object.entries(source).filter(([name]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [isCompetitive, searchTerm]);

  return (
    <div className="w-full max-w-7xl px-4 py-8">
      {/* Controls Header */}
      <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Toggle Buttons */}
        <div className="flex gap-2 rounded-lg bg-white/5 p-1 backdrop-blur-md">
          <button
            onClick={() => setIsCompetitive(true)}
            className={`rounded-md px-6 py-2 font-outfit text-sm font-bold uppercase tracking-wider transition-all ${isCompetitive
                ? "bg-tech-gold text-white shadow-lg"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Competitive
          </button>
          <button
            onClick={() => setIsCompetitive(false)}
            className={`rounded-md px-6 py-2 font-outfit text-sm font-bold uppercase tracking-wider transition-all ${!isCompetitive
                ? "bg-tech-gold text-white shadow-lg"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Casual
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-auto">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 font-inter text-white placeholder-gray-400 focus:border-tech-gold focus:outline-none focus:ring-1 focus:ring-tech-gold md:w-64"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {gamesToDisplay.map(([name, game]) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <GameCard
                image={game.image}
                name={name}
                link={game.pageLink}
                discordLink={game.discordLink}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {gamesToDisplay.length === 0 && (
        <div className="mt-20 text-center text-gray-500">
          <p className="font-outfit text-xl">No games found.</p>
        </div>
      )}
    </div>
  );
}

export default GameGrid;
