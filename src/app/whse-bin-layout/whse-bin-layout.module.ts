import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhseBinLayoutRoutingModule } from './whse-bin-layout-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { WhseBinLayoutViewComponent } from './whse-bin-layout-view/whse-bin-layout-view.component';
import { WhseBinLayoutAddComponent } from './whse-bin-layout-add/whse-bin-layout-add.component';
import { WhseBinLayoutComponent } from './whse-bin-layout/whse-bin-layout.component';


@NgModule({
  declarations: [WhseBinLayoutComponent, WhseBinLayoutViewComponent, WhseBinLayoutAddComponent],
  imports: [
    CommonModule,
    WhseBinLayoutRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DateInputsModule
  ]
})
export class WhseBinLayoutModule { }
