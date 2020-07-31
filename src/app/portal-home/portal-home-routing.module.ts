import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalHomeComponent } from './portal-home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ContainerShipmentComponent } from '../shipment/container-shipment/container-shipment.component';
import { ContainerBatchserialComponent } from '../shipment/container-batchserial/container-batchserial.component';
import { GeneratePickComponent } from '../shipment-wizard/generate-pick/generate-pick.component';
import { DocumentNumberingComponent } from '../Setup/document-numbering/document-numbering.component';
import { AddItemToContComponent } from '../container-maintenance/add-item-to-cont/add-item-to-cont.component';
import { AutoAllocationComponent } from '../auto-allocation/auto-allocation.component';


const routes: Routes = [
  {
    path: '', component: PortalHomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'containertype', loadChildren: "../container-type/ct.module#CTModule" },
      { path: 'printing-label', loadChildren: "../printing-label/printing-label.module#PrintingLabelModule" },
      { path: 'containertyperelation', loadChildren: "../ctrmaster/ctrmaster.module#CTRMasterModule" },
      { path: 'containerautorule', loadChildren: "../carmaster/carmaster.module#CARMAsterModule" },
      { path: 'dockdoor', loadChildren: "../dock-door/dock-door.module#DockDoorModule" },
      { path: 'shipmentwizard', loadChildren: () => import('../shipment-wizard/shipment-wizard.module').then(m => m.ShipmentWizardModule) },
      { path: 'genearetpicklist', component: GeneratePickComponent },
      { path: 'archiveddata', loadChildren: "../shipment/shipment.module#ShipmentModule" },
      { path: 'shipment', loadChildren: "../shipment/shipment.module#ShipmentModule" },
      { path: 'carrier', loadChildren: "../carrier/carrier.module#CarrierModule" },
      { path: 'binranges', loadChildren: "../bin-range/bin-range.module#BinRangeModule" },
      { path: 'picking', loadChildren: "../picking/picking.module#PickingModule" },
      { path: 'build-parent-container', loadChildren: "../container-creation/container-creation.module#ContainerCreationModule" },
      { path: 'container-group', loadChildren:"../container-group/container-group.module#ContainerGroupModule"},     
      { path: 'whse-bin-layout', loadChildren: "../whse-bin-layout/whse-bin-layout.module#WhseBinLayoutModule" },
      { path:'binrule', loadChildren: "../binrule/binrule.module#BinruleModule" },
      { path: 'Container_List', component: ContainerShipmentComponent } ,
      { path: 'BatchSerial_List', component: ContainerBatchserialComponent } ,
      { path: 'whse-bin-layout', loadChildren: "../whse-bin-layout/whse-bin-layout.module#WhseBinLayoutModule" },
      { path: 'container-maintenance', loadChildren: "../container-maintenance/container-maintenance.module#ContainerMaintenanceModule" },
      { path: 'setup', loadChildren: "../Setup/setup.module#SetupModule" },
      { path: 'DocumentNumbering', component: DocumentNumberingComponent } ,
      { path: 'add-item-container', component: AddItemToContComponent } ,
      { path: 'autoallocation', component: AutoAllocationComponent } ,
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalHomeRoutingModule {
}
