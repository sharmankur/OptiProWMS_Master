import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WhsUGMappingMasterComponent } from './whs-ugmapping-master/whs-ugmapping-master.component';


// const routes: Routes = [];

const routes: Routes = [
  { path: '', component: WhsUGMappingMasterComponent}
 
    // { path: 'outcustomer', component: OutCutomerComponent },
    // { path: 'outorder', component: OutOrderComponent },
    // { path: 'outprodissue', component: OutProdissueComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhsUGMappingRoutingModule { }
