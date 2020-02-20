import { Component, OnInit } from '@angular/core';
import { AutoRuleModel } from 'src/app/models/Inbound/autoRuleModel';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { BinrulemasterComponent } from '../binrulemaster/binrulemaster.component';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BinruleService } from 'src/app/services/binrule.service';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { WhsUserGroupService } from 'src/app/services/whs-user-group.service';
import { BinRuleRowModel } from 'src/app/models/binrule/BinRuleRowModel';

@Component({
  selector: 'app-binrule-add-update',
  templateUrl: './binrule-add-update.component.html',
  styleUrls: ['./binrule-add-update.component.scss']
})
export class BinruleAddUpdateComponent implements OnInit {


  
  public binRuleArray: BinRuleRowModel[] = [];
  
  PurposeList: any[] = ["Shipping", "Internal", "Both"];
  RuleTypeList: any[] = ["Pick", "Putaway"];
  
  isUpdate: boolean = false;
  hideLookup: boolean = true;
  index: number = -1;
  fromWhere:any ='';

  CAR_CPackRule: string;
  CAR_ContainerType: string;
  CAR_ItemCode: string;
  CAR_PartsPerContainer: Number;
  CAR_MinFillPercent: Number;
  
  BtnTitle: string;

  binRule_ROW: any;

  purpose: String = this.PurposeList[0];
  ruleType: String = this.RuleTypeList[0];
  whsCode: string ='';
  whsZone: String ='';
  whsName: String ='';
  ruleId: String = '';
  lookupfor: string;
  serviceData: any[];
  showLoader: boolean = false;
  showLookup: boolean = false;
  isValidateCalled: boolean = false;
  constructor(private commonservice: Commonservice, private toastr: ToastrService,
    private translate: TranslateService, private binRuleMasterComponent: BinrulemasterComponent,
    private binruleService: BinruleService, private router: Router, 
    private containerCreationService: ContainerCreationService, private userGroupMappingService: WhsUserGroupService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
    this.purpose = this.PurposeList[0];
    this.ruleType = this.RuleTypeList[0];
  }

  ngOnInit() {
    let binruleRow = localStorage.getItem("binRule_ROW")
    if (binruleRow != undefined && binruleRow != "") {
      this.binRule_ROW = JSON.parse(localStorage.getItem("binRule_ROW"));
      
    }
    
    if (localStorage.getItem("brAction") == "copy") {
      this.isUpdate = false;
      this.BtnTitle = this.translate.instant("CT_Add");
      this.prepareAndSetDataForUpdateAndCopy();
    } else if (localStorage.getItem("brAction") == "update") {
      this.isUpdate = true;
      this.BtnTitle = this.translate.instant("CT_Update");
      this.prepareAndSetDataForUpdateAndCopy()
    } else if (localStorage.getItem("brAction") == "add") {
      this.BtnTitle = this.translate.instant("CT_Add");
      this.isUpdate = false;
    } else {
      this.BtnTitle = this.translate.instant("CT_Add");
      this.isUpdate = false;
    }
  }

   prepareAndSetDataForUpdateAndCopy(){
    var selectedData = JSON.parse(localStorage.getItem("binRule_Grid_Data"));
    let OPTM_SHP_BINRULES_HDR = selectedData.OPTM_SHP_BINRULES_HDR;
    var OPTM_SHP_BINRULES_DTL: any = selectedData.OPTM_SHP_BINRULES_DTL;
    this.ruleId = OPTM_SHP_BINRULES_HDR[0].OPTM_WHS_RULE; 
    this.purpose = OPTM_SHP_BINRULES_HDR[0].OPTM_PURPOSE;
    this.whsCode = OPTM_SHP_BINRULES_HDR[0].OPTM_WHSCODE;
    this.whsZone = OPTM_SHP_BINRULES_HDR[0].OPTM_WHS_ZONE;
    this.ruleType = OPTM_SHP_BINRULES_HDR[0].OPTM_RULE_TYPE;
    if (this.purpose == 1+"") {
      this.purpose = this.PurposeList[0];
    } else if (this.purpose == 2+"") {
      this.purpose = this.PurposeList[1];
    }else{
      this.purpose = this.PurposeList[2];
    }

    if (this.ruleType == 1+"") {
      this.ruleType = this.RuleTypeList[0];
    } else if (this.ruleType == 2+"") {
      this.ruleType = this.RuleTypeList[1];
    }else{
      this.ruleType = this.RuleTypeList[2];
    }
    this.binRuleArray = [];
    for(let i =0;i<OPTM_SHP_BINRULES_DTL.length; i++){
      this.binRuleArray.push(OPTM_SHP_BINRULES_DTL[i]);
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
          if(this.serviceData!=null && this.serviceData!=undefined && this.serviceData.length>0){
            this.lookupfor = "WareHouse";
          }else{
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

  onWhseChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.OnWhsCodeChange();
  }


  async OnWhsCodeChange() {
    if (this.whsCode == undefined || this.whsCode == "") {
      return;
    }
    this.showLookup = false;
    var result = false;
    await this.containerCreationService.IsValidWhseCode(this.whsCode).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.whsCode = ''
        } else {
          this.whsCode = resp[0].WhsCode;
          this.whsName = resp[0].WhsName;
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


  GetDataForWhsZone() { 
    if(this.whsCode==undefined && this.whsCode==null || this.whsCode==""){
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
     return; 
    }
    this.showLoader = true;
    this.userGroupMappingService.GetWHSZoneList(this.whsCode).subscribe(
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
          if(this.serviceData!=null && this.serviceData!=undefined && this.serviceData.length>0){
            this.lookupfor = "WhsZoneList";
          }else{
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

 

  onWhsZoneBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.OnWhsZoneChange();
  }


  async OnWhsZoneChange() {
    if (this.whsZone == undefined || this.whsZone == "") {
      return;
    }
    if(this.whsCode==undefined && this.whsCode==null || this.whsCode==""){
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
     return;
    }
    this.showLookup = false;
    var result = false;
    await this.userGroupMappingService.isValidWHSZone(this.whsCode,this.whsZone).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsZoneErrorMsg"));
          this.whsZone = ''
        } else {
          this.whsZone = resp[0]
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



  requiredFieldValidation(): boolean{
    if(this.ruleType==undefined && this.ruleType==null || this.ruleType==""){
      this.toastr.error('', this.translate.instant("BinRuleSelectRuleType"));
     return false;
    } else
    if(this.purpose==undefined && this.purpose==null || this.purpose==""){
      this.toastr.error('', this.translate.instant("BinRuleSelectPurpose"));
     return false;
    }else
    if(this.whsCode==undefined && this.whsCode==null || this.whsCode==""){
      this.toastr.error('', this.translate.instant("SelectWhsCode"));
     return false;
     }
    // }else //thsi is not mendatory
    // if(this.whsZone==undefined && this.whsZone==null || this.whsZone==""){
    //   this.toastr.error('', this.translate.instant("SelectWhsZone"));
    //  return false;
    // }  
    else if (this.binRuleArray.length <= 0) {
      this.toastr.error('', this.translate.instant("CAR_addItemDetail_blank_msg"));
      return false;
    } else
    if (this.binRuleArray.length > 0) {
      let sum = 0;
      for (var iBtchIndex = 0; iBtchIndex < this.binRuleArray.length; iBtchIndex++) {
        if (this.binRuleArray[iBtchIndex].OPTM_STORAGE_FROM_BIN == undefined || this.binRuleArray[iBtchIndex].OPTM_STORAGE_FROM_BIN == "") {
          this.toastr.error('', this.translate.instant("BinRule_FromBinMsg"));
          return false;
        }
        else if (this.binRuleArray[iBtchIndex].OPTM_STORAGE_TO_BIN == undefined || this.binRuleArray[iBtchIndex].OPTM_STORAGE_TO_BIN == "") {
          this.toastr.error('', this.translate.instant("BinRule_ToBinMsg"));
          return false;
        }
      }
    }
    return true;
  }
  public lineId: number = 0;
  AddRow() {
    if(this.whsCode ==""){
      this.toastr.error('', this.translate.instant("SelectWhsCode"));
      return ;
    }
    if(this.whsZone == ""){
      this.toastr.error('', this.translate.instant("SelectWhsZone"));
      return ;
    }
   this.binRuleArray.push(new BinRuleRowModel("","","",""));
  }
  
  OnAddUpdateClick() {
    if (!this.requiredFieldValidation()) {
      return;
    }
    if (this.BtnTitle == this.translate.instant("CT_Update")) {
      this.updateBinRule();
    } else {
      this.addBinRule();
    }
  }

 

    //-----------------------------add methods
    addBinRule() {
      var BinRuleData: any = {};
      BinRuleData.Header = [];
      BinRuleData.Details = [];
      var BinRuleDatafilled = this.prepareBinRuleData(BinRuleData,false); // current data only.
      this.InsertIntoBinRule(BinRuleDatafilled);
    }
  
    updateBinRule() {
      var BinRuleData: any = {};
      BinRuleData.Header = [];
      BinRuleData.Details = [];
      var BinRuleDatafilled = this.prepareBinRuleData(BinRuleData,true); // current data only.
      //var AutoRuleData = this.prepareUpdateBinRuleData(AutoRuleData); // current data only.
      this.UpdateBinRule(BinRuleData);
    }

    async InsertIntoBinRule(BinRuleData: any) {
      this.showLoader = true;
      this.binruleService.InsertIntoBinRule(BinRuleData).subscribe(
        (data: any) => {
          console.log("inside InsertIntoContainerAutoRule")
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            if(data[0].RESULT == this.translate.instant("DataSaved")){
              this.toastr.success('', data[0].RESULT);
              this.binRuleMasterComponent.binRuleComponent = 1;
            }else{
              this.toastr.error('', data[0].RESULT);
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
  
    prepareBinRuleData(oSubmitBinRuleObj: any, fromUpdate: boolean): any {
      //set value of purpose type.
      let purposeType = 1;
      if (this.purpose == this.PurposeList[0]) {
        purposeType = 1;
      } else if (this.purpose == this.PurposeList[1]) {
        purposeType = 2;
      }else{
        purposeType = 3;
      }

      // set value of rule type.
      let ruleTypeType = 1;
      if (this.ruleType == this.RuleTypeList[0]) {
        ruleTypeType = 1;
      } else if (this.purpose == this.RuleTypeList[1]) {
        ruleTypeType = 2;
      }else{
        ruleTypeType = 3;
      }
      if(fromUpdate){
        oSubmitBinRuleObj.Header.push({
          OPTM_RULE_TYPE: ruleTypeType,
          CompanyDBId: localStorage.getItem("CompID"),
          OPTM_PURPOSE: purposeType,
          OPTM_WHSCODE: this.whsCode,
          OPTM_WHS_ZONE: this.whsZone,
          OPTM_MODIFIEDBY: localStorage.getItem("UserId"),
          OPTM_WHS_RULE: this.ruleId
        });

      }else{
        oSubmitBinRuleObj.Header.push({
          OPTM_RULE_TYPE: ruleTypeType,
          CompanyDBId: localStorage.getItem("CompID"),
          OPTM_PURPOSE: purposeType,
          OPTM_WHSCODE: this.whsCode,
          OPTM_WHS_ZONE: this.whsZone,
          OPTM_CREATEDBY: localStorage.getItem("UserId"),
          
        });
      }
      for (var iBtchIndex = 0; iBtchIndex < this.binRuleArray.length; iBtchIndex++) {
        this.lineId = this.lineId+1;
        oSubmitBinRuleObj.Details.push({
         OPTM_STORAGE_FROM_BIN: this.binRuleArray[iBtchIndex].OPTM_STORAGE_FROM_BIN,
         OPTM_STORAGE_TO_BIN:  this.binRuleArray[iBtchIndex].OPTM_STORAGE_TO_BIN,
         OPTM_PUTWAY_STAGE_BIN: this.binRuleArray[iBtchIndex].OPTM_PUTWAY_STAGE_BIN,
         OPTM_LINEID: this.lineId
        }); 
      }
      return oSubmitBinRuleObj;
    }

   
    async UpdateBinRule(BinRuleData: any) {
     
      this.showLoader = true;
      this.binruleService.UpdateBinRule(BinRuleData).subscribe(
        (data: any) => {
          console.log("inside UpdateContainerAutoRule")
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            if(data[0].RESULT == this.translate.instant("DataSaved")){
              this.toastr.success('', data[0].RESULT);
              this.binRuleMasterComponent.binRuleComponent = 1;
            }else{
              this.toastr.error('', data[0].RESULT);
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
  
    getLookupValue($event) {
      if ($event != null && $event == "close") {
        //nothing to do
        return;
      }
      else  if (this.lookupfor == "WareHouse") {
          this.whsCode = $event[0];
          this.whsName = $event[1];
          this.whsZone = "";
        }else if(this.lookupfor== "WhsZoneList"){ 
          this.whsZone = $event[1];
        }else if (this.lookupfor == "BinList") {

          for (let i = 0; i < this.binRuleArray.length; ++i) {
            if (i === this.index) {
              if(this.fromWhere == 1){
                this.binRuleArray[i].OPTM_STORAGE_FROM_BIN = $event[0];
              }else
              if(this.fromWhere == 2){
                this.binRuleArray[i].OPTM_STORAGE_TO_BIN = $event[0];
              } else 
              if(this.fromWhere == 3){
                this.binRuleArray[i].OPTM_PUTWAY_STAGE_BIN = $event[0];
              }
              
            }
          }
        }
      }

      GetBinCodeList(index,type) {
        this.fromWhere = type;
        this.showLoader = true;
        this.index = index;
        this.commonservice.GetBinCode(this.whsCode).subscribe(
          data => {
            this.showLoader = false;
            if (data != undefined && data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                  this.translate.instant("CommonSessionExpireMsg"));
                return;
              }
              //this.hideLookup = false;
              this.serviceData = data;
              this.lookupfor = "BinList";
              this.showLookup = true;
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
      updateLineId(lotTemplateVar, value, rowindex, gridData: any) {
        value = Number(value).toFixed(Number(localStorage.getItem("DecimalPrecision")));
        for (let i = 0; i < this.binRuleArray.length; ++i) {
          if (i === rowindex) {
            this.binRuleArray[i].OPTM_LINEID = value;
          }
        }
      }


      onCancelClick() {
        
        this.binRuleMasterComponent.binRuleComponent = 1;
      }

      deleteRow(rowIndex, gridItem){
              this.binRuleArray.splice(rowIndex,1);
              gridItem = this.binRuleArray;
      }
}