import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { select, Store } from '@ngrx/store';
import { getUser, User } from '@xtream/firebase-ngrx-user-management';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/store/reducers';

import { tryLogout } from './../../store/actions/auth.actions';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  currentUser: User;

  constructor(private store$: Store<AppState>, private afAuth: AngularFireAuth) {
    this.store$.pipe(select(getUser), takeUntil(this.unsubscribe$)).subscribe(user => this.currentUser = user);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.store$.dispatch(tryLogout());
  }

}
