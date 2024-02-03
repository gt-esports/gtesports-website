import { Game } from "../types";

import league from "../assets/game-covers/league-of-legends-cover.png";
import tft from "../assets/game-covers/teamfight-tactics-cover.jpg";
import valorant from "../assets/game-covers/valorant-cover.jpeg";
import overwatch2 from "../assets/game-covers/overwatch-2-cover.jpeg";
import csgo2 from "../assets/game-covers/counter-strike-2-cover.jpeg";
import smash from "../assets/game-covers/smash-cover.jpeg";
import r6 from "../assets/game-covers/rainbow-six-siege-cover.jpeg"
import rythm from "../assets/game-covers/rythm-games-cover.jpeg";
import tf2 from "../assets/game-covers/team-fortress-2-cover.jpeg";
import hearthstone from "../assets/game-covers/hearthstone-cover.jpeg";
import smite from "../assets/game-covers/smite-cover.jpeg";
import rl from "../assets/game-covers/rocket-league-cover.jpeg";


export const games: Game[] = [
  { name: "League of Legends", image: league, pageLink: "link", discordLink: "link"},
  { name: "Teamfight Tacticts", image: tft, pageLink: "link", discordLink: "link"},
  { name: "Valorant", image: valorant, pageLink: "link", discordLink: "link"},
  { name: "Overwatch 2", image: overwatch2, pageLink: "link", discordLink: "link"},
  { name: "Rocket League", image: rl, pageLink: "link", discordLink: "link"},
  { name: "CSGO 2", image: csgo2, pageLink: "link", discordLink: "link"},
  { name: "Smash", image: smash, pageLink: "link", discordLink: "link"},
  { name: "Rainbow Six Siege", image: r6, pageLink: "link", discordLink: "link"},
  { name: "Team Fortress 2", image: tf2, pageLink: "link", discordLink: "link"},
  { name: "Osu/Rythm Games", image: rythm, pageLink: "link", discordLink: "link"},
  { name: "Hearthstone", image: hearthstone, pageLink: "link", discordLink: "link"},
  { name: "Smite", image: smite, pageLink: "link", discordLink: "link"},

];
  