import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerCreationRoutingModule } from './container-creation-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CcmainComponent } from './ccmain/ccmain.component';
import { BuildParentContainerComponent } from './build-parent-container/build-parent-container.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { DialogsModule } from '../../../node_modules/@progress/kendo-angular-dialog';


@NgModule({
  declarations: [CcmainComponent, BuildParentContainerComponent],
  imports: [
    CommonModule,
    ContainerCreationRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DateInputsModule,
    TreeViewModule,
    DialogsModule
  ],
  exports: [CcmainComponent],
  providers: [CcmainComponent]
})
export class ContainerCreationModule { }
