import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/providers/game-store-provider';
import { useShallow } from 'zustand/react/shallow';

const MAX_HEART_ICONS = 5;

const compactNumber = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function Lives({ lives }: { lives: number }) {
  const shown = Math.max(lives, 0);

  if (shown > MAX_HEART_ICONS) {
    return (
      <div className="flex items-center gap-1" aria-label={`${shown} lives`}>
        <Heart aria-hidden className="size-4 fill-rose-600 text-rose-600" />
        <span aria-hidden className="text-sm tabular-nums">
          ×{shown}
        </span>
      </div>
    );
  }

  const slots = Math.max(shown, 3);
  return (
    <div className="flex items-center gap-1" aria-label={`${shown} lives`}>
      {Array.from({ length: slots }, (_, i) => (
        <Heart
          key={i}
          aria-hidden
          className={cn(
            'size-4',
            i < shown ? 'fill-rose-600 text-rose-600' : 'text-muted-foreground/40',
          )}
        />
      ))}
    </div>
  );
}

function Stat({ label, shortLabel, value }: { label: string; shortLabel?: string; value: number }) {
  return (
    <div className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
      <span className="truncate text-[11px] text-muted-foreground sm:text-xs">
        {shortLabel ? (
          <>
            <span className="sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{label}</span>
          </>
        ) : (
          label
        )}
      </span>
      <span className="truncate text-sm tabular-nums sm:text-[15px]" title={String(value)}>
        {value >= 10_000 ? compactNumber.format(value) : value}
      </span>
    </div>
  );
}

export function StatusBar() {
  const { lives, gold, score, level, turn, turnIndex } = useGameStore(
    useShallow(({ lives, gold, score, level, turn, turnIndex }) => ({
      lives,
      gold,
      score,
      level,
      turn,
      turnIndex,
    })),
  );

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b pb-3">
      <Lives lives={lives} />
      <div className="grid w-full grid-cols-5 gap-x-2 sm:ml-auto sm:flex sm:w-auto sm:gap-4">
        <Stat label="gold" value={gold} />
        <Stat label="score" value={score} />
        <Stat label="level" value={level} />
        <Stat label="total turns" shortLabel="turns" value={turn} />
        <Stat label="turn" value={turnIndex} />
      </div>
    </div>
  );
}
