import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Game } from './../commons/models/game.model';
import { DatabaseService } from './../commons/services/database.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {

  currentGame$: Observable<Game> = this.db.currentGame$;
  availableSeats: number[] = [];

  idCtrl: FormControl = new FormControl("6X4HHRRqr5P91JD5D9oP", Validators.required);

  joinForm: FormGroup;
  constructor(private fb: FormBuilder, private db: DatabaseService, private router: Router) {
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
    this.db.loadGame(this.idCtrl.value);

  }

  rejoin(position) {
    this.db.rejoin(position);
    this.router.navigate(["/home"]);
  }

  join() {
    this.db.joinGame(this.joinForm.value.position, this.joinForm.value.name).subscribe(() => {
      this.router.navigate(["/home"]);
    })
  }
}
