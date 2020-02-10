import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipmentViewComponent } from './shipment-view/shipment-view.component';
import { ContainerShipmentComponent } from './container-shipment/container-shipment.component';

const routes: Routes = [
  {
     path: '', component: ShipmentViewComponent , 
    children: [
    { path: 'container', component: ContainerShipmentComponent} ,
  ]  
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
