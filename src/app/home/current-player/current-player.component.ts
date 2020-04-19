import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, Player, Sign } from 'src/app/commons/models/game.model';

import { Hint } from './../../commons/models/game.model';

@Component({
  selector: 'app-current-player',
  templateUrl: './current-player.component.html',
  styleUrls: ['./current-player.component.scss']
})
export class CurrentPlayerComponent {

  @Input()
  player: Player;

  @Input()
  default: Sign;

  @Input()
  king: Sign;

  @Input()
  shouldPlay: boolean;

  @Input()
  shouldSetKing: boolean;

  @Output()
  onPlayCard: EventEmitter<{ card: Card, hint: Hint }> = new EventEmitter<{ card: Card, hint: Hint }>();

  @Output()
  onSetKing: EventEmitter<Sign> = new EventEmitter<Sign>();

  selectedCard: Card;

  constructor() { }

  playCard(hint: Hint = null) {
    if (this.selectedCard) {
      this.onPlayCard.emit({ card: this.selectedCard, hint });
      this.selectedCard = null;
    }
  }

  setKing(king: Sign) {
    if (king) {
      this.onSetKing.emit(king);
    }
  }

  canPlayCard(card: Card): boolean {
    if (!this.default) {
      return true;
    }
    if (card.type == this.default) {
      return true;
    }
    return this.player.hand.filter(c => c.type == this.default).length == 0;
  }

  onCardSelected(card: Card) {
    this.selectedCard = card;
  }
}
