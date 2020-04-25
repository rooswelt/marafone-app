import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Game } from './../commons/models/game.model';
import * as GameActions from './../store/actions/game.actions';
import { AppState } from './../store/reducers';
import { getGame } from './../store/selectors/game.selectors';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {

  currentGame$: Observable<Game> = this.store$.pipe(select(getGame));
  availableSeats: number[] = [];

  idCtrl: FormControl = new FormControl("6X4HHRRqr5P91JD5D9oP", Validators.required);

  joinForm: FormGroup;
  constructor(private fb: FormBuilder, private store$: Store<AppState>, private router: Router) {
    this._createForm();

    this.currentGame$.pipe(filter(game => !!game)).subscribe(game => {
      if (!game.player_1_name) this.availableSeats.push(1);
      if (!game.player_2_name) this.availableSeats.push(2);
      if (!game.player_3_name) this.availableSeats.push(3);
      if (!game.player_4_name) this.availableSeats.push(4);
    })
  }

  private _createForm() {
    let group = {
      position: ["", Validators.required],
      name: ["", Validators.required]
    }
    this.joinForm = this.fb.group(group);
  }

  selectGame() {
    this.store$.dispatch(GameActions.loadGame({ id: this.idCtrl.value }));
  }

  rejoin(position) {
    this.store$.dispatch(GameActions.rejoinGame({ position }));
  }

  join() {
    this.store$.dispatch(GameActions.joinGame({ position: this.joinForm.value.position, name: this.joinForm.value.name }));
  }

  goToAdmin() {
    this.router.navigate(['/admin'])
  }
}
