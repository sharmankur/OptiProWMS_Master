import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CARMainComponent } from './carmain/carmain.component';


// const routes: Routes = [];

const routes: Routes = [
  { path: '', component: CARMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CARMasterRoutingModule { }
