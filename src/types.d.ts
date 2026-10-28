export interface GameCardProps {
  image: string;
  name: string;
  discordLink: string;
  link: string;
  highlightLink?: string;
  category: "Competitive" | "Casual";
  onLearnMore: () => void;
}

export interface ProfileCardProps {
  image?: string;
  name: string;
  position: string;
  linkedinUrl?: string;
}

export interface HighlightProps {
  src: string;
  title?: string;
  poster?: string;
  captions?: { src: string; srcLang: string; label: string; default?: boolean }[];
  controls?: boolean;
  isOpen: boolean;
  autoPlay?: boolean;
  className?: string;
}
