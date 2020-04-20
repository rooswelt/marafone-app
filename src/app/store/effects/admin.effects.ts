import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { GameService } from 'src/app/commons/services/game.service';

import * as AdminActions from '../actions/admin.actions';
import * as GameActions from '../actions/game.actions';
import { AppState } from '../reducers';
import { getGame } from './../selectors/game.selectors';

@Injectable()
export class AdminEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private gameService: GameService,
  ) { }

  checkCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.checkCards),
      withLatestFrom(this.store$.pipe(select(getGame), filter(game => !!game))),
      map(([_, game]) => {
        this.gameService.check(game);
        return GameActions.updateGame({ game });
      }),
    )
  );
}
