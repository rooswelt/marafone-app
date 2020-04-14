import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Game, Sign } from '../commons/models/game.model';
import { DatabaseService } from '../commons/services/database.service';
import { getLeftPosition, getRightPosition, getTeamMatePosition } from '../commons/utils/game.util';
import { Player } from './../commons/models/game.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  currentGame$: Observable<Game>;

  private currentPlayerSubject: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);
  private teamMateSubject: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);
  private leftPlayerSubject: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);
  private rightPlayerSubject: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);

  currentScore: number;
  opponentsScore: number;

  constructor(private db: DatabaseService) {
    this.currentGame$ = this.db.currentGame$;

    this.currentGame$.pipe(filter(game => !!game)).subscribe(game => {
      this.currentPlayerSubject.next(new Player(game, this.db.currentPosition));
      this.teamMateSubject.next(new Player(game, getTeamMatePosition(this.db.currentPosition)));
      this.leftPlayerSubject.next(new Player(game, getLeftPosition(this.db.currentPosition)));
      this.rightPlayerSubject.next(new Player(game, getRightPosition(this.db.currentPosition)));
      if (this.db.currentPosition % 2 == 1) {
        this.currentScore = game.score_1;
        this.opponentsScore = game.score_2;
      } else {
        this.currentScore = game.score_2;
        this.opponentsScore = game.score_1;
      }
    })
  }

  playCard({ card, hint }) {
    this.db.playCard(this.db.currentPosition, card, hint).subscribe(() => {
      console.log('Carta giocata', card);
    });
  }

  startGame() {
    this.db.giveCards();
  }

  setKing(sign: Sign) {
    this.db.setKing(sign);
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
