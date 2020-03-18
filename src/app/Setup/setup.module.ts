import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { TrnaslateLazyModule } from '../../translate-lazy.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { SetupRoutingModule } from './setup-routing.module';
import { TransactionStepSetupComponent } from './transaction-step-setup/transaction-step-setup.component';
import { DocumentNumberingComponent } from './document-numbering/document-numbering.component';

@NgModule({
  declarations: [TransactionStepSetupComponent,DocumentNumberingComponent],
  imports: [
    CommonModule,
    GridModule,
    SharedModule,    
    TrnaslateLazyModule,
    PerfectScrollbarModule, 
    FormsModule,    
    DropDownsModule,
    DateInputsModule,
    SetupRoutingModule
  ],
  providers: [],
  exports: []
})
export class SetupModule { }
