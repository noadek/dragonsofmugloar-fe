import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useGameStore } from '@/providers/game-store-provider';

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
}

export function ShopSheet({ open, onOpenChange }: Props) {
  const items = useGameStore((s) => s.shopItems);
  const gold = useGameStore((s) => s.gold);
  const loading = useGameStore((s) => s.isFetchingShopItems);
  const buying = useGameStore((s) => s.isBuyingItem);
  const fetchShopItems = useGameStore((s) => s.fetchShopItems);
  const buyItem = useGameStore((s) => s.buyItem);

  useEffect(() => {
    if (open) fetchShopItems();
  }, [open, fetchShopItems]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Shop</SheetTitle>
          <SheetDescription>
            Every purchase costs a turn, whether or not you can afford it.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-2 text-sm text-muted-foreground">
          You have <span className="tabular-nums text-foreground">{gold}g</span>
        </div>

        {loading ? (
          <ul className="px-4">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="border-b py-3">
                <Skeleton className="h-4 w-2/3" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="overflow-y-auto px-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 border-b py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-sm">{item.name}</p>
                  <p className="text-xs tabular-nums text-muted-foreground">{item.cost}g</p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={buying || item.cost > gold}
                  onClick={() => buyItem(item.id)}
                >
                  Buy
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
