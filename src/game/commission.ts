export type CommissionType = 'writing' | 'programming' | 'art';

export interface Commission {
  id: string;
  type: CommissionType;
  description: string;
  reward: number;
  timeLimit: number;   // ms remaining; only decrements while on the board
  difficulty: number;  // hidden effort points
}

const TYPES: CommissionType[] = ['writing', 'programming', 'art'];

const POOLS: Record<CommissionType, string[]> = {
  writing: [
    'blog post', 'short story', 'product description', 'email newsletter',
    'technical documentation', 'cover letter', 'press release', 'social media campaign',
    'screenplay excerpt', 'poem series', 'FAQ page', 'user manual',
    'case study', 'white paper', 'marketing copy', 'keynote speech',
    'magazine article', 'company biography', 'travel guide', 'grant proposal',
    'annual report', 'onboarding guide',
  ],
  programming: [
    'REST API', 'data pipeline', 'authentication system', 'web scraper',
    'CLI tool', 'database schema', 'unit test suite', 'component library',
    'browser extension', 'Discord bot', 'CSV parser', 'rate limiter',
    'caching layer', 'webhook handler', 'PDF generator', 'image resizer',
    'search indexer', 'email templater', 'OAuth integration', 'notification service',
    'file uploader', 'analytics dashboard',
  ],
  art: [
    'logo design', 'icon set', 'UI mockup', 'banner illustration',
    'character concept', 'infographic', 'product mockup', 'social media kit',
    'photo edit batch', 'typography layout', 'poster design', 'album cover',
    'book cover', 'brand guidelines', 'pattern design', 'motion storyboard',
    'map illustration', 'data visualisation', 'app icon suite', 'landing page design',
    'colour palette', 'style guide',
  ],
};

const TEMPLATES: Record<CommissionType, Array<(item: string) => string>> = {
  writing: [
    (item) => `Write a ${item} for a tech startup`,
    (item) => `Draft a ${item} for an AI company`,
    (item) => `Produce a ${item} for a B2B SaaS brand`,
  ],
  programming: [
    (item) => `Build a ${item} in TypeScript`,
    (item) => `Implement a ${item} for a cloud platform`,
    (item) => `Develop a production-ready ${item}`,
  ],
  art: [
    (item) => `Design a ${item} for a SaaS product`,
    (item) => `Create a ${item} for a fintech brand`,
    (item) => `Produce a ${item} for a developer tool`,
  ],
};

interface TierConfig {
  difficulty: number;
  rewardMin: number;
  rewardMax: number;
  timeLimitMs: number;
}

const TIERS: TierConfig[] = [
  { difficulty: 50,  rewardMin: 5,  rewardMax: 15,  timeLimitMs: 3 * 60_000 },
  { difficulty: 150, rewardMin: 20, rewardMax: 50,  timeLimitMs: 5 * 60_000 },
  { difficulty: 400, rewardMin: 60, rewardMax: 120, timeLimitMs: 8 * 60_000 },
];

let nextId = 1;

export function generateCommission(
  type?: CommissionType,
  rng: () => number = Math.random,
): Commission {
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];

  const resolvedType = type ?? pick(TYPES);
  const pool = POOLS[resolvedType];
  const templates = TEMPLATES[resolvedType];
  const tier = pick(TIERS);

  const item = pick(pool);
  const template = pick(templates);
  const description = template(item);
  const reward = tier.rewardMin + rng() * (tier.rewardMax - tier.rewardMin);

  return {
    id: `c-${nextId++}`,
    type: resolvedType,
    description,
    reward: Math.round(reward * 100) / 100,
    timeLimit: tier.timeLimitMs,
    difficulty: tier.difficulty,
  };
}

export const TYPE_LABELS: Record<CommissionType, string> = {
  writing: 'write',
  programming: 'code',
  art: 'art',
};

export const TYPE_COLORS: Record<CommissionType, string> = {
  writing: 'yellow',
  programming: 'cyan',
  art: 'magenta',
};
