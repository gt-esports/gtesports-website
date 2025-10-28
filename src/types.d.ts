export interface GameCardProps {
  image: string;
  name: string;
  discordLink: string;
  link: string;
  highlight?: string;
}

export interface RecruitmentCardProps {
  applicationStatus: string;
  image: string;
  name: string;
  discordLink: string;
  recruitmentInfo: string;
  description: string;
  contactEmail: string;
  contactDiscord: string;
  learnMoreLink: string;
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
