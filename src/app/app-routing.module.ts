import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './shared/guards/admin.guard';
import { JoinedGuard } from './shared/guards/joined.guard';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        redirectTo: "join",
        pathMatch: "full"
      },
      {
        path: "join",
        loadChildren: () => import('./join/join.module').then(mod => mod.JoinModule),
      },
      {
        path: "admin",
        loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
        canActivate: [JoinedGuard, AdminGuard]
      },
      {
        path: "home",
        loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule),
        canActivate: [JoinedGuard]
      }
    ]
  }

];

@NgModule({

  providers: [JoinedGuard, AdminGuard],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
