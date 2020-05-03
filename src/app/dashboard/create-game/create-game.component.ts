import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as GameActions from '../../store/actions/game.actions';
import * as RouterActions from '../../store/actions/router.actions';
import { NewGame } from './../../commons/models/game.model';
import { AppState } from './../../store/reducers';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent {

  gameForm: FormGroup
  constructor(private store$: Store<AppState>, private fb: FormBuilder) {
    this._createForm();
  }

  private _createForm() {
    const group = {
      name: ["", Validators.required],
      public: [true],
      password: [""]
    }

    this.gameForm = this.fb.group(group);
  }

  create() {
    const newGame: NewGame = {
      name: this.gameForm.value.name,
      password: this.gameForm.value.password,
      public: this.gameForm.value.public,
      empty_seats: 4
    }

    this.store$.dispatch(GameActions.createGame({ newGame }));
  }

  cancel() {
    this.store$.dispatch(RouterActions.routerBack());
  }
}
