import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Player } from './../../../commons/models/game.model';

@Component({
  selector: 'app-change-seat',
  templateUrl: './change-seat.component.html',
  styleUrls: ['./change-seat.component.scss']
})
export class ChangeSeatComponent {

  otherPlayers: Player[];

  constructor(public dialogRef: MatDialogRef<ChangeSeatComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.otherPlayers = this.data.otherPlayers;
  }

  proposeSwitch(withPlayer: Player) {
    this.dialogRef.close(withPlayer);
  }

  cancel() {
    this.dialogRef.close();
  }
}


