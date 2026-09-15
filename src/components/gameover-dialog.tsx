'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGameStore } from '@/providers/game-store-provider';

export function GameOverDialog() {
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const startGame = useGameStore((s) => s.startGame);
  const starting = useGameStore((s) => s.isStartingGame);
  const resetGame = useGameStore((s) => s.resetGame);

  const outcome =
    score > 0 && score >= highScore
      ? ' — a new best.'
      : highScore > 0
        ? ', short of your best of ' + highScore + '.'
        : '.';

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="font-serif">Out of lives</DialogTitle>
          <DialogDescription>
            You scored <span className="tabular-nums">{score}</span>
            {outcome}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button onClick={startGame} disabled={starting}>
            {starting ? 'Starting…' : 'Play again'}
          </Button>
          <Button variant="ghost" onClick={resetGame} disabled={starting}>
            Back to start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
