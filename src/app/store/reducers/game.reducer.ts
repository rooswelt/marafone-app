import { Action, createReducer, on } from '@ngrx/store';
import { Game } from 'src/app/commons/models/game.model';

import * as GameActions from '../actions/game.actions';

export interface GameState {
  game: Game;
  currentPosition: number;
};

const initialState: GameState = {
  game: null,
  currentPosition: null
};

const gameReduce = createReducer(
  initialState,
  on(GameActions.loadGameCompleted, (state, { game }) => {
    return { ...state, game };
  }),
  on(GameActions.joinGame, (state, { position }) => {
    return { ...state, currentPosition: position };
  }),
  on(GameActions.rejoinGame, (state, { position }) => {
    return { ...state, currentPosition: position };
  }),
);

export function reducer(state: GameState | undefined, action: Action) {
  return gameReduce(state, action);
}

