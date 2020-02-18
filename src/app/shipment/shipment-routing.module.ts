import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipmentViewComponent } from './shipment-view/shipment-view.component';
import { ShipmentComponent } from './shipment.component';

const routes: Routes = [
  {
     path: '', component: ShipmentComponent , 
    children: [
      { path: '', redirectTo: 'shipment', pathMatch: 'full' },
      { path: 'shipment', component: ShipmentViewComponent} ,
     // { path: 'container', component: ContainerShipmentComponent} , 
    //  { path: 'Container_List', component: ContainerShipmentComponent} ,
   //   { path: 'BatchSerial_List', component: ContainerBatchserialComponent} 
  ]  
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
