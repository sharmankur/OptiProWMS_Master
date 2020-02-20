import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonData } from 'src/app/models/CommonData';
import { CARMasterService } from 'src/app/services/carmaster.service';
import { CcmainComponent } from '../ccmain/ccmain.component';

@Component({
  selector: 'app-create-container',
  templateUrl: './create-container.component.html',
  styleUrls: ['./create-container.component.scss']
})
export class CreateContainerComponent implements OnInit {

  showOtherLookup: boolean = false;
  showLookup: boolean = false;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  containerType: any;
  parentContainerType: any;
  commonData: any = new CommonData();
  createMode: number;
  purposeArray: any = [];
  createModeArray: any = [];
  defaultPurpose: any;
  defaultCreateMode: any;
  autoPackRule: any;
  length: number = 0;
  width: number = 0;
  height: number = 0;
  maxWeigth: number = 0;
  containerWeigth: number = 0;
  containerId: string = "";
  containerCode: string = "";
  parentContainerCode: string = "";
  containerGroupCode: string = "";
  count: any = 0;
  autoClose: boolean = false;
  autoRuleId: string = "";
  whse: string = "";
  binNo: string = "";
  itemCode: string = "";
  itemPackQty: number = 0;
  action: string = "";
  fromContainerDetails: any = [];
  purpose: string = "Y";
  noOfPackToGen: number = 1;
  oSaveModel: any = {};
  fromType: string = "";
  soNumber: string = "";
  packType: number = 0
  batchSerialData: any = [];
  lookupData: any = [];
  selectedBatchSerial: any = [];

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router, private carmasterService: CARMasterService,
    private ccmain: CcmainComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    console.log("ngOnInit");
    localStorage.setItem("ContainerOperationData", "");
    this.ccmain.ccComponent = 1;
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.createModeArray = this.commonData.container_creation_create_mode_string_dropdown();
    this.defaultPurpose = this.purposeArray[0];
    this.defaultCreateMode = this.createModeArray[0];
    this.purpose = this.defaultPurpose.Name;
    this.createMode = this.defaultCreateMode.Value;
    this.GetContainerNumber();
  }


  getContainerType(type) {
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
          this.fromType = type;
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

  onContainerTypeChangeBlur(event) {
    if (this.isValidateCalled) {
      return;
    }
    this.onContainerTypeChange(event);
  }

  async onContainerTypeChange(event: string) {
    var value = "";
    if (event == 'parent') {
      value = this.parentContainerType
    } else {
      value = this.containerType
    }

    if (value == undefined || value == "") {
      return;
    }

    this.showLoader = true;
    var result = false;
    await this.commonservice.IsValidContainerType(value).then(
      (data: any) => {
        this.showLoader = false;
        result = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data != null && data.length >= 1) {
            if (event == 'parent') {
              this.parentContainerType = data[0].OPTM_CONTAINER_TYPE;
            } else {
              this.containerType = data[0].OPTM_CONTAINER_TYPE;
            }
            result = true;
          } else {
            if (event == 'parent') {
              this.parentContainerType = "";
            } else {
              this.containerType = "";
            }
            this.toastr.error('', this.translate.instant("InvalidContainerType"));
          }
        } else {
          if (event == 'parent') {
            this.parentContainerType = "";
          } else {
            this.containerType = "";
          }
          this.toastr.error('', this.translate.instant("InvalidContainerType"));
        }
      },
      error => {
        this.showLoader = false;
        result = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result;
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
    localStorage.setItem("ContainerOperationData", "");
  }

  getLookupValue($event) {
    this.showOtherLookup = false;
    this.showLookup = false;
    if ($event != null && $event == "close") {
      //nothing to do
      return;
    }
    else {
      if (this.lookupfor == "CTList") {
        if (this.fromType == 'child') {
          this.containerType = $event[0];
          this.length = $event[2];
          this.width = $event[3];
          this.height = $event[4];
          this.maxWeigth = $event[5];
          // this.containerWeigth = $event[0];
        } else {
          this.parentContainerType = $event[0];
        }

        if (this.containerType == this.parentContainerType) {
          this.toastr.error('', this.translate.instant("ParentContCannoSame"));
          this.parentContainerType = '';
        }
      } else if (this.lookupfor == "CARList") {
        this.autoPackRule = $event[0];
        this.autoRuleId = $event[0];
        this.packType = $event[2];
        this.IsValidContainerAutoRule(this.autoPackRule, $event[1], this.packType);
      } else if (this.lookupfor == "WareHouse") {
        this.whse = $event[0];
        this.binNo = "";
      } else if (this.lookupfor == "BinList") {
        this.binNo = $event[0];
        this.GetInventoryData();
      } else if (this.lookupfor == "SOList") {
        this.soNumber = $event[0];
      } else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event[0];
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
    this.createMode = 0;
    this.autoPackRule = '';
    this.length = 0;
    this.width = 0;
    this.height = 0;
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
    this.parentContainerCode = "";
    this.fromContainerDetails = [];
    this.purpose = "Y";
    this.noOfPackToGen = 1;
    this.selectedBatchSerial = [];
    this.oSaveModel = [];
    this.containerGroupCode = ''
  }

  onScanAndCreateClick() {
    if (!this.validateFields()) {
      return;
    }

    this.prepareSaveModel(this.autoPackRule, this.containerId,
      this.containerType, this.autoClose, this.autoRuleId, this.whse, this.binNo, this.maxWeigth,
      localStorage.getItem("UserId"), "", this.itemCode, this.action, this.parentContainerCode, this.itemPackQty,
      this.width, this.height, this.containerWeigth, this.createMode, this.containerCode);

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
          this.containerId = $event.ContainerId;
          this.containerCode = $event.ContainerCode;
          this.parentContainerCode = $event.ParentContainerCode;
          this.count = $event.Count;
          this.toastr.success('', this.translate.instant("ContainerCreatedSuccessMsg"));
          this.selectedBatchSerial = [];
          this.GetContainerNumber();
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
    width: number, height: number, containerWeight: number, createMode: any, containerCode: any) {
    // var oSaveModel: any = {};
    this.oSaveModel.HeaderTableBindingData = [];
    this.oSaveModel.OtherItemsDTL = [];
    this.oSaveModel.OtherBtchSerDTL = [];

    var purps = ""
    if (this.purpose == "shipping") {
      purps = "Y"
    } else {
      purps = "N"
    }

    //Push data of header table into BatchSerial model
    this.oSaveModel.HeaderTableBindingData.push({
      OPTM_SONO: this.soNumber,
      OPTM_CONTAINERID: containerId,
      OPTM_CONTTYPE: containerType,
      OPTM_CONTAINERCODE: containerCode,
      OPTM_WEIGHT: wieght,
      OPTM_AUTOCLOSE_ONFULL: 'Y',
      OPTM_AUTORULEID: autoRuleId,
      OPTM_WHSE: whse,
      OPTM_BIN: binNo,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: localStorage.getItem("UserId"),
      Length: length,
      Width: width,
      Height: height,
      ItemCode: "",
      NoOfPacks: "1",
      OPTM_TASKID: 1,
      CompanyDBId: localStorage.getItem("CompID"),
      Username: localStorage.getItem("UserId"),
      UserId: localStorage.getItem("UserId"),
      GUID: localStorage.getItem("GUID"),
      Action: "",
      OPTM_PARENTCODE: parentCode,
      OPTM_GROUP_CODE: this.containerGroupCode,
      OPTM_CREATEMODE: createMode,
      OPTM_PERPOSE: purps
    });

    for (var i = 0; i < this.fromContainerDetails.length; i++) {
      this.oSaveModel.OtherItemsDTL.push({
        OPTM_ITEMCODE: this.fromContainerDetails[i].OPTM_ITEMCODE,
        OPTM_QUANTITY: this.fromContainerDetails[i].OPTM_PARTS_PERCONT,
        OPTM_CONTAINER: "",
        OPTM_AVLQUANTITY: 0,
        OPTM_INVQUANTITY: 0,
        OPTM_BIN: '',
      });
    }

    for (var i = 0; i < this.selectedBatchSerial.length; i++) {
      this.oSaveModel.OtherBtchSerDTL.push({
        OPTM_BTCHSER: this.selectedBatchSerial[i].LOTNO,
        OPTM_QUANTITY: this.selectedBatchSerial[i].Quantity,
        OPTM_ITEMCODE: this.selectedBatchSerial[i].ITEMCODE
      });
    }
  }

  onCreateClick(event) {
    if (!this.validateFields()) {
      return;
    }

    this.prepareSaveModel(this.autoPackRule, this.containerId,
      this.containerType, this.autoClose, this.autoRuleId, this.whse, this.binNo, this.maxWeigth,
      localStorage.getItem("UserId"), "", this.itemCode, this.action, "", this.itemPackQty,
      this.width, this.height, this.containerWeigth, this.createMode, this.containerCode);

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

          if (data.length == 1) {
            this.toastr.success('', this.translate.instant("ContainerCreatedSuccessMsg"));
            // this.onResetClick();
            this.containerId = data[0].OPTM_CONTAINERID;
            this.selectedBatchSerial = [];
            this.GetContainerNumber();
          }
        } else {
          //this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  validateFields() {
    if (this.containerType == undefined || this.containerType == "") {
      this.toastr.error('', this.translate.instant("SelectContainerMsg"));
      return false;
    }
    if (this.whse == undefined || this.whse == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return false;
    }
    if (this.autoPackRule == undefined || this.autoPackRule == "") {
      this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
      return false;
    }
    if (this.binNo == undefined || this.binNo == "") {
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return false;
    }

    for (var i = 0; i < this.fromContainerDetails.length; i++) {
      if (this.fromContainerDetails[i].QuantityToAdd == 0) {
        this.toastr.error('', this.translate.instant("QuantityToAddCannotZero"));
        return false;
      }
    }

    for (var i = 0; i < this.fromContainerDetails.length; i++) {
      if (this.fromContainerDetails[i].QuantityToAdd > this.fromContainerDetails[i].OPTM_PARTS_PERCONT) {
        this.toastr.error('', this.translate.instant("ITEMQtyValidMSG"));
        return false;
      }
    }

    return true;
  }

  onCheckChange() {
    this.autoClose = !this.autoClose;
  }

  getAutoPackRule() {
    if (this.containerType == undefined || this.containerType == "") {
      this.toastr.error('', this.translate.instant("SelectContainerMsg"));
      return;
    }

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
          if (data.length > 0) {
            this.showLookup = true;
            this.serviceData = data;
            this.lookupfor = "BinList";
          } else {
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          }
          // for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
          //   if (this.serviceData[iBtchIndex].OPTM_ADD_TOCONT == 'Y') {
          //     this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "Yes";
          //   } else {
          //     this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "No";
          //   }
          // }
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

  // IsValidContainerAutoRule(ruleId, ContType, PT) {
  //   this.showLoader = true;
  //   this.carmasterService.IsValidContainerAutoRule(ruleId, ContType, PT).then(
  //     (data: any) => {
  //       this.showLoader = false;
  //       if (data != undefined) {
  //         if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
  //           this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
  //             this.translate.instant("CommonSessionExpireMsg"));
  //           return;
  //         }
  //         localStorage.setItem("CAR_Grid_Data", JSON.stringify(data));
  //         this.fromContainerDetails = data;
  //       } else {
  //         this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
  //       }
  //     },
  //     error => {
  //       this.showLoader = false;
  //       if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
  //         this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
  //       }
  //       else {
  //         this.toastr.error('', error);
  //       }
  //     }
  //   );
  // }

  // GetOtherItemsFromContDTL() {
  //   this.showLoader = true;
  //   this.containerCreationService.GetOtherItemsFromContDTL("", this.whse).subscribe(
  //     (data: any) => {
  //       this.showLoader = false;
  //       if (data != undefined) {
  //         if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
  //           this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
  //             this.translate.instant("CommonSessionExpireMsg"));
  //           return;
  //         }
  //         this.fromContainerDetails = data;
  //         for (var j = 0; j < this.fromContainerDetails.length; j++) {
  //           this.fromContainerDetails[j].QuantityToAdd = 0;
  //         }
  //       } else {
  //         this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
  //       }
  //     },
  //     error => {
  //       this.showLoader = false;
  //       if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
  //         this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
  //       }
  //       else {
  //         this.toastr.error('', error);
  //       }
  //     }
  //   );
  // }

  onPurposeSelectChange(event) {
    console.log(event);
    this.purpose = event.Name;
  }

  onCreateModeSelectChange(event) {
    console.log(event);
    this.createMode = event.Value;
  }

  onAutoPackRuleChangeBlur() {
    if (this.isValidateCalled) {
      return;
    }
    this.IsValidContainerAutoRule(this.autoRuleId, this.containerType, this.packType);
  }

  async IsValidContainerAutoRule(ruleId, ContType, packType) {
    this.showLoader = true;
    var result = false;
    await this.carmasterService.IsValidContainerAutoRule(ruleId, ContType, packType).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.selectedBatchSerial = [];
          this.fromContainerDetails = data.OPTM_CONT_AUTORULEDTL;
          for (var j = 0; j < this.fromContainerDetails.length; j++) {
            this.fromContainerDetails[j].OPTM_MIN_FILLPRCNT = 0;
            this.fromContainerDetails[j].QuantityToAdd = 0;
          }

          result = true;
          localStorage.setItem("CAR_Grid_Data", JSON.stringify(data));
          if (this.binNo != undefined && this.binNo != '') {
            this.GetInventoryData();
          }
        } else {
          // this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        result = false;
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result;
  }

  public getSOrderList() {
    this.showLookup = false;
    this.containerCreationService.GetOpenSONumber().subscribe(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        this.serviceData = resp;
        this.lookupfor = "SOList";
        this.showLookup = true;
      },
      error => {
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
  }

  onWhseChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.onWhseChange();
  }

  async onWhseChange() {
    if (this.whse == undefined || this.whse == "") {
      return;
    }

    this.showLookup = false;
    var result = false;
    await this.containerCreationService.IsValidWhseCode(this.whse).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();

            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.whse = ''
        } else {
          this.whse = resp[0].WhsCode
        }
        result = true;
      },
      error => {
        result = false;
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
    return result;
  }

  onBinChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.onBinChange();
  }

  async onBinChange() {
    if (this.binNo == undefined || this.binNo == "") {
      return;
    }

    this.showLookup = false;
    var result = false;
    await this.containerCreationService.IsValidBinCode(this.whse, this.binNo).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("INVALIDBIN"));
          this.binNo = ''
        }
        else {
          this.binNo = resp[0].BinCode
        }
        result = true;
      },
      error => {
        result = false;
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
    return result;
  }

  GetDataForContainerGroup() {
    this.showLoader = true;
    this.commonservice.GetDataForContainerGroup().subscribe(
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

          this.lookupfor = "GroupCodeList";
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

  IsValidContainerGroupBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.IsValidContainerGroup();
  }

  IsValidContainerGroup() {
    if (this.containerGroupCode == undefined || this.containerGroupCode == "") {
      return
    }

    this.showLoader = true;
    this.commonservice.IsValidContainerGroup(this.containerGroupCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.containerGroupCode = data[0].OPTM_CONTAINER_GROUP
          } else {
            this.containerGroupCode = '';
            this.toastr.error('', this.translate.instant("InvalidGroupCode"));
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

  GetInventoryData() {
    this.showLoader = true;
    this.commonservice.GetInventoryData(this.whse, this.binNo, this.autoPackRule).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.batchSerialData = []
          if (data.IteWiseInventory != null && data.IteWiseInventory != undefined) {
            for (var j = 0; j < this.fromContainerDetails.length; j++) {
              this.fromContainerDetails[j].QuantityToAdd = 0
              this.fromContainerDetails[j].BinCode = this.binNo
              this.fromContainerDetails[j].OPTM_MIN_FILLPRCNT = 0
              for (var i = 0; i < data.IteWiseInventory.length; i++) {
                if (data.IteWiseInventory[i].ITEMCODE == this.fromContainerDetails[j].OPTM_ITEMCODE) {
                  this.fromContainerDetails[j].BinCode = data.IteWiseInventory[i].BinCode
                  // this.fromContainerDetails[j].OPTM_MIN_FILLPRCNT = data.IteWiseInventory[i].Quantity
                }
              }
            }
          }
          this.batchSerialData = data.BatchWiseInventory;
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

  GetContainerNumber() {
    this.showLoader = true;
    this.containerCreationService.GetContainerNumber().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.containerCode = data[0].RESULT;
          }
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

  onContainerOperationClick() {
    // if (this.containerType == undefined || this.containerType == "") {
    //   this.toastr.error('', this.translate.instant("SelectContainerMsg"));
    //   return;
    // }
    // if (this.whse == undefined || this.whse == "") {
    //   this.toastr.error('', this.translate.instant("SelectWhseMsg"));
    //   return;
    // }
    // if (this.autoPackRule == undefined || this.autoPackRule == "") {
    //   this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
    //   return;
    // }
    // if (this.binNo == undefined || this.binNo == "") {
    //   this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
    //   return;
    // }

    // for (var i = 0; i < this.fromContainerDetails.length; i++) {
    //   if (this.fromContainerDetails[i].OPTM_PARTS_PERCONT > this.fromContainerDetails[i].OPTM_MIN_FILLPRCNT) {
    //     this.toastr.error('', this.translate.instant("ITEMQtyValidMSG"));
    //     return;
    //   }
    // }

    this.ccmain.ccComponent = 2;
    this.prepareSaveModel(this.autoPackRule, this.containerId,
      this.containerType, this.autoClose, this.autoRuleId, this.whse, this.binNo, this.maxWeigth,
      localStorage.getItem("UserId"), "", this.itemCode, this.action, "", this.itemPackQty,
      this.width, this.height, this.containerWeigth, this.createMode, this.containerCode);

    localStorage.setItem("ContainerOperationData", JSON.stringify(this.oSaveModel))
  }

  onQtyChange(event, index) {
    console.log("onQtyChange index: " + index);
    if (event != undefined) {
      var qty = Number(event)
      for (var i = 0; i < this.fromContainerDetails.length; i++) {
        if (i == index) {
          this.fromContainerDetails[i].QuantityToAdd = qty;
        }
      }
    }
  }

  onShowBSClick(event, index) {
    console.log("onShowBSClick index: " + index);
    this.lookupData = [];
    if (this.batchSerialData != undefined && this.batchSerialData.length > 0) {
      var isChecked = false;
      // Filter according to ITEMCODE
      for (var i = 0; i < this.batchSerialData.length; i++) {
        if (event.OPTM_ITEMCODE == this.batchSerialData[i].ITEMCODE) {
          this.batchSerialData[i].OldData = isChecked;
          this.lookupData.push(this.batchSerialData[i]);
        }
      }

      for (var i = 0; i < this.lookupData.length; i++) {
        for (var j = 0; j < this.selectedBatchSerial.length; j++) {
          if (this.lookupData[i].ITEMCODE == this.selectedBatchSerial[j].ITEMCODE && this.lookupData[i].LOTNO == this.selectedBatchSerial[j].LOTNO) {
            this.lookupData[i].OldData = true;
          }
          // else {
          //   this.lookupData[i].OldData = false;
          // }
        }
      }
    }

    this.lookupfor = "BatchSerialList";
    this.showLookup = false;
    this.showOtherLookup = true;
  }

  getLookupKey($event, gridSelected) {
    console.log("getLookupKey key");
    this.showOtherLookup = false;
    this.showLookup = false;
    var code = $event[0].ITEMCODE;
    //Add item in selectedBatchSerial list it is not exist. 
    for (var i = 0; i < $event.length; i++) {
      var itemcode = $event[i].ITEMCODE;
      var batchSrl = $event[i].LOTNO;
      var alreadyExist = this.checkItemAlreadyExist(this.selectedBatchSerial, itemcode, batchSrl);
      if (!alreadyExist) {
        this.selectedBatchSerial.push($event[i]);
      }
    }

    // Calcaulate sum of all itemcode.
    var sumQty = 0;
    for (var i = 0; i < this.selectedBatchSerial.length; i++) {
      if (this.selectedBatchSerial[i].ITEMCODE == code) {
        sumQty = sumQty + this.selectedBatchSerial[i].Quantity;
      }
    }

    // Update grid details list by sum of qty
    for (var i = 0; i < this.fromContainerDetails.length; i++) {
      if (this.fromContainerDetails[i].OPTM_ITEMCODE == code) {
        this.fromContainerDetails[i].QuantityToAdd = sumQty;
      }
    }
    console.log("getLookupKey sumQty: " + sumQty);
  }

  checkItemAlreadyExist(list: any, item: any, batchSrl: any) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].ITEMCODE == item && list[i].LOTNO == batchSrl) {
        return true;
      }
    }
    return false;
  }

  onSONumberChange(){
    this.showLoader = true;
    this.containerCreationService.IsValidSONumber(this.soNumber).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data.length == 0){
            this.soNumber = ''
            this.toastr.error('', this.translate.instant("InvalidSO"));
          } else {
            this.soNumber = data[0].DocEntry
          }
        } else {
          this.soNumber = ''
          this.toastr.error('', this.translate.instant("InvalidSO"));
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

  isValidateCalled: boolean = false;
  async validateBeforeSubmit(): Promise<any> {
    this.isValidateCalled = true;
    var currentFocus = document.activeElement.id;
    console.log("validateBeforeSubmit current focus: " + currentFocus);

    if (currentFocus != undefined) {
      if (currentFocus == "containerTypeId") {
        return this.onContainerTypeChange('child');
      } else if (currentFocus == "parentContainerType") {
        return this.onContainerTypeChange('parent');
      } else if (currentFocus == 'autoPackRuleId') {
        return this.IsValidContainerAutoRule(this.autoRuleId, this.containerType, this.packType);
      } else if (currentFocus == 'whse') {
        return this.onWhseChange();
      } else if (currentFocus == 'binNo') {
        return this.onBinChange();
      }

    }
  }


}
