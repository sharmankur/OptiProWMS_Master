import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BinruleRoutingModule } from './binrule-routing.module';
import { GridModule} from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared-module/shared-module.module';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { BinrulemasterComponent } from './binrulemaster/binrulemaster.component';
import { BinruleAddUpdateComponent } from './binrule-add-update/binrule-add-update.component';
import { BinruleviewComponent } from './binruleview/binruleview.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';


@NgModule({
  declarations: [BinrulemasterComponent, BinruleAddUpdateComponent, BinruleviewComponent],
  imports: [
    CommonModule,
    BinruleRoutingModule,
    CommonModule,
    GridModule,
    SharedModule,
    TrnaslateLazyModule,
    PerfectScrollbarModule, 
    FormsModule,
    DropDownsModule,
    DateInputsModule,
    DialogsModule,
    NgxTrimDirectiveModule
  ]
})
export class BinruleModule { }
