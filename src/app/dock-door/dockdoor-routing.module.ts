import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DockdoormainComponent } from 'src/app/dock-door/dockdoormain/dockdoormain.component';

// const routes: Routes = [];

const routes: Routes = [
  { path: '', component: DockdoormainComponent}
    // { path: 'outcustomer', component: OutCutomerComponent },
    // { path: 'outorder', component: OutOrderComponent },
    // { path: 'outprodissue', component: OutProdissueComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockDoorRoutingModule { }
