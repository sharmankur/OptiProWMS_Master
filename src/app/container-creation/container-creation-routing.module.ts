import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CcmainComponent } from './ccmain/ccmain.component';
import { BuildParentContainerComponent } from './build-parent-container/build-parent-container.component';

const routes: Routes = [
  { path: '', component: CcmainComponent},
  { path: 'build-parent-container', component: BuildParentContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerCreationRoutingModule { }
