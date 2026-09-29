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
    name: "Development",
    icon: <FaCode />,
    blurb: "Build and maintain the GT Esports website and internal tools.",
    hours: "3-5 hrs/week",
    roles: ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
  },
  {
    name: "Creative",
    icon: <FaPaintBrush />,
    blurb: "Design graphics, branding, and social media content.",
    hours: "2-4 hrs/week",
    roles: ["Graphic Designer", "Social Media Manager", "Content Writer"],
  },
  {
    name: "Production",
    icon: <FaVideo />,
    blurb: "Run streams, broadcasts, and video production for events.",
    hours: "3-6 hrs/week",
    roles: ["Stream Producer", "Caster / Host", "Video Editor"],
  },
  {
    name: "Finance",
    icon: <FaDollarSign />,
    blurb: "Manage budgets, sponsorships, and club funding.",
    hours: "2-3 hrs/week",
    roles: ["Treasurer Assistant", "Sponsorship Coordinator"],
  },
  {
    name: "Events",
    icon: <FaCalendarAlt />,
    blurb: "Plan and run tournaments, GameFest, and socials.",
    hours: "3-5 hrs/week",
    roles: ["Event Coordinator", "Tournament Organizer", "Logistics"],
  },
];
