'use client';

import { Button } from '@/components/ui/button';
import { useGameStore } from '@/providers/game-store-provider';

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const starting = useGameStore((s) => s.isStartingGame);
  const highScore = useGameStore((s) => s.highScore);

  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <h1 className="font-serif text-3xl">Dragons of Mugloar</h1>
      <p className="max-w-sm font-serif text-sm text-muted-foreground">
        Take what the board offers. The safe work pays little, the reckless work pays well, and both
        cost a turn.
      </p>
      <Button onClick={startGame} disabled={starting}>
        {starting ? 'Starting…' : 'Start game'}
      </Button>
      {highScore > 0 && (
        <p className="text-xs tabular-nums text-muted-foreground">Best so far: {highScore}</p>
      )}
    </div>
  );
}
