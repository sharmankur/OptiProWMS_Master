import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PickTaskService } from '../../services/picktask.service';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { PickTaskModel } from '../../models/PickTaskModel';
import { BtchNoneModel } from '../../models/BtchNoneModel';

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
  showbtchser: any[] = [];
  hideLookup = true;
  lookupfor: string;
  serviceData: any[]=[];
  PickTaskDetail: any;
  showLookupLoader: boolean = true;
  showLoader: boolean = false;
  threeSteps: boolean = true;
  pickTaskName: string;
  openQty: number;
  totalpickQty: number = 0;
  pickQty: number = undefined; index = 0;
  PT_Enter_Location: string;
  PT_Enter_ContBtchSer: string;
  ContBtchSerArray: string[] = [];
  BtchNoneArray: any[] = [];
  Location: string = "Location";
  locationValue: string = "";
  OPTM_Tracking: string = 'S';
  itemcodeLabel: string;
  itemcodeValue: string;
  showLocation: boolean;
  ShipmentList: any[] = [];
  totalPickTask: Number;
  dialogOpened: boolean = false;
  @ViewChild('focusOnSerNo', { static: false }) focusOnSerNo;
  @ViewChild('focusOnLocation', { static: false }) focusOnLocation;


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
    this.ShipmentList[0] = this.ShipDetail;
    this.shipmentno = this.translate.instant("PT_ShipmentId") + " " + this.ShipDetail.OPTM_DOCENTRY;
    if (localStorage.getItem("TaskDetail") == "" || localStorage.getItem("TaskDetail") == undefined) {
      this.getPickTaskList(this.ShipDetail.OPTM_DOCENTRY);
    } else {
      this.PickTaskDetail = JSON.parse(localStorage.getItem("TaskDetail"));
      this.PickTaskList = this.PickTaskDetail.OPTM_WHSTASKLIST;
      this.index = Number(localStorage.getItem("PickItemIndex"));
      this.setVales(this.index);
    }
    let customizationDetail = this.commonservice.getCustomizationDetail();
    this.hideShowFields(customizationDetail);
  }

  hideShowFields(customizationDetail) {
    this.showLocation = customizationDetail.PickTaskLocation;
    if (!this.showLocation) {
      this.nextStep();
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
    this.locationValue = this.PickTaskList[index].OPTM_PICK_BIN;
    if (this.PickTaskList[index].OPTM_LINETYPE == 1) {
      this.itemcodeLabel = this.translate.instant("ContainerId");
      this.itemcodeValue = this.PickTaskDetail.OPTM_WHSTASK_DTL[index].OPTM_CONTAINERID;
    } else {
      this.itemcodeLabel = this.translate.instant("ItemCode");
      this.itemcodeValue = this.PickTaskList[index].OPTM_ITEMCODE;
    }

    if (this.OPTM_Tracking == 'S' || this.PickTaskList[index].OPTM_LINETYPE == 1) {
      this.threeSteps = false;
      this.maxStep = 2;
    } else {
      this.threeSteps = true;
      this.maxStep = 3;
    }
    if (this.currentStep == 1) {
      setTimeout(() => {
        this.focusOnLocation.nativeElement.focus();
      }, 500)
    }
    this.totalPickTask = this.PickTaskList.length;
  }

  prevStep() {
    if (this.currentStep > 1) {
      if (this.currentStep == 3 && this.OPTM_Tracking == 'N') {
        this.currentStep = this.currentStep - 2;
      } else {
        this.currentStep = this.currentStep - 1;
      }
      this.changeText(this.currentStep)
    }
  }

  nextStep() {
    if (this.currentStep < this.maxStep) {
      if (this.currentStep == 1 && this.showLocation && (this.PT_Enter_Location == undefined || this.PT_Enter_Location == "")) {
        this.toastr.error('', this.translate.instant("PT_Location_blank"));
        return;
      } else if (this.currentStep == 2 && (this.PT_Enter_ContBtchSer == undefined || this.PT_Enter_ContBtchSer == "")) {
        this.toastr.error('', this.translate.instant("PT_ContBtchSer_not_blank"));
        return;
      }
      if (this.currentStep == 2 && (this.OPTM_Tracking == 'S' || this.PickTaskList[this.index].OPTM_LINETYPE == 1)) {
        return;
      }
      if (this.currentStep == 1 && this.OPTM_Tracking == 'N') {
        this.currentStep = this.currentStep + 2;
      } else {
        this.currentStep = this.currentStep + 1;
      }
      if (this.currentStep == 2) {
        setTimeout(() => {
          this.focusOnSerNo.nativeElement.focus();
        }, 500)
      }

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
    let batserAdded = false;
    if ((this.PickTaskList[this.index].OPTM_LINE_TYPE) == "1") {
      for (var i = 0; i < this.PickTaskDetail.OPTM_WHSTASK_DTL.length; i++) {
        if (this.PickTaskDetail.OPTM_WHSTASK_DTL[i].OPTM_TASKID == this.PickTaskList[this.index].OPTM_TASKID) {
          if (this.PT_Enter_ContBtchSer === this.PickTaskDetail.OPTM_WHSTASK_DTL[i].OPTM_CONTAINERID) {
            batserAdded = true;
            let result = this.ContBtchSerArray.find(element => element == this.PT_Enter_ContBtchSer);
            if (result == undefined) {
              this.ContBtchSerArray.push(this.PT_Enter_ContBtchSer);
              if (!this.threeSteps) {
                this.totalpickQty = this.totalpickQty + 1;
                this.PT_Enter_ContBtchSer = "";
              }
            } else {
              this.toastr.error('', this.translate.instant("DataAlreadySaved"));
              this.PT_Enter_ContBtchSer = "";
            }
            break;
          }
        }
      }
    } else {
      for (var i = 0; i < this.PickTaskDetail.OPTM_WHSTASK_BTCHSER.length; i++) {
        if (this.PickTaskDetail.OPTM_WHSTASK_BTCHSER[i].OPTM_TASKID == this.PickTaskList[this.index].OPTM_TASKID) {
          if (this.PT_Enter_ContBtchSer === this.PickTaskDetail.OPTM_WHSTASK_BTCHSER[i].OPTM_BTCHSER) {
            batserAdded = true;
            let result = this.ContBtchSerArray.find(element => element == this.PT_Enter_ContBtchSer);
            if (result == undefined) {
              if (!this.threeSteps) {
                this.ContBtchSerArray.push(this.PT_Enter_ContBtchSer);
                this.totalpickQty = this.totalpickQty + 1;
                this.PT_Enter_ContBtchSer = "";
              } else {
                this.nextStep();
              }
            } else {
              this.toastr.error('', this.translate.instant("DataAlreadySaved"));
              this.PT_Enter_ContBtchSer = "";
            }
            break;
          }
        }
      }
    }
    if (!batserAdded) {
      this.toastr.error('', this.translate.instant("PT_ContBtchSer_not_match"));
      this.PT_Enter_ContBtchSer = "";
    }
    setTimeout(() => {
      this.focusOnSerNo.nativeElement.focus();
    }, 500)
  }

  onQtyChange() {
    // if (this.pickQty != undefined) {
    //   let sum = 0;
    //   for (var i = 0; i < this.BtchNoneArray.length; i++) {
    //     sum = sum + this.BtchNoneArray[i].OPTM_Qty;
    //   }
    //   if ((sum + this.pickQty) <= this.openQty) {
    //     this.totalpickQty = sum + this.pickQty;
    //   } else {
    //     this.toastr.error('', this.translate.instant("Inbound_NoOpenQuantityValid"));
    //     this.pickQty = undefined;
    //   }
    // }
  }

  // conConfirmClick() {
  //   let result = this.BtchNoneArray.find(element => element.PT_Enter_ContBtchSer == this.PT_Enter_ContBtchSer);
  //   if (result == undefined) {
  //     this.BtchNoneArray.push(new BtchNoneModel(this.PT_Enter_Location, this.PT_Enter_ContBtchSer, this.pickQty));
  //     this.currentStep = 1;
  //     this.PT_Enter_Location = "";
  //     this.PT_Enter_ContBtchSer = "";
  //     this.pickQty = undefined;
  //   } else {
  //     this.toastr.error('', this.translate.instant("DataAlreadySaved"));
  //   }
  // }

  onSaveClick() {
    if (this.ContBtchSerArray.length <= 0 && !this.threeSteps) {
      this.toastr.error('', this.translate.instant("NoRecord"));
      return;
    }
    if (this.threeSteps) {

      if (this.pickQty != undefined || this.pickQty != 0) {
        let sum = 0;
        for (var i = 0; i < this.BtchNoneArray.length; i++) {
          sum = sum + this.BtchNoneArray[i].OPTM_Qty;
        }
        if ((sum + this.pickQty) <= this.openQty) {
          this.totalpickQty = sum + this.pickQty;
        } else {
          this.toastr.error('', this.translate.instant("Inbound_NoOpenQuantityValid"));
          this.pickQty = undefined;
          return;
        }
      } else {
        this.toastr.error('', this.translate.instant("ProdReceipt_QtyGraterThenZero"));
        return;
      }

      let result = this.BtchNoneArray.find(element => element.PT_Enter_ContBtchSer == this.PT_Enter_ContBtchSer);
      if (result == undefined) {
        this.BtchNoneArray.push(new BtchNoneModel(this.PT_Enter_Location, this.PT_Enter_ContBtchSer, this.pickQty));
      } else {
        this.toastr.error('', this.translate.instant("DataAlreadySaved"));
      }
      this.PT_Enter_Location = "";
      this.PT_Enter_ContBtchSer = "";
      this.pickQty = undefined;

      if (Number(this.totalpickQty) != Number(this.openQty)) {
        this.currentStep = 1;
        return;
      }
    }
    if (localStorage.getItem("From") == "shiplist") {
      // if(this.SubmitPickTaskData.length > 0)
    } else {
      if (this.SubmitPickTaskData.length > 0) {
        this.toastr.error('', this.translate.instant("DataAlreadySaved"));
        return;
      }
    }

    this.preparePickTaskData();
    if (localStorage.getItem("From") == "shiplist") {
      if (this.index == this.PickTaskList.length - 1) {
        this.toastr.success('', this.translate.instant("PickedAllTask"));
        return;
      }
      this.clearFields();
      this.index = this.index + 1;
      this.setVales(this.index);
    }
    this.currentStep = 1;
    this.toastr.success('', this.translate.instant("DataSaved"));
  }


  onSubmitClick() {
    if (this.SubmitPickTaskData.length > 0) {
      this.SubmitPickList();
    } else {
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
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', data[0].RESULT);
            this.onBackClick();
          } else {

            this.toastr.error('', data[0].RESULT);
          }
          this.SubmitPickTaskData = [];
        } else {
          // this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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
    this.BtchNoneArray = [];
    this.PT_Enter_ContBtchSer = "";
    this.PT_Enter_Location = "";
    this.pickQty = undefined;
    this.totalpickQty = 0;
    // this.SubmitPickTaskData = [];
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
    if (this.OPTM_Tracking == 'B' || this.OPTM_Tracking == 'N') {
      for (var i = 0; i < this.BtchNoneArray.length; i++) {
        this.SubmitPickTaskData.push(new PickTaskModel(this.ShipDetail.OPTM_DOCENTRY, this.PickTaskList[this.index].OPTM_TASKID, this.PickTaskList[this.index].OPTM_PICK_WHSE, this.BtchNoneArray[i].OPTM_Location, this.BtchNoneArray[i].OPTM_ContBtchSer, this.BtchNoneArray[i].OPTM_Qty));
      }
    } else {
      for (var i = 0; i < this.ContBtchSerArray.length; i++) {
        this.SubmitPickTaskData.push(new PickTaskModel(this.ShipDetail.OPTM_DOCENTRY, this.PickTaskList[this.index].OPTM_TASKID, this.PickTaskList[this.index].OPTM_PICK_WHSE, this.PT_Enter_Location, this.ContBtchSerArray[i], 1));
      }
    }
  }

  ShowBatchSerials(): any {
    this.showbtchser = [];
    for (var i = 0; i < this.PickTaskDetail.OPTM_WHSTASK_BTCHSER.length; i++) {
      if(this.PickTaskDetail.OPTM_WHSTASK_BTCHSER[i].OPTM_TASKID == this.pickTaskName){
        this.showbtchser.push(this.PickTaskDetail.OPTM_WHSTASK_BTCHSER[i]);
      }
    }
    if(this.showbtchser.length > 0){
      this.hideLookup = false;
      this.serviceData = this.showbtchser;
      this.lookupfor = "PickItemBtchSer";
    }
  }

  showPickTaskList(row) {
    // localStorage.setItem("ShipDetail", JSON.stringify(row));
    // this.router.navigate(['home/picking/picking-item-list']);
    this.dialogOpened = true;
  }
}
