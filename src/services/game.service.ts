import type {
  GameResponse,
  Message,
  SolveAdResponse,
  ShopItem,
  PurchaseResponse,
} from './game.type';

const API_URL = 'https://dragonsofmugloar.com/api/v2';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    statusText: string,
  ) {
    super(`Request failed: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

const request = async <T>(
  path: string,
  init?: RequestInit,
): Promise<{ status: number; result: T }> => {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }
  return { status: response.status, result: (await response.json()) as T };
};

export const startGame = () => request<GameResponse>('/game/start', { method: 'POST' });

export const fetchMessages = (gameId: string) => request<Message[]>(`/${gameId}/messages`);

export const solveAd = (gameId: string, adId: string) =>
  request<SolveAdResponse>(`/${gameId}/solve/${adId}`, { method: 'POST' });

export const fetchShopItems = (gameId: string) => request<ShopItem[]>(`/${gameId}/shop`);

export const buyShopItem = (gameId: string, itemId: string) =>
  request<PurchaseResponse>(`/${gameId}/shop/buy/${itemId}`, { method: 'POST' });
