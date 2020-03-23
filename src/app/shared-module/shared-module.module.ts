import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LookupComponent } from '../common/lookup/lookup.component';
import { ComonConfirmDialogComponent } from '../common/comon-confirm-dialog/comon-confirm-dialog.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { FormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import {ConfirmDialogComponent} from '../common/confirm-dialog/confirm-dialog/confirm-dialog.component';
import {ConfirmdialogService} from '../common/confirm-dialog/confirmdialog.service';
import {DisplayPdfComponent} from '../printing-label/display-pdf/display-pdf.component';
import {PdfpipePipe} from '../printing-label/pdfpipe.pipe';
import {NumberFormatPipe} from '../common/number-format.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InputDialogComponent } from '../common/input-dialog/input-dialog.component';
import { StatePersistingServiceService } from '../services/state-persisting-service.service';
import { CommonLookupComponent } from '../common/common-lookup/common-lookup.component';
import { InputContainerCodeComponent } from '../common/input-container-code/input-container-code.component';
import { TrnaslateLazyModule } from 'src/translate-lazy.module';
import { PickListStatusPipe } from '../common/pick-list-status.pipe';
import { PickOperationPipe } from '../common/pick-operation.pipe';
import { PickTypePipe } from '../common/pick-type.pipe';
import { TransferMeansPipe } from '../common/transfer-means.pipe';
import { InputParentContainerComponent } from '../common/input-parent-container/input-parent-container.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
@NgModule({  
  imports: [ CommonModule, 
    GridModule, 
    FormsModule,
    InputsModule,
    DropDownsModule ,
    DialogsModule,PdfViewerModule,
    TrnaslateLazyModule],
    providers:[ ConfirmdialogService,StatePersistingServiceService],
  declarations: [ LookupComponent,ConfirmDialogComponent,ComonConfirmDialogComponent,DisplayPdfComponent, CommonLookupComponent,
    PdfpipePipe,NumberFormatPipe,PickListStatusPipe,PickOperationPipe,PickTypePipe,TransferMeansPipe, InputDialogComponent, InputContainerCodeComponent,InputParentContainerComponent],
  entryComponents: [ ConfirmDialogComponent,DisplayPdfComponent, InputDialogComponent, CommonLookupComponent, InputContainerCodeComponent,InputParentContainerComponent],
  exports:      [ LookupComponent,ConfirmDialogComponent,ComonConfirmDialogComponent,InputParentContainerComponent,
    DisplayPdfComponent,PdfpipePipe,NumberFormatPipe,PickListStatusPipe,PickOperationPipe,PickTypePipe,TransferMeansPipe, InputDialogComponent, CommonLookupComponent, InputContainerCodeComponent]
    
})
export class SharedModule { }
