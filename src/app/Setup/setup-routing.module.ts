import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionStepSetupComponent } from './transaction-step-setup/transaction-step-setup.component';
import { DocumentNumberingComponent } from './document-numbering/document-numbering.component';


const routes: Routes = [
    { path: '', component: TransactionStepSetupComponent},
     
      { path: 'doc-number', component: DocumentNumberingComponent },
      { path: 'trans-setup', component: TransactionStepSetupComponent }
    
  ]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
