import { Component, OnInit} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-shipment-wizard-view',
  templateUrl: './shipment-wizard-view.component.html',
  styleUrls: ['./shipment-wizard-view.component.scss']
})
export class ShipmentWizardViewComponent implements OnInit {
 

  constructor() { }
  // GRID VAIRABLE
  public gridView: any = [{"ProductName":"test"}];
  public items: any[] = [];
  public mySelection: number[] = [];
  public pageSize = 10;
  public skip = 0;
  // GRID VARIABLE

  public value: Date = new Date(2000, 2, 10);
  public currentStep = 1;
  public maxStep = 5;
  ngOnInit() {
  }

  onPrevClick(){
    if(this.currentStep > 1){
      this.currentStep = this.currentStep - 1;
    }    
  }
  onNextClick(){
    if(this.currentStep < this.maxStep){
      this.currentStep = this.currentStep + 1;
    }    
  }

  onStepClick(currentStep){
    this.currentStep = currentStep;
  }


}
