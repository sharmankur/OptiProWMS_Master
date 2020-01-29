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
  SubmitPickTaskData: any[] = [];
  PickTaskDetail: any;
  showLookupLoader: boolean = true;
  showLoader: boolean = false;
  threeSteps: boolean = true;
  pickTaskName: string;
  openQty: number;
  pickQty: number = 0; index = 0;
  PT_Enter_Location: string;
  PT_Enter_ContBtchSer: string;
  ContBtchSerArray: string[] = [];
  OPTM_Tracking: string = 'S';

  constructor(private picktaskService: PickTaskService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.shipmentno = this.translate.instant("PT_ShipmentId") + " " + this.ShipDetail.OPTM_DOCENTRY;
    });
  }

  // GRID VAIRABLE
  public currentStepText = "";
  public currentStep = 1;
  public maxStep = 3;
  // GRID VARIABLE

  ngOnInit() {
    this.ShipDetail = JSON.parse(localStorage.getItem("ShipDetail"));
    this.shipmentno = this.translate.instant("PT_ShipmentId") + " " + this.ShipDetail.OPTM_DOCENTRY;
    if (localStorage.getItem("TaskDetail") == "" || localStorage.getItem("TaskDetail") == undefined) {
      this.getPickTaskList(this.ShipDetail.OPTM_DOCENTRY);
    } else {
      this.PickTaskDetail = JSON.parse(localStorage.getItem("TaskDetail"));
      this.PickTaskList = this.PickTaskDetail.OPTM_WHSTASKLIST;
      this.index = Number(localStorage.getItem("PickItemIndex"));
      this.setVales(this.index);
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
    this.OPTM_Tracking = this.PickTaskList[index].OPTM_TRACKING;

    if (this.OPTM_Tracking == 'S' || this.PickTaskList[index].OPTM_LINETYPE == 1) {
      this.threeSteps = false;
      this.maxStep = 2;
    } else {
      this.threeSteps = true;
      this.maxStep = 3;
    }
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
      if (this.currentStep == 2 && (this.OPTM_Tracking == 'S' || this.PickTaskList[this.index].OPTM_LINETYPE == 1)) {

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
      this.nextStep();
    } else {
      this.toastr.error('', this.translate.instant("PT_Location_not_match"));
      this.PT_Enter_Location = "";
    }
  }

  onLotChange() {
    if (this.PT_Enter_ContBtchSer == undefined || this.PT_Enter_ContBtchSer == "") {
      return;
    }

    if ((this.PickTaskList[this.index].OPTM_LINE_TYPE) == "1") {

    } else {
      let batserAdded = false;
      for (var i = 0; i < this.PickTaskDetail.OPTM_WHSTASK_BTCHSER.length; i++) {
        if (this.PickTaskDetail.OPTM_WHSTASK_BTCHSER[i].OPTM_TASKID == this.PickTaskList[this.index].OPTM_TASKID) {
          if (this.PT_Enter_ContBtchSer === this.PickTaskDetail.OPTM_WHSTASK_BTCHSER[i].OPTM_BTCHSER) {
            batserAdded = true;
            let result = this.ContBtchSerArray.find(element => element == this.PT_Enter_ContBtchSer);
            if (result == undefined) {
              this.ContBtchSerArray.push(this.PT_Enter_ContBtchSer);
              this.toastr.error('', this.translate.instant("DataSaved"));
              if (!this.threeSteps) {
                this.pickQty = this.pickQty + 1;
              }
            } else {
              this.toastr.error('', this.translate.instant("DataAlreadySaved"));
            }
            this.PT_Enter_ContBtchSer = "";

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
    if (localStorage.getItem("From") == "shiplist") {
      if (this.index == this.PickTaskList.length - 1) {
        this.toastr.success('', this.translate.instant("PickedAllTask"));
        return;
      }
      this.clearFields();
      this.index = this.index++;
      this.setVales(this.index);
    }
  }


  onSubmitClick() {
    if(this.SubmitPickTaskData.length > 0){
      this.SubmitPickList();
    }else{
      this.toastr.error('', this.translate.instant("NoRecord"));
    }
  }

  SubmitPickList() {
    this.showLoader = true;
    this.picktaskService.SubmitPickList(this.SubmitPickTaskData).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookupLoader = false;
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.toastr.success('', data[0].RESULT);
            this.onBackClick();
          }else{
            this.SubmitPickTaskData = [];
            this.toastr.error('', data[0].RESULT);
          }
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

  clearFields() {
    this.ContBtchSerArray = [];
    this.PT_Enter_ContBtchSer = "";
    this.PT_Enter_Location = "";
    this.pickQty = 0;
    this.SubmitPickTaskData = [];
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

  public onBackClick() {
    this.clearFields();
    if (localStorage.getItem("From") == "shiplist") {
      this.router.navigate(['home/picking/picking-list'])
    } else {
      this.router.navigate(['home/picking/picking-item-list'])
    }
  }

  preparePickTaskData(): any {
    for (var i = 0; i < this.ContBtchSerArray.length; i++) {
      if (this.OPTM_Tracking == 'B' || this.OPTM_Tracking == 'N') {
        this.SubmitPickTaskData.push(new PickTaskModel(this.ShipDetail.ShipmentId, this.PickTaskList[this.index].OPTM_TASKID, this.PickTaskList[this.index].OPTM_PICK_WHSE, this.PT_Enter_Location, this.ContBtchSerArray[i], this.pickQty));
      } else {
        this.SubmitPickTaskData.push(new PickTaskModel(this.ShipDetail.ShipmentId, this.PickTaskList[this.index].OPTM_TASKID, this.PickTaskList[this.index].OPTM_PICK_WHSE, this.PT_Enter_Location, this.ContBtchSerArray[i], 1));
      }
    }
  }
}
