import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContMaintnceMainComponent } from './cont-maintnce-main/cont-maintnce-main.component';


const routes: Routes = [
  { path: '', component: ContMaintnceMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerMaintenanceRoutingModule { }
