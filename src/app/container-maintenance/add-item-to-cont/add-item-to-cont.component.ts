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
  containerTareWt: number = 0;
  packType: any;
  showLoader: boolean = false;
  showLookup: boolean = false
  serviceData: any = []
  WIPFGBin: string
  lookupfor: any;
  whse: any = "";
  binNo: any = "";
  purposeArray: any = []
  commonData: any = new CommonData(this.translate);
  defaultPurpose: any;
  soNumber: any = "";
  parentContainerType: any;
  //containerLookupType: any;
  scanItemCode: any;
  itemQty: any;
  itemWt: number = 0;
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
  TempContCode: any = '';
  purpose: any = '';
  purposeId: any;
  containerCode: any = "";
  oSubmitModel: any = {};
  DisplayTreeData: any = [];
  radioSelected: any = 1;
  radioRuleSelected: number = 1;
  checkParent: boolean = false;
  taskId: any = 0;
  workOrder: any = "";
  operationNo: any = 0;
  oCreateModel: any = {};
  PartsQty: any = 0;
  AutoRuleDTL: any = [];
  ValidBSQty: any = 0;
  inputDialogFor: any;
  titleMessage: any;
  oDataModel: any = {};
  oParentModel: any = {};
  InternalContainer: boolean = false;
  showInputDialogFlag: boolean = false;
  showInternalDialogFlag: boolean = false;
  showParentDialogFlag: boolean = false;
  AutoService: any = [];
  bsBalQty: any = 0;
  containerGroupCode: any = '';
  SelectedWOItemCode: any = '';
  DisableScanFields: boolean = true;
  purps: any = "Y";
  ParentCTAray: any = [];
  ParentPerQty: any = 0;
  IsWIPCont: boolean = false;
  showAddToParent: boolean = false;
  bsBalanceQty: number = 0;
  itemBalQty: number = 0;
  addItemOpn: any = "Add";
  RuleItems: any = [];
  MapItemQty: any = 0;
  NonSuccess: boolean = false;
  BtchSerialSuccess: boolean = false;
  showHideEnable: boolean = false;
  nextEnabled = true;
  updateDisabled = true;
  CreateContainerTxt: any = ''
  enableCloseCont: boolean = false;
  ContID: any = 0;
  BalQty1: any = 0;
  BalQty2: any = 0;
  RuleQty: any = 0;
  ItemInvQty: any = 0;
  BSInvQty: any = 0;
  tempBal1: any = 0;
  containerCodePlaceholder: string;
  ConSelectionType = 1;
  selInternalContainerDtl: any = [];
  ScannedContainerStatus: number = 0;
  InternalContCode: any = '';

  @ViewChild("scanBinCode", { static: false }) scanBinCode;
  @ViewChild("scanWhse", { static: false }) scanWhse;
  @ViewChild("scanContType", { static: false }) scanContType;
  @ViewChild("scanAutoRuleId", { static: false }) scanAutoRuleId;
  @ViewChild("scanContGroupCode", { static: false }) scanContGroupCode;
  @ViewChild("scanSONumber", { static: false }) scanSONumber;
  @ViewChild("scanParentContCode", { static: false }) scanParentContCode;
  @ViewChild("scanParentContType", { static: false }) scanParentContType;

  @ViewChild("scanContCode", { static: false }) scanContCode;
  @ViewChild("scanItmCode", { static: false }) scanItmCode;
  @ViewChild("scanItemQty", { static: false }) scanItemQty;
  @ViewChild("scanLotNo", { static: false }) scanLotNo;
  @ViewChild("scanBsItemQty", { static: false }) scanBsItemQty;

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

  EnterPressed(){
    this.onContainerCodeChangeBlur();
  }

  showHideDetails() {
    this.showHideEnable = !this.showHideEnable
  }
  onNext() {
    this.nextEnabled = false;
    this.CreateContainerTxt = this.translate.instant("AddItem")
  }
  onBack() {
    this.nextEnabled = true;
    this.CreateContainerTxt = this.translate.instant("CreateContainer")
  }
  treeViewShow = false;
  onOpenTreeview() {
    this.treeViewShow = !this.treeViewShow
  }
  isExpanded: boolean = false;
  expandedKeys: any[] = [];
  public data: any[] = [];

  public handleCollapse(node) {
    // this.keys = this.keys.filter(k => k !== node.index);
  }

  public handleExpand(node) {
    // this.keys = this.keys.concat(node.index);
  }

  // onExpandCollapseAll(event) {
  //   console.log("onExpandCollapseAll: " + event)
  //   this.expandedKeys = [];
  //   this.isExpand = !this.isExpand
  //   if (event == 'expand') {
  //     for (let i = 0; i < this.data.length; i++) {
  //       this.expandedKeys.push("" + i)
  //     }
  //   }
  // }

  onExpandCollapseAll(event) {
    console.log("onExpandCollapseAll: " + event)
    this.expandedKeys = [];
    this.isExpand = !this.isExpand
    if (event == 'expand') {
      for (let i = 0; i < this.DisplayTreeData.length; i++) {
        this.expandedKeys.push(this.DisplayTreeData[i].text)
        for (let j = 0; j < this.DisplayTreeData[i].items.length; j++) {
          if (this.DisplayTreeData[i].items[j].items.length > 0) {
            this.expandedKeys.push(this.DisplayTreeData[i].items[j].text)
          }
        }
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
    this.GetSampleStringOfContainerCode();
    if(localStorage.getItem("loadContainer") != ""){
      this.ConSelectionType = 2;
      this.containerCode = localStorage.getItem("loadContainer");
      this.onContainerCodeChange();
      localStorage.setItem("loadContainer", "");
    }
  }

  onCancelClick() {
    if (this.checkDirtyFlag('Cancel') == true) {
      return;
    }
    this.router.navigate(['home/dashboard']);
  }

  onRadioMouseDown(id) {
    // document.getElementById(id).click();
  }

  checkChangeEvent: any;
  handleCheckChange(event, action) {
    this.treeViewShow = false;
    this.setScanItemDataBlank();
    if (action == 'add') {
      this.radioSelected = 1;
      this.addItemOpn = "Add";

      if (this.containerCode != "" && this.containerCode != undefined && this.containerCode != null) {       
       
          if (!(this.ScannedContainerStatus  == 1 || this.ScannedContainerStatus == 2 || this.ScannedContainerStatus == 4)) {
            this.toastr.error('', this.translate.instant("CannotAddItem"));
            this.DisableScanFields = true;
            this.bsVisible = false;
          }      

      }
         
    } else if (action == 'remove') {
      this.radioSelected = 2;
      this.addItemOpn = "Remove";       

    if (this.containerCode != "" && this.containerCode != undefined && this.containerCode != null) { 
        if (this.ScannedContainerStatus == 3) {
          this.showDialog("ReopenConfirm", this.translate.instant("yes"), this.translate.instant("no"),
            this.translate.instant("ReopenAlert"));
        }      
      }
    }
    else {
      this.radioSelected = 3;
      this.addItemOpn = "View"
      this.treeViewShow = true;       
    }
    //this.checkChangeEvent = event;    
  }

  checkValidDataRadioChange() {
    if (this.oSubmitModel.OtherItemsDTL.length > 0 && this.scanItemCode != '') {
      this.scanBSrLotNo = '';
      this.bsItemQty = 0;
      if (this.radioSelected == 1) {
        if (this.SetItemQuantitiesForAddOpn() == false) {
          return;
        }
      } else if (this.radioSelected == 2) {
        if (this.SetItemQuantitiesForRemoveOpn() == false) {
          return;
        }
      }
    }
  }

  checkDirtyFlag(Action) {
    if (this.oSubmitModel.OtherItemsDTL.length > 0) {
      for (let cFlag = 0; cFlag < this.oSubmitModel.OtherItemsDTL.length; cFlag++) {
        if (this.oSubmitModel.OtherItemsDTL[cFlag].DirtyFlag == true) {
          this.showDialog(Action, this.translate.instant("yes"), this.translate.instant("no"),
            this.translate.instant("DataLostAlert"));
          return true;
        }
      }
    }
    return false;
  }

  handleRuleRadioChange(event) {
    if (this.checkDirtyFlag('DirtyFlag') == true) {
      return;
    }
    this.autoRuleId = ''; this.soNumber = '';
    this.workOrder = ''; this.taskId = 0; this.operationNo = 0;
    this.containerGroupCode = '';
    this.IsWIPCont = false; this.SelectedWOItemCode = '';

    if (this.radioRuleSelected == 1) {
      this.radioRuleSelected = 2;     
    } else {
      this.radioRuleSelected = 1;
    }
    this.checkChangeEvent = event;
  }

  handleContainerRadioChange(event) {
    if (this.ConSelectionType == 1) {
      this.ConSelectionType = 2;
    } else {
      this.ConSelectionType = 1;
    }
    this.checkChangeEvent = event;
  }

  onParentCheckChange(event) {
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

  setDefaultValues() {
    this.containerCode = '';
    this.containerId = '';
    this.scanItemCode = ''; this.itemQty = 0; this.itemBalQty = 0;
    this.scanBSrLotNo = ''; this.bsItemQty = 0; this.bsBalanceQty = 0;
    this.oSubmitModel.OPTM_CONT_HDR = [];
    this.oSubmitModel.OtherItemsDTL = [];
    this.oSubmitModel.OtherBtchSerDTL = [];
    this.DisplayTreeData = [];
    this.workOrder = ''; this.operationNo = 0; this.taskId = 0;
    this.IsWIPCont = false; this.SelectedWOItemCode = '';
    this.BalQty1 = 0; this.BalQty2 = 0;
  }

  setContainerDataBlank() {
    this.containerCode = '';
    this.containerId = '';
    this.scanItemCode = ''; this.itemQty = 0; this.itemBalQty = 0;
    this.scanBSrLotNo = ''; this.bsItemQty = 0; this.bsBalanceQty = 0;
    this.oSubmitModel.OPTM_CONT_HDR = [];
    this.oSubmitModel.OtherItemsDTL = [];
    this.oSubmitModel.OtherBtchSerDTL = [];
    this.DisplayTreeData = []; 
    this.BalQty1 = 0; this.BalQty2 = 0;
  }

  onAutoPackRuleChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    //this.onAutoPackRuleChange()
    this.getAutoPackRule('blur');
  }

  onSONumberChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.IsValidSONumberBasedOnRule('blur');
  }

  IsValidSONumberBasedOnRule(action) {

    if (action == 'blur') {
      if (this.soNumber == undefined || this.soNumber == "") {
        return;
      }
    }

    if (this.whse == "" || this.whse == undefined) {
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }

    let soNum = '';
    if (action == 'blur') {
      soNum = this.soNumber;
    }

    this.containerCreationService.IsValidSONumberBasedOnRule(soNum, this.autoRuleId, this.whse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (action == 'blur') {
            if (data.length == 0) {
              this.soNumber = '';
              this.toastr.error('', this.translate.instant("InvalidSOAutoRule"));
            } else {
              this.soNumber = data[0].DocEntry
            }
          } else {
            if (data.length == 0) {
              this.toastr.error('', this.translate.instant("NoSOFound"));
              return;
            }
            this.serviceData = data;
            for (let sidx = 0; sidx < this.serviceData.length; sidx++) {
              if (this.serviceData[sidx].CardName == null || this.serviceData[sidx].CardName == undefined) {
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

  onWhseChangeBlur() {
    if (this.isValidateCalled) {
      return;
    }
    this.onWhseChange();
  }

  clearlookFields(field) {
    if (field == "whs") {
      this.binNo = '';
    }
    if (field != "CAR") {
      this.autoRuleId = '';
      this.RuleItems = [];
      this.containerType = '';
    }
    this.containerGroupCode = '';
    this.soNumber = '';
    this.parentContainerType = "";
  }

  async onWhseChange() {
    this.clearlookFields("whs");
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

  onBinChangeBlur() {
    if (this.isValidateCalled) {
      return;
    }
    this.onBinChange();
  }

  async onBinChange() {
    this.clearlookFields("bin");
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

  IsValidContainerGroupBlur() {
    if (this.isValidateCalled) {
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

    if (this.containerType == "" || this.containerType == undefined || this.containerType == null) {
      this.toastr.error('', this.translate.instant("EnterContainerType"));
      return;
    }

    if (action == 'blur' && this.parentContainerType == '') {
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

          if (action == 'lookup') {
            this.serviceData = data;
            this.showLookup = true;
            this.lookupfor = "ParentCTList";
          } else {
            this.ParentCTAray = data;

            if (this.ParentCTAray.length > 0) {
              let index = this.ParentCTAray.findIndex(r => r.OPTM_PARENT_CONTTYPE == this.parentContainerType);
              if (index == -1) {
                this.parentContainerType = '';
                this.ParentPerQty = 0;
                this.toastr.error('', this.translate.instant("InvalidParentContType"));
                return;
              }
              else {
                this.ParentPerQty = this.ParentCTAray[index].OPTM_CONT_PERPARENT;
                this.showAddToParent = false;
                if(this.oSubmitModel.OPTM_CONT_HDR.length > 0){
                  if(this.ScannedContainerStatus == 3){
                    this.showAddToParent = true;
                  }
                }
              }
            }
            else {
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

  onContainerTypeChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.onContainerTypeChange();
  }

  onContainerTypeChange() {
    this.clearlookFields("CT");
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

  onWorkOrderBlur() {
    if (this.isValidateCalled) {
      return;
    }
    this.onWorkOrderChange()
  }
  onWorkOrderChange() {

    this.containerCode = '';
    this.oSubmitModel.OPTM_CONT_HDR = [];
    this.oSubmitModel.OtherItemsDTL = [];
    this.oSubmitModel.OtherBtchSerDTL = [];

    for (let cidx = 0; cidx < this.oCreateModel.OtherItemsDTL.length; cidx++) {
      this.oCreateModel.OtherItemsDTL[cidx].IsWIPItem = false;
    }

    if (this.workOrder == '' || this.workOrder == undefined) {
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
    this.containerCreationService.GetWorkOrderList(this.workOrder, this.whse, this.autoRuleId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.WOLIST.length <= 0) {
            this.workOrder = '';
            this.toastr.error('', this.translate.instant("InvalidWONo"));
            result = false
          }
          else {
            if (this.whse != data.WOLIST[0].OPTM_WHSE) {
              this.toastr.error('', this.translate.instant("Diff_WH"));
              this.workOrder = '';
              result = false
            } else {
              this.WIPFGBin = data.WAREHOUSEMASTER[0].OPTM_DEF_WIP_FG_STAGE_BIN;
              if (this.binNo != this.WIPFGBin) {
                let bin = this.translate.instant("SElectWIPFGBinMsg");
                this.toastr.error('', bin + this.WIPFGBin);
                this.workOrder = ''; this.taskId = 0; this.operationNo = 0;
                this.WIPFGBin = "";
                return;
              }

              this.taskId = data.WOLIST[0].OPTM_ID;
              this.operationNo = data.WOLIST[0].OPTM_FROMOPERNO;
              this.SelectedWOItemCode = data.WOLIST[0].OPTM_FGCODE;
              this.IsWIPCont = true;


              result = true;
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
      this.workOrder = ''; this.taskId = 0; this.operationNo = 0;
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
    this.containerCreationService.GetWorkOrderList('', this.whse, this.autoRuleId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data.WOLIST;
          this.lookupfor = "WOLIST";
          this.showLookup = true;
          this.WIPFGBin = data.WAREHOUSEMASTER[0].OPTM_DEF_WIP_FG_STAGE_BIN
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

  closeDialog() {
    this.showLookup = false;
  }

  getLookupDataValue($event) {
    this.showLookup = false;
    if ($event != null && $event == "close") {

      return;
    } else {
      if (this.lookupfor == "CTList") {
        this.clearlookFields("CT");
        this.setDefaultValues();
        this.containerType = $event.OPTM_CONTAINER_TYPE;
      }
      else if (this.lookupfor == "ParentCTList") {
        this.parentContainerType = $event.OPTM_PARENT_CONTTYPE;
        this.ParentPerQty = $event.OPTM_CONT_PERPARENT;
        this.showAddToParent = false;
        if(this.oSubmitModel.OPTM_CONT_HDR.length > 0){
          if(this.ScannedContainerStatus == 3){
            this.showAddToParent = true;
          }
        }
      }
      else if (this.lookupfor == "CARList") {
        this.autoRuleId = $event.OPTM_RULEID;
        this.packType = $event.OPTM_CONTUSE;
        this.bsVisible = false;
        this.clearlookFields("CAR");
        this.setDefaultValues();
        this.AutoRuleDTL = this.AutoService.filter(r => r.OPTM_RULEID == $event.OPTM_RULEID);
        this.RuleItems = this.AutoRuleDTL;
        this.GetInventoryData();
      } else if (this.lookupfor == "WareHouse") {
        this.clearlookFields("whs");
        this.whse = $event.WhsCode;
        // this.setDefaultValues();
      } else if (this.lookupfor == "BinList") {
        this.clearlookFields("bin");
        this.binNo = $event.BinCode;
        //   this.setDefaultValues();
      } else if (this.lookupfor == "SOList") {
        this.soNumber = $event.DocEntry;
      } else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
      } else if (this.lookupfor == "ContainerIdList") {

      }
      else if (this.lookupfor == "ContItems") {

        this.scanItemCode = $event.OPTM_ITEMCODE;
        this.ValidItemQty = 0;
        this.onItemCodeChange();

        //Creating model for Internal
        this.oDataModel.HeaderTableBindingData = [];
        this.oDataModel.HeaderTableBindingData.push({
          OPTM_CREATEMODE: this.radioRuleSelected,
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
      }
      else if (this.lookupfor == "ContItemsList") {
        this.scanItemCode = $event.ITEMCODE;
        this.ValidItemQty = 0;
        this.onItemCodeChange();

        //Creating model for Internal
        this.oDataModel.HeaderTableBindingData = [];
        this.oDataModel.HeaderTableBindingData.push({
          OPTM_CREATEMODE: this.radioRuleSelected,
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
      } else if (this.lookupfor == "ContItemBatchSerialList") {
        this.scanBSrLotNo = $event.LOTNO;
        this.BSInvQty = $event.TOTALQTY;
        this.scanCurrentLotNoData = $event;
        this.onBatchSerialBlur();
        /*
              this.scanBSrLotNo = $event.LOTNO;
              this.BSInvQty = $event.TOTALQTY;
              this.bsItemQty = 0;
              this.scanCurrentLotNoData = $event;
      
              if (this.scanItemTracking == 'S') {
                this.bsBalanceQty = 1;
                if (this.ValidateScanSerialQty() == false) {
                  return;
                } else {
                  this.bsItemQty = 1;
                }
              } else {
                this.ValidBSQty = $event.TOTALQTY;
              }
              if (this.radioSelected == 2) {
                this.checkRemoveBS();
              } else {
                this.setBSQty($event.TOTALQTY);
              }*/
      }
      else if (this.lookupfor == "showContBatchSerialList") {
        this.scanBSrLotNo = $event.OPTM_BTCHSER;
        this.BSInvQty = $event.OPTM_QUANTITY;
        this.scanCurrentLotNoData = $event;
        this.onBatchSerialBlur();
        // if (this.scanItemTracking == 'S') {
        //   this.bsBalanceQty = 1;
        //   if (this.ValidateScanSerialQty() == false) {
        //     return;
        //   } else {
        //     this.bsItemQty = 1;
        //   }
        // } else {
        //   this.ValidBSQty = $event.OPTM_QUANTITY;
        // }
        // if (this.radioSelected == 2) {
        //   this.checkRemoveBS();
        // } else {
        //   this.setBSQty($event.OPTM_QUANTITY);
        // }
      }
      else if (this.lookupfor == "WOLIST") {
        this.containerCode = '';
        this.oSubmitModel.OPTM_CONT_HDR = [];
        this.oSubmitModel.OtherItemsDTL = [];
        this.oSubmitModel.OtherBtchSerDTL = [];
        this.IsWIPCont = false; this.SelectedWOItemCode = '';

        if (this.whse != $event.OPTM_WHSE) {
          this.toastr.error('', this.translate.instant("Diff_WH"));
          this.workOrder = ''; this.taskId = 0; this.operationNo = 0;
          return;
        }

        if (this.binNo != this.WIPFGBin) {
          let bin = this.translate.instant("SElectWIPFGBinMsg");
          this.toastr.error('', bin + this.WIPFGBin);
          this.workOrder = ''; this.taskId = 0; this.operationNo = 0;
          this.WIPFGBin = "";
          return;
        }

        this.workOrder = $event.OPTM_WONO;
        this.taskId = $event.OPTM_ID;
        this.operationNo = $event.OPTM_FROMOPERNO;
        this.SelectedWOItemCode = $event.OPTM_FGCODE;
        this.IsWIPCont = true;

        //Check if any of the Non-Tracked item is same as selected WO Item
        for (let i = 0; i < this.oCreateModel.OtherItemsDTL.length; i++) {
          if (this.oCreateModel.OtherItemsDTL[i].OPTM_ITEMCODE == this.SelectedWOItemCode) {
            this.oCreateModel.OtherItemsDTL[i].IsWIPItem = true;
          }
        }
      }
      else if ("RULEITEMS") {
        console.log($event);
      }
    }
  }

  checkItemCodeAndQty(Item, Qty) {

    //If Rule Qty is already fulfilled on server or in local array data and still trying to add
    if (this.autoRuleId != "" && this.radioSelected == 1) {  // && !this.flagCreate 
      if (this.oSubmitModel.OtherItemsDTL.length > 0) {
        let index = this.oSubmitModel.OtherItemsDTL.findIndex(r => r.OPTM_ITEMCODE == Item && r.OPTM_QUANTITY == Qty);
        if (index > -1) {
          this.toastr.error('', this.translate.instant("ItemReqQty"));
          this.setScanItemDataBlank();
          return false;
        }
      }
    }

  }

  setScanItemDataBlank() {
    this.scanItemCode = ''; this.itemQty = 0; this.itemBalQty = 0;
    this.scanBSrLotNo = ''; this.bsItemQty = 0; this.bsBalanceQty = 0;
    this.BalQty1 = 0; this.BalQty2 = 0;
    this.bsVisible = false;
    this.RuleQty = 0; this.tempBal1 = 0;
  }

  setBatSerDataBlank() {
    this.scanBSrLotNo = ''; this.bsItemQty = 0; this.bsBalanceQty = 0;
    this.BalQty2 = 0;
  }

  containerId: any;

  onItemCodeChangeBlur() {
    if (this.isValidateCalled) {
      return;
    }
    this.onItemCodeChange()
  }

  scanCurrentItemData: any;
  async onItemCodeChange() {
    //this.oDataModel.HeaderTableBindingData = [];
    //this.InternalContainer = false;
    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.setScanItemDataBlank();
      return;
    }

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      this.setScanItemDataBlank();
      return;
    }
    this.showLoader = true;
    var result = false
    this.containerCreationService.IsValidItemCode(this.autoRuleId, this.scanItemCode, this.whse, this.binNo, 1,
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
              this.setScanItemDataBlank();
              this.toastr.error('', this.translate.instant("InvalidItemCode"));
              this.scanItmCode.nativeElement.focus();
              result = false
              return;
            } else {

              if (this.checkItemCodeAndQty(data[0].ITEMCODE, data[0].OPTM_PARTS_PERCONT) == false) {
                return;
              }

              this.scanItemCode = data[0].ITEMCODE;
              this.scanItemTracking = data[0].OPTM_TRACKING;
              
              //Set Item Inventory quantity to quantity from Internal container, if internal container is selected
              // Otherwise set the inventory value to Item Onhand - Containerized quantity
              var idx: number = -1;
              if (this.selInternalContainerDtl != null) {
                idx = this.selInternalContainerDtl.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode);
              }
              if (idx > -1) {
                this.ItemInvQty = this.selInternalContainerDtl[idx].Quantity
              } else {
                this.ItemInvQty = data[0].TOTALQTY;
              }
              
              // Srini Add Item Weight from Item Master
              this.itemWt = 1; // data[0].Item_Weight;

              if (data[0].LOTTRACKINGTYPE != undefined && data[0].LOTTRACKINGTYPE != "N") {
                this.bsVisible = true;
              } else {
                this.bsVisible = false;
              }

              if (this.autoRuleId != "") {
                this.RuleQty = data[0].OPTM_PARTS_PERCONT;
                this.itemQty = data[0].OPTM_PARTS_PERCONT;
                this.ValidItemQty = data[0].OPTM_PARTS_PERCONT;
              } else {
                this.RuleQty = data[0].TOTALQTY;
              }

              this.scanBSrLotNo = '';
              this.bsItemQty = 0;
              if (this.radioSelected == 1) {
                if (this.SetItemQuantitiesForAddOpn() == false) {
                  return;
                }
              } else if (this.radioSelected == 2) {
                if (this.SetItemQuantitiesForRemoveOpn() == false) {
                  return;
                }
              }

            }
            this.scanCurrentItemData = data
            result = true

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

  SetItemQuantitiesForAddOpn() {
    let val = 0;
    if (this.oSubmitModel.OtherItemsDTL.length > 0 && this.autoRuleId != '' && this.autoRuleId != undefined) {
      let iTemRec = this.oSubmitModel.OtherItemsDTL.find(r => r.OPTM_ITEMCODE == this.scanItemCode);
      if (iTemRec != null) {
        val = iTemRec.OPTM_QUANTITY;
      }
    }

    /* Srini 8-May-2020 Start */
    if (this.RuleQty > val) {
      this.BalQty1 = this.RuleQty - val;
      this.itemQty = this.RuleQty - val;
      this.tempBal1 = this.RuleQty - val;
      this.BalQty2 = this.itemQty;
      if (this.scanItemTracking == 'S' && this.BalQty2 >= 1) {
        this.bsItemQty = 1;
      } else {
        this.bsItemQty = this.BalQty2;
      }
      
      return true;
    } else {
      this.BalQty1 = 0;
      this.itemQty = 0;
      this.tempBal1 = 0;
      this.BalQty2 = this.itemQty;
      return false;
    }
    /* Srini 8-May-2020 End */
  }

  SetItemQuantitiesForRemoveOpn() {
    let val = 0;
    if (this.oSubmitModel.OtherItemsDTL.length > 0) {
      let iTemRec = this.oSubmitModel.OtherItemsDTL.find(r => r.OPTM_ITEMCODE == this.scanItemCode);
      if (iTemRec != null) {
        val = iTemRec.OPTM_QUANTITY;
        this.BalQty1 = val;
        this.itemQty = val;
        this.BalQty2 = val;
        this.tempBal1 = val;

        if (this.scanItemTracking == 'S' && this.BalQty2 >= 1) {
          this.bsItemQty = 1;
        } else {
          this.bsItemQty = this.BalQty2;
        }

        return true;
      } else {
        this.toastr.error('', this.translate.instant("CannotRemoveCont"));
        this.setScanItemDataBlank();
        return false;
      }
    }
  }

  // calculateBalanceQty(TotalQty,Operation){
  //   let retQty = -1;
  //   if(this.oSubmitModel.OtherItemsDTL.length > 0){
  //     let val = 0;
  //     if(this.oSubmitModel.OtherBtchSerDTL.length > 0){
  //       let BatSerArr = this.oSubmitModel.OtherBtchSerDTL.filter(r=>r.OPTM_ITEMCODE == this.scanItemCode);
  //       if(BatSerArr.length > 0){
  //         for(let i=0; i<BatSerArr.length; i++){
  //           val = val + BatSerArr[i].OPTM_QUANTITY;
  //         }         
  //       }
  //       //In case of Non-tracked Item
  //       else{
  //         let NonArr = this.oSubmitModel.OtherItemsDTL.filter(r=>r.OPTM_ITEMCODE == this.scanItemCode);
  //         if(NonArr.length > 0){
  //           for(let i=0; i<NonArr.length; i++){
  //             val = val + NonArr[i].OPTM_QUANTITY;
  //           }         
  //         }else{
  //           if(Operation == 2)
  //           return -1;
  //         }
  //       }
  //     }
  //     else{
  //       //In case - if only Non-tracked Item is present
  //       let NonArr = this.oSubmitModel.OtherItemsDTL.filter(r=>r.OPTM_ITEMCODE == this.scanItemCode);
  //       if(NonArr.length > 0){
  //         for(let i=0; i<NonArr.length; i++){
  //           val = val + NonArr[i].OPTM_QUANTITY;
  //         }         
  //       }else{
  //         if(Operation == 2)
  //         return -1;
  //       }
  //     }  

  //     if(Operation == 1){
  //       retQty = TotalQty - val;
  //       return retQty;
  //     }else{
  //       retQty = val;
  //       return retQty;
  //     }      
  //   }else{ 
  //     if(Operation == 1){
  //       retQty = TotalQty;
  //       return retQty;
  //     }else{
  //       return -1;
  //     }     
  //   }
  // }

  openInternalCont() {

    if (this.scanItemCode == undefined || this.scanItemCode == '') {
      this.toastr.error('', this.translate.instant("SelectItemCode"));
      return;
    }

    this.showInputDialog("InternalCont", this.translate.instant("Confirm"), this.translate.instant("Cancel"),
      this.translate.instant("Select_Container"));
  }

  GetScanItem() {

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
            this.serviceData = this.updateAddLookupData(data);

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
  GetBatchSerial() {

    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.toastr.error('', this.translate.instant("BtchSrNBlank"));
      this.scanBSrLotNo = ''
      return;
    }

    if (this.itemQty == 0 || this.itemQty == undefined) {
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      return;
    }

    this.showLoader = true;
    this.containerCreationService.IsValidBtchSer(this.scanItemCode, "", this.whse, this.binNo, 1,
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


  ValidateScanSerialQty() {
    if (this.radioSelected == 1) {
      if (this.oSubmitModel.OtherItemsDTL.length > 0) {
        if (this.oSubmitModel.OtherBtchSerDTL.length > 0) {
          let index = this.oSubmitModel.OtherBtchSerDTL.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode && r.OPTM_BTCHSER == this.scanBSrLotNo);
          if (index > -1) {
            this.toastr.error('', this.translate.instant("SerialItemCannotAdd"));
            this.scanBSrLotNo = '';
            return false;
          }
        }
      }
    } else {
      if (this.oSubmitModel.OtherBtchSerDTL.length > 0) {
        let index = this.oSubmitModel.OtherBtchSerDTL.findIndex(r => r.OPTM_BTCHSER == this.scanBSrLotNo);
        if (index == -1) {
          this.toastr.error('', this.translate.instant("CannotRemoveCont"));
          this.scanBSrLotNo = '';
          this.bsItemQty = 0; this.bsBalanceQty = 0;
          return false;
        }
      } else {
        this.toastr.error('', this.translate.instant("CannotRemoveCont"));
        this.scanBSrLotNo = ''; this.bsItemQty = 0;
        this.bsItemQty = 0; this.bsBalanceQty = 0;
        return false;
      }
    }
    return true;
  }

  ValidateScanBtchSerials(): boolean {
    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.toastr.error('', this.translate.instant("BtchSrNBlank"));
      this.scanBSrLotNo = ''; this.bsItemQty = 0; this.bsBalanceQty = 0;
      return;
    }

    if (this.itemQty == 0 || this.itemQty == undefined) {
      this.scanBSrLotNo = ''; this.bsItemQty = 0; this.bsBalanceQty = 0;
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      return;
    }

    if ((this.scanBSrLotNo == undefined || this.scanBSrLotNo == "")) {
      this.scanBSrLotNo = ''; this.bsItemQty = 0;
      return;
    }

    if (this.radioSelected == 1) {
      // Check if Serial scanned is already added to the container. If Yes, cannot be used again
      // No validation required for Batch in case of addition
      if (this.scanItemTracking == 'S') {
        if (this.oSubmitModel.OtherBtchSerDTL.length > 0) {
          let index = this.oSubmitModel.OtherBtchSerDTL.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode && r.OPTM_BTCHSER == this.scanBSrLotNo);
          if (index > -1) {
            this.toastr.error('', this.translate.instant("SerialItemCannotAdd"));
            this.scanBSrLotNo = '';
            return false;
          }
        }
      }
    } else if (this.radioSelected == 2) {
      // Check if Batch / Serial scanned is available in the container for delete
      if (this.oSubmitModel.OtherBtchSerDTL.length > 0) {
        let index = this.oSubmitModel.OtherBtchSerDTL.findIndex(r => r.OPTM_BTCHSER == this.scanBSrLotNo);
        if (index == -1) {
          this.toastr.error('', this.translate.instant("CannotRemoveCont"));
          this.scanBSrLotNo = '';
          this.bsItemQty = 0;
          return false;
        } else {
          this.bsItemQty = this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY;
        }
      } else {
        this.toastr.error('', this.translate.instant("CannotRemoveCont"));
        this.scanBSrLotNo = '';
        this.bsItemQty = 0;
        return false;
      }
    }

    return true;
  }


  onBatchSerialBlur() {
    if (this.isValidateCalled) {
      return
    }

    if (this.ValidateScanBtchSerials()) {
      if (this.radioSelected == 1) {
        //Check Batch Serials in Internal Container, if Internal container is selected
        var index: number = -1;
        if (this.selInternalContainerDtl != null) {
          index = this.selInternalContainerDtl.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode);
        }
        
        if (index > -1) {  
          this.CheckInInternalContainer()
        } else {
          this.GetScannedBtchSerFromDB();
        }        
      }
    }
  }

 

  // onBatchSerialBlur() {
  //   if (this.isValidateCalled) {
  //     return
  //   }

  //   if (this.ValidateScanBtchSerials()) {
  //     if (this.radioSelected == 1) {
  //       this.GetScannedBtchSerFromDB();
  //     }
  //   }
  // }

  IsValidBtchSerRemove() {
    this.showLoader = true;
    var result = false;
    this.containerCreationService.IsValidBtchSer(this.scanItemCode, this.scanBSrLotNo, this.whse, this.binNo, 2,
      this.containerCode).subscribe(
        data => {
          this.showLoader = false;
          if (data != undefined && data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            this.scanBSrLotNo = data[0].LOTNO;
            this.BSInvQty = data[0].TOTALQTY;
            this.bsItemQty = 0;
            this.scanCurrentLotNoData = data;

            if (this.scanItemTracking == 'S') {
              this.bsBalanceQty = 1;
              if (this.ValidateScanSerialQty() == false) {
                return;
              } else {
                this.bsItemQty = 1;
              }
            } else {
              this.ValidBSQty = data[0].TOTALQTY;
            }
            this.setBSQty(data[0].TOTALQTY);

          } else {
            this.scanBSrLotNo = '';
            this.bsItemQty = 0;
            this.scanCurrentLotNoData = '';
            this.toastr.error('', this.translate.instant("Plt_InValidBatchSerial"));
            this.scanLotNo.nativeElement.focus()
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

  checkRemoveBS() {
    if (this.oSubmitModel.OtherBtchSerDTL.length > 0) {
      let index = this.oSubmitModel.OtherBtchSerDTL.findIndex(r => r.OPTM_BTCHSER == this.scanBSrLotNo && r.OPTM_ITEMCODE == this.scanItemCode);
      if (index == -1) {
        this.toastr.error('', this.translate.instant("CannotRemoveCont"));
        this.scanBSrLotNo = ''; this.bsItemQty = 0;
        this.bsItemQty = 0; this.bsBalanceQty = 0;
        return false;
      } else {
        this.BalQty2 = this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY;
        this.itemQty = this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY;
      }
    }
    else {
      this.toastr.error('', this.translate.instant("CannotRemoveCont"));
      this.scanBSrLotNo = ''; this.bsItemQty = 0;
      this.bsItemQty = 0; this.bsBalanceQty = 0;
    }
  }

  CheckInInternalContainer(): boolean {
    //Check if using internal container for the Item
    
    var itemBtchSerials: any [];
    var index: number = -1;
    if (this.selInternalContainerDtl != null) {
      index = this.selInternalContainerDtl.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode);
    }

    if (index > -1) {      
      itemBtchSerials = this.selInternalContainerDtl[index].BatchSerials;

      let idx = itemBtchSerials.findIndex(r => r.LOTNO == this.scanBSrLotNo);
      if (idx > -1) {
        this.BSInvQty = itemBtchSerials[idx].Quantity; 
        this.bsItemQty = 0;

        if (this.scanItemTracking == 'S') {
          this.bsItemQty = 1;
        } else {
          this.ValidBSQty = this.BSInvQty;
        }

        if (this.BSInvQty > this.BalQty2) {
          this.bsItemQty = this.BalQty2;
        } else {
          this.bsItemQty = this.BSInvQty;
        }
        return true;
      } else {
        if (this.radioSelected == 1) {
          this.scanBSrLotNo = '';
          this.bsItemQty = 0;
          return false;
          this.scanLotNo.nativeElement.focus()
        }
        //this.toastr.error('', this.translate.instant("CannotRemoveCont"));
        this.toastr.error('Add this msg string', 'Selected Batch / Serial not available in internal container');
      }        
      return;
    } 
  }

  scanCurrentLotNoData: any;
  GetScannedBtchSerFromDB() {
      
      this.showLoader = true;
      var result = false;
      this.containerCreationService.IsValidBtchSer(this.scanItemCode, this.scanBSrLotNo, this.whse, this.binNo, 1,
        this.containerCode).subscribe(
          data => {
            this.showLoader = false;
            if (data != undefined && data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                  this.translate.instant("CommonSessionExpireMsg"));
                return;
              }
              this.scanBSrLotNo = data[0].LOTNO;
              this.BSInvQty = data[0].TOTALQTY;           
              this.bsItemQty = 0;
              this.scanCurrentLotNoData = data;

              if (this.scanItemTracking == 'S') {
                this.bsItemQty = 1;
              } else {
                this.ValidBSQty = data[0].TOTALQTY;
              }

              if (data[0].TOTALQTY > this.BalQty2) {
                this.bsItemQty = this.BalQty2;
              } else {
                this.bsItemQty = data[0].TOTALQTY;
              }
              result = true;
            }

            if (data.length == 0) {
              if (this.radioSelected == 2) {
                // this.IsValidBSRemove();
                //this.IsValidBtchSerRemove();               
              }

              if (this.radioSelected == 1) {
                this.scanBSrLotNo = '';
                this.bsItemQty = 0;
                this.scanCurrentLotNoData = '';
                this.toastr.error('', this.translate.instant("Plt_InValidBatchSerial"));
                result = false
                this.scanLotNo.nativeElement.focus()
              }
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

  setItemBalanceQty() {
    let arr = this.oSubmitModel.OtherItemsDTL.filter(r => r.OPTM_ITEMCODE == this.scanItemCode);
    if (arr.length > 0) {

      let sum = 0;
      for (let oidx = 0; oidx < this.oSubmitModel.OtherBtchSerDTL.length; oidx++) {
        if (this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_ITEMCODE == this.scanItemCode && this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_BTCHSER == this.scanBSrLotNo) {
          sum = sum + this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_QUANTITY;
        }
      }
    } else if (this.autoRuleId != '' && this.autoRuleId != undefined) {
      this.itemBalQty = this.RuleQty;
    }
  }

  setBSQty(TotalQty) {
    if (TotalQty > this.BalQty2) {
      this.bsItemQty = this.BalQty2;
    } else {
      this.bsItemQty = TotalQty;
    }
  }

  /*
    setBSBalanceQty(TotalQty) {
      let arr = this.oSubmitModel.OtherItemsDTL.filter(r => r.OPTM_ITEMCODE == this.scanItemCode);
      if (arr.length > 0) {
        let sum = 0;
        for (let oidx = 0; oidx < this.oSubmitModel.OtherBtchSerDTL.length; oidx++) {
          if (this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_ITEMCODE == this.scanItemCode && this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_BTCHSER == this.scanBSrLotNo) {
            sum = sum + this.oSubmitModel.OtherBtchSerDTL[oidx].OPTM_QUANTITY;
          }
        }
        this.bsBalanceQty = TotalQty - sum;
      } else {
        this.bsBalanceQty = TotalQty;
      }
  
      if (this.bsBalanceQty == 0 && this.radioSelected == 1) {
           this.toastr.error('', this.translate.instant("NoBatchSerialQtyToAdd"));
          this.scanBSrLotNo = ''; this.bsItemQty = 0;
                return false;
          }
                  return true;
      }*/
      
  onBatSerQtyChange(scanBsItemQty) {
    if(Number(scanBsItemQty.value) < 0 ){
      this.bsItemQty = 0
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      return false;
    }

    if(scanBsItemQty != undefined){
      this.bsItemQty = scanBsItemQty.value;
      this.bsItemQty = Number(this.bsItemQty);
    }
    if (this.itemQty == undefined || this.itemQty == 0) {
      this.bsItemQty = 0;
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      //this.scanBsItemQty.nativeElement.focus()
      return false;
    }
    if (this.bsItemQty == undefined || this.bsItemQty == 0 || this.bsItemQty < 0) {
      // this.scanBsItemQty.nativeElement.focus();
      this.toastr.error('', this.translate.instant("QtyCannotGreater"));
      this.bsItemQty = 0;
      return false;
    }

    if (this.bsItemQty > this.BalQty2) {
      this.toastr.error('', this.translate.instant("QtyCannotGreater"));
      this.bsItemQty = this.BalQty2;
      return false;
    }
    return true;
  }



  AllowBalQtyNone() {
    //let tempBal1 = this.BalQty1;        
    if (this.itemQty >= 0) {
      let diff = this.tempBal1 - this.itemQty;
      if (diff == 0) {
        this.setScanItemDataBlank();
      } else if (diff > 0) {
        this.itemQty = diff;
        this.tempBal1 = diff;
        this.BalQty1 = diff;
      }
    }
  }



  AllowBalQtyBS() {
    if (this.bsItemQty >= 0) {
      let diff = this.BalQty2 - this.bsItemQty;
      if (diff == 0) {
        let value = this.BalQty1 - this.itemQty;
        if (value == 0) {
          this.setScanItemDataBlank();
        }
        else {
          this.BalQty1 = value; this.itemQty = value;
          this.bsItemQty = 0; this.BalQty2 = value;
          this.scanBSrLotNo = '';
        }
      } else {
        this.BalQty2 = diff;
        this.bsItemQty = 0;
      }
    }
  }

  onConfirmClick() {

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      this.scanItemCode = ''; this.itemQty = 0; this.itemBalQty = 0;
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
      this.scanLotNo = ''; this.bsItemQty = 0;
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      return;
    }

    if (this.itemQty > this.BalQty1) {
      this.toastr.error('', this.translate.instant("ScannedQtyCannotGreater"));
      this.bsItemQty = this.BalQty1;
      return;
    }

    if (this.scanItemTracking != 'N') {
      if (this.scanBSrLotNo == undefined || this.scanBSrLotNo == "") {
        this.toastr.error('', this.translate.instant("BtchSrNBlank"));
        this.bsItemQty = 0; 
        this.scanLotNo = '';
        return;
      } else if (this.bsItemQty == 0) {
        this.toastr.error('', this.translate.instant("QtyCannotGreater"));
      }
    }    
    
    if (this.scanItemTracking == "N") {
      this.SetDataForNoneTrackItem(this.itemQty);
      if (!this.NonSuccess) {
        return;
      }
      this.AllowBalQtyNone();
    } else {
      var processedBtchSrQty: number = this.bsItemQty;
      this.SetDataForBatchSerialItem();
      if (!this.BtchSerialSuccess) {
        return;
      } else {
        // Update Item Infirmation after updating Batch Serial
        this.SetDataForNoneTrackItem(processedBtchSrQty);
        if (!this.NonSuccess) {
          return;
        }

        if (this.radioSelected == 1) {
          //this.AllowBalQtyBS();
          this.SetItemQuantitiesForAddOpn();
          if (this.itemQty == 0) {
            this.setScanItemDataBlank();
            this.scanBSrLotNo = '';
          }
        } else if (this.radioSelected == 2) {
          if (this.itemQty == 0) {
            this.setScanItemDataBlank();
            this.scanBSrLotNo = '';
            this.bsItemQty = 0;
          } else {
            this.SetItemQuantitiesForRemoveOpn();
            if (this.bsItemQty == 0) {
              this.scanBSrLotNo = '';
            }
          }
        }

      }
    }

    this.displayTreeDataValue();
    // this.AllowBalQtyNone();      
    // this.AllowBalQtyBS();
    this.updateDisabled = false;
    
    if(this.oSubmitModel.OtherItemsDTL.length == 0){
      //this.toastr.error('', this.translate.instant("AddItemToUpdate"));
      this.updateDisabled = true;
    } 

  }

  onScanItemQtyChange(scanItemQty) {
    if(Number(scanItemQty.value) < 0 ){
      this.itemQty = 0
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      return false;
    }

    if(scanItemQty != undefined){
      this.itemQty = scanItemQty.value;
    }
    if (this.scanItemCode == '' || this.scanItemCode == undefined) {
      this.setScanItemDataBlank();
      return false;
    }

    if (this.itemQty <= 0 || this.itemQty == '' || this.itemQty == undefined) {
      this.itemQty = 0;
      this.setBatSerDataBlank();
      return false;
    }

    if (this.itemQty > this.ItemInvQty && this.radioSelected == 1) {
      this.toastr.error('', this.translate.instant("ItemInvIsNotPresent"));
      this.itemQty = this.ItemInvQty;
      return;
    }

    if (this.itemQty > this.BalQty1) {
      this.toastr.error('', this.translate.instant("ScannedQtyCannotGreater"));
      this.itemQty = this.BalQty1;
      this.setBatSerDataBlank();
      this.scanItemQty.nativeElement.focus();
      return false;
    }

    this.BalQty2 = this.itemQty;
    return true;
  }

  SetDataForNoneTrackItem(dblItemQuantity: number) {
    var internalContainerID: number = 0;
    let index = this.oSubmitModel.OtherItemsDTL.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode);
    if (index == -1) { //Item not found
      if (this.radioSelected == 1) { // If Add
        //this.itemWt
        var idx: number = -1;
        if (this.selInternalContainerDtl != null) {
          idx = this.selInternalContainerDtl.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode);
        }
        if (idx > -1) {
          internalContainerID = this.selInternalContainerDtl[idx].Container_ID;
          this.InternalContCode = this.selInternalContainerDtl[idx].Container_Code;
        }else{
          this.InternalContCode = '';
        }

       // this.toastr.error('Srini', 'Adding ' + internalContainerID);
        this.oSubmitModel.OtherItemsDTL.push({
          OPTM_ITEMCODE: this.scanItemCode,
          OPTM_TRACKING: this.scanItemTracking,
          OPTM_QUANTITY: dblItemQuantity,
          OPTM_ITEM_QTY: this.RuleQty,
          OPTM_WEIGHT: dblItemQuantity * this.itemWt,
          OPTM_CONTAINERID: internalContainerID,
          DirtyFlag: true,
          Operation: 'Add',
          Delete: false,
          IsWIPItem: false,
          TotalQty: dblItemQuantity,
          ServerQty: 0,
          LocQty: 0
        });
        this.NonSuccess = true;
      } else { //If Remove
        this.toastr.error('', this.translate.instant("Cannotremoveitm"));
        this.NonSuccess = false;
        return;
      }
    } else { // If item found
      if (this.radioSelected == 1) { // If Add
        let totalqty = Number(this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY) + Number(dblItemQuantity);
        if (totalqty - this.oSubmitModel.OtherItemsDTL[index].ServerQty > this.ItemInvQty) {
          this.toastr.error('', "Total quantity added excceds available inventory");
          this.NonSuccess = false;
          return;
        }
        this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = totalqty;
        this.oSubmitModel.OtherItemsDTL[index].TotalQty = totalqty;
        if (this.oSubmitModel.OtherItemsDTL[index].Operation == 'Add') { // New Record exists
          this.oSubmitModel.OtherItemsDTL[index].LocQty = totalqty;
        } else if (this.oSubmitModel.OtherItemsDTL[index].Operation == 'Edit' ||
          this.oSubmitModel.OtherItemsDTL[index].Operation == 'None') {
          this.oSubmitModel.OtherItemsDTL[index].LocQty = this.oSubmitModel.OtherItemsDTL[index].LocQty + dblItemQuantity;
          this.oSubmitModel.OtherItemsDTL[index].Operation = 'Edit';
        }
        this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;
        this.oSubmitModel.OtherItemsDTL[index].Delete = false;
        this.oSubmitModel.OtherItemsDTL[index].OPTM_WEIGHT = totalqty * this.itemWt;
      } else if (this.radioSelected == 2) { //If Remove
        if (this.oSubmitModel.OtherItemsDTL[index].Operation == 'Add') { // New Record exists
          let diff = this.oSubmitModel.OtherItemsDTL[index].TotalQty - dblItemQuantity;
          if (diff < 0) {
            this.toastr.error('', this.translate.instant("Cannotremovegrtless"));
            this.bsItemQty = 0;
            this.NonSuccess = false;
            return;
          } else if (diff == 0) { // New record being added. Delete it as user wants to remove it
            this.oSubmitModel.OtherItemsDTL.splice(index, 1);
            this.NonSuccess = true;
            this.itemQty = 0;
            return;
          } else {
            this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = diff;
            this.oSubmitModel.OtherItemsDTL[index].TotalQty = diff;
            this.oSubmitModel.OtherItemsDTL[index].Operation = 'Add';
            this.oSubmitModel.OtherItemsDTL[index].Delete = false;
            this.oSubmitModel.OtherItemsDTL[index].OPTM_WEIGHT = diff * this.itemWt;
          }
        } else if (this.oSubmitModel.OtherItemsDTL[index].Operation == 'Edit' ||
          this.oSubmitModel.OtherItemsDTL[index].Operation == 'None') {
          if (dblItemQuantity > this.oSubmitModel.OtherItemsDTL[index].TotalQty) {
            this.toastr.error('', this.translate.instant("Cannotremovegrtless"));
            this.bsItemQty = 0;
            this.NonSuccess = false;
          } else {
            let netQty = this.oSubmitModel.OtherItemsDTL[index].TotalQty - dblItemQuantity;
           // this.toastr.error('Srini', 'netQty = ' + netQty + ' dblItemQuantity ' + dblItemQuantity);
            this.oSubmitModel.OtherItemsDTL[index].OPTM_WEIGHT = netQty * this.itemWt;
            this.oSubmitModel.OtherItemsDTL[index].Operation = 'Edit';
            if (netQty <= 0) {
              this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = 0;
              this.oSubmitModel.OtherItemsDTL[index].TotalQty = 0;
              this.oSubmitModel.OtherItemsDTL[index].Delete = true;
              this.itemQty = 0;
            } else { //Current qty > Server qty. Update line
              this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = netQty;
              this.oSubmitModel.OtherItemsDTL[index].TotalQty = netQty;
              this.oSubmitModel.OtherItemsDTL[index].Delete = false;
              if (netQty == this.oSubmitModel.OtherItemsDTL[index].ServerQty) {
                this.oSubmitModel.OtherItemsDTL[index].Operation = 'None';
              }
            }
          }
        }
      }
      this.NonSuccess = true;
    }
  }

  SetDataForBatchSerialItem() {
    this.BtchSerialSuccess = false;
    let index = this.oSubmitModel.OtherBtchSerDTL.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode && r.OPTM_BTCHSER == this.scanBSrLotNo);
    if (index == -1) { // Bacth Serial not found in the current Container list of Batch Serials
      if (this.radioSelected == 1) {
        this.oSubmitModel.OtherBtchSerDTL.push({
          OPTM_ITEMCODE: this.scanItemCode,
          OPTM_BTCHSER: this.scanBSrLotNo,
          OPTM_QUANTITY: this.bsItemQty,
          DirtyFlag: true,
          Operation: 'Add',
          Delete: false,
          TotalQty: this.bsItemQty,
          LocQty: this.bsItemQty,
          ServerQty: 0
        });
        if (this.scanItemTracking == 'S') {
          this.bsItemQty = 0;
          this.scanBSrLotNo = '';
        }
        this.BtchSerialSuccess = true;
      } else { //If Remove
        this.toastr.error('', this.translate.instant("Cannotremovebatser"));
        this.BtchSerialSuccess = false;
        return;
      }
    } else { // If Batch Serial found
      if (this.radioSelected == 1) { // If Add
        let totalqty = this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY + this.bsItemQty;
        if (totalqty - this.oSubmitModel.OtherBtchSerDTL[index].ServerQty > this.BSInvQty) {
          this.toastr.error('', "Total quantity added excceds available inventory");
          this.BtchSerialSuccess = false;
          return;
        } 
        if (this.scanItemTracking == 'B' || (this.scanItemTracking == 'S' && totalqty == 1)) {
          this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY = totalqty;
          this.oSubmitModel.OtherBtchSerDTL[index].TotalQty = totalqty;
          if (this.oSubmitModel.OtherBtchSerDTL[index].Operation == 'Add') { // New Record exists
            this.oSubmitModel.OtherBtchSerDTL[index].LocQty = totalqty;
          } else if (this.oSubmitModel.OtherBtchSerDTL[index].Operation == 'Edit' ||
            this.oSubmitModel.OtherBtchSerDTL[index].Operation == 'None') {
            this.oSubmitModel.OtherBtchSerDTL[index].LocQty = this.oSubmitModel.OtherBtchSerDTL[index].LocQty + this.bsItemQty;
            this.oSubmitModel.OtherBtchSerDTL[index].Operation = 'Edit';
          }
          this.oSubmitModel.OtherBtchSerDTL[index].DirtyFlag = true;
          this.oSubmitModel.OtherBtchSerDTL[index].Delete = false;
        }
        if (this.scanItemTracking == 'S') {
          this.bsItemQty = 0;
          this.scanBSrLotNo = '';
        }
      } else if (this.radioSelected == 2) { //If Remove
        if (this.oSubmitModel.OtherBtchSerDTL[index].Operation == 'Add') { // New Record exists
          let diff = this.oSubmitModel.OtherBtchSerDTL[index].TotalQty - this.bsItemQty;
          if (diff < 0) {
            this.toastr.error('', this.translate.instant("Cannotremovegrtless"));
            this.bsItemQty = 0;
            this.BtchSerialSuccess = false;
            return;
          } else if (diff == 0) { // New record being added. Delete it as user wants to remove it
            this.oSubmitModel.OtherBtchSerDTL.splice(index, 1);
            this.BtchSerialSuccess = true;            
            this.bsItemQty = 0;
            return;
          } else {
            this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY = diff;
            this.oSubmitModel.OtherBtchSerDTL[index].TotalQty = diff;
            this.oSubmitModel.OtherBtchSerDTL[index].Operation = 'Add';
            this.oSubmitModel.OtherBtchSerDTL[index].Delete = false;
          }
        } else if (this.oSubmitModel.OtherBtchSerDTL[index].Operation == 'Edit' ||
          this.oSubmitModel.OtherBtchSerDTL[index].Operation == 'None') {
          if (this.bsItemQty > this.oSubmitModel.OtherBtchSerDTL[index].TotalQty) {
            this.toastr.error('', this.translate.instant("Cannotremovegrtless"));
            this.bsItemQty = 0;
            this.BtchSerialSuccess = false;
          } else {
            let netQty = this.oSubmitModel.OtherBtchSerDTL[index].TotalQty - this.bsItemQty;
            this.oSubmitModel.OtherBtchSerDTL[index].Operation = 'Edit';
            if (netQty <= 0) {
              this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY = 0;
              this.oSubmitModel.OtherBtchSerDTL[index].TotalQty = 0;
              this.oSubmitModel.OtherBtchSerDTL[index].Delete = true;
              this.bsItemQty = 0;
            } else { //Current qty > 0. Update line
              this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY = netQty;
              this.oSubmitModel.OtherBtchSerDTL[index].TotalQty = netQty;
              this.oSubmitModel.OtherBtchSerDTL[index].Delete = false;
              if (netQty == this.oSubmitModel.OtherBtchSerDTL[index].ServerQty) {
                this.oSubmitModel.OtherBtchSerDTL[index].Operation = 'None';
              }
            }
          }
        }
        this.bsItemQty = 0;
        if (this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY > 0) {
          this.bsItemQty = this.oSubmitModel.OtherBtchSerDTL[index].OPTM_QUANTITY;
        }
      }
      this.BtchSerialSuccess = true;
    }
  }

  SetDataInSubmitModel() {
    //If new container is created
    if (this.flagCreate) {
      //On adding 1st item
      if (this.oSubmitModel.OtherItemsDTL.length == 0) {
        if (this.radioSelected == 1) { //In case of Add
          this.oSubmitModel.OtherItemsDTL.push({
            OPTM_ITEMCODE: this.scanItemCode,
            OPTM_TRACKING: this.scanItemTracking,
            OPTM_QUANTITY: Number(this.itemQty),
            OPTM_ITEM_QTY: this.RuleQty,
            DirtyFlag: true,
            Operation: 'Add',
            Delete: false,
            IsWIPItem: (this.IsWIPCont && this.scanItemCode == this.SelectedWOItemCode) ? true : false,
            TotalQty: this.itemQty,
            ServerQty: 0,
            LocQty: this.itemQty
          });

          if (this.scanItemTracking != 'N') {
            this.oSubmitModel.OtherBtchSerDTL.push({
              OPTM_ITEMCODE: this.scanItemCode,
              OPTM_BTCHSER: this.scanBSrLotNo,
              OPTM_QUANTITY: Number(this.bsItemQty),
              DirtyFlag: true,
              Operation: 'Add',
              Delete: false,
              TotalQty: this.bsItemQty,
              ServerQty: 0,
              LocQty: this.bsItemQty
            });
          }

        } else { //In case if remove and no item is present
          this.toastr.error('', this.translate.instant("CannotRemoveCont"));
          return;
        }
      }
      //If item is already present
      else {
        this.SetDataForUpdate('Add');
      }
    }
    else {
      this.SetDataForUpdate('Edit');
    }
    this.displayTreeDataValue();
  }

  SetDataForUpdate(action) {
    let index = this.oSubmitModel.OtherItemsDTL.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode);
    if (index == -1) { //Item not found
      if (this.radioSelected == 1) {  //If Add
        this.oSubmitModel.OtherItemsDTL.push({
          OPTM_ITEMCODE: this.scanItemCode,
          OPTM_TRACKING: this.scanItemTracking,
          OPTM_QUANTITY: this.itemQty,
          OPTM_ITEM_QTY: this.RuleQty,
          DirtyFlag: true,
          Operation: 'Add',
          Delete: false,
          IsWIPItem: (this.IsWIPCont && this.scanItemCode == this.SelectedWOItemCode) ? true : false,
          TotalQty: this.itemQty,
          ServerQty: 0,
          LocQty: this.itemQty
        });

        if (this.scanItemTracking != 'N') {
          this.oSubmitModel.OtherBtchSerDTL.push({
            OPTM_ITEMCODE: this.scanItemCode,
            OPTM_BTCHSER: this.scanBSrLotNo,
            OPTM_QUANTITY: this.bsItemQty,
            DirtyFlag: true,
            Operation: 'Add',
            Delete: false,
            TotalQty: this.bsItemQty,
            LocQty: this.bsItemQty,
            ServerQty: 0
          });
        }
      }
      else {
        this.toastr.error('', this.translate.instant("Cannotremoveitm"));
        return;
      }
    }
    //If item found
    else {

      if (this.radioSelected == 1) { //Case of Add
        if (this.oSubmitModel.OtherItemsDTL[index].Operation != "Add") { //Case of already existing item
          this.oSubmitModel.OtherItemsDTL[index].Operation = action;
        }
        this.oSubmitModel.OtherItemsDTL[index].Delete = false;
      }
      else { //case of remove
        if (this.oSubmitModel.OtherItemsDTL[index].Operation == "Add") { //case of new item
          this.oSubmitModel.OtherItemsDTL[index].Delete = false;
        } else {
          this.oSubmitModel.OtherItemsDTL[index].Delete = true; //Case of existing item present in server
        }
      }

      this.oSubmitModel.OtherItemsDTL[index].OPTM_QUANTITY = this.itemQty;
      this.oSubmitModel.OtherItemsDTL[index].DirtyFlag = true;

      if (this.scanItemTracking != 'N') {
        let indexBS = this.oSubmitModel.OtherBtchSerDTL.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode && r.OPTM_BTCHSER == this.scanBSrLotNo);
        if (indexBS == -1) {
          if (this.radioSelected == 1) {
            this.oSubmitModel.OtherBtchSerDTL.push({
              OPTM_ITEMCODE: this.scanItemCode,
              OPTM_BTCHSER: this.scanBSrLotNo,
              OPTM_QUANTITY: this.bsItemQty,
              DirtyFlag: true,
              Operation: 'Add',
              Delete: false,
              TotalQty: this.bsItemQty,
              LocQty: this.bsItemQty,
              ServerQty: 0
            });
          }
          else {
            this.toastr.error('', this.translate.instant("Cannotremovebatser"));
            this.scanBSrLotNo = ''; this.bsItemQty = 0;
            return;
          }
        }
        else {
          if (this.radioSelected == 1) {
            if (action == 'Add') {
              let sum = this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY + this.bsItemQty;
              this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY = sum;
              this.oSubmitModel.OtherBtchSerDTL[indexBS].TotalQty = this.oSubmitModel.OtherBtchSerDTL[indexBS].TotalQty + this.bsItemQty;
              this.oSubmitModel.OtherBtchSerDTL[indexBS].LocQty = sum;
            } else {
              //If trying to add qty into server data and action is Edit but operation is None
              this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY = this.bsItemQty;
              this.oSubmitModel.OtherBtchSerDTL[indexBS].Operation = "Edit";
              this.oSubmitModel.OtherItemsDTL[index].Operation = "Edit";
            }
            this.oSubmitModel.OtherBtchSerDTL[indexBS].Delete = false;
          }
          else {
            if (action == 'Add') {
              let diff = this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY - this.bsItemQty;
              if (diff < 0) {
                this.toastr.error('', this.translate.instant("Cannotremovegrtless"));
                this.bsItemQty = 0;
                return;
              } else if (diff == 0) {
                let Carray = [];
                this.oSubmitModel.OtherBtchSerDTL.splice(indexBS, 1);
                Carray = this.oSubmitModel.OtherBtchSerDTL.filter(r => r.OPTM_ITEMCODE == this.scanItemCode);
                if (Carray.length == 0) {
                  this.oSubmitModel.OtherItemsDTL = this.oSubmitModel.OtherItemsDTL.filter(r => r.OPTM_ITEMCODE != this.scanItemCode);
                }
                return;
              } else {
                this.oSubmitModel.OtherBtchSerDTL[indexBS].OPTM_QUANTITY = diff;

                this.oSubmitModel.OtherBtchSerDTL[indexBS].Delete = false;
                this.oSubmitModel.OtherBtchSerDTL[indexBS].Operation = "Add";
              }
            }
            else {
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
    this.clearlookFields("CAR");
    let RuleId = '';
    if (this.containerType == undefined || this.containerType == "") {
      this.autoRuleId = ''; this.containerCode = ''; this.RuleItems = [];
      this.setDefaultValues();
      this.toastr.error('', this.translate.instant("SelectContainerMsg"));
      return;
    }

    if (action == 'blur') {
      this.containerCode = ''; this.RuleItems = [];
      this.setDefaultValues();
      if (this.autoRuleId == undefined || this.autoRuleId == "") {
        return;
      }
      RuleId = this.autoRuleId;
    } else {
      RuleId = '';
    }

    this.showLoader = true;
    this.commonservice.GetDataForContainerAutoRule(this.containerType, RuleId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (action == 'lookup') {

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

          } else {
            if (data.OPTM_CONT_AUTORULEHDR.length > 0) {
              this.autoRuleId = data.OPTM_CONT_AUTORULEHDR[0].OPTM_RULEID;
              this.AutoRuleDTL = data.OPTM_CONT_AUTORULEDTL;
              this.RuleItems = this.AutoRuleDTL;
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

          this.alreadySavedData = data;
          this.oSubmitModel.OtherItemsDTL = [];
          this.oSubmitModel.OtherBtchSerDTL = [];

          if (data.ItemDeiail != null && data.ItemDeiail != undefined) {
            if (data.ItemDeiail.length > 0) {
              for (var i = 0; i < data.ItemDeiail.length; i++) {
                this.oSubmitModel.OtherItemsDTL.push({
                  OPTM_ITEMCODE: data.ItemDeiail[i].OPTM_ITEMCODE,
                  OPTM_TRACKING: data.ItemDeiail[i].OPTM_TRACKING,
                  OPTM_QUANTITY: data.ItemDeiail[i].OPTM_QUANTITY,
                  OPTM_ITEM_QTY: this.RuleQty,
                  DirtyFlag: false,
                  Operation: 'None',
                  Delete: false,
                  IsWIPItem: (this.IsWIPCont && data.ItemDeiail[i].OPTM_ITEMCODE == this.SelectedWOItemCode) ? true : false,
                  TotalQty: data.ItemDeiail[i].OPTM_QUANTITY,
                  ServerQty: data.ItemDeiail[i].OPTM_QUANTITY,
                  LocQty: 0
                });
              }
            }
            // else {
            //    this.flagCreate = true;
            //   }
            //  } else {
            //     this.flagCreate = true;
          }

          if (data.BtchSerDeiail != null && data.BtchSerDeiail != undefined) {
            for (var j = 0; j < data.BtchSerDeiail.length; j++) {
              this.oSubmitModel.OtherBtchSerDTL.push({
                OPTM_ITEMCODE: data.BtchSerDeiail[j].OPTM_ITEMCODE,
                OPTM_BTCHSER: data.BtchSerDeiail[j].OPTM_BTCHSER,
               // OPTM_QUANTITY: Number(data.BtchSerDeiail[j].OPTM_QUANTITY).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
                OPTM_QUANTITY: Number(data.BtchSerDeiail[j].OPTM_QUANTITY),
                DirtyFlag: false,
                Operation: 'None',
                Delete: false,
                TotalQty: data.BtchSerDeiail[j].OPTM_QUANTITY,
                ServerQty: data.BtchSerDeiail[j].OPTM_QUANTITY,
                LocQty: 0,
                OPTM_WHSE: data.BtchSerDeiail[j].OPTM_WHSE,
                OPTM_BIN: data.BtchSerDeiail[j].OPTM_BIN
              });
            }
          }

          //if (!this.showAddToParent && this.oSubmitModel.OtherItemsDTL.length > 0) {
          if (this.ScannedContainerStatus != 3 && this.oSubmitModel.OtherItemsDTL.length > 0) {
            this.enableCloseCont = true;
          } else {
            this.enableCloseCont = false;
          }  
          this.displayTreeDataValue();
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

  displayTreeDataValue() {
    this.DisplayTreeData = [];
    let DisplayChildData: any = [];

    if(this.oSubmitModel.OtherItemsDTL.length > 0){
      for (let treeidx = 0; treeidx < this.oSubmitModel.OtherItemsDTL.length; treeidx++) {

        let childArr = [];
        let val = 0;
  
        for (let q = 0; q < this.oSubmitModel.OtherBtchSerDTL.length; q++) {
  
          if (this.oSubmitModel.OtherBtchSerDTL[q].OPTM_ITEMCODE == this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_ITEMCODE) {
            childArr.push({
              text: this.oSubmitModel.OtherBtchSerDTL[q].OPTM_BTCHSER,
              quantity: Number(this.oSubmitModel.OtherBtchSerDTL[q].OPTM_QUANTITY)
            });
            val = Number(val) + Number(this.oSubmitModel.OtherBtchSerDTL[q].OPTM_QUANTITY);
          }
        }
  
        DisplayChildData.push({
          text: this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_ITEMCODE,
          // quantity: (this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_TRACKING) == "N" ? this.oSubmitModel.OtherItemsDTL[treeidx].TotalQty : this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_QUANTITY,
          quantity: this.oSubmitModel.OtherItemsDTL[treeidx].OPTM_QUANTITY,//val,
          items: childArr
        });
      }
  
      this.DisplayTreeData.push({
        text: this.containerCode,
        quantity: this.oSubmitModel.OtherItemsDTL.length,
        items: DisplayChildData
      });
    }else{
      this.DisplayTreeData.push({
        text: this.containerCode,
        quantity: this.oSubmitModel.OtherItemsDTL.length,
        items: []
      });
    } 
  }

  SetContainerData() {
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

  onCloseContClick() {
    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      return;
    }
    this.showLoader = true;
    this.commonservice.CloseClick(this.containerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length > 0) {
            if (data[0].RESULT == "Data Saved") {
              this.toastr.success('', this.translate.instant("ContainerClosedMsg"));
              this.radioSelected = 3;
              this.treeViewShow = true;
              this.enableCloseCont = false;
              this.DisableScanFields = true;
              this.ScannedContainerStatus = 3;
              if (this.checkParent && this.parentContainerType != '')
                this.showAddToParent = true;
              else
                this.showAddToParent = false;
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

  CheckDataLoss() {
    this.showDialog("ContainerCodeChange", this.translate.instant("yes"), this.translate.instant("no"),
      this.translate.instant("DataLostAlert"));
  }

  validateSelectionCriteria() {
    if (this.whse == undefined || this.whse == "") {
      this.containerCode = '';
      this.containerId = ''; this.enableCloseCont = false;
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return false;
    }

    if (this.binNo == undefined || this.binNo == "") {
      this.containerCode = '';
      this.containerId = ''; this.enableCloseCont = false;
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return false;
    }
    if (this.containerType == undefined || this.containerType == "") {
      this.containerCode = '';
      this.containerId = ''; this.enableCloseCont = false;
      this.toastr.error('', this.translate.instant("ContTypeValidMsg"));
      return false;
    }

    if (this.radioRuleSelected == 1) {
      if (this.autoRuleId == "" || this.autoRuleId == undefined) {
        this.containerCode = '';
        this.containerId = ''; this.enableCloseCont = false;
        this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
        return false;
      }
    }

    if (this.checkParent && this.parentContainerType == '') {
      this.toastr.error('', this.translate.instant("ParentContType"));
      this.containerCode = ''; this.containerId = '';
      this.enableCloseCont = false;
      return false;
    }
  }

  onContainerCodeChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.onContainerCodeChange()
  }

  contChangeSetValues(){
    this.itemBalanceQty = 0;
    this.DisplayTreeData = [];
    this.oSubmitModel.OtherItemsDTL = [];
    this.oSubmitModel.OtherBtchSerDTL = [];
    this.oSubmitModel.OPTM_CONT_HDR = [];
    this.InternalContainer = false;
    this.DisableScanFields = true;
    this.oParentModel.HeaderTableBindingData = [];
    this.setScanItemDataBlank();
    let CONT_SELECT_TYPE = undefined;

    if (this.ConSelectionType == 1) {
      if (this.validateSelectionCriteria() == false) {
        return "";
      }else{
        return CONT_SELECT_TYPE;
      }
    } else {
      CONT_SELECT_TYPE = "Fetch"
    }
    return CONT_SELECT_TYPE;
  }

  async onContainerCodeChange() {

    if (this.containerCode == undefined || this.containerCode == "") {
      this.setContainerDataBlank();
      this.enableCloseCont = false;
      return;
    }

    if (!this.updateDisabled) {
      this.showDialog("confirmCommit", this.translate.instant("yes"), this.translate.instant("no"),
        this.translate.instant("Data_Not_Commit"));
      return;
    }

    let CONT_SELECT_TYPE = this.contChangeSetValues();
    if(CONT_SELECT_TYPE == ""){
      return;
    }    
    return this.CheckContainer(CONT_SELECT_TYPE);
  }

  public CheckContainer(CONT_SELECT_TYPE): boolean {
    var createMode = 1;
    if (this.radioRuleSelected == 1) {
      createMode = 1;
    } else {
      if (this.autoRuleId == undefined || this.autoRuleId == "") {
        createMode = 3
      } else {
        createMode = 2
      }
    }

    this.showLoader = true;
    var result = false;
    this.ScannedContainerStatus = 0;
      
    this.containerCreationService.CheckContainer(this.containerCode, this.whse, this.binNo, this.autoRuleId, this.containerGroupCode,
      this.soNumber, this.containerType, this.purps, this.radioSelected, createMode, CONT_SELECT_TYPE).subscribe(
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

              if (data.OPTM_CONT_HDR == undefined) {
                this.showAddToParent = false;
                this.setContainerDataBlank();
                this.DisableScanFields = true;
              }
              else {   
                
                this.ScannedContainerStatus  = Number(data.OPTM_CONT_HDR[0].OPTM_STATUS);

                if (data.OPTM_CONT_HDR[0].OPTM_STATUS == 3) { //If Container is closed
                  if (this.checkParent && this.parentContainerType != '') {
                    this.showAddToParent = true;
                    this.SetContainerData();
                    this.radioSelected = 3;
                    this.treeViewShow = true;
                    this.enableCloseCont = false;
                  }
                  else {
                    this.showAddToParent = false;
                    this.enableCloseCont = false;
                    this.containerCode = '';
                  }
                  this.DisableScanFields = true;
                } else {
                  this.showAddToParent = false;
                  this.containerCode = ''; this.DisableScanFields = true;
                }

                result = false;
              }
            }
            else if (data.OPTM_CONT_HDR.length == 0) {
              if (this.ConSelectionType == 2) {
                this.toastr.error('', this.translate.instant("CreateConMsg"));
                return;
              } else {
                this.generateContainer();
                this.flagCreate = true;
                this.DisableScanFields = false;
              }
            }
            else if (data.OPTM_CONT_HDR.length > 0) {

              this.ScannedContainerStatus  = Number(data.OPTM_CONT_HDR[0].OPTM_STATUS);

             //Container is already created and fetching data              

              this.containerId = data.OPTM_CONT_HDR[0].OPTM_CONTAINERID;
              this.containerCode = data.OPTM_CONT_HDR[0].OPTM_CONTCODE;
              this.containerStatus = this.getContainerStatus(data.OPTM_CONT_HDR[0].OPTM_STATUS);

              if (data.OPTM_CONT_HDR[0].OPTM_STATUS == 3) {
                if (this.checkParent && this.parentContainerType != '') {
                  this.showAddToParent = true;
                  this.radioSelected = 3;
                  this.treeViewShow = true;
                  this.enableCloseCont = false;
                }
                else {
                  this.showAddToParent = false;
                  this.enableCloseCont = false;
                }
                this.DisableScanFields = true;
              } else {
                this.showAddToParent = false;
                this.DisableScanFields = false;
              }

              if (this.radioSelected == 2) {
                if (data.OPTM_CONT_HDR[0].OPTM_STATUS == 3) {
                  this.showDialog("ReopenConfirm", this.translate.instant("yes"), this.translate.instant("no"),
                    this.translate.instant("ReopenAlert"));
                }
              }
              this.SetContainerData();
              result = true;

              if (this.ConSelectionType == 2) {
                this.setOtherReqFields(data.OPTM_CONT_HDR[0]);
              }
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

  setOtherReqFields(OPTM_CONT_HDR) {
    this.whse = OPTM_CONT_HDR.OPTM_WHSE;
    this.binNo = OPTM_CONT_HDR.OPTM_BIN;
    this.containerType = OPTM_CONT_HDR.OPTM_CONTTYPE;
    this.autoRuleId = OPTM_CONT_HDR.OPTM_AUTORULEID;
    this.getAutoPackRule('blur');
    this.soNumber = OPTM_CONT_HDR.OPTM_SO_NUMBER;
    this.containerGroupCode = OPTM_CONT_HDR.OPTM_GROUP_CODE;
    this.containerCode = OPTM_CONT_HDR.OPTM_CONTCODE;
    this.containerId = OPTM_CONT_HDR.OPTM_CONTAINERID;
    this.workOrder = OPTM_CONT_HDR.OPTM_WO_NUMBER;
    this.taskId = OPTM_CONT_HDR.OPTM_TASKHDID;
    this.operationNo = OPTM_CONT_HDR.OPTM_OPER_NUMBER;
    if(OPTM_CONT_HDR.OPTM_CREATE_MODE == 1){
      this.radioRuleSelected = 1;
    }else{
      this.radioRuleSelected = 2;
    }
  }

  getCreatedContainer() {

    this.flagCreate = false;

    var createMode = 1;
    if (this.radioRuleSelected == 1) {
      createMode = 1;
    } else {
      if (this.autoRuleId == undefined || this.autoRuleId == "") {
        createMode = 3
      } else {
        createMode = 2
      }
    }

    this.showLoader = true;
    this.containerCreationService.CheckContainer(this.containerCode, this.whse, this.binNo, this.autoRuleId, this.containerGroupCode,
      this.soNumber, this.containerType, this.purps, this.radioSelected, createMode, undefined).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            // if (data.length > 0) {

            this.containerId = data.OPTM_CONT_HDR[0].OPTM_CONTAINERID;
            this.containerCode = data.OPTM_CONT_HDR[0].OPTM_CONTCODE;
            this.containerStatus = this.getContainerStatus(data.OPTM_CONT_HDR[0].OPTM_STATUS);
            this.SetContainerData();

            if (data.OPTM_CONT_HDR[0].OPTM_STATUS == 3) {
              if (this.checkParent && this.parentContainerType != '') {
                this.showAddToParent = true;
              }
              else {
                this.showAddToParent = false;
                this.enableCloseCont = false;
                this.setContainerDataBlank();
                this.displayTreeDataValue();
              }
              this.toastr.success('', this.translate.instant("ContIsClosed"));
              this.DisableScanFields = true;
            } else {
              this.showAddToParent = false;
              this.DisableScanFields = false;
            }
            //this.DisplayTreeData();                        
            //}                    
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

  ReOpenCont() {

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
              this.DisableScanFields = false;
              this.showAddToParent = false;
              this.ScannedContainerStatus = 4;
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
    var totalAutoItemWeight: number = 0;

    if (this.oSubmitModel.OtherItemsDTL.length == 0) {
      this.toastr.error('', this.translate.instant("AddItemToUpdate"));
      return;
    } else {
      for (let intCtr = 0; intCtr < this.oSubmitModel.OtherItemsDTL.length; intCtr++) {
        if (this.oSubmitModel.OtherItemsDTL[intCtr].Delete == false) {
          totalAutoItemWeight = totalAutoItemWeight + this.oSubmitModel.OtherItemsDTL[intCtr].OPTM_WEIGHT;
        }
       // this.toastr.success('Srini', 'Cont ID ' + this.oSubmitModel.OtherItemsDTL[intCtr].OPTM_CONTAINERID);
      }
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

    /*
        if (this.oSubmitModel.OtherBtchSerDTL.length > 0) {
          for (let isub = 0; isub < this.oSubmitModel.OtherItemsDTL.length; isub++) {
            if (this.oSubmitModel.OtherItemsDTL[isub].OPTM_TRACKING != 'N') {
              let item = this.oSubmitModel.OtherItemsDTL[isub].OPTM_ITEMCODE;
              let Arr = this.oSubmitModel.OtherBtchSerDTL.filter(val => val.OPTM_ITEMCODE == item);
              let sum = 0;
              for (let jsub = 0; jsub < Arr.length; jsub++) {
                sum = sum + Arr[jsub].OPTM_QUANTITY;
              }
              this.oSubmitModel.OtherItemsDTL[isub].OPTM_QUANTITY = sum;
            }
          }
    
         
    
        }
    
        if (this.oSubmitModel.OtherItemsDTL.length > 0) {
          for (let iCsub = 0; iCsub < this.oSubmitModel.OtherItemsDTL.length; iCsub++) {
            if (this.oSubmitModel.OtherItemsDTL[iCsub].OPTM_TRACKING == 'N') {
              this.oSubmitModel.OtherBtchSerDTL.push({
                OPTM_ITEMCODE: "",
                OPTM_BTCHSER: "",
                OPTM_QUANTITY: 0,
                DirtyFlag: false,
                Operation: 'Add',
                Delete: false,
                IsWIPItem: this.workOrder != '' ? true : false
              })
            }
    
            if (this.oSubmitModel.OtherItemsDTL[iCsub].OPTM_ITEMCODE == this.SelectedWOItemCode) {
              this.oSubmitModel.OtherItemsDTL[iCsub].IsWIPItem = true;
            }
    
          }
        }
    
      */
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

          if (data[0].RESULT != null && data[0].RESULT != undefined && data[0].RESULT != '') {
            this.toastr.error('', data[0].RESULT);
            return;
          }
          else {
            this.updateDisabled = true;
            this.toastr.success('', this.translate.instant("ItemUpdatedSuccessMsg"));
            this.getCreatedContainer();

            this.scanItemCode = "";
            this.itemQty = 0; this.itemBalQty = 0; this.BalQty1 = 0; this.BalQty2 = 0

            this.scanBSrLotNo = ''
            this.bsItemQty = 0;

            this.bsVisible = false;
          }
        } else {
          // this.toastr.error('', "");
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

  openRuleItems() {
    if (this.RuleItems.length > 0) {
      for (var i = 0; i < this.RuleItems.length; i++) {
        this.RuleItems[i].OPTM_PARTS_PERCONT_VAL = Number(this.RuleItems[i].OPTM_PARTS_PERCONT).toFixed(Number(localStorage.getItem("DecimalPrecision")));
      }
      this.serviceData = this.RuleItems;
      this.lookupfor = "RULEITEMS";
      this.showLookup = true;
    } else {
      this.toastr.error('', this.translate.instant("NoRuleItem"));
      return;
    }
  }

  GetInventoryData() {
    this.oCreateModel.OtherItemsDTL = [];
    
    if (this.radioRuleSelected == 1) {
      // Fetch inventory data only when Auto Rule is checked as Items are not added in Manual container
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

              if (data.IteWiseInventory.length > 0) {

                let NoneTrackArr = data.IteWiseInventory.filter(val => val.OPTM_TRACKING == 'N');

                if (NoneTrackArr.length > 0) {
                  var index: number;
                  var internalContainerID: number = 0;

                  for (let idxOth = 0; idxOth < NoneTrackArr.length; idxOth++) {

                    let tempArr = this.AutoRuleDTL.filter(val => val.OPTM_ITEMCODE == NoneTrackArr[idxOth].ITEMCODE);
                    this.PartsQty = tempArr[0].OPTM_PARTS_PERCONT;
                    
                    index = this.selInternalContainerDtl.findIndex(r => r.OPTM_ITEMCODE == NoneTrackArr[idxOth].ITEMCODE);
                    if (index > -1) {
                      internalContainerID = this.selInternalContainerDtl[index].Container_ID;
                      this.InternalContCode = this.selInternalContainerDtl[index].Container_Code;
                    }else{
                      this.InternalContCode = '';
                    }

                    this.oCreateModel.OtherItemsDTL.push({
                      OPTM_ITEMCODE: NoneTrackArr[idxOth].ITEMCODE,
                      OPTM_QUANTITY: Number(this.PartsQty).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
                      OPTM_CONTAINER: "",
                      OPTM_AVLQUANTITY: Number(NoneTrackArr[idxOth].AvlQty).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
                      OPTM_INVQUANTITY: 0,
                      OPTM_BIN: '',
                      OPTM_CONTAINERID: internalContainerID,
                      OPTM_TRACKING: NoneTrackArr[idxOth].OPTM_TRACKING,
                      OPTM_WEIGHT: 1,
                      IsWIPItem: (this.IsWIPCont && this.scanItemCode == this.SelectedWOItemCode) ? true : false,
                      DirtyFlag: true,
                      Operation: 'Add',
                      Delete: false,
                      TotalQty: Number(this.PartsQty).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
                      ServerQty: 0,
                      LocQty: Number(this.PartsQty).toFixed(Number(localStorage.getItem("DecimalPrecision")))
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
  }

  saveReportProgress() {
    let ProdQty = 0;
    if (this.oCreateModel.OtherItemsDTL.length > 0) {
      let index = this.oCreateModel.OtherItemsDTL.findIndex(r => r.IsWIPItem == true);
      if (index > -1) {
        ProdQty = this.oCreateModel.OtherItemsDTL[index].OPTM_QUANTITY;
      } else {
        this.toastr.error('', this.translate.instant("NoRuleItemRP"));
        return;
      }
    } else {
      this.toastr.error('', this.translate.instant("NoRuleItemRP"));
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

          if (data == "True") {
            this.toastr.success('', this.translate.instant('ReportProgressSuccess'));
          } else {
            this.toastr.error('', this.translate.instant('ReportProgressError'));
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

    this.oCreateModel.HeaderTableBindingData = [];
    //Items may exist for auto rule based containers  
    this.oCreateModel.OtherBtchSerDTL = [];
    var createMode = 1;
    var totalAutoItemWeight: number = 0;

    if (this.radioRuleSelected == 2) {
      this.oCreateModel.OtherItemsDTL = [];
    } else {
      for (let intCtr = 0; intCtr < this.oCreateModel.OtherItemsDTL.length; intCtr++) {
        totalAutoItemWeight = totalAutoItemWeight + this.oCreateModel.OtherItemsDTL[intCtr].OPTM_WEIGHT;
      }
    }

    if (this.radioRuleSelected == 1) {
      createMode = 1;
    } else {
      if (this.autoRuleId == undefined || this.autoRuleId == "") {
        createMode = 3
      } else {
        createMode = 2
      }
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
      OPTM_OPERATION: this.operationNo == '' ? 0 : this.operationNo,
      OPTM_QUANTITY: this.workOrder == '' ? 0 : (this.PartsQty == 0 ? this.RuleQty : this.PartsQty),
      OPTM_SOURCE: this.IsWIPCont ? 1 : 3,
      OPTM_ParentContainerType: '',
      OPTM_ParentPerQty: 0,
      IsWIPCont: this.IsWIPCont,
      OPERATION: this.radioSelected
    });

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
              this.setContainerDataBlank();
              return;
            }

            if (data[0].RESULT != undefined) {
              this.toastr.error('', data[0].RESULT);
              this.setContainerDataBlank();
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
            this.ScannedContainerStatus  = Number(data[0].OPTM_STATUS);

            if (data[0].OPTM_STATUS == "3") {
              if (this.IsWIPCont && this.taskId != 0) {
                this.saveReportProgress();
              }

              if (this.checkParent && this.parentContainerType != '') {
                this.showAddToParent = true;
                this.DisableScanFields = true;
              } else {
                this.showAddToParent = false;
                this.DisableScanFields = true;
                this.setContainerDataBlank();
                this.toastr.success('', this.translate.instant("ContainerCreatedClosedSuccessMsg"));
                return;
              }
              this.toastr.success('', this.translate.instant("ContainerCreatedClosedSuccessMsg"));
            } else {
              this.showAddToParent = false;
              this.DisableScanFields = false;
              this.toastr.success('', this.translate.instant("ContainerCreatedSuccessMsg"));
            }
            this.SetContainerData();

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

  showInputDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.inputDialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.titleMessage = msg;

    if (this.inputDialogFor == 'ScanAndCreate') {
      this.showInputDialogFlag = true;
    } else if (this.inputDialogFor == 'InternalCont') {
      this.showInternalDialogFlag = true;
    } else if (this.inputDialogFor == 'AddToParent') {
      this.showParentDialogFlag = true;
    }
  }

  onAddToParentClick() {
    this.oParentModel.HeaderTableBindingData = [];
    this.oParentModel.OtherItemsDTL = [];
    this.oParentModel.OtherBtchSerDTL = [];

    if (this.parentContainerType == "" || this.parentContainerType == undefined) {
      this.toastr.error('', this.translate.instant("CTR_ParentContainerType_Blank_Msg"));
      return;
    }

    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      return;
    }

    this.oParentModel.HeaderTableBindingData.push({
      OPTM_CONTCODE: this.containerCode,
      OPTM_CHILDCONTTYPE: this.containerType,
      ShowLookupFor: "Parent",
      OPTM_SONO: (this.soNumber == undefined) ? '' : this.soNumber,
      OPTM_CONTAINERID: 0,
      OPTM_CONTTYPE: this.parentContainerType,
      OPTM_CONTAINERCODE: "",
      OPTM_WEIGHT: 0,
      OPTM_AUTOCLOSE_ONFULL: 'N',
      OPTM_AUTORULEID: '', //discuss
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
      OPTM_CREATEMODE: 3, //Manual
      OPTM_PERPOSE: this.purps,
      OPTM_FUNCTION: "Shipping",
      OPTM_OBJECT: "Container",
      OPTM_WONUMBER: '', //this.workOrder
      OPTM_TASKHDID: 0, //this.taskId
      OPTM_OPERATION: 0, //this.operationNo
      OPTM_QUANTITY: 0,
      OPTM_SOURCE: 3,     //this.IsWIPCont ? 1 : 3
      OPTM_ParentContainerType: this.parentContainerType,
      OPTM_ParentPerQty: this.ParentPerQty,
      IsWIPCont: this.IsWIPCont,
      OPTM_WONO: '', //this.workOrder
      OPTM_OPERNO: 0 //this.operationNo 
    });

    this.showInputDialog("AddToParent", this.translate.instant("Confirm"), this.translate.instant("Cancel"),
      this.translate.instant("+/-ParentCont"));
  }

  getInputDialogValue($event) {
    this.showInternalDialogFlag = false;
    this.showInputDialogFlag = false;
    this.showParentDialogFlag = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("ScanAndCreate"):
          break;

        case ("InternalContainer"):
          this.InternalContainer = true;
          var index: number = -1;
          this.InternalContCode = $event.IntContainerCode;
          if (this.selInternalContainerDtl != null) {
            index = this.selInternalContainerDtl.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode);
          }
          
          if (index = -1) {
            this.selInternalContainerDtl.push({
              Container_ID: $event.ContId,
              Container_Code: $event.IntContainerCode,
              OPTM_ITEMCODE: this.scanItemCode,
              BatchSerials: $event.BatSerList
            })
          } else {
            this.selInternalContainerDtl[index].Container_ID = $event.ContId;
            this.selInternalContainerDtl[index].Container_Code = $event.IntContainerCode;
          }
          
          this.ItemInvQty = $event.IntContItemQuantity;


         // this.toastr.success('Srini', 'Cont ID ' +  $event.ContId);
          /*
          for (let idx = 0; idx < $event.BatSerList.length; idx++) {
            this.scanBSrLotNo = $event.BatSerList[idx].LOTNO;
            this.bsItemQty = $event.BatSerList[idx].Quantity;
            this.ContID = $event.ContId;
            this.SetDataInSubmitModel();

            let index = this.oSubmitModel.OtherItemsDTL.findIndex(r => r.OPTM_ITEMCODE == this.scanItemCode);
            if (index > -1) {
              this.oSubmitModel.OtherItemsDTL[index].OPTM_CONTAINERID = this.ContID;
            }
            this.toastr.success('', this.translate.instant(""));
            this.scanItemCode = ''; this.scanItemQty = 0; this.BalQty1 = 0;
            this.scanBSrLotNo = ''; this.bsItemQty = 0; this.BalQty2 = 0;
          }

          */
          break;

        case ("AddToParentContainer"):
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
  @ViewChild(GridComponent, { static: false }) grid: GridComponent;
  isExpand: boolean = false;
  isValidateCalled: boolean = false;
  lastFocussedField: any;
  showConfirmDialog: boolean = false;
  displayPDF: any = false;
  showPrintDialog: any = false;
  fileName: any = ""
  base64String: any = "";
  numberOfCopies: any = "";
  noOfContainers: any = "";

  showDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.dialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.showConfirmDialog = true;
    this.dialogMsg = msg;
  }

  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("ReopenConfirm"):
          this.ReOpenCont();
          break;
        case ("confirmCommit"):
          this.updateDisabled = true;
          let CONT_SELECT_TYPE = this.contChangeSetValues();
          if(CONT_SELECT_TYPE == ""){
            return;
          }    
          this.CheckContainer(CONT_SELECT_TYPE);
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
        case ("Cancel"): {
          this.router.navigate(['home/dashboard']);
          break;
        }
      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
          case ("ReopenConfirm"):
            //this.containerStatus = '';
            //this.setDefaultValues();
            this.DisableScanFields = true;
            break;
          case ("confirmCommit"):
            //this.containerCode = "";
            this.containerCode = this.DisplayTreeData[0].text;
            this.updateDisabled = false;
            break;
          case ("DirtyFlag"):
            if (this.radioRuleSelected == 1) {
              this.radioRuleSelected = 1;
            } else {
              this.radioRuleSelected = 2;
            }
            break;
          case ("Cancel"):
            break;
        }
      }
    }
  }

  public showOnlyBeveragesDetails(dataItem: any, index: number): boolean {
    return dataItem.OPTM_TRACKING === "B" || dataItem.OPTM_TRACKING === "S" || dataItem.OPTM_TRACKING === "L";
  }

  onExpandCollapse() {
    this.isExpand = !this.isExpand;
    for (var i = 0; i < this.oSaveModel.OtherItemsDTL.length; i++) {
      if (this.isExpand) {
        this.grid.expandRow(i)
      } else {
        this.grid.collapseRow(i);
      }
    }
  }

  async validateBeforeSubmit(): Promise<any> {
    this.isValidateCalled = true;
    var currentFocus = document.activeElement.id;
    console.log("validateBeforeSubmit current focus: " + currentFocus);

    if (currentFocus != undefined) {
      this.lastFocussedField = currentFocus;
      if (currentFocus == "scanWhse") {
        
        return this.onWhseChange();
      } else if (currentFocus == "scanBinCode") {
        
        return this.onBinChange();
      } else if (currentFocus == "scanContType") {
        
        return this.onContainerTypeChange();
      } else if (currentFocus == "scanAutoRuleId") {
        
        //return this.onAutoPackRuleChange();
      } else if (currentFocus == "scanContGroupCode") {
        
        return this.IsValidContainerGroup();
      } else if (currentFocus == "scanSONumber") {
        
        //return this.onSONumberChange();
        return this.IsValidSONumberBasedOnRule('blur');
      }
      else if (currentFocus == "scanContCode") {
        return this.onContainerCodeChange()
      } else if (currentFocus == "scanItmCode") {
        return this.onItemCodeChange();
      } else if (currentFocus == "scanItemQty") {
        return this.onScanItemQtyChange(undefined);
      } else if (currentFocus == "scanLotNo") {
        return this.GetScannedBtchSerFromDB();
      } else if (currentFocus == "scanBsItemQty") {
        return this.onBatSerQtyChange(undefined);
      }

    }
  }

  onPrintLabelClick() {
    this.showPrintDialog = true;
    // this.base64String = "data:application/pdf;base64,JVBERi0xLjcgCiXi48/TIAoxIDAgb2JqIAo8PCAKL1R5cGUgL0NhdGFsb2cgCi9QYWdlcyAyIDAgUiAKL1BhZ2VNb2RlIC9Vc2VOb25lIAovVmlld2VyUHJlZmVyZW5jZXMgPDwgCi9GaXRXaW5kb3cgdHJ1ZSAKL1BhZ2VMYXlvdXQgL1NpbmdsZVBhZ2UgCi9Ob25GdWxsU2NyZWVuUGFnZU1vZGUgL1VzZU5vbmUgCj4+IAo+PiAKZW5kb2JqIAo1IDAgb2JqIAo8PCAKL0xlbmd0aCAyNTkgCi9GaWx0ZXIgWyAvRmxhdGVEZWNvZGUgXSAKPj4gCnN0cmVhbQp4nG2QT0vEMBDF7/MpJum/xN2kTdom6VUQwZtS8GD3sLoqCBXc739wmnZbwaUEXmZ+M++lBiv6DB0bAr6N8Vrh+RNm8XQfhTUO1USc3+EZvuG2B7NMUsN4bVvsRyg7NJUm+QECGU9Sif0XLVA+aE/lE5RH9LreiCTN8gtUt3HN6e+aF5HJOoi84IMY5M2OywP2D9A6bcmdWDF7qFhRJsTaXumyqIyxOeNrhqVX56wZROuK1g8yrN3QXEuY8CL6st1+ydkEtFvQ1ymoX5/D5yzEqM5FN5akacJi+a6HH+imILbCrpvGSF75o5Gp570jCL6OP/6jnNuoLKesOMgL/Qt5GVwfZW5kc3RyZWFtIAplbmRvYmogCjEzIDAgb2JqIAo8PCAKL0xlbmd0aCAzODEgCi9GaWx0ZXIgWyAvRmxhdGVEZWNvZGUgXSAKPj4gCnN0cmVhbQp4nGXS22qDQBAG4Ps8xVymtOBhNBoIQpLe5KIHGvoAG3cMQlxlNRd5+/rvpIHSQIT9nFH334n2h9eDayeKPn1fH2WipnXWy9hffS10knPrKEnJtvV0X4Vr3ZmBorn5eBsn6Q6u6WmzWURf881x8jdabvHbPW99ay4vu/5inyj68FZ86860/N4f5/XxOgwX6cRNFFNVkZVmEe3fzPBuOqHo3yNCQXL/gt7KOJhavHFnoU0aV7ThsiJx9u+9RZpry6nRtdaGSxxn62qGBJAEKDJACkgDrHIAA1jBAjJAFoANIAfkAfICsAKstCUBFIBC35ICSkCpFSVgDVgrNAADMNoSvuMEOCkwoAbUupdQYQFWK8JDBSAKMaABNPoWbJ9DdppHEQBRsOaRooURBWseGQJiRMGaR4a9MKJgzWOFD2NEwZpHir0womDNIw8ViII1j0wA5f0M0TLDfJS/Z4ZTxcw9pqO+ej8PThjMMDMYjtbJY3aHfsAs4L/4ATK6wPdlbmRzdHJlYW0gCmVuZG9iaiAKMTYgMCBvYmogCjw8IAovTGVuZ3RoIDEyMDkyIAovTGVuZ3RoMSAxNzE4OCAKL0ZpbHRlciBbIC9GbGF0ZURlY29kZSBdIAo+PiAKc3RyZWFtCnicrXsJfFTV1fi99+2z71sS5s1MMpNkspFMEgKRvIQkAhEIqxkkZViC4AIJi6hViCsaXMAFcWmJtgIVlckEMGGpcalLWwtWa9FPa1qxuOUvbSlaJTP/c98MKN9nv+/3/f7/93Luucs5dzn33HPPeQMII4T0qBsxqHXG7NLyeRVXJBDCw1A7fcnVizqR7tQVkH8foGjJNWvl1EvPXIwQWYuQEFvWefnVB0PmnQhJbyPET7z8quuWXbevYhxCgQUIeV9b3rFo6eWFNx2D/nYDf9VyqLBsED8C/jIo5y6/eu21q6/VrIB2EcrLr1q1ZNGq+PLxUO6k9FcvurZTtPKXAf0cKMsrF13d8dHjVdkI+YuAprRz1Zq1qUL0R4RMNtreubqjk5lR9SyUIwiZ/wl1GNZFHx1ikQyYhRdWfGpcKgWpnEoZ/0zLMHtApAbdRZ5CXnYNqhdy0AbIvy7cjQQoT2Fy0Cb2I3QfwCyAu6GujJuHHgSsg/Jm4L0f8gbAiHsVPQCwDcpzSU1qFOimQnk7paHrQtdjDTGRzxgXO55r4PbxEf5pQRZflnI1Js09mmFtr7ZX59D9Wr9c/4DhZePLxhPqSmCSf13WfUPZRwuNtf8U3aK6sCc+qs2h+M2ffDT6zTdnR01IXA20UnpV9GHeJocRh0TuEa4CuslKY+ZNtIxYRI5oBZbQh0X/6ZkzbZKM5FPyqXHcW8mZuEKYiBPpeQgTk9PRJBP65ptvrjeh70bKPB61xkN+j2rRAyBYgkyoFM0DvhbyIsyEcAdRtgq7UDYbRLCfqRPnILkidYK2UUw+g85z0pB5Euhp9Eecj2XUj79BTvQ1duOxaArs6lew03vRKHoQ2dActA1bUC5yoLloCmaBJozuwo+mrkl9ii5C96EnUs/hm1NPQfu96BX0NczgTyxG1Wg60M9FHehT5mMUTT2CRLQJadEENAs70CL0DrxUp+6HVf0S35D6Gka1oZuhv1pUj+pTL6TOokJ0F7uFOy7tR1vRIcynlqRWoDHIj3pIOPVO6kMURFH0M/Q0zCmMh9jJyIeuRLeh7djNvAK5B9HPURLrSDsziXseRpoCUluJ1qMe9BT6NbbgVu44dyr149RJkKoV5cOcVqBPcSWeRp5kdamJqffQZWgQvQbrpe8Qexm7i7ssWZf6SepFZEfPYQ0+jF/gyrl7Rm9KPZ56Fk5FEI0FiUyHcRajW9AL6HX0N/R3sjG1EU1Gs2HkX+EcLOMgSPwd4iYbyAbmLVQCq22H2a5DO1AcduQgOoSOgGz+Aw2jj7ENZ+GpeDHeiv9OdGQpOco8yuxj3mYx+wuQdwDlgYzWoifRAfRb9AY6ijnovwy34ivwKvwQ/gkeJnHyBfmKFdlb2G/ZUS6YHE5+m5qe+idygWZdgq5HG0G2P0P9aB/6HfoD+jv6BzqDTXgcXo4fx3E8jL8gEvGTGaSTbCNPkmeY6cxW5gW2km1gr2TfYN/jbuc2C4uE5NmdyfuTzyTfTD2XehN0xwD9B1EzSPQm0Ion0fPoLej9XfQB+gvVH+h/Ap6PfwSjrMF34AfwM/hX+E38GawSqa+fTCCNMOoqshrkdDO5nzwAox+F9xh5j3xAPif/ZDjGz1QxXczjTJwZYI4xf2VNbJAtYceyM9j5bAp2ppy7mJvN7eb2cC9yp/hafinfyX8i3CzcKv52tHD0T0mUXJ6MJ/tBd0XQpOtBEj9FT4De74M9+DVI9Hcw42F0GnbBg304BPOuwc24BU/Dl+IFuAPfjDfh+/B2/Ch+Aj8LK4A1EAHmHib1ZDZZRDrIrWQTuZvsg/cgeZ28Q46TEZi5kwkwYWYsM4WZz1zGrIQ1rGU2MLeCZLcyTzFHmbeYk8wnzAjsmpMdw65jr2cfZnex+9g3uUu4q+F9gnueG+Le5M5yZ3nCe/hsvpS/gt/N/0XghSqhVbhTeFv4h9iJs3EhzFz+vjkhbjiDY8hTxMZuxCNQkYNZZISVh2EfZsOp+AeqY5KwLwbaDnOzEzdrVW26wsbpXYUPoUr8K7SRJwxYJnYYJfD7ZJh9iVyE/oBj2M3uYlZyvyY+tAes0RZymBzCDWgfqSXzyGMMwh/D7fUx6Pu16AF8JV6D9uARPB7fiKvxRvQ2cTCz8a2oNvUEYbGEp+BTCGaAbmKXoh/9Z4t64YNr4Fb9NPlTVs/eAPZpAG2DHX0afYh/gb7BXOoLsG4MWKNFYGXuAn2/DVGr1w7nbCOcRzdYkKv4o2gf5sGuVvMT2evRKfQv9Cl3EDSqASzpyeQK9qfsR6nqVDGcMDhlaDecu+XoYjgxH4OWHIEyLS2Ak64BW1IOp7oVzUdL0Y1g9bam4qnHUrekrkutQr8B3m9wEf4G98KJGACOWvQavPeid/FmOIcX//fr/HdPcikaQp9hF87D5XAeRrhruC3cU9w+7pfcG/xYkPat6FHQ6L+ANmtgBUvQm+gz9BUWYW/cqAhFYL7jYO5t6CoSZY6gSdiDOuHM5oMdb8isZA30cjNI7zE4z0fgbJwCO7EA/RIdxwQ7YUVLYHwR+mkBOS8E6p2wg7fgfqhZCla7EH0O6zbgceDtFCEFetoGVmsI5vQ++itIO6XOqwjsQiOeB319hS5FS2GEKtSK+2AHDqAasKyNzG9B3rnYhBqwH/8c+GJwQg0oB9VwH2GCipLTU+PICuYI3DEpqO+F2ysLXYS7YBZGWMcosuMZqDI5C+bwFmbYOP69OouHSUdqE7M+eRX6DfoF7InCXiM0sqvZ29hvlYa5c5S6iRfVThhfM666MlJRPrastKS4KFxYkB8K5uUG/D7ZOyYnO8vjdjkddpvVYjYZDXqdViOJAs+xDMGoqCnQHJPjwVicDQYmTy6m5cAiqFj0vYpYXIaq5gtp4nJMJZMvpFSActl/olTSlMp5SmySa1FtcZHcFJDjbzQG5AE8f2Yb5O9uDETl+Iian6bmt6h5PeR9PmCQm1zLG+U4jslN8eZrlvc0xRqhuz6tZlJgUoemuAj1abSQ1UIu7gx09mHnRKxmiLNpfB9Boh4mFfcEGpvi7kAjnUGcyWtatDTeOrOtqTHL54sWF8XxpCWBxXEUaIgbwyoJmqQOE+cnxQV1GHkFXQ3aLPcVDfXcNWBCi2Nh3dLA0kUL2uLMoigdwxyGcRvjzutPuL4rQueWSW2bvt+axfQ0uVbItNjTs0mOD81s+36rj6bRKPQBvCSvOdbTDEPfBUJsmS3DaOS2aFsc3wZDynQldFXp9XUEmmhN7Ao5LgUaAst7rojB1nh64mjWdb6Ex6MMpoaRp0numdMW8MXrsgLRRY3ZfTbUM+u6frciuy9sKS7qM5nTgu0zGDMZnf77mY7zbWpOJae5llnnJYvpjAJTQCHi8hIZZtIWgDWNo0nHONSzZByQwRPFwBVfCjuyIi5NivWYxtN6yh/n8kwBueefCDQgMPLFhTWLMjV8numfiGapnpxXNWg/l4+Hw/HCQqoiwiTYU5jjRLVcWVx0zQCpCnSaZEAgPtQKsl0UHV8K4vf56AZvHlDQYijEu2e2pcsyWpyVQEppOBonMdoydK7FPpe2dJ9rOc8eC4Am71O9Z3tcDJ7/M5oc1qbl4+PY8d80d6TbW2YHWmbOb5ObemIZ2bbMuaCUbh93vi2Ti1sntTFZJJMjWYzaCkq54DwxLbTp4mwe/PGqUi+NM6CUagWWm+Om2OR0GtX4fP+WZ0AQv8c0kDpFuVT0HVtmlvHx4QvLEy4oXzA7XQ8D82WDpGXO/J4ezQVtzWCAenqaA3JzT6xn0UCqe3FANgV6Bskusqunsyl2bkMHUgc3Z8Wb74rCIpbj8aCsBDX0BfAdM/sUfMfs+W2DEO7Id8xpSxBMJsUaon250NY2CP6KotYSWksraUGmBdSCQc8TRFTpswYVhLrVVlatUMtLBjBS68RzdRgtGSDpOlN6oKA6kAKe5pIBNt2inKNmoU5M13WnqfMz1CK0mGjLQQQ2HamN6YcajUlz2r6vDuoZixaDeqVjZpQK0dj6vz71OjSH2UtfUgn3mJd5lnkGfAIv80w/n+PtrtczT6O9ABD4QSoD9AIwSGGe7hf05coAYItNxQlHuHwwNQSZ8RVqffED5d2HmT1wHVdA9Z7EXFq9p19pLFdxxYQ0Lh2r4oSYbhZs5d56D7CVAhBkzORmANwLsAPgeQAeJrQHfQiQAmCY3cwTiWYv9PAkdGSstzFPguQVSI8CpAAYmP2TsJYn0ZeZGhZm9bN+SUeH/5nKlcX8DLiMkJoAugH2AhwF4NAqSHcApAAYyIGrDkCYJ5jHEyavqV7D/BRtBCDMI8iIMfJC79v7TapsHu43WsuVehPzIGoFICjOTENDAAS63QpsWxEB8pZE8VhVhC39GkO5Ceg3w6Q3w0Q2w5C9kGK1rABQ+s39Vgft/paE0azy/ThRFkln+k2u8laQwrUIMx3MSgjWvODkrwRXyMssAUy3ejGzFOnVeSr9RlN5N4xXB+R14PMWQHM94wBP0ss0Mh7wYijZuoQhPc66RH5hOax4EuNSSYyMHpw4LyMyQqLcKx9iFFX4d/RLWjq/OxIme/kR5jZGgCDby3QDldNrPMJoYGc16krm9Ev68i31OmYOLHMOiMULc8Qg5ZVqRysT0FG9mWlisiHw9DJXMjkQBHuZZmaMincxj0O452V+0h/M9g4dYu5Xue6jncLwE9OqNbFfbygfqpeYidAaZ+6BDbhHHXxLf3AcuMxBJh+VARCQ8UbIbVSVvgdyPbBrPbBTPbBTPTCpHtA+xNwJLXcCTSlzPepk1qMtADsgT9XKngCBDqqZ3PzyQcbNuEAwpkMgSgy1nn7JQGfmSlisKpmrX2corzvCrAE9XwN9KszafqerfNUhplBdSlG/K4sydCZAXY9ACKduDTA66JYcYbJBEFQwOcyYhN0br/dCmSqyF2Hya3KMCom8Rf5At5tGsSr+TQa/kcG/S+PUEDmWPhTk9xQP12eTj6GzheQDtANyhBwiL6EyYHiPDNBZkHfJIKoDfBzKSwEPAq4AfDDhe807QAb6AcHcH03oHXSx5KVEuDST8eZlMs6sTMbiKK/PIy+SF1A2dPFHwLmAXyBDyA/4ecAuwEPgx78GeD9YrQmA92Xwy+QwVXHyHDkAEYWX9CcMdArxhEDR3gRP0bMJlC61lnoPk2fJHuQB0mcSQQ/U7u4P5nqNh6A/DDH/2kSO11KvIY/jNnwaiHoh3gCMLOSJRDXtZEvisOwdJFvIFsVVreQpxcpOpiyvrLhsJyPnycVytbxTrjeRe8CA7CBwfslmSKuRTEB7ABSALeTOBFsdrx+FNdF1EdQNaa+ai0Haqebod1rT+dZTaq6O3IZmABDoYwPARoBugJvgGtlCrgf4McANADeqNWsB1gGsB2vSCRydwNEJHJ0qRydwdAJHJ3B0qhyd6ujrAChHDDhiwBEDjpjKEQOOGHDEgCOmctD5xoAjpnK0AkcrcLQCR6vK0QocrcDRChytKkcrcLQCR6vKoQCHAhwKcCgqhwIcCnAowKGoHApwKMChqBxlwFEGHGXAUaZylAFHGXCUAUeZylEGHGXAUaZyyMAhA4cMHLLKIQOHDBwycMgqhwwcMnDIKocJOEzAYQIOk8phAg4TcJiAw6RymNT9WQdAOYaBYxg4hoFjWOUYBo5h4BgGjmGVYxg4hoFjmKzvY47V/wpYjgHLMWA5prIcA5ZjwHIMWI6pLMeA5RiwHMssfa0qDAJqswFgI0A3AOUdAt4h4B0C3iGVd0hVr3UAlDcOHHHgiANHXOWIA0ccOOLAEVc54sARB464ytELHL3A0QscvSpHL3D0AkcvcPSqHL2q4q4DoBz/e6X8X28NuQm3iXDXkm5coOKN6AsVb0DHVXwj6lPxDWinin+Mblbx9ahaxetRUMXQn4rXIq+IE95qY70DTMAMgIUAqwB2AFAn6XkAQc0dBfgQIEUqFT9rFGYIO4S9wvMCt1cYFoiRn8Hv4Pfyz/PcXn6YJ3J9FtGrdhRMC7pXTTdC+iUAXCKQ1qm5OhKBcSNgZyvhjZCIYh6RvyzERwvx84V4byG+txDXS+RizKqWTkbV4A56cZuiC070HgeoDoYmgmW658AXTm8iWOUdwIfTqEAJA/4CoA9gJ8DNANUA5QDFAHkAXrWuEOjbFH+my8MAIQAfgEyHQA4HOI8Ws6gMEj3e2f8rPZLoOKF84DuUCJUBGkiEZgB6LhFa7K2X8AEUol4R3g87twfw3oT3BDQ/k0ZPJ7yHAO1OeCOA2hOhEkCXJUJveOv1eC7yspR1TgbPhnVTPCvhnQdkMxPeAkDhRChIqQthoDxoLcBt6ATgvAxXbnqkQMI7AZA/4a2h1CIK0Y3HPCpWp8cBUMz0w4S+HMRtLFa03hHv/d4vgP1zECyox7vyAAvoaN4AnqdovIeLfwrE9d5EvYbSw/3Ql8Fxivd7d+bd6X0U+sJ5B7wPe0u89xQPiFB9N8z7TnWIhPdmCEf3KFZvt7fMu7b4hHeNd6p3kXeWtz0P6hPeBd7DdJooitvIngPeVuhwCqwiL+G9OG9AnWKz9zqv4g15a+TDVL5oXLrf6uLDVAKoPD16Eci3MG+A6vjc6gFsVgqFU8IW4TKhQZggBAS/MEbIEWyiRTSJBlEnakRR5EVWJCISbQOpYSVMfyOy8epPRTxLU1bNmwhNCVJ/QiJYJGgqiluZFtIyuwG3xIeWoJbFcvzM7MAA1kC0xwUacNzSglrmNMTHhVsGhNSseHW4JS60XtbWh/E9UaiNkzsgmJrTNoBTtOq2LPpZpQ+j2+7OGkQYu2+7OxpFLsc1da46y0RzTXPjDySxTBr+7nF9P5sT39Yyuy3+VE40Xk4zqZxoS/wm+tFlkBiJvqlxkBgoirYNsp3E2DSL1rOdjVEgO6GSgTYbgAyFKAIysQHJlAzsSQMlgz1K0wWBHeh8FAGdRo+CKl1Qo1fpWEzp+o7LTY19sqzS5CF0XKU5noe+RwMaA7yNfcGgShWQcRulwm0BWZ1YgdqR1wskxV6VBINfp3bkxepg8dLvSPIyJJXnSSrVsRj8HY03TWPLP0djywea8P/j09EQxv1j1214iX7HigWaOgBi8c3XLHfFuxfLct+GdZkPXMHY4iXLKV7UEV8X6GiMbwg0yn1jX/qB5pdo89hAYx96qWlOW99LSkdjYqwytimwqDHaX1fbVn/BWHeeH6ut9gc6q6WdtdGx6up/oLmeNtfRserpWPV0rDqlTh2raQXV+9a2PhE1RCctSON+otWADseyfNEGh6lzIlXowQk+14asgyz9XV0bjsZ1gYa4HoA2FdcX19MmOGe0yUA/VmaaXBsm+LIO4t2ZJhNUmwMN6JxoESVqiVfObIn7Zs9vo6oSVxb98J6toY/a7EJNKxrhD8prVYD3+5RozQ8+a3/oWbdu3RqarAuvQaglXji7JV41E2YiCDBUrDEKdSXn6hhGreuTpKaB1BA0hmESeC0djubCOAwSVDQQdQmkl+8VCA0V1vZ7cspXHYEbfCMAxHFkfaJUDZ/J+n5/Ho1f1vaXVqYxhKsUJzy+chihvxpYKc5LY8VcDJkteVuKt1T35vUW91bzUHtgJ1R6d9KrNFG6k0Frw2vOCQKya6MgbJgWHe/xRHaOOnAvzYTD0fAarMrrvwobnxP6ecGuyfS6Ru1+7bkNSdevyXQCO5Eefd05tnUZJrVxncqU7iRdOp9896xdR7ui8kx/+hHRsszv/Qwyo3O//bOQN2fyPOT89AsSS/8Ngh+CunSeIAOam8kzUL8kk2chf1smz0N+Vz19GsL1q1csuqqoYdVVS//nCvrze+YFdYZ0NVqBFqGrUBGUVwFeimahDnQ5Wgf5RdD6P9P//6BQv7lBEMdRaQmoYR/BSV4YIHWKFXFskkEagU1i5BZ5LkmYwziIJBzHLuQKm87UjtZON52unTZai+ogbzoLydgyn9lnzoMEblB0VmaGzioc+hbJ7BDdibsg2ccdhLFWDSIONLU8EuGoxgbyVKzU2ZwRxClcK9fNDXOcl4txndwpju3mMMGEQSJh3oUZx9EwYobQKQR+Yhk6BiUWrWTH7nCFYUbtXaszk6qD+WAogn5UwLTuwvncwW+aEf2I9QnZyv0EudEbSoGMZBzQFBjHG6YaokbBbUcuxmFHTovVhp0WYsMuRhI0gs41gLFiRM5eZ9zJxAANORnnAGYTdmyjhxHZqeTWKgadVirVlCJUihfCrIFCyXcxQadlrr3OtsO218bEbN22LbZjtlM2DtlMNtlWZmNtbs+1vefm3xKvBiMyAYzIILKlhsZFa6dR6Z5urzWddp9ArroRVeJAesJsqTFXGOGhS8X2gNnmcFSUVzv5gD8YDAUrzYHKiso8M7l+SBvKDk11Lb7hkutrtNJNN2EPGxxOzrk5nJ31XmHFzKaxD+Kjw2/9PEm//dSnPmFD7ERkQ9n4Z4PIlPpaadbWPCw9ot9m2s3t0hySDukHPKJow5PJxXyzZsaY3foD/AHPq5rXdO9ojuu+Fr7S67ON2XYlKydiVwzmiNH+vP2onbHTzTaOqVOxwQmY3K3ojAZLqyFmIAaXBVML5c6K4AoLojQ5ckTF/oI0DhensStbxYrRYIz00nNtgmkvtFjoRrBai4tuRK5WQD5cavfNMGCDp3TMwjGrxuwYw44x+kRFb4yI7pwV9arEw9NGppvaz7RPGzk9gupGqFW2uZR8W51LGWOEJMsESba5jpqbaN0oNY/IApMACgudDBCpGOgoTpwjhf1RTZTKgKDBUkMnnXBSFO+XNBPVYr2vTjWH0RNh2M12dXiDAlIy0EENdHiDAsJSTWa0tHY0HAaVrsXmClW9UXsYczwfkGG3TaiiHDE+qgJV1mAw4Bd4J/kGu6o+3Zv8/LYV2PbWCLbwowpz86KG+SHm2nkLamsxnlX6yOP7t36ARRxOvpo8cuPmyfiq6zdOmrSGntkNYDC3gy6E8IRBVAAibzdr6mA8nZ136CJMRIy4IoFG0iQ2uRoDOpkpLZgtxQq6C3YU/JzfJezU7ef36+IFxwqGCwyooLSgFRqeL/iwgC9QPNmROih3q42c4GMFT46DXmcawUf3bwwrmMzmUFZ2djCkAb/caApazMr8ypgZrzJj8wBpVoyerGBONtStysaxbJwNdfvyQO/h1BUkEAqp6ibVUaxUwbxDQBpS6gFqAXJDkZAy/qJIaeho6MMQYwx5Q90hBoXkUFkoFWJD7vyPas8dycxtUzvNNGIarT0DOwsn8ExXO0Wqqak1qS8czREM24gAYHtWh7vaUTsOW332qopyh7NKTR12MEeREOwPz6vZ4LnsBsxsHlq2raz5iQXrnsjPSZ7MCc2csLwkeXJMXVX98uLkSTa49Rdz5s6ds3BB4/bRKFn405LayZu3JQlpfnR+UfOtD4+ehYPwOmzcX9igatNLlCxmHOb5caxG2ssQwgexzJVxhNsrvrGH2vF2akpqzyA687FlVpgOBngdu5MnsZvRU3z2HzRFfAHog4CQsBlsuA6nFEuYCfOytkLLIh5rFc/4CHgY3f2Ame/hhLtSGkidVCRPTkTjhkR3roRoiaMBWNSRE2FlSARJ0vA6D7JLBShPEj7VnNR9Jf1L85WOe5V7XfOq7j30tvSu5h3dZ+hjSdrD/ozbo3lSd4jt5w5p9uteY6US1s+VamTdo+z93KOaB3ViH09/RdonYoOeV62Oj05qSJEgo1UggdrH+kU9rX1MsUNGu5SWtDyDsMBiIoFLoW6w2eKsybg7sLk1Wfte1LKcPJAq6+c1EuByZQGDdDICIcsQTUK8reE5rlyrsWm1GokXBFmUbKIosVqdrpxhbQzDwiCMDi5hVsdwGq0gQVQqCBzHsgSuO51GI8HgBqfTUypicQCXKRqZP6I9opQymKFFnUz/ZRrBbv2PlqQV1eOeNtrucY2Oetyj7a7pTR2Nf4XJq4qZUVBTrTp7+DOrKTI7azZx00rCm258eVOJ678ianSooYGnK+Mw06Sr3Yd9VuzDVsAY447kE7j0A6zDMYz/jAuTjyVfSb6f/IA7eNbMfHkWLuhvmtnJ3w6Au0HQFLhfSsCmBCB+71KWCx4xm8txeKZmTc6ekvcfpg/NUpW72X1pcJn78uDtwfvc93t2egazXvW8lqXjeb3dwbsdIb7AHnWvJ7eTnfx+/hVe93zkXRPJyS0fay7S5yrhkkiu4s+HxJ0TWZV7NpfkNufQbS+DC+OiHIxyTDnxnH/lsDk5RbgCKVBrRF6Y2lwfNbo+anR9issToZZoPyvo9Joiqj3QVpQx9SoGiiJqqxSbdszYoFgg5eujXt0OHfHC+dBhnWJwRHSeGREcicHZuacMBFVR4FvoxB868QznQucq8CHcFZl7CMwMXEFdI+30NgqnSyeoeRkBeYMKguEPn24Pn7DUlMJWpBU7UZqDu6Ij6cIgyk0NPQd37pzcpbmkPRxtBw7YbcZgqq2lzhA1Rl04pFohh52xOZw+cBJCPPUWKiNVVdVV1ZURaovAYAi83UZdCaisxB2p8O+PHh5oYbLykp9pTQIz+eftPz8y79H7fnVJ66qWOfhHVZ/lVrc1XtJUYdKSv5Q88kD0zueSA3fddkl2tVtsbk7cMf/uluw8OXtm04Tk7y3lrlDthHnlwercDuwDuWwC97Ma9MGEdiv5D3FYMuDZ3DJuHceUWtoMyw2dFjBeRp1XR+7VpXSkTjdDR3QDZL1SIAhwyhjCa/KRZJLKpE6JlTwbLTssZKFlo2Wv5ZiFtZhQkB6XAkVLSDfupefFXDeIs5Eq9K6MSQeZd51pd0+j7hUclroRkH9NOVV8EBmEdc7ZNPCEsE5TPi6K2n3g49qpHJ2CarvNuBfsJTfpysZY9NKLL5owq5QNPnRlY+U/S+qfSv4N1ngfxA9RsJsOlFDCRuzFNbiCVJgacIP5T/hfWBI4B5dL2szLzRzGxGozW6yMjWAj1a4cRpA0Gptd44C4WBMUJUXOjeyVcErCksdF1drhz41scfW6SKfrlIt86QIf3RZ02FUXCWh77fiUHdvdzrr0hQb3GfWR6ZpXh89kSueusboRsA1OVWnE2rQAsBlWOoZceFeZ8Z47jix6bAbcUvLMi5pXViRPcgdHP94xufOOe0e3krG75lc23nn76BewaDhYs+DMPwJ7rAev+yFl8if4pPiV9Ss7+yr5hCMWN+eWSNQ0zzrPEXU9RLbz28WHdAPSH8h/cO9Lf9Cd5E7yn+hNu8TfkN/yL4mv6Lh14p38rSJjVv0FrZNKycYKthrBE8vqzCJZBh9cLm3pc0Xdu64z00YyVxzqage3aVKbIq0wLbMsc6xwsbgdthS3WyMWWCey21DAnxvMo+pflT4Ps3pGH/sbjiRf/+K+5Fc9WN62cuWDD65cuY3478J8T/LVL/+WfOnW1O6f7t7d+9ju3dRvuhvWOxvuYAd6THFear7cvI1jJN7N15JacwtpMZ8kgrq3ZlbrQBq7zQZXhNUWtNsRVVWDQ91iB045sOPfbbFGG5TE81ss4lNwS/z7LZ42UmtSN1m9DFRBwJJ9lerhh0DBlw4dqqpolpk+/siKK5+6BLu9s+omry7E7h1zF//oqW2kN+ka7pgwY90JPPTte3SdZbBOE+xrIXlRGeLNfEAMOc3OwHbLdttDoQcLJcHWbCOWQ/pBw6u+jwNf68/4+QL9XH2H/kHtQ5Zd/kGdUB9QchuDl/uXBjdZNtlu99+SK1UHm/hm7VT9DGOzr8Ev+HNDwWpdpa/SXxmozBV4DWeWfC59SOf3+wNCrl8pWqO71nad/ZqCdYV32G8tfMT+YOE+/76Avhvf67zL9XDhLwrjRbzT51B8gYhDyfZGvA78IUi2QvS15t2bR/IUV04kz0NNuuIEP7G1CJcV4dIiXDTGV2bCpgowUxlfUsVAooYfkqQHJyZ87QAV+Vkwtqr9zsg83EVL4DmOoLR5Vip5jHnswEF/la/ZNwdHnUvxCucZrMFOwnp8fpJv1etIvmchi9nmfG2rB3uarULdaDv8Ue/jHLR3ZQ0if+o3/fmFcEGlsR/cqP4xubQ83O/NTZfdHrWsZEHmSj2u8jf7t+sf8L/sf9vP+/w6Pct66Dr2Q8SFKmjs1e8srsOZ4EQt+/MiFCs54K0jcDYU3IrZGO7GpzD4RyYoxTCrUlodQAkh8jTE4oXsKZbQJTgU6NpR4VSgX6cCnTqVyuqIk97PTiWvABLo1+j0qlch65zrUUDLjR7c6kl5SGbxXfTSU58TYVo8Hc744zReosJIN0bT91sXPO3tasiVm3pdkbSWOmM+JCCHLw7oa3Q2XQ3NJnQ1IKHP+rQ1KPMBKwp2wZqnRs9w6OFWBKWDO5H661w6lLLbnA6W/nNUemLKsMeycsnV1Xk2+5Tk05dteO/j997OT35lXti2qkzODuIXom2nv3x3FJeGZ83Nzy6V7TZzy8R5D/ccvmfz2IkNXkdgjD172dSW2+/7fVz9SvUg3A+nwFRq0RblIpFjBTGPt3g5XMbtBWedkxg2D3xCjZSnRaLAtzBksgZpsdYj68v0ip7Rs5KM6dcQggbI5n7d2NlplyJjA8DLn3a69nT6Uw0FM/UhVClxEILm1HDUUfeoqM9K3dwoEDGciboNFXDV+TLwIFt39lMyPCozFdzBr5OHvkp2fYUdMH8dzD8G9k6Ltyub84XXWLJdGMTv4z8Ip/ScKHhYF5/PV6Nx4mQcxTfgdYImiMNCFR4vNOOpwnbt1/zXgpTHBoVCTYQdr5nETte8xIqXaOawUc1S9mrNtfhGzQPsNuGg5g/s+5qzGj3DCnArOliZLdRUsHWaZlays27NeM10zZWaXexz7OuaM6wkDKRO9VtcEXYgdbzf7qR4WLHrzBHMagSWut6ARCSJDPj/wwcKiiMp6lwDkdGRG2GCRLIRInG8VptpPgVCp81OaNYGEWdDiAM3H3wQUZK0iBsgVyf4CgmQohU7Zuh36IdhdxhaTSq0tNpyKv3Bgu4Wizp0L/e6wm7V/XPRLxDuabBdag6Vpm01JJu4EnC5z3nl6Rym2o9okjYv+zWy5FMXmACM1BNBlbu9q2s1pkkFBo8d3HXsg6gDb0xuxZcefgVPTW7HdyZ3HX+PBAiTfB/nJqXRN/GU5HNgGUCbNievYh9SfbNs9IhSMs462UosEaZGX2ONZDUyU/RTrI1Z/8qS5vHzNFHLPMc8VzT7jPCvLBEidg+9nTmBfh5THFqtyWhw+kRP5xg8xlxgMBiDJhNW/bJO1A0juXPq0vd1V/qqMp04d22rUXXdOV8Ebm79Mn6ZZgXc3ctcK7J5enlb094YMpvg7g6GzD78vdt7M+Yrnr1iEJPk2cG2e2eAo+a4Z9nim29fcvkdbPCx1qXJPyVHk2eS7zbPHf2UGezf85P+XU/sgBndDwfzafV7pYDWDyKJfqEE069IrRLpluLSkHRM+lLivFJM2ij1QgXH8ALiWMaIsKJ+l2RQOwFBcLzAaogQxKx6a/hyI6xbzFzU3/lecC7bu9KHzpRx11eHzwXk96cDcvYAZpNnv53KBr99z7UCFMmQnMnOgnNnxZF9lnwOW6lyunTGiOjQGyMCTXiacA6oI3R4L8TlHM+zeq2BNxFk5VkrYRkG4lXeGoPLbgDvVSxao77UkI9ke5k9Zmeo86jeBsGI6lNassdE7BCXsjWM4nJHNqrxaEiRiFoCO0VLFlyDlOyqSNoquW0vZ75vhqeNuiGFP9eoGqGCPq+eZjp9Avyz9tJ0nIotEJ7SbyhqnCqAK0p1Of0zQ3tL3ATO+HhwxhOsCR1MwXlKnepjTHgcPNGMUftEMejNdVaT1Q2JxVXHUUMABYoTUE73FbWqJ0IwMAF/KEQ1ptqAw8mvcSB556S8SZdubJ053d1QufhHbjY4aiB/P0sG2xdf5De/r18TRTV9sK4H4PwvAh0xQfi4UanI5/I1Fzs72A4dV+iscU52RB3LHVyNsyprU9bD3DYt5zXnYUSsljyjSXSH9gpYoIKVtBFhgNylWLt9WPaV+YjPbJGRbCozERO15/L37fk0GqpQ7+K8Nae+XBf4r75yp8NhsdsEnr4BHzbDbTaRwCmAMC/wAMl5LnbTQKy4etm0Wxb/fPQtnP/BDdWTF9bWXjV74n7uYHbwxeTJ3+2/pXdJS6GXffFspcEy71dPPXVgmcWAaseCLm+DtS6GtVrBdhWh40rd+kK83HBt4V/ZMywr+ewSn1/ky3NYvPYZdlJm32sndrst4M+zWEXZRpedFerku3nCt+SH9kJ0nFm5jq7cV1ailLSWxEo6S7pLtpT0lohySVkJKbH5QQ7WMiuxUjkU/6AcTreP/MDFZocbLaeG6itcbPYLLrbvfaFriWtBmYxqZCePi1ILA2KEWMfGCw5614MgubQgq6g5ATkyZl+mEAxsI1Of3bNp/qqFt29pf/yaqcmPk3qc/+IzhZdc2jK16M2nsKU33DBbue7X3MGcBQ8vvPzpcOjwxqVHuvQiYV9JPsNJl17cOFfiRgeT10q69ukNCwqpLzAXfOo6sLlu9GdlZpsxagElMq6wrHDc6LrO/RB5SPeK6RXXH03vuD7lPxU/tX5q/5q3jrOOs0+1THU0u6K6FTphvKXaUe1i1nPrjZu42413undbdjkGLQcckkH9bpEVoXi/xRYxVOhpjXtMRMVGc0R/ELNIAzbbYtYiBUiRAnSoYgvG+CCYCRaaZKeAaS04xqV6mtGnP7NnCT7bBYEX/awePj0SRnWjp9tPhMGDO009t3BaZSEUU52r9LeGqmr6IdtPjTi4XezY5OeGJTNW3LjxytZldmwLn37j0+Tn2DHy4sfki/LZc7Y+deSxy1aV/vJFDHYVCzhvF8guNZo6SSZwb4G2jlNyEMZTCITRhP6HIQZp8OfEwzGfIzd7/1XfzTB9xah37I2ml8eWCbgCM/jKt5Jb3dwX39iQezfsydTUX9m/Q79F+Jhy0aB5IOdA/itFrGAV7E6r0+4Kd3Ad+Wv5a/Vr89/VvRPQRTVzDXP90cBy3TLL5b4V+ZcXrc+5PWebT2cJqI66N0Kx0gGO+Uz/zMAL/hcCbJe/K3CT/6bAn/1/DvBhTaE+158bqNFHAi2aFn2jf1LgCn1H4Dr99f479T3+nZpd+t1+q6SR9LyfD7g1br0DIqWARs9i5zyX4pYjq1x4lWuHi7gOkg6UBWZb56nxZuGsYhuDJqte/RSPHEn79DG8BffiOB7CIv4/rOKpMUEMUlwoub5MObFTsTojzhYhFPSUeEO9pjhYpRb8pTlj2Yt/nzmULbPb+pAyLqqeSFWwp8OrQbijqgt/Io1Xh09Qr1314dVz6gd5ZOVMBHkcy+CPElbqnQ8DgtLrCQstHVOMlhq9bKnRqGCkdWDkdVCnr9G4KFhrLvhVOpoJu+zjNeP1NHZs0UzRT/I3B3ZqfuHXoPboObOpev3pw01f+iWsQmYvcPtVU8AGZDQVy54dm+7detElkcH/E9u08ctfYBt2Csnj1htvvGlKadE4HD+67q4Uej75WfId/EH21juumxmZkmUpmTDvumc7X1r291/ru5ZU+msieaXLrj6yecP7V8KJAv3aDrY1ALZVwr9TDBLDi27GKbIWkVDHFPVbtHX0s3X/Ze3pz9eFs+dEmHJBtAmCyIiECIzEgqMKBVYBGlaBdracP8ph8Eg3K25F26qNaZlObbeW9GqHtETWlmmJVpQynVKsGGbPjkjlahgxBMeFGlzN2HXnDa768wfduDOZknps1M/JCGBTCRU6OKbnPkYyoOCSIRQRZUjorJ+DcFlUaMycCdgmqVTdB7SVYre2Ul3YRZ6SiDgbEo5xMOWMwrDNzG3iFrFXTIgnGP5l5qj4nsjITKkYYSaIM8T7mB1iL7NXjDPPi1pBda8qKiNEgUSgJ0xfWh4hMk0EWyXUPATuV0mEzIFEpW4eI0MJEpEIgoswTqGIhIQJpEKYThRhAZknQASQJUwjTcIjwh7hN+Rd8gk5KfyLaEMkX5gqXCvcITxNePo78+rzmofaMyEqeKYQPVH/DZLtWCZt2Jr842gfd/BsMfPWN83M4bONyOaE/Vd9TewGsecqdjIO7G+QfpFOBwlu9vJr0tswbRTVTRtRYzLqEqq/yzDi/wUTzkyxZW5kc3RyZWFtIAplbmRvYmogCjE4IDAgb2JqIAo8PCAKL0xlbmd0aCAyNzUgCi9GaWx0ZXIgWyAvRmxhdGVEZWNvZGUgXSAKPj4gCnN0cmVhbQp4nFXRzWrEIBAH8HueYo5belDztbsQAktKIYd+0NAHyMZJEDZGjDns29fRdGkDEfzpMPqXNe1Lq5UD9mmXoUMHo9LS4rpsdkC44qQ0iBSkGtw+C+Mw9waYL+7uq8O51eMCVZWwL7+4OnuHw4W+1+eLVf3tCdiHlWiVnuDw3XR+3m3G3HBG7YBDXYPEMWHNW2/e+xmB/a0Oa2Lvu0hcTT+g7fWEUKW89sO5BtTy/1oieCy5jnG+76WB81zUHgSBCJAFSAnSCJwgI8gilAQ5QR6hICgIigCpJCgJygBFRnAkOMa2AU4Ep7gjJTjvlyDwbf1dfg9N16KoH8kMm7U+tPAeIS9KR2l8PJlZDIVBf/IDT6aIsWVuZHN0cmVhbSAKZW5kb2JqIAoyMSAwIG9iaiAKPDwgCi9MZW5ndGggOTMzMSAKL0xlbmd0aDEgMTQxOTIgCi9GaWx0ZXIgWyAvRmxhdGVEZWNvZGUgXSAKPj4gCnN0cmVhbQp4nJV6C3xUxfX/mbn37vtxd/PYTXazezeb3QBLCCRACCC5eSJEIDwSs5iUhBAIECQQUPFFrCK4qKBtUfD9aItay80DWB4VFFqVilixWq0PVFq1/0bQUt/J/s7c3Q3h1/b36f/ePTNnzpx5nfnOmZmbAAEAM3QBBzVz5ucX1GqXXwtAbkPp7JZVzR1gOn8V8u8ijW65Zp307JEP7gagTgDN1Us7lq2a9PP0EIBuC4BRWda+YelSx+dpAL4ugLTzba3NSz6OvfsG1ncFlp/YhgJ7oY6lkSCnbdW66yZqBdQnOlZ/++qW5iyD9Bqmx2Pauar5ug4N0e/B9DeYlq5uXtW6rvaHB5DF9uCbjtWd62KjYAdA6iSW37G2teOxnk//hul6AFM+ygiOiz0m4EHCmMcXR3x+ZCyGoRSLWT9kaRwNRkJdbIDvhA+QapFmsZg+DaVCHTQIL8JSpMeQf5iNhTxIJ3Pt/JPCOxqN9kvdc4aJhm/UmjR/XTrwwKP3LLJO/afOpVMbf/zj3FEs/sNDHw98t2dgmQi6uZjUx1tmD7eFbAcBdMIuoRA77YrH3B9gKbXrBGrU8JQ9PPyvZ8Gscgnk89L5kcLpwbmkUDuN9KijBu20wdlQLsJ3e767XoSLLSUeoyox0r0wFU6AFiiIIMPtAIJD+Dv2hAoHIQMpU/glZPBBwPmOfYL0KYsHl8c+ZfkspmhtiCYIYDc8S5bDs3AEXiDnsdQeOAB98BI4oAIehBvhp7AZTb0QJXfAPHwFlP+UZMT6IB8ew7l6DE6i7pVwMxyEdOKMfQYbYRN3GkttQpRmQynUwGq4i1wRWw8NOFO3QhFcAVdDB+mK1cfujt0bexJ+Dge4l2IDOMZMaMH3ZOxz4U+xdyEPS/wMdsIH5F79XhztlYj6A9xDsBZ2cY08iS2LfYc98MG12AceZsFJcpSGsPZW+IQ4yY1cOdbyREyJHUctNzRCG+yCg2QCmU59QkNsVuwkpGMb12GtO6EH9uEbhd/AO8QknI89GTsPGTAaZuB4+uBVcpQbHLhlsAQtJqCVRkIx5qyG5+BFeI34yfN0tWASCgRZuD72BqTCOKjF3v4SS/6VfE1vxncj9zu+KlYGFrTLPcza8Fv4kGSSfDKH1NGRdDV9mFsLOmxxHL5LYDna+36s/X0SIvuoiZ7inuCf4b/XZA2eiVlwRoLwADwEzxMzjlQineTH5E3yMS2ni+gD9CPup/xT/OvaZhz1j2AV3AXPwNfETiaRueQq0kZuJJvJPWQnOUleI5/SUrqArqTnuDZuDfcbvgzf+Xwnf6twu7BV8+lg/eDxwT8Mfh0riN0OcxEPt2Dvf4Yrqg9xcgrexvcD+IgIxEgs+ErER2rJDfjeTO4ij5Pd5CnSh628Rj4in5EvyT/J9xShSzXURX00G18/XUuvpT+lD9JT+L5G/06/5RxcNhfiJnBTuTC3Gnu1mduO717uQz6TP8XH0M4Fwg7hEWG38IzwgnBeY9L+WAe6V354YmDUwPuDMLhlcMdgz2Bf7ENIwznMRCt4cdXMhWZ8V+B870DE7YHTxIS2yySjyDRyBVpmEVlB1pDr0JK3kV3k52rff00Oo5XeIuewz2bqVvs8hk6gZXQOvj+irXQN3U7vpX30Tfodp+WMnJVL40Zx07lGrpVbx23gdnAK9wr3HvcR9xX3A74x3sB7+Ww+yIf46fwifj3/MP8J/4nQIPxe+IvGoFmluV0T1Xyhnaidpq3RztU2ardp92nf0DUhOo/BXtg/3CmQM9wtXCW3F+6mhXwGfZW+inheBEu4WRSRSneTLfQm0kdzhOs0U+gUMhvO80G09e/oI/QrOoWbRarJfFhBx8Vr06TyT2M0lT8G/fxhHNurWPN1GhO5mZ7TmKCHAC3GNn/LjeVD3O/hHe4DouUfgz/zBuIg/fSXXA2i4Df8NKEefNyD8GtuDbkJ9tJKAMP3ujsRx7PJ0+gXFpAC8g0XA47ORhQVcR/DrbCS/gn6cR1vgfvIEn4Z3A2F5Eb4BH6Bq2KkcLVmlCaNvEyX8xGaQvqA8k/h6IpJDuGEVLiNNHK7NOfo27AeTvEGeJ/7Ffb+FP01N4s/L8wjbbgCbkJPuSZ2C2wQ6vnXyTLgSB0E+DPo3W7kCngfxhvRqzSgT9uHq/sg+oFSbhZKnIicKxAXteghduF7P/oJHhG0HNf4lejFXoU+zQIahWWChaDXwe3q94PzYGHsF7Aztgyujt0LeegPNsduxBp3w19gG+wmmwZvgA7w4Mp5n1whVNFTQlUsj0bo23Q+3XHp/KK1A8QJf8P315iYJhyCCP8WzIeS2J2xPyK6R6CH3QmLYSacxVF+ji1czh2FwsHZtDtWxXXgeD+AubFfxrzEAG2xdpgDh+HnWgGatSGcY4W8juO9AVrpvNg6rnVwOdphG1qB7Svr0f/cwa/hb+W/hTtxze9Af/MorpunceWwtQ/yVZvWda5d07H66lXtK1csb1u2tHVxY/2VdbUL5swulUumXTZ1yuTiSUUTxhcWjBubPyZvdGjUyBG5wUCOP9sneT1ZbldmhtORnpaaYreJVovZZDTodVqNwHOUwOhKf1WTpASbFD7ov/zyPJb2N6OgeZigSZFQVHWpjiI1qWrSpZoyai79X5pyXFMe0iSiNBWm5o2WKv2ScrLCL0XJwrn1yN9V4Q9LSr/Kz1L57SpvRt7nwwJSpbOtQlJIk1SpVF3TFqlsqsDquo2Gcn95qyFvNHQbjMgakVMc/o5u4phGVIY6Kid3U9CZsVNKpr+iUsnwV7AeKFygsnmJUjO3vrLC5fOF80YrpLzFv1gBf5liDakqUK42o2jKFa3ajLScjQa2St2jj0bujIqwuClkWuJf0txQr3DNYdaGLYTtViiO6886Lyaxcnt5/ebhuS4uUulcLrFkJLJZUh6dWz8818fCcBjrwLI0UNUUqcKm70QjVs+XsDW6KVyvkE3YpMRGwkYVH1+rv5JJmlZIit5f5m+LrGjCqcmMKDBvg68nM1M+EDsDmZVSZEG936eUuPzh5gp3dypE5m3ozZCljEtz8kZ3i7a4Ybst1gRjMg9nWofyVE5VZ1z1vCHLEtYj/wwEhCK1SNiTej+OaRILWidBpGUSquETJlhKWYIzslzRlzdFxMlMzsorQkD0S5F/AiLA3//3SyXNCYkmIP4TGMtwMgQ1zE/ySiikjBrFIKItxznFPk5T0xPyRl8TpX5/hyhhhOaDGrRtc3hyPprf52MTvDUqw2JMKF1z6+NpCRa7ekDOD4UV2sRyjiZz0mpZTlcyZ6h4kx+R3KceM9MUXXDoZxXTUyrbJisk/f/Ibo3nV8/3V89dWC9VRpoStq1ecEkqnj9pKC/BKSnl9ZyLJjjq4tRcBGXDkDJL1JsUPoA/jQrqJVGtDlGpSohUpYhNl8fDsMHn+y8LRWPnWSk1ulgs0U1lcujS9JRL0pd0zxThsMO4vVYvWBiJGC7JQ6jFG5yRiBDxsKDeJ5UrUIsrM4C/aOzoJEZhlyKjycqZAuIvLkokL1F0JfgwPgydeaOr0NFFIlV+qSrSFGmOxroW+yXRHzlAX6AvRDoqm5LAicYObnUpVXeG0VZtZHLeaD/LiUSWdAMXwGZkVzdRmaLyrWFlTijsVxaH/D5/fSuOpXsymHwLmsqRo1DW7Sdb5nbLZMv8hfUHRHbNW1DfQwktbyoLd+dgXv0BvMTJqpQyKROyhMQSUE3QND1Up+q7DsgAXWourwrUdEuUgCrTJWUEWqI0LhPjDQXVhmQ8WLZE+XiOnNTmUaaLy7ri2iMS2jrMEVnOQcAdB9TM+NONiQX1sqFInixPkafREooWYaIelBxE3SkEeqeREuLqxjrnqeIo6eqeIrsOqDXNS2h2oSaTdQ3JsOdMbVhF2F584LUXR1C7sL53GmD9aogaZexhnhY7MXwNqY6J4fzKUL2JRqrnIwJZpmGSyzAsW2IFFeJXFvmv87HRKXX+DT4U+hUJvTUqdcN0dzgSkfD1o1Va6urjIcsio91YU1jpWpzUdbkRExeTJiyq4qrXzXzIUGs3JFtbi60xJpJsTmn5t61h7xVyFQvVn9r97ongj7ePu3S80UhDZCHi0adksYYT/cCkxR1Wa8Ce3K/2hKibUwueCZaytSQxJ4du0j+zm84OqTFR48hMf+US1GCEm+4EnCyftCTMtPxs0TDg/0clMkyJbSRq5RFxSjJFEqn48o0oyy5Ntg0lqxjhGSUwJu4mcCzqkvUpK1xKezg0pNLMxhzBtT2ZLfDJauHpjJpw25mudLU0Yxdxv5nR4kfBTBRI9YvjFmQbdYSdnFqasRizcqIl5erQJVWiTyDoorAiNhylq0ZqCktN6EPIXDS2S1IEjKWleHzyNzO/URMfTw06f4yaI/OxLLBpcyla9GdLm1v9zLkqDO9x67M+8tg7mF+vgCsS8SOGsIuBKlTG6oOKJjiDRfjrCPmbW9nJbik72LXGjxzYXdU6rDZXpd8XRhUaUG2JhsOFtpgFLRF2bmxsCqElbBF7RCqO4IJvRF/FB1vqmtCvSaJUJalT3ezCFBphBkuFsaK4oj7AFLG8+gsqq0LdjdrARYn6Wx2KK+vUWtVDhFKTVNGqP2TWhBTqmISZbPBk3kJ1X8CJYsYTAjPQvDKiysVK4ypakNg24uVnsKKu5ITFi6EknNwAEO/dAbKlZrgnbFDs1fOucqFh8xLf1SCWy76//evTvWBTqZEbzV6aDVngxSv4KLw2e7lRPZosb5Qb0Rt0el87zI2EM0iUG9kTyvIe4HK5rJ4pXjnK+XvtaQXW0jxOQhedr4YShquR9iAdQeJhEedBuYjhRqQupD1IR5BeQ9IAYMhyJaTVSI8gnWE5XBbn7pG8Ymkul4FlM3CIVs4B55BiSBz204GtOmAO0iKkbUiPIGlUPSZZjbQR6QjSeTVH5hw99xZi3x09W9Wod0V7gZpsjicbGtVk75XheDxrbjyumBFXmxxXGzc+Lh5TFo9zR8dje6Cgi8UGc8HR0nQuHQeZjh3vwJDQ42AlBO+Xj3JpoCBRTpOQyJy9NydY8MgRjgfCUY7AEvDGjnKkx2wrKDXQGD0HdvDSz2l/PIf291psBY+UzqQfwR6kI0gc/QjfD+mHsJGeYTbHsATpEaQjSKeQziFp6Bl8P8D3ffo+WOl7kI9UgrQI6RGkI0jnkLT0PQxF+i47BKoh40uQKH0XQ5H+GYf1Zwyt9B3k3qHvYNdO9xQVFxxQmVB+gvEGEozDlWDs6QVR+nrPtyMRUUGcaUTUIS4bpkEhl90TGIfwc/ZMXe6N0o97pZD30dKx9A1QkCj25A1s+Q2QkGqQmpA6kDTIvYncm9CFtB3pUSQFCVGGoYgk0RNIryC9CWORZKQaJB19rQebidJTPcEyb2k6fZW+CA60+En6khq/Qn+nxr+nv1XjlzH2YHyC/q7H44VSI+YDlhExFjHOx3yBPt+bY/fGSm30CNrOi2E+UgnSHKRFSNuQNPQIze5Z4rVjJYfghA5Qswc+U+NfwOM6kFd45WA5AlBiQXDyZchh8Ij0SJDKwR07McmC4N33IseC4G13IseC4PW3IMeCYPs1yLEguGQFciwILlyEHAuCcxYgh0GUPrw/J9dbNGclkUqt9Fq00rVopWvRStcCT69lL3zLs7490DNqFFpslxwaOcrbhWefw6RrHul6nHS1kq6bSdctpGsq6foR6QqRLjfp8pAumXQdIpPQFF1E7rskWSw7SdcJ0vUs6eokXUHSFSBdOaRLIkVylPp6ZhSqUaUa9ZayRYfxZdPQ+1ipDy3qQ8z70CccwfAUUkxNyagkZceVMzwszu4dVRJPj5lcsBqXzzEseAyn4Rh8gMTjBB1DGB3DSo5hBVYMS5AWIR1FOocUQ9KgdjZ2fJsaWjHMRypBWoS0EekckkbtzjkkCqsTXdyjdox1Oj/R8TlIPD2GL/s66qM+OUt0iyHxcm6bm1g9ZI4n5qFFkJ6OLttu09mixLzva/M3X5tBX6qnd9NtzHXT7Yl4W8+36LrJ/T3BQ97SNHIfeHhEHimGIAlgPAk61fQEcOtYPB7c9BmMC3rcdVjM2hMc7T1ILKzUPu+37rPez9xRiuyn7kPet6QoT3q8f0TJM/u8b7jv8L6cH9Wh5HAwSjA6KKmqB9yTvM+eUFVvwYxdPd6bWbTPe5N7unelW81ojWf8qBNTstU7L7jQeznWV+Fe7JU7sc593hL3j7xT41oTWJl93rHYhVCcHYWdHelWG/V7UNLnnVBbWxQlbfJo7Q5tvXaOdqK2QDta69N6tVlalzZVZ9eJOovOpDPodDqNjtdRHehSo7Ezcoj94SVVo/79RcOzkFd5kbKQxv9SQ4mOwkxQUrhqWj2/jFQrR1ugerGkfDXfHyUGvBgK/jKCOy9ULyhTJoWqo9rYPKUoVK1oa66q7ybk7jBKFboFrzYL6qMkxkSbXOwTzAEgxLbpLheLR2y6KxwGZ/o1Jc4S+zRbcVXFvwmaEmHo4uO8hM8qU3ZUz6/vmfD001llYaVA5WMx5KuVn7BPNQfIl+R8ZcUB8gWLwvUHuGnky8p5TM5NqwiHq6OkTtUDiXyBegidL1Q9He7STA8knSeutyuuF8DyqJfDItTT6yGg6gX0elWPJ0yvuzOnsqI7J0fVcUjQqep0OqThOicCqBMIqDrpXXBC1TmR3sV0lGmqituNKh63qkIywa2quEmmqlJ3USU/oXLHkModakscuajjjuuYzyR1zGdQJ/TfPq1loRDpnRJuaWCfuZr8la1ITcrWa9qc7MQudbeEE9+/gk2LW9pYjGfWsL+1QmnxV0jdUxr+TXYDy57ir+iGhsoF9d0NcmtFzxR5SqW/uSLcO71mfNElbd0x1Nb4mn9TWQ2rbDxra3rRv8kuYtnTWVtFrK0i1tZ0ebraFqhQr6nv1kFZuLwhHvdSowFh24Tn/LJ0sWOaiuEpPufNroN4dNkNxlBYMfnLFDMSy8orzStlWbi0WJaFfctMZDlvnuJzHSS7E1kiim3+MgitW9+5HpyVyyviv058ULRuPTN4PAx1/qcH8yoVubmicx1AtTJqfrVSgpfjbq0WpU1sSMrkpMxorIzGjsaFY1A4mQk5bkiRyaYymV6fUPzX+V+fiMvZKuiih3qJ7CHroDPMKZ7qBRQ9woLER6ODeLBie0VnGAfYSUKkM1lHotuhEMTTwMacpHXrE1zCFusScbwkFulMmmToYcYKDVlsnVqtas5QQ32phZvI5UMpnp3HYpyHcR7GBRgXcPmyPejlaJFXryvyGg0VXq2mwpusNRxiVwYdLE38nZoDEyT/Zs0jb0rwGuSc7ObBs7+dOyEnwVOw4NUiznMon5ngeeQXJ3gN8teXsqcqVLp2eXP7f+JxAMm3CkIYroXl0AztMA9aYRmsR64ZZf9J6/9Xzj4WgYAv9lMLZX2UnNVoo3SnnAICf5YDg5Y/SyBDpxHOUu4wHQd6spOMAWdI/GrqwNTZ4oWpswamQgny4g8YjBvrs/lsAQxws4EfJO7oD7IA34PEH8WtJjaAbYWFg9iShUaUTaH60iwgsW+YjYkMdWCI/TDE64fJhWE8n+T76nQ6kynKGA2fYLQoeS5R5DswglFV0xiNzyXKXkgKqSkpJBeFGoPRGK8nPcGAKcEYNYkmDIYEIyQZvSXZjaREG5fsryMWq0hraTT2ZV+C+abPbNYw5oIcNpk0tXoTCwU1zBfHist0bfomcQu3XXxZ+J3mqHheNOqEMKmjNWKbURH/YfqH+R8WPW/izbyFMxr0As+bzBadRqs1Ia/TmLQ4o9iMbDWZaC1IWlMqZlGOY7I0JuMk3pSKpfQeQdB5NJwmSjtkPehMn8mUUHqQGHG/Nsp2kwStWm5eDX+K/4DntvOEx1OJbKwxHdV+YOK2m4iJpUWr9pSWbtR2aan2J9Y330JkXGhck4GEP2e/2J+ZIfb3g7NkamZ/ydmpYj/+NgtjQqGbxOObxzjVmNjsxcW24uLN4vHjluPHNwvxeNxYPI0Y0VV58BRCyxW5ZmF9H2/ldNqDsfN49/9mEj5hsnZN4/+1j7m6dZooN042tet0QHg8HJkIxf4UlpRgs/mhsePCflJI/JyPS/FxwVyNlqOFf6D17z0z8MBjb5MvdlZluwuFg99VkcODFXQh2XHg2ru24vr/AAH9vXAUDMTCkNyLc29KQCaJFEsSREnGoDOb45I4I/vqONlsG7+S30i30Z06/lc8QV8hUE4vEBMlJww4lUdlg88/fiwQ9hECz3V9IiIJmb/JNqsVObc60RazWZWelzOsVk0tiAxQIDKwQaZJkM3W8QKry8LqEogkyAIVMowHyVSyCZfzbPFs45oQruqE1TARX9kljmJiK8apaITGEEmYVMa+6TWyIOgJog6NWYKWzDyJ9kRr+vw2jUY7YeLEokL6fV/p6QX3fZS/jr9h2o3eX08/sUgIo7+sjX3C29B2ImSRQWa9bhr/SJ3p4YVUj9ns0Edjn/ax4TFGzmCD09vApA44XR2wSR1wPnbnJAYnoaS/pH/cWFe35l9rutDHTILMX9XFh8zncobRqGFVxi2UsBaTDVV5sU55Nq/ZTLcYt1hftgh6rdFJK1OuSJuZUe5akNKQ1pAxz7VSu9LYktKetjKjybWBXqu5xni9dbPmfu0O8WXnO/RNzZvGP1szh7pUKqLLSfozR+zLuPtR+W/ADGYEhq3O0amX2VzpCehFPdWXGpJ+SnWOn8YV99fpt3ttScTZkkCzxfHVW2frVBFkwpokYJ/ShlCqS4IzrrqvDrZ7XtzqjEOgMdQfiqMBgcDYhClI4xpojK/F+j6NlCG6EXE9VDI+FzsD6Uh2JCsSW5qTCFuf4bCr25wa5fL72s1mPhOZnnaeYSZUwtZeimifWFiQnm5PE6nGn50bTBHTCwsm2sSgP1urqV15+tFretaVrTj92Bsb7jnw1I03PvXUzTfObKSnCU8u+9Wi3sHYO4ODg8eevX8/eWjwvnPnSRtZ8fny23GgsxBjaYixLBhFPhuGMa+VeMkiwhHXCI9sJmZzquBxCdmeVLPBQyAgMs+s4k30OESGN4fI8OZQ8eZIgOPkGyfF36o2QeA39ovHGxlM8lZmkAqtnFaRUSEttC+QVnJLtEt0K+xLpHW69e5Nutvdb+reSLdpJYa5XLaUGeNndzUX43xqButWjZlix1zk9CK25mmbrE92kkTJpB7YG7gEQ4FhGAoMw1CgU1QxJOKlD70Gju38foZ0cftoA9bT60miwZMEjgfRcEitx0OKZXOJY5FjtWOjg3eICQW0huq5LHWOdFaVI5312RGlOb2hIfiEGhlm+pFPwOdCv2qsgcazNtVg48YmQHQAtGiGXMkv+dAMRPXorALmbsKuvYQIBvMIxMxeBI8rNVuFUarZJagwciVgZEM3XoD1IpyINpirIkejnYi4sqelahBVYBOLGMpIajoD14TxqKLhvu91jp6xsq60djEtPbysb+Da1277cPDsQ3d8+ux7A0Vz7p699snHb7j+aX6+ZcXYWWOnff5uS9Pg169H+m8m1eRG8tTzu1/44b3Gp8PRh+/fswdnifk0n/AL8FCtuh+kJG1rTzIpybOEPcmkmBL7gR2ZA8zscZDijRkXrZkhjrgtBk9amtsepYdko5XnPW6zhYDWiRuA6iBVhmk6mRvMP5mfhOXAcfF4iMFyPKtdU2tVw+rMDVmRrB0pv0w5ZnrT9GeXTp/itIzK5FIMafaUlBMWa6olJdViNUfpk3IKa1q2PGqhFotVTiOJbuy38uQ0+9NllDhlG+uQbZG4WtwobhN5sUt7CTK1w5CpHYZMbadTRaYTD9Kik+IgLuxn3XNul+yHyQSwkp+h5qQey15ykEzCzf6obBzyYdu9UXJvtwo2dFQX8B2GtEbctBjQ4ksTodEo9otnN+vGhAQ8agDibwh8ffqxwljjQXRXXBJ7hB0mwkPbHOCtOcWCeyufZlBRmJZmdfMqCt1mqz3KFfa0W/mLKEQqtBXa4lhMKRqGNm1uii/NxyEKIS1Vi5gM1v4mbWf7j/uevfPKO0c8dTd9e2D/nNvuOUp06+668NIA6RIjW48/vqtnTkk6/eJXg9c0DH71hxfv6TkTjqLhS0mUrqCr8Mx+GcOanNFBOzg6i8yilPiBZgodqJTBd9wV39jFv0L+LFxzsIY0sv+jQJvjbs16OMGXVkpHkujevWYzFmlADP8/4TSM5UrV07kNcpNzhvMXHMYPeZm+OqeYwHdGkslEptSr6plxo0rOv2kYbxzGu4fxriTfV8c5E6uEJhkSZ+QRdS1cC9/JreP5QO4Erthdzs3QXpFV6a3Iqcqdz4W1DVlXjrgjxeJn5252WspJMoEkE0wyuUkGlb/qM8eV40wgyQSTDCp/JVcxboQ5mENzuNzAROt4f0WgMn+hVOevDbQbV5hXWpamtjo3GK83X2+9SVyf0xm4nYsY7zBHrHeJm3JuDdxr3mHdkeZJHFTyfEG7K5ipD44kQYCRmXa+YFwQr3oUzHkbXHe4qCuQbs7z5AZIQEgX2OYUvzB48vQeTzqnLvYQAq4RKRE14nnaUZzfH39xWwrkWMxGwefO8rh0Wg3PUQ0J5GSjTIO7Sl6mzPa3bZkksz8d8gg7LtiZRCQSqSFNpINsJxrcdhTZlOeRUlLKalnDAtu1zCzFuoIjmKm/ZOHrhy18fRIs++r0QRhJRjKXZbHQ2pFsPEbW2MjMAl/ST/qSm5EveTRBG5GgPRr7u1rKrk6HWWUS9xzcbBnix7VcxRB/oXHWWXX/YQ5htnqKmTW0C4XwJw40hs6y4AKzlM3BLFdMkA3jImHn4ORDhifUzw2u/cRF8lzpebgFFfa15xnTPaoXwKlIeAFc/PHV76G4+tnyzw3m5AaDE8ZPVE86Dm2QOYS0VEc670hPj+9QOcGG/eZFL920+un5NQ1TBtvnLl9285c/feLb24WD1mefUh4rnkTeru+6/vbvH3px8B87yVvi1XddWdZZUbnM72gOFT3Ruvr5JctfucWy9e5brppTWLhyxJS916w/1bnuM/XfLmFp7BPhGlzXWSSfreu9LXRFFiXsiK2eeNkRexHjJCgwt0AHrMvqgtuytsMu4Rnu5+YDXJ/5RfNrcDbrH1k2iz3LlpXFjdKMsI1yS97p5rrUK9PqMtqElVk32Lfad3E7Lbvcu8mTdLftj5YUSIVMMVXM5PHC+37PiGIVXdKIYtGKVzFXisfEuTy8XgxaZ0JQIoRkeh00gQJHEgUOQ/zEYahzBCUdwRu+mjTX6Uysz7oMT0uDOuvJacYZRyZx5MDJxWMrZrGTK07oWpdswBsybxVFE++KcgV97bzelIJMT7spMYd25sWR2HnCoeFxduiE8facwgI+MXc0LdXOXDvf98Jlg8f+0j/41gN7SPkL75LRU44UvvCTpz5uWPXX25/4iNJx575/nlz9+l9IbfeZ3+c9eu/jg+fuOTT4WeQwUBcu8ccAhGeFg+CEbLpR9eQ+u9FC7BPdC71Ldau8aBq2KerUUKuG6J2O9jHIm9m9hjGmJGNMMrguPuq1Z47H+Hxvdu54G0tn5Y4XE7E1EWP+n3qzgvF81BcTMcuXZyATsMx0z5TmGxvcq9xr9ddZNlg3GbZY7zM/ZY1aP7V8YhUtJpNks6babFab1aS3u6gvM92gsdtEs0lw6vXpjswMj+O52NFhN5yjchqbNocDfNkeyq7iTqvVovOg9xgc8h6eYd7DE/sK5eg99tZ5gpYHNcmboSbpBjTMFWWwgWs0zESaRimnI6crh8vJdibR5EyiyWlInl+dknqjlhLX6a/USiFZKTLfxV0TaBKL5Os+9ZbInI5BvTU2+qfsTiAvfmnGKzNGU8VG9RCccdYZvzpNFfFl38jY94bQACaK8+3sXu0o3myJn0vY1eqSzxbM1zSWN+BNVidbi63iZJt9MvtWSdaoH2QtsfflzIxiW3ZGsR3JIruLxexUJC9SWnHyy6arR5/hQGzLxvaMDCBWHehItop19RtIKPENhF3bC22+AtUbadMd6Y4UPzeG4knab0Ox6sT8vsdo5Pgr1584PWtE7RWxCy/UXn1lnq/6Q/LYph2z73ticKxwcM5LGx58MyuQM3v94Boy7rY7Jxm1A+u5wqIN09tuD51FvD+MC28A8W4GJxmj4t3TaluZSqvF6tSrxKtSeaPJY7VYwOFUkaGzXwIK+zBQ2JNbSm+dPag7hBCJnywtdToDmz6depfXsf3FzmZNlyllEvxlOs1JSJiTkDAPQcL830LClIDEd0lInE9CImNKg3PYZ5SpKiBmi2vikJgVB0QCC+oHU3bTcXVbTLiL7G+34NFeR5zqjpKYocQ3KjY9Dg86HurzqXOi7it+38N05L2z2u8Nfz748uAWcsPhhxuvGHfb4B3CQYu9dd+qQ4MDA7/iyJ0bG25NwwOe9D+a8qzfZW5kc3RyZWFtIAplbmRvYmogCjIzIDAgb2JqIAo8PCAKL0xlbmd0aCAyOTggCi9GaWx0ZXIgWyAvRmxhdGVEZWNvZGUgXSAKPj4gCnN0cmVhbQp4nGXRzWrDMAwA4HueQseOHRw7/QuUwEgvPXQbDdvdsZUSaBzjpIe+/Sw5K4wFYvBnyUiyqE/Hk+tnEJ9hNA3O0PXOBpzGezAILV57B1KB7c287Hg1g/YgYnLzmGYcTq4b4XDIxCUeTnN4wOqNvuPr+fJdjxal2p9fQHwEi6F3V1h91U3cN3fvbzigmyGHqgKLXSbqs/bvekAQ/+/gCLnUEG3y2mDQ7opwUHkVF1MBOvv3LJNFSmm7tF9iaclzU1YRJIFkWEsCRaAYCoaCoEiQE6wJ1gxbS7Ah2KRLW4ItwTYBR+wIdgyKYU+wZ9gUBCVBmepg0AQ6RSiClqBNwHWYpW9KiZfG9n/7pEnQSz1Hau4hxGnzc/KgaaC9w+eL+9HT/OjPfgBAVpgBZW5kc3RyZWFtIAplbmRvYmogCjI2IDAgb2JqIAo8PCAKL0xlbmd0aCA4ODcgCi9MZW5ndGgxIDE5NDAgCi9GaWx0ZXIgWyAvRmxhdGVEZWNvZGUgXSAKPj4gCnN0cmVhbQp4nK1TQWsTQRT+JrtJW43VKIoSlF3SatFdtStIKR5iTQtaqrFV2RWNhm7aVBobtIpalV68LCo9BRUP+g+milI8FQ8S8ObRKih6t4coWLDxze42atpIBWeZme+9me+9b+bNggFYhXFISB7p22WcTp1sBdgEeQ/359J5hGdThN9R1/ovjypYTwiBJjEM5Adzgx312wi2EOfo4PDVgck39zcCMu0PTGUzafv9w8txWjNp/94sOdbcCx0i+wPZTdnc6JXIK4yRXU/2zuGR/nTQll+Q3Ub2llz6Sj6wLXCbYslkK+fTuUzHt8/dgPSI9rTnRy6Okm6D7OtiPX8hk+fYQVB6KAbqzB2BMGQoNMv00YlntXKZRqVcXv1R2JRhK8aoY6mOgj//2TZgNw7Bxk3cwxNM4y1KrJG1sA52ys3sKvhx/NOzM6v3fUVUdklPv1xz5+KD13fELN8Ji6nBU+EpYSUECaygzxu92WClMIJsoVXL6ek9oSA+q8xqbsQVYc/NxOGFHYp7+VDN9HI3snY0LjDcfAhQTV1MNefQunlD0pxk7K41xcq3eGLzZIN0JqVzpilK51CCs7M6D2icbVd1LmlKF5eau3rNmKU4inPQdpQuJZu2udzszrSQcaxdCkefOUTjMVPlcStagRnLate5LMLIbhjHogDn/ADn3ADE/6HzoNatcGlr0jxq8vFElMcTVlRVlU4+nTT5dCKqWpbOQxWNNN8Y2uiprdN4aLvO670IfcQnuuU4nhVT+bTjRB06gW9PMVQ74r876MSdU2w86a6Mx9SocMTUmEqKrITOG7TuPrOTJKmWDv+Fes1Y9Log7ly8ZdRjwK+JhLWV+siE1/o4RKhJRJNFLZuw18cBquhJH0vkz/pYJnzbxyHCfL9oiR30hA6M2JlWo61nOR7sr3wJktqDXpzAAYzQP5FBK52pzfVlMIhLGEYaF5bF+F97xAMek5+zx8EZOmsdXVxEjQTV9Sp7PP+WbZovsXBwZn6GNW/4vlALlgrD3bsSWBeJRfb43baLRtEIo4RfvcKZWMxRqRtGwWCaXU3yOKU/OWqFw7QCS1WTPM7Lv3EWJaqZR+grFtlEYW7Rgf7Kse0lOd4LtL2M69x9Vffzstb9zNmkfGkNEzU1aMvV/Vuef6rDQh5jroa2GrUrUOFq1qHmG5lbgvITUuNMj2VuZHN0cmVhbSAKZW5kb2JqIAoyIDAgb2JqIAo8PCAKL1R5cGUgL1BhZ2VzIAovS2lkcyBbIDggMCBSIF0gCi9Db3VudCAxIAovTWVkaWFCb3ggMyAwIFIgCi9Dcm9wQm94IDQgMCBSIAo+PiAKZW5kb2JqIAozIDAgb2JqIApbIDAgMCAyMTYgMjg4IF0gCmVuZG9iaiAKNCAwIG9iaiAKWyAwIDAgMjE2IDI4OCBdIAplbmRvYmogCjYgMCBvYmogCjw8IAovUHJvY1NldCA3IDAgUiAKL0ZvbnQgPDwgCi85IDkgMCBSICAKL2EgMTAgMCBSICAKL2IgMTEgMCBSICAKPj4gCj4+IAplbmRvYmogCjcgMCBvYmogClsgL1BERiAvVGV4dCAgXSAKZW5kb2JqIAo4IDAgb2JqIAo8PCAKL1R5cGUgL1BhZ2UgCi9QYXJlbnQgMiAwIFIgCi9SZXNvdXJjZXMgNiAwIFIgCi9Db250ZW50cyBbIDUgMCBSIF0gCj4+IAplbmRvYmogCjkgMCBvYmogCjw8IAovVHlwZSAvRm9udCAKL1N1YnR5cGUgL1RydWVUeXBlIAovQmFzZUZvbnQgL0FBQUFBQitBcmlhbCxCb2xkIAovRmlyc3RDaGFyIDMyIAovTGFzdENoYXIgNTYgCi9XaWR0aHMgMTIgMCBSIAovRm9udERlc2NyaXB0b3IgMTQgMCBSIAovVG9Vbmljb2RlIDEzIDAgUiAKPj4gCmVuZG9iaiAKMTAgMCBvYmogCjw8IAovVHlwZSAvRm9udCAKL1N1YnR5cGUgL1RydWVUeXBlIAovQmFzZUZvbnQgL0FBQUFBRCtNUlZDb2RlMTI4TSAKL0ZpcnN0Q2hhciAzMiAKL0xhc3RDaGFyIDQ0IAovV2lkdGhzIDIyIDAgUiAKL0ZvbnREZXNjcmlwdG9yIDI0IDAgUiAKL1RvVW5pY29kZSAyMyAwIFIgCj4+IAplbmRvYmogCjExIDAgb2JqIAo8PCAKL1R5cGUgL0ZvbnQgCi9TdWJ0eXBlIC9UcnVlVHlwZSAKL0Jhc2VGb250IC9BQUFBQUYrQXJpYWwgCi9GaXJzdENoYXIgMzIgCi9MYXN0Q2hhciA0MSAKL1dpZHRocyAxNyAwIFIgCi9Gb250RGVzY3JpcHRvciAxOSAwIFIgCi9Ub1VuaWNvZGUgMTggMCBSIAo+PiAKZW5kb2JqIAoxMiAwIG9iaiAKWyAKMjc4IAozMzMgCjU1NiAKODg5IAozMzMgCjk0NCAKNTU2IAozODkgCjYxMSAKNjExIAo2MTEgCjU1NiAKNjY3IAo1NTYgCjYxMSAKMjc4IAo1NTYgCjI3OCAKNzIyIAo3MjIgCjU1NiAKMjc4IAo2NjcgCjcyMiAKMjc4IApdIAplbmRvYmogCjE0IDAgb2JqIAo8PCAKL1R5cGUgL0ZvbnREZXNjcmlwdG9yIAovQXNjZW50IDkwNSAKL0NhcEhlaWdodCA1MDAgCi9EZXNjZW50IC0yMTIgCi9GbGFncyA0IAovRm9udEJCb3ggMTUgMCBSIAovRm9udE5hbWUgL0FBQUFBQitBcmlhbCxCb2xkIAovSXRhbGljQW5nbGUgMAovU3RlbVYgMCAKL1N0ZW1IIDAgCi9BdmdXaWR0aCA0NzkgCi9Gb250RmlsZTIgMTYgMCBSIAovTGVhZGluZyAwIAovTWF4V2lkdGggMjYyOCAKL01pc3NpbmdXaWR0aCA0NzkgCi9YSGVpZ2h0IDAgCj4+IAplbmRvYmogCjE1IDAgb2JqIApbIC02MjggLTM3NiAyMDAwIDEwNTYgXSAKZW5kb2JqIAoxNyAwIG9iaiAKWyAKNjY3IAo1NTYgCjU1NiAKNTU2IAo1NTYgCjMzMyAKNjY3IAo3MjIgCjcyMiAKNjY3IApdIAplbmRvYmogCjE5IDAgb2JqIAo8PCAKL1R5cGUgL0ZvbnREZXNjcmlwdG9yIAovQXNjZW50IDkwNSAKL0NhcEhlaWdodCA1MDAgCi9EZXNjZW50IC0yMTIgCi9GbGFncyA0IAovRm9udEJCb3ggMjAgMCBSIAovRm9udE5hbWUgL0FBQUFBRitBcmlhbCAKL0l0YWxpY0FuZ2xlIDAKL1N0ZW1WIDAgCi9TdGVtSCAwIAovQXZnV2lkdGggNDQxIAovRm9udEZpbGUyIDIxIDAgUiAKL0xlYWRpbmcgMCAKL01heFdpZHRoIDI2NjUgCi9NaXNzaW5nV2lkdGggNDQxIAovWEhlaWdodCAwIAo+PiAKZW5kb2JqIAoyMCAwIG9iaiAKWyAtNjY1IC0zMjUgMjAwMCAxMDQwIF0gCmVuZG9iaiAKMjIgMCBvYmogClsgCjUzNyAKNTM3IAo1MzcgCjUzNyAKNTM3IAo1MzcgCjE0NiAKNTM3IAo1MzcgCjUzNyAKNTM3IAo1MzcgCjUzNyAKXSAKZW5kb2JqIAoyNCAwIG9iaiAKPDwgCi9UeXBlIC9Gb250RGVzY3JpcHRvciAKL0FzY2VudCAzMDAwIAovQ2FwSGVpZ2h0IDUwMCAKL0Rlc2NlbnQgMCAKL0ZsYWdzIDQgCi9Gb250QkJveCAyNSAwIFIgCi9Gb250TmFtZSAvQUFBQUFEK01SVkNvZGUxMjhNIAovSXRhbGljQW5nbGUgMAovU3RlbVYgMCAKL1N0ZW1IIDAgCi9BdmdXaWR0aCA1MzcgCi9Gb250RmlsZTIgMjYgMCBSIAovTGVhZGluZyAwIAovTWF4V2lkdGggMTEzOCAKL01pc3NpbmdXaWR0aCA1MzcgCi9YSGVpZ2h0IDAgCj4+IAplbmRvYmogCjI1IDAgb2JqIApbIDAgMCAxMTM4IDMwMDAgXSAKZW5kb2JqIAoyNyAwIG9iaiAKKFBvd2VyZWQgQnkgQ3J5c3RhbCkgCmVuZG9iaiAKMjggMCBvYmogCihDcnlzdGFsIFJlcG9ydHMpIAplbmRvYmogCjI5IDAgb2JqIAo8PCAKL1Byb2R1Y2VyIChQb3dlcmVkIEJ5IENyeXN0YWwpICAKL0NyZWF0b3IgKENyeXN0YWwgUmVwb3J0cykgIAo+PiAKZW5kb2JqIAp4cmVmIAowIDMwIAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTcgMDAwMDAgbiAKMDAwMDAyNDM0NyAwMDAwMCBuIAowMDAwMDI0NDQ2IDAwMDAwIG4gCjAwMDAwMjQ0ODAgMDAwMDAgbiAKMDAwMDAwMDE5NCAwMDAwMCBuIAowMDAwMDI0NTE0IDAwMDAwIG4gCjAwMDAwMjQ2MDQgMDAwMDAgbiAKMDAwMDAyNDYzOCAwMDAwMCBuIAowMDAwMDI0NzMwIDAwMDAwIG4gCjAwMDAwMjQ5MDYgMDAwMDAgbiAKMDAwMDAyNTA4NCAwMDAwMCBuIAowMDAwMDI1MjU2IDAwMDAwIG4gCjAwMDAwMDA1MzUgMDAwMDAgbiAKMDAwMDAyNTQwNSAwMDAwMCBuIAowMDAwMDI1Njg0IDAwMDAwIG4gCjAwMDAwMDA5OTkgMDAwMDAgbiAKMDAwMDAyNTcyNyAwMDAwMCBuIAowMDAwMDEzMTkyIDAwMDAwIG4gCjAwMDAwMjU4MDEgMDAwMDAgbiAKMDAwMDAyNjA3NSAwMDAwMCBuIAowMDAwMDEzNTUwIDAwMDAwIG4gCjAwMDAwMjYxMTggMDAwMDAgbiAKMDAwMDAyMjk4MSAwMDAwMCBuIAowMDAwMDI2MjA3IDAwMDAwIG4gCjAwMDAwMjY0ODUgMDAwMDAgbiAKMDAwMDAyMzM2MiAwMDAwMCBuIAowMDAwMDI2NTIyIDAwMDAwIG4gCjAwMDAwMjY1NjIgMDAwMDAgbiAKMDAwMDAyNjU5OSAwMDAwMCBuIAp0cmFpbGVyIAo8PCAKL1NpemUgMzAgCi9Sb290IDEgMCBSIAovSW5mbyAyOSAwIFIgCj4+IApzdGFydHhyZWYgCjI2Njg3IAolJUVPRg0K"
    // this.fileName = "abc";
    // if (this.base64String != null && this.base64String != "") {
    //   this.base64String = 'data:application/pdf;base64,' + this.base64String;
    //   this.displayPDF = true;
    //   this.commonservice.refreshDisplyPDF(true);
    // } else {
    //   this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
    // }
  }
  /**
  * handel print click, validate data print data api call.
  */
  callPrintingService(numberOfContainers: any, nuberOfCopies: any) {
    this.showLoader = true;
    this.commonservice.printingServiceForContainer(numberOfContainers, nuberOfCopies).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          console.log("" + data);
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.Detail != null && data.Detail != undefined && data.Detail[0] != null
            && data.Detail[0] != undefined) {
            this.fileName = data.Detail[0].FileName;
            this.base64String = data.Detail[0].Base64String;
          }
          if (this.base64String != null && this.base64String != "") {
            this.base64String = 'data:application/pdf;base64,' + this.base64String;
            this.displayPDF = true;
            this.commonservice.refreshDisplyPDF(true);

          } else {
            this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
          }

          console.log("filename:" + this.fileName);
          console.log("filename:" + this.base64String);
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
  PrintClick($event) {
    if (this.numberOfCopies != "" && this.noOfContainers != "") {
      //api call
      this.showPrintDialog = false;
      this.callPrintingService(this.noOfContainers, this.numberOfCopies)
    } else {
      this.toastr.error('', this.translate.instant("EnterFields"));
    }
    console.log("event");

  }

  close_kendo_dialog() {
    this.showPrintDialog = false;
  }

  GetSampleStringOfContainerCode() {
    this.showLoader = true;
    this.containerCreationService.GetSampleOfContainerString().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          console.log("" + data);
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.containerCodePlaceholder = data;
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



  updateAddLookupData(serviceData): any[] {
    for (var i = 0; i < serviceData.length; i++) {
      serviceData[i].QtyAdded = Number("0").toFixed(Number(localStorage.getItem("DecimalPrecision")));
      serviceData[i].BalQty = Number(serviceData[i].OPTM_PARTS_PERCONT);
      if (this.oSubmitModel.OtherItemsDTL != undefined) {
        let row = this.oSubmitModel.OtherItemsDTL.find(e => e.OPTM_ITEMCODE == serviceData[i].ITEMCODE)
        if (row != undefined) {
          serviceData[i].QtyAdded = Number(row.OPTM_QUANTITY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          if (this.autoRuleId != '' && this.autoRuleId != undefined) {
            serviceData[i].BalQty = Number(serviceData[i].OPTM_PARTS_PERCONT) - Number(row.OPTM_QUANTITY);
          }          
        }
      }
      serviceData[i].BalQty = Number(serviceData[i].BalQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));
      serviceData[i].OPTM_PARTS_PERCONT_VAL = Number(serviceData[i].OPTM_PARTS_PERCONT).toFixed(Number(localStorage.getItem("DecimalPrecision")));
      // if (serviceData[i].OPTM_TRACKING == 'B') {
      //   serviceData[i].OPTM_TRACKING_VALUE = this.translate.instant("Batch");
      // } else if (serviceData[i].OPTM_TRACKING == 'S') {
      //   serviceData[i].OPTM_TRACKING_VALUE = this.translate.instant("Serial");
      // } else {
      //   serviceData[i].OPTM_TRACKING_VALUE = this.translate.instant("None");
      // }
    }
    return serviceData;
  }

  ShowItemLookup() {
    if (this.radioSelected == 1) {
      this.GetScanItem();
    } else if (this.radioSelected == 2) {
      this.showLookup = true;
      this.lookupfor = "ContItems";
      for (var i = 0; i < this.oSubmitModel.OtherItemsDTL.length; i++) {
        this.oSubmitModel.OtherItemsDTL[i].OPTM_QUANTITY_VAL = Number(this.oSubmitModel.OtherItemsDTL[i].OPTM_QUANTITY).toFixed(Number(localStorage.getItem("DecimalPrecision")))
        if (this.oSubmitModel.OtherItemsDTL[i].OPTM_TRACKING == 'B') {
          this.oSubmitModel.OtherItemsDTL[i].OPTM_TRACKING_VALUE = this.translate.instant("Batch");
        } else if (this.oSubmitModel.OtherItemsDTL[i].OPTM_TRACKING == 'S') {
          this.oSubmitModel.OtherItemsDTL[i].OPTM_TRACKING_VALUE = this.translate.instant("Serial");
        } else {
          this.oSubmitModel.OtherItemsDTL[i].OPTM_TRACKING_VALUE = this.translate.instant("None");
        }
      }
      this.serviceData = this.oSubmitModel.OtherItemsDTL;
    } else {

    }
  }

  ShowContBatchSerList() {
    if ((this.scanItemCode == undefined || this.scanItemCode == "")) {
      this.toastr.error('', this.translate.instant("BtchSrNBlank"));
      this.scanBSrLotNo = ''
      return;
    }

    if (this.itemQty == 0 || this.itemQty == undefined) {
      this.toastr.error('', this.translate.instant("ItemQtyBlankMsg"));
      return;
    }

    if (this.radioSelected == 1) {
      this.GetBatchSerial();
    } else {
      this.showLookup = true;
      this.lookupfor = "showContBatchSerialList";
      //this.oSubmitModel.OtherBtchSerDTL = this.oSubmitModel.OtherBtchSerDTL.filter(e => e.OPTM_ITEMCODE == this.scanItemCode);
      //this.serviceData = this.oSubmitModel.OtherBtchSerDTL;
      this.serviceData = this.oSubmitModel.OtherBtchSerDTL.filter(e => e.OPTM_ITEMCODE == this.scanItemCode);
    }
  }

}

