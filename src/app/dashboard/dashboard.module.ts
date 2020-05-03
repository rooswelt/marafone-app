import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MdePopoverModule } from '@material-extended/mde';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { GameEffects } from './../store/effects/game.effects';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TopNavComponent } from './top-nav/top-nav.component';


@NgModule({
  declarations: [DashboardComponent, TopNavComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    DashboardRoutingModule,
    EffectsModule.forFeature([GameEffects]),
    MdePopoverModule,
    SharedModule
  ]
})
export class DashboardModule { }
