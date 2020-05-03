import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CardComponent } from './components/card/card.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PasswordDialogComponent } from './components/password-dialog/password-dialog.component';
import { PlayerCardsComponent } from './components/player-cards/player-cards.component';
import { SignPipe } from './pipes/sign.pipe';

@NgModule({
  declarations: [
    CardComponent,
    PlayerCardsComponent,
    ConfirmDialogComponent,
    PasswordDialogComponent,
    SignPipe,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CardComponent,
    PlayerCardsComponent,
    ConfirmDialogComponent,
    PasswordDialogComponent,
    SignPipe
  ],
  providers: [],
})
export class SharedModule { }
