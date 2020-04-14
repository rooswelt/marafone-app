export type Sign = "D" | "B" | "C" | "S";
export type Hint = "Striscio" | "Busso" | "Volo";

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
  player_1_hint: Hint;
  player_2_hint: Hint;
  player_3_hint: Hint;
  player_4_hint: Hint;
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

export class Player {

  constructor(private game: Game, public position: number) { }

  get name(): string {
    return this.game ? this.game[`player_${this.position}_name`] : null;
  }

  get card(): Card {
    return this.game ? this.game[`player_${this.position}_card`] : null;
  }

  get hand(): Card[] {
    return this.game ? this.game[`player_${this.position}_hand`] : null;
  }

  get hint(): Hint {
    return this.game ? this.game[`player_${this.position}_hint`] : null;
  }

  get active(): boolean {
    return this.game ? this.game.turn == this.position : false;
  }
}
