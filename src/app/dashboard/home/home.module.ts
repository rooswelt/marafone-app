import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '../../shared/shared.module';
import { ChangeSeatComponent } from './change-seat/change-seat.component';
import { CurrentPlayerComponent } from './current-player/current-player.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PlayerComponent } from './player/player.component';
import { TableComponent } from './table/table.component';


@NgModule({
  declarations: [HomeComponent, PlayerComponent, CurrentPlayerComponent, TableComponent, ChangeSeatComponent],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  entryComponents: [ChangeSeatComponent]
})
export class HomeModule { }
