export interface GameCardProps {
  image: string;
  name: string;
  discordLink: string;
  link: string;
  highlightLink?: HighlightProps["src"];
  onLearnMore: () => void;
}

export interface ProfileCardProps {
  image?: string;
  name: string;
  position: string;
  linkedinUrl?: string;
}

export interface HighlightProps {
    src: string,
    poster: string,
    captions: string[],
    controls?: boolean,
    isOpen: boolean,
    autoPlay?: boolean,
    className?: string,
}
