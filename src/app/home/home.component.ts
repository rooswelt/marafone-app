import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { Card, Game, Sign, TeamNumber } from '../commons/models/game.model';
import { AlertService } from '../commons/services/alert.service';
import { pointsForTakes } from '../commons/utils/card.util';
import * as GameActions from '../store/actions/game.actions';
import { AppState } from '../store/reducers';
import { Player } from './../commons/models/game.model';
import {
  getCanForceClose,
  getCurrentPlayer,
  getCurrentPosition,
  getCurrentScore,
  getCurrentTakes,
  getCurrentTeam,
  getGame,
  getGameClosed,
  getGameStarter,
  getGameWinner,
  getLeftPlayer,
  getOpponentScore,
  getOpponentTakes,
  getPositionSwitch,
  getRightPlayer,
  getTeamMatePlayer,
} from './../store/selectors/game.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private unsubscribe$ = new Subject<void>();
  currentGame: Game;
  gameClosed: boolean = false;

  currentPlayer: Player;
  teamMate: Player;
  leftPlayer: Player;
  rightPlayer: Player;

  currentScore: number[];
  opponentsScore: number[];

  currentTakes: Card[];
  opponentTakes: Card[];

  starter: Player;

  currentTeam: TeamNumber;
  winnerTeam: TeamNumber;

  canForceClose: boolean;

  private _currentPosition: number;

  constructor(private store$: Store<AppState>, private alertService: AlertService) {
    this.store$.pipe(select(getGame), takeUntil(this.unsubscribe$)).subscribe(game => this.currentGame = game);
    this.store$.pipe(select(getGameClosed), takeUntil(this.unsubscribe$)).subscribe(gameClosed => this.gameClosed = gameClosed);
    this.store$.pipe(select(getCurrentPlayer), takeUntil(this.unsubscribe$)).subscribe(currentPlayer => this.currentPlayer = currentPlayer);
    this.store$.pipe(select(getTeamMatePlayer), takeUntil(this.unsubscribe$)).subscribe(teamMate => this.teamMate = teamMate);
    this.store$.pipe(select(getLeftPlayer), takeUntil(this.unsubscribe$)).subscribe(leftPlayer => this.leftPlayer = leftPlayer);
    this.store$.pipe(select(getRightPlayer), takeUntil(this.unsubscribe$)).subscribe(rightPlayer => this.rightPlayer = rightPlayer);
    this.store$.pipe(select(getCurrentScore), takeUntil(this.unsubscribe$)).subscribe(currentScore => this.currentScore = currentScore);
    this.store$.pipe(select(getOpponentScore), takeUntil(this.unsubscribe$)).subscribe(opponentsScore => this.opponentsScore = opponentsScore);
    this.store$.pipe(select(getCurrentTakes), takeUntil(this.unsubscribe$)).subscribe(currentTakes => this.currentTakes = currentTakes);
    this.store$.pipe(select(getOpponentTakes), takeUntil(this.unsubscribe$)).subscribe(opponentTakes => this.opponentTakes = opponentTakes);
    this.store$.pipe(select(getGameStarter), takeUntil(this.unsubscribe$)).subscribe(starter => this.starter = starter);
    this.store$.pipe(select(getCurrentTeam), takeUntil(this.unsubscribe$)).subscribe(currentTeam => this.currentTeam = currentTeam);
    this.store$.pipe(select(getGameWinner), takeUntil(this.unsubscribe$)).subscribe(winnerTeam => this.winnerTeam = winnerTeam);
    this.store$.pipe(select(getCanForceClose), takeUntil(this.unsubscribe$)).subscribe(canForceClose => this.canForceClose = canForceClose);
    this.store$.pipe(select(getCurrentPosition), takeUntil(this.unsubscribe$)).subscribe(currentPosition => this._currentPosition = currentPosition);
    this.store$.pipe(
      select(getPositionSwitch),
      takeUntil(this.unsubscribe$),
      filter(positionSwitch => !!positionSwitch),
      filter((positionSwitch) => (positionSwitch.from == this._currentPosition && positionSwitch.force) || positionSwitch.to == this._currentPosition),
      switchMap((positionSwitch) => {
        const other = positionSwitch.from == this._currentPosition ? positionSwitch.to : positionSwitch.from;
        const otherName = this.currentGame[`player_${other}_name`];
        return combineLatest(of(other), this.alertService.showConfirmDialog('Conferma cambio posto', `Clicca sul pulsante di conferma per sederti al posto di ${otherName}`, true));
      }),
    ).subscribe(([newPosition, confirm]) => {
      if (confirm) {
        this.store$.dispatch(GameActions.changeSeat({ newPosition }));
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  playCard({ card, hint }) {
    this.store$.dispatch(GameActions.playCard({ playerPosition: this._currentPosition, card, hint }));
  }

  startHand() {
    this.store$.dispatch(GameActions.giveCards({ oldStarter: this.starter.position }));
  }

  setKing(king: Sign) {
    this.store$.dispatch(GameActions.setKing({ king }))
  }

  forceClose() {
    this.store$.dispatch(GameActions.forceClose({ closer: this.currentTeam }))
  }

  restart() {
    this.alertService.showConfirmDialog('Conferma', 'Sei sicuro di voler ricominciare?').subscribe((confirm) => {
      if (confirm) {
        this.store$.dispatch(GameActions.startNewGame())
      }
    })
  }

  pointsForTakes = pointsForTakes
}
