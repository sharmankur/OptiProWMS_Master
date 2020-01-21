import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdjustmentsCountingRoutingModule } from './adjustments-counting-routing.module';
import { PhysicalCountComponent } from './physical-count/physical-count.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';

@NgModule({
  declarations: [PhysicalCountComponent],
  imports: [
    CommonModule,
    GridModule,
    SharedModule,
    PerfectScrollbarModule,
    TrnaslateLazyModule,
    FormsModule,
    DialogsModule,
    AdjustmentsCountingRoutingModule
  ]
})
export class AdjustmentsCountingModule { }
