import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Card, Game, Hint } from '../models/game.model';
import { cardEquals, getWinningCard, pointsForTakes, shuffleCards, sortHand } from '../utils/card.util';
import { Sign } from './../models/game.model';

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  private currentGame: AngularFirestoreDocument<Game>;
  private currentGameSubject: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
  currentPosition: number;

  constructor(private db: AngularFirestore) { }

  partiteCollection = this.db.collection('partite');

  loadGame(id: string) {
    this.currentGame = this.db.collection<Game>("partite").doc(id);
    this.currentGame.snapshotChanges().pipe(map(action => {
      const game = action.payload.data() as Game;
      const id = action.payload.id;
      return { id, ...game };
    })).subscribe(game => {
      this.currentGameSubject.next(game);
    });
  }

  rejoin(position: number) {
    this.currentPosition = position;
  }

  joinGame(position: number, name: string): Observable<void> {

    let newObject = {};
    newObject[`player_${position}_name`] = name;
    this.currentPosition = position;

    return from(this.currentGame.update(newObject));
  }

  giveCards(): Observable<void> {
    let deck = shuffleCards();

    return from(this.currentGame.update({
      player_1_hand: sortHand(deck.splice(0, 10)),
      player_1_card: null,
      player_2_hand: sortHand(deck.splice(0, 10)),
      player_2_card: null,
      player_3_hand: sortHand(deck.splice(0, 10)),
      player_3_card: null,
      player_4_hand: sortHand(deck.splice(0, 10)),
      player_4_card: null,
      king: null,
      default: null,
      log: null,
      last_take: null,
      take_1: null,
      take_2: null
    }))
  }

  setKing(king: Sign): Observable<void> {
    return from(this._saveGame({ king }));
  }

  private _saveGame(game: Partial<Game>): Observable<void> {
    return from(this.currentGame.update(game));
  }

  playCard(playerPosition: number, card: Card, hint: Hint = null): Observable<void> {
    return this.currentGame.valueChanges().pipe(take(1), map(game => {

      game[`player_1_hint`] = null;
      game[`player_2_hint`] = null;
      game[`player_3_hint`] = null;
      game[`player_4_hint`] = null;

      game[`player_${playerPosition}_card`] = card;
      game[`player_${playerPosition}_hint`] = hint;
      game[`player_${playerPosition}_hand`] = game[`player_${playerPosition}_hand`].filter(c => !cardEquals(c, card));
      game.turn = playerPosition == 4 ? 1 : playerPosition + 1;
      if (!game.default) {
        game.default = card.type;
      }
      this._check(game);
      this._saveGame(game);
    }))
  }

  private _check(game: Game) {
    if (game.player_1_card && game.player_2_card && game.player_3_card && game.player_4_card) {
      const table = [game.player_1_card, game.player_2_card, game.player_3_card, game.player_4_card];

      const winningCard = getWinningCard(table, game.king, game.default);
      if (cardEquals(winningCard, game.player_1_card)) {
        game.turn = 1;
        game.take_1 = [...game.take_1 || [], ...table];
        game.last_take = "1";
      }
      if (cardEquals(winningCard, game.player_2_card)) {
        game.turn = 2;
        game.take_2 = [...game.take_2 || [], ...table];
        game.last_take = "2";
      }
      if (cardEquals(winningCard, game.player_3_card)) {
        game.turn = 3;
        game.take_1 = [...game.take_1 || [], ...table];
        game.last_take = "1";
      }
      if (cardEquals(winningCard, game.player_4_card)) {
        game.turn = 4;
        game.take_2 = [...game.take_2 || [], ...table];
        game.last_take = "2";
      }

      game.log = [...game.log || []];
      game.log.push({
        default: game.default,
        player_1_card: game.player_1_card,
        player_2_card: game.player_2_card,
        player_3_card: game.player_3_card,
        player_4_card: game.player_4_card
      });

      game.player_1_card = null;
      game.player_2_card = null;
      game.player_3_card = null;
      game.player_4_card = null;
      game.default = null;

      this._checkFinish(game);
    }
  }

  private _checkFinish(game: Game) {
    if (!game.player_1_hand.length && !game.player_2_hand.length && !game.player_3_hand.length && !game.player_4_hand.length) {
      game.score_1 = (game.score_1 || 0) + pointsForTakes(game.take_1 || []);
      game.score_2 = (game.score_2 || 0) + pointsForTakes(game.take_2 || []);
      if (game.last_take == "1") game.score_1++;
      if (game.last_take == "2") game.score_2++;
    }
  }

  check() {
    this.currentGame.valueChanges().pipe(take(1)).subscribe(game => {
      this._check(game);
      this._saveGame(game);
    });
  }

  checkFinish() {
    this.currentGame.valueChanges().pipe(take(1)).subscribe(game => {
      this._checkFinish(game);
      this._saveGame(game);
    });
  }

  get currentGame$(): Observable<Game> {
    return this.currentGameSubject.asObservable();
  }
}
