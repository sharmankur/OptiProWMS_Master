import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CARMainComponent } from './carmain/carmain.component';
import { CARMasterRoutingModule } from './carmaster-routing.module';
import { CARViewComponent } from './carview/carview.component';
import { CARUpdateComponent } from './carupdate/carupdate.component';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

@NgModule({
  declarations: [CARMainComponent, CARViewComponent, CARUpdateComponent],
  imports: [
    CommonModule,
    GridModule,
    SharedModule,
    TrnaslateLazyModule,
    PerfectScrollbarModule, 
    FormsModule,
    CARMasterRoutingModule,
    DropDownsModule,
    DateInputsModule,
    DialogsModule,
    NgxTrimDirectiveModule
  ],
  providers: [ 
    CARMainComponent // added class in the providers
  ],
  exports: [CARMainComponent]
})
export class CARMAsterModule { }

