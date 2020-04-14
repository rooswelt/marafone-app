import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { CurrentPlayerComponent } from './current-player/current-player.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PlayerComponent } from './player/player.component';
import { TableComponent } from './table/table.component';


@NgModule({
  declarations: [HomeComponent, PlayerComponent, CurrentPlayerComponent, TableComponent],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
