import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickingComponent } from './picking.component';
import { PickingListComponent } from './picking-list/picking-list.component';

const routes: Routes = [
  {
    path: '', component: PickingComponent,
    children: [
      { path: '', redirectTo: 'picking-list', pathMatch: 'full' }, //,canActivate: [AuthGuard]
      { path: 'picking-list', component: PickingListComponent },
    ]
  },
  {}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickingRoutingModule { }
