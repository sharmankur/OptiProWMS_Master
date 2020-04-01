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
  containerType: any;
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
  soNumber: any;
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
  onPurposeSelectChange(event) {
    this.purpose = event.Name;
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
          if(data.OPTM_CONT_AUTORULEHDR.length >0 ){
            this.autoRuleId = data.OPTM_CONT_AUTORULEHDR[0].OPTM_RULEID
          } else{
            this.autoRuleId = ''
            this.toastr.error('', this.translate.instant("Invalid rule id"));
          }
        } else {
          this.autoRuleId = ''
          this.toastr.error('', this.translate.instant("Invalid rule id"));
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

  containerGroupCode: any
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
    if (this.containerType == undefined || this.containerType) {
      return
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
    for (let itemp = 0; itemp < this.oSaveModel.OtherItemsDTL.length; itemp++) {
      tempArr.push({
        OPTM_ITEMCODE: this.oSaveModel.OtherItemsDTL[itemp].OPTM_ITEMCODE,
        OPTM_CONT_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_CONT_QTY,
        OPTM_MIN_FILLPRCNT: this.oSaveModel.OtherItemsDTL[itemp].OPTM_MIN_FILLPRCNT,
        OPTM_ITEM_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_ITEM_QTY,
        OPTM_INV_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_INV_QTY,
        // OPTM_RULE_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_PARTS_PERCONT,
        OPTM_TRACKING: this.oSaveModel.OtherItemsDTL[itemp].OPTM_TRACKING,
        OPTM_BALANCE_QTY: this.oSaveModel.OtherItemsDTL[itemp].OPTM_BALANCE_QTY,
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
          }
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

  validateQtyBeforeSubmit() {
    if (this.oSaveModel.OtherItemsDTL.length == 0) {
      this.toastr.error('', this.translate.instant("Item can't be blank"));
      return false;
    }

    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      if (this.oSaveModel.OtherItemsDTL[i].OPTM_TRACKING != "N") {
        if (this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length == 0) {
          this.toastr.error('', this.translate.instant("Batch/Serial is required for selected item"));
          return false
        }
      }
    }

    var others = this.oSaveModel.OtherItemsDTL
    for (var i = 0; i < others.length; i++) {
      if (others[i].OPTM_TRACKING == "N") {
        if (others[i].OPTM_BALANCE_QTY == 0) {
          this.toastr.error('', this.translate.instant("Balance quantity can't be zero"));
          return false
        }
      }
    }

    var batchSr = this.oSaveModel.OtherBtchSerDTL
    for (var i = 0; i < batchSr.length; i++) {
      if (batchSr[i].OPTM_QUANTITY == 0) {
        this.toastr.error('', this.translate.instant("Batch/Serial quantity can't be zero"));
        return false
      }
    }
    return true
  }

  onItemCodeChange() {
    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      return;
    }

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      this.scanItemCode = ''
      return;
    }

    // if (this.autoRuleId == undefined || this.autoRuleId == "") {
    //   this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
    //   this.scanItemCode = ''
    //   return;
    // }

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
          // OPTM_MIN_FILLPRCNT: 100
          // OPTM_PARTS_PERCONT: 2
          // ITEMCODE: "C11"
          // LOTTRACKINGTYPE: "N"
          // TOTALQTY: 15064
          if (data.length == 0) {
            this.scanItemCode = ''
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
          } else {
            this.scanItemCode = data[0].ITEMCODE
            if (data[0].LOTTRACKINGTYPE != undefined && data[0].LOTTRACKINGTYPE != "N") {
              this.bsVisible = true;
            } else {
              this.bsVisible = false;
            }
            if (!this.isItemCodeContain(this.oSaveModel.OtherItemsDTL, this.scanItemCode)) {
              this.oSaveModel.OtherItemsDTL.push({
                OPTM_ITEMCODE: this.scanItemCode,
                OPTM_CONT_QTY: 0,
                OPTM_MIN_FILLPRCNT: data[0].OPTM_MIN_FILLPRCNT,
                OPTM_ITEM_QTY: data[0].OPTM_PARTS_PERCONT,
                OPTM_INV_QTY: data[0].TOTALQTY,
                // OPTM_RULE_QTY: data[0].OPTM_PARTS_PERCONT,
                OPTM_TRACKING: data[0].LOTTRACKINGTYPE,
                OPTM_BALANCE_QTY: (this.autoRuleId == "" || this.autoRuleId == undefined) ? data[0].OPTM_PARTS_PERCONT : 0,
                TempLotNoList: [],
              })
            }
          }
        } else {
          this.scanItemCode = ''
          this.toastr.error('', this.translate.instant("InvalidItemCode"));
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

  IsValidBtchSer() {
    if ((this.scanBSrLotNo == undefined || this.scanBSrLotNo == "")) {
      return;
    }

    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.toastr.error('', this.translate.instant("CAR_ItemCode_Blank_Msg"));
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
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
          } else {
            this.scanBSrLotNo = data[0].LOTNO

            for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
              if (this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE == this.scanItemCode) {
                if (!this.isLotNoContain(this.oSaveModel.OtherItemsDTL[i].TempLotNoList, this.scanBSrLotNo)) {
                  this.oSaveModel.OtherItemsDTL[i].TempLotNoList.push({
                    OPTM_BTCHSER: this.scanBSrLotNo,
                    OPTM_AVL_QTY: data[0].TOTALQTY,
                    OPTM_ITEMCODE: data[0].ITEMCODE,
                    OPTM_QUANTITY: 0,
                  })
                }
              }
            }

            if (!this.isLotNoContain(this.oSaveModel.OtherBtchSerDTL, this.scanBSrLotNo)) {
              this.oSaveModel.OtherBtchSerDTL.push({
                OPTM_BTCHSER: this.scanBSrLotNo,
                OPTM_AVL_QTY: data[0].TOTALQTY,//Number(this.selectedBatchSerial[i].QuantityToAdd).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
                OPTM_ITEMCODE: data[0].ITEMCODE,//this.selectedBatchSerial[i].ITEMCODE
                OPTM_QUANTITY: 0,
              })
            }

            if (this.autoRuleId == undefined || this.autoRuleId == "") {
              this.bsItemQty = this.itemQty
              this.onBSQtyChange()
            }
          }
        } else {
          this.scanBSrLotNo = ''
          this.toastr.error('', this.translate.instant("InvalidItemCode"));
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
    //For send on server
    if (this.autoRuleId == undefined || this.autoRuleId == "") { // Manual Case
      for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
          this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY = this.itemQty;
          this.oSaveModel.OtherItemsDTL[i].OPTM_ITEM_QTY = this.itemQty;
        }
      }
      // this.bsItemQty = this.itemQty
      // this.onBSQtyChange()
    } else {
      for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
          if (this.itemQty > this.oSaveModel.OtherItemsDTL[i].OPTM_ITEM_QTY) {
            this.toastr.error('', this.translate.instant("Balance quantity can't be greater than available item qty"));
          } else {
            this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY = this.itemQty;
          }
        }
      }
    }
  }

  onBSQtyChange() {
    if (this.bsItemQty == undefined) {
      return
    }

    //For send on server
    for (var i = 0; i < this.oSaveModel.OtherBtchSerDTL.length; i++) {
      if (this.scanItemCode == this.oSaveModel.OtherBtchSerDTL[i].OPTM_ITEMCODE) {
        if (this.scanBSrLotNo == this.oSaveModel.OtherBtchSerDTL[i].OPTM_BTCHSER) {
          this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY = this.bsItemQty;
        }
      }
    }

    // For display list
    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
        for (var j = 0; j < this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length; j++) {
          if (this.scanBSrLotNo == this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_BTCHSER) {
            this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_QUANTITY = this.bsItemQty;
          }
        }
      }
    }

    if (!this.updateQtyItemCodeWise()) {
      for (var i = 0; i < this.oSaveModel.OtherBtchSerDTL.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherBtchSerDTL[i].OPTM_ITEMCODE) {
          if (this.scanBSrLotNo == this.oSaveModel.OtherBtchSerDTL[i].OPTM_BTCHSER) {
            this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY = 0;
          }
        }
      }

      for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
          for (var j = 0; j < this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length; j++) {
            if (this.scanBSrLotNo == this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_BTCHSER) {
              this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_QUANTITY = 0;
            }
          }
        }
      }
      this.bsItemQty = 0
    }
  }

  updateQtyItemCodeWise() {
    var otherItems = this.oSaveModel.OtherItemsDTL;
    for (var i = 0; i < otherItems.length; i++) {
      var bsQtySum = 0
      for (var j = 0; j < this.oSaveModel.OtherBtchSerDTL.length; j++) {
        if (otherItems[i].OPTM_ITEMCODE == this.oSaveModel.OtherBtchSerDTL[j].OPTM_ITEMCODE) {
          bsQtySum = bsQtySum + Number("" + this.oSaveModel.OtherBtchSerDTL[j].OPTM_QUANTITY)
        }
      }
      var bnc = Number("" + otherItems[i].OPTM_BALANCE_QTY);
      // otherItems[i].OPTM_BALANCE_QTY = Number(""+otherItems[i].OPTM_BALANCE_QTY) - bsQtySum
      var value = true;
      if (bsQtySum > bnc) {
        value = false
        this.toastr.error('', this.translate.instant("Sum of batch/serial qty can't be greater than balance qty"));
      }
    }
    this.oSaveModel.OtherItemsDTL = otherItems
    return value;
    // this.oSaveModel.OtherItemsDTL
    // for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
    //   if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
    //     for (var j = 0; j < this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length; j++) {
    //       if (this.scanBSrLotNo == this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_BTCHSER) {
    //         this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_QUANTITY = this.bsItemQty;
    //       }
    //     }
    //   }
    // }
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

  containerCode: any;
  onContainerCodeChange() {
    if (this.containerCode == undefined || this.containerCode == "") {
      return;
    }

    this.showLoader = true;
    this.containerCreationService.GetAllContainer(this.containerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length == 0) {
            this.containerId = ''
            this.containerCode = ''
            this.toastr.error('', this.translate.instant("InvalidContainerCode"));
          } else {
            this.containerId = data[0].OPTM_CONTAINERID;
            this.containerCode = data[0].OPTM_CONTCODE
            // this.containerStatusEnum = data[0].OPTM_STATUS
            // this.purposeEnum = data[0].OPTM_SHIPELIGIBLE
            // this.inventoryStatusEnum = data[0].OPTM_INV_STATUS
            // this.warehouse = data[0].OPTM_WHSE
            // this.binCode = data[0].OPTM_BIN
            // this.weight = data[0].OPTM_WEIGHT
            // this.volume = data[0].OPTM_VOLUME
            // this.packProcessEnum = data[0].OPTM_BUILT_SOURCE
            // this.containerStatus = this.getContainerStatus(this.containerStatusEnum)
            // this.inventoryStatus = this.getInvStatus(this.inventoryStatusEnum)
            // this.purpose = this.getShipEligible(this.purposeEnum);
            // this.packProcess = this.getBuiltProcess(this.packProcessEnum);
            // this.getItemAndBSDetailByContainerId()
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

  onUpdateClick() {
    // if (this.addItemOpn == "Add") {

    // } else if (this.addItemOpn == "Remove") {

    // }
    this.addItemToContainer();
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
