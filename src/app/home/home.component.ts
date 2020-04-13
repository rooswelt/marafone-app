import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Card, Game, Sign } from './../commons/models/game.model';
import { DatabaseService } from './../commons/services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentGame$: Observable<Game>;

  currentName: string;

  constructor(private db: DatabaseService) {
    this.currentGame$ = this.db.currentGame$;

    this.currentGame$.subscribe(game => {
      this.currentName = game[`player_${this.db.currentPosition}_name`];
    })
  }

  playCard(position: number, card: Card) {
    this.db.playCard(position, card);
  }

  startGame() {
    this.db.giveCards();
  }

  setKing(sign: Sign) {
    this.db.setKing(sign);
  }

  check() {
    this.db.check();
  }

  finalCheck() {
    this.db.checkFinish();
  }
}
