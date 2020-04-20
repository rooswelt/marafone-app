import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Game } from 'src/app/commons/models/game.model';
import { AlertService } from 'src/app/commons/services/alert.service';
import { GameService } from 'src/app/commons/services/game.service';
import { cardEquals, shuffleCards, sortHand } from 'src/app/commons/utils/card.util';
import { getRightPosition, getStarter, hasCricca } from 'src/app/commons/utils/game.util';

import * as GameActions from '../actions/game.actions';
import { AppState } from '../reducers';
import { getCurrentPosition, getCurrentTeam, getGame } from './../selectors/game.selectors';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private store$: Store<AppState>,
    private gameService: GameService,
    private alertService: AlertService,
    private router: Router
  ) { }

  loadGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGame),
      switchMap(({ id }) =>
        this.db.collection<Game>("partite").doc(id).snapshotChanges().pipe(
          map(action => {
            const game = action.payload.data() as Game;
            const id = action.payload.id;
            return { id, ...game };
          })
        )
      ),
      map((game) => GameActions.loadGameCompleted({ game }))
    )
  );

  updateGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.updateGame),
      withLatestFrom(this.store$.pipe(select(getGame), filter(game => !!game), map(game => game.id))),
      switchMap(([{ game }, id]) =>
        this.db.collection<Game>("partite").doc(id).update(game)
      ),
      map(() => GameActions.updateGameCompleted())
    )
  );

  joinGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.joinGame),
      map(({ position, name }) => {
        let newObject = {};
        newObject[`player_${position}_name`] = name;
        return GameActions.updateGame({ game: newObject });
      }),
      tap(() => this.router.navigate(["/home"]))
    )
  );

  rejoinGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.rejoinGame),
      tap(() => this.router.navigate(["/home"]))
    ), { dispatch: false }
  );

  startNewGame = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.startNewGame),
      map(() => GameActions.giveCards({ oldStarter: null }))
    )
  );

  forceClose$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.forceClose),
      map(({ closer }) => {
        let newGame: Partial<Game> = {
          force_closed: true,
          force_closed_by: closer,
          last_take: null
        }
        this.gameService.checkFinish(newGame);
        return GameActions.updateGame({ game: newGame });
      })
    )
  );

  giveCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.giveCards),
      map(({ oldStarter }) => {
        let deck = shuffleCards();

        let newGame: Partial<Game> = {
          player_1_hand: sortHand(deck.splice(0, 10)),
          player_1_card: null,
          player_2_hand: sortHand(deck.splice(0, 10)),
          player_2_card: null,
          player_3_hand: sortHand(deck.splice(0, 10)),
          player_3_card: null,
          player_4_hand: sortHand(deck.splice(0, 10)),
          player_4_card: null,
          turn: null,
          king: null,
          default: null,
          log: null,
          last_take: null,
          force_closed: null,
          force_closed_by: null,
          take_1: null,
          take_2: null
        }

        let newStarter;
        if (oldStarter != null) {
          newStarter = getRightPosition(oldStarter)
        } else {
          newStarter = getStarter(newGame.player_1_hand, newGame.player_2_hand, newGame.player_3_hand, newGame.player_4_hand);
          newGame.scores_1 = [0];
          newGame.scores_2 = [0];
        }
        newGame.turn = newStarter;
        newGame.starter = newStarter;

        return GameActions.updateGame({ game: newGame });
      }),
    )
  );


  setKing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.setKing),
      withLatestFrom(
        this.store$.pipe(select(getGame), filter(game => !!game)),
        this.store$.pipe(select(getCurrentTeam), filter(team => !!team)),
        this.store$.pipe(select(getCurrentPosition), filter(position => !!position))
      ),
      map(([{ king }, game, currentTeam, currentPosition]) => {
        let newGame: Partial<Game> = { king };
        if (hasCricca(king, game[`player_${currentPosition}_hand`])) {
          if (currentTeam == 1) {
            newGame.scores_1 = [...game.scores_1, game.scores_1[game.scores_1.length - 1] + 3];
          } else {
            newGame.scores_2 = [...game.scores_2, game.scores_2[game.scores_2.length - 1] + 3];
          }
        }
        return GameActions.updateGame({ game: newGame });
      }),
    )
  );

  playCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.playCard),
      withLatestFrom(this.store$.pipe(select(getGame), filter(game => !!game))),
      map(([{ playerPosition, card, hint }, game]) => {
        let newGame: Partial<Game> = JSON.parse(JSON.stringify(game));
        if (!game.default) {
          newGame.player_1_card = null;
          newGame.player_2_card = null;
          newGame.player_3_card = null;
          newGame.player_4_card = null;
          newGame.player_1_hint = null;
          newGame.player_2_hint = null;
          newGame.player_3_hint = null;
          newGame.player_4_hint = null;
        }

        newGame[`player_${playerPosition}_card`] = card;
        newGame[`player_${playerPosition}_hint`] = hint;
        newGame[`player_${playerPosition}_hand`] = game[`player_${playerPosition}_hand`].filter(c => !cardEquals(c, card));
        newGame.turn = playerPosition == 4 ? 1 : playerPosition + 1;
        if (!newGame.default) {
          newGame.default = card.type;
        }
        this.gameService.check(newGame);
        return GameActions.updateGame({ game: newGame });
      }),
    )
  );
}
