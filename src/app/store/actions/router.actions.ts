import { NavigationExtras } from '@angular/router';
import { createAction, props } from '@ngrx/store';

//Taken from https://medium.com/@amcdnl/angular-routing-data-with-ngrx-effects-1cda1bd5e579

export const routerGo = createAction('[Router] Go', props<{
    path: any[];
    cleanRedirectURL?: boolean;
    queryParams?: object;
    extras?: NavigationExtras;
}>());

export const routerBack = createAction('[Router] Back');
export const routerForward = createAction('[Router] Forward');
export const routeChange = createAction('[Router] Route Change', props<{ params: any, path: string }>());
