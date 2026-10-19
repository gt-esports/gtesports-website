import {
  FaCode,
  FaPaintBrush,
  FaVideo,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa";

export const nextCycle = "Spring 2027";

export const departments = [
  {
    name: "Innovation / Development",
    icon: <FaCode />,
    blurb: "Build and maintain the GT Esports website and internal tools.",
    hours: "2-5 hrs/week",
    roles: ["Software Developer", "UI/UX Designer", "Hackathon Lead"],
  },
  {
    name: "Creative",
    icon: <FaPaintBrush />,
    blurb: "Design graphics, branding, and social media content.",
    hours: "2-4 hrs/week",
    roles: ["Creative Staff"],
  },
  {
    name: "Production",
    icon: <FaVideo />,
    blurb: "Run streams, broadcasts, and video production for events.",
    hours: "3-5 hrs/week",
    roles: ["Production Staff"],
  },
  {
    name: "Finance",
    icon: <FaDollarSign />,
    blurb: "Manage budgets, sponsorships, and club funding.",
    hours: "2-3 hrs/week",
    roles: ["Finance Staff"],
  },
  {
    name: "Events",
    icon: <FaCalendarAlt />,
    blurb: "Plan and run tournaments, GameFest, and socials.",
    hours: "3-5 hrs/week",
    roles: ["Events Staff", "Hackathon Lead"],
  },
];
