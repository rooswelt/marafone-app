import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Card, Game, Hint } from '../models/game.model';
import { cardEquals, getWinningCard, pointsForTakes, shuffleCards, sortHand } from '../utils/card.util';
import { getRightPosition, getStarter, getTeamNumber, hasCricca, isGameClosed } from '../utils/game.util';
import { Sign } from './../models/game.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  private currentGame: AngularFirestoreDocument<Game>;
  private currentGameSubject: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
  currentPosition: number;

  constructor(private db: AngularFirestore, private alertService: AlertService) { }

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

  giveCards(oldStarter: number = null): Observable<void> {
    let deck = shuffleCards();

    let newGame: Partial<Game> = {
      player_1_hand: sortHand(deck.splice(0, 10)),
      player_1_card: null,
      player_2_hand: sortHand(deck.splice(0, 10)),
      player_2_card: null,
      player_3_hand: sortHand(deck.splice(0, 10)),
      player_3_card: null,
      player_4_hand: sortHand(deck.splice(0, 10)),
      player_4_card: null,
      turn: null,
      king: null,
      default: null,
      log: null,
      last_take: null,
      take_1: null,
      take_2: null
    }

    let newStarter;
    if (oldStarter != null) {
      newStarter = getRightPosition(oldStarter)
    } else {
      newStarter = getStarter(newGame.player_1_hand, newGame.player_2_hand, newGame.player_3_hand, newGame.player_4_hand);
      newGame.scores_1 = [0];
      newGame.scores_2 = [0];
    }
    newGame.turn = newStarter;
    newGame.starter = newStarter;

    return from(this.currentGame.update(newGame))
  }

  setKing(king: Sign) {
    this.currentGame.valueChanges().pipe(take(1)).subscribe(game => {
      let newGame: Partial<Game> = { king };
      if (hasCricca(king, game[`player_${this.currentPosition}_hand`])) {
        if (getTeamNumber(this.currentPosition) == 1) {
          newGame.scores_1 = [...game.scores_1, game.scores_1[game.scores_1.length - 1] + 3];
        } else {
          newGame.scores_2 = [...game.scores_2, game.scores_2[game.scores_2.length - 1] + 3];
        }
      }
      this._saveGame(newGame);
    });
  }

  setStarter(starter: number): Observable<void> {
    return from(this._saveGame({ starter }));
  }

  private _saveGame(game: Partial<Game>): Observable<void> {
    return from(this.currentGame.update(game));
  }

  playCard(playerPosition: number, card: Card, hint: Hint = null): Observable<boolean> {
    return this.currentGame.valueChanges().pipe(take(1), map(game => {

      if (!game.default) {
        game.player_1_card = null;
        game.player_2_card = null;
        game.player_3_card = null;
        game.player_4_card = null;
      }

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
      const finish = this._check(game);
      this._saveGame(game);
      return finish;
    }))
  }

  private _check(game: Game) {
    if (game.player_1_card && game.player_2_card && game.player_3_card && game.player_4_card) {
      const table = [game.player_1_card, game.player_2_card, game.player_3_card, game.player_4_card];

      const winningCard = getWinningCard(table, game.king, game.default);
      let winner = "";
      if (cardEquals(winningCard, game.player_1_card)) {
        game.turn = 1;
        game.take_1 = [...game.take_1 || [], ...table];
        game.last_take = "1";
        winner = game.player_1_name;
      }
      if (cardEquals(winningCard, game.player_2_card)) {
        game.turn = 2;
        game.take_2 = [...game.take_2 || [], ...table];
        game.last_take = "2";
        winner = game.player_2_name;
      }
      if (cardEquals(winningCard, game.player_3_card)) {
        game.turn = 3;
        game.take_1 = [...game.take_1 || [], ...table];
        game.last_take = "1";
        winner = game.player_3_name;
      }
      if (cardEquals(winningCard, game.player_4_card)) {
        game.turn = 4;
        game.take_2 = [...game.take_2 || [], ...table];
        game.last_take = "2";
        winner = game.player_4_name;
      }

      this.alertService.showConfirmMessage(`Ha preso ${winner}`);

      game.log = [...game.log || []];
      game.log.push({
        default: game.default,
        player_1_card: game.player_1_card,
        player_2_card: game.player_2_card,
        player_3_card: game.player_3_card,
        player_4_card: game.player_4_card
      });

      game.default = null;

      return this._checkFinish(game);
    }
    return false;
  }

  private _checkFinish(game: Game): boolean {
    if (isGameClosed(game)) {

      let score_1 = pointsForTakes(game.take_1 || []);
      let score_2 = pointsForTakes(game.take_2 || []);

      if (!game.scores_1) {
        game.scores_1 = [];
      } else {
        if (game.scores_1.length)
          score_1 += game.scores_1[game.scores_1.length - 1];
      }
      if (!game.scores_2) {
        game.scores_2 = [];
      } else {
        if (game.scores_2.length)
          score_2 += game.scores_2[game.scores_2.length - 1];
      }

      if (game.last_take == "1") score_1++;
      if (game.last_take == "2") score_2++;
      game.scores_1.push(score_1);
      game.scores_2.push(score_2);
      return true;
    }
    return false
  }

  check() {
    this.currentGame.valueChanges().pipe(take(1)).subscribe(game => {
      this._check(game);
      this._saveGame(game);
    });
  }

  checkFinish() {
    this.currentGame.valueChanges().pipe(take(1)).subscribe(game => {
      const finish = this._checkFinish(game);
      this._saveGame(game);
      if (finish) {
        this.giveCards(game.starter);
      }
    });
  }

  get currentGame$(): Observable<Game> {
    return this.currentGameSubject.asObservable();
  }
}
