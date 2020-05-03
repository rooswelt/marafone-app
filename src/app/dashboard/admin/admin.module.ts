import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../shared/shared.module';
import { AdminEffects } from '../../store/effects/admin.effects';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    SharedModule,
    EffectsModule.forFeature([AdminEffects])
  ]
})
export class AdminModule { }
