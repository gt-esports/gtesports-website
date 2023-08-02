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
      name: "Valorant",
      desc: "This is the Valorant description blah blah blah blah blah.",
      icon: "/val_logo.png",
      discord: "https://discord.gg/2aUxJuT",
    },
    {
      name: "Rocket League",
      desc: "This is the Rocket League description blah blah blah blah blah.",
      icon: "/rl_logo.png",
      discord: "https://discord.gg/B9tQzuk8jh",
    },
    {
      name: "Dota 2",
      desc: "This is the Dota 2 description blah blah blah blah blah.",
      icon: "/dota2_logo.png",
      discord: "https://discord.gg/cEG2MMDQKK",
    },
    {
      name: "Rainbow Six: Siege",
      desc: "This is the RS6 description blah blah blah blah blah.",
      icon: "/r6_logo.png",
      discord: "https://discord.gg/2aUxJuT",
    },
  ];

  return (
    <div>
      <h1 className="py-6 text-center text-5xl font-bold text-light-purple">
        Games
      </h1>
      <div className="flex flex-col items-center gap-5">
        {games.map((game, index) => {
          return <GameCard key={index} game={game} />;
        })}
      </div>
    </div>
  );
}

export default Games;
