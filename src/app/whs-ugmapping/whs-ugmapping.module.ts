import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhsUGMappingMasterComponent } from './whs-ugmapping-master/whs-ugmapping-master.component';
import { WMSUGMappingAddUpdateComponent } from './wmsugmapping-add-update/wmsugmapping-add-update.component';
import { WhsUGMappingRoutingModule } from './whsugmapping-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';
import { SharedModule, GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';



@NgModule({
  declarations: [WhsUGMappingMasterComponent, WMSUGMappingAddUpdateComponent],
  imports: [
    CommonModule,
    WhsUGMappingRoutingModule,
    PerfectScrollbarModule, 
    FormsModule,
    TrnaslateLazyModule,
    SharedModule,
    GridModule,
    DropDownsModule,
  ]
})
export class WhsUGMappingModule { }
