'use client';

import { useContext, useEffect } from 'react';
import { GameStoreContext } from '@/providers/game-store-provider';
import { toast } from '@/components/ui/toast';

export function GameToasts() {
  const store = useContext(GameStoreContext);

  useEffect(() => {
    if (!store) return;

    return store.subscribe((state, prev) => {
      if (state.error && state.error !== prev.error) {
        toast.add({ type: 'error', title: 'Something went wrong', description: state.error });
      }
      if (state.message && state.message !== prev.message) {
        const { success, title, description } = state.message;
        toast.add({ type: success ? 'success' : 'warning', title, description });
      }
    });
  }, [store]);

  return null;
}
