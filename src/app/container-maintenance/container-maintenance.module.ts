import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerMaintenanceRoutingModule } from './container-maintenance-routing.module';
import { ContMaintnceMainComponent } from './cont-maintnce-main/cont-maintnce-main.component';


@NgModule({
  declarations: [ContMaintnceMainComponent],
  imports: [
    CommonModule,
    ContainerMaintenanceRoutingModule
  ]
})
export class ContainerMaintenanceModule { }
