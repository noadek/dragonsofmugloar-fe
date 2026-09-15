'use client';

import { type ReactNode, createContext, useState, useContext } from 'react';
import { useStore } from 'zustand';
import { type GameStore, createGameStore } from '@/stores/game-store';

export type GameStoreApi = ReturnType<typeof createGameStore>;

export const GameStoreContext = createContext<GameStoreApi | undefined>(undefined);

export interface GameStoreProviderProps {
  children: ReactNode;
}

export const GameStoreProvider = ({ children }: GameStoreProviderProps) => {
  const [store] = useState(() => createGameStore());
  return <GameStoreContext.Provider value={store}>{children}</GameStoreContext.Provider>;
};

export const useGameStore = <T,>(selector: (store: GameStore) => T): T => {
  const gameStoreContext = useContext(GameStoreContext);
  if (!gameStoreContext) {
    throw new Error(`useGameStore must be used within GameStoreProvider`);
  }

  return useStore(gameStoreContext, selector);
};
