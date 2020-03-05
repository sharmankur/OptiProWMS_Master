import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarrierRoutingModule } from './carrier-routing.module';
import { CarrierMainComponent } from './carrier-main/carrier-main.component';
import { CarrierViewComponent } from './carrier-view/carrier-view.component';
import { CarrierUpdateComponent } from './carrier-update/carrier-update.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';


@NgModule({
  declarations: [CarrierMainComponent, CarrierViewComponent, CarrierUpdateComponent],
  imports: [
    CommonModule,
    CarrierRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DateInputsModule
  ]
})
export class CarrierModule { }
