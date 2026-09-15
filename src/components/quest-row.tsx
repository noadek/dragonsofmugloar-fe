import { LockOpen, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProbabilityBadge } from './probability-badge';
import { Message } from '@/services/game.type';

interface Props {
  quest: Message;
  turnsLeft: number;
  solving: boolean;
  disabled: boolean;
  onSolve(): void;
}

const isPossibleTrap = (message: string) => /super awesome diamond/i.test(message);

export function QuestRow({ quest, turnsLeft, solving, disabled, onSolve }: Props) {
  const expiring = turnsLeft <= 1;
  const possibleTrap = isPossibleTrap(quest.message);

  return (
    <li
      className={cn(
        'flex items-center gap-3 border-b px-2 py-3 transition-colors',
        expiring && 'bg-rose-50 dark:bg-rose-950/30',
        solving && 'opacity-55',
      )}
    >
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'font-serif text-sm wrap-break-word',
            expiring && 'text-rose-700 dark:text-rose-400',
          )}
        >
          {quest.message}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <ProbabilityBadge probability={quest.probability} />
          {possibleTrap && (
            <Badge
              variant="destructive"
              title="Quests offering a super awesome diamond are often traps"
            >
              <TriangleAlert aria-hidden />
              Possible trap
            </Badge>
          )}
          <span
            className={cn(
              'text-xs tabular-nums text-muted-foreground',
              expiring && 'text-rose-700 dark:text-rose-400',
            )}
          >
            {expiring ? 'expires this turn' : turnsLeft + ' turns left'}
          </span>
          {quest.encrypted !== null && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
              <LockOpen aria-hidden className="size-3" />
              decoded
            </span>
          )}
        </div>
      </div>

      <span
        className={cn(
          'shrink-0 text-[15px] tabular-nums',
          expiring && 'text-rose-700 dark:text-rose-400',
        )}
      >
        {quest.reward}g
      </span>

      <Button size="sm" variant="outline" onClick={onSolve} disabled={disabled}>
        {solving ? 'Solving…' : 'Solve'}
      </Button>
    </li>
  );
}
