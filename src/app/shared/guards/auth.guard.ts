import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { getUserState } from '@xtream/firebase-ngrx-user-management';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import * as RouterActions from 'src/app/store/actions/router.actions';
import { AppState } from 'src/app/store/reducers';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store$: Store<AppState>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.store$.pipe(
      select(getUserState),
      take(1),
      map(user => user.loggedIn),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.store$.dispatch(RouterActions.routerGo({ path: ['/login'] }));
        }
      })
    );
  }

}
