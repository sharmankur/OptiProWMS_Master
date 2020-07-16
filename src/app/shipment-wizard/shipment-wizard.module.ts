import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ShipmentWizardRoutingModule } from './shipment-wizard-routing.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ShipmentWizardMasterComponent } from './shipment-wizard-master.component';
import { ShipmentWizardViewComponent } from './shipment-wizard-view/shipment-wizard-view.component';
import { ShipmentPreviewListComponent } from './shipment-preview-list/shipment-preview-list.component';
import { ShipmentDetailsListComponent } from './shipment-details-list/shipment-details-list.component';
import { DialogsModule } from '../../../node_modules/@progress/kendo-angular-dialog';

@NgModule({
  declarations: [ShipmentDetailsListComponent, ShipmentWizardMasterComponent, ShipmentWizardViewComponent, ShipmentPreviewListComponent],
  imports: [
    CommonModule,
    GridModule,
    SharedModule,
    DialogsModule,
    TrnaslateLazyModule,
    PerfectScrollbarModule, 
    FormsModule,

    ShipmentWizardRoutingModule,
    DropDownsModule,
    DateInputsModule
  ],
  providers: [ 
   // InboundGRPOComponent,InboundMasterComponent // added class in the providers
  ],
  exports: [
  //  InboundGRPOComponent,InboundDetailsComponent, InboundMasterComponent, InboundPolistComponent
  ]
})
export class ShipmentWizardModule { }
