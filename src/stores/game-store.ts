import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import * as gameService from '@/services/game.service';
import type { Message, ShopItem } from '@/services/game.type';
import { decodeMessages } from '@/lib/decoder';

export type GameMessage = {
  success: boolean;
  title: string;
  description?: string;
};

export type GameState = {
  gameId: string | null;
  lives: number;
  gold: number;
  level: number;
  score: number;
  highScore: number;
  turn: number;
  turnIndex: number;
  message: GameMessage | null;
  error: string | null;
  messages: Message[];
  shopItems: ShopItem[];
  isStartingGame: boolean;
  isFetchingMessages: boolean;
  isSolvingAd: boolean;
  isFetchingShopItems: boolean;
  isBuyingItem: boolean;
};

export type GameActions = {
  startGame: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  solveAd: (adId: string) => Promise<void>;
  fetchShopItems: () => Promise<void>;
  buyItem: (itemId: string) => Promise<void>;
  incrementTurnIndex: () => void;
  resetTurnIndex: () => void;
  resetGame: () => void;
};

export type GameStore = GameState & GameActions;

export const defaultInitState: GameState = {
  gameId: null,
  lives: 0,
  gold: 0,
  level: 0,
  score: 0,
  highScore: 0,
  turn: 0,
  turnIndex: 0,
  message: null,
  error: null,

  messages: [],
  shopItems: [],

  isStartingGame: false,
  isFetchingMessages: false,
  isSolvingAd: false,
  isFetchingShopItems: false,
  isBuyingItem: false,
};

const isGameNotFound = (error: unknown) =>
  error instanceof gameService.ApiError && error.status === 404;

const toErrorMessage = (error: unknown) => {
  if (isGameNotFound(error)) return 'Your game could not be found. Start a new one.';
  if (error instanceof gameService.ApiError) {
    return 'The server rejected that request. Please try again.';
  }
  return error instanceof Error ? error.message : String(error);
};

export const createGameStore = (initState: GameState = defaultInitState) => {
  return createStore<GameStore>()(
    devtools(
      (set, get) => ({
        ...initState,

        startGame: async () => {
          if (get().isStartingGame) return;

          set({ isStartingGame: true, error: null }, false, 'game/startGame/start');

          try {
            const { result: game } = await gameService.startGame();
            set(
              { ...game, messages: [], shopItems: [], message: null },
              false,
              'game/startGame/success',
            );
            await get().fetchMessages();
          } catch (error) {
            console.error('Failed to start game:', error);
            set({ error: toErrorMessage(error) }, false, 'game/startGame/error');
          } finally {
            set({ isStartingGame: false }, false, 'game/startGame/finally');
          }
        },

        incrementTurnIndex: () => {
          set((state) => ({ turnIndex: state.turnIndex + 1 }), false, 'game/incrementTurnIndex');
        },

        resetTurnIndex: () => {
          set({ turnIndex: 0 }, false, 'game/resetTurnIndex');
        },

        resetGame: () => {
          set(
            (state) => ({ ...defaultInitState, highScore: state.highScore }),
            false,
            'game/resetGame',
          );
        },

        fetchMessages: async () => {
          // A refresh that overlaps a solve or purchase would reset turnIndex before that turn is counted.
          if (get().isFetchingMessages || get().isSolvingAd || get().isBuyingItem) return;

          set({ isFetchingMessages: true, error: null }, false, 'game/fetchMessages/start');

          try {
            const gameId = get().gameId;

            if (!gameId) {
              throw new Error('No active game');
            }
            const { result, status } = await gameService.fetchMessages(gameId);
            if (status === 304) {
              return;
            }
            get().resetTurnIndex();
            const messages = result.map((message) => decodeMessages(message));
            set({ messages }, false, 'game/fetchMessages/success');
          } catch (error) {
            console.error('Failed to fetch messages:', error);
            if (isGameNotFound(error)) get().resetGame();
            set({ error: toErrorMessage(error) }, false, 'game/fetchMessages/error');
          } finally {
            set({ isFetchingMessages: false }, false, 'game/fetchMessages/finally');
          }
        },

        solveAd: async (adId: string) => {
          if (get().isSolvingAd) return;

          set({ isSolvingAd: true, error: null }, false, 'game/solveAd/start');

          try {
            const gameId = get().gameId;

            if (!gameId) {
              throw new Error('No active game');
            }
            const {
              result: { success, lives, gold, score, highScore, turn, message },
            } = await gameService.solveAd(gameId, adId);
            set(
              (state) => ({
                lives,
                gold,
                score,
                highScore,
                turn,
                message: {
                  success,
                  title: success ? 'Quest succeeded' : 'Quest failed',
                  description: message,
                },
                messages: state.messages.filter((msg) => msg.adId !== adId),
              }),
              false,
              'game/solveAd/success',
            );
            get().incrementTurnIndex();
          } catch (error) {
            console.error('Failed to solve ad:', error);
            if (isGameNotFound(error)) get().resetGame();
            set({ error: toErrorMessage(error) }, false, 'game/solveAd/error');
          } finally {
            set({ isSolvingAd: false }, false, 'game/solveAd/finally');
          }
        },

        fetchShopItems: async () => {
          if (get().isFetchingShopItems) return;

          set({ isFetchingShopItems: true, error: null }, false, 'game/fetchShopItems/start');

          try {
            const gameId = get().gameId;

            if (!gameId) {
              throw new Error('No active game');
            }
            const { result: shopItems } = await gameService.fetchShopItems(gameId);
            set({ shopItems }, false, 'game/fetchShopItems/success');
          } catch (error) {
            console.error('Failed to fetch shop items:', error);
            if (isGameNotFound(error)) get().resetGame();
            set({ error: toErrorMessage(error) }, false, 'game/fetchShopItems/error');
          } finally {
            set({ isFetchingShopItems: false }, false, 'game/fetchShopItems/finally');
          }
        },

        buyItem: async (itemId: string) => {
          if (get().isBuyingItem) return;

          set({ isBuyingItem: true, error: null }, false, 'game/buyItem/start');

          try {
            const gameId = get().gameId;

            if (!gameId) {
              throw new Error('No active game');
            }
            const {
              result: { shoppingSuccess, gold, lives, level, turn },
            } = await gameService.buyShopItem(gameId, itemId);
            set(
              {
                gold,
                lives,
                level,
                turn,
                message: {
                  success: shoppingSuccess,
                  title: shoppingSuccess ? 'Purchase successful' : 'Purchase failed',
                },
              },
              false,
              'game/buyItem/success',
            );
            get().incrementTurnIndex();
          } catch (error) {
            console.error('Failed to buy item:', error);
            if (isGameNotFound(error)) get().resetGame();
            set({ error: toErrorMessage(error) }, false, 'game/buyItem/error');
          } finally {
            set({ isBuyingItem: false }, false, 'game/buyItem/finally');
          }
        },
      }),
      { name: 'dragons-of-mugloar', enabled: process.env.NODE_ENV !== 'production' },
    ),
  );
};

export const selectIsPlaying = (s: GameState): boolean => Boolean(s.gameId);

export const selectIsGameOver = (s: GameState): boolean => Boolean(s.gameId) && s.lives < 1;
