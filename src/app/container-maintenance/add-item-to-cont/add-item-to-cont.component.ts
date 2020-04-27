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
  //containerLookupType: any;
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
  taskId: any = 0;
  workOrder: any = "";
  operationNo: any = 0;
  oCreateModel: any = {};
  PartsQty : any = 0;
  AutoRuleDTL : any = [];
  ValidBSQty : any = 0;
  inputDialogFor: any;
  titleMessage: any;  
  oDataModel: any = {};
  oParentModel: any = {};
  InternalContainer: boolean =false;
  showInputDialogFlag: boolean= false;
  showInternalDialogFlag: boolean = false;
  showParentDialogFlag: boolean = false;  
  AutoService : any = [];
  bsBalQty: any = 0;
  containerGroupCode: any = '';
  SelectedWOItemCode: any = '';
  DisableScanFields:boolean=true;
  purps: any = "Y";
  ParentCTAray: any = [];
  ParentPerQty : any = 0;
  IsWIPCont: boolean = false;
  showAddToParent: boolean = false;
  bsBalanceQty: number = 0;
  itemBalQty: number = 0;
  addItemOpn: any = "Add";
  RuleItems: any = [];
  MapItemQty: any = 0;
  NonSuccess: boolean = false;
  showHideEnable: boolean = false;
  nextEnabled = true;
  CreateContainerTxt: any = ''

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
  
  showHideDetails() {
    this.showHideEnable = !this.showHideEnable
  }
  onNext(){
    this.nextEnabled = false;
    this.CreateContainerTxt = this.translate.instant("AddItem")
  }
  onBack(){
    this.nextEnabled = true;
    this.CreateContainerTxt = this.translate.instant("CreateContainer")
  }
  treeViewShow = false;
  onOpenTreeview(){
    this.treeViewShow = !this.treeViewShow
  }
  isExpanded: boolean = false;
  expandedKeys: any[] = [];
  public data: any[] = [];
  // public data: any[] = [
  //   {
  //     text: 'Furniture',
  //     quantity: 10,
  //     items: [
  //       { text: 'Tables & Chairs', quantity: 3 },
  //       { text: 'Sofas', quantity: 2 },
  //       { text: 'Occasional Furniture', quantity: 5 }
  //     ]
  //   },
  //   {
  //     text: 'Decor',
  //     quantity: 9,
  //     items: [
  //       { text: 'Bed Linen', quantity: 3 },
  //       { text: 'Curtains & Blinds', quantity: 2 },
  //       { text: 'Carpets', quantity: 4 }
  //     ]
  //   },
  //   {
  //     text: 'Decor',
  //     quantity: 10,
  //     items: [
  //       { text: 'Bed Linen', quantity: 2 },
  //       { text: 'Curtains & Blinds', quantity: 4 },
  //       { text: 'Carpets', quantity: 4 }
  //     ]
  //   }
  // ];

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
    this.CreateContainerTxt = this.translate.instant("CreateContainer")
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.defaultPurpose = this.purposeArray[0];
    this.purpose = this.defaultPurpose.Name;
    this.purposeId = this.defaultPurpose.Value;
    this.radioRuleSelected = 1;
    this.InternalContainer = false;
    this.bsBalQty = 0;  
    this.DisableScanFields = true;
    this.setDefaultValues();
    this.oParentModel.HeaderTableBindingData = [];
    this.showAddToParent = false;

    this.oCreateModel.OtherItemsDTL = [];
    this.oCreateModel.HeaderTableBindingData = [];
    this.oCreateModel.OtherBtchSerDTL = [];
    
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
    this.treeViewShow = false;    
    if(action == 'add'){
      this.radioSelected = 1;
      this.addItemOpn = "Add";      
    }else if(action == 'remove'){
      this.radioSelected = 2;
      this.addItemOpn = "Remove";
    }
    else{
      this.radioSelected = 3;
      this.addItemOpn = "View"
      this.treeViewShow = true;      
    }   
    //this.checkChangeEvent = event;    
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
      this.autoRuleId = ''; this.soNumber = '';
      this.workOrder = ''; this.taskId = 0; this.operationNo = 0;
      this.IsWIPCont = false; this.SelectedWOItemCode = '';
    } else {
      this.radioRuleSelected = 1;     
    }
    this.checkChangeEvent = event;    
  }

  onParentCheckChange(event){
    this.parentContainerType = '';
    this.checkParent = !this.checkParent; 
  }
 
  onPurposeSelectChange(event) {
    this.purpose = event.Name;
    this.purposeId = event.Value;

    if (this.purpose == "Shipping") {
      this.purps = "Y"
    } else {
      this.purps = "N"
    }
  }
  
  setDefaultValues(){
    this.containerCode = '';
    this.containerId = '';
    this.scanItemCode = '';  this.itemQty = 0; this.itemBalQty = 0;  
    this.scanBSrLotNo = ''; this.bsItemQty = 0;
    this.oSubmitModel.OPTM_CONT_HDR =[];
    this.oSubmitModel.OtherItemsDTL =[];
    this.oSubmitModel.OtherBtchSerDTL =[];
    this.DisplayTreeData = []; this.soNumber = '';
    this.workOrder=''; this.operationNo=0; this.taskId=0;
    this.IsWIPCont = false; this.SelectedWOItemCode = '';
  }

  onAutoPackRuleChangeBlur(){
    if(this.isValidateCalled){
      return
    }
    //this.onAutoPackRuleChange()
    this.getAutoPackRule('blur');
  }

  async onAutoPackRuleChange() {

    this.containerCode = ''; this.RuleItems = [];
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
      this.autoRuleId = '';
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
            
            this.AutoRuleDTL = data.OPTM_CONT_AUTORULEDTL;
            this.GetInventoryData();
            result = true;
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
    this.IsValidSONumberBasedOnRule('blur');
  }
  
  IsValidSONumberBasedOnRule(action){

    if(action == 'blur'){
      if (this.soNumber == undefined || this.soNumber == "") {
        return;
      }
    }

    if(this.whse == "" || this.whse == undefined){
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }

    let soNum = '';
    if(action == 'blur'){
      soNum = this.soNumber;
    }

    this.containerCreationService.IsValidSONumberBasedOnRule(soNum,this.autoRuleId,this.whse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
        if(action == 'blur'){
          if (data.length == 0) {
            this.soNumber = '';
            this.toastr.error('', this.translate.instant("InvalidSOAutoRule"));
          } else {
            this.soNumber = data[0].DocEntry
          }
        }else{
          if (data.length == 0) {
            this.toastr.error('', this.translate.instant("NoSOFound"));
            return;
          }
          this.serviceData = data;
          for(let sidx=0; sidx<this.serviceData.length; sidx++){
            if(this.serviceData[sidx].CardName == null || this.serviceData[sidx].CardName == undefined){
              this.serviceData[sidx].CardName = '';
            }
          } 
          this.lookupfor = "SOList";
          this.showLookup = true;
        }
        } else {
          this.soNumber = '';
          this.toastr.error('', this.translate.instant("NoDataFound"));
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
    this.autoRuleId = ''; this.RuleItems= [];
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
    this.autoRuleId = ''; this.RuleItems = [];
    this.setDefaultValues(); 

    if (this.binNo == undefined || this.binNo == "") {
      return;
    }

    if (this.whse == "" || this.whse == undefined) {
      this.binNo = '';
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

  async IsValidContainerGroup() {
    if (this.containerGroupCode == undefined || this.containerGroupCode == "") {
      return;
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
            this.containerGroupCode = data[0].OPTM_CONTAINER_GROUP;
            result = true;
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

          // for (var i = 0; i < data.length; i++) {
          //   data[i].OPTM_LENGTH = data[i].OPTM_LENGTH.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          //   data[i].OPTM_WIDTH = data[i].OPTM_WIDTH.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          //   data[i].OPTM_HEIGHT = data[i].OPTM_HEIGHT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          //   data[i].OPTM_MAXWEIGHT = data[i].OPTM_MAXWEIGHT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          // }
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

  getParentContainerType(action) {

    if(this.containerType == "" || this.containerType == undefined || this.containerType == null){
      this.toastr.error('', this.translate.instant("EnterContainerType"));
      return;
    }

    if(action == 'blur' && this.parentContainerType == ''){
      return;
    }

    this.showLoader = true;
    this.containerCreationService.GetDataForParentContainerType(this.containerType).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if(action == 'lookup'){
            this.serviceData = data;             
            this.showLookup = true;          
            this.lookupfor = "ParentCTList";           
          }else{
            this.ParentCTAray = data;

            if(this.ParentCTAray.length > 0){             
              let index = this.ParentCTAray.findIndex(r=>r.OPTM_PARENT_CONTTYPE == this.parentContainerType);  
              if(index == -1){
                this.parentContainerType = '';
                this.ParentPerQty = 0;
                this.toastr.error('', this.translate.instant("InvalidParentContType"));
                return;
              }  
              else{
                this.ParentPerQty = this.ParentCTAray[index].OPTM_CONT_PERPARENT;
              }           
            }
            else{
              this.parentContainerType = '';
              this.toastr.error('', this.translate.instant("InvalidParentContType"));
              return;
            }
          }
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
    this.onContainerTypeChange();
  }

  onContainerTypeChange() {
    this.parentContainerType = '';
    this.autoRuleId = ''; this.RuleItems = [];
    this.setDefaultValues();
    if (this.containerType == undefined || this.containerType == "") {      
      return;
    }
    if (this.binNo == undefined || this.binNo == "") {
      this.containerType = '';
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
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
            this.containerType = ""; 
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

    this.containerCode = '';
    this.oSubmitModel.OPTM_CONT_HDR =[];
    this.oSubmitModel.OtherItemsDTL =[];
    this.oSubmitModel.OtherBtchSerDTL =[];
    
    for(let cidx=0; cidx<this.oCreateModel.OtherItemsDTL.length; cidx++){
      this.oCreateModel.OtherItemsDTL[cidx].IsWIPItem = false;
    }

    if(this.workOrder == '' || this.workOrder == undefined){
      this.taskId = 0; this.operationNo = 0; this.IsWIPCont = false; this.SelectedWOItemCode = '';
      return;
    }

    this.workOrder == ''; this.taskId = 0; this.operationNo = 0; this.IsWIPCont = false; this.SelectedWOItemCode = '';
    if (this.whse == undefined || this.whse == "") {          
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }

    if (this.binNo == undefined || this.binNo == "") {    
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return;
    }

    if (this.autoRuleId == undefined || this.autoRuleId == "") {          
      this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
      return;
    }

    this.showLoader = true;   
    var result = false
    this.containerCreationService.GetWorkOrderList(this.workOrder,this.whse,this.autoRuleId).subscribe(
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
              this.SelectedWOItemCode = data[0].OPTM_FGCODE;
              this.IsWIPCont = true;

              //Check if any of the Non-Tracked item is same as selected WO Item
              for(let i=0; i<this.oCreateModel.OtherItemsDTL.length; i++){
                if(this.oCreateModel.OtherItemsDTL[i].OPTM_ITEMCODE == this.SelectedWOItemCode){
                  this.oCreateModel.OtherItemsDTL[i].IsWIPItem = true;
                }
              }
            //  this.whse = data[0].OPTM_WHSE; 
            result = true ;
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
    return result;
  }

  GetWorkOrderList() {
   
    if (this.whse == undefined || this.whse == "") {     
      this.workOrder = ''; this.taskId = 0; this.operationNo =0; 
      this.IsWIPCont = false; this.SelectedWOItemCode = '';     
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }

    if (this.binNo == undefined || this.binNo == "") {    
      this.workOrder = ''; this.taskId = 0; this.operationNo = 0; 
      this.IsWIPCont = false; this.SelectedWOItemCode = '';      
      this.toastr.error('', this.translate.instant("BinCanNotBlankMsg"));
      return;
    }

    if (this.autoRuleId == undefined || this.autoRuleId == "") { 
      this.workOrder = ''; this.taskId = 0; this.operationNo = 0; 
      this.IsWIPCont = false; this.SelectedWOItemCode = '';
      this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
      return;
    }
 
   this.showLoader = true;
    this.containerCreationService.GetWorkOrderList('',this.whse,this.autoRuleId).subscribe(
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
        this.parentContainerType = '';
        this.autoRuleId = ''; this.RuleItems = [];;
        this.setDefaultValues();
        this.containerType = $event.OPTM_CONTAINER_TYPE;       
      } 
      else if(this.lookupfor == "ParentCTList"){
        this.parentContainerType = $event.OPTM_PARENT_CONTTYPE;
        this.ParentPerQty = $event.OPTM_CONT_PERPARENT;
      }
      else if (this.lookupfor == "CARList") {
        this.autoRuleId = $event.OPTM_RULEID;
        this.packType = $event.OPTM_CONTUSE;        
        this.bsVisible = false;
        this.setDefaultValues(); 
        this.AutoRuleDTL = this.AutoService.filter(r=> r.OPTM_RULEID == $event.OPTM_RULEID);
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
      } else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
      } else if (this.lookupfor == "ContainerIdList") {

      }
      else if(this.lookupfor == "ContItemsList"){

        this.oDataModel.HeaderTableBindingData = [];

        //If Rule Qty is already fulfilled on serve and we are trying to add more
        if(this.autoRuleId != ""  && !this.flagCreate && this.radioSelected == 1){ 
          if(this.oSubmitModel.OtherItemsDTL.length >0){
           let index =  this.oSubmitModel.OtherItemsDTL.findIndex(r=>r.OPTM_ITEMCODE == $event.ITEMCODE && r.OPTM_QUANTITY == $event.OPTM_PARTS_PERCONT); 
           if(index > -1){
             this.toastr.error('',this.translate.instant("ItemReqQty"));
             this.scanItemCode = ''; this.itemQty = 0; this.itemBalQty = 0;  
             return;
           }
          }
         }

        this.scanItemCode = $event.ITEMCODE;
        this.scanItemTracking = $event.OPTM_TRACKING;
        this.itemQty = 0; this.itemBalQty = 0;  
        this.scanBSrLotNo = '';
        this.bsItemQty = 0;
        this.MapRuleQty = 0; this.MapItemQty = 0;    
        this.ValidItemQty = 0;

        if ($event.LOTTRACKINGTYPE != undefined && $event.LOTTRACKINGTYPE != "N") {
          this.bsVisible = true;
        } else {
          this.bsVisible = false;
        }

        if (this.autoRuleId != "" ){
          this.MapRuleQty = $event.OPTM_PARTS_PERCONT;
          this.itemQty = $event.OPTM_PARTS_PERCONT;
          this.ValidItemQty = this.MapRuleQty;          
          //this.itemBalQty = $event.OPTM_PARTS_PERCONT;  
          this.calculateBalanceQty($event.OPTM_PARTS_PERCONT);           
          if(!this.flagCreate){             
          }          

        //  this.setItemBalanceQty();
        }   
        else{
         // this.itemBalQty = 0;
         this.MapItemQty = $event.TOTALQTY;    
         this.calculateBalanceQty($event.TOTALQTY);   
        }

        //Creating model for Internal
        this.oDataModel.HeaderTableBindingData.push({
          OPTM_CREATEMODE:  this.radioRuleSelected,
          OPTM_PURPOSE: this.purpose,
          OPTM_WHSE: this.whse,
          OPTM_BIN: this.binNo,
          OPTM_CONTAINER_TYPE: this.containerType,
          OPTM_AUTORULEID: this.autoRuleId,
          OPTM_CONT_CODE: this.containerCode,
          OPTM_ITEMCODE: this.scanItemCode,
          ShowLookupFor: "Internal",
          IsWIPCont: this.IsWIPCont 
        });

       }else if(this.lookupfor == "ContItemBatchSerialList"){
        this.scanBSrLotNo = $event.LOTNO;
        this.bsItemQty = 0; 
        
        if (this.scanItemTracking == 'S') {         
          if(this.ValidateScanSerialQty() == false){
            return;
          }else{
            this.bsItemQty = 1; 
          }         
        }else{        
          this.ValidBSQty =$event.TOTALQTY;
        // this.bsBalQty = $event.TOTALQTY;
          if(this.setBSBalanceQty($event.TOTALQTY) == false){ 
            return;
          }
        }
      //  this.scanBsItemQty.nativeElement.focus();
      }else if(this.lookupfor == "WOLIST"){
        this.containerCode = '';
        this.oSubmitModel.OPTM_CONT_HDR =[];
        this.oSubmitModel.OtherItemsDTL =[];
        this.oSubmitModel.OtherBtchSerDTL =[];        
        this.IsWIPCont = false; this.SelectedWOItemCode = '';

        if(this.whse != $event.OPTM_WHSE){
          this.toastr.error('', this.translate.instant("Diff_WH"));
          this.workOrder = ''; this.taskId =0; this.operationNo = 0;
          return;
        }       

        this.workOrder = $event.OPTM_WONO;
        this.taskId = $event.OPTM_ID;
        this.operationNo = $event.OPTM_FROMOPERNO;
        this.SelectedWOItemCode = $event.OPTM_FGCODE;
        this.IsWIPCont = true;

        //Check if any of the Non-Tracked item is same as selected WO Item
        for(let i=0; i<this.oCreateModel.OtherItemsDTL.length; i++){
          if(this.oCreateModel.OtherItemsDTL[i].OPTM_ITEMCODE == this.SelectedWOItemCode){
            this.oCreateModel.OtherItemsDTL[i].IsWIPItem = true;
          }
        }
      }
      else if("RULEITEMS"){
        
      }
    }
  }

  containerId: any;
 
  onItemCodeChangeBlur(){
    if(this.isValidateCalled){
      return
    }
    this.onItemCodeChange()
  }

  scanCurrentItemData: any;
  async onItemCodeChange() {
    this.oDataModel.HeaderTableBindingData = [];
    this.InternalContainer = false;
    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.itemQty = 0; this.itemBalQty = 0; 
      this.scanLotNo = ''; this.bsItemQty = 0;
      return;
    }

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      this.scanItemCode = ''; this.itemQty = 0; this.itemBalQty=0;
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
            this.itemBalQty = 0;           
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
            this.scanItmCode.nativeElement.focus();
            result = false
            return;
          } else {

            //If Rule Qty is already fulfilled on server data and still trying to add
            if(this.autoRuleId != ""  && !this.flagCreate && this.radioSelected == 1){ 
             if(this.oSubmitModel.OtherItemsDTL.length >0){
              let index =  this.oSubmitModel.OtherItemsDTL.findIndex(r=>r.OPTM_ITEMCODE == data[0].ITEMCODE && r.OPTM_QUANTITY == data[0].OPTM_PARTS_PERCONT); 
              if(index > -1){
                this.toastr.error('',this.translate.instant("ItemReqQty"));
                this.scanItemCode = ''; this.itemQty = 0; this.itemBalQty = 0;  
                this.bsVisible = false;
                this.scanItmCode.nativeElement.focus();
                result = false;
                return;
              }
             }
            }

            this.scanItemCode = data[0].ITEMCODE;
            this.scanItemTracking = data[0].OPTM_TRACKING;
            this.scanBSrLotNo = '';
            this.itemQty = 0; this.itemBalQty = 0;  
            this.bsItemQty = 0;
            this.MapRuleQty = 0;
            this.ValidItemQty = 0;
            this.bsBalanceQty = 0;

            if (data[0].LOTTRACKINGTYPE != undefined && data[0].LOTTRACKINGTYPE != "N") {
              this.bsVisible = true;             
            } else {
              this.bsVisible = false;
            }

            if (this.autoRuleId != "" ){
              this.MapRuleQty = data[0].OPTM_PARTS_PERCONT;
              this.itemQty = data[0].OPTM_PARTS_PERCONT;
              this.ValidItemQty = data[0].OPTM_PARTS_PERCONT;
              this.calculateBalanceQty(data[0].OPTM_PARTS_PERCONT);            
              }else{ 
               this.MapItemQty = data[0].TOTALQTY;       
               this.calculateBalanceQty(data[0].TOTALQTY);
              }
             // this.setItemBalanceQty();
          }
          this.scanCurrentItemData = data
          result = true

          //Creating model for Internal
          this.oDataModel.HeaderTableBindingData.push({
            OPTM_CREATEMODE:  this.radioRuleSelected,
            OPTM_PURPOSE: this.purpose,
            OPTM_WHSE: this.whse,
            OPTM_BIN: this.binNo,
            OPTM_CONTAINER_TYPE: this.containerType,
            OPTM_AUTORULEID: this.autoRuleId,
            OPTM_CONT_CODE: this.containerCode,
            OPTM_ITEMCODE: this.scanItemCode,
            ShowLookupFor: "Internal",
            IsWIPCont: this.IsWIPCont 
          });

        } else {
          this.scanCurrentItemData = ''
          this.scanItemCode = ''
          this.bsVisible = false;
          this.scanBSrLotNo = ''
          this.itemQty = 0; this.itemBalQty = 0;  
          this.bsItemQty = 0
          this.toastr.error('', this.translate.instant("InvalidItemCode"));
          result = false
          this.scanItmCode.nativeElement.focus();
          return; 
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

  calculateBalanceQty(TotalQty){
    if(this.oSubmitModel.OtherItemsDTL.length > 0){
      let val = 0
      if(this.oSubmitModel.OtherBtchSerDTL.length > 0){
        let BatSerArr = this.oSubmitModel.OtherBtchSerDTL.filter(r=>r.OPTM_ITEMCODE == this.scanItemCode);
        if(BatSerArr.length > 0){
          for(let i=0; i<BatSerArr.length; i++){
            val = val + BatSerArr[i].OPTM_QUANTITY;
          }         
        }
        //In case of Non-tracked Item
        else{
          let NonArr = this.oSubmitModel.OtherItemsDTL.filter(r=>r.OPTM_ITEMCODE == this.scanItemCode);
          if(NonArr.length > 0){
            for(let i=0; i<NonArr.length; i++){
              val = val + NonArr[i].OPTM_QUANTITY;
            }         
          }
        }
      }
      else{
        //In case - if only Non-tracked Item is present
        let NonArr = this.oSubmitModel.OtherItemsDTL.filter(r=>r.OPTM_ITEMCODE == this.scanItemCode);
        if(NonArr.length > 0){
          for(let i=0; i<NonArr.length; i++){
            val = val + NonArr[i].OPTM_QUANTITY;
          }         
        }
      } 
      this.itemBalQty = TotalQty - val;    
    }else{
      this.itemBalQty = TotalQty;
    }
  }

  openInternalCont(){

    if(this.scanItemCode == undefined || this.scanItemCode == ''){
      this.toastr.error('', this.translate.instant("SelectItemCode"));      
      return;
    }

    this.showInputDialog("InternalCont", this.translate.instant("Confirm"), this.translate.instant("Cancel"),
    this.translate.instant("Select_Container"));
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

          for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
            this.serviceData[iBtchIndex].TOTALQTY = Number(this.serviceData[iBtchIndex].TOTALQTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          }

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

    if(this.itemQty == 0 || this.itemQty == undefined){
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
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

          for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
            this.serviceData[iBtchIndex].TOTALQTY = Number(this.serviceData[iBtchIndex].TOTALQTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          }

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

  ValidateScanSerialQty(){
   if(this.radioSelected == 1){
    if(this.oSubmitModel.OtherItemsDTL.length >0){
      if(this.oSubmitModel.OtherBtchSerDTL.length > 0){
      let index = this.oSubmitModel.OtherBtchSerDTL.findIndex(r=>r.OPTM_ITEMCODE == this.scanItemCode && r.OPTM_BTCHSER == this.scanBSrLotNo);
       if(index > -1){
          this.toastr.error('',this.translate.instant("SerialItemCannotAdd"));
          this.scanBSrLotNo = ''; this.bsItemQty = 0;
          return false;
       }
      }
    }
   }
   else{
      if(this.oSubmitModel.OtherBtchSerDTL.length > 0){
        let index =  this.oSubmitModel.OtherBtchSerDTL.findIndex(r=>r.OPTM_BTCHSER == this.scanBSrLotNo); 
        if(index == -1){
        this.toastr.error('',this.translate.instant("CannotRemoveCont"));
        this.scanBSrLotNo = ''; this.bsItemQty = 0;       
        return false;
       }
      }else{
        this.toastr.error('',this.translate.instant("CannotRemoveCont"));
        this.scanBSrLotNo = ''; this.bsItemQty = 0;     
        return false;
      }
    }   
    return true; 
  }
  
  onBatchSerialBlur(){
    if(this.isValidateCalled){
      return
    }
    this.IsValidBtchSer()
  }

  scanCurrentLotNoData: any;
  IsValidBtchSer() {

    this.bsBalQty = 0;    
    if ((this.scanBSrLotNo == undefined || this.scanBSrLotNo == "")) {
      return;
    }

    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.toastr.error('', this.translate.instant("BtchSrNBlank"));
      this.scanBSrLotNo = ''
      return;
    }

    if(this.itemQty == 0 || this.itemQty == undefined){
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      return;
    }

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
              this.scanBSrLotNo = '';
              this.bsItemQty = 0;  
              this.scanCurrentLotNoData = '';
              this.toastr.error('', this.translate.instant("Plt_InValidBatchSerial"));
              result = false
              this.scanLotNo.nativeElement.focus()
            } else {

              if(this.scanItemTracking == 'S'){
                if(this.ValidateScanSerialQty() == false){
                   return;
                } 
              }
  
              this.scanBSrLotNo = data[0].LOTNO;
              this.bsItemQty = 0;
              this.scanCurrentLotNoData = data;
  
              if (this.scanItemTracking == 'S') {
                this.bsItemQty = 1;   
              }else{
                //this.bsItemQty = data[0].TOTALQTY;
                this.ValidBSQty = data[0].TOTALQTY; 
                if(this.setBSBalanceQty(data[0].TOTALQTY) == false){ 
                  return;
                }                      
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
    
    return result
  }

  setItemBalanceQty(){
    let arr = this.oSubmitModel.OtherItemsDTL.filter(r=>r.OPTM_ITEMCODE == this.scanItemCode);
    if(arr.length >0){

     let sum = 0;
     for(let oidx=0; oidx<this.oSubmitModel.OtherBtchSerDTL.length; oidx++){
      if(this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_ITEMCODE == this.scanItemCode && this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_BTCHSER == this.scanBSrLotNo){
        sum = sum+this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_QUANTITY;
      }
    }
    }else if(this.autoRuleId != '' && this.autoRuleId != undefined){
      this.itemBalQty = this.MapRuleQty;
    }
  }

  setBSBalanceQty(TotalQty){
    let arr = this.oSubmitModel.OtherItemsDTL.filter(r=>r.OPTM_ITEMCODE == this.scanItemCode);
    if(arr.length >0){
      let sum = 0;
      for(let oidx=0; oidx<this.oSubmitModel.OtherBtchSerDTL.length; oidx++){
        if(this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_ITEMCODE == this.scanItemCode && this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_BTCHSER == this.scanBSrLotNo){
          sum = sum+this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_QUANTITY;
        }
      }
      this.bsBalanceQty = TotalQty - sum;
    }else{
      this.bsBalanceQty = TotalQty;
    }

    if(this.bsBalanceQty == 0 && this.radioSelected == 1){
      this.toastr.error('',this.translate.instant("NoBatchSerialQtyToAdd"));
      this.scanBSrLotNo = ''; this.bsItemQty = 0;
      return false;
    }
    return true;
  }

  onBatSerQtyChange(){
    if (this.itemQty == undefined || this.itemQty == 0) {
      this.bsItemQty = 0;
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      this.scanBsItemQty.nativeElement.focus()
      return false;
    }
    if (this.bsItemQty == undefined || this.bsItemQty == 0 || this.bsItemQty < 0) {
     // this.toastr.error('',this.translate.instant("Please enter Batch/Serial Qty"));
      this.scanBsItemQty.nativeElement.focus();
      return false;
    }

    if (this.bsItemQty > this.bsBalanceQty && this.radioSelected == 1) {
      this.toastr.error('',this.translate.instant("QtyCannotGreater"));
      this.bsItemQty = 0;
    //  this.scanBsItemQty.nativeElement.focus();
      return false; 
    }
    return true;
  }

  onConfirmClick(){

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      this.scanItemCode = ''; this.itemQty = 0; this.itemBalQty=0;
      this.scanLotNo = ''; this.bsItemQty = 0;
      return;
    }

    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.toastr.error('', this.translate.instant("EnterItemCode"));
      this.itemQty = 0; this.itemBalQty = 0;
      this.scanLotNo = ''; this.bsItemQty = 0;
      return;
    }  
    
    if (this.itemQty == undefined || this.itemQty == 0) {
      this.scanLotNo=''; this.bsItemQty = 0;
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      return;
    }

    if(this.scanItemTracking == "N"){
      this.SetDataForNoneTrackItem()
      if(!this.NonSuccess){
        this.itemQty = 0;
        return;
      }        
      this.scanItemCode = ''; this.itemQty = 0;  this.itemBalQty = 0;  
      this.displayTreeDataValue();  
      return;   
     
    }else if(this.scanItemTracking == "S"){
      this.bsItemQty = 1;
      if(this.ValidateScanSerialQty() == false){
        return;
     } 
    }      
      if(this.bsItemQty == 0 || this.bsItemQty == undefined){
        this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
        return;
      }

      if (this.bsItemQty > this.bsBalanceQty && this.radioSelected == 1) {
        this.toastr.error('',this.translate.instant("QtyCannotGreater"));
        this.bsItemQty = 0;
        return ; 
      }

      this.SetDataInSubmitModel();    
      this.scanBSrLotNo = '';
      this.bsItemQty = 0; this.bsBalanceQty = 0;   

    if(this.autoRuleId != '' && this.autoRuleId != undefined){
      this.calculateBalanceQty(this.MapRuleQty);
    }else{
      this.calculateBalanceQty(this.MapItemQty);
    }   
    
    if(this.oSubmitModel.OtherItemsDTL.length > 0){
      //this.enable
    }
  }

  onScanItemQtyChange(){

    if(this.scanItemCode == '' || this.scanItemCode == undefined){            
        this.itemQty = 0; this.itemBalQty = 0;  
        return false;
    }

    if(this.itemQty == 0 || this.itemQty == '' || this.itemQty == undefined){    
      this.scanBSrLotNo = ''; this.bsItemQty = 0;   
      return false;
    }
    
    //if(this.autoRuleId != ""){  //ValidItemQty
      if(this.itemQty > this.itemBalQty){
        this.toastr.error('', this.translate.instant("ScannedQtyCannotGreater"));
        this.scanBSrLotNo = ''; this.bsItemQty = 0; this.itemQty = 0
        this.scanItemQty.nativeElement.focus()
        return false;
      } 
   // }

    // if(this.autoRuleId == '' || this.autoRuleId == undefined){
    //   this.itemBalQty = this.itemQty;
    // }

    // if(this.scanItemTracking == 'N'){
    //   this.SetDataForNoneTrackItem();
    //   this.scanItemCode = ''; this.itemQty = 0;  this.itemBalQty = 0;  
    //   this.displayTreeDataValue();
    // }
    return true;
  }

  setUpdateDataforNoneTrack(action){
    let index =  this.oSubmitModel.OtherItemsDTL.findIndex(r=>r.OPTM_ITEMCODE == this.scanItemCode); 
    if(index == -1){ //Item not found
      if(this.radioSelected == 1) { // If Add
      
      this.oSubmitModel.OtherItemsDTL.push({
        OPTM_ITEMCODE : this.scanItemCode,
        OPTM_TRACKING : this.scanItemTracking,
        OPTM_QUANTITY: this.itemQty,
        OPTM_ITEM_QTY: this.MapRuleQty,
        DirtyFlag: true,
        Operation: 'Add',
        Delete: false,
        IsWIPItem: false
      });
      this.NonSuccess = true;
      }else{ //If Remove
        this.toastr.error('',this.translate.instant("Cannotremoveitm"));
       // this.scanItemCode = ''; this.itemQty = 0; this.itemBalQty = 0; 
       this.NonSuccess = false; 
        return;
      }      
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

       this.NonSuccess = true;
       
      }else{ //If Remove
        if(action == 'Add'){
        let diff = this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY - this.itemQty;
        if(diff < 0){
          this.toastr.error('', this.translate.instant("Cannotremovegrtless"));
          this.bsItemQty = 0;    
          this.NonSuccess = false;
          return ;
        }else if(diff == 0){
          this.oSubmitModel.OtherItemsDTL.splice(index,1);
          this.NonSuccess = true;
          return ;
        }else{
          this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = diff;           
        }
      
          this.oSubmitModel.OtherItemsDTL[index].Operation = 'Add';
          this.oSubmitModel.OtherItemsDTL[index].Delete = false;
          this.NonSuccess = true;
         }else{
          this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = this.itemQty;
          this.oSubmitModel.OtherItemsDTL[index].Operation = 'Edit';
          this.oSubmitModel.OtherItemsDTL[index].Delete = true;
          this.NonSuccess = true;
         }
         this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;
         this.NonSuccess = true;
      }
    }
  }

  SetDataForNoneTrackItem(){
   
    if(this.flagCreate){    
      //On adding 1st item
    if(this.oSubmitModel.OtherItemsDTL.length == 0){
      if(this.radioSelected == 1){
        this.oSubmitModel.OtherItemsDTL.push({
          OPTM_ITEMCODE : this.scanItemCode,
          OPTM_TRACKING : this.scanItemTracking,
          OPTM_QUANTITY: this.itemQty,
          OPTM_ITEM_QTY: this.MapRuleQty,
          DirtyFlag: true,
          Operation: 'Add',
          Delete: false,
          IsWIPItem: (this.IsWIPCont && this.scanItemCode == this.SelectedWOItemCode) ? true:false
        });
        this.NonSuccess = true;
      }else{
        this.toastr.error('',this.translate.instant("CannotRemoveCont"));
        this.NonSuccess = false;
        return;
      }      
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
        if(this.radioSelected == 1){ //In case of Add
          this.oSubmitModel.OtherItemsDTL.push({
            OPTM_ITEMCODE : this.scanItemCode,
            OPTM_TRACKING : this.scanItemTracking,
            OPTM_QUANTITY: this.itemQty,
            OPTM_ITEM_QTY: this.MapRuleQty,
            DirtyFlag: true,
            Operation: 'Add',
            Delete: false,
            IsWIPItem: (this.IsWIPCont && this.scanItemCode == this.SelectedWOItemCode) ? true:false
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
        }else{ //In case if remove and no item is present
          this.toastr.error('',this.translate.instant("CannotRemoveCont"));
          return;
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
          Delete: false,
          IsWIPItem: (this.IsWIPCont && this.scanItemCode == this.SelectedWOItemCode) ? true:false
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
        this.toastr.error('', this.translate.instant("Cannotremoveitm"));
        //this.itemQty = 0; this.scanItemCode = ''; this.itemBalQty = 0;  
        return;
      }
    }
    //If item found
    else{     

      if(this.radioSelected == 1){ //Case of Add
        if(this.oSubmitModel.OtherItemsDTL[index].Operation != "Add"){ //Case of already existing item
          this.oSubmitModel.OtherItemsDTL[index].Operation = action;
        }
        this.oSubmitModel.OtherItemsDTL[index].Delete = false;
      }
      else{ //case of remove
        if(this.oSubmitModel.OtherItemsDTL[index].Operation == "Add"){ //case of new item
          this.oSubmitModel.OtherItemsDTL[index].Delete = false;
        }else{
          this.oSubmitModel.OtherItemsDTL[index].Delete = true; //Case of existing item present in server
        }
      }

      this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = this.itemQty;
      this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;

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
          this.toastr.error('', this.translate.instant("Cannotremovebatser"));
          this.scanBSrLotNo = ''; this.bsItemQty = 0;
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
            this.oSubmitModel.OtherItemsDTL[index].Operation = "Edit";   
          }         
          this.oSubmitModel.OtherBtchSerDTL[indexBS].Delete = false;
        }
        else{
          if(action == 'Add'){
            let diff = this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY - this.bsItemQty;
            if(diff < 0){
              this.toastr.error('', this.translate.instant("Cannotremovegrtless"));
              this.bsItemQty = 0;
              return;
            }else if(diff == 0){
              let Carray = [];
              this.oSubmitModel.OtherBtchSerDTL.splice(indexBS,1); 
              Carray = this.oSubmitModel.OtherBtchSerDTL.filter(r=>r.OPTM_ITEMCODE == this.scanItemCode);
              if(Carray.length == 0){
                this.oSubmitModel.OtherItemsDTL = this.oSubmitModel.OtherItemsDTL.filter(r=>r.OPTM_ITEMCODE != this.scanItemCode);
              }   
              return;           
            }else{
              this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY = diff; 

              this.oSubmitModel.OtherBtchSerDTL[indexBS].Delete = false;
              this.oSubmitModel.OtherBtchSerDTL[indexBS].Operation = "Add";        
            }
          }
          else{
            this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY = this.bsItemQty;
            this.oSubmitModel.OtherBtchSerDTL[indexBS].Delete = true;
            this.oSubmitModel.OtherBtchSerDTL[indexBS].Operation = "Edit";   
            this.oSubmitModel.OtherItemsDTL[index].Operation = "Edit"; 
          }          
        }
        this.oSubmitModel.OtherBtchSerDTL[indexBS].DirtyFlag = true;                          
      }
    }
    }  
  }

  getAutoPackRule(action) {

    let RuleId = '';
    if (this.containerType == undefined || this.containerType == "") {
      this.toastr.error('', this.translate.instant("SelectContainerMsg"));
      return;
    }

    if(action == 'blur'){
      this.containerCode = ''; this.RuleItems = [];
      this.setDefaultValues();
      if (this.autoRuleId == undefined || this.autoRuleId == "") {
        return;
      }
      RuleId = this.autoRuleId;
    }else{
      RuleId = '';
    }

    this.showLoader = true;
    this.commonservice.GetDataForContainerAutoRule(this.containerType,RuleId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if(action == 'lookup'){

            this.showLookup = true;
            this.serviceData = data.OPTM_CONT_AUTORULEHDR;
            this.AutoService = data.OPTM_CONT_AUTORULEDTL;
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

          }else{
            if (data.OPTM_CONT_AUTORULEHDR.length > 0) {
              this.autoRuleId = data.OPTM_CONT_AUTORULEHDR[0].OPTM_RULEID;
              this.AutoRuleDTL = data.OPTM_CONT_AUTORULEDTL;
              this.GetInventoryData();              
            } else {
              this.autoRuleId = '';
              this.scanAutoRuleId.nativeElement.focus();
              this.toastr.error('', this.translate.instant("RuleIdInvalidMsg"));
            }         
            this.bsVisible = false;          
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
                    Delete: false,
                    IsWIPItem: (this.IsWIPCont && data.ItemDeiail[i].OPTM_ITEMCODE == this.SelectedWOItemCode) ? true:false
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
    let DisplayChildData:any =[];

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

     DisplayChildData.push({
         text: this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_ITEMCODE,
         quantity: this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_QUANTITY,
         items : childArr
       });       
    }

    this.DisplayTreeData.push({
      text: this.containerCode,
      quantity: this.oSubmitModel.OtherItemsDTL.length,
      items : DisplayChildData
    }); 
  }

  SetContainerData(){
    this.scanCurrentItemData = ''
    this.scanItemCode = ''
    this.bsVisible = false;
    this.scanBSrLotNo = ''
    this.itemQty = 0; this.itemBalQty = 0;  
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
    this.InternalContainer = false;
    this.DisableScanFields = true;
    this.oParentModel.HeaderTableBindingData = [];

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
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
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

    if(this.checkParent && this.parentContainerType == ''){
      this.toastr.error('',this.translate.instant("ParentContType"));
      this.containerCode = ''; this.containerId = '';        
      return;
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
      this.soNumber, this.containerType, this.purps, this.radioSelected,createMode).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            //Container is already created but there is some error
            if (data.OUTPUT[0].RESULT != undefined && data.OUTPUT[0].RESULT != null && data.OUTPUT[0].RESULT != '') {
              this.toastr.error('', data.OUTPUT[0].RESULT);              
              this.flagCreate = false;               
              
              if(data.OPTM_CONT_HDR[0].OPTM_STATUS == 3){ //If Container is closed
                this.showAddToParent = true;  
                this.SetContainerData();
                this.radioSelected = 3;
                this.treeViewShow = true;                  
              }else{
                this.showAddToParent = false;  
                this.containerCode = '';
              }
              this.DisableScanFields = true;            
              result = false;
            }
            else if(data.OPTM_CONT_HDR.length == 0){
              this.generateContainer();
              this.flagCreate = true;
              this.DisableScanFields = false;
            }
            else if(data.OPTM_CONT_HDR.length > 0){
              //Container is already created and fetching data
              
              //this.CheckDataLoss();
              this.containerId = data.OPTM_CONT_HDR[0].OPTM_CONTAINERID;
              this.containerCode = data.OPTM_CONT_HDR[0].OPTM_CONTCODE;
              this.containerStatus = this.getContainerStatus(data.OPTM_CONT_HDR[0].OPTM_STATUS); 
              
              if(data.OPTM_CONT_HDR[0].OPTM_STATUS == 3){
                this.showAddToParent = true;
                this.DisableScanFields = true;
              }else{
                this.showAddToParent = false;
                this.DisableScanFields = false;
              }

              if(this.radioSelected == 2){
                if(data.OPTM_CONT_HDR[0].OPTM_STATUS == 3){
                  this.showDialog("ReopenConfirm", this.translate.instant("yes"), this.translate.instant("no"),
                  this.translate.instant("ReopenAlert"));
                }
              }                            
              this.SetContainerData();            
              result = true;
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
      this.soNumber, this.containerType, this.purps, this.radioSelected,createMode).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            if (data.length > 0) {

              this.containerId = data.OPTM_CONT_HDR[0].OPTM_CONTAINERID;
              this.containerCode = data.OPTM_CONT_HDR[0].OPTM_CONTCODE;
              this.containerStatus = this.getContainerStatus(data.OPTM_CONT_HDR[0].OPTM_STATUS);                                          
              this.SetContainerData();

              if(data.OPTM_CONT_HDR[0].OPTM_STATUS == 3){
                this.showAddToParent = true;
                this.DisableScanFields = true;
              }else{
                this.showAddToParent = false;
                this.DisableScanFields = false;
              } 

              this.DisplayTreeData();

              //Container is already created but there is some error
              // if (data[0].RESULT != undefined && data[0].RESULT != null) {
              //   this.toastr.error('', data[0].RESULT);
              //   this.flagCreate = false;
              //   this.containerCode = ''; 
              //   this.setDefaultValues();                
              //   return;
              // }
              // else {
               
              //   this.containerId = data[0].OPTM_CONTAINERID;
              //   this.containerCode = data[0].OPTM_CONTCODE;
              //   this.containerStatus = this.getContainerStatus(data[0].OPTM_STATUS); 
                                           
              //   this.SetContainerData();
              // }            
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
   
    if(this.oSubmitModel.OtherItemsDTL.length == 0){
      this.toastr.error('',this.translate.instant("AddItemToUpdate"));
      return;
    }     

    this.oSubmitModel.OPTM_CONT_HDR = []
    this.oSubmitModel.OPTM_CONT_HDR.push({
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_CONTID: this.containerId,
      OPTM_CONTCODE: this.containerCode,
      OPTM_CONTTYPE: this.containerType,
      OPTM_RULEID: this.autoRuleId,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_OPERATION: this.addItemOpn,
      OPTM_NO_OF_PACK: this.noOfPack,
      IsWIPCont: this.IsWIPCont 
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
              Delete: false,
              IsWIPItem: this.workOrder != ''? true : false          
          })
        }

      if(this.oSubmitModel.OtherItemsDTL[iCsub].OPTM_ITEMCODE == this.SelectedWOItemCode ){
        this.oSubmitModel.OtherItemsDTL[iCsub].IsWIPItem = true;
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

          if (data[0].RESULT != null && data[0].RESULT != undefined && data[0].RESULT != ''){
            this.toastr.error('', data[0].RESULT );
            return;
          }
          else{

            this.toastr.success('', this.translate.instant("ItemUpdatedSuccessMsg"));
            this.getCreatedContainer();

            this.scanItemCode = "";
            this.itemQty = 0; this.itemBalQty = 0;  
                
            this.scanBSrLotNo = ''
            this.bsItemQty = 0
              
            this.bsVisible = false;
            //return;

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
  
  openRuleItems(){
    if(this.RuleItems.length > 0){
      this.serviceData = this.RuleItems;
      this.lookupfor = "RULEITEMS";
      this.showLookup = true;     
    }else{
      this.toastr.error('',this.translate.instant("NoRuleItem"));
      return;
    }
  }

  GetInventoryData() {
    this.oCreateModel.OtherItemsDTL = [];
    this.RuleItems = [];
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

              this.RuleItems = data.IteWiseInventory;

              let NoneTrackArr = data.IteWiseInventory.filter(val => val.OPTM_TRACKING == 'N');

              if(NoneTrackArr.length > 0){
                for(let idxOth=0; idxOth<NoneTrackArr.length ; idxOth++){

                  let tempArr = this.AutoRuleDTL.filter(val => val.OPTM_ITEMCODE == NoneTrackArr[idxOth].ITEMCODE);                  
                  this.PartsQty = tempArr[0].OPTM_PARTS_PERCONT;                 
                
                    this.oCreateModel.OtherItemsDTL.push({
                      OPTM_ITEMCODE: NoneTrackArr[idxOth].ITEMCODE,
                      OPTM_QUANTITY: Number(this.PartsQty).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
                      OPTM_CONTAINER: "",
                      OPTM_AVLQUANTITY: Number(NoneTrackArr[idxOth].AvlQty).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
                      OPTM_INVQUANTITY: 0,
                      OPTM_BIN: '',
                      OPTM_CONTAINERID: 0,
                      OPTM_TRACKING: NoneTrackArr[idxOth].OPTM_TRACKING ,
                      OPTM_WEIGHT: 1,
                      IsWIPItem: (this.IsWIPCont && this.scanItemCode == this.SelectedWOItemCode) ? true:false
                    });                
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

  saveReportProgress(){ 
    let ProdQty = 0;    
    if(this.oCreateModel.OtherItemsDTL.length >0){
      let index = this.oCreateModel.OtherItemsDTL.findIndex(r=>r.IsWIPItem == true);
      ProdQty = this.oCreateModel.OtherItemsDTL[index].OPTM_QUANTITY;      
    }else{
      this.toastr.error('',this.translate.instant("NoRuleItemRP"));
      return;
    }
    
    this.showLoader = true;
    this.containerCreationService.SaveReportProgress(this.taskId, ProdQty).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if(data == "True"){
            this.toastr.success('',this.translate.instant('ReportProgressSuccess'));
          }else{
            this.toastr.error('',this.translate.instant('ReportProgressError'));
          }
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

    let tempArray: any = {};
    tempArray.HeaderTableBindingData = [];
    tempArray.OtherItemsDTL = [];
    tempArray.OtherBtchSerDTL = [];
  
    this.oCreateModel.HeaderTableBindingData = [];   
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

    let callCheckCont = false;

    if(this.oCreateModel.OtherItemsDTL.length > 0){
      this.flagCreate = false;
      callCheckCont = true;
    }
    else{
      this.flagCreate = true;
      callCheckCont = false;
    }
   
    this.oCreateModel.HeaderTableBindingData.push({
      OPTM_SONO: (this.soNumber == undefined) ? '' : this.soNumber,
      OPTM_CONTAINERID: 0,
      OPTM_CONTTYPE: this.containerType,
      OPTM_CONTAINERCODE: this.containerCode,
      OPTM_WEIGHT: 0,
      OPTM_AUTOCLOSE_ONFULL: this.autoRuleId == '' ? 'N' : 'Y',
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
      OPTM_GROUP_CODE: this.containerGroupCode,
      OPTM_CREATEMODE: createMode,
      // OPTM_PERPOSE: this.purposeId,
      OPTM_PERPOSE: this.purps,
      OPTM_FUNCTION: "Shipping",
      OPTM_OBJECT: "Container",
      OPTM_WONUMBER: this.workOrder == '' ? 0 : this.workOrder,
      OPTM_TASKHDID: this.taskId == '' ? 0 : this.taskId,
      OPTM_OPERATION: this.operationNo == ''  ? 0 : this.operationNo,
      OPTM_QUANTITY: this.workOrder == '' ? 0 : (this.PartsQty == 0 ? this.MapRuleQty : this.PartsQty),
      OPTM_SOURCE: this.IsWIPCont ? 1:3,
      OPTM_ParentContainerType: '',
      OPTM_ParentPerQty: 0,
      IsWIPCont: this.IsWIPCont,
      OPERATION: this.radioSelected
    }); 

    
    tempArray.HeaderTableBindingData = this.oCreateModel.HeaderTableBindingData;
    tempArray.OtherItemsDTL = this.oCreateModel.OtherItemsDTL;
    tempArray.OtherBtchSerDTL = this.oCreateModel.OtherBtchSerDTL;

    if(this.radioRuleSelected == 2){  
      tempArray.OtherItemsDTL = [];
    } 

    this.showLoader = true;
    this.containerCreationService.GenerateShipContainer(tempArray).subscribe(
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

            if(data[0].RESULT != undefined){
              this.toastr.error('', data[0].RESULT);
              this.containerCode = '';
              //this.scanContCode.nativeElement.focus()
              return;
            }            

            this.containerId = data[0].OPTM_CONTAINERID
            this.containerCode = data[0].OPTM_CONTCODE
            this.scanCurrentItemData = ''
            this.scanItemCode = ''
            this.bsVisible = false;
            this.scanBSrLotNo = ''
            this.itemQty = 0; this.itemBalQty = 0;  
            this.bsItemQty = 0;            
            this.containerStatus = this.getContainerStatus(data[0].OPTM_STATUS);            

            if(data[0].OPTM_STATUS == "3"){

              if(this.IsWIPCont && this.taskId != 0){                
                this.saveReportProgress();                
              }

              if(this.checkParent && this.parentContainerType != ''){
                this.showAddToParent = true;
                this.DisableScanFields = true;
              } else{
                this.showAddToParent = false;
                this.DisableScanFields = true;
                this.containerId = '';
                this.containerCode = '';  
                this.toastr.success('', this.translate.instant("ContainerCreatedClosedSuccessMsg")); 
                return;
              }
              this.toastr.success('', this.translate.instant("ContainerCreatedClosedSuccessMsg"));              
            }else{
              this.showAddToParent = false;
              this.DisableScanFields = false;
              this.toastr.success('', this.translate.instant("ContainerCreatedSuccessMsg"));
            }
            this.SetContainerData();
            if(callCheckCont){
              //this.getCreatedContainer();
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

  showInputDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.inputDialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.titleMessage = msg;

    if(this.inputDialogFor == 'ScanAndCreate'){
      this.showInputDialogFlag = true;
    }else if(this.inputDialogFor == 'InternalCont'){
      this.showInternalDialogFlag = true;
    }else if(this.inputDialogFor == 'AddToParent'){
      this.showParentDialogFlag = true;
    }
  }

  onAddToParentClick(){
    this.oParentModel.HeaderTableBindingData = [];
    this.oParentModel.OtherItemsDTL = [];
    this.oParentModel.OtherBtchSerDTL = [];

    if(this.parentContainerType == "" || this.parentContainerType == undefined){      
      this.toastr.error('', this.translate.instant("CTR_ParentContainerType_Blank_Msg"));
      return;
    }

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      return;
    }

    this.oParentModel.HeaderTableBindingData.push({
      OPTM_CONTCODE:  this.containerCode,
      OPTM_CHILDCONTTYPE: this.containerType,
      ShowLookupFor: "Parent",    
      OPTM_SONO: (this.soNumber == undefined) ? '' :this.soNumber ,
      OPTM_CONTAINERID: 0,
      OPTM_CONTTYPE: this.parentContainerType,
      OPTM_CONTAINERCODE: "",
      OPTM_WEIGHT: 0,
      OPTM_AUTOCLOSE_ONFULL: 'N',
      OPTM_AUTORULEID: this.autoRuleId, //discuss
      OPTM_WHSE: this.whse,
      OPTM_BIN: this.binNo,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: '',
      Length: 0,
      Width: 0,
      Height: 0,
      ItemCode: "",
      NoOfPacks: "1",
      OPTM_TASKID: 0, //change
      CompanyDBId: localStorage.getItem("CompID"),
      Username: localStorage.getItem("UserId"),
      UserId: localStorage.getItem("UserId"),
      GUID: localStorage.getItem("GUID"),
      Action: "Y",
      OPTM_PARENTCODE: '',
      OPTM_GROUP_CODE: this.containerGroupCode,
      OPTM_CREATEMODE: this.radioRuleSelected,
      OPTM_PERPOSE: this.purps,
      OPTM_FUNCTION: "Shipping",
      OPTM_OBJECT: "Container",
      OPTM_WONUMBER: this.workOrder,
      OPTM_TASKHDID: this.taskId,
      OPTM_OPERATION:this.operationNo,
      OPTM_QUANTITY: 0,
      OPTM_SOURCE: this.IsWIPCont ? 1 : 3,    
      OPTM_ParentContainerType: this.parentContainerType,
      OPTM_ParentPerQty: this.ParentPerQty,  
      IsWIPCont: this.IsWIPCont,
      OPTM_WONO: this.workOrder,
      OPTM_OPERNO: this.operationNo
    });

    this.showInputDialog("AddToParent", this.translate.instant("Confirm"), this.translate.instant("Cancel"),
    this.translate.instant("+/-ParentCont"));
  }  

  onScanAndCreateClick(){    

    if(this.checkParent && this.parentContainerType == ''){
      this.toastr.error('',this.translate.instant("ParentContType"));
      this.containerCode = ''; this.containerId = '';        
      return;
    }
    
    if(this.oSubmitModel.OtherItemsDTL.length > 0){
      for(let widx=0; widx<this.oSubmitModel.OtherItemsDTL.length; widx++){
        if(this.oSubmitModel.OtherItemsDTL[widx].OPTM_TRACKING == 'S' || this.oSubmitModel.OtherItemsDTL[widx].OPTM_TRACKING == 'B'){
          this.toastr.error('', this.translate.instant("CannotScanCreateWIP"));
          return;
        }

        if(this.oSubmitModel.OtherItemsDTL[widx].OPTM_QUANTITY == 0){
          this.toastr.error('',this.translate.instant("Scanned_itm_qty_itm")+this.oSubmitModel.OtherItemsDTL[widx].OPTM_ITEMCODE);
          return;
        }
      }      
     }
     //else{
    //   this.toastr.error('',this.translate.instant("SelectItemCode"));
    //   return ;
    // }

    var createMode =1;
    if(this.radioRuleSelected == 1){
      createMode = 1;
    }else{
      if (this.autoRuleId == undefined || this.autoRuleId == "") {
        createMode = 3
      } else {
        createMode = 2
      }
    } 
    
    this.oSaveModel.HeaderTableBindingData = [];
    this.oSaveModel.OtherItemsDTL = [];
    this.oSaveModel.OtherBtchSerDTL = [];

    this.oSaveModel.HeaderTableBindingData.push({
      OPTM_SONO: this.soNumber,
      OPTM_CONTAINERID: 0 ,
      OPTM_CONTTYPE: this.containerType,
      OPTM_CONTAINERCODE: "" + this.containerCode,
      OPTM_WEIGHT: 1,
      OPTM_AUTOCLOSE_ONFULL: ((this.autoRuleId == '') ? 'N' : 'Y'),
      OPTM_AUTORULEID: this.autoRuleId,
      OPTM_WHSE: this.whse,
      OPTM_BIN: this.binNo,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: '',
      Length: length,
      Width: 1,
      Height: 1,
      ItemCode: "",
      NoOfPacks: "1",
      OPTM_TASKID: 0, //changed
      CompanyDBId: localStorage.getItem("CompID"),
      Username: localStorage.getItem("UserId"),
      UserId: localStorage.getItem("UserId"),
      GUID: localStorage.getItem("GUID"),
      Action: "N",
      OPTM_PARENTCODE: '',
      OPTM_GROUP_CODE: this.containerGroupCode,
      OPTM_CREATEMODE: createMode,
      OPTM_PERPOSE: this.purps,
      OPTM_FUNCTION: "Shipping",
      OPTM_OBJECT: "Container",
      OPTM_WONUMBER: this.workOrder,
      OPTM_TASKHDID: this.taskId,
      OPTM_OPERATION: this.operationNo,
      OPTM_QUANTITY: 0,
      OPTM_SOURCE:  this.IsWIPCont ? 1:3,    
      OPTM_ParentContainerType: this.parentContainerType,
      OPTM_ParentPerQty: this.PartsQty == 0 ? this.MapRuleQty : this.PartsQty,  
      IsWIPCont: this.IsWIPCont 
    });

    if(this.oSubmitModel.OtherItemsDTL.length > 0){
      for (var i = 0; i < this.oSubmitModel.OtherItemsDTL.length; i++) {
        this.oSaveModel.OtherItemsDTL.push({
          OPTM_ITEMCODE: this.oSubmitModel.OtherItemsDTL[i].OPTM_ITEMCODE,
          OPTM_QUANTITY: Number(this.oSubmitModel.OtherItemsDTL[i].OPTM_QUANTITY).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
          OPTM_CONTAINER: "",
          OPTM_AVLQUANTITY: 0,
          OPTM_INVQUANTITY: 0,
          OPTM_BIN: '',
          OPTM_CONTAINERID: 0,
          OPTM_TRACKING: this.oSubmitModel.OtherItemsDTL[i].OPTM_TRACKING,
          OPTM_WEIGHT: 1,
          IsWIPItem: this.oSubmitModel.OtherItemsDTL[i].IsWIPItem
        });
      }      
    }  else{
        if(this.oCreateModel.OtherItemsDTL.length > 0){
          this.oSaveModel.OtherItemsDTL = this.oCreateModel.OtherItemsDTL;
        }else{
          //Cannot scan and create in case of Batch/Serial tracked items
          this.toastr.error('', this.translate.instant("CannotScanCreateWIP"));
          return;
        }
      }

    this.showInputDialog("ScanAndCreate", this.translate.instant("Confirm"), this.translate.instant("Cancel"),
    this.translate.instant("ConfirmContainerCode"));
  }

  getInputDialogValue($event) {
    this.showInternalDialogFlag = false;
    this.showInputDialogFlag = false;
    this.showParentDialogFlag = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("ScanAndCreate"): 

        //  this.containerId = ($event.ContainerId == undefined || '' || null ) ? this.containerId : $event.ContainerId;
         // this.containerCode = ($event.ContainerCode == undefined || '' || null ) ? this.containerCode : $event.ContainerCode;;
          // this.parentContainerCode = $event.ParentContainerCode;
          // this.count = $event.Count;
          // this.selectedBatchSerial = [];
          // this.ContStatus = this.setContainerStatus($event.ContnrStatus);
          // this.GetContainerNumber();
         // this.GetInventoryData()
         console.log("Parent Cont Code : ");
         console.log($event.ParentContainerCode);

         console.log("Child Cont Code : ");
         console.log($event.ContainerCode);
          break;

        case ("InternalContainer"): 
        
        this.InternalContainer = true;

         for(let idx=0; idx<$event.BatSerList.length; idx++){
            this.scanBSrLotNo = $event.BatSerList[idx].LOTNO;
            this.bsItemQty = $event.BatSerList[idx].Quantity;            
            this.SetDataInSubmitModel();
            this.scanBSrLotNo = ''; this.bsItemQty = 0;
         }          
          break;

        case ("AddToParentContainer"):
            // this.ParentContainerCode 
        break;
      }
    }
  }

  getContainerStatus(id) {
  //  this.disableFields = false;
    if (id == undefined || id == "") {
      return;
    }
    id = Number("" + id)

    if (id == 1) {
      return this.translate.instant("CStatusNew");
    } else if (id == 2) {     
      return this.translate.instant("Open");
    } else if (id == 3) {
    //  this.disableFields = true;
      return this.translate.instant("CClosedNew");
    } else if (id == 4) {
      return this.translate.instant("CReopenedNew");
    } else if (id == 5) {
    //  this.disableFields = true;
      return this.translate.instant("CAssignedNew");
    } else if (id == 6) {
    //  this.disableFields = true;
      return this.translate.instant("Status_Picked");
    } else if (id == 7) {
    //  this.disableFields = true;
      return this.translate.instant("Loaded");
    } else if (id == 8) {
     // this.disableFields = true;
      return this.translate.instant("CShippedNew");
    } else if (id == 9) {
     // this.disableFields = true;
      return this.translate.instant("Returned");
    } else if (id == 10) {
      //this.disableFields = true;
      return this.translate.instant("CDamagedNew");
    } else if (id == 11) {
      //this.disableFields = true;
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
        //return this.onSONumberChange();
        return this.IsValidSONumberBasedOnRule('blur');
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
