import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedModule } from '../../shared/shared.module';
import { GameListComponent } from './game-list/game-list.component';
import { JoinRoutingModule } from './join-routing.module';
import { JoinComponent } from './join.component';
import { SeatsComponent } from './seats/seats.component';

@NgModule({
  declarations: [JoinComponent, GameListComponent, SeatsComponent,],
  imports: [
    CommonModule,
    JoinRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule
  ]
})
export class JoinModule { }
