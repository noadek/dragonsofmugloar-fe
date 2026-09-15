import { useState } from 'react';
import { Coins, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGameStore } from '@/providers/game-store-provider';
import { QuestRow } from './quest-row';
import { StatusBar } from './status-bar';
import { ShopSheet } from './shop-sheet';

export function QuestBoard() {
  const [shopOpen, setShopOpen] = useState(false);

  const [solvingAdId, setSolvingAdId] = useState<string | null>(null);

  const quests = useGameStore((s) => s.messages);
  const elapsed = useGameStore((s) => s.turnIndex);
  const loading = useGameStore((s) => s.isFetchingMessages);
  const spendingTurn = useGameStore((s) => s.isSolvingAd || s.isBuyingItem);
  const solveAd = useGameStore((s) => s.solveAd);
  const fetchMessages = useGameStore((s) => s.fetchMessages);

  const live = quests
    .map((q) => ({ quest: q, turnsLeft: q.expiresIn - elapsed }))
    .filter((q) => q.turnsLeft > 0);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-10 bg-background pt-4 sm:pt-6">
        <StatusBar />
      </div>

      <div className="flex-1">
        {loading ? (
          <ul className="mt-1">
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i} className="border-b px-2 py-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </li>
            ))}
          </ul>
        ) : live.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border-b px-2 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Every quest on the board has expired. Refresh to see what&apos;s new.
            </p>
            <Button size="sm" onClick={fetchMessages}>
              <RefreshCw aria-hidden className="size-4" />
              Refresh board
            </Button>
          </div>
        ) : (
          <ul className="mt-1">
            {live.map(({ quest, turnsLeft }) => {
              return (
                <QuestRow
                  key={quest.adId}
                  quest={quest}
                  turnsLeft={turnsLeft}
                  solving={solvingAdId === quest.adId}
                  disabled={solvingAdId !== null}
                  onSolve={async () => {
                    setSolvingAdId(quest.adId);
                    try {
                      await solveAd(quest.adId);
                    } finally {
                      setSolvingAdId(null);
                    }
                  }}
                />
              );
            })}
          </ul>
        )}
      </div>

      <div className="sticky bottom-0 z-10 flex gap-2 border-t bg-background py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          disabled={loading || spendingTurn}
        >
          <RefreshCw aria-hidden className="size-4" />
          Refresh board
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShopOpen(true)}>
          <Coins aria-hidden className="size-4" />
          Shop
        </Button>
      </div>

      <ShopSheet open={shopOpen} onOpenChange={setShopOpen} />
    </div>
  );
}
