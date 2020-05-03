import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/commons/models/game.model';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  @Input()
  games: Game[];

  @Output()
  onGameSelected: EventEmitter<Game> = new EventEmitter<Game>();

  @Output()
  onGameCreate: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  selectGame(game: Game) {
    this.onGameSelected.emit(game);
  }

  createGame() {
    this.onGameCreate.emit();
  }
}
