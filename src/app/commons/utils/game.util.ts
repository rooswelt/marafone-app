import { Md5 } from 'ts-md5/dist/md5';

import { Card, Game, Sign } from '../models/game.model';
import { TeamNumber } from './../models/game.model';

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

export function isGameReady(game: Partial<Game>): boolean {
  return game && game.player_1_name != null && game.player_2_name != null && game.player_3_name != null && game.player_4_name != null;
}

export function isGameStarted(game: Partial<Game>): boolean {
  return game && isGameReady(game) && (!!game.player_1_hand?.length || !!game.player_2_hand?.length || !!game.player_3_hand?.length || !!game.player_4_hand?.length);
}

export function isGameClosed(game: Partial<Game>): boolean {
  return game && isGameReady(game) && (game.force_closed || (!game.player_1_hand?.length && !game.player_2_hand?.length && !game.player_3_hand?.length && !game.player_4_hand?.length));
}

export function getStarter(hand_1: Card[], hand_2: Card[], hand_3: Card[], hand_4: Card[]): number {
  if (hand_1.find((c => c.type == 'D' && c.value == 4)) != null) return 1
  if (hand_2.find((c => c.type == 'D' && c.value == 4)) != null) return 2
  if (hand_3.find((c => c.type == 'D' && c.value == 4)) != null) return 3
  if (hand_4.find((c => c.type == 'D' && c.value == 4)) != null) return 4
}

export function gameWinner(game: Game): TeamNumber {
  if (game) {
    if (game.force_closed) {
      if (game.force_closed_by == 1) return isTeamWinner(1, game) ? 1 : 2;
      if (game.force_closed_by == 2) return isTeamWinner(2, game) ? 2 : 1;
    }
    if (isTeamWinner(1, game)) return 1;
    if (isTeamWinner(2, game)) return 2;
  }
  return null;
}

function isTeamWinner(teamNumber: TeamNumber, game: Game): boolean {
  if (isGameReady(game)) {
    return (game[`scores_${teamNumber}`]?.length && game[`scores_${teamNumber}`][game[`scores_${teamNumber}`]?.length - 1] > 40);
  }
  return false;
}

export function hasCricca(king: Sign, hand: Card[]): boolean {
  return hasCard(hand, king, 1) && hasCard(hand, king, 2) && hasCard(hand, king, 3);
}

export function hasCard(hand: Card[], sign: Sign, value: number): boolean {
  return (hand || []).some(card => card.type == sign && card.value == value);
}

export function getTeamNumber(currentPosition: number): TeamNumber {
  return currentPosition % 2 == 1 ? 1 : 2;
}

export function hashString(value: string): string {
  const md5 = new Md5();
  return md5.appendStr(value).end() as string;
}
