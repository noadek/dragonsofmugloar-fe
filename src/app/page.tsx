'use client';

import { cn } from '@/lib/utils';
import { useGameStore } from '@/providers/game-store-provider';
import { selectIsPlaying, selectIsGameOver } from '@/stores/game-store';
import { Toaster } from '@/components/ui/toast';
import { GameToasts } from '@/components/game-toasts';
import { QuestBoard } from '@/components/quest-board';
import { StartScreen } from '@/components/start-screen';
import { GameOverDialog } from '@/components/gameover-dialog';

export default function Home() {
  const isPlaying = useGameStore(selectIsPlaying);
  const gameOver = useGameStore(selectIsGameOver);

  return (
    <main className={cn('mx-auto w-full max-w-2xl px-4', !isPlaying && 'py-10')}>
      {isPlaying ? <QuestBoard /> : <StartScreen />}
      {gameOver && <GameOverDialog />}
      <GameToasts />
      <Toaster />
    </main>
  );
}
