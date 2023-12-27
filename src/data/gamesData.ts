import { Game } from "../types";

import league from "../assets/game-covers/league-of-legends-cover.png";
import valorant from "../assets/game-covers/valorant-cover.jpeg";
import overwatch2 from "../assets/game-covers/overwatch-2-cover.jpeg";
import csgo2 from "../assets/game-covers/counter-strike-2-cover.jpeg";


export const games: Game[] = [
  { name: "League of Legends", image: league, pageLink: "link", discordLink: "link"},
  { name: "Valorant", image: valorant, pageLink: "link", discordLink: "link"},
  { name: "Overwatch 2", image: overwatch2, pageLink: "link", discordLink: "link"},
  { name: "CSGO 2", image: csgo2, pageLink: "link", discordLink: "link"},
];
  