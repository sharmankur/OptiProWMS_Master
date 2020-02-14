import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WhseBinLayoutComponent } from './whse-bin-layout/whse-bin-layout.component';


const routes: Routes = [
  { path: '', component: WhseBinLayoutComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhseBinLayoutRoutingModule { }
