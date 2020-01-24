import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickingComponent } from './picking.component';

// const routes: Routes = [];

const routes: Routes = [
  { path: '', component: PickingComponent}
    // { path: 'outcustomer', component: OutCutomerComponent },
    // { path: 'outorder', component: OutOrderComponent },
    // { path: 'outprodissue', component: OutProdissueComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickingRoutingModule { }
