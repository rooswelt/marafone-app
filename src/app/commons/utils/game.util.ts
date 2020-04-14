import { Game } from '../models/game.model';

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
