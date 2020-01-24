import { Component, OnInit} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-picking-item-details',
  templateUrl: './picking-item-details.component.html',
  styleUrls: ['./picking-item-details.component.scss']
})
export class PickingItemDetailsComponent implements OnInit {
 

  constructor(private router: Router) { }
  // GRID VAIRABLE
  public currentStepText = "Scan To Location";
  public currentStep = 1;
  public maxStep = 3;
  // GRID VARIABLE

  
  ngOnInit() {
  }

 
  
  prevStep(){
    if(this.currentStep > 1){
      this.currentStep = this.currentStep -1;
      this.changeText(this.currentStep)
    }
    
  }
  nextStep(){
    if(this.currentStep < this.maxStep ){
      this.currentStep = this.currentStep + 1;
      this.changeText(this.currentStep)
    }
  }

  changeText(step){
    if(step == 1){
      this.currentStepText = "Scan To Location";
    }
    else if( step == 2){
      this.currentStepText = 'Scan to Lot Number'
    }
    else if(step == 3){
      this.currentStepText = 'Enter Qty'
    }
  }

  public onNavClick(rul){
    this.router.navigate(['home/picking/picking-item-list'])
  }


}
