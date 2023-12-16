import { useState } from "react";
import league from "../assets/league.png";
import valorant from "../assets/val.jpeg";
import ow2 from "../assets/overwatch.jpeg";
import leftarrow from "../assets/left-arrow.svg";
import rightarrow from "../assets/right-arrow.svg";
import CarouselCard from "./CarouselCard";

const games = [
  [ow2, "Overwatch 2", "discordlink"],
  [valorant, "Valorant", "discordlink"],
  [league, "League of Legends", "discordlink"],
];

function Carousel() {
  const [center, setCenter] = useState<number>(Math.floor(games.length / 2));

  const handlePrev = () => {
    setCenter((prev) => (prev - 1 + games.length) % games.length);
  };

  const handleNext = () => {
    setCenter((prev) => (prev + 1) % games.length);
  };

  const reorder = [...games.slice(center), ...games.slice(0, center)];

  return (
    <div className="relative w-full">
      <div className="relative flex items-center overflow-hidden">
        <img
          onClick={handlePrev}
          src={leftarrow}
          className="absolute left-1/3 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer"
        />
        {reorder.map((game, index) => (
          <CarouselCard
            key={index}
            image={game[0]}
            name={game[1]}
            link={game[2]}
            center={index === Math.floor(reorder.length / 2)}
          />
        ))}
        <img
          onClick={handleNext}
          src={rightarrow}
          className="absolute right-1/3 top-1/2 -translate-y-1/2 transform cursor-pointer"
        />
      </div>
    </div>
  );
}

export default Carousel;
