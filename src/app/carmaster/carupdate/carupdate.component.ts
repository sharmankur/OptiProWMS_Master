
import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '@angular/router';
import { CARMainComponent } from '../carmain/carmain.component';
import { AutoRuleModel } from '../../models/Inbound/autoRuleModel';
import { CARMasterService } from '../../services/carmaster.service';

@Component({
  selector: 'app-carupdate',
  templateUrl: './carupdate.component.html',
  styleUrls: ['./carupdate.component.scss']
})
export class CARUpdateComponent implements OnInit {
  CAR_CPackRule: string;
  CAR_ContainerType: string;
  CAR_ItemCode: string;
  CAR_PartsPerContainer: Number;
  CAR_MinFillPercent: Number;
  CAR_PackType = "Shipping";
  OPTM_RULE_DESC: string ="";
  lookupfor: string;
  BtnTitle: string;

  CTR_ROW: any;
  serviceData: any[];
  public autoRuleArray: AutoRuleModel[] = [];
  PackTypeList: any[] = ["Shipping", "Internal", "Both"];

  CAR_AddPartsToContainer: boolean = false;
  showLoader: boolean = false;
  isUpdate: boolean = false;
  hideLookup: boolean = true;
  index: number = -1;
  isUpdateHappen: boolean = false;

  constructor(private commonservice: Commonservice, private toastr: ToastrService,
    private translate: TranslateService, private carmainComponent: CARMainComponent,
    private carmasterService: CARMasterService, private router: Router
  ) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.BtnTitle = this.translate.instant("Submit");

    let Carow = localStorage.getItem("CAR_ROW")
    if (Carow != undefined && Carow != "") {
      this.CTR_ROW = JSON.parse(localStorage.getItem("CAR_ROW"));
      this.autoRuleArray = (JSON.parse(localStorage.getItem("CAR_Grid_Data"))).OPTM_CONT_AUTORULEDTL;
      this.CAR_CPackRule = this.CTR_ROW.OPTM_RULEID;//, event.OPTM_CONTTYPE, event.OPTM_CONTUSE);
      this.CAR_ContainerType = this.CTR_ROW.OPTM_CONTTYPE;
      this.OPTM_RULE_DESC = this.CTR_ROW.OPTM_RULE_DESC;
      for (var i = 0; i < this.autoRuleArray.length; i++) {
        this.autoRuleArray[i].OPTM_PARTS_PERCONT = Number(this.autoRuleArray[i].OPTM_PARTS_PERCONT).toFixed(Number(localStorage.getItem("DecimalPrecision")));
        this.autoRuleArray[i].OPTM_MIN_FILLPRCNT = Number(this.autoRuleArray[i].OPTM_MIN_FILLPRCNT).toFixed(Number(localStorage.getItem("DecimalPrecision")));
        this.autoRuleArray[i].OPTM_PACKING_MATWT = Number(this.autoRuleArray[i].OPTM_PACKING_MATWT).toFixed(Number(localStorage.getItem("DecimalPrecision")));
      }
      this.CAR_PackType = this.CTR_ROW.OPTM_CONTUSE;
      // if (this.CTR_ROW.OPTM_CONTUSE == 1) {
      //   this.CAR_PackType = this.PackTypeList[0];
      // } else if (this.CTR_ROW[3] == 2) {
      //   this.CAR_PackType = this.PackTypeList[1];
      // }else{
      //   this.CAR_PackType = this.PackTypeList[2];
      // }
      if (this.CTR_ROW.OPTM_ADD_TOCONT == 'Yes') {
        this.CAR_AddPartsToContainer = true;
      } else {
        this.CAR_AddPartsToContainer = false;
      }
      if (localStorage.getItem("Action") == "copy") {
        this.CAR_CPackRule = ''
        this.isUpdate = false;
      } else {
        this.isUpdate = true;
      }
    } else {
      this.isUpdate = false;
    }
  }
  onAutoPackChange(){
    this.isUpdateHappen = true
  }

  onCheckChange(event){
    this.isUpdateHappen = true
  }

  onBackClick() {
    if (this.isUpdateHappen) {
      this.showDialog("BackConfirmation", this.translate.instant("yes"), this.translate.instant("no"),
        this.translate.instant("Plt_DataDeleteMsg"));
      return true;
    } else {
      this.carmainComponent.carComponent = 1;
    }
  }

  onCancelClick() {
    this.carmainComponent.carComponent = 1;
  }

  validateFields(): boolean {
    if (this.CAR_CPackRule == undefined) {
      this.toastr.error('', this.translate.instant("CAR_ContainerPackRule_Blank_Msg"));
      return false;
    }
    // else if (this.OPTM_RULE_DESC == '' || this.OPTM_RULE_DESC == undefined) {
    //   this.toastr.error('', this.translate.instant("EnterAutoPackDesc"));
    //   return false;
    // }
    else if (this.CAR_ContainerType == '' || this.CAR_ContainerType == undefined) {
      this.toastr.error('', this.translate.instant("CT_ContainerType_Blank_Msg"));
      return false;
    }
    else if (this.CAR_PackType == undefined) {
      this.toastr.error('', this.translate.instant("CAR_Pack_Type_Blank_Msg"));
      return false;
    }
    else if (this.autoRuleArray.length <= 0) {
      this.toastr.error('', this.translate.instant("CAR_addItemDetail_blank_msg"));
      return false;
    }
    else if (this.autoRuleArray.length > 0) {
      let sum = 0;
      for (var iBtchIndex = 0; iBtchIndex < this.autoRuleArray.length; iBtchIndex++) {
        if (this.autoRuleArray[iBtchIndex].OPTM_ITEMCODE == undefined || this.autoRuleArray[iBtchIndex].OPTM_ITEMCODE == "") {
          this.toastr.error('', this.translate.instant("CAR_ItemCode_Blank_Msg"));
          return false;
        }
        else if (this.autoRuleArray[iBtchIndex].OPTM_MIN_FILLPRCNT == "0" || this.autoRuleArray[iBtchIndex].OPTM_MIN_FILLPRCNT == "") {
          this.toastr.error('', this.translate.instant("CAR_MinFillPercent_blank_msg"));
          return false;
        } else if (this.autoRuleArray[iBtchIndex].OPTM_PARTS_PERCONT == "0" || this.autoRuleArray[iBtchIndex].OPTM_PARTS_PERCONT == "") {
          this.toastr.error('', this.translate.instant("CAR_PartsPerContainer_blank_msg"));
          return false;
        }
        sum = Number(sum) + Number(this.autoRuleArray[iBtchIndex].OPTM_MIN_FILLPRCNT);
      }
      if (sum != 100) {
        this.toastr.error('', this.translate.instant("CAR_MinFillPercent_val_msg"));
        return false;
      }
    }
    return true;
  }

  updateDropDown() {
    alert(this.CAR_PackType);
  }

  OnContainerTypeChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.OnContainerTypeChange();
  }

  async OnContainerTypeChange() {
    if (this.CAR_ContainerType == undefined || this.CAR_ContainerType == "") {
      return;
    }
    this.showLoader = true;
    var result = false;
    await this.commonservice.IsValidContainerType(this.CAR_ContainerType).then(
      (data: any) => {
        this.showLoader = false;
        result = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.isUpdateHappen = true
          if (data.length > 0) {
            this.CAR_ContainerType = data[0].OPTM_CONTAINER_TYPE;
            result = true;
          } else {
            this.CAR_ContainerType = "";
            this.toastr.error('', this.translate.instant("InvalidContainerType"));
          }
        } else {
          this.CAR_ContainerType = "";
          this.toastr.error('', this.translate.instant("InvalidContainerType"));
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

  OnAddUpdateClick() {
    if (!this.validateFields()) {
      return;
    }
    if (this.isUpdate) {
      this.updateContainerAutoRule();
    } else {
      this.addContainerAutoRule();
    }
  }

  updateContainerAutoRule() {
    var AutoRuleData: any = {};
    AutoRuleData.Header = [];
    AutoRuleData.Details = [];
    var AutoRuleData = this.prepareContainerAutoRule(AutoRuleData); // current data only.
    this.UpdateContainerAutoRule(AutoRuleData);
  }

  addContainerAutoRule() {
    var AutoRuleData: any = {};
    AutoRuleData.Header = [];
    AutoRuleData.Details = [];
    var AutoRuleData = this.prepareContainerAutoRule(AutoRuleData); // current data only.
    this.InsertIntoContainerAutoRule(AutoRuleData);
  }

  prepareContainerAutoRule(oSubmitPOLotsObj: any): any {
    let packtype = 1;
    if (this.CAR_PackType == this.PackTypeList[0]) {
      packtype = 1;
    } else if (this.CAR_PackType == this.PackTypeList[1]) {
      packtype = 2;
    } else {
      packtype = 3;
    }

    let addPartToCont = 'N'
    if (this.CAR_AddPartsToContainer == true) {
      addPartToCont = "Y";
    }

    oSubmitPOLotsObj.Header.push({
      OPTM_RULEID: this.CAR_CPackRule,
      OPTM_CONTTYPE: this.CAR_ContainerType,
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_CONTUSE: packtype,
      OPTM_RULE_DESC: this.OPTM_RULE_DESC,
      OPTM_ADD_TOCONT: addPartToCont,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: localStorage.getItem("UserId")
    });

    for (var iBtchIndex = 0; iBtchIndex < this.autoRuleArray.length; iBtchIndex++) {
      oSubmitPOLotsObj.Details.push({
        OPTM_ITEMCODE: this.autoRuleArray[iBtchIndex].OPTM_ITEMCODE,
        OPTM_RULEID: this.CAR_CPackRule,
        OPTM_PARTS_PERCONT: this.autoRuleArray[iBtchIndex].OPTM_PARTS_PERCONT,
        OPTM_MIN_FILLPRCNT: this.autoRuleArray[iBtchIndex].OPTM_MIN_FILLPRCNT,
        OPTM_PACKING_MATWT: this.autoRuleArray[iBtchIndex].OPTM_PACKING_MATWT,
        OPTM_CREATEDBY: localStorage.getItem("UserId"),
        OPTM_MODIFIEDBY: localStorage.getItem("UserId")
      });
    }
    return oSubmitPOLotsObj;
  }


  async InsertIntoContainerAutoRule(AutoRuleData: any) {
    var result = await this.validateBeforeSubmit();
    this.isValidateCalled = false;
    console.log("validate result: " + result);
    if (result != undefined && result == false) {
      return;
    }

    this.showLoader = true;
    this.carmasterService.InsertIntoContainerAutoRule(AutoRuleData).subscribe(
      (data: any) => {
        console.log("inside InsertIntoContainerAutoRule")
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', data[0].RESULT);
            this.carmainComponent.carComponent = 1;
          } else {
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

  async UpdateContainerAutoRule(AutoRuleData: any) {
    var result = await this.validateBeforeSubmit();
    this.isValidateCalled = false;
    console.log("validate result: " + result);
    if (result != undefined && result == false) {
      return;
    }

    this.showLoader = true;
    this.carmasterService.UpdateContainerAutoRule(AutoRuleData).subscribe(
      (data: any) => {
        console.log("inside UpdateContainerAutoRule")
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', data[0].RESULT);
            this.carmainComponent.carComponent = 1;
          } else {
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

  getLookupKey($event) {
    if ($event != null && $event == "close") {
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "CTList") {
      this.CAR_ContainerType = $event.OPTM_CONTAINER_TYPE;
      this.isUpdateHappen = true
    } else if (this.lookupfor == "ItemsList") {
      // for (let i = 0; i < this.autoRuleArray.length; ++i) {
      //   if (i === this.index) {
      //     this.autoRuleArray[i].OPTM_ITEMCODE = $event[0];
      //   }
      // }

      if(this.autoRuleArray[this.index].OPTM_ITEMCODE == $event.ItemCode){
        return
      }

      if(this.isBinRangeExist($event.ItemCode)){
        this.toastr.error('', this.translate.instant("CAR_itemcode_exists_Msg"));
        this.autoRuleArray[this.index].OPTM_ITEMCODE = ''
      } else {
        this.autoRuleArray[this.index].OPTM_ITEMCODE = $event.ItemCode;
      }
    }
  }

  onDescChange(){
    this.isUpdateHappen = true
  }

  GetDataForContainerType() {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForContainerType().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
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


  AddRow() {
    // if (this.CAR_PackType == "Single Item") {
    //   if (this.autoRuleArray.length >= 1) {
    //     return;
    //   }
    // } else {

    // }
    this.autoRuleArray.push(new AutoRuleModel("", 0, "0", "0", "0"));
    this.isUpdateHappen = true
  }

  updateRuleId(lotTemplateVar, value, rowindex, gridData: any) {
    for (let i = 0; i < this.autoRuleArray.length; ++i) {
      if (i === rowindex) {
        this.autoRuleArray[i].OPTM_RULEID = value;
      }
    }
  }

  updateItemCode(lotTemplateVar, value, rowindex, gridData: any) {
    for (let i = 0; i < this.autoRuleArray.length; ++i) {
      if (i === rowindex) {
        this.autoRuleArray[i].OPTM_ITEMCODE = value;
      }
    }
  }

  updatePartperCont(lotTemplateVar, value, rowindex, gridData: any) {
    value = Number(value).toFixed(Number(localStorage.getItem("DecimalPrecision")));
    if(value < 0 ){
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      value = 0;
    }

    for (let i = 0; i < this.autoRuleArray.length; ++i) {
      if (i === rowindex) {
        this.autoRuleArray[i].OPTM_PARTS_PERCONT = value;
      }
    }
    this.isUpdateHappen = true
  }

  updateMinfill(lotTemplateVar, value, rowindex, gridData: any) {
    value = Number(value).toFixed(Number(localStorage.getItem("DecimalPrecision")));
    if(value < 0 ){
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      value = 0;
    }

    for (let i = 0; i < this.autoRuleArray.length; ++i) {
      if (i === rowindex) {
        this.autoRuleArray[i].OPTM_MIN_FILLPRCNT = value;
      }
    }
    this.isUpdateHappen = true
  }

  updateMatWTfill(lotTemplateVar, value, rowindex, gridData: any) {
    value = Number(value).toFixed(Number(localStorage.getItem("DecimalPrecision")));
    if(value < 0 ){
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      value = 0;
    }

    for (let i = 0; i < this.autoRuleArray.length; ++i) {
      if (i === rowindex) {
        this.autoRuleArray[i].OPTM_PACKING_MATWT = value;
      }
    }
    this.isUpdateHappen = true
  }

  GetItemCodeList(index) {
    this.showLoader = true;
    this.index = index;
    this.commonservice.GetItemCodeList().subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.hideLookup = false;
          this.serviceData = data;
          this.lookupfor = "ItemsList";
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

  openConfirmForDelete(rowIndex, gridItem) {
    this.autoRuleArray.splice(rowIndex, 1);
    gridItem = this.autoRuleArray;
    this.isUpdateHappen = true
  }

  isValidateCalled: boolean = false;
  async validateBeforeSubmit(): Promise<any> {
    this.isValidateCalled = true;
    var currentFocus = document.activeElement.id;
    console.log("validateBeforeSubmit current focus: " + currentFocus);

    if (currentFocus != undefined) {
      if (currentFocus == "InboundDetailVendScanInputField") {
        return this.OnContainerTypeChange();
      } else if (currentFocus == "ctrParentContainerType") {
        return this.OnContainerTypeChange();
      }
    }
  }

  async IsValidItemCode(iBtchIndex, value, display_name) {
    if (value == undefined || value == "") {
      return;
    }
    this.showLoader = true;
    var result = false;
    await this.commonservice.IsValidItemCode(value).then(
      (data: any) => {
        this.showLoader = false;
        result = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.isUpdateHappen = true
          if (data.length > 0) {
            if (this.isBinRangeExist(data[0].ItemCode)) {
              this.toastr.error('', this.translate.instant("CAR_itemcode_exists_Msg"));
              this.autoRuleArray[iBtchIndex].OPTM_ITEMCODE = ' '
              result = false;
              setTimeout(() => {
                this.autoRuleArray[iBtchIndex].OPTM_ITEMCODE = ''
              }, 500)
            } else {
              this.autoRuleArray[iBtchIndex].OPTM_ITEMCODE = data[0].ItemCode;
              result = true;
            }
          } else {
            this.autoRuleArray[iBtchIndex].OPTM_ITEMCODE = "";
            display_name.value = "";
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
          }
        } else {
          this.autoRuleArray[iBtchIndex].OPTM_ITEMCODE = "";
          display_name.value = "";
          this.toastr.error('', this.translate.instant("InvalidItemCode"));
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

  isBinRangeExist(value) {
    let data = this.autoRuleArray.filter(item => item.OPTM_ITEMCODE === value)
    if (data.length > 0) {
      return true;
    } else {
      return false;
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
        case ("BackConfirmation"):
          this.carmainComponent.carComponent = 1;
          break;
        case ("Cancel"): {
          this.router.navigate(['home/dashboard']);
          break;
        }
      }
    } else {
      if ($event.Status == "no") {
        // switch ($event.From) {
        //   case ("Cancel"):
        //     break;
        // }
      }
    }
  }
}

