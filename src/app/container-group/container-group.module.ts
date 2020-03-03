import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainergroupmainComponent } from './containergroupmain/containergroupmain.component';
import { ContainergroupupdateComponent } from './containergroupupdate/containergroupupdate.component';
import { ContainergroupviewComponent } from './containergroupview/containergroupview.component';
import { ContainerGroupRoutingModule } from './container-group-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';

import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { SharedModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [ContainergroupmainComponent, ContainergroupupdateComponent, ContainergroupviewComponent],
  imports: [
    CommonModule,
    ContainerGroupRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DateInputsModule
  ]
})

export class ContainerGroupModule { }
