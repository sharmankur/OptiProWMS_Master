import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalHomeRoutingModule } from './portal-home-routing.module';
import { PortalLeftComponent } from './portal-left/portal-left.component';
// import { PortalRightComponent } from './portal-right/portal-right.component';
import { PortalTopComponent } from './portal-top/portal-top.component';
import { PortalHomeComponent } from './portal-home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AngularSvgIconModule } from 'angular-svg-icon';


import 'hammerjs';

// import { FormModule } from '../form/form.module';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { InventoryTransferModule } from '../inventory-transfer/inventory-transfer.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeWarehouseComponent } from '../change-warehouse/change-warehouse.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared-module/shared-module.module';
import { CTRMasterModule } from '../ctrmaster/ctrmaster.module';
import { CARMAsterModule } from '../carmaster/carmaster.module';
import { DockDoorModule } from '../dock-door/dock-door.module';
import { MaskingModule } from '../masking/masking.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarrierModule } from '../carrier/carrier.module';
import { WhsUGMappingModule } from '../whs-ugmapping/whs-ugmapping.module';
import { ContainerGroupModule } from '../container-group/container-group.module';
import { WhseBinLayoutModule } from '../whse-bin-layout/whse-bin-layout.module';
import { ContainerShipmentComponent } from '../shipment/container-shipment/container-shipment.component';
import { ContainerBatchserialComponent } from '../shipment/container-batchserial/container-batchserial.component';
import { ShipmentModule } from '../shipment/shipment.module';
import { GeneratePickComponent } from '../shipment-wizard/generate-pick/generate-pick.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ContainerMaintenanceModule } from '../container-maintenance/container-maintenance.module';
import { SetupModule } from '../Setup/setup.module';
import { BinRangeModule } from '../bin-range/bin-range.module';
import { CTModule } from '../container-type/ct.module';
import { DialogsModule } from '../../../node_modules/@progress/kendo-angular-dialog';

@NgModule({
  imports: [
    CommonModule, 
    PortalHomeRoutingModule,
    DateInputsModule,
    // BS
    AngularSvgIconModule, 
    //  BsDropdownModule.forRoot(),
     BsDropdownModule.forRoot(),
    PerfectScrollbarModule,
    TrnaslateLazyModule,
    DropDownsModule,
    // Angular
    HttpClientModule,         
    FormsModule,
    NgbModule,
    DialogsModule,
    CommonModule, 
    GridModule,
    SharedModule,
    DockDoorModule,
    CTModule,
    CTRMasterModule,
    CARMAsterModule,
    InventoryTransferModule,
    MaskingModule,
    CarrierModule,
    WhsUGMappingModule,
    ContainerGroupModule,
    WhseBinLayoutModule,
    ShipmentModule,
    DateInputsModule,
    ContainerMaintenanceModule,
    SetupModule,
    BinRangeModule,
    ContainerMaintenanceModule
  ],
  declarations: [PortalHomeComponent, PortalLeftComponent, PortalTopComponent, DashboardComponent, ChangeWarehouseComponent,
    ContainerBatchserialComponent,GeneratePickComponent],
  providers:[DashboardComponent , GeneratePickComponent]

})
export class PortalHomeModule { }
 