export type Sign = "D" | "B" | "C" | "S";

export interface Card {
  value: number,
  type: Sign
}

export interface Game {
  player_1_hand: Card[]
  player_1_name: string;
  player_2_hand: Card[]
  player_2_name: string;
  player_3_hand: Card[]
  player_3_name: string;
  player_4_hand: Card[]
  player_4_name: string;
  score_1: number;
  score_2: number;
  player_1_card: Card;
  player_2_card: Card;
  player_3_card: Card;
  player_4_card: Card;
  take_1: Card[];
  take_2: Card[];
  turn: number;
  king: Sign;
  default: Sign;
  last_take: "1" | "2";
  log: {
    default: Sign;
    player_1_card: Card;
    player_2_card: Card;
    player_3_card: Card;
    player_4_card: Card;
  }[];
}

export interface Table {
  default: Sign;
  player_1_card: Card;
  player_2_card: Card;
  player_3_card: Card;
  player_4_card: Card;
}
