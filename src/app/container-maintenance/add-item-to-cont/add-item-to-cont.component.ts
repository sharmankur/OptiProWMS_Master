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
  radioSelected: any = 1;
  radioRuleSelected: number = 1;
  checkParent: boolean = false;
  taskId: any = "";
  workOrder: any = "";
  operationNo: any = "";
  oCreateModel: any = {};
  PartsQty : any = 0;
  AutoRuleDTL : any = [];
  ValidBSQty : any = 0;

  @ViewChild("scanBinCode", {static: false}) scanBinCode;
  @ViewChild("scanWhse", {static: false}) scanWhse;
  @ViewChild("scanContType", {static: false}) scanContType;
  @ViewChild("scanAutoRuleId", {static: false}) scanAutoRuleId;
  @ViewChild("scanContGroupCode", {static: false}) scanContGroupCode;
  @ViewChild("scanSONumber", {static: false}) scanSONumber;
  @ViewChild("scanParentContCode", {static: false}) scanParentContCode;
  @ViewChild("scanParentContType", {static: false}) scanParentContType;
  
  @ViewChild("scanContCode", {static: false}) scanContCode;
  @ViewChild("scanItmCode", {static: false}) scanItmCode;
  @ViewChild("scanItemQty", {static: false}) scanItemQty;
  @ViewChild("scanLotNo", {static: false}) scanLotNo;
  @ViewChild("scanBsItemQty", {static: false}) scanBsItemQty;

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
  nextEnabled = true;
  onNext(){
    this.nextEnabled = false;
  }
  onBack(){
    this.nextEnabled = true;
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
    this.radioRuleSelected = 1;

    this.setDefaultValues();

    this.from = localStorage.getItem("From")
  }

  onCancelClick() { 
    this.router.navigate(['home/dashboard']);  
  }

  onRadioMouseDown(id) {
    document.getElementById(id).click();
  }

  checkChangeEvent: any;  
  handleCheckChange(event,action) {
    if(action == 'add'){
      this.radioSelected = 1;
      this.addItemOpn = "Add"
    }else if(action == 'remove'){
      this.radioSelected = 2;
      this.addItemOpn = "Remove";
    }
    else{
      this.radioSelected = 3;
      this.addItemOpn = "View"
    }   
    this.checkChangeEvent = event;    
  }

  checkDirtyFlag(){
    if(this.oSubmitModel.OtherItemsDTL.length > 0){
      for(let cFlag=0; cFlag<this.oSubmitModel.OtherItemsDTL.length; cFlag++){
        if(this.oSubmitModel.OtherItemsDTL[cFlag].DirtyFlag == true){
          this.showDialog("DirtyFlag", this.translate.instant("yes"), this.translate.instant("no"),
          this.translate.instant("DataLostAlert"));
          return true;
        }
      }
    } 
    return false;   
  }

  handleRuleRadioChange(event){
    if(this.checkDirtyFlag() == true){
      return;
    }
    if (this.radioRuleSelected == 1) {
      this.radioRuleSelected = 2;
      this.autoRuleId = '';
    } else {
      this.radioRuleSelected = 1;
      this.checkParent = false;
    }
    this.checkChangeEvent = event; 
  }

  onParentCheckChange(event){
    this.checkParent = !this.checkParent;
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
    this.DisplayTreeData = [];
  }

  onAutoPackRuleChangeBlur(){
    if(this.isValidateCalled){
      return
    }
    this.onAutoPackRuleChange()
  }

  async onAutoPackRuleChange() {

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
    var result = false;
    await this.carmasterService.IsValidContainerAutoRule(this.autoRuleId, this.containerType, packType).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }         

          
          if (data.OPTM_CONT_AUTORULEHDR.length > 0) {
            this.autoRuleId = data.OPTM_CONT_AUTORULEHDR[0].OPTM_RULEID;
           // this.scanContGroupCode.nativeElement.focus();
            result = true;
            
            this.AutoRuleDTL = data.OPTM_CONT_AUTORULEDTL;

            this.GetInventoryData();
          } else {
            this.autoRuleId = ''
            this.scanAutoRuleId.nativeElement.focus();
            this.toastr.error('', this.translate.instant("RuleIdInvalidMsg"));
            result = false
          }         
          this.bsVisible = false;          
        } else {
          this.autoRuleId = ''
          this.scanAutoRuleId.nativeElement.focus();
          this.toastr.error('', this.translate.instant("RuleIdInvalidMsg"));
          result = false
        }
      },
      error => {
        result = false
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result
  }

  onSONumberChangeBlur(){
    if(this.isValidateCalled){
      return
    }
    this.onSONumberChange()
  }

  onSONumberChange() {
    if (this.soNumber == undefined || this.soNumber == "") {
      return;
    }

    if((this.autoRuleId == '' || this.autoRuleId == undefined) && this.radioRuleSelected != 2){
      this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
      return;
    }

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
          if (data.length == 0) {
            this.soNumber = ''
            this.toastr.error('', this.translate.instant("InvalidSO"));
          } else {
            this.soNumber = data[0].DocEntry
            if(this.radioRuleSelected != 2){
              this.IsValidSONumberBasedOnRule();
            }
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

  IsValidSONumberBasedOnRule(){
    this.containerCreationService.IsValidSONumberBasedOnRule(this.soNumber,this.autoRuleId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length == 0) {
            this.soNumber = '';
            this.toastr.error('', this.translate.instant("InvalidSOAutoRule"));
          } else {
            this.soNumber = data[0].DocEntry
          }
        } else {
          this.soNumber = '';
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

  public getSOrderList() {

    if((this.autoRuleId == '' || this.autoRuleId == undefined) && this.radioRuleSelected != 2){
      this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
      return;
    }

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

  onWhseChangeBlur(){
    if(this.isValidateCalled){
      return;
    }
    this.onWhseChange();
  }

  async onWhseChange() {
    this.binNo = '';
    this.autoRuleId = ''; 
    this.setDefaultValues();
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
          this.whse = '';
          this.binNo = '';
          this.scanWhse.nativeElement.focus();
          result = false
        } else {
          this.whse = resp[0].WhsCode
          this.scanBinCode.nativeElement.focus();
          result = true
        }
      },
      error => {
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
        result = false
      }
    );
    return result
  }

  onBinChangeBlur(){
    if(this.isValidateCalled){
      return;
    }
    this.onBinChange();
  }

  async onBinChange() {
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
          this.scanBinCode.nativeElement.focus();
          result = false
        }
        else {
          this.binNo = resp[0].BinCode;
          this.scanContType.nativeElement.focus();
          result = true
        }
      },
      error => {
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
        result = false
      }
    );
    return result
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

  IsValidContainerGroupBlur(){
    if(this.isValidateCalled){
      return;
    }
    this.IsValidContainerGroup()
  }

  containerGroupCode: any = '';
  async IsValidContainerGroup() {
    if (this.containerGroupCode == undefined || this.containerGroupCode == "") {
      return
    }

    this.showLoader = true;
    var result = false
    await this.commonservice.IsValidContainerGroupScan(this.containerGroupCode).then(
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
            result = true
          } else {
            this.containerGroupCode = '';
            this.toastr.error('', this.translate.instant("InvalidGroupCode"));
            result = false
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          result = false
        }
      },
      error => {
        result = false
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result
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

  onContainerTypeChangeBlur(){
    if(this.isValidateCalled){
      return
    }
    this.onContainerTypeChange()
  }

  onContainerTypeChange() {
    if (this.containerType == undefined || this.containerType == "") {
      return
    }
    if (this.binNo == undefined || this.binNo == "") {
      this.containerType = ''
      this.toastr.error('', this.translate.instant("BinCanNotBlankMsg"));
      return;
    }

    this.showLoader = true;
    var result = false
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
            this.scanAutoRuleId.nativeElement.focus();
            result = true
          } else {
            this.containerType = ""; this.containerType = "";
            this.scanContType.nativeElement.focus();
            this.toastr.error('', this.translate.instant("InvalidContainerType"));
            result = false
          }
        } else {
          this.containerType = "";
          this.scanContType.nativeElement.focus();
          this.toastr.error('', this.translate.instant("InvalidContainerType"));
          result = false;
        }
      },
      error => {
        result = false
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result
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

  onWorkOrderBlur(){
    if(this.isValidateCalled){
      return;
    }
    this.onWorkOrderChange()
  }
  onWorkOrderChange(){

    this.workOrder == ''; this.taskId = ''; this.operationNo = ''; 
    if (this.whse == undefined || this.whse == "") {          
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }

    if (this.binNo == undefined || this.binNo == "") {    
      this.toastr.error('', this.translate.instant("BinCanNotBlankMsg"));
      return;
    }

    this.showLoader = true;   
    var result = false
    this.containerCreationService.GetWorkOrderList(this.workOrder).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }          
          if(data.length <= 0){
              this.workOrder = '';
              this.toastr.error('', this.translate.instant("InvalidWONo"));
              result = false
          }
          else{
            if(this.whse != data[0].OPTM_WHSE){
              this.toastr.error('', this.translate.instant("Diff_WH"));
              this.workOrder = '';
              result = false
            } else {
              this.taskId = data[0].OPTM_ID;
              this.operationNo = data[0].OPTM_FROMOPERNO;
            //  this.whse = data[0].OPTM_WHSE; 
            result = true 
            }
          }
        } else {
          result = false
           this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {    
        result = false    
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result
  }

  GetWorkOrderList() {
    this.workOrder == ''; this.taskId = ''; this.operationNo = ''; 
    if (this.whse == undefined || this.whse == "") {          
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }

    if (this.binNo == undefined || this.binNo == "") {    
      this.toastr.error('', this.translate.instant("BinCanNotBlankMsg"));
      return;
    }
 
   this.showLoader = true;
    this.containerCreationService.GetWorkOrderList('').subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          this.lookupfor = "WOLIST";
          this.showLookup = true;
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
        this.GetInventoryData();
      } else if (this.lookupfor == "WareHouse") {
        this.whse = $event.WhsCode;
        this.binNo = ""; this.autoRuleId = '';
        this.setDefaultValues();
      } else if (this.lookupfor == "BinList") {
        this.binNo = $event.BinCode; this.autoRuleId = '';
        this.setDefaultValues();
      } else if (this.lookupfor == "SOList") {
        this.soNumber = $event.DocEntry;
        if(this.radioRuleSelected != 2){
          this.IsValidSONumberBasedOnRule();
        }
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
        this.MapRuleQty = 0;
        this.ValidItemQty = 0;

        if ($event.LOTTRACKINGTYPE != undefined && $event.LOTTRACKINGTYPE != "N") {
          this.bsVisible = true;
        } else {
          this.bsVisible = false;
        }

        if (this.autoRuleId != "" ){
          this.MapRuleQty = $event.OPTM_PARTS_PERCONT;
          this.itemQty = this.MapRuleQty;
          this.ValidItemQty = this.MapRuleQty;

          if(!this.flagCreate){ 
            
          }
        }   
        else{
          // this.itemQty = $event.TOTALQTY;
          // this.ValidItemQty = this.itemQty;

          // if(!this.flagCreate){ 
          // }
        } 
         // this.scanCurrentItemData = $event

       }else if(this.lookupfor == "ContItemBatchSerialList"){
        this.scanBSrLotNo = $event.LOTNO;
        this.bsItemQty = 0;
        
        if (this.scanItemTracking == 'S') {
          this.bsItemQty = 1;
          this.SetDataInSubmitModel();
          this.scanBSrLotNo = ''; this.bsItemQty = 0;   
        }else{
         // this.bsItemQty = $event.TOTALQTY;
          this.ValidBSQty =$event.TOTALQTY;
        }
      }else if(this.lookupfor == "WOLIST"){
        if(this.whse != $event.OPTM_WHSE){
          this.toastr.error('', this.translate.instant("Diff_WH"));
          this.workOrder = '';
          return;
        }
        this.workOrder = $event.OPTM_WONO;
        this.taskId = $event.OPTM_ID;
        this.operationNo = $event.OPTM_FROMOPERNO;
      }
    }
  }

  addItemOpn: any = "Add";
  containerId: any;
  addItemToContainer() {
   
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

    // if (!this.validateQtyBeforeSubmit()) {
    //   return
    // }

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
  
  onItemCodeChangeBlur(){
    if(this.isValidateCalled){
      return
    }
    this.onItemCodeChange()
  }

  scanCurrentItemData: any;
  async onItemCodeChange() {
    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      return;
    }

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      this.scanItemCode = ''
      return;
    }
    this.showLoader = true;
    var result = false
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
            this.scanItmCode.nativeElement.focus();
            result = false
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
              // this.itemQty = data[0].TOTALQTY;
              // this.ValidItemQty = this.itemQty;

              // if(!this.flagCreate){ 
              // }
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
          result = true
        } else {
          this.scanCurrentItemData = ''
          this.scanItemCode = ''
          this.bsVisible = false;
          this.scanBSrLotNo = ''
          this.itemQty = 0
          this.bsItemQty = 0
          this.toastr.error('', this.translate.instant("InvalidItemCode"));
          result = false
          this.scanItmCode.nativeElement.focus();
        }
        // this.oSaveModel.OtherItemsDTL = []
        // this.oSaveModel.OtherBtchSerDTL = []
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
    return result
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

  onBatchSerialBlur(){
    if(this.isValidateCalled){
      return
    }
    this.IsValidBtchSer()
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

    if(this.radioSelected == 2){
      if(this.oSubmitModel.OtherBtchSerDTL.length > 0){
        for(let iBat=0; iBat<this.oSubmitModel.OtherBtchSerDTL.length; iBat++){
          if(this.oSubmitModel.OtherBtchSerDTL[iBat].OPTM_BTCHSER == this.scanBSrLotNo){
            this.bsItemQty = 0;

            if (this.scanItemTracking == 'S') {
              this.bsItemQty = 1;
              this.SetDataInSubmitModel();
              this.scanBSrLotNo = ''; this.bsItemQty = 0;  
            }
            return;
          }else{
            this.toastr.error('',this.translate.instant("Cannot remove. No item present in Container"));
          }
        }
      }else{
        this.toastr.error('',this.translate.instant("Cannot remove. No item present in Container"));
      }
    }else{
      this.showLoader = true;
      var result = false;
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
              result = false
              this.scanLotNo.nativeElement.focus()
            } else {
  
              this.scanBSrLotNo = data[0].LOTNO;
              this.bsItemQty = 0;
              this.scanCurrentLotNoData = data;
  
              if (this.scanItemTracking == 'S') {
                this.bsItemQty = 1;
                this.SetDataInSubmitModel();
                this.scanBSrLotNo = ''; this.bsItemQty = 0;  
              }else{
                //this.bsItemQty = data[0].TOTALQTY;
                this.ValidBSQty = data[0].TOTALQTY;
              }
              result = true;
            }
          } else {
            this.scanBSrLotNo = '';
            this.scanCurrentLotNoData = '';
            this.bsItemQty = 0;
            this.toastr.error('', this.translate.instant("Plt_InValidBatchSerial"));
          }
                 
      },
      error => {
        result = false
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    }
    return result
  }

  onBatSerQtyChange(){
    if (this.itemQty == undefined || this.itemQty == 0) {
      this.bsItemQty = 0;
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      this.scanBsItemQty.nativeElement.focus()
      return false;
    }
    if (this.bsItemQty == undefined || this.bsItemQty == 0 || this.bsItemQty < 0) {
      this.toastr.error('',this.translate.instant("Please enter Batch/Serial Qty"));
      return;
    }

    if (this.bsItemQty > this.ValidBSQty) {
      this.toastr.error('',this.translate.instant("Qty cannot be greater than Available Batch/Serial Qty"));
      this.bsItemQty = 0;
      return;
    }

    this.SetDataInSubmitModel();
    this.scanBSrLotNo = '';
    this.bsItemQty = 0;

    return true;
  }

  onScanItemQtyChange(){
    if(this.itemQty == 0 || this.itemQty == '' || this.itemQty == undefined){
      this.toastr.error('', this.translate.instant("Enter Sacnned Item Qty"));
      this.scanBSrLotNo = ''; this.bsItemQty = 0;
      this.scanItemQty.nativeElement.focus()
      return false;
    }
    
    if(this.autoRuleId != ""){
      if(this.itemQty > this.ValidItemQty){
        this.toastr.error('', this.translate.instant("Scanned item qty cannot be greater than available qty"));
        this.scanBSrLotNo = ''; this.bsItemQty = 0; this.itemQty = 0;
        this.scanItemQty.nativeElement.focus()
        return false;
      } 
    }

    if(this.scanItemTracking == 'N'){
      this.SetDataForNoneTrackItem();
      this.scanItemCode = ''; this.itemQty = 0;    
      this.displayTreeDataValue();
    }

    return true
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

  setUpdateDataforNoneTrack(action){
    let index =  this.oSubmitModel.OtherItemsDTL.findIndex(r=>r.OPTM_ITEMCODE == this.scanItemCode); 
    if(index == -1){ //Item not found
      if(this.radioSelected == 1) { // If Add
      //  this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = this.itemQty;
      this.oSubmitModel.OtherItemsDTL.push({
        OPTM_ITEMCODE : this.scanItemCode,
        OPTM_TRACKING : this.scanItemTracking,
        OPTM_QUANTITY: this.itemQty,
        OPTM_ITEM_QTY: this.MapRuleQty,
        DirtyFlag: true,
        Operation: 'Add',
        Delete: false
      });
      }else{ //If Remove
        this.toastr.error("Cannot remove. Item is not present to remove");
        return;
      }
      // this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;
      // this.oSubmitModel.OtherItemsDTL[index].Operation = 'Add';
      // this.oSubmitModel.OtherItemsDTL[index].Delete = false;
    }
    else{ // If item found
      if(this.radioSelected == 1) { // If Add
       if(action == 'Add'){ 
       let sum = this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY + this.itemQty;
       this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = sum;     
       
        this.oSubmitModel.OtherItemsDTL[index].Operation = 'Add';
       }else{
        this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = this.itemQty;
        this.oSubmitModel.OtherItemsDTL[index].Operation = 'Edit';
       }
       this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;
       this.oSubmitModel.OtherItemsDTL[index].Delete = false;
       
      }else{ //If Remove
        if(action == 'Add'){
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
      
          this.oSubmitModel.OtherItemsDTL[index].Operation = 'Add';
          this.oSubmitModel.OtherItemsDTL[index].Delete = false;
         }else{
          this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = this.itemQty;
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
     this.setUpdateDataforNoneTrack('Edit');
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
    this.displayTreeDataValue();
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
            this.oSubmitModel.OtherBtchSerDTL[indexBS].Operation = "Edit";     
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
            this.oSubmitModel.OtherBtchSerDTL[indexBS].Operation = "Edit";   
          }          
        }
        this.oSubmitModel.OtherBtchSerDTL[indexBS].DirtyFlag = true;
        this.oSubmitModel.OtherBtchSerDTL[indexBS].Operation = action;                   
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
                    OPTM_TRACKING : data.ItemDeiail[i].OPTM_TRACKING,
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
                  OPTM_BTCHSER: data.BtchSerDeiail[j].OPTM_BTCHSER,
                  OPTM_QUANTITY: data.BtchSerDeiail[j].OPTM_QUANTITY,
                  DirtyFlag: false,                  
                  Operation: 'None',
                  Delete: false
                });
              }
            }
           
            this.displayTreeDataValue();
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

  displayTreeDataValue(){
    this.DisplayTreeData = [];
    for(let treeidx=0; treeidx<this.oSubmitModel.OtherItemsDTL.length; treeidx++){

     let childArr = [];
     for(let q=0; q<this.oSubmitModel.OtherBtchSerDTL.length; q++){
       if(this.oSubmitModel.OtherBtchSerDTL[q].OPTM_ITEMCODE == this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_ITEMCODE){
         childArr.push({
           text: this.oSubmitModel.OtherBtchSerDTL[q].OPTM_BTCHSER,
           quantity: this.oSubmitModel.OtherBtchSerDTL[q].OPTM_QUANTITY
           });                
       }
     } 

       this.DisplayTreeData.push({
         text: this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_ITEMCODE,
         quantity: this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_QUANTITY,
         items : childArr
       })
    }
  }

  SetContainerData(){
    this.scanCurrentItemData = ''
    this.scanItemCode = ''
    this.bsVisible = false;
    this.scanBSrLotNo = ''
    this.itemQty = 0;
    this.bsItemQty = 0; 
    this.oSubmitModel.OPTM_CONT_HDR = [];   
    this.oSubmitModel.OtherItemsDTL = [];   
    this.oSubmitModel.OtherBtchSerDTL = [];   
    this.getItemBatchSerialData();
    this.flagCreate = false;
  }

  CheckDataLoss(){
    this.showDialog("ContainerCodeChange", this.translate.instant("yes"), this.translate.instant("no"),
    this.translate.instant("DataLostAlert"));
  }

  onContainerCodeChangeBlur(){
    if(this.isValidateCalled){
      return
    }
    this.onContainerCodeChange()
  }
 
  async onContainerCodeChange() {
    this.itemBalanceQty = 0;
    this.DisplayTreeData = [];
    this.oSubmitModel.OtherItemsDTL = [];
    this.oSubmitModel.OtherBtchSerDTL = [];
    this.oSubmitModel.OPTM_CONT_HDR = [];

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

    if (this.radioRuleSelected == 1) {
      if(this.autoRuleId == "" || this.autoRuleId == undefined){
        this.containerCode = ''
        this.containerId = ''
        this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
        return;
      }
    }    
    
    var purps = ""
    if (this.purpose == "Shipping") {
      purps = "Y"
    } else {
      purps = "N"
    }

    var createMode = 1;
    if(this.radioRuleSelected == 1){
      createMode = 1;
    }else{
      if (this.autoRuleId == undefined || this.autoRuleId == "") {
        createMode = 3
      } else {
        createMode = 2
      }
    } 

    this.showLoader = true;
    var result = false;
    this.containerCreationService.CheckContainer(this.containerCode, this.whse, this.binNo, this.autoRuleId, this.containerGroupCode,
      this.soNumber, this.containerType, purps, this.radioSelected,createMode).subscribe(
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
                result = false;
                this.scanContCode.nativeElement.focus();
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
                    this.translate.instant("ReopenAlert"));
                  }
                }                            
                this.SetContainerData();
                result = true;
              }            
            }

            //Container is not created. Now creating new container
            if (data.length == 0) {
              this.generateContainer();
              this.flagCreate = true;
            }            
          } else {
            result = false;
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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
      return result
  }

  getCreatedContainer(){

    this.flagCreate = false;
    var purps = ""
    if (this.purpose == "Shipping") {
      purps = "Y"
    } else {
      purps = "N"
    }

    var createMode = 1;
    if(this.radioRuleSelected == 1){
      createMode = 1;
    }else{
      if (this.autoRuleId == undefined || this.autoRuleId == "") {
        createMode = 3
      } else {
        createMode = 2
      }
    } 

    this.showLoader = true;
    this.containerCreationService.CheckContainer(this.containerCode, this.whse, this.binNo, this.autoRuleId, this.containerGroupCode,
      this.soNumber, this.containerType, purps, this.radioSelected,createMode).subscribe(
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
                                           
                this.SetContainerData();
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
              this.containerStatus = '';  
              this.setDefaultValues(); 
            }
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          this.containerStatus = '';  
          this.setDefaultValues(); 
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
    
    if(this.oSubmitModel.OtherItemsDTL.length > 0){
      for(let iCsub=0; iCsub<this.oSubmitModel.OtherItemsDTL.length; iCsub++){  
        if(this.oSubmitModel.OtherItemsDTL[iCsub].OPTM_TRACKING == 'N'){
          this.oSubmitModel.OtherBtchSerDTL.push({
              OPTM_ITEMCODE : "",        
              OPTM_BTCHSER: "",
              OPTM_QUANTITY: 0,
              DirtyFlag: false,
              Operation: 'Add',
              Delete: false           
          })
        }
    }
   }

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
              this.getCreatedContainer();
              // this.scanItemCode = "";
              // this.itemQty = 0;
              // this.containerCode = '';
              // this.containerStatus = '';             
              // this.scanBSrLotNo = ''
              // this.bsItemQty = 0
              // this.oSubmitModel.OPTM_CONT_HDR = [];
              // this.oSubmitModel.OtherItemsDTL = [];
              // this.oSubmitModel.OtherBtchSerDTL = [];            
              // this.bsVisible = false;
              // this.DisplayTreeData = [];  
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

  GetInventoryData() {
    this.oCreateModel.OtherItemsDTL = [];
    this.showLoader = true;
    this.commonservice.GetInventoryData(this.whse, this.binNo, this.autoRuleId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          
          if (data.IteWiseInventory != null && data.IteWiseInventory != undefined) {

            if(data.IteWiseInventory.length > 0){

              let NoneTrackArr = data.IteWiseInventory.filter(val => val.OPTM_TRACKING == 'N');

              if(NoneTrackArr.length > 0){
                for(let idxOth=0; idxOth<NoneTrackArr.length ; idxOth++){

                  let tempArr = this.AutoRuleDTL.filter(val => val.OPTM_ITEMCODE == NoneTrackArr[idxOth].ITEMCODE);
                  
                  this.PartsQty = tempArr[0].OPTM_PARTS_PERCONT;

                  if(NoneTrackArr[idxOth].AvlQty > this.PartsQty){
                    this.oCreateModel.OtherItemsDTL.push({
                      OPTM_ITEMCODE: NoneTrackArr[idxOth].ITEMCODE,
                      OPTM_QUANTITY: Number(this.PartsQty).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
                      OPTM_CONTAINER: "",
                      OPTM_AVLQUANTITY: 0,
                      OPTM_INVQUANTITY: 0,
                      OPTM_BIN: '',
                      OPTM_CONTAINERID: 0,
                      OPTM_TRACKING: NoneTrackArr[idxOth].OPTM_TRACKING ,
                      OPTM_WEIGHT: 1
                    });
                  }
                }
              }
            }
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

  generateContainer() {
  
    this.oCreateModel.HeaderTableBindingData = [];
    //oCreateModel.OtherItemsDTL = [];
    this.oCreateModel.OtherBtchSerDTL = [];
    var createMode = 1;

    if(this.radioRuleSelected == 1){
      createMode = 1;
    }else{
      if (this.autoRuleId == undefined || this.autoRuleId == "") {
        createMode = 3
      } else {
        createMode = 2
      }
    }  
    

    var purps = ""
    if (this.purpose == "Shipping") {
      purps = "Y"
    } else {
      purps = "N"
    }

    this.oCreateModel.HeaderTableBindingData.push({
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

    let callCheckCont = false;

    if(this.oCreateModel.OtherItemsDTL.length > 0){
      this.flagCreate = false;
      callCheckCont = true;
    }
    else{
      this.flagCreate = true;
      callCheckCont = false;
    }

    this.showLoader = true;
    this.containerCreationService.GenerateShipContainer(this.oCreateModel).subscribe(
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

            if(data[0].RESULT != undefined && data[0].RESULT != null){
              this.toastr.error('', data[0].RESULT);
              this.containerCode = '';
              this.scanContCode.nativeElement.focus()
              return;
            }

            this.containerId = data[0].OPTM_CONTAINERID
            this.containerCode = data[0].OPTM_CONTCODE
            this.scanCurrentItemData = ''
            this.scanItemCode = ''
            this.bsVisible = false;
            this.scanBSrLotNo = ''
            this.itemQty = 0;
            this.bsItemQty = 0;            
            this.containerStatus = this.getContainerStatus(data[0].OPTM_STATUS)

            if(callCheckCont){
              this.getCreatedContainer();
            }
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
        case ("ReopenConfirm"):
         this.ReOpenCont();
        break;
        case ("DirtyFlag"): {
          this.autoRuleId = '';
          this.setDefaultValues();
          if (this.radioRuleSelected == 1) {
            this.radioRuleSelected = 2;
          } else {
            this.radioRuleSelected = 1;
            this.checkParent = false;
          }
          break;
        }
      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
         
          case ("ReopenConfirm"):            
            this.containerStatus = '';  
            this.setDefaultValues(); 
          break;
          case ("DirtyFlag"):  
          if (this.radioRuleSelected == 1) {
            this.radioRuleSelected = 1;
            this.checkParent = false;
          } else {
            this.radioRuleSelected = 2;
          } 
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

  isValidateCalled: boolean = false;
  lastFocussedField: any;
  async validateBeforeSubmit():Promise<any>{
    this.isValidateCalled = true;
    var currentFocus = document.activeElement.id;
    console.log("validateBeforeSubmit current focus: "+currentFocus);
    
    if(currentFocus != undefined){
      this.lastFocussedField = currentFocus;
      if(currentFocus == "scanWhse"){
        return this.onWhseChange();
      } else if(currentFocus == "scanBinCode"){
        return this.onBinChange();
      } else if(currentFocus == "scanContType"){
        return this.onContainerTypeChange();
      } else if(currentFocus == "scanAutoRuleId"){
        return this.onAutoPackRuleChange();
      } else if(currentFocus == "scanContGroupCode") {
        return this.IsValidContainerGroup();
      } else if(currentFocus == "scanSONumber") {
        return this.onSONumberChange();
      }

      else if(currentFocus == "scanContCode"){
        return this.onContainerCodeChange()
      } else if(currentFocus == "scanItmCode") {
        return this.onItemCodeChange();
      } else if(currentFocus == "scanItemQty") {
        return this.onScanItemQtyChange();
      } else if(currentFocus == "scanLotNo") {
        return this.IsValidBtchSer();
      } else if(currentFocus == "scanBsItemQty") {
        return this.onBatSerQtyChange();
      }

    }
  }
}
