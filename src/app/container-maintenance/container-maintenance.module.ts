import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerMaintenanceRoutingModule } from './container-maintenance-routing.module';
import { ContMaintnceMainComponent } from './cont-maintnce-main/cont-maintnce-main.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';


@NgModule({
  declarations: [ContMaintnceMainComponent],
  imports: [
    CommonModule,
    ContainerMaintenanceRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DateInputsModule
  ]
})
export class ContainerMaintenanceModule { }
