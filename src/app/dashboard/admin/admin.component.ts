import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Card, Game, Hint, Sign } from '../../commons/models/game.model';
import { pointsForTakes } from '../../commons/utils/card.util';
import * as AdminActions from '../../store/actions/admin.actions';
import * as GameActions from '../../store/actions/game.actions';
import { AppState } from '../../store/reducers';
import { getGame } from '../../store/selectors/game.selectors';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  private unsubscribe$ = new Subject<void>();
  currentGame: Game;

  constructor(private store$: Store<AppState>) {
    this.store$.pipe(select(getGame), takeUntil(this.unsubscribe$)).subscribe(game => this.currentGame = game);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  playCard(playerPosition: number, card: Card, hint: Hint = null) {
    this.store$.dispatch(GameActions.playCard({ playerPosition, card, hint }));
  }

  setKing(king: Sign) {
    this.store$.dispatch(GameActions.setKing({ king }))
  }

  startGame() {
    this.store$.dispatch(GameActions.startNewGame())
  }

  check() {
    this.store$.dispatch(AdminActions.checkCards());
  }

  firstPosition: number;
  secondPosition: number;

  switchPlayers() {
    this.store$.dispatch(AdminActions.proposeChangeSeat({ firstPosition: Number(this.firstPosition), secondPosition: Number(this.secondPosition) }));
  }

  pointsForTakes = pointsForTakes
}
