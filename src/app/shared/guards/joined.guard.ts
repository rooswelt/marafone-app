import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { DatabaseService } from './../../commons/services/database.service';

@Injectable({
  providedIn: 'root'
})
export class JoinedGuard implements CanActivate {

  constructor(private db: DatabaseService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.db.currentGame$.pipe(map(game => !!game), tap(hasGame => {
      if (!hasGame) {
        this.router.navigate(["/join"]);
      }
    }));
  }

}
