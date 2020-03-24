import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateContainerComponent } from './create-container/create-container.component';
import { CcmainComponent } from './ccmain/ccmain.component';
import { BuildParentContainerComponent } from './build-parent-container/build-parent-container.component';

const routes: Routes = [
  { path: '', component: CcmainComponent},
  { path: 'create-container', component: CreateContainerComponent },
  { path: 'create-containerWIP', component: CreateContainerComponent },
  { path: 'build-parent-container', component: BuildParentContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerCreationRoutingModule { }
