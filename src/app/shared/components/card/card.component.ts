import { Component, Input } from '@angular/core';
import { Card } from 'src/app/commons/models/game.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input()
  card: Card;

  @Input()
  disabled: boolean;

  @Input()
  isKing: boolean;

  constructor() { }
}
