import GameCard from "./GameCard";

import league from "../assets/league.png";
import valorant from "../assets/val.jpeg";
import overwatch from "../assets/overwatch.jpeg";

const games = [
    { name: "League of Legends", image: league, link: "link", discordLink: "link"},
    { name: "Valorant", image: valorant, link: "link", discordLink: "link"},
    { name: "Overwatch", image: overwatch, link: "link", discordLink: "link"}
];

function GameGrid() {
    return (
        <div className="flex">
            {games.map((game, index) => (
                <div className="p-3">
                    <GameCard
                        key={index}
                        image={game.image}
                        name={game.name}
                        link={game.link}
                        discordLink={game.discordLink}
                    />
                </div>
            ))}
        </div>
    );
}

export default GameGrid;