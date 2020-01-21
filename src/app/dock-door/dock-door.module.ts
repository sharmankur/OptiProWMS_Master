import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockdoormainComponent } from './dockdoormain/dockdoormain.component';
import { DockDoorRoutingModule } from './dockdoor-routing.module';
import { DockdoorupdateComponent } from './dockdoorupdate/dockdoorupdate.component';
import { DockdoorviewComponent } from './dockdoorview/dockdoorview.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
  declarations: [DockdoormainComponent, DockdoorupdateComponent, DockdoorviewComponent],
  imports: [
    CommonModule,
    DockDoorRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DateInputsModule
  ]
})
export class DockDoorModule { }
