import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BinrulemasterComponent } from './binrulemaster/binrulemaster.component';


const routes: Routes = [
  { path: '', component: BinrulemasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BinruleRoutingModule { }
