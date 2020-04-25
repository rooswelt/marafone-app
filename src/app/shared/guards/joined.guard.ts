import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppState } from 'src/app/store/reducers';

import { getGame } from './../../store/selectors/game.selectors';

@Injectable({
  providedIn: 'root'
})
export class JoinedGuard implements CanActivate {

  constructor(private store$: Store<AppState>, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store$.pipe(select(getGame), map(game => !!game), tap(hasGame => {
      if (!hasGame) {
        this.router.navigate(["/join"]);
      }
    }));
  }

}
