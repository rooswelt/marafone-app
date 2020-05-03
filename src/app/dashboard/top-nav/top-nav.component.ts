import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { select, Store } from '@ngrx/store';
import { getUser, User } from '@xtream/firebase-ngrx-user-management';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Game, Player } from 'src/app/commons/models/game.model';
import { AppState } from 'src/app/store/reducers';

import { tryLogout } from './../../store/actions/auth.actions';
import {
  getCurrentPosition,
  getCurrentScore,
  getGame,
  getGameStarter,
  getOpponentScore,
} from './../../store/selectors/game.selectors';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  currentUser: User;
  currentGame: Game;
  starter: Player;
  currentPosition: number;

  currentScore: number[];
  opponentsScore: number[];

  constructor(private store$: Store<AppState>, private afAuth: AngularFireAuth) {
    this.store$.pipe(select(getUser), takeUntil(this.unsubscribe$)).subscribe(user => this.currentUser = user);
    this.store$.pipe(select(getGame), takeUntil(this.unsubscribe$)).subscribe(game => this.currentGame = game);
    this.store$.pipe(select(getCurrentScore), takeUntil(this.unsubscribe$)).subscribe(currentScore => this.currentScore = currentScore);
    this.store$.pipe(select(getOpponentScore), takeUntil(this.unsubscribe$)).subscribe(opponentsScore => this.opponentsScore = opponentsScore);
    this.store$.pipe(select(getCurrentPosition), takeUntil(this.unsubscribe$)).subscribe(currentPosition => this.currentPosition = currentPosition);
    this.store$.pipe(select(getGameStarter), takeUntil(this.unsubscribe$)).subscribe(starter => this.starter = starter);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.store$.dispatch(tryLogout());
  }

  about() {
    //TODO mrosetti - About screen
  }

}
