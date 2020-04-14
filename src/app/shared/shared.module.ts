import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardComponent } from './components/card/card.component';
import { PlayerCardsComponent } from './components/player-cards/player-cards.component';
import { SignPipe } from './pipes/sign.pipe';



@NgModule({
  declarations: [
    CardComponent,
    PlayerCardsComponent,
    SignPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardComponent,
    PlayerCardsComponent,
    SignPipe
  ],
  providers: [],
})
export class SharedModule { }
