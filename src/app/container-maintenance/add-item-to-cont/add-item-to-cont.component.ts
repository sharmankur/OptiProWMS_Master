import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { Router } from '@angular/router';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { CcmainComponent } from 'src/app/container-creation/ccmain/ccmain.component';
import { ToastrService } from 'ngx-toastr';
import { CARMasterService } from 'src/app/services/carmaster.service';
import { CommonData } from 'src/app/models/CommonData';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ContMaintnceComponent } from '../cont-maintnce/cont-maintnce.component';

@Component({
  selector: 'app-add-item-to-cont',
  templateUrl: './add-item-to-cont.component.html',
  styleUrls: ['./add-item-to-cont.component.scss']
})
export class AddItemToContComponent implements OnInit {

  addItemList: any = [];
  autoRuleId: any = "";
  containerType: any = "";
  packType: any;
  showLoader: boolean = false;
  showLookup: boolean = false
  serviceData: any = []
  lookupfor: any;
  whse: any;
  binNo: any;
  purposeArray: any = []
  commonData: any = new CommonData(this.translate);
  defaultPurpose: any;
  soNumber: any = "";
  parentContainerType: any;
  containerLookupType: any;
  scanItemCode: any;
  itemQty: any;
  bsVisible: boolean = false;
  bsItemQty: number = 0;
  fillPer: any;
  itemRuleQty: any;
  oSaveModel: any = {};
  scanBSrLotNo: any;
  noOfPack: number = 1;
  from: any;
  scanItemTracking: any = "";
  containerStatus: any;
  disableFields: boolean = false
  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router, private carmasterService: CARMasterService,
    private contMaintenance: ContMaintnceComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
      this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    });
  }

  ngOnInit() {
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.defaultPurpose = this.purposeArray[0];
    this.purpose = this.defaultPurpose.Name;
    this.purposeId = this.defaultPurpose.Value;
    this.oSaveModel.OPTM_CONT_HDR = [];
    this.oSaveModel.OtherItemsDTL = [];
    this.oSaveModel.OtherBtchSerDTL = [];
    // this.oSaveModel.OtherItemsDTL.TempLotNoList = [];
    this.from = localStorage.getItem("From")
  }

  onCancelClick() {
    // if(this.from == "CMaintenance"){
    //   this.contMaintenance.cmComponent = 1;
    // } else {
    this.router.navigate(['home/dashboard']);
    // }
    // localStorage.setItem("From", "")
  }

  onRadioMouseDown(id) {
    console.log("on radio mouse down");
    document.getElementById(id).click();
  }

  checkChangeEvent: any;
  radioSelected: number = 1;
  handleCheckChange(event) {
    if (this.radioSelected == 1) {
      this.radioSelected = 2
      this.addItemOpn = "Remove"
    } else {
      this.radioSelected = 1
      this.addItemOpn = "Add"
    }
    this.checkChangeEvent = event;
    console.log("check change:" + this.checkChangeEvent);

    this.scanItemCode = ''
    this.itemQty = 0
    this.scanBSrLotNo = ''
    this.bsItemQty = 0
    this.oSaveModel.OPTM_CONT_HDR = [];
    this.oSaveModel.OtherItemsDTL = [];
    this.oSaveModel.OtherBtchSerDTL = [];
    this.bsVisible = false;
  }

  purpose: any
  purposeId: any
  onPurposeSelectChange(event) {
    this.purpose = event.Name;
    this.purposeId = event.Value;
  }

  onAutoPackRuleChangeBlur() {
    var packType = ""
    if (this.purpose == this.translate.instant("Shipping")) {
      packType = '1';
    } else if (this.purpose == this.translate.instant("Internal")) {
      packType = '2';
    } else {
      packType = '3';
    }

    if (this.autoRuleId == undefined || this.autoRuleId == "") {
      return;
    }
    if (this.containerType == undefined || this.containerType == "") {
      this.autoRuleId = ''
      this.toastr.error('', this.translate.instant("ContTypeValidMsg"));
      return;
    }

    this.showLoader = true;
    this.carmasterService.IsValidContainerAutoRule(this.autoRuleId, this.containerType, packType).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OPTM_CONT_AUTORULEHDR.length > 0) {
            this.autoRuleId = data.OPTM_CONT_AUTORULEHDR[0].OPTM_RULEID
          } else {
            this.autoRuleId = ''
            this.toastr.error('', this.translate.instant("RuleIdInvalidMsg"));
          }
          this.containerCode = ''
          this.containerId = ''
          this.scanItemCode = ''
          this.itemQty = 0
          this.scanBSrLotNo = ''
          this.bsItemQty = 0
          this.bsVisible = false
          this.oSaveModel.OPTM_CONT_HDR = [];
          this.oSaveModel.OtherItemsDTL = [];
          this.oSaveModel.OtherBtchSerDTL = [];
        } else {
          this.autoRuleId = ''
          this.toastr.error('', this.translate.instant("RuleIdInvalidMsg"));
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

  onWhseChangeBlur() {
    if (this.whse == undefined || this.whse == "") {
      return;
    }

    this.showLookup = false;
    this.containerCreationService.IsValidWhseCode(this.whse).then(
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
      },
      error => {
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
  }

  onBinChangeBlur() {
    if (this.binNo == undefined || this.binNo == "") {
      return;
    }

    if (this.whse == "" || this.whse == undefined) {
      this.binNo = ''
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }

    this.showLookup = false;
    this.containerCreationService.IsValidBinCode(this.whse, this.binNo).then(
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
          this.binNo = resp[0].BinCode;
        }
      },
      error => {
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
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

  containerGroupCode: any = '';
  IsValidContainerGroupBlur() {
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
          this.containerLookupType = "";
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

  getParentContainerType() {
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
          this.containerLookupType = "Parent";
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

  onContainerTypeChangeBlur() {
    if (this.containerType == undefined || this.containerType == "") {
      return
    }
    if (this.binNo == undefined || this.binNo == "") {
      this.containerType = ''
      this.toastr.error('', this.translate.instant("BinCanNotBlankMsg"));
      return;
    }

    this.showLoader = true;
    this.commonservice.IsValidContainerType(this.containerType).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data != null && data.length >= 1) {
            this.containerType = data[0].OPTM_CONTAINER_TYPE;
          } else {
            this.containerType = ""; this.containerType = "";
            this.toastr.error('', this.translate.instant("InvalidContainerType"));
          }
        } else {
          this.containerType = "";
          this.toastr.error('', this.translate.instant("InvalidContainerType"));
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

  onParentContainerChange() {
    if (this.parentContainerType == undefined || this.parentContainerType) {
      return
    }

    this.showLoader = true;
    this.commonservice.IsValidContainerType(this.parentContainerType).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data != null && data.length >= 1) {
            this.parentContainerType = data[0].OPTM_CONTAINER_TYPE;
          } else {
            this.parentContainerType = "";
            this.toastr.error('', this.translate.instant("InvalidContainerType"));
          }
        } else {
          this.parentContainerType = "";
          this.toastr.error('', this.translate.instant("InvalidContainerType"));
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

  getLookupDataValue($event) {
    this.showLookup = false;
    if ($event != null && $event == "close") {
      return;
    } else {
      if (this.lookupfor == "CTList") {
        if (this.containerLookupType == "Parent") {
          this.parentContainerType = $event.OPTM_CONTAINER_TYPE;
        } else {
          this.containerType = $event.OPTM_CONTAINER_TYPE;
        }
      } else if (this.lookupfor == "CARList") {
        this.autoRuleId = $event.OPTM_RULEID;
        this.packType = $event.OPTM_CONTUSE;
        // this.ruleQty = $event.
        this.containerCode = ''
        this.containerId = ''
        this.scanItemCode = ''
        this.itemQty = 0
        this.scanBSrLotNo = ''
        this.bsItemQty = 0
        this.bsVisible = false
        this.oSaveModel.OPTM_CONT_HDR = [];
        this.oSaveModel.OtherItemsDTL = [];
        this.oSaveModel.OtherBtchSerDTL = [];
        // this.oSaveModel.OtherItemsDTL.TempLotNoList = [];
      } else if (this.lookupfor == "WareHouse") {
        this.whse = $event.WhsCode;
        this.binNo = "";
      } else if (this.lookupfor == "BinList") {
        this.binNo = $event.BinCode;
      } else if (this.lookupfor == "SOList") {
        this.soNumber = $event.DocEntry;
      } else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
      } else if (this.lookupfor == "ContainerIdList") {

      }
    }
  }

  addItemOpn: any = "Add";
  containerId: any;
  addItemToContainer() {
    // if (this.scanItemCode == undefined || this.scanItemCode == '') {
    //   this.toastr.error('', this.translate.instant("CAR_ItemCode_Blank_Msg"));
    //   return;
    // }
    // if (this.addItemOpn == "Add" && this.itemQty == 0) {
    //   this.toastr.error('', this.translate.instant("ItemQtyCannotZero"));
    //   return;
    // }

    this.oSaveModel.OPTM_CONT_HDR = []
    this.oSaveModel.OPTM_CONT_HDR.push({
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_CONTID: this.containerId,
      OPTM_CONTCODE: this.containerCode,
      OPTM_CONTTYPE: this.containerType,
      // OPTM_ITEMCODE: itemCode,
      OPTM_RULEID: this.autoRuleId,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_OPERATION: this.addItemOpn,
      OPTM_NO_OF_PACK: this.noOfPack
    })

    if (!this.validateQtyBeforeSubmit()) {
      return
    }

    let tempArr = [];
    let tempSaveModel = this.oSaveModel;
    for (let itemp = 0; itemp < this.oSaveModel.OtherItemsDTL.length; itemp++) {

      tempArr.push({
        OPTM_ITEMCODE: this.oSaveModel.OtherItemsDTL[itemp].OPTM_ITEMCODE,
        OPTM_CONT_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_CONT_QTY,
        OPTM_MIN_FILLPRCNT: this.oSaveModel.OtherItemsDTL[itemp].OPTM_MIN_FILLPRCNT,
        OPTM_ITEM_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_ITEM_QTY,
        OPTM_INV_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_INV_QTY,
        // OPTM_RULE_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_PARTS_PERCONT,
        OPTM_TRACKING: this.oSaveModel.OtherItemsDTL[itemp].OPTM_TRACKING,
        OPTM_BALANCE_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_BALANCE_QTY
      });
    }
    this.oSaveModel.OtherItemsDTL = tempArr;

    this.showLoader = true;
    this.containerCreationService.InsertItemInContainerNew(this.oSaveModel).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data[0].RESULT == "Data Saved") {
            if (this.addItemOpn == "Add") {
              this.toastr.success('', this.translate.instant("ItemAddedSuccessMsg"));
              this.scanItemCode = "";
              this.itemQty = 0;
              this.containerCode = '';
              this.containerStatus = '';
              // this.itemBatchSr = "";
            } else {
              this.toastr.success('', this.translate.instant("ItemRemovedSuccessMsg"));
              this.scanItemCode = "";
              this.itemQty = 0;
            }
            this.scanItemCode = ''
            this.itemQty = 0
            this.scanBSrLotNo = ''
            this.bsItemQty = 0
            this.oSaveModel.OPTM_CONT_HDR = [];
            this.oSaveModel.OtherItemsDTL = [];
            this.oSaveModel.OtherBtchSerDTL = [];
            this.bsVisible = false;
          } else {
            this.toastr.error('', this.translate.instant(data[0].RESULT));
            this.oSaveModel = tempSaveModel
          }
        } else {
          this.oSaveModel = tempSaveModel
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

  validateQtyBeforeSubmit() {
    if (this.oSaveModel.OtherItemsDTL.length == 0) {
      return false;
    }

    //Add OPTM_REMAIN_BAL_QTY in request for OtherItemsDTL if you uncomment this code
    // for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
    //   if (this.oSaveModel.OtherItemsDTL[i].OPTM_TRACKING != "N") {
    //     if (this.oSaveModel.OtherItemsDTL[i].OPTM_REMAIN_BAL_QTY != 0) {
    //       this.toastr.error('', this.translate.instant("Sum of batch/serial qty should be equal to balance qty"));
    //       return false
    //     }
    //   }
    // }

    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      if (this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY == 0) {
        this.toastr.error('', this.translate.instant("Balance qty can't be zero for selected item"));
        return false
      }
    }

    return true
  }

  scanCurrentItemData: any;
  onItemCodeChange() {
    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      return;
    }

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      this.scanItemCode = ''
      return;
    }

    this.showLoader = true;
    this.containerCreationService.IsValidItemCode(this.autoRuleId, this.scanItemCode, this.whse, this.binNo).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length == 0) {
            this.scanItemCode = ''
            this.bsVisible = false;
            this.scanBSrLotNo = ''
            this.itemQty = 0
            this.bsItemQty = 0
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
          } else {
            this.scanItemCode = data[0].ITEMCODE
            this.scanItemTracking = data[0].OPTM_TRACKING
            this.scanBSrLotNo = ''
            this.itemQty = 0
            this.bsItemQty = 0
            if (data[0].LOTTRACKINGTYPE != undefined && data[0].LOTTRACKINGTYPE != "N") {
              this.bsVisible = true;
            } else {
              this.bsVisible = false;
            }
          }
          this.scanCurrentItemData = data
        } else {
          this.scanCurrentItemData = ''
          this.scanItemCode = ''
          this.bsVisible = false;
          this.scanBSrLotNo = ''
          this.itemQty = 0
          this.bsItemQty = 0
          this.toastr.error('', this.translate.instant("InvalidItemCode"));
        }
        // this.oSaveModel.OtherItemsDTL = []
        // this.oSaveModel.OtherBtchSerDTL = []
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

  isItemCodeContain(itemlist: any, itemcode) {
    for (var i = 0; i < itemlist.length; i++) {
      if (itemlist[i].OPTM_ITEMCODE == itemcode) {
        return true;
      }
    }
    return false;
  }

  isLotNoContain(itemlist: any, itemcode) {
    for (var i = 0; i < itemlist.length; i++) {
      if (itemlist[i].OPTM_BTCHSER == itemcode) {
        return true;
      }
    }
    return false;
  }

  scanCurrentLotNoData: any;
  IsValidBtchSer() {
    if ((this.scanBSrLotNo == undefined || this.scanBSrLotNo == "")) {
      return;
    }

    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.toastr.error('', this.translate.instant("BtchSrNBlank"));
      this.scanBSrLotNo = ''
      return;
    }

    this.showLoader = true;
    this.containerCreationService.IsValidBtchSer(this.scanItemCode, this.scanBSrLotNo, this.whse, this.binNo).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length == 0) {
            this.scanBSrLotNo = ''
            this.bsItemQty = 0;
            this.scanCurrentLotNoData = '';
            this.toastr.error('', this.translate.instant("Plt_InValidBatchSerial"));
          } else {
            this.scanBSrLotNo = data[0].LOTNO
            this.bsItemQty = 0
            this.scanCurrentLotNoData = data
          }
        } else {
          this.scanBSrLotNo = '';
          this.scanCurrentLotNoData = '';
          this.toastr.error('', this.translate.instant("Plt_InValidBatchSerial"));
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

  onItemQtyChange() {
    if (this.itemQty == undefined) {
      return
    }
    if (!this.isItemCodeContain(this.oSaveModel.OtherItemsDTL, this.scanItemCode)) {
      this.oSaveModel.OtherItemsDTL.push({
        OPTM_ITEMCODE: this.scanItemCode,
        OPTM_CONT_QTY: 0,
        OPTM_MIN_FILLPRCNT: this.scanCurrentItemData[0].OPTM_MIN_FILLPRCNT,
        OPTM_ITEM_QTY: this.scanCurrentItemData[0].OPTM_PARTS_PERCONT,
        OPTM_INV_QTY: this.scanCurrentItemData[0].TOTALQTY,
        // OPTM_RULE_QTY: data[0].OPTM_PARTS_PERCONT,
        OPTM_TRACKING: this.scanCurrentItemData[0].LOTTRACKINGTYPE,
        OPTM_BALANCE_QTY: (this.autoRuleId == "" || this.autoRuleId == undefined) ? this.scanCurrentItemData[0].OPTM_PARTS_PERCONT : this.itemQty,
        OPTM_REMAIN_BAL_QTY: (this.autoRuleId == "" || this.autoRuleId == undefined) ? this.scanCurrentItemData[0].OPTM_PARTS_PERCONT : this.itemQty,
        TempLotNoList: [],
      })
    }

    //For send on server
    if (this.autoRuleId == undefined || this.autoRuleId == "") { // Manual Case
      for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
          this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY = this.itemQty;
          this.oSaveModel.OtherItemsDTL[i].OPTM_REMAIN_BAL_QTY = this.itemQty;
          this.oSaveModel.OtherItemsDTL[i].OPTM_ITEM_QTY = this.itemQty;
        }
      }
    } else {
      for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
          if (this.itemQty > this.oSaveModel.OtherItemsDTL[i].OPTM_ITEM_QTY) {
            this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY = 0
            this.oSaveModel.OtherItemsDTL[i].OPTM_REMAIN_BAL_QTY = 0
            this.itemQty = 0
            this.toastr.error('', this.translate.instant("Balance qty can't be greater than available item qty"));
            return;
          } else {
            this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY = this.itemQty;
            this.oSaveModel.OtherItemsDTL[i].OPTM_REMAIN_BAL_QTY = this.itemQty;
          }
        }
      }
    }
  }

  validateBSQty() {
    var sum = 0
    for (var i = 0; i < this.oSaveModel.OtherBtchSerDTL.length; i++) {
      if (this.scanItemCode == this.oSaveModel.OtherBtchSerDTL[i].OPTM_ITEMCODE) {
        // if (this.scanBSrLotNo == this.oSaveModel.OtherBtchSerDTL[i].OPTM_BTCHSER) {
        sum = sum + Number("" + this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY)
        // }
      }
    }
    sum = sum + this.bsItemQty;

    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
        var qty = this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY;
        if (qty > 0) {
          if (sum > qty) {
            return -1;
          }
        } else {
          return -1;
        }
      }
    }
    return sum;
  }

  onBSQtyChange() {
    if (this.itemQty == undefined || this.itemQty == 0) {
      this.bsItemQty = 0
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      return
    }
    if (this.bsItemQty == undefined || this.bsItemQty == 0) {
      return
    }
    // this.updateGridOnLotNoScan(this.scanCurrentLotNoData)
    var sumOfAllLots = this.validateBSQty()
    if (sumOfAllLots == -1) {
      this.bsItemQty = 0
      this.toastr.error('', this.translate.instant("SumBSValidMsg"));
      return;
    } else {

    }

    //Update remaining qty in other items list
    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
        var remSum = Number("" + this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY) - sumOfAllLots;
        this.oSaveModel.OtherItemsDTL[i].OPTM_REMAIN_BAL_QTY = remSum;
        break;
      }
    }

    //For send on server
    if (!this.isLotNoContain(this.oSaveModel.OtherBtchSerDTL, this.scanBSrLotNo)
      || this.oSaveModel.OtherBtchSerDTL.length == 0) {
      this.oSaveModel.OtherBtchSerDTL.push({
        OPTM_BTCHSER: this.scanBSrLotNo,
        OPTM_AVL_QTY: this.scanCurrentLotNoData[0].TOTALQTY,
        OPTM_ITEMCODE: this.scanCurrentLotNoData[0].ITEMCODE,
        OPTM_TRACKING: this.scanCurrentLotNoData[0].OPTM_TRACKING,
        OPTM_QUANTITY: this.bsItemQty,
      })
    } else {
      var sumOfLots = 0
      for (var i = 0; i < this.oSaveModel.OtherBtchSerDTL.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherBtchSerDTL[i].OPTM_ITEMCODE) {
          if (this.scanBSrLotNo == this.oSaveModel.OtherBtchSerDTL[i].OPTM_BTCHSER) {
            sumOfLots = sumOfLots + Number("" + this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY);
          }
        }
      }

      for (var i = 0; i < this.oSaveModel.OtherBtchSerDTL.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherBtchSerDTL[i].OPTM_ITEMCODE) {
          if (this.scanBSrLotNo == this.oSaveModel.OtherBtchSerDTL[i].OPTM_BTCHSER) {
            this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY = sumOfLots + this.bsItemQty;
            break;
          }
        }
      }
    }

    // For display list
    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
        if (this.scanItemTracking == "S") {
          for (var j = 0; j < this.bsItemQty; j++) {
            this.oSaveModel.OtherItemsDTL[i].TempLotNoList.push({
              OPTM_BTCHSER: this.scanBSrLotNo,
              OPTM_AVL_QTY: this.scanCurrentItemData[0].TOTALQTY,
              OPTM_ITEMCODE: this.scanCurrentItemData[0].ITEMCODE,
              OPTM_TRACKING: this.scanCurrentItemData[0].OPTM_TRACKING,
              OPTM_QUANTITY: 1,
            })
          }
        } else {
          if (!this.isLotNoContain(this.oSaveModel.OtherItemsDTL[i].TempLotNoList, this.scanBSrLotNo)
            || this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length == 0) {
            this.oSaveModel.OtherItemsDTL[i].TempLotNoList.push({
              OPTM_BTCHSER: this.scanBSrLotNo,
              OPTM_AVL_QTY: this.scanCurrentItemData[0].TOTALQTY,
              OPTM_ITEMCODE: this.scanCurrentItemData[0].ITEMCODE,
              OPTM_TRACKING: this.scanCurrentItemData[0].OPTM_TRACKING,
              OPTM_QUANTITY: this.bsItemQty,
            })
          } else {
            var sumOfLots = 0
            for (var j = 0; j < this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length; j++) {
              if (this.scanBSrLotNo == this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_BTCHSER) {
                sumOfLots = sumOfLots + Number("" + this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_QUANTITY);
              }
            }

            for (var j = 0; j < this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length; j++) {
              if (this.scanBSrLotNo == this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_BTCHSER) {
                this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_QUANTITY = sumOfLots + this.bsItemQty;
                break;
              }
            }
          }
        }
      }
    }

    this.scanBSrLotNo = '';
    this.bsItemQty = 0;
    this.scanCurrentLotNoData = [];
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
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = this.translate.instant("yes");
            } else {
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = this.translate.instant("no");
            }

            if (this.serviceData[iBtchIndex].OPTM_CONTUSE == '1') {
              this.serviceData[iBtchIndex].OPTM_CONTUSE = this.translate.instant("Shipping");
            } else if (this.serviceData[iBtchIndex].OPTM_CONTUSE == '2') {
              this.serviceData[iBtchIndex].OPTM_CONTUSE = this.translate.instant("Internal");
            } else {
              this.serviceData[iBtchIndex].OPTM_CONTUSE = this.translate.instant("Both");
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

  getItemBatchSerialData() {
    this.showLoader = true;
    this.containerCreationService.GetItemAndBtchSerDetailBasedOnContainerID(this.containerId, this.containerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length == 0) {

          } else {
            if (data.ItemDeiail != null && data.ItemDeiail != undefined) {
              for (var i = 0; i < data.ItemDeiail.length; i++) {
                this.oSaveModel.OtherItemsDTL.push({
                  OPTM_ITEMCODE: data.ItemDeiail[i].OPTM_ITEMCODE,
                  OPTM_CONT_QTY: 0,
                  OPTM_MIN_FILLPRCNT: 0,
                  OPTM_ITEM_QTY: data.ItemDeiail[i].OPTM_QUANTITY,
                  OPTM_INV_QTY: 0,
                  // OPTM_RULE_QTY: data[0].OPTM_PARTS_PERCONT,
                  OPTM_TRACKING: data.ItemDeiail[i].OPTM_TRACKING,
                  OPTM_BALANCE_QTY: 0,
                  OPTM_REMAIN_BAL_QTY: 0,
                  TempLotNoList: [],
                  DeleteDisable: true
                })
              }
            }

            if (data.BtchSerDeiail != null && data.BtchSerDeiail != undefined) {
              for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
                for (var j = 0; j < data.BtchSerDeiail.length; j++) {
                  if (this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE = data.BtchSerDeiail[j].OPTM_ITEMCODE) {
                    this.oSaveModel.OtherItemsDTL[i].TempLotNoList.push({
                      OPTM_BTCHSER: data.BtchSerDeiail[j].OPTM_BTCHSER,
                      OPTM_AVL_QTY: data.BtchSerDeiail[j].TOTALQTY,
                      OPTM_ITEMCODE: data.BtchSerDeiail[j].OPTM_ITEMCODE,
                      // OPTM_TRACKING: data.BtchSerDeiail[j].OPTM_TRACKING,
                      OPTM_QUANTITY: data.BtchSerDeiail[j].OPTM_QUANTITY,
                      DeleteDisable: true
                    })
                  }
                }
              }
            }

            // prepare child container and items list
            // this.prepareGridDataForChildContainer(data);
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

  containerCode: any = "";
  onContainerCodeChange() {
    if (this.containerCode == undefined || this.containerCode == "") {
      return;
    }
    if (this.whse == undefined || this.whse == "") {
      this.containerCode = ''
      this.containerId = ''
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }
    if (this.binNo == undefined || this.binNo == "") {
      this.containerCode = ''
      this.containerId = ''
      this.toastr.error('', this.translate.instant("BinCanNotBlankMsg"));
      return;
    }
    if (this.containerType == undefined || this.containerType == "") {
      this.containerCode = ''
      this.containerId = ''
      this.toastr.error('', this.translate.instant("ContTypeValidMsg"));
      return;
    }
    // if (this.autoRuleId == undefined || this.autoRuleId == "") {
    //   this.containerCode = ''
    //   this.containerId = ''
    //   this.toastr.error('', this.translate.instant("AutoRuleValidMsg"));
    //   return;
    // }

    // this.showLoader = true;
    // this.containerCreationService.GetAllContainer(this.containerCode).subscribe(
    //   (data: any) => {
    //     this.showLoader = false;
    //     if (data != undefined) {
    //       if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
    //         this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
    //           this.translate.instant("CommonSessionExpireMsg"));
    //         return;
    //       }

    //       if (data.length == 0) {
    //         this.generateContainer();
    //         // this.containerId = ''
    //         // this.containerCode = ''
    //         //this.toastr.error('', this.translate.instant("InvalidContainerCode"));
    //       } else {
    //         this.containerId = data[0].OPTM_CONTAINERID;
    //         this.containerCode = data[0].OPTM_CONTCODE
    //         this.scanCurrentItemData = ''
    //         this.scanItemCode = ''
    //         this.bsVisible = false;
    //         this.scanBSrLotNo = ''
    //         this.itemQty = 0
    //         this.bsItemQty = 0
    //         this.oSaveModel.OPTM_CONT_HDR = [];
    //         this.oSaveModel.OtherItemsDTL = [];
    //         this.oSaveModel.OtherBtchSerDTL = [];
    //         this.containerStatus = this.getContainerStatus(data[0].OPTM_STATUS)
    //       }
    //     } else {
    //       this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
    //     }
    //   },
    //   error => {
    //     this.showLoader = false;
    //     if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
    //       this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
    //     }
    //     else {
    //       this.toastr.error('', error);
    //     }
    //   }
    // );

    var purps = ""
    if (this.purpose == "Shipping") {
      purps = "Y"
    } else {
      purps = "N"
    }

    this.showLoader = true;
    this.containerCreationService.CheckContainer(this.containerCode, this.whse, this.binNo, this.autoRuleId, this.containerGroupCode,
      this.soNumber, this.containerType, purps).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            if (data.length > 0) {
              if (data[0].RESULT != undefined && data[0].RESULT != null) {
                this.toastr.error('', data[0].RESULT);
                return;
              }
              else {
                this.containerId = data[0].OPTM_CONTAINERID;
                this.containerCode = data[0].OPTM_CONTCODE
                this.scanCurrentItemData = ''
                this.scanItemCode = ''
                this.bsVisible = false;
                this.scanBSrLotNo = ''
                this.itemQty = 0
                this.bsItemQty = 0
                this.oSaveModel.OPTM_CONT_HDR = [];
                this.oSaveModel.OtherItemsDTL = [];
                this.oSaveModel.OtherBtchSerDTL = [];
                this.containerStatus = this.getContainerStatus(data[0].OPTM_STATUS);
                this.getItemBatchSerialData();
              }
            }

            if (data.length == 0) {
              this.generateContainer();
            }
            //else {
            //   this.containerId = data[0].OPTM_CONTAINERID;
            //   this.containerCode = data[0].OPTM_CONTCODE
            //   this.scanCurrentItemData = ''
            //   this.scanItemCode = ''
            //   this.bsVisible = false;
            //   this.scanBSrLotNo = ''
            //   this.itemQty = 0
            //   this.bsItemQty = 0
            //   this.oSaveModel.OPTM_CONT_HDR = [];
            //   this.oSaveModel.OtherItemsDTL = [];
            //   this.oSaveModel.OtherBtchSerDTL = [];
            //   this.containerStatus = this.getContainerStatus(data[0].OPTM_STATUS)
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

  onUpdateClick() {
    this.addItemToContainer();
  }

  generateContainer() {
    var oCreateModel: any = {}
    oCreateModel.HeaderTableBindingData = [];
    oCreateModel.OtherItemsDTL = [];
    oCreateModel.OtherBtchSerDTL = [];

    var createMode = 2;
    if (this.autoRuleId == undefined || this.autoRuleId == "") {
      createMode = 3
    } else {
      createMode = 2
    }

    var purps = ""
    if (this.purpose == "Shipping") {
      purps = "Y"
    } else {
      purps = "N"
    }

    oCreateModel.HeaderTableBindingData.push({
      OPTM_SONO: (this.soNumber == undefined) ? '' : this.soNumber,
      OPTM_CONTAINERID: 0,
      OPTM_CONTTYPE: this.containerType,
      OPTM_CONTAINERCODE: this.containerCode,
      OPTM_WEIGHT: 0,
      OPTM_AUTOCLOSE_ONFULL: 'N',
      OPTM_AUTORULEID: (this.autoRuleId == undefined) ? '' : this.autoRuleId,
      OPTM_WHSE: this.whse,
      OPTM_BIN: this.binNo,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: '',
      Length: 0,
      Width: 0,
      Height: 0,
      ItemCode: "",
      NoOfPacks: "1",
      OPTM_TASKID: 1,
      CompanyDBId: localStorage.getItem("CompID"),
      Username: localStorage.getItem("UserId"),
      UserId: localStorage.getItem("UserId"),
      GUID: localStorage.getItem("GUID"),
      Action: "Y",
      OPTM_PARENTCODE: '',
      OPTM_GROUP_CODE: 0,
      OPTM_CREATEMODE: createMode,
      // OPTM_PERPOSE: this.purposeId,
      OPTM_PERPOSE: purps,
      OPTM_FUNCTION: "Shipping",
      OPTM_OBJECT: "Container",
      OPTM_WONUMBER: 0,
      OPTM_TASKHDID: 0,
      OPTM_OPERATION: 0,
      OPTM_QUANTITY: 0,
      OPTM_SOURCE: 0,
      OPTM_ParentContainerType: '',
      OPTM_ParentPerQty: 0,
      IsWIPCont: false
    });

    this.showLoader = true;
    this.containerCreationService.GenerateShipContainer(oCreateModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (data[0].ErrMsg != undefined && data[0].ErrMsg != null) {
              this.toastr.error('', this.translate.instant("GreaterOpenQtyCheck"));
              return;
            }
            this.containerId = data[0].OPTM_CONTAINERID
            this.containerCode = data[0].OPTM_CONTCODE
            this.scanCurrentItemData = ''
            this.scanItemCode = ''
            this.bsVisible = false;
            this.scanBSrLotNo = ''
            this.itemQty = 0
            this.bsItemQty = 0
            this.oSaveModel.OPTM_CONT_HDR = [];
            this.oSaveModel.OtherItemsDTL = [];
            this.oSaveModel.OtherBtchSerDTL = [];
            this.containerStatus = this.getContainerStatus(data[0].OPTM_STATUS)
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

  getContainerStatus(id) {
    this.disableFields = false;
    if (id == undefined || id == "") {
      return //this.translate.instant("CStatusNew");
    }
    id = Number("" + id)

    if (id == 1) {
      return this.translate.instant("CStatusNew");
    } else if (id == 2) {
      //this.disableFields = false;
      return this.translate.instant("Open");
    } else if (id == 3) {
      this.disableFields = true;
      return this.translate.instant("CClosedNew");
    } else if (id == 4) {
      return this.translate.instant("CReopenedNew");
    } else if (id == 5) {
      this.disableFields = true;
      return this.translate.instant("CAssignedNew");
    } else if (id == 6) {
      this.disableFields = true;
      return this.translate.instant("Status_Picked");
    } else if (id == 7) {
      this.disableFields = true;
      return this.translate.instant("Loaded");
    } else if (id == 8) {
      this.disableFields = true;
      return this.translate.instant("CShippedNew");
    } else if (id == 9) {
      this.disableFields = true;
      return this.translate.instant("Returned");
    } else if (id == 10) {
      this.disableFields = true;
      return this.translate.instant("CDamagedNew");
    } else if (id == 11) {
      this.disableFields = true;
      return this.translate.instant("CCancelledNew");
    }
  }

  deleteLotNo(index: any, item: any) {
    for (var i = 0; i < this.oSaveModel.OtherBtchSerDTL.length; i++) {
      if (this.oSaveModel.OtherBtchSerDTL[i].OPTM_ITEMCODE == item.OPTM_ITEMCODE
        && this.oSaveModel.OtherBtchSerDTL[i].OPTM_BTCHSER == item.OPTM_BTCHSER) {
        var qq = Number("" + this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY) - item.OPTM_QUANTITY
        if (qq == 0) {
          this.oSaveModel.OtherBtchSerDTL.splice(i, 1);
        } else {
          this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY = qq
        }
        break;
      }
    }

    var deletedItemIndex = 0
    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      deletedItemIndex = i;
      if (this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE == item.OPTM_ITEMCODE) {
        this.oSaveModel.OtherItemsDTL[i].TempLotNoList.splice(index, 1);
        break
      }
    }

    //update/revert/increase item qty if delete batch/serial
    // this.oSaveModel.OtherItemsDTL[deletedItemIndex].OPTM_REMAIN_BAL_QTY = this.oSaveModel.OtherItemsDTL[deletedItemIndex].OPTM_REMAIN_BAL_QTY + deletedLotQty
    var sumRemain = 0
    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      for (var j = 0; j < this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length; j++) {
        if (this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE == item.OPTM_ITEMCODE
          && this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_BTCHSER == item.OPTM_BTCHSER) {
          sumRemain = sumRemain + Number("" + this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_QUANTITY)
        }
      }
    }
    this.oSaveModel.OtherItemsDTL[deletedItemIndex].OPTM_REMAIN_BAL_QTY = Number("" + this.oSaveModel.OtherItemsDTL[deletedItemIndex].OPTM_BALANCE_QTY) - sumRemain
  }

  deleteIndex: any;
  deleteItem: any;
  deleteItemCode(index: any, item: any) {
    this.deleteIndex = index;
    this.deleteItem = item;
    this.showDialog("DeleteItemCode", this.translate.instant("yes"), this.translate.instant("no"),
      this.translate.instant("DeleteItemCodeMsg"));
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
        case ("DeleteItemCode"):
          this.oSaveModel.OtherItemsDTL.splice(this.deleteIndex, 1)
          if (this.oSaveModel.OtherItemsDTL.length == 0) {
            this.scanBSrLotNo = ''
            this.itemQty = 0
            this.bsItemQty = 0
          }
          break;
        case ("DeleteLotNo"):
          console.log("DeleteLotNo: index: " + this.deleteIndex)
          for (var i = 0; i < this.oSaveModel.OtherBtchSerDTL.length; i++) {
            if (this.oSaveModel.OtherBtchSerDTL[i].OPTM_ITEMCODE == this.deleteItem.OPTM_ITEMCODE
              && this.oSaveModel.OtherBtchSerDTL[i].OPTM_BTCHSER == this.deleteItem.OPTM_BTCHSER
              && this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY == this.deleteItem.OPTM_QUANTITY) {
              this.oSaveModel.OtherBtchSerDTL.splice(i, 1);
              break;
            }
          }

          for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
            for (var j = 0; j < this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length; j++) {
              if (this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE == this.deleteItem.OPTM_ITEMCODE) {
                this.oSaveModel.OtherItemsDTL[i].TempLotNoList.splice(this.deleteIndex, 1);
                break
                // if(this.oSaveModel.OtherItemsDTL.TempLotNoList[j].OPTM_BTCHSER == item.OPTM_BTCHSER){
                //   this.oSaveModel.OtherItemsDTL[i].TempLotNoList.splice(j, 1);
                //   break;
                // }
              }
            }
          }
          break;
      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
          case ("DeleteItemCode"):
            break;
          case ("DeleteLotNo"):
            break;
        }
      }
    }
  }

  public showOnlyBeveragesDetails(dataItem: any, index: number): boolean {
    return dataItem.OPTM_TRACKING === "B" || dataItem.OPTM_TRACKING === "S" || dataItem.OPTM_TRACKING === "L";
  }

  @ViewChild(GridComponent, { static: false }) grid: GridComponent;
  isExpand: boolean = false;
  onExpandCollapse() {
    this.isExpand = !this.isExpand;
    // this.ExpandCollapseBtn = (this.isExpand) ? this.translate.instant("CollapseAll") : this.translate.instant("ExpandAll")

    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      if (this.isExpand) {
        this.grid.expandRow(i)
      } else {
        this.grid.collapseRow(i);
      }
    }
  }
}
