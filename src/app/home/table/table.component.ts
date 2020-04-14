import { Component, Input } from '@angular/core';
import { Card } from 'src/app/commons/models/game.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @Input()
  left: Card;
  @Input()
  right: Card;
  @Input()
  top: Card;
  @Input()
  bottom: Card;

  constructor() { }

}
