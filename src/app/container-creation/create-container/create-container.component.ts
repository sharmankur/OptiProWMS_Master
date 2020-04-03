import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { ContainerCreationService } from '../../services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonData } from '../../models/CommonData';
import { CARMasterService } from '../../services/carmaster.service';
import { CcmainComponent } from '../ccmain/ccmain.component';
import { CTRMasterService } from 'src/app/services/ctrmaster.service';

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
  parentContainerType: any = '';
  commonData: any = new CommonData(this.translate);
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
  purpose: string = "";//Shipping";
  noOfPackToGen: number = 1;
  oSaveModel: any = {};
  fromType: string = "";
  soNumber: string = "";
  packType: number = 0
  batchSerialData: any = [];
  lookupData: any = [];
  selectedBatchSerial: any = [];
  partPerQty: any;
  qtyAdded: any;
  workOrder: any = "";
  operationNo: any = "";
  taskId: any = "";
  ProducedQty:any='';
  PassedQty:any='';
  RejectedQty:any='';
  NCQty:any='';
  IsWIPCont : boolean = false;
  SelectedWOItemCode: any= '';
  partsQty: any = 0;
  RemQtyWO: any = 0;
  ContStatus: any = "";
  ParentCTAray: any = [];
  ParentPerQty: any = 0;
  IsDisableRule: boolean = true;
  IsDisableParentCT : boolean = false;

  dialogMsg: string = ""
  yesButtonText: string = "";
  noButtonText: string = "";
  inputDialogFor: any;
  titleMessage: any;
  showInputDialogFlag: boolean = false;
  statusArray: any = [];

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router, private carmasterService: CARMasterService,
    private ccmain: CcmainComponent, private ctrmasterService: CTRMasterService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
      this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
      this.createModeArray = this.commonData.container_creation_create_mode_string_dropdown();
      this.statusArray = this.commonData.Container_Shipment_Status_DropDown();
      this.ContStatus = this.translate.instant("CStatusNew");
      if(this.IsWIPCont){
        this.createModeArray = this.createModeArray.filter(val => val.Name != this.translate.instant("Manual"));
      }
      else{
        this.createModeArray = this.createModeArray.filter(val => val.Name != this.translate.instant("Manual_Rule_Based"));
      }
    });
  }

  ngOnInit() {
    //console.log("ngOnInit");
    localStorage.setItem("FromWhere", "");
    localStorage.setItem("ContainerOperationData", "");
    if (window.location.href.indexOf("WIP") > -1) {
      this.IsWIPCont = true;
    }
    else {
      this.IsWIPCont = false;
      this.taskId = 1;
    }
    this.ccmain.ccComponent = 1;
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.createModeArray = this.commonData.container_creation_create_mode_string_dropdown();    
    this.statusArray = this.commonData.Container_Shipment_Status_DropDown();
    this.defaultPurpose = this.purposeArray[0];
    this.defaultCreateMode = this.createModeArray[0];
    this.purpose = this.defaultPurpose.Name;
    this.createMode = this.defaultCreateMode.Value;
    this.ContStatus = this.translate.instant("CStatusNew");
    // this.GetContainerNumber();  
    
    if(this.IsWIPCont){
      this.createModeArray = this.createModeArray.filter(val => val.Name != this.translate.instant("Manual"));
      this.IsDisableParentCT = true;
      this.IsDisableRule = false;
    }
    else{
      this.createModeArray = this.createModeArray.filter(val => val.Name != this.translate.instant("Manual_Rule_Based"));
      this.IsDisableParentCT = false;
      if(this.createMode == 1){
        this.IsDisableRule = false;
      }
      else{
        this.IsDisableRule = true;
      }
    }
  }

  getParentContainerType(action){  

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
            // this.serviceData = this.serviceData.filter(function(obj){
            //   obj.OPTM_CONTAINER_TYPE = obj.OPTM_PARENT_CONTTYPE;
            //   return obj;
            // });
            this.showLookup = true;          
            this.lookupfor = "ParentCTList";
           // this.fromType = 'parent';
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
    this.autoPackRule = '';
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

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
    localStorage.setItem("ContainerOperationData", "");
  }

  // getLookupValue($event) {
  //   this.showOtherLookup = false;
  //   this.showLookup = false;
  //   if ($event != null && $event == "close") {
  //     //nothing to do
  //     return;
  //   }
  //   else {
  //     if (this.lookupfor == "CTList") {
  //       if (this.fromType == 'child') {
  //         this.containerType = $event[0];
  //         this.length = $event[2];
  //         this.width = $event[3];
  //         this.height = $event[4];
  //         this.maxWeigth = $event[5];
  //         this.parentContainerType = '';
  //         // this.containerWeigth = $event[0];         
  //       } 
  //       // else {
  //       //   this.parentContainerType = $event[0];
  //       // }

  //       // if (this.containerType == this.parentContainerType) {
  //       //   this.toastr.error('', this.translate.instant("ParentContCannoSame"));
  //       //   this.parentContainerType = '';
  //       // }
  //     } 
  //     else if(this.lookupfor == "ParentCTList"){
  //       this.parentContainerType = $event[1];
  //       this.ParentPerQty = $event[2];
  //     }
  //     else if (this.lookupfor == "CARList") {
  //       this.autoPackRule = $event[0];
  //       this.autoRuleId = $event[0];
  //       this.packType = $event[2];
  //       this.partsQty = $event[10];        
  //       this.CheckScanAndCreateVisiblity(this.autoPackRule);
  //       this.IsValidContainerAutoRule(this.autoPackRule, $event[1], this.packType);
  //       // this.GetTotalWeightBasedOnRuleID();
  //     } else if (this.lookupfor == "WareHouse") {
  //       this.whse = $event[0];
  //       this.binNo = "";
  //     } else if (this.lookupfor == "BinList") {
  //       this.binNo = $event[0];
  //       this.GetInventoryData();
  //     } else if (this.lookupfor == "SOList") {
  //       this.soNumber = $event[0];
  //     } else if (this.lookupfor == "GroupCodeList") {
  //       this.containerGroupCode = $event[0];
  //     } else if (this.lookupfor == "ContainerIdList") {
  //       for (var i = 0; i < this.fromContainerDetails.length; i++) {
  //         if ($event[2] == this.fromContainerDetails[i].OPTM_ITEMCODE) {
  //           this.fromContainerDetails[i].OPTM_CONTAINERID = $event[0];
  //         }
  //       }
  //       this.GetListOfBatchSerOfSelectedContainerID($event[0], $event[2])
  //     } else if (this.lookupfor == "WOLIST") {
  //       this.workOrder = $event[0];
  //       this.taskId = $event[6];
  //       this.operationNo = $event[1];
  //       this.ProducedQty = $event[7];
  //       this.PassedQty = $event[8];
  //       this.RejectedQty = $event[9];
  //       this.NCQty = $event[10];
  //       this.SelectedWOItemCode = $event[3];
  //       this.itemCode = this.SelectedWOItemCode;
  //       this.RemQtyWO = $event[11];

  //       this.fromContainerDetails = [];
  //       this.selectedBatchSerial = [];
  //     }
  //   }
  // }

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
    this.purpose = "Shipping";
    this.noOfPackToGen = 1;
    this.selectedBatchSerial = [];
    this.oSaveModel = {};
    this.containerGroupCode = ''
    this.containerCode = ""
    this.containerId = ""
    this.soNumber = "";
    this.parentContainerType = "";
    // this.fromContainer = false;
    this.workOrder = "";
    this.taskId = "";
    this.operationNo = "";
    this.ContStatus = this.translate.instant("CStatusNew");
  }

  showParentInputDialogFlag: boolean = false;
  showCreateParentContnrDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.inputDialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.showInputDialogFlag = false;
    this.showParentInputDialogFlag = true;
    this.titleMessage = msg;
  }

  onScanAndCreateClick() {
    if (!this.validateFields()) {
      return;
    }

    if(!this.IsWIPCont){
      for(let widx=0; widx<this.fromContainerDetails.length; widx++){
        if(this.fromContainerDetails[widx].OPTM_TRACKING == 'S'){
          this.toastr.error('', this.translate.instant("CannotScanCreate"));
          return;
        }
      }
    }

    this.prepareSaveModel(this.autoPackRule, this.containerId,
      this.containerType, this.autoClose, this.autoRuleId, this.whse, this.binNo, this.maxWeigth,
      localStorage.getItem("UserId"), "", this.itemCode, this.action, this.parentContainerCode, this.itemPackQty,
      this.width, this.height, this.containerWeigth, this.createMode, "");

    this.showInputDialog("ScanAndCreate", this.translate.instant("Confirm"), this.translate.instant("Cancel"),
      this.translate.instant("ConfirmContainerCode"));
  }

  // dialogMsg: string = ""
  // yesButtonText: string = "";
  // noButtonText: string = "";
  // inputDialogFor: any;
  // titleMessage: any;
  // showInputDialogFlag: boolean = false;
  showInputDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.inputDialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.showInputDialogFlag = true;
    this.titleMessage = msg;
  }

  getInputDialogValue($event) {
    this.showInputDialogFlag = false;
    this.showParentInputDialogFlag = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("ScanAndCreate"):
          this.containerId = ($event.ContainerId == undefined || '' || null ) ? this.containerId : $event.ContainerId;
          this.containerCode = ($event.ContainerCode == undefined || '' || null ) ? this.containerCode : $event.ContainerCode;;
          this.parentContainerCode = $event.ParentContainerCode;
          this.count = $event.Count;
          //this.toastr.success('', this.translate.instant("ContainerCreatedSuccessMsg"));
          this.selectedBatchSerial = [];
          this.ContStatus = this.setContainerStatus($event.ContnrStatus);
          // this.GetContainerNumber();
          this.GetInventoryData()

          if(this.IsWIPCont){
            this.GetDataofSelectedTask();
          }
          break;

          case ("CreateParentContainer"):
         // alert(1);
          break;
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
    if (this.purpose == "Shipping") {
      purps = "Y"
    } else {
      purps = "N"
    }    


    //Push data of header table into BatchSerial model
    this.oSaveModel.HeaderTableBindingData.push({
      OPTM_SONO: this.soNumber,
      OPTM_CONTAINERID: containerId,
      OPTM_CONTTYPE: containerType,
      OPTM_CONTAINERCODE: "" + containerCode,
      OPTM_WEIGHT: this.containerWeigth,
      OPTM_AUTOCLOSE_ONFULL: ((this.autoClose == true) ? 'Y' : 'N'),
      OPTM_AUTORULEID: autoRuleId,
      OPTM_WHSE: whse,
      OPTM_BIN: binNo,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: '',
      Length: length,
      Width: width,
      Height: height,
      ItemCode: "",
      NoOfPacks: "1",
      OPTM_TASKID: 0, //change
      CompanyDBId: localStorage.getItem("CompID"),
      Username: localStorage.getItem("UserId"),
      UserId: localStorage.getItem("UserId"),
      GUID: localStorage.getItem("GUID"),
      Action: "N",
      OPTM_PARENTCODE: parentCode,
      OPTM_GROUP_CODE: this.containerGroupCode,
      OPTM_CREATEMODE: createMode,
      OPTM_PERPOSE: purps,
      OPTM_FUNCTION: "Shipping",
      OPTM_OBJECT: "Container",
      OPTM_WONUMBER: this.workOrder,
      OPTM_TASKHDID: this.taskId,
      OPTM_OPERATION: this.operationNo,
      OPTM_QUANTITY: this.IsWIPCont ? (Number(this.partsQty).toFixed(Number(localStorage.getItem("DecimalPrecision")))) : 0,
      OPTM_SOURCE: this.IsWIPCont ? 1 : 3,    
      OPTM_ParentContainerType: this.parentContainerType,
      OPTM_ParentPerQty: this.ParentPerQty,  
      IsWIPCont: this.IsWIPCont     
    });

    if(this.fromContainerDetails.length > 0){
      for (var i = 0; i < this.fromContainerDetails.length; i++) {
        this.oSaveModel.OtherItemsDTL.push({
          OPTM_ITEMCODE: this.fromContainerDetails[i].OPTM_ITEMCODE,
          OPTM_QUANTITY: Number(this.fromContainerDetails[i].QuantityToAdd).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
          OPTM_CONTAINER: "",
          OPTM_AVLQUANTITY: 0,
          OPTM_INVQUANTITY: 0,
          OPTM_BIN: '',
          OPTM_CONTAINERID: this.fromContainerDetails[i].OPTM_CONTAINERID,
          OPTM_TRACKING: this.fromContainerDetails[i].OPTM_TRACKING,
          OPTM_WEIGHT: (this.fromContainerDetails[i].IWeight1 == null || this.fromContainerDetails[i].IWeight1 == undefined) ? 1 : this.fromContainerDetails[i].IWeight1
        });
      }
  
      for (var i = 0; i < this.selectedBatchSerial.length; i++) {
        this.oSaveModel.OtherBtchSerDTL.push({
          OPTM_BTCHSER: this.selectedBatchSerial[i].LOTNO,
          OPTM_QUANTITY: Number(this.selectedBatchSerial[i].QuantityToAdd).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
          OPTM_ITEMCODE: this.selectedBatchSerial[i].ITEMCODE
        });
      }
    }    
  }

  onBuildParentContClick(){
    this.showCreateParentContnrDialog("CreateParentContainer", this.translate.instant("Confirm"), this.translate.instant("Cancel"),
    this.translate.instant("Parent_Cont"));
  }

  onWorkOrderChangeBlur() {

    if(this.workOrder == '' || this.workOrder == undefined){
      return;
    }

    this.showLoader = true;
    this.commonservice.IsValidWONumber(this.workOrder).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length <= 0) {  
            this.workOrder = '';
            this.whse = '';
            this.binNo = '';
            this.toastr.error('', this.translate.instant("InvalidWONo"));
          } 
          else{
            this.onWhseChange();
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

  GetDataofSelectedTask(){
    this.showLoader = true;
    this.containerCreationService.GetDataofSelectedTask(this.taskId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {  
           this.ProducedQty = data[0].OPTM_QTYPRODUCED;
           this.PassedQty  = data[0].OPTM_QTYACCEPTED;
           this.RejectedQty = data[0].OPTM_QTYREJECTED;
           this.NCQty = data[0].OPTM_NCQTY;
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

  onCreateClick(event) {
    if (!this.validateFields()) {
      return;
    }

    this.prepareSaveModel(this.autoPackRule, this.containerId,
      this.containerType, this.autoClose, this.autoRuleId, this.whse, this.binNo, this.maxWeigth,
      localStorage.getItem("UserId"), "", this.itemCode, this.action, "", this.itemPackQty,
      this.width, this.height, this.containerWeigth, this.createMode, "");

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

          if (data.length > 0) {

            if(data[0].ErrMsg != undefined && data[0].ErrMsg != null){
              this.toastr.error('', this.translate.instant("GreaterOpenQtyCheck"));
              return;
            }

            if(data[0].RESULT != undefined && data[0].RESULT != null){
              this.toastr.error('', data[0].RESULT);
              return;
            }

            this.toastr.success('', this.translate.instant("ContainerCreatedSuccessMsg"));
            // this.onResetClick();
            this.GetInventoryData();
            this.containerId = data[0].OPTM_CONTAINERID;
            this.containerCode = data[0].OPTM_CONTCODE;
            this.ContStatus = this.setContainerStatus(data[0].OPTM_STATUS);
            this.selectedBatchSerial = [];
            if(this.IsWIPCont){
              // this.ProducedQty = parseFloat(this.ProducedQty) + parseFloat(this.partsQty);
              // this.PassedQty = parseFloat(this.ProducedQty);
              this.GetDataofSelectedTask();
            }
            
            // this.GetContainerNumber();
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

  setContainerStatus(status) {
    return this.statusArray[Number(status) - 1].Name;   
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

    if(this.createMode != 3){
      if (this.autoPackRule == undefined || this.autoPackRule == "") {
        this.toastr.error('', this.translate.instant("SelectAutoPackMsg"));
        return false;
      }
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

    if(this.fromContainerDetails.length > 0){

      if(this.IsWIPCont && this.fromContainerDetails.length == 1 && this.fromContainerDetails[0].OPTM_ITEMCODE == this.SelectedWOItemCode){
        //console.log("WIP - Single Item same as WO Item");
      }
      else{
        for (var i = 0; i < this.fromContainerDetails.length; i++) {          

          if(!this.IsWIPCont || (this.IsWIPCont && this.fromContainerDetails[i].OPTM_ITEMCODE != this.SelectedWOItemCode)){
            if (this.fromContainerDetails[i].QuantityToAdd != this.fromContainerDetails[i].OPTM_PARTS_PERCONT) {
              this.toastr.error('', this.translate.instant("AddedQtyValid"));
              return false;
            }
      
            if (this.fromContainerDetails[i].OPTM_TRACKING == "N") {
              if (parseFloat(this.fromContainerDetails[i].QuantityToAdd) > parseFloat(this.fromContainerDetails[i].AvlQty)) {
                this.toastr.error('', this.translate.instant("ITEMQtyValidMSG"));
                return false;
              }
            }
          } 
          else{
           // console.log("WIP - Muliple Item and same as WO Item");
          }        
        }
      }      
    }     
    else if(this.createMode == 1){
      this.toastr.error('', this.translate.instant("Inv_Items_Mandatory"));
      return false;
    }    

    // for (var i = 0; i < this.fromContainerDetails.length; i++) {
    //   if (this.fromContainerDetails[i].OPTM_TRACKING == "N") {
    //     if (this.fromContainerDetails[i].QuantityToAdd > this.fromContainerDetails[i].AvlQty) {
    //       this.toastr.error('', this.translate.instant("ITEMQtyValidMSG"));
    //       return false;
    //     }
    //   }
    // }
    return true;
  }

  onCheckChange(event) {
    this.autoClose = !this.autoClose;
    // if(this.autoClose){
    //   this.ContStatus = this.translate.instant("CClosedNew");
    // }
    // else{
    //   this.ContStatus = this.translate.instant("CStatusNew");
    // }
    //console.log("onCheckChange: " + ((this.autoClose == true) ? 'Y' : 'N'))
  }

  fromContainer: boolean = false
  onFromContainerCheckChange() {
    this.fromContainer = !this.fromContainer;
    this.GetInventoryData();
  }

  getAutoPackRule() {

    if (this.whse == undefined || this.whse == "" || this.binNo == undefined || this.binNo == "") {
      this.toastr.error('', this.translate.instant("EnterWHSEandBin"));
      return;
    }

    if (this.containerType == undefined || this.containerType == "") {
      this.toastr.error('', this.translate.instant("SelectContainerMsg"));
      return;
    }

    if(this.IsWIPCont){
      if (this.workOrder == undefined || this.workOrder == "" || this.workOrder == null ) {
        this.toastr.error('', this.translate.instant("SelectWOMsg"));
        return;
      }
      this.showLoader = true;
      this.commonservice.GetDataForContainerAutoRuleWIP(this.containerType,this.SelectedWOItemCode, this.createMode).subscribe(
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
    else{
    
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
    this.purpose = event.Name;
  }

  onCreateModeSelectChange(event) {
    this.createMode = event.Value;
    this.soNumber = '';
    // if(!this.IsWIPCont){ //&& event.Name == this.translate.instant("Manual")
    //   this.IsDisableRule = true;
    // }
    // else{
    //   this.IsDisableRule = false;
    // }

    if(this.createMode == 3){
      this.IsDisableRule = true;
      this.autoClose = false; 
      //var check = document.getElementById("autoCloseWhenFull");     
      //check.checked = false;
      // check.setAttribute("checked","true");
      // check.removeAttribute("checked");
    }
    else{
      this.IsDisableRule = false;
    }

    this.autoPackRule = '';
    this.autoRuleId = '';
    this.packType = 0;
    this.partsQty = 0; 
    this.fromContainerDetails = [];
    this.parentContainerType = '';
  }

  onAutoPackRuleChangeBlur() {
    this.soNumber = '';
    
    if(this.autoPackRule == '' || this.autoPackRule == undefined){
      this.fromContainerDetails = [];
      return;
    }

    if(this.whse == '' || this.whse == undefined || this.binNo == '' || this.binNo == undefined ){
      this.autoPackRule = ""; this.autoRuleId = "" ;
      this.toastr.error('', this.translate.instant("EnterWHSEandBin"));
      return;
    }

    if (this.isValidateCalled) {
      return;
    }
    this.IsValidContainerAutoRule(this.autoRuleId, this.containerType, this.packType);
  }

  async IsValidContainerAutoRule(ruleId, ContType, packType) {
    if (packType == this.translate.instant("Shipping")) {
      packType = '1';
    } else if (packType == this.translate.instant("Internal")) {
      packType = '2';
    } else {
      packType = '3';
    }
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

          //Case Warehouse and if create mode is Manual/Manual Rule based then create blank container -
          if(!this.IsWIPCont && this.createMode != 1){          
            this.fromContainerDetails = [];
          }
          else{ 
             this.fromContainerDetails = data.OPTM_CONT_AUTORULEDTL; 

              //Case WIP and if create mode is Manual Rule based then only Work Order Item in Inventory Grid should be present-
              if(this.IsWIPCont && this.createMode == 2){  
                this.fromContainerDetails = this.fromContainerDetails.filter(val => val.OPTM_ITEMCODE == this.SelectedWOItemCode);
              }
                           
              for (var j = 0; j < this.fromContainerDetails.length; j++) {
                if(this.IsWIPCont && this.fromContainerDetails[j].OPTM_ITEMCODE == this.SelectedWOItemCode){
                  this.fromContainerDetails[j].QuantityToAdd = Number(this.partsQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));
                }            
                else{
                  this.fromContainerDetails[j].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
                }
                this.fromContainerDetails[j].OPTM_MIN_FILLPRCNT = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
                this.fromContainerDetails[j].AvlQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
              }            
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

    if((this.autoRuleId == '' || this.autoRuleId == undefined) && this.createMode != 3){
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

  onWhseChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.onWhseChange();
  }

  async onWhseChange() {
    if (this.whse == undefined || this.whse == "") {
      this.binNo = "";
      this.autoRuleId = ''; this.autoPackRule = "";
      this.soNumber = '';
      this.fromContainerDetails = [];
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
      this.autoRuleId = ''; this.autoPackRule = "";
      this.soNumber = '';
      this.fromContainerDetails = [];
      return;
    }

    if(this.whse == "" || this.whse == undefined){
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
        }
        else {
          this.binNo = resp[0].BinCode;
          this.GetInventoryData();
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
          this.serviceData = []
          this.batchSerialData = []
          this.selectedBatchSerial = []
          this.bsrListByContainerId = [];
          // this.fromContainerDetails = []
          if (data.IteWiseInventory != null && data.IteWiseInventory != undefined) {
            for (var j = 0; j < this.fromContainerDetails.length; j++) {
              
              if(this.IsWIPCont && this.fromContainerDetails[j].OPTM_ITEMCODE == this.SelectedWOItemCode){
                this.fromContainerDetails[j].QuantityToAdd = this.partsQty;
              }
              else{
                this.fromContainerDetails[j].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
              }

              this.fromContainerDetails[j].BinCode = this.binNo
              this.fromContainerDetails[j].OPTM_MIN_FILLPRCNT = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
              this.fromContainerDetails[j].AvlQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
              this.fromContainerDetails[j].isDesable = true
              this.fromContainerDetails[j].OPTM_TRACKING = "B"
              this.fromContainerDetails[j].OPTM_CONTAINERID = "";
              for (var i = 0; i < data.IteWiseInventory.length; i++) {
                if (data.IteWiseInventory[i].ITEMCODE == this.fromContainerDetails[j].OPTM_ITEMCODE) {
                  this.fromContainerDetails[j].BinCode = data.IteWiseInventory[i].BinCode
                  this.fromContainerDetails[j].AvlQty = Number(data.IteWiseInventory[i].AvlQty).toFixed(Number(localStorage.getItem("DecimalPrecision")))
                  this.fromContainerDetails[j].OPTM_MIN_FILLPRCNT = Number(data.IteWiseInventory[i].Quantity).toFixed(Number(localStorage.getItem("DecimalPrecision")))
                  this.fromContainerDetails[j].isDesable = ((data.IteWiseInventory[i].OPTM_TRACKING == "N") ? false : true)
                  this.fromContainerDetails[j].OPTM_TRACKING = data.IteWiseInventory[i].OPTM_TRACKING;
                  
                  if(this.fromContainerDetails[j].OPTM_TRACKING == "N" &&  (this.fromContainerDetails[j].AvlQty >= this.fromContainerDetails[j].OPTM_PARTS_PERCONT)){
                    this.fromContainerDetails[j].QuantityToAdd =  Number(this.fromContainerDetails[j].OPTM_PARTS_PERCONT).toFixed(Number(localStorage.getItem("DecimalPrecision")));
                  }
                }
              }
            }
          }
          this.updateWeigth();
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
    localStorage.setItem("From", "CCreation")
    this.ccmain.ccComponent = 2;
    this.prepareSaveModel(this.autoPackRule, this.containerId,
      this.containerType, this.autoClose, this.autoRuleId, this.whse, this.binNo, this.maxWeigth,
      localStorage.getItem("UserId"), "", this.itemCode, this.action, "", this.itemPackQty,
      this.width, this.height, this.containerWeigth, this.createMode, this.containerCode);

    localStorage.setItem("ContainerOperationData", JSON.stringify(this.oSaveModel))
  }

  onQtyChange(event, index) {
    if (event != undefined) {
      var qty = Number(event)
      for (var i = 0; i < this.fromContainerDetails.length; i++) {
        if (i == index) {
          this.fromContainerDetails[i].QuantityToAdd = qty;
        }
      }
    }
    this.updateWeigth()
  }

  lastSelectedTracking: any = ""
  onShowBSClick(event, index) {
    //console.log("onShowBSClick index: " + index);
    this.lastSelectedTracking = event.OPTM_TRACKING
    this.partPerQty = event.OPTM_PARTS_PERCONT
    localStorage.setItem("PartPerQty", this.partPerQty)
    if (this.whse == undefined || this.whse == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return false;
    }

    if (this.binNo == undefined || this.binNo == "") {
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return false;
    }
   
    this.lookupData = [];
    var tempList = [];
    if (this.fromContainer) {
      tempList = this.bsrListByContainerId;
    } else {
      tempList = this.batchSerialData;
    }
    if (tempList != undefined && tempList.length > 0) {
      // Filter according to ITEMCODE
      for (var i = 0; i < tempList.length; i++) {
        if (event.OPTM_ITEMCODE == tempList[i].ITEMCODE) {
          tempList[i].OldData = false;
          tempList[i].Balance = 0

          if(event.OPTM_TRACKING == "N" && event.QuantityToAdd != 0){
            let diff = parseFloat(event.AvlQty) - parseFloat(event.QuantityToAdd);             
            tempList[i].Quantity = Number(diff).toFixed(Number(localStorage.getItem("DecimalPrecision"))); 
            tempList[i].QuantityToAdd = Number(event.QuantityToAdd).toFixed(Number(localStorage.getItem("DecimalPrecision")));             
            tempList[i].OldData = true;           

            if(this.selectedBatchSerial.length == 0){
              this.selectedBatchSerial.push({
                ITEMCODE: tempList[i].ITEMCODE,
                LOTNO: tempList[i].LOTNO,
                Quantity: Number(tempList[i].Quantity).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
                BinCode: tempList[i].BinCode,
                OldData: tempList[i].OldData,
                Balance: tempList[i].Balance,
                QuantityToAdd: tempList[i].QuantityToAdd,
                OPTM_TRACKING: event.OPTM_TRACKING,
                TOTALQTY: "NaN"
              })
            }                    
          }
          else if(event.QuantityToAdd == 0){
            this.selectedBatchSerial = [];
            tempList[i].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
            //Commented due to bug fix - avl qty is showing wrong for all items in column
           // tempList[i].Quantity = Number(event.AvlQty).toFixed(Number(localStorage.getItem("DecimalPrecision"))); 
          }
         
          this.lookupData.push({
            ITEMCODE: tempList[i].ITEMCODE,
            LOTNO: tempList[i].LOTNO,
            Quantity: Number(tempList[i].Quantity).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
            BinCode: tempList[i].BinCode,
            OldData: tempList[i].OldData,
            Balance: tempList[i].Balance,
            QuantityToAdd: tempList[i].QuantityToAdd,
            OPTM_TRACKING: event.OPTM_TRACKING
          })
        }
      }

      for (var i = 0; i < this.lookupData.length; i++) {
        this.lookupData[i].OldData = false;
        for (var j = 0; j < this.selectedBatchSerial.length; j++) {
          if (this.lookupData[i].ITEMCODE == this.selectedBatchSerial[j].ITEMCODE && this.lookupData[i].LOTNO == this.selectedBatchSerial[j].LOTNO) {
            this.lookupData[i].QuantityToAdd = this.selectedBatchSerial[j].QuantityToAdd
            this.lookupData[i].OldData = true;
          }
        }
      }
    }

    // if (this.batchSerialData != undefined && this.batchSerialData.length > 0) {
    //   // Filter according to ITEMCODE
    //   for (var i = 0; i < this.batchSerialData.length; i++) {
    //     if (event.OPTM_ITEMCODE == this.batchSerialData[i].ITEMCODE) {
    //       this.batchSerialData[i].OldData = false;
    //       this.batchSerialData[i].Balance = 0
    //       this.batchSerialData[i].QuantityToAdd = 0;
    //       this.lookupData.push({
    //         ITEMCODE: this.batchSerialData[i].ITEMCODE,
    //         LOTNO: this.batchSerialData[i].LOTNO,
    //         Quantity: this.batchSerialData[i].Quantity,
    //         BinCode: this.batchSerialData[i].BinCode,
    //         OldData: this.batchSerialData[i].OldData,
    //         Balance: this.batchSerialData[i].Balance,
    //         QuantityToAdd: this.batchSerialData[i].QuantityToAdd
    //       })
    //     }
    //   }

    //   for (var i = 0; i < this.lookupData.length; i++) {
    //     this.lookupData[i].OldData = false;
    //     for (var j = 0; j < this.selectedBatchSerial.length; j++) {
    //       if (this.lookupData[i].ITEMCODE == this.selectedBatchSerial[j].ITEMCODE && this.lookupData[i].LOTNO == this.selectedBatchSerial[j].LOTNO) {
    //         this.lookupData[i].QuantityToAdd = this.selectedBatchSerial[j].QuantityToAdd
    //         this.lookupData[i].OldData = true;
    //       }
    //     }
    //   }
    // }

    localStorage.setItem("FromWhere", "CreateContainer");
    this.lookupfor = "BatchSerialList";
    this.showLookup = false;
    this.showOtherLookup = true;
  }


  getLookupDataValue($event) {
    this.showOtherLookup = false;
    this.showLookup = false;
    if ($event != null && $event == "close") {
      return;
    }
    else {
      if (this.lookupfor == "CTList") {
        if (this.fromType == 'child') {
          this.containerType = $event.OPTM_CONTAINER_TYPE;
          this.length = $event.OPTM_LENGTH;
          this.width = $event.OPTM_WIDTH;
          this.height = $event.OPTM_HEIGHT;
          this.maxWeigth = $event.OPTM_MAXWEIGHT;
          this.parentContainerType = '';
          this.autoPackRule = '';
          this.autoRuleId = '';
          this.packType = 0;
          this.partsQty = 0; 
          this.fromContainerDetails = [];
        }
      } 
      else if(this.lookupfor == "ParentCTList"){
        this.parentContainerType = $event.OPTM_PARENT_CONTTYPE;
        this.ParentPerQty = $event.OPTM_CONT_PERPARENT;
      }
      else if (this.lookupfor == "CARList") {
        this.soNumber = '';
        this.autoPackRule = $event.OPTM_RULEID;
        this.autoRuleId = $event.OPTM_RULEID;
        this.packType = $event.OPTM_CONTUSE;
        this.partsQty = $event.OPTM_PARTS_PERCONT;        
        this.CheckScanAndCreateVisiblity(this.autoPackRule);
        this.IsValidContainerAutoRule(this.autoPackRule, $event.OPTM_CONTTYPE, this.packType);
        // this.GetTotalWeightBasedOnRuleID();
      } else if (this.lookupfor == "WareHouse") {
        this.whse = $event.WhsCode;
        this.binNo = "";
        this.autoRuleId = ''; this.autoPackRule = "";
        this.soNumber = '';
        this.fromContainerDetails = [];
      } else if (this.lookupfor == "BinList") {
        this.binNo = $event.BinCode;
        this.autoRuleId = ''; this.autoPackRule = "";
        this.soNumber = '';
        this.fromContainerDetails = [];
        this.GetInventoryData();
      } else if (this.lookupfor == "SOList") {
        this.soNumber = $event.DocEntry;
        if(this.createMode != 3){
          this.IsValidSONumberBasedOnRule();
        }             
      } else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
      } else if (this.lookupfor == "ContainerIdList") {
        for (var i = 0; i < this.fromContainerDetails.length; i++) {
          if ($event.OPTM_ITEMCODE == this.fromContainerDetails[i].OPTM_ITEMCODE) {
            this.fromContainerDetails[i].OPTM_CONTAINERID = $event.OPTM_CONTAINERID;
          }
        }
        this.GetListOfBatchSerOfSelectedContainerID($event.OPTM_CONTAINERID, $event.OPTM_ITEMCODE)
      } else if (this.lookupfor == "WOLIST") {
        this.workOrder = $event.OPTM_WONO;
        this.taskId = $event.OPTM_ID;
        this.operationNo = $event.OPTM_FROMOPERNO;
        this.ProducedQty = $event.OPTM_QTYPRODUCED;
        this.PassedQty = $event.OPTM_QTYACCEPTED;
        this.RejectedQty = $event.OPTM_QTYREJECTED;
        this.NCQty = $event.OPTM_NCQTY;
        this.SelectedWOItemCode = $event.OPTM_FGCODE;
        this.itemCode = this.SelectedWOItemCode;
        this.RemQtyWO = $event.OPTM_REMAININGQTY;
        this.autoPackRule = '';
        this.fromContainerDetails = [];
        this.selectedBatchSerial = [];
        this.whse = $event.OPTM_WHSE;        
        //this.onWorkOrderChangeBlur();
      }
    }
  }


  getLookupKey($event) {

    //console.log("getLookupKey key");
    this.showOtherLookup = false;
    this.showLookup = false;
    if ($event.length == 0) {
      //this.selectedBatchSerial = [];
      this.updateBSSelectedList()
      for (var i = 0; i < this.fromContainerDetails.length; i++) {
        if (this.lastSelectedTracking == this.fromContainerDetails[i].OPTM_TRACKING) {
          this.fromContainerDetails[i].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
        }
      }
      this.updateWeigth()
      return;
    }
    var code = $event[0].ITEMCODE;
    //this.selectedBatchSerial = [];
    this.updateBSSelectedList();
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
        sumQty = sumQty + Number("" + this.selectedBatchSerial[i].QuantityToAdd);
      }
    }

    // Update grid details list by sum of qty
    for (var i = 0; i < this.fromContainerDetails.length; i++) {
      if (this.fromContainerDetails[i].OPTM_ITEMCODE == code) {
        this.fromContainerDetails[i].QuantityToAdd = sumQty;
      }
    }
    this.updateWeigth()
    //console.log("getLookupKey sumQty: " + sumQty);
  }

  updateBSSelectedList() {
    if (this.selectedBatchSerial.length > 0) {
      var temp = [];
      for (var i = 0; i < this.selectedBatchSerial.length; i++) {
        if (this.lastSelectedTracking != this.selectedBatchSerial[i].OPTM_TRACKING) {
          temp.push(this.selectedBatchSerial[i])
        }
      }
      this.selectedBatchSerial = temp;
    }
  }

  updateWeigth() {
    var weight = 0
    for (var i = 0; i < this.fromContainerDetails.length; i++) {
      var w: any = Number(this.fromContainerDetails[i].IWeight1).toFixed(Number(localStorage.getItem("DecimalPrecision")))
      var q: any = Number(this.fromContainerDetails[i].QuantityToAdd).toFixed(Number(localStorage.getItem("DecimalPrecision")))
      weight = weight + (w * q)
    }
    this.containerWeigth = weight
  }

  checkItemAlreadyExist(list: any, item: any, batchSrl: any) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].ITEMCODE == item && list[i].LOTNO == batchSrl) {
        return true;
      }
    }
    return false;
  }

  onSONumberChange() {
    if (this.soNumber == undefined || this.soNumber == "") {
      return;
    }

    if((this.autoRuleId == '' || this.autoRuleId == undefined) && this.createMode != 3){
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
            if(this.createMode != 3){
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

  scanCreateEnable: boolean = false;
  CheckScanAndCreateVisiblity(ruleId) {
    this.showLoader = true;
    var result = false;
    this.containerCreationService.CheckScanAndCreateVisiblity(ruleId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].TotalRow > 0) {
            this.scanCreateEnable = false;
          } else {
            this.scanCreateEnable = true;
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

  GetListOfContainerBasedOnRule(data) {
    this.showLoader = true;
    var result = false;
    this.containerCreationService.GetListOfContainerBasedOnRule(this.autoPackRule, data.OPTM_ITEMCODE, this.whse, this.binNo).subscribe(
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
          this.lookupfor = "ContainerIdList";
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

  bsrListByContainerId: any = []
  GetListOfBatchSerOfSelectedContainerID(cId: any, itemCode: any) {
    // this.showLoader = true;
    var result = false;
    this.containerCreationService.GetListOfBatchSerOfSelectedContainerID(cId, itemCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.bsrListByContainerId = data;
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

  //woList: any = [];
  GetWorkOrderList(action) {

  if(action == 'blur'){
    if(this.workOrder == '' || this.workOrder == undefined){
      return;
    }
  }

   this.showLoader = true;
    var result = false;
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
          this.showOtherLookup = false;
        } else {
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
    return result;
  }

  bsWeightData: any = []
  GetTotalWeightBasedOnRuleID() {
    // this.showLoader = true;
    var result = false;
    this.containerCreationService.GetTotalWeightBasedOnRuleID(this.autoPackRule).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.bsWeightData = data;
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

  isValidateCalled: boolean = false;
  async validateBeforeSubmit(): Promise<any> {
    this.isValidateCalled = true;
    var currentFocus = document.activeElement.id;
    //console.log("validateBeforeSubmit current focus: " + currentFocus);

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
