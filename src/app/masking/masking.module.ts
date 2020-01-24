import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaskingRoutingModule } from './masking-routing.module';
import { ItemCodeGenerationComponent } from './item-code-generation/item-code-generation.component';
import { ItemCodeGenerationViewComponent } from './item-code-generation-view/item-code-generation-view.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ItemCodeGenerationAddComponent } from './item-code-generation-add/item-code-generation-add.component';


@NgModule({
  declarations: [ItemCodeGenerationComponent, ItemCodeGenerationViewComponent, ItemCodeGenerationAddComponent],
  imports: [
    CommonModule,
    MaskingRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DateInputsModule
  ]
})
export class MaskingModule { }
