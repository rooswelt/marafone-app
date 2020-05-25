import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { from, of } from 'firebase-ngrx-user-management/node_modules/rxjs';
import { filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Game, NewGame } from 'src/app/commons/models/game.model';
import { GameService } from 'src/app/commons/services/game.service';
import { cardEquals, shuffleCards, sortHand } from 'src/app/commons/utils/card.util';
import { getRightPosition, getStarter, hasCricca, hashString } from 'src/app/commons/utils/game.util';
import { ChangeSeatComponent } from 'src/app/dashboard/home/change-seat/change-seat.component';

import * as GameActions from '../actions/game.actions';
import { AppState } from '../reducers';
import { AlertService } from './../../commons/services/alert.service';
import { PasswordDialogComponent } from './../../shared/components/password-dialog/password-dialog.component';
import {
  getCurrentPlayer,
  getCurrentPosition,
  getCurrentTeam,
  getGame,
  getOthePlayers,
  getPositionSwitch,
} from './../selectors/game.selectors';


@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private db: AngularFirestore,
    private store$: Store<AppState>,
    private gameService: GameService,
    private alertService: AlertService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGames),
      switchMap(() =>
        this.db.collection<Game>("partite").get().pipe(
          take(1),
          map(docs => {
            const games: Game[] = [];
            docs.forEach(doc => {
              const game = doc.data() as Game;
              const id = doc.id;
              games.push({ id, ...game })
            })
            return games;
          })
        )
      ),
      map((games) => GameActions.loadGamesCompleted({ games }))
    )
  );

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

  createGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createGame),
      map(({ newGame }) => {
        return { ...newGame, password: hashString(newGame.password) }
      }),
      switchMap((newGame) => from(this.db.collection<NewGame>("partite").add(newGame))),
      switchMap(ref => from(ref.get())),
      map(doc => {
        const game = doc.data() as Game;
        const id = doc.id;
        return { id, ...game };
      }),
      map((game) => GameActions.createGameCompleted({ game }))
    )
  );

  createGameCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createGameCompleted),
      tap(({ game }) => this.alertService.showConfirmMessage(`Tavolo ${game.name} creato`)),
      tap(() => this.router.navigate(['/join'])),
      map(({ game }) => GameActions.loadGameCompleted({ game }))
    )
  )

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
      withLatestFrom(this.store$.pipe(select(getGame), filter(game => !!game), map(game => game.empty_seats))),
      map(([{ position, name, password, change }, empty_seats]) => {
        let newGame: Partial<Game> = {};
        newGame[`player_${position}_name`] = name;
        newGame[`player_${position}_password`] = change ? password : hashString(password);
        newGame.position_switch = null;
        if (!change) {
          newGame.empty_seats = empty_seats - 1 | 0;
        }
        return GameActions.updateGame({ game: newGame });
      }),
      tap(() => this.router.navigate(["/home"]))
    )
  );

  tryRejoin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.tryRejoinGame),
      withLatestFrom(this.store$.pipe(select(getGame), filter(game => !!game))),
      switchMap(([{ position }, game]) => {
        const password = game[`player_${position}_password`];
        if (!password) return of(GameActions.rejoinGame({ position }));
        return this.dialog.open(PasswordDialogComponent).afterClosed().pipe(
          map(guess => {
            if (guess) {
              if (hashString(guess) == password) {
                return GameActions.rejoinGame({ position });
              } else {
                return GameActions.rejoinGameFailed();
              }
            } else {
              return GameActions.rejoinGameCancelled();
            }
          })
        )
      }))
  );

  rejoinGameFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.rejoinGameFailed),
      tap(() => this.alertService.showErrorMessage('Impossibile proseguire', 'Password non valida'))
    ), { dispatch: false }
  );

  rejoinGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.rejoinGame),
      tap(() => this.router.navigate(["/home"]))
    ), { dispatch: false }
  );

  changeSeat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.changeSeat),
      withLatestFrom(
        this.store$.pipe(select(getGame), filter(game => !!game)),
        this.store$.pipe(select(getCurrentPosition), filter(position => !!position))
      ),

      // map(([{ position, name, password, change }, empty_seats]) => {
      //   let newGame: Partial<Game> = {};
      //   newGame[`player_${position}_name`] = name;
      //   newGame[`player_${position}_password`] = change ? password : hashString(password);
      //   newGame.position_switch = null;
      //   if (!change) {
      //     newGame.empty_seats = empty_seats - 1 | 0;
      //   }
      //   return GameActions.updateGame({ game: newGame });
      // }),
      // tap(() => this.router.navigate(["/home"]))

      switchMap(([{ newPosition }, game, currentPosition]) => {
        const oldName = game[`player_${currentPosition}_name`];
        const oldPassword = game[`player_${currentPosition}_password`];

        const newName = game[`player_${newPosition}_name`];
        const newPassword = game[`player_${newPosition}_password`];

        let newGame: Partial<Game> = {};
        newGame[`player_${currentPosition}_name`] = newName;
        newGame[`player_${currentPosition}_password`] = newPassword;

        newGame[`player_${newPosition}_name`] = oldName;
        newGame[`player_${newPosition}_password`] = oldPassword;

        newGame.position_switch = Object.assign({}, game.position_switch, { accepted: true });;

        return [GameActions.rejoinGame({ position: newPosition }), GameActions.updateGame({ game: newGame })]

        // const actions = [GameActions.rejoinGame({ position: newPosition})];
        // if(game.position_switch){
        //   const oldName = game[`player_${currentPosition}_name`];
        //   const oldPassword = game[`player_${currentPosition}_password`];
        // }
        // return actions;
        // return [GameActions.joinGame({ name: oldName, position: newPosition, password: oldPassword, change: true }), GameActions.changeSeatCompleted({ currentPosition: newPosition })]
      }),
    )
  );

  changeSeatCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.changeSeatAccepted),
      withLatestFrom(this.store$.pipe(select(getPositionSwitch))),
      switchMap(([_, positionSwitch]) => {
        let newGame: Partial<Game> = {};
        if (positionSwitch.accepted) {
          newGame.position_switch = null;
        }
        // return GameActions.updateGame({ game: newGame });
        return [GameActions.rejoinGame({ position: positionSwitch.to }), GameActions.updateGame({ game: newGame })]
      })
    )
  )

  tryProposeChangeSeat = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.tryProposeChangeSeat),
      withLatestFrom(this.store$.pipe(select(getOthePlayers))),
      switchMap(([_, otherPlayers]) => {
        return this.dialog.open(ChangeSeatComponent, { data: { otherPlayers } }).afterClosed().pipe(
          map(targetPlayer => {
            if (targetPlayer) {
              return GameActions.proposeChangeSeat({ targetPosition: targetPlayer.position, targetName: targetPlayer.name });
            } else {
              return GameActions.proposeChangeSeatCancelled();
            }
          })
        )
      })
    )
  );

  proposeChangeSeat = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.proposeChangeSeat),
      withLatestFrom(this.store$.pipe(select(getCurrentPlayer))),
      map(([{ targetPosition, targetName }, currentPlayer]) => {
        const game: Partial<Game> = {
          position_switch: {
            force: false,
            from: currentPlayer.position,
            from_name: currentPlayer.name,
            to: targetPosition,
            to_name: targetName,
            accepted: false
          }
        }
        return GameActions.updateGame({ game });
      }),
    )
  );

  refuseChange = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.cancelChangeSeat),
      map(() => {
        const game: Partial<Game> = {
          position_switch: null
        }
        return GameActions.updateGame({ game });
      }),
    )
  );

  startNewGame = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.startNewGame),
      map(() => GameActions.giveCards({ oldStarter: null }))
    )
  );

  leaveGame = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.leaveGame),
      withLatestFrom(
        this.store$.pipe(select(getCurrentPosition), filter(position => !!position)),
        this.store$.pipe(select(getGame), filter(game => !!game), map(game => game.empty_seats))
      ),
      map((position, empty_seats) => {
        let newGame: Partial<Game> = {};
        newGame[`player_${position}_name`] = null;
        newGame[`player_${position}_password`] = null;
        newGame.position_switch = null;
        newGame.empty_seats = empty_seats + 1 | 0;
        return GameActions.updateGame({ game: newGame });
      }),
      tap(() => this.router.navigate(["/home"]))
    )
  );

  forceClose$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.forceClose),
      withLatestFrom(this.store$.pipe(select(getGame), filter(game => !!game))),
      map(([{ closer }, game]) => {
        let newGame: Partial<Game> = JSON.parse(JSON.stringify(game));
        newGame.force_closed = true;
        newGame.force_closed_by = closer;
        newGame.last_take = null;
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
        this.store$.pipe(select(getCurrentTeam)),
        this.store$.pipe(select(getCurrentPosition)),
      ),
      map(([{ king }, game, currentTeam, currentPosition]) => {
        let newGame: Partial<Game> = { king };
        if (currentPosition && currentTeam) {
          if (hasCricca(king, game[`player_${currentPosition}_hand`])) {
            if (currentTeam == 1) {
              newGame.scores_1 = [...game.scores_1, game.scores_1[game.scores_1.length - 1] + 3];
              newGame.scores_2 = [...game.scores_2, game.scores_2[game.scores_2.length - 1]];
            } else {
              newGame.scores_1 = [...game.scores_1, game.scores_1[game.scores_1.length - 1]];
              newGame.scores_2 = [...game.scores_2, game.scores_2[game.scores_2.length - 1] + 3];
            }
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
