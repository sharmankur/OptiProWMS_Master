import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContainerCreationService } from '../../services/container-creation.service';
import { Commonservice } from '../../services/commonservice.service';
import { CommonData } from 'src/app/models/CommonData';
import { CARMasterService } from 'src/app/services/carmaster.service';


@Component({
  selector: 'app-input-parent-container',
  templateUrl: './input-parent-container.component.html',
  styleUrls: ['./input-parent-container.component.scss']
})
export class InputParentContainerComponent implements OnInit {

  @Input() titleMessage: any;
  @Input() yesButtonText: any;
  @Input() noButtonText: any;
  @Input() fromWhere: any;
  @Input() oSaveModel: any;
  @Output() isYesClick = new EventEmitter();
  purposeArray: any= [];
  commonData: any = new CommonData(this.translate);
  defaultPurpose: any;
  purpose: any='';
  addItemList: any = [];
  autoRuleId: any;
  containerType: any;
  packType: any;
  showLoader: boolean = false;
  showLookup: boolean=false
  serviceData: any = [];
  lookupfor: any;
  whse: any;
  binNo: any;
  containerGroupCode: any
  parentContainerType: any ='';
  ParentCTAray: any = [];
  ParentPerQty: any = 0;
  soNumber: any = '';
  RadioAction: string = "Add";
  count: number = 0;
  parentcontainerCode: any = '';
  public opened: boolean = true;  
  childcontainerCode: any = '';
  oCreateModel: any = {};
  IsParentCodeValid: boolean = false;
  purposeId: any = '';
  NoOfPacksToGenerate: any = 1;

  constructor(private commonservice: Commonservice, private translate: TranslateService, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private carmasterService: CARMasterService, private router: Router) { 
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
  }

  onPurposeSelectChange(event) {
    this.purpose = event.Name;
    this.purposeId = event.Value;
  }

  getLookupDataValue($event) {
     this.showLookup = false;
     if ($event != null && $event == "close") {
       return;
     }
     else {
       if (this.lookupfor == "CTList") {        
         this.containerType = $event.OPTM_CONTAINER_TYPE;
       } 
       else if(this.lookupfor == "ParentCTList"){
         this.parentContainerType = $event.OPTM_PARENT_CONTTYPE;
         this.ParentPerQty = $event.OPTM_CONT_PERPARENT;
       }
       else if (this.lookupfor == "CARList") {
         this.autoRuleId = $event.OPTM_RULEID;
         this.packType = $event.OPTM_CONTUSE;      
        
       } else if (this.lookupfor == "WareHouse") {
         this.whse = $event.WhsCode;
         this.binNo = "";
       } else if (this.lookupfor == "BinList") {
         this.binNo = $event.BinCode;        
       } else if (this.lookupfor == "SOList") {
         this.soNumber = $event.DocEntry;
       } else if (this.lookupfor == "GroupCodeList") {
         this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
        }       
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

  onBinChangeBlur() {
    if (this.binNo == undefined || this.binNo == "") {
      return;
    }

    if(this.whse == "" || this.whse == undefined){
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
    // this.autoPackRule = '';

    this.showLoader = true;
    this.commonservice.IsValidContainerType("").then(
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
            this.containerType = "";this.containerType = "";
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

  getAutoPackRule() {
    if (this.containerType == undefined || this.containerType == "") {
      this.toastr.error('', this.translate.instant("SelectContainerMsg"));
      return;
    }

    this.showLoader = true;
    this.commonservice.GetDataForContainerAutoRule(this.containerType,this.autoRuleId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data.OPTM_CONT_AUTORULEHDR;
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

  onAutoPackRuleChangeBlur() {
   
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
          //this.selectedBatchSerial = [];

          //Case Warehouse and if create mode is Manual/Manual Rule based then create blank container -
          // if(!this.IsWIPCont && this.createMode != 1){          
          //   this.fromContainerDetails = [];
          // }
          // else{ 
          //    this.fromContainerDetails = data.OPTM_CONT_AUTORULEDTL; 

          //     //Case WIP and if create mode is Manual Rule based then only Work Order Item in Inventory Grid should be present-
          //     if(this.IsWIPCont && this.createMode == 2){  
          //       this.fromContainerDetails = this.fromContainerDetails.filter(val => val.OPTM_ITEMCODE == this.SelectedWOItemCode);
          //     }
                           
          //     for (var j = 0; j < this.fromContainerDetails.length; j++) {
          //       if(this.IsWIPCont && this.fromContainerDetails[j].OPTM_ITEMCODE == this.SelectedWOItemCode){
          //         this.fromContainerDetails[j].QuantityToAdd = Number(this.partsQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          //       }            
          //       else{
          //         this.fromContainerDetails[j].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          //       }
          //       this.fromContainerDetails[j].OPTM_MIN_FILLPRCNT = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          //       this.fromContainerDetails[j].AvlQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          //     }            
          // }

          result = true;
          localStorage.setItem("CAR_Grid_Data", JSON.stringify(data));
         
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

  onSONumberChange() {
    if (this.soNumber == undefined || this.soNumber == "") {
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

  validateAllFields(){

    if(this.whse == "" || this.whse == undefined){
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }
  
    if(this.binNo == "" || this.binNo == undefined){
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return;
    }

    if(this.containerType == "" || this.containerType == undefined){
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("EnterContainerType"));
      return;
    }

    if(this.parentContainerType == "" || this.parentContainerType == undefined){
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("CTR_ParentContainerType_Blank_Msg"));
      return;
    }
  }

  IsvalidParentCode(){
    this.showLoader = true;
    this.containerCreationService.GetAllContainer(this.parentcontainerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length == 0) {
           this.IsParentCodeValid = false;
           this.toastr.warning('', this.translate.instant("ParentContDoesNotExists"));
          } else {
            this.IsParentCodeValid = true;       
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

  onParentContainerCodeChange(){

    this.childcontainerCode = '';

    this.validateAllFields();

    if(this.parentcontainerCode == '' || this.parentcontainerCode == undefined){
      return;
    } 
    this.addItemList = [];
    this.showLoader = true;
    this.containerCreationService.GetConatinersAddedInParentContainer(this.parentcontainerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined && data != null) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          //this.count= data[0].Count;
          if(data.length != undefined){
            this.count = data.length;
            this.addItemList = data;
          }   
          else{
            this.count = 0;
          } 

          this.IsvalidParentCode();

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

  generateParentContnr(){
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

            if(data[0].ErrMsg != undefined && data[0].ErrMsg != null){
              this.toastr.error('', data[0].ErrMsg);
              return;
            }

            console.log(data[0].OPTM_CONTAINERID);
            console.log(data[0].OPTM_CONTCODE);

            this.insertChildContnr();
           // this.toastr.success('', this.translate.instant("ContainerCreatedSuccessMsg"));
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

  insertChildContnr(){
    this.showLoader = true;
    this.containerCreationService.InsertContainerinContainer(this.parentcontainerCode, this.childcontainerCode, this.RadioAction,
      this.containerType, this.parentContainerType).subscribe(
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

          if (data[0].RESULT == "Data Saved") {
            if(this.RadioAction == 'Add'){
              this.toastr.success('', this.translate.instant("Container_Assigned_To_Parent"));
            }else{
              this.toastr.success('', this.translate.instant("Container_Removed_From_Parent"));
            }
            this.childcontainerCode = '';
            this.onParentContainerCodeChange();
          }
          else {
            this.toastr.error('', data[0].RESULT);
          }
        }
        else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
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

  onItemCodeChange(){  

    this.validateAllFields();

    if(this.childcontainerCode == "" || this.childcontainerCode == undefined){
      return;
    }

    if(this.parentcontainerCode == "" || this.parentcontainerCode == undefined){
      this.toastr.error('', this.translate.instant("Enter_Parent_ContCode"));
      this.childcontainerCode = '';
      return;
    }   

    if(!this.IsParentCodeValid){
      this.oCreateModel.HeaderTableBindingData = [];
      this.oCreateModel.OtherItemsDTL = [];
      this.oCreateModel.OtherBtchSerDTL = [];
    
      this.oCreateModel.HeaderTableBindingData.push({
        OPTM_SONO: (this.soNumber == undefined) ? '' :this.soNumber ,
        OPTM_CONTAINERID: 0,
        // OPTM_CONTTYPE: this.containerType,
        // OPTM_CONTAINERCODE: "" + this.childcontainerCode,
        OPTM_CONTTYPE: this.parentContainerType,
        OPTM_CONTAINERCODE: "" + this.parentcontainerCode,
        OPTM_WEIGHT: 0,
        OPTM_AUTOCLOSE_ONFULL: 'N',
        OPTM_AUTORULEID: 0,
        OPTM_WHSE: this.whse,
        OPTM_BIN: this.binNo,
        OPTM_CREATEDBY: localStorage.getItem("UserId"),
        OPTM_MODIFIEDBY: '',
        Length: length,
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
        OPTM_CREATEMODE: 0,
        OPTM_PURPOSE: this.purposeId, //need to change
        OPTM_FUNCTION: "Shipping",
        OPTM_OBJECT: "Container",
        OPTM_WONUMBER: 0,
        OPTM_TASKHDID: 0,
        OPTM_OPERATION: 0,
        OPTM_QUANTITY: 0,
        OPTM_SOURCE: 0,    
        OPTM_ParentContainerType: this.parentContainerType,
        OPTM_ParentPerQty: 0,  
        IsWIPCont: false  
      });

      this.generateParentContnr();
    }
    else{
      this.insertChildContnr();
    }
 }

  public close(status) {
   
       if (status == "cancel" || status == "no") {
      
        this.isYesClick.emit({
          Status: "no",
          From: "CreateParentContainer",
          ContainerCode: "",
          ParentContainerCode: "",
          Count: 0
        });                
      }
     // this.opened = false;
    }

    // public open() {
    //   this.opened = true;
    // }
  
    // getLookupValue($event) {
    //   if ($event != null && $event == "close") {
    //     return;
    //   }      
    // }  

}
