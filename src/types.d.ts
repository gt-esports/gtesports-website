export interface GameCardProps {
  image: string;
  name: string;
  discordLink: string;
  link: string;
}

export interface RecruitmentCardProps {
  image: string;
  name: string;
  discordLink: string;
  recruitmentInfo: string;
  description: string;
  contactEmail: string;
  contactDiscord: string;
  tryoutDate: string;
}

export interface ProfileCardProps {
  image: string;
  name: string;
  position: string;
  linkedinUrl?: string;
}
