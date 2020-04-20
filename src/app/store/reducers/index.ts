import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';

import * as fromGame from './game.reducer';

// import { localStorageSync } from 'ngrx-store-localstorage';

export interface AppState {
  currentGame: fromGame.GameState;

}

export const reducers: ActionReducerMap<AppState> = {
  currentGame: fromGame.reducer
};

// export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
//   return localStorageSync({ keys: [{ auth: ['token'] }], rehydrate: true })(reducer);
// }
// export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, fromAuth.clearState];
export const metaReducers: Array<MetaReducer<any, any>> = [];

export const selectGameState = createFeatureSelector<AppState, fromGame.GameState>('currentGame');
