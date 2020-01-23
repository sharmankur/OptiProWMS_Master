import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipmentWizardMasterComponent } from './shipment-wizard-master.component';

// const routes: Routes = [];

const routes: Routes = [
  { path: '', component: ShipmentWizardMasterComponent}
    // { path: 'outcustomer', component: OutCutomerComponent },
    // { path: 'outorder', component: OutOrderComponent },
    // { path: 'outprodissue', component: OutProdissueComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentWizardRoutingModule { }
