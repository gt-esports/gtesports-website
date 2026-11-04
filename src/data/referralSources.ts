export const referralSources = [
  ['georgia_tech_newsletter', 'Georgia Tech newsletter'],
  ['gt_esports_alumni', 'GT Esports alumni'],
  ['gt_esports_member', 'GT Esports staff or member'],
  ['gt_esports_event', 'A GT Esports event (GameFest, Hackathon, etc.)'],
  ['social_media', 'Social media'],
  ['friend', 'Friend or classmate'],
  ['other', 'Other'],
] as const;

export type ReferralSource = typeof referralSources[number][0];