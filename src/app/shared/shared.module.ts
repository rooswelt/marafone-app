import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardComponent } from './components/card/card.component';
import { SignPipe } from './pipes/sign.pipe';



@NgModule({
  declarations: [
    CardComponent,
    SignPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardComponent,
    SignPipe
  ],
  providers: [],
})
export class SharedModule { }
