import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarrierMainComponent } from './carrier-main/carrier-main.component';
import { CarrierUpdateComponent } from './carrier-update/carrier-update.component';
import { CarrierViewComponent } from './carrier-view/carrier-view.component';


const routes: Routes = [
  { path: '', component: CarrierMainComponent },
  { path: 'carrier-update', component: CarrierUpdateComponent },
  { path: 'carrier-view', component: CarrierViewComponent },
  // { path: 'outprodissue', component: OutProdissueComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrierRoutingModule { }
