import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { riskTier, TIER_BADGE } from '@/lib/probability';

export function ProbabilityBadge({ probability }: { probability: string }) {
  const tier = riskTier(probability);
  return (
    <Badge variant="outline" className={cn('font-normal', TIER_BADGE[tier])}>
      {probability}
    </Badge>
  );
}
