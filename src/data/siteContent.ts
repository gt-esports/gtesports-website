import { faqs } from './faqData';
import { executives, development, creative, events, finance, production } from './teamsData';
import type { ProfileCardProps } from '../types';
import type { ContentMap, TeamMember } from './contentSchema';

const roster = (id: string, members: ProfileCardProps[]): TeamMember[] => members.map((member, index) => ({
  ...member, id: `${id}-${index}`, image: member.image ?? '',
  linkedinUrl: member.linkedinUrl?.startsWith('www.') ? `https://${member.linkedinUrl}` : member.linkedinUrl ?? '',
}));

export const defaultContent: ContentMap = {
  about: {
    whoBody: "Georgia Tech Esports Organization, or GT Esports, is an organization and a community for all gamers, both competitive and casual. We strive to help nurture the growth of both our communities around Georgia Tech. For our competitive players, we help our competitive teams to participate in collegiate leagues. As for our casual community, we actively host social and casual gaming events. Our goal is to help make esports all-inclusive for everyone who'd like to be involved.",
    valuesBody: 'We stand for the expansion and democratization of esports across the world. Georgia Tech is not only a leader and an innovator in collegiate esports competition - we are a hive of innovators creating the next transformative models for the esports space. With a rich history extending to the beginning of commercial gaming, Georgia Tech Esports Organization has long been a driving force in the background of competitive gaming for good, and we strive to carry on that mission.',
    updatesBody: 'Our newsletter signup is currently under maintenance.',
  },
  faq: faqs,
  team: {
    introduction: 'Meet the individuals driving the future of esports and gaming at Georgia Tech.',
    executives: roster('executives', executives),
    departments: Object.entries({ development, creative, events, finance, production }).map(([id, members]) => ({ id, members: roster(id, members) })),
  },
};
