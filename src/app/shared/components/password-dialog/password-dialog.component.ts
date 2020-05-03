import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent {

  passwordCtrl: FormControl = new FormControl("", Validators.required);

  constructor(public dialogRef: MatDialogRef<PasswordDialogComponent>) { }

  confirm() {
    this.dialogRef.close(this.passwordCtrl.value)
  }

  cancel() {
    this.dialogRef.close();
  }
}
