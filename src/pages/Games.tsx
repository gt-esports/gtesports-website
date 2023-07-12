import GameCard from "../components/GameCard";

export interface Game {
  name: string;
  desc: string;
  icon: string;
  discord: string;
}

function Games() {
  const games = [
    {
      name: "League of Legends",
      desc: "This is the League of Legends description blah blah blah blah blah.",
      icon: "/lol_logo.png",
      discord: "https://discord.gg/T3vB5jYhdE",
    },
    {
      name: "League of Legends",
      desc: "This is the League of Legends description blah blah blah blah blah. This is the League of Legends description blah blah blah blah blah.",
      icon: "/lol_logo.png",
      discord: "https://discord.gg/T3vB5jYhdE",
    },
    {
      name: "League of Legends",
      desc: "This is the League of Legends description blah blah blah blah blah.",
      icon: "/lol_logo.png",
      discord: "https://discord.gg/T3vB5jYhdE",
    },
    {
      name: "League of Legends",
      desc: "This is the League of Legends description blah blah blah blah blah.",
      icon: "/lol_logo.png",
      discord: "https://discord.gg/T3vB5jYhdE",
    },
    {
      name: "League of Legends",
      desc: "This is the League of Legends description blah blah blah blah blah. This is the League of Legends description blah blah blah blah blah.",
      icon: "/lol_logo.png",
      discord: "https://discord.gg/T3vB5jYhdE",
    },
    {
      name: "League of Legends",
      desc: "This is the League of Legends description blah blah blah blah blah.",
      icon: "/lol_logo.png",
      discord: "https://discord.gg/T3vB5jYhdE",
    },
    {
      name: "League of Legends",
      desc: "This is the League of Legends description blah blah blah blah blah.",
      icon: "/lol_logo.png",
      discord: "https://discord.gg/T3vB5jYhdE",
    },
    {
      name: "League of Legends",
      desc: "This is the League of Legends description blah blah blah blah blah. This is the League of Legends description blah blah blah blah blah.",
      icon: "/lol_logo.png",
      discord: "https://discord.gg/T3vB5jYhdE",
    },
    {
      name: "League of Legends",
      desc: "This is the League of Legends description blah blah blah blah blah.",
      icon: "/lol_logo.png",
      discord: "https://discord.gg/T3vB5jYhdE",
    },
  ];

  return (
    <div>
      <h1 className="py-6 text-center text-5xl font-bold text-light-purple">
        Games
      </h1>
      <div className="flex flex-col justify-center gap-8 px-20 md:mx-auto md:w-11/12 md:flex-row md:flex-wrap md:justify-evenly">
        {games.map((game, index) => {
          return <GameCard key={index} game={game} />;
        })}
      </div>
    </div>
  );
}

export default Games;
