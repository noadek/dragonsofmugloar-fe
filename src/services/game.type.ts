export type GameResponse = {
  gameId: string;
  level: number;
  highScore: number;
  turn: number;
  score: number;
  gold: number;
  lives: number;
};

export type Message = {
  adId: string;
  message: string;
  reward: string;
  expiresIn: number;
  encrypted: number | null;
  probability: string;
};

export type SolveAdResponse = {
  success: boolean;
  lives: number;
  gold: number;
  score: number;
  highScore: number;
  turn: number;
  message: string;
};

export type ShopItem = {
  id: string;
  name: string;
  cost: number;
};

export type PurchaseResponse = {
  shoppingSuccess: boolean;
  gold: number;
  lives: number;
  level: number;
  turn: number;
};
