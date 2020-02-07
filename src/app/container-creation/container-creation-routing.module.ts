import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateContainerComponent } from './create-container/create-container.component';


const routes: Routes = [
  { path: '', component: CreateContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerCreationRoutingModule { }
