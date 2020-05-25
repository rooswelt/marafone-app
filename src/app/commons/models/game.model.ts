export type Sign = "D" | "B" | "C" | "S";
export type Hint = "Striscio" | "Busso" | "Volo";
export type TeamNumber = 1 | 2;

export interface Card {
  value: number,
  type: Sign
}

export type NewGame = Pick<Game, "name" | "password" | "public" | "empty_seats">

export interface Game {
  id: string,
  name: string,
  password?: string,
  public?: boolean,
  player_1_hand: Card[]
  player_1_name: string;
  player_2_hand: Card[]
  player_2_name: string;
  player_3_hand: Card[]
  player_3_name: string;
  player_4_hand: Card[]
  player_4_name: string;
  scores_1: number[];
  scores_2: number[];
  starter: number;
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
  last_take: TeamNumber;
  force_closed: boolean;
  force_closed_by: TeamNumber;
  position_switch: PositionSwitch,
  log: {
    default: Sign;
    player_1_card: Card;
    player_2_card: Card;
    player_3_card: Card;
    player_4_card: Card;
  }[];
  empty_seats: number
}

export interface PositionSwitch {
  force: boolean;
  from: number;
  from_name: string;
  to: number;
  to_name: string;
  accepted: boolean;
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
