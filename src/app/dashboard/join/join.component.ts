import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Game } from 'src/app/commons/models/game.model';

import * as GameActions from '../../store/actions/game.actions';
import { AppState } from '../../store/reducers';
import { getGame, getGames } from '../../store/selectors/game.selectors';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {
  private unsubscribe$ = new Subject<void>();
  games: Game[];

  currentGame: Game; //$: Observable<Game> = this.store$.pipe(select(getGame));

  // idCtrl: FormControl = new FormControl("6X4HHRRqr5P91JD5D9oP", Validators.required);

  constructor(private store$: Store<AppState>, private route: ActivatedRoute, private router: Router) {
    this.store$.pipe(select(getGames), takeUntil(this.unsubscribe$)).subscribe(games => this.games = games);
    this.store$.pipe(select(getGame), takeUntil(this.unsubscribe$)).subscribe(currentGame => this.currentGame = currentGame);
    this.store$.dispatch(GameActions.loadGames());
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectGame(game: Game) {
    if (game) {
      this.store$.dispatch(GameActions.loadGame({ id: game.id }));
    }
  }

  clearSelectedGame() {
    this.store$.dispatch(GameActions.unselectGame());
  }

  rejoin(position) {
    this.store$.dispatch(GameActions.tryRejoinGame({ position }));
  }

  join(event: { name: string, position: number, password: string }) {
    this.store$.dispatch(GameActions.joinGame({ position: event.position, name: event.name, password: event.password }));
  }

  goToAdmin() {
    this.router.navigate(['../admin'], { relativeTo: this.route.parent });
    // this.store$.dispatch(RouterActions.routerGo({ path: ['admin'], extras: { relativeTo: this.route } }))
  }

  createGame() {
    this.router.navigate(['../create'], { relativeTo: this.route.parent });
    // this.store$.dispatch(RouterActions.routerGo({ path: ['../create'], extras: { relativeTo: this.route.parent } })) //TODO - mrosetti - questa va in errore
  }
}
