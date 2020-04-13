import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { JoinRoutingModule } from './join-routing.module';
import { JoinComponent } from './join.component';


@NgModule({
  declarations: [JoinComponent],
  imports: [
    CommonModule,
    JoinRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class JoinModule { }
