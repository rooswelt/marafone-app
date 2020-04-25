import { createAction, props } from '@ngrx/store';

export const checkCards = createAction('[Admin] Check cards');
export const checkFinish = createAction('[Admin] Check finish');

export const proposeChangeSeat = createAction('[Admin] Propose change seat', props<{ firstPosition: number, secondPosition: number }>());
