import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { AuthActions } from '@xtream/firebase-ngrx-user-management';

import * as fromGame from './game.reducer';

// import { localStorageSync } from 'ngrx-store-localstorage';

export interface AppState {
  router: fromRouter.RouterReducerState<any>,
  currentGame: fromGame.GameState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  currentGame: fromGame.reducer
};

// export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
//   return localStorageSync({ keys: [{ auth: ['token'] }], rehydrate: true })(reducer);
// }
// export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, fromAuth.clearState];
export const metaReducers: MetaReducer<AppState>[] = [clearState];

export const selectGameState = createFeatureSelector<AppState, fromGame.GameState>('currentGame');
export const selectRouter = createFeatureSelector<AppState, fromRouter.RouterReducerState<any>>('router');

export function clearState(reducer) {
  return (state, action) => {
    if (action.type === AuthActions.AuthActionTypes.NotAuthenticated) {
      state = undefined;
    }

    return reducer(state, action);
  };
}
