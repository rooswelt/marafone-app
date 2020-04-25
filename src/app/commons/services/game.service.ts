import { Injectable } from '@angular/core';

import { Game } from '../models/game.model';
import { cardEquals, getWinningCard, pointsForTakes } from '../utils/card.util';
import { isGameClosed } from '../utils/game.util';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: "root"
})
export class GameService {
  constructor(private alertService: AlertService) { }

  check(game: Partial<Game>) {
    if (game.player_1_card && game.player_2_card && game.player_3_card && game.player_4_card) {
      const table = [game.player_1_card, game.player_2_card, game.player_3_card, game.player_4_card];

      const winningCard = getWinningCard(table, game.king, game.default);
      let winner = "";
      if (cardEquals(winningCard, game.player_1_card)) {
        game.turn = 1;
        game.take_1 = [...game.take_1 || [], ...table];
        game.last_take = 1;
        winner = game.player_1_name;
      }
      if (cardEquals(winningCard, game.player_2_card)) {
        game.turn = 2;
        game.take_2 = [...game.take_2 || [], ...table];
        game.last_take = 2;
        winner = game.player_2_name;
      }
      if (cardEquals(winningCard, game.player_3_card)) {
        game.turn = 3;
        game.take_1 = [...game.take_1 || [], ...table];
        game.last_take = 1;
        winner = game.player_3_name;
      }
      if (cardEquals(winningCard, game.player_4_card)) {
        game.turn = 4;
        game.take_2 = [...game.take_2 || [], ...table];
        game.last_take = 2;
        winner = game.player_4_name;
      }

      this.alertService.showConfirmMessage(`Ha preso ${winner}`);

      game.log = [...game.log || []];
      game.log.push({
        default: game.default,
        player_1_card: game.player_1_card,
        player_2_card: game.player_2_card,
        player_3_card: game.player_3_card,
        player_4_card: game.player_4_card
      });

      game.default = null;

      return this.checkFinish(game);
    }
    return false;
  }

  checkFinish(game: Partial<Game>): boolean {
    if (isGameClosed(game)) {

      let score_1 = pointsForTakes(game.take_1 || []);
      let score_2 = pointsForTakes(game.take_2 || []);

      if (!game.scores_1) {
        game.scores_1 = [];
      } else {
        if (game.scores_1.length)
          score_1 += game.scores_1[game.scores_1.length - 1];
      }
      if (!game.scores_2) {
        game.scores_2 = [];
      } else {
        if (game.scores_2.length)
          score_2 += game.scores_2[game.scores_2.length - 1];
      }

      if (game.last_take == 1) score_1++;
      if (game.last_take == 2) score_2++;
      game.scores_1.push(score_1);
      game.scores_2.push(score_2);
      return true;
    }
    return false
  }
}
