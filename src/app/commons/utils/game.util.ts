import { Card, Game, Sign } from '../models/game.model';

export function getTeamMatePosition(currentPlayer: number): number {
  return ((currentPlayer + 2) % 4) || 4;
}

export function getLeftPosition(currentPlayer: number): number {
  return ((currentPlayer + 3) % 4) || 4;
}

export function getRightPosition(currentPlayer: number): number {
  return ((currentPlayer + 1) % 4) || 4;
}

export function getTeamMateName(game: Game, currentPlayer: number): string {
  return game ? game[`player_${getTeamMatePosition(currentPlayer)}_name`] : "";
}

export function isGameClosed(game: Game): boolean {
  return game && !game.player_1_hand.length && !game.player_2_hand.length && !game.player_3_hand.length && !game.player_4_hand.length;
}

export function getStarter(hand_1: Card[], hand_2: Card[], hand_3: Card[], hand_4: Card[]): number {
  if (hand_1.find((c => c.type == 'D' && c.value == 4)) != null) return 1
  if (hand_2.find((c => c.type == 'D' && c.value == 4)) != null) return 2
  if (hand_3.find((c => c.type == 'D' && c.value == 4)) != null) return 3
  if (hand_4.find((c => c.type == 'D' && c.value == 4)) != null) return 4
}

export function getGameWinner(game: Game): number {
  if (game) {
    if (game.scores_1.length > 0 && game.scores_1[game.scores_1.length - 1] > 40) return 1;
    if (game.scores_2.length > 0 && game.scores_2[game.scores_2.length - 1] > 40) return 2;
  }
  return 0;
}

export function hasCricca(king: Sign, hand: Card[]): boolean {
  return hasCard(hand, king, 1) && hasCard(hand, king, 2) && hasCard(hand, king, 3);
}

export function hasCard(hand: Card[], sign: Sign, value: number): boolean {
  return (hand || []).some(card => card.type == sign && card.value == value);
}

export function getTeamNumber(currentPosition: number): number {
  return currentPosition % 2 == 1 ? 1 : 2;
}
