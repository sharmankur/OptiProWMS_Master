import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainergroupmainComponent } from './containergroupmain/containergroupmain.component';
import { ContainergroupviewComponent } from './containergroupview/containergroupview.component';



const routes: Routes = [
  { path: '', component: ContainergroupmainComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerGroupRoutingModule { }
