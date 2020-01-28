import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickTaskService } from '../../services/picktask.service';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { TranslateService, LangChangeEvent } from '../../../../node_modules/@ngx-translate/core';
import { PickTaskModel } from '../../models/PickTaskModel';

@Component({
  selector: 'app-picking-item-details',
  templateUrl: './picking-item-details.component.html',
  styleUrls: ['./picking-item-details.component.scss']
})
export class PickingItemDetailsComponent implements OnInit {

  public gridView: any = [
    {
      "TaskId": "Task123",
      "TaskType": "Type 1",
      "ItemCode": "Item123",
      "Warehouse": "Warehouse123",
      "Quantity": 1,
      "PlanDate": "12-03-2020"
    },
    {
      "TaskId": "Task123",
      "TaskType": "Type 1",
      "ItemCode": "Item123",
      "Warehouse": "Warehouse123",
      "Quantity": 1,
      "PlanDate": "12-03-2020"
    },
    {
      "TaskId": "Task123",
      "TaskType": "Type 1",
      "ItemCode": "Item123",
      "Warehouse": "Warehouse123",
      "Quantity": 1,
      "PlanDate": "12-03-2020"
    },
    {
      "TaskId": "Task123",
      "TaskType": "Type 1",
      "ItemCode": "Item123",
      "Warehouse": "Warehouse123",
      "Quantity": 1,
      "PlanDate": "12-03-2020"
    }
  ];
  ShipDetail: any;
  shipmentno: string;
  PickTaskList: any[] = [];
  PickTaskDetail: any;
  showLookupLoader: boolean = true;
  showLoader: boolean = false;
  pickTaskName: string;
  openQty: number;
  pickQty: number = 0; index = 0;
  PT_Enter_Location: string;
  PT_Enter_ContBtchSer: string;
  ContBtchSerArray: string[] = [];
  Tracking: string;

  constructor(private picktaskService: PickTaskService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.shipmentno = this.translate.instant("PT_ShipmentId") + " " + this.ShipDetail.OPTM_OPTMID;
    });
  }

  // GRID VAIRABLE
  public currentStepText = "";
  public currentStep = 1;
  public maxStep = 3;
  // GRID VARIABLE

  ngOnInit() {
    this.ShipDetail = JSON.parse(localStorage.getItem("ShipDetail"));
    this.shipmentno = this.translate.instant("PT_ShipmentId") + " " + this.ShipDetail.OPTM_OPTMID;
    if (localStorage.getItem("TaskDetail") == "" || localStorage.getItem("TaskDetail") == undefined) {
      this.getPickTaskList(this.ShipDetail.OPTM_OPTMID);
    } else {
      this.PickTaskList.push(JSON.parse(localStorage.getItem("TaskDetail")));
    }
  }

  getPickTaskList(ShipmentId) {
    this.showLoader = true;
    this.picktaskService.GetPickTaskId(ShipmentId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookupLoader = false;
          this.PickTaskList = data.OPTM_WHSTASKLIST;
          this.PickTaskDetail = data;
          this.setVales(this.index);
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  setVales(index) {
    this.pickTaskName = this.PickTaskList[index].OPTM_TASKID;
    this.openQty = this.PickTaskList[index].OPTM_PLANNED_QTY;
    this.Tracking = this.PickTaskList[index].tracking;
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep = this.currentStep - 1;
      this.changeText(this.currentStep)
    }
  }

  nextStep() {
    if (this.currentStep < this.maxStep) {
      if (this.currentStep == 1 && (this.PT_Enter_Location == undefined || this.PT_Enter_Location == "")) {
        this.toastr.error('', this.translate.instant("PT_Location_blank"));
        return;
      } else if (this.currentStep == 2 && (this.PT_Enter_ContBtchSer == undefined || this.PT_Enter_ContBtchSer == "")) {
        this.toastr.error('', this.translate.instant("PT_ContBtchSer_not_blank"));
        return;
      }
      this.currentStep = this.currentStep + 1;
      this.changeText(this.currentStep)
    }
  }

  onLocationChange() {
    if (this.PT_Enter_Location == undefined || this.PT_Enter_Location == "") {
      return;
    }
    if (this.PT_Enter_Location === this.PickTaskList[this.index].OPTM_PICK_BIN) {// location

    } else {
      this.toastr.error('', this.translate.instant("PT_Location_not_match"));
      this.PT_Enter_Location = "";
    }
  }

  onLotChange() {
    if (this.PT_Enter_ContBtchSer == undefined || this.PT_Enter_ContBtchSer == "") {
      return;
    }

    if((this.PickTaskList[this.index].OPTM_LINE_TYPE) == "1"){

    }else{
      let batserAdded = false;
      for (var i = 0; i < this.PickTaskDetail.OPTM_WHSTASK_BTCHSER.length; i++) {
        if (this.PickTaskDetail.OPTM_WHSTASK_BTCHSER[i].OPTM_TASKID == this.PickTaskList[this.index].OPTM_TASKID) {
          if (this.PT_Enter_ContBtchSer === this.PickTaskList[i].OPTM_BTCHSER) {
            batserAdded = true;
            this.ContBtchSerArray.push(this.PT_Enter_ContBtchSer);
            break;
          }
        }
      }
  
      if (!batserAdded) {
        this.toastr.error('', this.translate.instant("PT_ContBtchSer_not_match"));
        this.PT_Enter_ContBtchSer = "";
      }
    }
  }

  onQtyChange() {

  }

  onSaveClick() {
    this.preparePickTaskData();
    if (this.index == this.PickTaskList.length - 1) {
      //do you want to submit
      return;
    }
    this.clearFields();
    this.index = this.index++;
    this.setVales(this.index);
  }

  clearFields() {
    this.ContBtchSerArray = [];
    this.PT_Enter_ContBtchSer = "";
    this.PT_Enter_Location = "";
    this.pickQty = 0;
  }

  changeText(step) {
    if (step == 1) {
      this.currentStepText = this.translate.instant("PT_Scan_To_Location");
    }
    else if (step == 2) {
      this.currentStepText = this.translate.instant("PT_ScantoLotNumber");
    }
    else if (step == 3) {
      this.currentStepText = this.translate.instant("PT_EnterQty");
    }
  }

  public onScreenBackClick() {
    this.clearFields();
    if (localStorage.getItem("From") == "shiplist") {
      this.router.navigate(['home/picking/picking-list'])
    } else {
      this.router.navigate(['home/picking/picking-item-list'])
    }
  }

  preparePickTaskData(): any {
    for (var i = 0; i < this.ContBtchSerArray.length; i++) {
      if (this.Tracking == 'B' || this.Tracking == 'N') {
        this.PickTaskList.push(new PickTaskModel(this.ShipDetail.ShipmentId, this.PickTaskList[this.index].OPTM_TASKID, this.PickTaskList[this.index].OPTM_PICK_WHSE, this.PT_Enter_Location, this.ContBtchSerArray[i], this.pickQty));
      } else {
        this.PickTaskList.push(new PickTaskModel(this.ShipDetail.ShipmentId, this.PickTaskList[this.index].OPTM_TASKID, this.PickTaskList[this.index].OPTM_PICK_WHSE, this.PT_Enter_Location, this.ContBtchSerArray[i], 1));
      }
    }
  }

  onSubmitClick() {

  }
}
