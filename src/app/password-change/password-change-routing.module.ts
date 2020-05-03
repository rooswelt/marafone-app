import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordChangePage } from './password-change.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordChangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordChangePageRoutingModule {}
