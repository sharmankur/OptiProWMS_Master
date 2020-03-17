import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContMaintnceMainComponent } from './cont-maintnce-main/cont-maintnce-main.component';
import { ContMaintnceComponent } from './cont-maintnce/cont-maintnce.component';


const routes: Routes = [
  { path: '', component: ContMaintnceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerMaintenanceRoutingModule { }
