import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Card, Sign } from '../../commons/models/game.model';

@Component({
  selector: 'app-player-cards',
  templateUrl: './player-cards.component.html',
  styleUrls: ['./player-cards.component.scss']
})
export class PlayerCardsComponent {

  constructor() { }

  @Input()
  cards: Card[];

  @Input()
  default: Sign;

  @Input()
  shouldPlay: boolean;

  @Output()
  onPlay: EventEmitter<Card> = new EventEmitter<Card>();

  playACard(index: number) {
    const card = this.cards.splice(index, 1)[0];
    this.onPlay.emit(card);
  }

  canPlayCard(card: Card): boolean {
    if (!this.default) {
      return true;
    }
    if (card.type == this.default) {
      return true;
    }
    return this.cards.filter(c => c.type == this.default).length == 0;
  }

}
