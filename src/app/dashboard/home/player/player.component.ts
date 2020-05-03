import { Component, Input } from '@angular/core';
import { Player } from 'src/app/commons/models/game.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

  constructor() { }

  @Input()
  player: Player;

}
