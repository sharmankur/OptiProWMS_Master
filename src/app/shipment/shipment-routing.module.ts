import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipmentViewComponent } from './shipment-view/shipment-view.component';
import { ContainerShipmentComponent } from './container-shipment/container-shipment.component';
import { ShipmentComponent } from './shipment.component';
import { ContainerBatchserialComponent } from './container-batchserial/container-batchserial.component';

const routes: Routes = [
  {
     path: '', component: ShipmentComponent , 
    children: [
      { path: '', redirectTo: 'shipment', pathMatch: 'full' },
      { path: 'shipment', component: ShipmentViewComponent} ,
      { path: 'container', component: ContainerShipmentComponent} , 
      { path: 'contnrbatchserial', component: ContainerBatchserialComponent} 
  ]  
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
