import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ShipmentComponent } from './shipment.component';
import { ShipmentViewComponent } from './shipment-view/shipment-view.component';
import { ShipmentRoutingModule } from './shipment-routing.module';
import { DialogsModule } from '../../../node_modules/@progress/kendo-angular-dialog';
import { ContainerShipmentComponent } from './container-shipment/container-shipment.component';

@NgModule({
  declarations: [ShipmentComponent, ShipmentViewComponent, ContainerShipmentComponent],
  imports: [
    CommonModule,
    GridModule,
    SharedModule,    
    DialogsModule,
    TrnaslateLazyModule,
    PerfectScrollbarModule, 
    FormsModule,
    ShipmentRoutingModule,
    DropDownsModule,
    DateInputsModule
  ],
  providers: [],
  exports: []
})
export class ShipmentModule { }
