import { Action, createReducer, on } from '@ngrx/store';
import { Game } from 'src/app/commons/models/game.model';

import * as GameActions from '../actions/game.actions';

export interface GameState {
  games: Game[],
  game: Game;
  currentPosition: number;
};

const initialState: GameState = {
  games: null,
  game: null,
  currentPosition: null
};

const gameReduce = createReducer(
  initialState,
  on(GameActions.loadGameCompleted, (state, { game }) => {
    return { ...state, game };
  }),
  on(GameActions.unselectGame, (state, { }) => {
    return { ...state, game: null };
  }),
  on(GameActions.joinGame, (state, { position }) => {
    return { ...state, currentPosition: position };
  }),
  on(GameActions.rejoinGame, (state, { position }) => {
    return { ...state, currentPosition: position };
  }),
  on(GameActions.changeSeatCompleted, (state, { currentPosition }) => {
    return { ...state, currentPosition };
  }),
  on(GameActions.loadGamesCompleted, (state, { games }) => {
    return { ...state, games };
  }),
);

export function reducer(state: GameState | undefined, action: Action) {
  return gameReduce(state, action);
}

