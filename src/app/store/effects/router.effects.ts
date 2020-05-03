import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

import * as RouteActions from '../actions/router.actions';


@Injectable()
export class RouterEffects {
    constructor(
        private actions$: Actions,
        private router: Router,
        private location: Location,
        private store: Store<any>
    ) {
        this.listenToRouter();
    }

    @Effect({ dispatch: false })
    navigate$ = this.actions$.pipe(
        ofType(RouteActions.routerGo),
        tap(({ path, queryParams, extras }) => this.router.navigate(path, { queryParams, ...extras }))
    );

    @Effect({ dispatch: false })
    navigateBack$ = this.actions$.pipe(ofType(RouteActions.routerBack), tap(() => this.location.back()));

    @Effect({ dispatch: false })
    navigateForward$ = this.actions$.pipe(
        ofType(RouteActions.routerForward),
        tap(() => this.location.forward())
    );

    private listenToRouter() {
        this.router.events.pipe(
            filter(event => event instanceof ActivationEnd)
        ).subscribe((event: ActivationEnd) =>
            this.store.dispatch(RouteActions.routeChange({
                params: { ...event.snapshot.params },
                path: event.snapshot.routeConfig.path
            }))
        );
    }
}
