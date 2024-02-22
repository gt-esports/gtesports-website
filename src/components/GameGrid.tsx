import GameCard from "./GameCard";
import { games, casual_games } from '../data/gamesData';


function GameGrid(props: { gameType : boolean}) {
    return (
        <div className="flex flex-wrap justify-center px-[100px]">
            {Object.entries(props.gameType ? games : casual_games).map(([name, game], index) => (
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