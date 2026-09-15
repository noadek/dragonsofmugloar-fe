export type RiskTier = 'safe' | 'medium' | 'uncertain' | 'dangerous';

const TIERS: Record<string, RiskTier> = {
  'sure thing': 'safe',
  'piece of cake': 'safe',
  'walk in the park': 'medium',
  'quite likely': 'medium',
  'hmmm....': 'uncertain',
  gamble: 'uncertain',
  risky: 'uncertain',
  'rather detrimental': 'dangerous',
  'playing with fire': 'dangerous',
  'suicide mission': 'dangerous',
  impossible: 'dangerous',
};

export function riskTier(probability: string): RiskTier {
  const key = probability.trim().toLowerCase();
  if (import.meta.env.DEV && !(key in TIERS)) {
    console.warn('[mugloar] unmapped probability:', probability);
  }
  return TIERS[key] ?? 'uncertain';
}

export const TIER_BADGE: Record<RiskTier, string> = {
  safe: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  medium: 'border-transparent bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300',
  uncertain:
    'border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300',
  dangerous: 'bg-transparent border-rose-300 text-rose-700 dark:border-rose-900 dark:text-rose-400',
};
