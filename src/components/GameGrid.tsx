import GameCard from "./GameCard";
import { games } from '../data/gamesData';


function GameGrid() {
    return (
        <div className="flex flex-wrap">
            {Object.entries(games).map(([name, game], index) => (
                <div className="p-3">
                    <GameCard
                        key={index}
                        image={game.image}
                        name={name}
                        link={game.pageLink}
                        discordLink={game.discordLink}
                    />
                </div>
            ))}
        </div>
    );
}

export default GameGrid;