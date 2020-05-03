import { createSelector } from '@ngrx/store';
import { Game, Player } from 'src/app/commons/models/game.model';
import {
  gameWinner,
  getLeftPosition,
  getRightPosition,
  getTeamMatePosition,
  getTeamNumber,
  isGameClosed,
  isGameReady,
  isGameStarted,
} from 'src/app/commons/utils/game.util';

import { selectGameState } from '../reducers';
import { GameState } from '../reducers/game.reducer';

export const getGames = createSelector(
  selectGameState,
  (state: GameState) => state.games
);

export const getGame = createSelector(
  selectGameState,
  (state: GameState) => state.game
);

export const getCurrentPosition = createSelector(
  selectGameState,
  (state: GameState) => state.currentPosition
);

export const getCurrentPlayer = createSelector(
  getGame,
  getCurrentPosition,
  (game: Game, position: number) => new Player(game, position)
)

export const getTeamMatePlayer = createSelector(
  getGame,
  getCurrentPosition,
  (game: Game, position: number) => new Player(game, getTeamMatePosition(position))
)

export const getLeftPlayer = createSelector(
  getGame,
  getCurrentPosition,
  (game: Game, position: number) => new Player(game, getLeftPosition(position))
)

export const getRightPlayer = createSelector(
  getGame,
  getCurrentPosition,
  (game: Game, position: number) => new Player(game, getRightPosition(position))
)

export const getGameStarterPosition = createSelector(
  getGame,
  (game: Game) => game ? game.starter || 1 : null
)

export const getGameStarter = createSelector(
  getGame,
  getGameStarterPosition,
  (game: Game, position: number) => new Player(game, position)
)

export const getGameReady = createSelector(
  getGame,
  (game: Game) => game && isGameReady(game)
);

export const getGameStarted = createSelector(
  getGame,
  (game: Game) => game && isGameStarted(game)
);

export const getGameClosed = createSelector(
  getGame,
  (game: Game) => game && isGameClosed(game)
);

export const getGameWinner = createSelector(
  getGame,
  (game: Game) => gameWinner(game)
);

export const getCurrentTeam = createSelector(
  getCurrentPosition,
  (position: number) => getTeamNumber(position)
);

export const getCurrentScore = createSelector(
  getGame,
  getCurrentTeam,
  (game: Game, team: number) => game ? (team == 1 ? game.scores_1 : game.scores_2) : []
)

export const getOpponentScore = createSelector(
  getGame,
  getCurrentTeam,
  (game: Game, team: number) => game ? (team == 1 ? game.scores_2 : game.scores_1) : []
)

export const getCurrentTakes = createSelector(
  getGame,
  getCurrentTeam,
  (game: Game, team: number) => game ? (team == 1 ? game.take_1 : game.take_2) : []
)

export const getOpponentTakes = createSelector(
  getGame,
  getCurrentTeam,
  (game: Game, team: number) => game ? (team == 1 ? game.take_2 : game.take_1) : []
)

export const getCanForceClose = createSelector(
  getCurrentScore,
  (score: number[]) => score && score.length > 0 && score[score.length - 1] > 30
)

export const getPositionSwitch = createSelector(
  getGame,
  (game: Game) => game ? game.position_switch : null
);
