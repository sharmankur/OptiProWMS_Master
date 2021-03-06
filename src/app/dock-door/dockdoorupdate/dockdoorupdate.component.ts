import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { DockdoormainComponent } from '../dockdoormain/dockdoormain.component';
import { DockdoorService } from '../../services/dockdoor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DDdetailModel } from '../../models/DDdetailModel';

@Component({
  selector: 'app-dockdoorupdate',
  templateUrl: './dockdoorupdate.component.html',
  styleUrls: ['./dockdoorupdate.component.scss']
})
export class DockdoorupdateComponent implements OnInit {

  DD_ID: string;
  DD_DESC: string;
  DD_ROW: any;
  BtnTitle: string;
  isUpdate: boolean = false;
  showLoader: boolean = false;
  WHSCODE: string;
  hideLookup: boolean = true;
  lookupfor: string;
  serviceData: any[];
  index: number = -1;
  isUpdateHappen: boolean = false;
  maxCodeLength: string;
  maxDescLength: string;
  public DDdetailArray: DDdetailModel[] = [];

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private ddmainComponent: DockdoormainComponent, private ddService: DockdoorService, private router: Router) { }

  ngOnInit() {
    this.BtnTitle = this.translate.instant("Submit");
    this.maxCodeLength = this.commonservice.maxCodeLength;
    this.maxDescLength = this.commonservice.maxDescLength;
    let DD_ROW = localStorage.getItem("DD_ROW")
    if (DD_ROW != undefined && DD_ROW != "") {
      this.DD_ROW = JSON.parse(localStorage.getItem("DD_ROW"));
      this.DD_ID = this.DD_ROW.OPTM_DOCKDOORID;
      this.DD_DESC = this.DD_ROW.OPTM_DESC;
      this.WHSCODE = this.DD_ROW.OPTM_WHSE;
      this.DDdetailArray = (JSON.parse(localStorage.getItem("DD_Grid_Data"))).OPTM_DOCKDOOR_DTL;
      for (var i = 0; i < this.DDdetailArray.length; i++) {
        this.DDdetailArray[i].OPTM_DEFAULT_BOOL = this.DDdetailArray[i].OPTM_DEFAULT == "Y" ? true : false;
      }
      if (localStorage.getItem("Action") == "copy") {
        this.DD_ID = ''
        // this.WHSCODE = ''
        this.isUpdate = false;
      } else {
        this.isUpdate = true;
      }
    } else {
      this.isUpdate = false;
    }
  }

  onBackClick(){
    if (this.isUpdateHappen) {
      this.showDialog("BackConfirmation", this.translate.instant("yes"), this.translate.instant("no"),
        this.translate.instant("Plt_DataDeleteMsg"));
      return true;
    } else {
      this.ddmainComponent.ddComponent = 1;
    }
  }

  onCancelClick() {
    this.ddmainComponent.ddComponent = 1;
  }

  openConfirmForDelete(rowIndex, gridItem) {
    this.DDdetailArray.splice(rowIndex, 1);
    gridItem = this.DDdetailArray;
    this.isUpdateHappen = true;
  }

  validateFields(): boolean {
    if ((this.WHSCODE == '' || this.WHSCODE == undefined) && (this.DD_ID == '' || this.DD_ID == undefined)) {
      this.toastr.error('', this.translate.instant("EnterHdrInfoMsg"));
      return
    }
    if (this.DD_ID == '' || this.DD_ID == undefined) {
      this.toastr.error('', this.translate.instant("InvalidDock_Door"));
      return false;
    } else if (this.WHSCODE == '' || this.WHSCODE == undefined) {
      this.toastr.error('', this.translate.instant("Whs_blank_msg"));
      return false;
    }
    else if (this.DDdetailArray.length <= 0) {
      this.toastr.error('', this.translate.instant("CAR_addItemDetail_blank_msg"));
      return false;
    }
    else if (this.DDdetailArray.length > 0) {
      for (var iBtchIndex = 0; iBtchIndex < this.DDdetailArray.length; iBtchIndex++) {
        if (this.DDdetailArray[iBtchIndex].OPTM_SHIP_STAGEBIN == undefined || this.DDdetailArray[iBtchIndex].OPTM_SHIP_STAGEBIN == "") {
          this.toastr.error('', this.translate.instant("Invalid_Stagebin_msg"));
          return false;
        }
      }

      var isDefaultBinSelected = false
      for (var iBtchIndex = 0; iBtchIndex < this.DDdetailArray.length; iBtchIndex++) {
        if (this.DDdetailArray[iBtchIndex].OPTM_DEFAULT == "Y") {
          isDefaultBinSelected = true;
          break
        }
      }

      if (!isDefaultBinSelected) {
        this.toastr.error('', this.translate.instant("DefaultBinMandate"));
        return false;
      }
    }
    return true;
  }

  public onAddUpdateClick() {
    if (!this.validateFields()) {
      return;
    }
    if (this.isUpdate) {
      this.UpdateDockDoor();
    } else {
      this.addDockDoor();
    }
  }

  prepareDockDoorData(DockDoorData: any): any {
    DockDoorData.Header.push({
      OPTM_DOCKDOORID: this.DD_ID,
      OPTM_DESC: this.DD_DESC,
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_WHSE: this.WHSCODE,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: localStorage.getItem("UserId")
    });

    for (var iBtchIndex = 0; iBtchIndex < this.DDdetailArray.length; iBtchIndex++) {
      DockDoorData.Details.push({
        OPTM_LINEID: Number(iBtchIndex + 1),
        OPTM_SHIP_STAGEBIN: this.DDdetailArray[iBtchIndex].OPTM_SHIP_STAGEBIN,
        OPTM_DEFAULT: this.DDdetailArray[iBtchIndex].OPTM_DEFAULT,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      });
    }
    return DockDoorData;
  }

  addDockDoor() {
    var DockDoorData: any = {};
    DockDoorData.Header = [];
    DockDoorData.Details = [];
    var DockDoorData = this.prepareDockDoorData(DockDoorData); // current data only.
    this.InsertIntoDockDoor(DockDoorData);
  }

  InsertIntoDockDoor(DockDoorData: any) {
    this.showLoader = true;
    this.ddService.InsertIntoDockDoor(DockDoorData).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', data.OUTPUT[0].RESULT);
            this.ddmainComponent.ddComponent = 1;
          } else {
            this.toastr.error('', data.OUTPUT[0].RESULT);
          }
        } else {
          this.toastr.success('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  UpdateDockDoor() {
    var DockDoorData: any = {};
    DockDoorData.Header = [];
    DockDoorData.Details = [];
    var DockDoorData = this.prepareDockDoorData(DockDoorData); // current data only.
    // this.InsertIntoDockDoor(DockDoorData);    
    this.showLoader = true;
    this.ddService.UpdateDockDoor(DockDoorData).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', data.OUTPUT[0].RESULT);
            this.ddmainComponent.ddComponent = 1;
          } else {
            this.toastr.error('', data.OUTPUT[0].RESULT);
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

  onWhsLookupClick() {
    this.showLoader = true;
    this.commonservice.GetWhseCode().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.lookupfor = "WareHouse"
          this.hideLookup = false;
          this.serviceData = data;
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

  IsValidBinCode(index, bincode, display_name) {
    if (bincode == undefined || bincode == "") {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidBinCode(this.WHSCODE, bincode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.isUpdateHappen = true
          if (data.length > 0) {
            if (this.DDdetailArray[index].OPTM_SHIP_STAGEBIN == data[0].BinCode) {
              return
            }

            if (this.isBinExist(data[0].BinCode)) {
              this.DDdetailArray[index].OPTM_SHIP_STAGEBIN = " ";
              // display_name.value = "";
              setTimeout(() => {
                this.DDdetailArray[index].OPTM_SHIP_STAGEBIN = "";
              }, 100)
              this.toastr.error('', this.translate.instant("BinExistMsg"));
            } else {
              this.DDdetailArray[index].OPTM_SHIP_STAGEBIN = data[0].BinCode;
            }
          } else {
            this.toastr.error('', this.translate.instant("Invalid_Bin_Code"));
            this.DDdetailArray[index].OPTM_SHIP_STAGEBIN = " ";
            display_name.value = "";
          }
        } else {
          this.toastr.error('', this.translate.instant("Invalid_Bin_Code"));
          this.DDdetailArray[index].OPTM_SHIP_STAGEBIN = "";
          display_name.value = "";
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

  IsValidWhseCode() {
    if (this.WHSCODE == undefined || this.WHSCODE == "") {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidWhseCode(this.WHSCODE).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.isUpdateHappen = true
          if (data.length > 0) {
            this.WHSCODE = data[0].WhsCode;
          } else {
            this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
            this.WHSCODE = "";
          }

        } else {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.WHSCODE = "";
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

  GetStageBinList(index) {
    this.showLoader = true;
    this.index = index;
    this.commonservice.GetBinCode(this.WHSCODE).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          this.serviceData = data;
          this.lookupfor = "BinList";
          this.hideLookup = false;
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  // GetStageBinList(index) {
  //   this.showLoader = true;
  //   this.index = index;
  //   this.commonservice.GetItemCodeList().subscribe(
  //     data => {
  //       this.showLoader = false;
  //       if (data != undefined && data.length > 0) {
  //         if (data.OUTPUT[0].ErrorMsg == "7001") {
  //           this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
  //             this.translate.instant("CommonSessionExpireMsg"));
  //           return;
  //         }
  //         this.hideLookup = false;
  //         this.serviceData = data;
  //         this.lookupfor = "ItemsList";
  //       } else {
  //         this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
  //       }
  //     },
  //     error => {
  //       if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
  //         this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
  //       }
  //       else {
  //         this.toastr.error('', error);
  //       }
  //     }
  //   );
  // }

  getLookupValue($event) {
    if ($event != null && $event == "close") {
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "WareHouse") {
      this.WHSCODE = $event[0];
      this.isUpdateHappen = true
    } else if (this.lookupfor == "BinList") {
      this.isUpdateHappen = true
      if (this.isBinExist($event[0])) {
        this.toastr.error('', this.translate.instant("BinExistMsg"));
        return
      }
      for (let i = 0; i < this.DDdetailArray.length; ++i) {
        if (i === this.index) {
          this.DDdetailArray[i].OPTM_SHIP_STAGEBIN = $event[0];
        }
      }
    }
  }

  isBinExist(value) {
    let data = this.DDdetailArray.filter(item => item.OPTM_SHIP_STAGEBIN === value)
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  AddRow() {
    if (this.WHSCODE == '' || this.WHSCODE == undefined) {
      this.toastr.error('', this.translate.instant("Whs_blank_msg"));
      return false;
    }
    this.DDdetailArray.push(new DDdetailModel("", "", "N"));
    this.isUpdateHappen = true;
  }

  UpdateDefault(lotTemplateVar, value, rowindex, gridData: any) {
    // value = Number(value).toFixed(Number(localStorage.getItem("DecimalPrecision")));
    for (let i = 0; i < this.DDdetailArray.length; ++i) {
      if (i === rowindex) {
        this.DDdetailArray[i].OPTM_DEFAULT = value;
      }
    }
  }

  onCheckboxClick(value, rowindex) {
    for (let i = 0; i < this.DDdetailArray.length; ++i) {
      this.DDdetailArray[i].OPTM_DEFAULT_BOOL = false;
      this.DDdetailArray[i].OPTM_DEFAULT = "N";
    }
    this.DDdetailArray[rowindex].OPTM_DEFAULT_BOOL = value;
    if (value == true) {
      this.DDdetailArray[rowindex].OPTM_DEFAULT = "Y";
    } else {
      this.DDdetailArray[rowindex].OPTM_DEFAULT = "N";
    }
  }

  OnDDIDChange(){
    if(this.DD_ID == undefined || this.DD_ID == ""){
      return;
    }
    this.isUpdateHappen = true
  }

  onDescChangeBlur(){
    this.isUpdateHappen = true
  }

  dialogFor: any;
  yesButtonText: any;
  noButtonText: any;
  dialogMsg: any;
  showDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.dialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.showConfirmDialog = true;
    this.dialogMsg = msg;
  }

  showConfirmDialog: boolean = false;
  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("BackConfirmation"):
          this.ddmainComponent.ddComponent = 1;
          break;
        case ("Cancel"): {
          this.router.navigate(['home/dashboard']);
          break;
        }
      }
    } else {
      if ($event.Status == "no") {
        // switch ($event.From) {
        //   case ("Cancel"):
        //     break;
        // }
      }
    }
  }
}
