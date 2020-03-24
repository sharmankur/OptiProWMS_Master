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

@Component({
  selector: 'app-add-item-to-cont',
  templateUrl: './add-item-to-cont.component.html',
  styleUrls: ['./add-item-to-cont.component.scss']
})
export class AddItemToContComponent implements OnInit {

  addItemList: any = [];
  autoRuleId: any;
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
  scanedItemList: any = [];
  scanBSrLotNo: any;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router, private carmasterService: CARMasterService,
    private ccmain: CcmainComponent) {
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

    this.scanedItemList.OPTM_CONT_HDR = [];
    this.scanedItemList.OtherBtchSerDTL = [];
    this.scanedItemList.OtherBtchSerDTL = [];
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
    console.log("on radio handleCheckChange");
    this.checkChangeEvent = event;
    console.log("check change:" + this.checkChangeEvent);
    console.log(this.checkChangeEvent);


    console.log("by element: plt" + event.toElement.name)
  }

  purpose: any
  onPurposeSelectChange(event) {
    this.purpose = event.Name;
  }

  onAutoPackRuleChangeBlur(ruleId, ContType, packType) {
    if (packType == this.translate.instant("Shipping")) {
      packType = '1';
    } else if (packType == this.translate.instant("Internal")) {
      packType = '2';
    } else {
      packType = '3';
    }
    this.showLoader = true;
    this.carmasterService.IsValidContainerAutoRule(ruleId, ContType, packType).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
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
    if (this.scanItemCode == undefined || this.scanItemCode == '') {
      this.toastr.error('', this.translate.instant("CAR_ItemCode_Blank_Msg"));
      return;
    }
    if (this.addItemOpn == "Add" && this.itemQty == 0) {
      this.toastr.error('', this.translate.instant("ItemQtyCannotZero"));
      return;
    }

    this.showLoader = true;
    this.containerCreationService.InsertItemInContainer(this.containerId, this.containerType,
      this.scanItemCode, this.autoRuleId, this.itemRuleQty, this.fillPer, true,
      this.addItemOpn, this.itemQty).subscribe(
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


  onItemCodeChange() {
    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      return;
    }

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      this.scanItemCode = ''
      return;
    }

    if (this.autoRuleId == undefined || this.autoRuleId == "") {
      this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
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
            this.scanedItemList.push({
              OPTM_ITEMCODE: this.scanItemCode,
              OPTM_CONT_QTY: 0,
              OPTM_MIN_FILLPRCNT: data[0].OPTM_MIN_FILLPRCNT,
              OPTM_ITEM_QTY: data[0].OPTM_PARTS_PERCONT,
              OPTM_INV_QTY: data[0].TOTALQTY,
              // OPTM_RULEID: data[0].OPTM_RULEID,
              OPTM_TRACKING: data[0].LOTTRACKINGTYPE,
              OPTM_BALANCE_QTY: 0
            })
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
    if (this.itemQty == undefined || this.itemQty == 0) {
      return
    }

    for (var i = 0; i < this.scanedItemList.length; i++) {
      if(this.scanItemCode == this.scanedItemList[i].OPTM_ITEMCODE){
        this.scanedItemList[0].OPTM_BALANCE_QTY = this.itemQty;
      }
    }
  }

  onBSQtyChange() {
    if (this.bsItemQty == undefined || this.bsItemQty == 0) {
      return
    }

    for (var i = 0; i < this.scanedItemList.length; i++) {
      if(this.scanBSrLotNo == this.scanedItemList[i].scanBSrLotNo){
        this.scanedItemList
      }
    }
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
    return dataItem.OPTM_TRACKING === "B" || dataItem.OPTM_TRACKING === "S";
  }

  @ViewChild(GridComponent, { static: false }) grid: GridComponent;
  isExpand: boolean = false;
  onExpandCollapse() {
    this.isExpand = !this.isExpand;
    // this.ExpandCollapseBtn = (this.isExpand) ? this.translate.instant("CollapseAll") : this.translate.instant("ExpandAll")

    for (var i = 0; i < this.scanedItemList.length; i++) {
      if (this.isExpand) {
        this.grid.expandRow(i)
      } else {
        this.grid.collapseRow(i);
      }
    }
  }
}
