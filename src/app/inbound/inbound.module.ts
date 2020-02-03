import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InboundRoutingModule } from './inbound-routing.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CTUpdateComponent } from './ctupdate/ctupdate.component';
import { CTViewComponent } from './ctview/ctview.component';
import { CTMasterComponent } from './ctmaster.component';


@NgModule({
  declarations: [CTViewComponent, CTMasterComponent, CTUpdateComponent],
  imports: [
    CommonModule,
    GridModule,
    SharedModule,
    
    TrnaslateLazyModule,
    PerfectScrollbarModule, 
    FormsModule,

    InboundRoutingModule,
    DropDownsModule,
    DateInputsModule
  ],
  providers: [ 
    CTMasterComponent
  ],
  exports: [CTViewComponent, CTMasterComponent, CTUpdateComponent]
})
export class InboundModule { }
