import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Card, Game, Hint, Sign } from '../commons/models/game.model';
import { DatabaseService } from '../commons/services/database.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  currentGame$: Observable<Game>;

  currentName: string;

  constructor(private db: DatabaseService) {
    this.currentGame$ = this.db.currentGame$;

    this.currentGame$.pipe(filter(game => !!game)).subscribe(game => {
      this.currentName = game[`player_${this.db.currentPosition}_name`];
    })
  }

  playCard(position: number, card: Card, hint: Hint = null) {
    this.db.playCard(position, card, hint).subscribe(() => {
      console.log('Carta giocata', card);
    });
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
