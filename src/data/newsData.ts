import gamingSetup from "../assets/backgrounds/home-1.jpg";
import rocketLeague from "../assets/game-covers/rocket-league-cover.webp";
import marioKart from "../assets/game-covers/mario-kart-cover.webp";

export const newsCategories = ["All news", "Community", "Competition", "Events"] as const;

export type NewsCategory = (typeof newsCategories)[number];

export interface NewsPost {
  id: string;
  title: string;
  publishedAt: string;
  image: string;
  imageAlt: string;
  category: Exclude<NewsCategory, "All news">;
  preview: string;
}

// UI examples only. Replace these posts and publication dates with approved news
// before presenting this page as a live news feed. Keep newest posts first.
export const newsPosts: NewsPost[] = [
  {
    id: "sample-community",
    title: "GT Esports Community Update",
    publishedAt: "2026-09-28",
    image: "/backgrounds/landing.jpg",
    imageAlt: "Buzz and a student playing Mario Kart together outdoors",
    category: "Community",
    preview:
      "Here's a sample community update about XXX. Sample description sample description sample description.",
  },
  {
    id: "sample-competition",
    title: "Rocket League Team Update",
    publishedAt: "2026-09-28",
    image: rocketLeague,
    imageAlt: "Rocket League game artwork",
    category: "Competition",
    preview:
      "Here's a sample update from our Rocket League team about XXX. Sample description sample description sample description.",
  },
  {
    id: "sample-game-nights",
    title: "Mario Kart Game Night",
    publishedAt: "2026-09-28",
    image: marioKart,
    imageAlt: "Mario Kart game artwork",
    category: "Events",
    preview:
      "We're hosting a Mario Kart Game Night on XXX at XXX. Sample description sample description sample description.",
  },
  {
    id: "sample-gaming-community",
    title: "Gaming Community Spotlight",
    publishedAt: "2026-09-28",
    image: gamingSetup,
    imageAlt: "A row of gaming computers and chairs",
    category: "Community",
    preview:
      "This is a sample spotlight on our XXX gaming community. Sample description sample description sample description.",
  },
];
