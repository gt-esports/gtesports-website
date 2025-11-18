import league from "../assets/game-covers/league-of-legends-cover.webp";
import tft from "../assets/game-covers/teamfight-tactics-cover.webp";
import valorant from "../assets/game-covers/valorant-cover.webp";
import overwatch2 from "../assets/game-covers/overwatch-2-cover.webp";
import csgo2 from "../assets/game-covers/counter-strike-2-cover.webp";
import smash from "../assets/game-covers/smash-cover.webp";
import r6 from "../assets/game-covers/rainbow-six-siege-cover.webp";
import rythm from "../assets/game-covers/osu-cover.webp";
import tf2 from "../assets/game-covers/tf2-cover.webp";
import hearthstone from "../assets/game-covers/hearthstone-cover.webp";
import smite from "../assets/game-covers/smite-cover.webp";
import rl from "../assets/game-covers/rocket-league-cover.webp";
import cod from "../assets/game-covers/cod-cover.webp";
import apex from "../assets/game-covers/apex-cover.webp";
import dota2 from "../assets/game-covers/dota-2-cover.webp";
import marioKart from "../assets/game-covers/mario-kart-cover.webp";
import supercell from "../assets/game-covers/supercell-cover.webp";
import sportsVG from "../assets/game-covers/sports-cover.webp";
import deadlock from "../assets/game-covers/deadlock-cover.webp";
import fgcGames from "../assets/game-covers/fgc-cover.webp";
import marvelRivals from "../assets/game-covers/marvel-rivals-cover.webp";

import minecraft from "../assets/game-covers/minecraft-cover.webp";
import genshin from "../assets/game-covers/genshin-impact-cover.webp";
import pokemonGo from "../assets/game-covers/pokemon-go-cover.webp";
import fortnite from "../assets/game-covers/fortnite-cover.webp";
import animalCrossing from "../assets/game-covers/animal-crossing-cover.webp";
import destiny from "../assets/game-covers/destiny-cover.webp";
import hearts_of_iron from "../assets/game-covers/hearts-of-iron-4-cover.webp";
import amongus from "../assets/game-covers/gt-arcade-cover.webp";
import geoguesser from "../assets/game-covers/geoguesser-cover.webp";
import tetris from "../assets/game-covers/tetris-cover.webp";

export interface GameData {
  image: string;
  pageLink: string;
  discordLink: string;
  description: string;
  highlightLink?: string;
}

export const games: Record<string, GameData> = {
  "League of Legends": {
    image: league,
    pageLink: "link",
    discordLink: "https://discord.gg/T3vB5jYhdE",
    description: "League of Legends is a 5v5 strategy game where teams battle across Summoner’s Rift using unique champions to destroy the enemy Nexus.",
    highlightLink: "https://www.youtube.com/embed/KtrVy2KLzIo?si=1JaYZlfXvI8EAXbh",
  },
  "Teamfight Tactics": {
    image: tft,
    pageLink: "link",
    discordLink: "https://discord.gg/T3vB5jYhdE",
    description: "TFT is an auto-battler where you build and position champions to outlast opponents through smart strategy and economy management.",
  },
  Valorant: {
    image: valorant,
    pageLink: "link",
    discordLink: "https://discord.gg/2aUxJuT",
    description: "Valorant is a tactical 5v5 shooter blending precise gunplay with unique agent abilities for strategic team-based combat.",
  },
  "Overwatch 2": {
    image: overwatch2,
    pageLink: "link",
    discordLink: "https://discord.com/invite/Q3s2dU9jEa",
    description: "Overwatch 2 is a fast-paced hero shooter where teams use diverse abilities and coordination to secure objectives and outplay rivals.",
  },
  "Rocket League": {
    image: rl,
    pageLink: "link",
    discordLink: "https://discord.gg/B9tQzuk8jh",
    description: "Rocket League mixes soccer and cars, where players use rocket-powered vehicles to score goals in high-speed, physics-based matches.",
  },
  "Counter-Strike": {
    image: csgo2,
    pageLink: "link",
    discordLink: "https://discord.gg/3FUjyXA",
    description: "Counter-Strike 2 is a tactical FPS emphasizing precision, teamwork, and quick strategy between terrorists and counter-terrorists.",
  },
  Smash: {
    image: smash,
    pageLink: "link",
    discordLink: "https://discord.gg/8Sbt9BFQzJ",
    description: "Super Smash Bros. is a crossover fighting game where iconic characters battle to knock each other off the stage.",
  },
  "Rainbow Six Siege": {
    image: r6,
    pageLink: "link",
    discordLink: "https://discord.gg/MPuJg5qws5",
    description: "Rainbow Six Siege is a tactical shooter focused on team coordination, destructible environments, and strategic planning.",
  },
  "Team Fortress 2": {
    image: tf2,
    pageLink: "link",
    discordLink: "https://discord.gg/Bq2NaZc8pA",
    description: "TF2 is a class-based shooter combining humor, teamwork, and unique playstyles across fast-paced multiplayer matches.",
  },
  "Osu/Rhythm Games": {
    image: rythm,
    pageLink: "link",
    discordLink: "https://discord.gg/pFVVySyuEn",
    description: "Osu! and other rhythm games challenge players’ timing, precision, and reflexes through music-driven gameplay.",
  },
  Hearthstone: {
    image: hearthstone,
    pageLink: "link",
    discordLink: "https://discord.gg/uVGfKd3jre",
    description: "Hearthstone is a strategic card game where players build decks and use hero powers to outwit opponents in turn-based duels.",
  },
  Smite: {
    image: smite,
    pageLink: "link",
    discordLink: "https://discord.gg/mJGzCCgYCC",
    description: "Smite is a third-person MOBA where gods and mythological figures battle using unique abilities in arena and conquest modes.",
  },
  "Apex Legends": {
    image: apex,
    pageLink: "link",
    discordLink: "https://discord.gg/hf4aHRHUTH",
    description: "Apex Legends is a squad-based battle royale featuring fast-paced movement, hero abilities, and dynamic team fights.",
  },
  "COD/WZ/CODM": {
    image: cod,
    pageLink: "link",
    discordLink: "https://discord.gg/bSz7Qg4gjH",
    description: "Call of Duty offers fast, action-packed shooters across multiplayer, Warzone battle royale, and mobile experiences.",
  },
  "Dota 2": {
    image: dota2,
    pageLink: "link",
    discordLink: "https://discord.com/invite/bxMpB43put",
    description: "Dota 2 is a deep, strategic MOBA where two teams of heroes compete to destroy the enemy’s Ancient through teamwork and skill.",
  },
  "Mario Kart": {
    image: marioKart,
    pageLink: "link",
    discordLink: "https://discord.gg/Ke74RqzTG9",
    description: "Mario Kart is a colorful racing game where players compete using power-ups, skill, and chaos across whimsical tracks.",
  },
  Supercell: {
    image: supercell,
    pageLink: "link",
    discordLink: "https://discord.gg/6c6f2KbhYS",
    description: "Supercell titles like Clash Royale and Brawl Stars deliver fast, strategic, and competitive mobile gaming experiences.",
  },
  "Sports Video Games": {
    image: sportsVG,
    pageLink: "link",
    discordLink: "https://discord.gg/9KVvtMurPD",
    description: "Sports games bring realism and competition to titles like FIFA, NBA 2K, and Madden for fans of athletic gameplay.",
  },
  Deadlock: {
    image: deadlock,
    pageLink: "link",
    discordLink: "https://discord.gg/Pvv2HBNqsN",
    description: "Deadlock blends shooter mechanics and hero abilities for fast, strategic, and team-based competitive gameplay.",
  },
  "Fighting Games": {
    image: fgcGames,
    pageLink: "link",
    discordLink: "https://discord.gg/u5UNwBM4Zg",
    description: "The FGC features titles like Street Fighter and Tekken, testing reaction time, combos, and competitive skill.",
  },
  "Marvel Rivals": {
    image: marvelRivals,
    pageLink: "link",
    discordLink: "https://discord.gg/JFVmDyWuMc",
    description: "Marvel Rivals is a team shooter where iconic Marvel heroes battle with unique powers and coordinated team play.",
  },
  Tetris: {
    image: tetris,
    pageLink: "link",
    discordLink: "https://discord.gg/HxdrD6yVuM",
    description: "Tetris is a timeless puzzle game challenging players to stack falling blocks and clear lines efficiently.",
  },
};

export const casual_games: Record<string, GameData> = {
  Minecraft: {
    image: minecraft,
    pageLink: "link",
    discordLink: "https://discord.gg/QbeazDKCdM",
    description: "Minecraft is a sandbox adventure where you can build, explore, and survive in endless blocky worlds.",
  },
  "Genshin Impact": {
    image: genshin,
    pageLink: "link",
    discordLink: "https://discord.gg/QaTtcMat6Y",
    description: "Genshin Impact is an open-world RPG filled with elemental combat, exploration, and rich storytelling.",
  },
  "Pokemon Go": {
    image: pokemonGo,
    pageLink: "link",
    discordLink: "https://discord.gg/txJjUhg",
    description: "Pokemon Go lets players explore the real world to catch, train, and battle Pokémon using augmented reality.",
  },
  Fortnite: {
    image: fortnite,
    pageLink: "link",
    discordLink: "https://discord.gg/ZDmmynxYYM",
    description: "Fortnite combines building and battle royale action with vibrant skins, creative modes, and constant updates.",
  },
  "Animal Crossing": {
    image: animalCrossing,
    pageLink: "link",
    discordLink: "https://discord.gg/AN4Zspc6Pr",
    description: "Animal Crossing is a cozy life-sim where you build your island home, make friends, and enjoy relaxing gameplay.",
  },
  "GT Arcade": {
    image: amongus,
    pageLink: "link",
    discordLink: "https://discord.gg/tpcMu4jQGh",
    description: "GT Arcade features a variety of casual and strategy games designed for easy access and social play.",
  },
  Destiny: {
    image: destiny,
    pageLink: "link",
    discordLink: "https://discord.gg/F2FqwxxHXK",
    description: "Destiny 2 is a sci-fi shooter with cooperative missions, raids, and evolving story-driven worlds.",
  },
  "Hearts of Iron 4": {
    image: hearts_of_iron,
    pageLink: "link",
    discordLink: "https://discord.gg/Q2bZFrFkvQ",
    description: "Hearts of Iron IV is a grand strategy game where you lead nations through WWII with tactical depth and realism.",
  },
  Geoguessor: {
    image: geoguesser,
    pageLink: "link",
    discordLink: "https://discord.gg/2cUvGDDDsT",
    description: "Geoguessr challenges players to identify real-world locations from street views using geography skills.",
  },
};