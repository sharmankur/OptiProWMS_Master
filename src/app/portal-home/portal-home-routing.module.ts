import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { SalesOrderListComponent } from '../sales-order/sales-order-list/sales-order-list.component';
import { PortalHomeComponent } from './portal-home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
// import { FormFieldComponent } from '../form/form-field/form-field.component';
import { BinTransferComponent } from '../inventory-transfer/bin-transfer/bin-transfer.component';
import { WhsTransferComponent } from '../inventory-transfer/whs-transfer/whs-transfer.component';
import { ChangeWarehouseComponent } from '../change-warehouse/change-warehouse.component';
import { SplitTransferComponent } from '../palletization/split-transfer/split-transfer.component';
import { PalletMergeComponent } from '../palletization/pallet-merge/pallet-merge.component';
import { DepalletizeComponent } from '../palletization/depalletize/depalletize.component';
import { PalletizeComponent } from '../palletization/palletize/palletize.component';
import { InventoryTransferbyITRMasterComponent } from '../inventory-transfer/inventory-transferby-itrmaster/inventory-transferby-itrmaster.component';
import { ITRLIstComponent } from '../inventory-transfer/itrlist/itrlist.component';

const routes: Routes = [

  {
    path: '', component: PortalHomeComponent,
    children: [
      { path:'dashboard', component:DashboardComponent },
      { path:'binTransfer', component:BinTransferComponent },
      { path:'whsTransfer', component:WhsTransferComponent },
      { path: 'InventoryTransferRequest', component:WhsTransferComponent  },
      { path: 'InventoryTransferbyITR', component:InventoryTransferbyITRMasterComponent  },
      { path:'changeWarehouse', component:ChangeWarehouseComponent },
      { path:'containertype', loadChildren:"../inbound/inbound.module#InboundModule"},     
      { path: 'adjustment-counting', loadChildren: "../adjustments-counting/adjustments-counting.module#AdjustmentsCountingModule" }, 
      { path: 'production', loadChildren: "../production/production.module#ProductionModule" },
      { path: 'printing-label', loadChildren: "../printing-label/printing-label.module#PrintingLabelModule" },
      { path:'containertyperelation', loadChildren: "../ctrmaster/ctrmaster.module#CTRMasterModule" },
      { path:'containerautorule', loadChildren: "../carmaster/carmaster.module#CARMAsterModule" },
      { path:'palletization', loadChildren: "../palletization/palletization.module#PalletizationModule" },
      { path:'split-transfer', component:SplitTransferComponent },
      { path:'pallet-merge', component:PalletMergeComponent },
      { path:'depalletize', component:DepalletizeComponent },
      { path:'palletize', component:PalletizeComponent },
      { path:'dockdoor', loadChildren:"../dock-door/dock-door.module#DockDoorModule"},
      { path:'whsUGMapping', loadChildren:"../whs-ugmapping/whs-ugmapping.module#WhsUGMappingModule"},
      { path:'shipmentwizard', loadChildren: () => import('../shipment-wizard/shipment-wizard.module').then(m => m.ShipmentWizardModule)},
      // { path:'picking', loadChildren:() => import('../picking/picking.module').then(m => m.PickingModule)},
      // { path:'picking', loadChildren:() => import('../picking/picking.module').then(m => m.PickingModule)},
      // { path:'shipment', loadChildren:() => import('../shipment/shipment.module').then(m => m.ShipmentModule)},    
      { path: 'shipment', loadChildren: "../shipment/shipment.module#ShipmentModule" },  
      { path: 'masking', loadChildren: "../masking/masking.module#MaskingModule" },
      { path: 'carrier', loadChildren: "../carrier/carrier.module#CarrierModule" },
      { path: 'picking', loadChildren: "../picking/picking.module#PickingModule" },
      { path: 'container-creation', loadChildren: "../container-creation/container-creation.module#ContainerCreationModule" },
      { path: 'container-group', loadChildren:"../container-group/container-group.module#ContainerGroupModule"},     
      { path: 'whse-bin-layout', loadChildren: "../whse-bin-layout/whse-bin-layout.module#WhseBinLayoutModule" },
      { path:'binrule', loadChildren: "../binrule/binrule.module#BinruleModule" }
    ]
    
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalHomeRoutingModule {  
}
