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
  disableFields: boolean = false;
  flagCreate: boolean = false;
  itemBalanceQty: any = 0
  MapRuleQty: any = 0;
  SetItemQty: any = 0;
  ValidItemQty: any = 0;
  TempContCode : any = '';
  purpose: any = '';
  purposeId: any;
  containerCode: any = "";
  oSubmitModel: any = {};
  DisplayTreeData : any = [];

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

  isExpanded: boolean = false;
  expandedKeys: any[] = [];
  public data: any[] = [
    {
      text: 'Furniture',
      quantity: 10,
      items: [
        { text: 'Tables & Chairs', quantity: 3 },
        { text: 'Sofas', quantity: 2 },
        { text: 'Occasional Furniture', quantity: 5 }
      ]
    },
    {
      text: 'Decor',
      quantity: 9,
      items: [
        { text: 'Bed Linen', quantity: 3 },
        { text: 'Curtains & Blinds', quantity: 2 },
        { text: 'Carpets', quantity: 4 }
      ]
    },
    {
      text: 'Decor',
      quantity: 10,
      items: [
        { text: 'Bed Linen', quantity: 2 },
        { text: 'Curtains & Blinds', quantity: 4 },
        { text: 'Carpets', quantity: 4 }
      ]
    }
  ];

  public handleCollapse(node) {
    console.log("collapse index: " + node.index)
    // this.keys = this.keys.filter(k => k !== node.index);
  }

  public handleExpand(node) {
    console.log("expand index: " + node.index)
    // this.keys = this.keys.concat(node.index);
  }

  onExpandCollapseAll(event) {
    console.log("onExpandCollapseAll: " + event)
    this.expandedKeys = [];
    this.isExpand = !this.isExpand
    if (event == 'expand') {
      for (let i = 0; i < this.data.length; i++) {
        this.expandedKeys.push(""+i)
      }
    }
  }
  // public hasChildren = (item: any) => item.items && item.items.length > 0;
  // public fetchChildren = (item: any) => of(item.items);

  ngOnInit() {
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.defaultPurpose = this.purposeArray[0];
    this.purpose = this.defaultPurpose.Name;
    this.purposeId = this.defaultPurpose.Value;

    this.oSubmitModel.OPTM_CONT_HDR = [];
    this.oSubmitModel.OtherItemsDTL = [];
    this.oSubmitModel.OtherBtchSerDTL = [];

    // this.oSaveModel.OPTM_CONT_HDR = [];
    // this.oSaveModel.OtherItemsDTL = [];
    // this.oSaveModel.OtherBtchSerDTL = [];
    // this.oSaveModel.OtherItemsDTLForRemove = [];
    // this.oSaveModel.OtherBtchSerDTLForRemove = [];

    this.from = localStorage.getItem("From")
  }

  onCancelClick() { 
    this.router.navigate(['home/dashboard']);  
  }

  onRadioMouseDown(id) {
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
  }
 
  onPurposeSelectChange(event) {
    this.purpose = event.Name;
    this.purposeId = event.Value;
  }

  setDefaultValues(){
    this.containerCode = '';
    this.containerId = '';
    this.scanItemCode = '';  this.itemQty = 0;
    this.scanBSrLotNo = ''; this.bsItemQty = 0;
    this.oSubmitModel.OPTM_CONT_HDR =[];
    this.oSubmitModel.OtherItemsDTL =[];
    this.oSubmitModel.OtherBtchSerDTL =[];
  }

  onAutoPackRuleChangeBlur() {

    this.containerCode = '';
    this.setDefaultValues();

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
          this.oSaveModel.OtherItemsDTLForRemove = [];
          this.oSaveModel.OtherBtchSerDTLForRemove = [];
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

    this.binNo = '';
    this.autoRuleId = ''; 
    this.setDefaultValues();

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
          this.whse = '';
          this.binNo = '';
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

    this.autoRuleId = '';
    this.setDefaultValues(); 

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
        this.bsVisible = false;
        this.setDefaultValues();       
      } else if (this.lookupfor == "WareHouse") {
        this.whse = $event.WhsCode;
        this.binNo = ""; this.autoRuleId = '';
        this.setDefaultValues();
      } else if (this.lookupfor == "BinList") {
        this.binNo = $event.BinCode; this.autoRuleId = '';
        this.setDefaultValues();
      } else if (this.lookupfor == "SOList") {
        this.soNumber = $event.DocEntry;
      } else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
      } else if (this.lookupfor == "ContainerIdList") {

      }
      else if(this.lookupfor == "ContItemsList"){
        this.scanItemCode = $event.ITEMCODE;
        this.scanItemTracking = $event.OPTM_TRACKING;
        this.itemQty = 0;
        this.scanBSrLotNo = '';
        this.bsItemQty = 0;
        this.MapRuleQty = $event.OPTM_PARTS_PERCONT;

        if ($event.LOTTRACKINGTYPE != undefined && $event.LOTTRACKINGTYPE != "N") {
          this.bsVisible = true;
        } else {
          this.bsVisible = false;
        }

        if (this.autoRuleId != "" && this.flagCreate) {
          this.itemQty = $event.OPTM_PARTS_PERCONT;             
          this.SetItemQty = this.MapRuleQty;
        }
        else if (this.autoRuleId != "" && !this.flagCreate) {
          let item = $event.OPTM_PARTS_PERCONT;             
          let scancode = this.scanItemCode
          
        } 
         // this.scanCurrentItemData = $event

       }else if(this.lookupfor == "ContItemBatchSerialList"){
        this.scanBSrLotNo = $event.LOTNO;
        this.bsItemQty = 0;
        
        if (this.scanItemTracking == 'S') {
          this.bsItemQty = 1;
          this.SetDataInSubmitModel();
        }
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

    let newArr = [];
    for (let idxArr = 0; idxArr < this.oSaveModel.OtherItemsDTL.length; idxArr++) {
      newArr.push(this.oSaveModel.OtherItemsDTL[idxArr]);
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
              this.containerCode = '';
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
            this.oSaveModel.OtherItemsDTLForRemove = [];
            this.oSaveModel.OtherBtchSerDTLForRemove = [];
            this.bsVisible = false;
          } else {
            debugger
            this.toastr.error('', this.translate.instant(data[0].RESULT));
            this.oSaveModel = tempSaveModel
            this.oSaveModel.OtherItemsDTL = newArr;
            // for(let idq=0 ; idq<this.oSaveModel.OtherItemsDTL.length; idq++){
            //   //this.oSaveModel.OtherItemsDTL.push(newArr);

            // }
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
    this.containerCreationService.IsValidItemCode(this.autoRuleId, this.scanItemCode, this.whse, this.binNo, 1 ,
      this.containerCode).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length == 0) {
            this.scanItemCode = '';
            this.bsVisible = false;
            this.scanBSrLotNo = '';
            this.itemQty = 0;
            this.bsItemQty = 0;
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
          } else {
            this.scanItemCode = data[0].ITEMCODE;
            this.scanItemTracking = data[0].OPTM_TRACKING;
            this.scanBSrLotNo = '';
            this.itemQty = 0;
            this.bsItemQty = 0;
            this.MapRuleQty = 0;
            this.ValidItemQty = 0;
            if (data[0].LOTTRACKINGTYPE != undefined && data[0].LOTTRACKINGTYPE != "N") {
              this.bsVisible = true;
            } else {
              this.bsVisible = false;
            }

            if (this.autoRuleId != "" ){
              this.MapRuleQty = data[0].OPTM_PARTS_PERCONT;
              this.itemQty = this.MapRuleQty;
              this.ValidItemQty = this.MapRuleQty;

              if(!this.flagCreate){ 
                
              }
            }   
            else{
              this.itemQty = data[0].TOTALQTY;
              this.ValidItemQty = this.itemQty;

              if(!this.flagCreate){ 
              }
            }        

            // if (this.autoRuleId != "" && this.flagCreate) {
            //   this.itemQty = data[0].OPTM_PARTS_PERCONT;
            //   this.MapRuleQty = data[0].OPTM_PARTS_PERCONT;
            //   this.SetItemQty = this.MapRuleQty;
            // }

            //  if (this.autoRuleId != "" && !this.flagCreate) {
            //   this.MapRuleQty = data[0].OPTM_PARTS_PERCONT;
            //   let item = this.itemQty;
            //   let scancode = this.scanItemCode
            //   this.oSaveModel.OtherItemsDTL.filter(function (obj) {
            //     if (obj.OPTM_ITEMCODE == scancode) {
            //       item = obj.RemItemQty;
            //     }
            //   });
            //   this.itemQty = this.MapRuleQty - item;
            //   this.ValidItemQty = this.MapRuleQty - item;

            //   // for (let k = 0; k < this.oSaveModel.OtherItemsDTL.length; k++) {
            //   //   if (this.oSaveModel.OtherItemsDTL[k].OPTM_ITEMCODE == this.scanItemCode) {
            //   //     this.oSaveModel.OtherItemsDTL[k].OPTM_RULE_QTY = this.MapRuleQty;
            //   //   }
            //   // }
            // }

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

  GetScanItem(){

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      this.scanItemCode = ''
      return;
    }

    this.showLoader = true;
    this.containerCreationService.IsValidItemCode(this.autoRuleId, "", this.whse, this.binNo, 1,
      this.containerCode).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "ContItemsList";
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

  GetBatchSerial(){

    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.toastr.error('', this.translate.instant("BtchSrNBlank"));
      this.scanBSrLotNo = ''
      return;
    }

    this.showLoader = true;
    this.containerCreationService.IsValidBtchSer(this.scanItemCode, "", this.whse, this.binNo, 1 ,
    this.containerCode).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "ContItemBatchSerialList";
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
    this.containerCreationService.IsValidBtchSer(this.scanItemCode, this.scanBSrLotNo, this.whse, this.binNo,1,
      this.containerCode).subscribe(
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

            this.scanBSrLotNo = data[0].LOTNO;
            this.bsItemQty = 0;
            this.scanCurrentLotNoData = data;

            if (this.scanItemTracking == 'S') {
              this.bsItemQty = 1;
              this.SetDataInSubmitModel();
            }
                     
          }
        } else {
          this.scanBSrLotNo = '';
          this.scanCurrentLotNoData = '';
          this.bsItemQty = 0;
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

  onBatSerQtyChange(){
    if (this.itemQty == undefined || this.itemQty == 0) {
      this.bsItemQty = 0
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      return;
    }
    if (this.bsItemQty == undefined || this.bsItemQty == 0) {
      return;
    }
    this.SetDataInSubmitModel();
    this.scanBSrLotNo = '';
    this.bsItemQty = 0;
  }

  onScanItemQtyChange(){
    if(this.itemQty == 0 || this.itemQty == '' || this.itemQty == undefined){
      this.toastr.error('', this.translate.instant("Enter Sacnned Item Qty"));
      this.scanBSrLotNo = ''; this.bsItemQty = 0;
      return;
    }
  
    if(this.itemQty > this.ValidItemQty){
      this.toastr.error('', this.translate.instant("Scanned item qty cannot be greater than available qty"));
      this.scanBSrLotNo = ''; this.bsItemQty = 0;
      return;
    } 

    if(this.scanItemTracking == 'N'){
      this.SetDataForNoneTrackItem();
      this.scanItemCode = ''; this.itemQty = 0;
    }

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
       // OPTM_ITEM_QTY: this.itemQty,
        OPTM_ITEM_QTY: 0, //sheetal 
        OPTM_INV_QTY: this.scanCurrentItemData[0].TOTALQTY,
        // OPTM_RULE_QTY: this.scanCurrentItemData[0].OPTM_PARTS_PERCONT,
        OPTM_RULE_QTY: this.MapRuleQty,  //sheetal
        OPTM_TRACKING: this.scanCurrentItemData[0].LOTTRACKINGTYPE,
        OPTM_BALANCE_QTY: (this.autoRuleId == "" || this.autoRuleId == undefined) ? this.scanCurrentItemData[0].OPTM_PARTS_PERCONT : this.itemQty,
        OPTM_REMAIN_BAL_QTY: (this.autoRuleId == "" || this.autoRuleId == undefined) ? this.scanCurrentItemData[0].OPTM_PARTS_PERCONT : this.itemQty,
        QTY_ADDED: 0,
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
          // if (this.itemQty > this.oSaveModel.OtherItemsDTL[i].OPTM_ITEM_QTY) {
          if (this.itemQty > this.SetItemQty) {
            this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY = 0
            this.oSaveModel.OtherItemsDTL[i].OPTM_REMAIN_BAL_QTY = 0
            if(this.radioSelected == 1){
              this.itemQty = 0
              this.toastr.error('', this.translate.instant("BalQtyCheck"));
            }           
            return;
          } else {
            this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY = this.itemQty;
            this.oSaveModel.OtherItemsDTL[i].OPTM_REMAIN_BAL_QTY = this.itemQty;
          }
        }
      }
    }

    if (this.radioSelected == 2) {
      this.removeOtherItem();
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
    if(this.radioSelected == 1){
      var sumOfAllLots = this.validateBSQty()
      if (sumOfAllLots == -1) {
        this.bsItemQty = 0
        this.toastr.error('', this.translate.instant("SumBSValidMsg"));
        return;
      } else {
  
      }  
    }
    
    //Update remaining qty in other items list
    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      if (this.scanItemCode == this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE) {
        var remSum = Number("" + this.oSaveModel.OtherItemsDTL[i].OPTM_BALANCE_QTY) - sumOfAllLots;
        this.oSaveModel.OtherItemsDTL[i].OPTM_REMAIN_BAL_QTY = remSum;
        this.oSaveModel.OtherItemsDTL[i].QTY_ADDED = sumOfAllLots;
        this.itemBalanceQty = remSum;
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

                if (this.radioSelected == 1) {
                  this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_QUANTITY = sumOfLots + this.bsItemQty;
                }
                else {
                  this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_QUANTITY = sumOfLots - this.bsItemQty;
                }
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
    
    if(this.radioSelected == 2){
      this.removeOtherBtcSr()
    }
  }

  setUpdateDataforNoneTrack(action){
    let index =  this.oSubmitModel.OtherItemsDTL.findIndex(r=>r.OPTM_ITEMCODE == this.scanItemCode); 
    if(index == -1){ //Item not found
      if(this.radioSelected == 1) { // If Add
        this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = this.itemQty;
      }else{ //If Remove
        this.toastr.error("Cannot remove. Item is not present to remove");
      }
      this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;
      this.oSubmitModel.OtherItemsDTL[index].Operation = 'Add';
      this.oSubmitModel.OtherItemsDTL[index].Delete = false;
    }
    else{ // If item found
      if(this.radioSelected == 1) { // If Add
       let sum = this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY + this.itemQty;
       this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = sum;
       
       if(action == 'Add'){
        this.oSubmitModel.OtherItemsDTL[index].Operation = 'Add';
       }else{
        this.oSubmitModel.OtherItemsDTL[index].Operation = 'Edit';
       }
       this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;
       this.oSubmitModel.OtherItemsDTL[index].Delete = false;
       
      }else{ //If Remove
        let diff = this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY - this.itemQty;
        if(diff < 0){
          this.toastr.error('', this.translate.instant("Cannot remove greater qty from lesser qty"));
          return;
        }else if(diff == 0){
          this.oSubmitModel.OtherItemsDTL.splice(index,1);
          return;
        }else{
          this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = diff;           
        }

        if(action == 'Add'){
          this.oSubmitModel.OtherItemsDTL[index].Operation = 'Add';
          this.oSubmitModel.OtherItemsDTL[index].Delete = false;
         }else{
          this.oSubmitModel.OtherItemsDTL[index].Operation = 'Edit';
          this.oSubmitModel.OtherItemsDTL[index].Delete = true;
         }
         this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;
      }
    }
  }

  SetDataForNoneTrackItem(){
    if(this.flagCreate){    
      //On adding 1st item
    if(this.oSubmitModel.OtherItemsDTL.length == 0){
       this.oSubmitModel.OtherItemsDTL.push({
        OPTM_ITEMCODE : this.scanItemCode,
        OPTM_TRACKING : this.scanItemTracking,
        OPTM_QUANTITY: this.itemQty,
        OPTM_ITEM_QTY: this.MapRuleQty,
        DirtyFlag: true,
        Operation: 'Add',
        Delete: false
      });
    }
    else{
      this.setUpdateDataforNoneTrack('Add');
    }   
   }else{
     this.SetDataForUpdate('Edit');
   }     
  }

  SetDataInSubmitModel(){
    //If new container is created
    if(this.flagCreate){    
     //On adding 1st item
     if(this.oSubmitModel.OtherItemsDTL.length == 0){
        this.oSubmitModel.OtherItemsDTL.push({
          OPTM_ITEMCODE : this.scanItemCode,
          OPTM_TRACKING : this.scanItemTracking,
          OPTM_QUANTITY: this.itemQty,
          OPTM_ITEM_QTY: this.MapRuleQty,
          DirtyFlag: true,
          Operation: 'Add',
          Delete: false
        });

        if(this.scanItemTracking != 'N'){
          this.oSubmitModel.OtherBtchSerDTL.push({
            OPTM_ITEMCODE : this.scanItemCode,        
            OPTM_BTCHSER: this.scanBSrLotNo,
            OPTM_QUANTITY: this.bsItemQty,
            DirtyFlag: true,
            Operation: 'Add',
            Delete: false
          });
        }        
      }
      //If item is already present
      else{
        this.SetDataForUpdate('Add');
      }
    }
    else{
      this.SetDataForUpdate('Edit');
    }
  }

  SetDataForUpdate(action){
    let index =  this.oSubmitModel.OtherItemsDTL.findIndex(r=>r.OPTM_ITEMCODE == this.scanItemCode); 
    if(index == -1){ //Item not found
      if(this.radioSelected == 1) {  //If Add
        this.oSubmitModel.OtherItemsDTL.push({
          OPTM_ITEMCODE : this.scanItemCode,
          OPTM_TRACKING : this.scanItemTracking,
          OPTM_QUANTITY: this.itemQty,
          OPTM_ITEM_QTY: this.MapRuleQty,
          DirtyFlag: true,
          Operation: 'Add',
          Delete: false
        });

        if(this.scanItemTracking != 'N'){
        this.oSubmitModel.OtherBtchSerDTL.push({
          OPTM_ITEMCODE : this.scanItemCode,         
          OPTM_BTCHSER: this.scanBSrLotNo,
          OPTM_QUANTITY: this.bsItemQty,
          DirtyFlag: true,
          Operation: 'Add',
          Delete: false
        });
      }
      } 
      else{
        this.toastr.error('', this.translate.instant("Cannot remove. Item is not Scanned to remove"));
        return;
      }
    }
    //If item found
    else{
      this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = this.itemQty;
      this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;
      this.oSubmitModel.OtherItemsDTL[index].Operation = action;

      if(this.radioSelected == 1){
        this.oSubmitModel.OtherItemsDTL[index].Delete = false;
      }
      else{
        this.oSubmitModel.OtherItemsDTL[index].Delete = true;
      }

      if(this.scanItemTracking != 'N'){
      let indexBS =  this.oSubmitModel.OtherBtchSerDTL.findIndex(r=>r.OPTM_ITEMCODE == this.scanItemCode && r.OPTM_BTCHSER == this.scanBSrLotNo);             
      if(indexBS == -1){
        if(this.radioSelected == 1) { 
          this.oSubmitModel.OtherBtchSerDTL.push({
            OPTM_ITEMCODE : this.scanItemCode,            
            OPTM_BTCHSER: this.scanBSrLotNo,
            OPTM_QUANTITY: this.bsItemQty,
            DirtyFlag: true,
            Operation: 'Add',
            Delete: false
          });
        }
        else{
          this.toastr.error('', this.translate.instant("Cannot remove. Batch is not Scanned to remove"));
          return;
       }
      }
      else{
        if(this.radioSelected == 1){
          if(action == 'Add'){
            let sum = this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY + this.bsItemQty;
            this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY = sum;
          }else{
            //If trying to add qty into server data and action is Edit but operation is None
            this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY = this.bsItemQty;
          }         
          this.oSubmitModel.OtherBtchSerDTL[indexBS].Delete = false;
        }
        else{
          if(action == 'Add'){
            let diff = this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY - this.bsItemQty;
            if(diff < 0){
              this.toastr.error('', this.translate.instant("Cannot remove greater qty from lesser qty"));
              return;
            }else if(diff == 0){
              this.oSubmitModel.OtherBtchSerDTL.splice(indexBS,1)
            }else{
              this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY = diff;           
            }
          }
          else{
            this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY = this.bsItemQty;
            this.oSubmitModel.OtherBtchSerDTL[indexBS].Delete = true;
          }          
        }
        this.oSubmitModel.OtherBtchSerDTL[index].DirtyFlag = true;
        this.oSubmitModel.OtherBtchSerDTL[index].Operation = action;                   
      }
    }
    }  
  }

  isItemAlreadyExist(dataList: any, code: any) {
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].OPTM_ITEMCODE == code) {
        return true
      }
    }
    return false
  }

  isLotNoAlreadyExist(dataList: any, code: any, lotNo: any) {
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].OPTM_ITEMCODE == code && dataList[i].OPTM_BTCHSER == lotNo) {
        return true
      }
    }
    return false
  }

  removeOtherItem() {
    if(this.scanItemTracking != "N"){
      return
    }

    if (!this.isItemAlreadyExist(this.alreadySavedData.ItemDeiail, this.scanItemCode)) {
      return
    }

    if (!this.isItemCodeContain(this.oSaveModel.OtherItemsDTLForRemove, this.scanItemCode)) {
      this.oSaveModel.OtherItemsDTLForRemove.push({
        OPTM_ITEMCODE: this.scanItemCode,
        OPTM_CONT_QTY: 0,
        OPTM_MIN_FILLPRCNT: this.scanCurrentItemData[0].OPTM_MIN_FILLPRCNT,
        OPTM_ITEM_QTY: this.itemQty,
        OPTM_INV_QTY: this.scanCurrentItemData[0].TOTALQTY,
        // OPTM_RULE_QTY: this.scanCurrentItemData[0].OPTM_PARTS_PERCONT,
        OPTM_RULE_QTY: this.MapRuleQty,  //sheetal
        OPTM_TRACKING: this.scanCurrentItemData[0].LOTTRACKINGTYPE,
        OPTM_BALANCE_QTY: (this.autoRuleId == "" || this.autoRuleId == undefined) ? this.scanCurrentItemData[0].OPTM_PARTS_PERCONT : this.itemQty,
        OPTM_REMAIN_BAL_QTY: (this.autoRuleId == "" || this.autoRuleId == undefined) ? this.scanCurrentItemData[0].OPTM_PARTS_PERCONT : this.itemQty,
        QTY_ADDED: 0,
        TempLotNoList: [],
      })
    }
  }

  removeOtherBtcSr() {
    if (!this.isLotNoAlreadyExist(this.alreadySavedData.BtchSerDeiail, this.scanBSrLotNo, this.scanBSrLotNo)) {
      return
    }

    if (!this.isLotNoContain(this.oSaveModel.OtherBtchSerDTLForRemove, this.scanBSrLotNo)
      || this.oSaveModel.OtherBtchSerDTLForRemove.length == 0) {
      this.oSaveModel.OtherBtchSerDTLForRemove.push({
        OPTM_BTCHSER: this.scanBSrLotNo,
        OPTM_AVL_QTY: this.scanCurrentLotNoData[0].TOTALQTY,
        OPTM_ITEMCODE: this.scanCurrentLotNoData[0].ITEMCODE,
        OPTM_TRACKING: this.scanCurrentLotNoData[0].OPTM_TRACKING,
        OPTM_QUANTITY: this.bsItemQty,
      })
    } else {
      var sumOfLots = 0
      for (var i = 0; i < this.oSaveModel.OtherBtchSerDTLForRemove.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherBtchSerDTLForRemove[i].OPTM_ITEMCODE) {
          if (this.scanBSrLotNo == this.oSaveModel.OtherBtchSerDTLForRemove[i].OPTM_BTCHSER) {
            sumOfLots = sumOfLots + Number("" + this.oSaveModel.OtherBtchSerDTLForRemove[i].OPTM_QUANTITY);
          }
        }
      }

      for (var i = 0; i < this.oSaveModel.OtherBtchSerDTLForRemove.length; i++) {
        if (this.scanItemCode == this.oSaveModel.OtherBtchSerDTLForRemove[i].OPTM_ITEMCODE) {
          if (this.scanBSrLotNo == this.oSaveModel.OtherBtchSerDTLForRemove[i].OPTM_BTCHSER) {
            this.oSaveModel.OtherBtchSerDTLForRemove[i].OPTM_QUANTITY = sumOfLots + this.bsItemQty;
            break;
          }
        }
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

  alreadySavedData: any
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
            this.flagCreate = true;
          } else {
            this.alreadySavedData = data;
            this.oSubmitModel.OtherItemsDTL = [];
            this.oSubmitModel.OtherBtchSerDTL = [];

            if (data.ItemDeiail != null && data.ItemDeiail != undefined) {
              if(data.ItemDeiail.length > 0){
                for (var i = 0; i < data.ItemDeiail.length; i++) {
                  this.oSubmitModel.OtherItemsDTL.push({
                    OPTM_ITEMCODE : data.ItemDeiail[i].OPTM_ITEMCODE,                    
                    OPTM_TRACKING : this.scanItemTracking,
                    OPTM_QUANTITY: data.ItemDeiail[i].OPTM_QUANTITY,
                    OPTM_ITEM_QTY: this.MapRuleQty,                    
                    DirtyFlag: false,
                    Operation: 'None',
                    Delete: false
                  });
                }
              }
              else{
                this.flagCreate = true;
              }
            }else{
              this.flagCreate = true;
            }

            if (data.BtchSerDeiail != null && data.BtchSerDeiail != undefined) {
              for (var j = 0; j < data.BtchSerDeiail.length; j++) {
                this.oSubmitModel.OtherBtchSerDTL.push({
                  OPTM_ITEMCODE : data.BtchSerDeiail[j].OPTM_ITEMCODE,
                  ItemTracking : '',
                  ItemQty: 0,
                  OPTM_BTCHSER: data.BtchSerDeiail[j].OPTM_BTCHSER,
                  OPTM_QUANTITY: data.BtchSerDeiail[j].OPTM_QUANTITY,
                  DirtyFlag: false,
                  Operation: 'None'
                });
              }
            }
           
           this.DisplayTreeData = [];
           for(let treeidx=0; treeidx<this.oSubmitModel.OtherItemsDTL.length; treeidx++){

            let childArr = [];
            for(let q=0; q<this.oSubmitModel.OtherBtchSerDTL.length; q++){
              if(this.oSubmitModel.OtherBtchSerDTL[q].OPTM_ITEMCODE == this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_ITEMCODE){
                childArr.push({
                  Title: this.oSubmitModel.OtherBtchSerDTL[q].OPTM_BTCHSER

                  });                
              }
            } 

              this.DisplayTreeData.push({
                Title: this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_ITEMCODE,
                items : childArr
              })
           }
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

  SetContainerData(){
    this.scanCurrentItemData = ''
    this.scanItemCode = ''
    this.bsVisible = false;
    this.scanBSrLotNo = ''
    this.itemQty = 0
    this.bsItemQty = 0
    // this.oSaveModel.OPTM_CONT_HDR = [];
    // this.oSaveModel.OtherItemsDTL = [];
    // this.oSaveModel.OtherBtchSerDTL = [];    
    this.getItemBatchSerialData();
    this.flagCreate = false;
  }

  CheckDataLoss(){
    this.showDialog("ContainerCodeChange", this.translate.instant("yes"), this.translate.instant("no"),
    this.translate.instant("DataLostAlert"));
  }
 
  onContainerCodeChange() {

    this.itemBalanceQty = 0;

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
    
    var purps = ""
    if (this.purpose == "Shipping") {
      purps = "Y"
    } else {
      purps = "N"
    }

    this.showLoader = true;
    this.containerCreationService.CheckContainer(this.containerCode, this.whse, this.binNo, this.autoRuleId, this.containerGroupCode,
      this.soNumber, this.containerType, purps, this.radioSelected).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            if (data.length > 0) {

              //Container is already created but there is some error
              if (data[0].RESULT != undefined && data[0].RESULT != null) {
                this.toastr.error('', data[0].RESULT);
                this.flagCreate = false;
                this.containerCode = '';
                return;
              }
              else {
                //Container is already created and fetching data
                
                //this.CheckDataLoss();
                this.containerId = data[0].OPTM_CONTAINERID;
                this.containerCode = data[0].OPTM_CONTCODE;
                this.containerStatus = this.getContainerStatus(data[0].OPTM_STATUS);   

                if(this.radioSelected == 2){
                  if(data[0].OPTM_STATUS == 3){
                    this.showDialog("ReopenConfirm", this.translate.instant("yes"), this.translate.instant("no"),
                    this.translate.instant("DataLostAlert"));
                  }
                }                            
                this.SetContainerData();
              }            
            }

            //Container is not created. Now creating new container
            if (data.length == 0) {
              this.generateContainer();
              this.flagCreate = true;
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

  ReOpenCont(){

    this.commonservice.ReopenClick(this.containerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length > 0) {
            if (data[0].RESULT == "Data Saved" || data[0].RESULT == "Data saved.") {
              this.toastr.success('', this.translate.instant("ContainerReopenedMsg"));
              this.SetContainerData();
            } else {
              this.toastr.error('', data[0].RESULT);
            }
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
    //this.addItemToContainer();

    this.oSubmitModel.OPTM_CONT_HDR = []
    this.oSubmitModel.OPTM_CONT_HDR.push({
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_CONTID: this.containerId,
      OPTM_CONTCODE: this.containerCode,
      OPTM_CONTTYPE: this.containerType,
      OPTM_RULEID: this.autoRuleId,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_OPERATION: this.addItemOpn,
      OPTM_NO_OF_PACK: this.noOfPack
    });

    if(this.oSubmitModel.OtherBtchSerDTL.length > 0){
      for(let isub=0; isub<this.oSubmitModel.OtherItemsDTL.length; isub++){    
        if(this.oSubmitModel.OtherItemsDTL[isub].OPTM_TRACKING != 'N'){
          let item = this.oSubmitModel.OtherItemsDTL[isub].OPTM_ITEMCODE;
          let Arr = this.oSubmitModel.OtherBtchSerDTL.filter(val=> val.OPTM_ITEMCODE == item);
          let sum = 0 ;
          for(let jsub=0; jsub<Arr.length; jsub++){
            sum = sum + Arr[jsub].OPTM_QUANTITY;
          }  
          this.oSubmitModel.OtherItemsDTL[isub].OPTM_QUANTITY = sum;
        }        
      }
    } 

    console.log(this.oSubmitModel);

    this.showLoader = true;
    this.containerCreationService.InsertItemInContainerNew(this.oSubmitModel).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == "Data Saved") {
            
              this.toastr.success('', this.translate.instant("ItemUpdatedSuccessMsg"));
              this.scanItemCode = "";
              this.itemQty = 0;
              this.containerCode = '';
              this.containerStatus = '';             
              this.scanBSrLotNo = ''
              this.bsItemQty = 0
              this.oSubmitModel.OPTM_CONT_HDR = [];
              this.oSubmitModel.OtherItemsDTL = [];
              this.oSubmitModel.OtherBtchSerDTL = [];            
              this.bsVisible = false;
          } else {
            this.toastr.error('', this.translate.instant(data[0].RESULT));
          }
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
            // this.oSaveModel.OPTM_CONT_HDR = [];
            // this.oSaveModel.OtherItemsDTL = [];
            // this.oSaveModel.OtherBtchSerDTL = [];
            // this.oSaveModel.OtherItemsDTLForRemove = [];
            // this.oSaveModel.OtherBtchSerDTLForRemove = [];
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

  // deleteLotNo(index: any, item: any) {
  //   for (var i = 0; i < this.oSaveModel.OtherBtchSerDTL.length; i++) {
  //     if (this.oSaveModel.OtherBtchSerDTL[i].OPTM_ITEMCODE == item.OPTM_ITEMCODE
  //       && this.oSaveModel.OtherBtchSerDTL[i].OPTM_BTCHSER == item.OPTM_BTCHSER) {
  //       var qq = Number("" + this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY) - item.OPTM_QUANTITY
  //       if (qq == 0) {
  //         this.oSaveModel.OtherBtchSerDTL.splice(i, 1);
  //       } else {
  //         this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY = qq
  //       }
  //       break;
  //     }
  //   }

  //   var deletedItemIndex = 0
  //   for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
  //     deletedItemIndex = i;
  //     if (this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE == item.OPTM_ITEMCODE) {
  //       this.oSaveModel.OtherItemsDTL[i].TempLotNoList.splice(index, 1);
  //       break
  //     }
  //   }

  //   //update/revert/increase item qty if delete batch/serial
  //   var sumRemain = 0
  //   for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
  //     for (var j = 0; j < this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length; j++) {
  //       if (this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE == item.OPTM_ITEMCODE
  //         && this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_BTCHSER == item.OPTM_BTCHSER) {
  //         sumRemain = sumRemain + Number("" + this.oSaveModel.OtherItemsDTL[i].TempLotNoList[j].OPTM_QUANTITY)
  //       }
  //     }
  //   }
  //   this.oSaveModel.OtherItemsDTL[deletedItemIndex].QTY_ADDED = sumRemain
  //   this.oSaveModel.OtherItemsDTL[deletedItemIndex].OPTM_REMAIN_BAL_QTY = Number("" + this.oSaveModel.OtherItemsDTL[deletedItemIndex].OPTM_BALANCE_QTY) - sumRemain
  // }

  // deleteIndex: any;
  // deleteItem: any;
  // deleteItemCode(index: any, item: any) {
  //   this.deleteIndex = index;
  //   this.deleteItem = item;
  //   this.showDialog("DeleteItemCode", this.translate.instant("yes"), this.translate.instant("no"),
  //     this.translate.instant("DeleteItemCodeMsg"));
  // }

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
        // case ("DeleteItemCode"):
        //   this.oSaveModel.OtherItemsDTL.splice(this.deleteIndex, 1)
        //   if (this.oSaveModel.OtherItemsDTL.length == 0) {
        //     this.scanBSrLotNo = ''
        //     this.itemQty = 0
        //     this.bsItemQty = 0
        //   }
        //   break;
        // case ("DeleteLotNo"):
        //   console.log("DeleteLotNo: index: " + this.deleteIndex)
        //   for (var i = 0; i < this.oSaveModel.OtherBtchSerDTL.length; i++) {
        //     if (this.oSaveModel.OtherBtchSerDTL[i].OPTM_ITEMCODE == this.deleteItem.OPTM_ITEMCODE
        //       && this.oSaveModel.OtherBtchSerDTL[i].OPTM_BTCHSER == this.deleteItem.OPTM_BTCHSER
        //       && this.oSaveModel.OtherBtchSerDTL[i].OPTM_QUANTITY == this.deleteItem.OPTM_QUANTITY) {
        //       this.oSaveModel.OtherBtchSerDTL.splice(i, 1);
        //       break;
        //     }
        //   }

        //   for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
        //     for (var j = 0; j < this.oSaveModel.OtherItemsDTL[i].TempLotNoList.length; j++) {
        //       if (this.oSaveModel.OtherItemsDTL[i].OPTM_ITEMCODE == this.deleteItem.OPTM_ITEMCODE) {
        //         this.oSaveModel.OtherItemsDTL[i].TempLotNoList.splice(this.deleteIndex, 1);
        //         break
        //         // if(this.oSaveModel.OtherItemsDTL.TempLotNoList[j].OPTM_BTCHSER == item.OPTM_BTCHSER){
        //         //   this.oSaveModel.OtherItemsDTL[i].TempLotNoList.splice(j, 1);
        //         //   break;
        //         // }
        //       }
        //     }
        //   }
        //   break;
        case ("RadioBtnChange"):
          this.containerCode = '';
          this.scanItemCode = ''
          this.itemQty = 0
          this.scanBSrLotNo = ''
          this.bsItemQty = 0
          this.oSaveModel.OPTM_CONT_HDR = [];
          this.oSaveModel.OtherItemsDTL = [];
          this.oSaveModel.OtherBtchSerDTL = [];
          this.oSaveModel.OtherItemsDTLForRemove = [];
          this.oSaveModel.OtherBtchSerDTLForRemove = [];
          this.bsVisible = false;
          break;
        case ("ReopenConfirm"):
         this.ReOpenCont();
        break;
      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
          case ("DeleteItemCode"):
            break;
          case ("DeleteLotNo"):
            break;
          case ("ReopenConfirm"):
            this.containerCode = '';
            this.containerId = 0;
            this.containerStatus = '';   
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
