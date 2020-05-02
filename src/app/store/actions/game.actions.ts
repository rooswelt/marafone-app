import { createAction, props } from '@ngrx/store';
import { Card, Game, Hint, Sign, TeamNumber } from 'src/app/commons/models/game.model';

export const createGame = createAction('[Game] Create game', props<{ name: string }>());
export const createGameCompleted = createAction('[Game] Create game completed', props<{ game: Game }>());

export const loadGame = createAction('[Game] Load game', props<{ id: string }>());
export const loadGameCompleted = createAction('[Game] Load game Completed', props<{ game: Game }>());
export const loadGameFailed = createAction('[Game] Load game Failed', props<{ error: any }>());

export const updateGame = createAction('[Game] Update game', props<{ game: Partial<Game> }>());
export const updateGameCompleted = createAction('[Game] Update game Completed');
export const updateGameFailed = createAction('[Game] Update game Failed', props<{ error: any }>());

export const joinGame = createAction('[Game] Join game', props<{ position: number, name: string }>());
// export const joinGameCompleted = createAction('[Game] Join game Completed');
// export const joinGameFailed = createAction('[Game] Join game Failed', props<{ error: any }>());

export const rejoinGame = createAction('[Game] Rejoin game', props<{ position: number }>());
export const changeSeat = createAction('[Game] Change seat', props<{ newPosition: number }>());
export const changeSeatCompleted = createAction('[Game] Change seat completed', props<{ currentPosition: number }>());
// export const rejoinGameCompleted = createAction('[Game] Rejoin game Completed');
// export const rejoinGameFailed = createAction('[Game] Rejoin game Failed', props<{ error: any }>());

export const giveCards = createAction('[Game] Give cards', props<{ oldStarter: number }>());

export const startNewGame = createAction('[Game] Start new game');

export const forceClose = createAction('[Game] Force close', props<{ closer: TeamNumber }>());

export const setKing = createAction('[Game] Set king', props<{ king: Sign }>());
// export const setKingCompleted = createAction('[Game] Set king Completed');
// export const setKingFailed = createAction('[Game] Set king Failed', props<{ error: any }>());

export const playCard = createAction('[Game] Play card', props<{ playerPosition: number, card: Card, hint: Hint }>());
// export const playCardCompleted = createAction('[Game] Play card Completed');
// export const playCardFailed = createAction('[Game] Play card Failed', props<{ error: any }>());
