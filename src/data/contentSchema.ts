export interface AboutContent {
  whoBody: string;
  valuesBody: string;
  updatesBody: string;
}

export interface FAQItem { id: string; question: string; answer: string }
export interface TeamMember {
  id: string; name: string; position: string; image: string; linkedinUrl: string;
}
export const teamDepartments = [
  { id: 'development', title: 'DEVELOPMENT' },
  { id: 'creative', title: 'CREATIVE' },
  { id: 'events', title: 'EVENTS' },
  { id: 'finance', title: 'FINANCE' },
  { id: 'production', title: 'PRODUCTION' },
] as const;
export interface TeamDepartment { id: string; members: TeamMember[] }
export interface TeamContent {
  introduction: string;
  executives: TeamMember[];
  departments: TeamDepartment[];
}
export interface ContentMap { about: AboutContent; faq: FAQItem[]; team: TeamContent }
export type ContentSection = keyof ContentMap;

// Only same-site paths and HTTP(S) links can reach rendered href/src attributes.
export function isSafeUrl(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//') && !/[\\\s]/.test(value)) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); }
  catch { return false; }
}

function object(value: unknown): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid content format.');
}
function text(value: unknown, label: string, optional = false): asserts value is string {
  if (typeof value !== 'string' || (!optional && !value.trim())) throw new Error(`${label} is required.`);
}
function list(value: unknown): asserts value is unknown[] {
  if (!Array.isArray(value)) throw new Error('Invalid list format.');
}
function unique(items: unknown[]) {
  const ids = new Set<string>();
  items.forEach(item => {
    object(item); text(item.id, 'Item ID');
    if (ids.has(item.id)) throw new Error('Duplicate item IDs.');
    ids.add(item.id);
  });
}
function members(value: unknown) {
  list(value); unique(value);
  value.forEach(member => {
    object(member); text(member.name, 'Member name'); text(member.position, 'Member role');
    for (const key of ['image', 'linkedinUrl']) {
      const value = member[key];
      text(value, key, true);
      if (value && !isSafeUrl(value)) throw new Error('Use a full HTTP(S) URL or a site path for images and links.');
    }
  });
}
export function validateContent<K extends ContentSection>(section: K, value: unknown): asserts value is ContentMap[K] {
  if (section === 'faq') {
    list(value); unique(value);
    value.forEach(item => { object(item); text(item.question, 'Question'); text(item.answer, 'Answer'); });
    return;
  }
  object(value);
  if (section === 'about') {
    for (const key of ['whoBody', 'valuesBody', 'updatesBody']) text(value[key], key);
  } else {
    text(value.introduction, 'Team introduction');
    members(value.executives);
    const departments = value.departments;
    list(departments); unique(departments);
    if (departments.length !== teamDepartments.length || teamDepartments.some(({ id }) => !departments.some(department => {
      object(department); return department.id === id;
    }))) throw new Error('Team departments must match the sections defined in code.');
    departments.forEach(department => { object(department); members(department.members); });
  }
}
