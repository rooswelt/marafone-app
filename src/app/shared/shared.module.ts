import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CardComponent } from './components/card/card.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PlayerCardsComponent } from './components/player-cards/player-cards.component';
import { SignPipe } from './pipes/sign.pipe';

@NgModule({
  declarations: [
    CardComponent,
    PlayerCardsComponent,
    ConfirmDialogComponent,
    SignPipe
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [
    CardComponent,
    PlayerCardsComponent,
    ConfirmDialogComponent,
    SignPipe
  ],
  providers: [],
})
export class SharedModule { }
