import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinRangeRoutingModule } from './binrange-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BinRangeMainComponent } from './bin-range-main/bin-range-main.component';
import { BinRangeUpdateComponent } from './bin-range-update/bin-range-update.component';
import { BinRangeViewComponent } from './bin-range-view/bin-range-view.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';


@NgModule({
  declarations: [BinRangeMainComponent, BinRangeUpdateComponent, BinRangeViewComponent],
  imports: [
    CommonModule,
    BinRangeRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    NgxTrimDirectiveModule
  ]
})
export class BinRangeModule { }
