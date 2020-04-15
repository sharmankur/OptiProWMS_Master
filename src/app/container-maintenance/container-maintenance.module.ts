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
import { ContainerCreationModule } from '../container-creation/container-creation.module';
import { ContMaintnceComponent } from './cont-maintnce/cont-maintnce.component';
import { AddItemToContComponent } from './add-item-to-cont/add-item-to-cont.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';


@NgModule({
  declarations: [ContMaintnceMainComponent, ContMaintnceComponent, AddItemToContComponent],
  imports: [
    CommonModule,
    ContainerMaintenanceRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DateInputsModule,
    ContainerCreationModule,
    TreeViewModule
  ],
  exports: [ContMaintnceComponent],
  providers: [ContMaintnceComponent]
})
export class ContainerMaintenanceModule { }
