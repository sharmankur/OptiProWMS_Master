import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CTMasterComponent } from './ctmaster.component';

// const routes: Routes = [];

const routes: Routes = [
  { path: '', component: CTMasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CTRoutingModule { }
