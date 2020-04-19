import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Card, Game, Sign } from '../commons/models/game.model';
import { AlertService } from '../commons/services/alert.service';
import { DatabaseService } from '../commons/services/database.service';
import {
  getGameWinner,
  getLeftPosition,
  getRightPosition,
  getTeamMatePosition,
  getTeamNumber,
  isGameClosed,
} from '../commons/utils/game.util';
import { Player } from './../commons/models/game.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  currentGame$: Observable<Game>;
  gameClosed: boolean = false;

  private currentPlayerSubject: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);
  private teamMateSubject: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);
  private leftPlayerSubject: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);
  private rightPlayerSubject: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);

  currentScore: number[];
  opponentsScore: number[];

  currentTakes: Card[];
  opponentTakes: Card[];

  starter: Player;

  currentTeam: number;
  winnerTeam: number;

  constructor(private db: DatabaseService, private alertService: AlertService) {
    this.currentGame$ = this.db.currentGame$;

    this.currentGame$.pipe(filter(game => !!game)).subscribe(game => {
      this.currentPlayerSubject.next(new Player(game, this.db.currentPosition));
      this.teamMateSubject.next(new Player(game, getTeamMatePosition(this.db.currentPosition)));
      this.leftPlayerSubject.next(new Player(game, getLeftPosition(this.db.currentPosition)));
      this.rightPlayerSubject.next(new Player(game, getRightPosition(this.db.currentPosition)));
      if (game.starter) {
        this.starter = new Player(game, game.starter);
      }
      if (getTeamNumber(this.db.currentPosition) == 1) {
        this.currentScore = game.scores_1;
        this.opponentsScore = game.scores_2;
        this.currentTakes = game.take_1;
        this.opponentTakes = game.take_2;
        this.currentTeam = 1;
      } else {
        this.currentScore = game.scores_2;
        this.opponentsScore = game.scores_1;
        this.currentTakes = game.take_2;
        this.opponentTakes = game.take_1;
        this.currentTeam = 2;
      }
      this.gameClosed = isGameClosed(game);
      this.winnerTeam = getGameWinner(game);
    })
  }

  playCard({ card, hint }) {
    this.db.playCard(this.db.currentPosition, card, hint).subscribe(() => {
      console.log('Carta giocata', card);
    });
  }

  startHand() {
    this.db.giveCards(this.starter.position);
  }

  setKing(sign: Sign) {
    this.db.setKing(sign);
  }

  setStarter(starter: number) {
    this.db.setStarter(starter);
  }

  restart() {
    this.alertService.showConfirmDialog('Conferma', 'Sei sicuro di voler ricominciare?').subscribe((confirm) => {
      if (confirm) {
        this.db.giveCards();
      }
    })
  }

  get currentPlayer$(): Observable<Player> {
    return this.currentPlayerSubject.asObservable();
  }
  get teamMate$(): Observable<Player> {
    return this.teamMateSubject.asObservable();
  }
  get leftPlayer$(): Observable<Player> {
    return this.leftPlayerSubject.asObservable();
  }
  get rightPlayer$(): Observable<Player> {
    return this.rightPlayerSubject.asObservable();
  }
}
