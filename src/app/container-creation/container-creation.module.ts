import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerCreationRoutingModule } from './container-creation-routing.module';
import { CreateContainerComponent } from './create-container/create-container.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CcmainComponent } from './ccmain/ccmain.component';
import { ContainerOperationComponent } from './container-operation/container-operation.component';


@NgModule({
  declarations: [CreateContainerComponent, CcmainComponent, ContainerOperationComponent],
  imports: [
    CommonModule,
    ContainerCreationRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DateInputsModule
  ],
  exports: [CcmainComponent, ContainerOperationComponent],
  providers: [CcmainComponent, ContainerOperationComponent]
})
export class ContainerCreationModule { }
