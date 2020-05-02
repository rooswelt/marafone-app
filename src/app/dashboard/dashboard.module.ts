import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EffectsModule } from '@ngrx/effects';

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
    MatButtonModule,
    DashboardRoutingModule,
    EffectsModule.forFeature([GameEffects])
  ]
})
export class DashboardModule { }
