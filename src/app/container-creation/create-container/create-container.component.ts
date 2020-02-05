import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonData } from 'src/app/models/CommonData';

@Component({
  selector: 'app-create-container',
  templateUrl: './create-container.component.html',
  styleUrls: ['./create-container.component.scss']
})
export class CreateContainerComponent implements OnInit {

  showLookup: boolean = false;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  containerType: any;
  commonData: any = new CommonData();
  createMode: any;
  purposeArray: any = [];
  createModeArray: any = [];
  defaultPurpose: any;
  defaultCreateMode: any;
  autoPackRule: any = 0;
  length: number = 0;
  width: number = 0;
  heigth: number = 0;
  maxWeigth: number = 0;
  containerWeigth: number = 0;
  containerId: string = "";
  containerCode: string = "";
  autoClose: boolean = false;
  autoRuleId: string = "";
  whse: string = "";
  binNo: string = "";
  itemCode: string = "";
  itemPackQty: number = 0;
  action: string = "";
  parentCode: string = "";
  fromContainerDetails: any = [];
  purpose: string = "";
  noOfPackToGen: number = 1;
  oSaveModel: any = {};

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.createModeArray = this.commonData.container_creation_create_mode_string_dropdown();
    this.defaultPurpose = this.purposeArray[0];
    this.defaultCreateMode = this.createModeArray[0];
    this.purpose = this.defaultPurpose.Name;
    this.createMode = this.defaultCreateMode.Name;
  }


  getContainerType() {
    this.showLoader = true;
    this.containerCreationService.GetContainerType().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          for (var i = 0; i < data.length; i++) {
            data[i].OPTM_LENGTH = data[i].OPTM_LENGTH.toFixed(Number(localStorage.getItem("DecimalPrecision")));
            data[i].OPTM_WIDTH = data[i].OPTM_WIDTH.toFixed(Number(localStorage.getItem("DecimalPrecision")));
            data[i].OPTM_HEIGHT = data[i].OPTM_HEIGHT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
            data[i].OPTM_MAXWEIGHT = data[i].OPTM_MAXWEIGHT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          }
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "CTList";
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

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  getLookupValue($event) {
    if ($event != null && $event == "close") {
      //nothing to do
      return;
    }
    else {
      if (this.lookupfor == "CTList") {
        this.containerType = $event[0];
        this.length = $event[2];
        this.width = $event[3];
        this.heigth = $event[4];
        this.maxWeigth = $event[5];
        // this.containerWeigth = $event[0];
      } else if (this.lookupfor == "CARList") {
        this.autoPackRule = $event[0];
      } else if (this.lookupfor == "WareHouse") {
        this.whse = $event[0];
      } else if (this.lookupfor == "BinList") {
        this.binNo = $event[0];
      }
    }
  }

  onContainerIdChange() {
    this.showLoader = true;
    this.containerCreationService.CheckDuplicateContainerIdCreate("").subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
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

  onResetClick() {
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.createModeArray = this.commonData.container_creation_create_mode_string_dropdown();
    this.defaultPurpose = this.purposeArray[0];
    this.defaultCreateMode = this.createModeArray[0];
    this.serviceData = []
    this.containerType = "";
    this.createMode = "";
    this.autoPackRule = 0;
    this.length = 0;
    this.width = 0;
    this.heigth = 0;
    this.maxWeigth = 0;
    this.containerWeigth = 0;
    this.containerId = "";
    this.autoClose = false;
    this.autoRuleId = "";
    this.whse = "";
    this.binNo = "";
    this.itemCode = "";
    this.itemPackQty = 0;
    this.action = "";
    this.parentCode = "";
    this.fromContainerDetails = [];
    this.purpose = "";
  }

  onScanAndCreateClick() {
    if (this.containerType == undefined || this.containerType == "") {
      this.toastr.error('', this.translate.instant("SelectContainerMsg"));
      return;
    }
    if (this.whse == undefined || this.whse == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }
    if (this.autoPackRule == undefined || this.autoPackRule == "") {
      this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
      return;
    }
    if (this.binNo == undefined || this.binNo == "") {
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return;
    }

    this.prepareSaveModel(this.autoPackRule, this.containerId,
      this.containerType, this.autoClose, this.autoRuleId, this.whse, this.binNo, this.maxWeigth,
      localStorage.getItem("UserId"), "", this.itemCode, this.action, this.parentCode, this.itemPackQty,
      this.width, this.heigth, this.containerWeigth, this.createMode, []);

    this.showInputDialog("ScanAndCreate", this.translate.instant("Confirm"), this.translate.instant("Cancel"),
      this.translate.instant("ConfirmContainerCode"));
  }

  dialogMsg: string = ""
  yesButtonText: string = "";
  noButtonText: string = "";
  inputDialogFor: any;
  titleMessage: any;
  showInputDialogFlag: boolean = false;
  showInputDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.inputDialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.showInputDialogFlag = true;
    this.titleMessage = msg;
  }

  getInputDialogValue($event) {
    this.showInputDialogFlag = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("ScanAndCreate"):
          this.containerCode = $event.ContainerCode;
          this.toastr.success('', this.translate.instant("CodeGenSuccessMsg"));
          break
      }
    }
  }

  prepareSaveModel(autoRule: string, containerId: string,
    containerType: string, autoClose: boolean,
    autoRuleId: string, whse: string,
    binNo: string, wieght: any,
    createdBy: string, modifiedBy: string, itemCode: string,
    action: string, parentCode: string, itemPackQty: any,
    width: number, height: number, containerWeight: number, createMode: any, itemsDtl: any) {
    // var oSaveModel: any = {};
    this.oSaveModel.HeaderTableBindingData = [];
    this.oSaveModel.OtherItemsDTL = [];

    //Push data of header table into BatchSerial model
    this.oSaveModel.HeaderTableBindingData.push({
      OPTM_AUTO: "",
      OPTM_CONTAINERID: containerId,
      OPTM_CONTTYPE: containerType,
      OPTM_CONTCODE: "",
      OPTM_WEIGHT: wieght,
      OPTM_AUTOCLOSE_ONFULL: 'Y',
      OPTM_AUTORULEID: 1,
      OPTM_WHSE: whse,
      OPTM_BIN: binNo,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: localStorage.getItem("UserId"),
      Length: length,
      Width: width,
      Height: height,
      ContainerWeight: "" + containerWeight,
      ItemCode: "",
      NoOfPacks: "1",
      OPTM_TASKID: 1,
      CompanyDBId: localStorage.getItem("CompID"),
      Username: localStorage.getItem("UserId"),
      UserId: localStorage.getItem("UserId"),
      GUID: localStorage.getItem("GUID"),
      Action: "",
      OPTM_PARENTCODE: "",
      OPTM_GROUP_CODE: "",
      CreateMode: createMode
    });

    this.oSaveModel.OtherItemsDTL.push({
      OPTM_ItemCode: "",
      OPTM_QUANTITY: 1,
      OPTM_CONTAINER: "",
      OPTM_AVLQUANTITY: 1,
      OPTM_INVQUANTITY: 1,
      OPTM_BIN: ''
    });
  }
  onCreateClick() {
    if (this.containerType == undefined || this.containerType == "") {
      this.toastr.error('', this.translate.instant("SelectContainerMsg"));
      return;
    }
    if (this.whse == undefined || this.whse == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }
    if (this.autoPackRule == undefined || this.autoPackRule == "") {
      this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
      return;
    }
    if (this.binNo == undefined || this.binNo == "") {
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return;
    }

    this.prepareSaveModel(this.autoPackRule, this.containerId,
      this.containerType, this.autoClose, this.autoRuleId, this.whse, this.binNo, this.maxWeigth,
      localStorage.getItem("UserId"), "", this.itemCode, this.action, this.parentCode, this.itemPackQty,
      this.width, this.heigth, this.containerWeigth, this.createMode, []);

    this.showLoader = true;
    this.containerCreationService.GenerateShipContainer(this.oSaveModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
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

  onCheckChange(){
    this.autoClose = !this.autoClose; 
  }

  getAutoPackRule() {
    this.showLoader = true;
    this.commonservice.GetDataForContainerAutoRule().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;
          for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
            if (this.serviceData[iBtchIndex].OPTM_ADD_TOCONT == 'Y') {
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "Yes";
            } else {
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "No";
            }
          }

          this.lookupfor = "CARList";
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

  GetWhseCode() {
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
          this.showLookup = true;
          this.serviceData = data;
          // for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
          //   if (this.serviceData[iBtchIndex].OPTM_ADD_TOCONT == 'Y') {
          //     this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "Yes";
          //   } else {
          //     this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "No";
          //   }
          // }

          this.lookupfor = "WareHouse";
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

  GetBinCode() {
    if (this.whse == undefined || this.whse == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }

    this.showLoader = true;
    this.commonservice.GetBinCode(this.whse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;
          // for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
          //   if (this.serviceData[iBtchIndex].OPTM_ADD_TOCONT == 'Y') {
          //     this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "Yes";
          //   } else {
          //     this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "No";
          //   }
          // }

          this.lookupfor = "BinList";
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

  GetOtherItemsFromContDTL() {
    this.showLoader = true;
    this.containerCreationService.GetOtherItemsFromContDTL("", this.whse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.fromContainerDetails = data;
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

  onPurposeSelectChange(event) {
    console.log(event);
    this.purpose = event.Name;
  }

  onCreateModeSelectChange(event) {
    console.log(event);
    this.createMode = event.Name;
  }
}
