import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContainerTypeService } from '../../services/ContainerType.service';
import { Commonservice } from '../../services/commonservice.service';
import { CTMasterComponent } from '../ctmaster.component';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonData } from 'src/app/models/CommonData';

@Component({
  selector: 'app-ctupdate',
  templateUrl: './ctupdate.component.html',
  styleUrls: ['./ctupdate.component.scss']
})
export class CTUpdateComponent implements OnInit {
  CT_Description: string="";
  CT_Length: string;
  CT_Width: string;
  CT_Height: string;
  CT_Max_Width: string = "";
  CT_Tare_Width: string = "";
  CT_ContainerType: string;
  CT_ROW: any;
  BtnTitle: string;
  showLoader: boolean = false;
  isUpdate: boolean = false;
  isUpdateHappen: boolean = false;
  commonData: any = new CommonData(this.translate);
  maxCodeLength: any = ''
  maxDescLength: any = ''
  maxNOLength;
  constructor(private containerTypeService: ContainerTypeService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private inboundMasterComponent: CTMasterComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.BtnTitle = this.translate.instant("Submit");
    this.maxCodeLength = this.commonservice.maxCodeLength;
    this.maxDescLength = this.commonservice.maxDescLength;
    this.maxNOLength = this.commonservice.maxNOLength;
    let CtRow = localStorage.getItem("CT_ROW")
    if(CtRow != undefined && CtRow != ""){
      this.CT_ROW = JSON.parse(localStorage.getItem("CT_ROW"));
      this.CT_ContainerType = this.CT_ROW.OPTM_CONTAINER_TYPE;
      this.CT_Description = this.CT_ROW.OPTM_DESC;
      this.CT_Length = this.CT_ROW.OPTM_LENGTH;
      this.CT_Width = this.CT_ROW.OPTM_WIDTH;
      this.CT_Height = this.CT_ROW.OPTM_HEIGHT;
      this.CT_Max_Width = this.CT_ROW.OPTM_MAXWEIGHT;
      this.CT_Tare_Width = this.CT_ROW.OPTM_TARE_WT;
      this.formatCT_Tare_Width("");
      if(localStorage.getItem("Action") == "copy"){
        this.CT_ContainerType = ''
        this.isUpdate = false;
      }else{
        this.isUpdate = true;
      }
    }else{
      this.isUpdate = false;
    }

    this.GetUnitOfMeasure()
  }

  formatCT_Width() {
    if(Number(this.CT_Width) < 0){
      this.CT_Width = ''
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      return false;
    }
    this.CT_Width = Number(this.CT_Width).toFixed(Number(localStorage.getItem("DecimalPrecision")));
    this.isUpdateHappen = true
  }

  formatCT_Height() {
    if(Number(this.CT_Height) < 0 ){
      this.CT_Height = ''
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      return false;
    }
    this.CT_Height = Number(this.CT_Height).toFixed(Number(localStorage.getItem("DecimalPrecision")));
    this.isUpdateHappen = true
  }

  formatCT_Length() {
    if(Number(this.CT_Length) < 0 ){
      this.CT_Length = ''
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      return false;
    }
    this.CT_Length = Number(this.CT_Length).toFixed(Number(localStorage.getItem("DecimalPrecision")));
    this.isUpdateHappen = true
  }

  formatCT_Max_Width() {
    if(Number(this.CT_Max_Width) < 0 ){
      this.CT_Max_Width = ''
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      return false;
    }
    this.CT_Max_Width = Number(this.CT_Max_Width).toFixed(Number(localStorage.getItem("DecimalPrecision")));
    this.isUpdateHappen = true
  }

  formatCT_Tare_Width(value) {
    if(Number(this.CT_Tare_Width) < 0 ){
      this.CT_Tare_Width = ''
      this.toastr.error('', this.translate.instant("CannotLessThenZero"));
      return false;
    }
    this.CT_Tare_Width = Number(this.CT_Tare_Width).toFixed(Number(localStorage.getItem("DecimalPrecision")));
    if(value == 'blur'){
      this.isUpdateHappen = true
    }

    if(Number(this.CT_Max_Width) <= Number(this.CT_Tare_Width)){
      this.toastr.error('', this.translate.instant("MaxWeightValMsg"));
    }
  }
  
  onDescChange(){
    this.isUpdateHappen = true
  }

  validateFields(): boolean{
    if(this.CT_ContainerType == '' || this.CT_ContainerType == undefined){
      this.toastr.error('', this.translate.instant("CT_ContainerType_Blank_Msg"));
      return false;
    }
    else if(this.CT_Length == "NaN" || this.CT_Length == undefined || Number(this.CT_Length) <= 0 ){
      this.toastr.error('', this.translate.instant("CTLengthMsg"));
      return false;
    }
    else if(this.CT_Width == "NaN" || this.CT_Width == undefined || Number(this.CT_Width) <= 0 ){
      this.toastr.error('', this.translate.instant("CTwidthMsg"));
      return false;
    }
    else if(this.CT_Height == "NaN" || this.CT_Height == undefined || Number(this.CT_Height) <= 0 ){
      this.toastr.error('', this.translate.instant("CTHeightMsg"));
      return false;
    }
    else if(this.CT_Max_Width == "NaN" || this.CT_Max_Width == undefined || 
    (Number(this.CT_Max_Width) <= 0)){
      this.CT_Max_Width = "0";
      this.toastr.error('', this.translate.instant("WeightTareValMsg"));
      return false
    } else if(Number(this.CT_Max_Width) <= 0){
      this.toastr.error('', this.translate.instant("WeightTareValMsg"));
      return false
    } else if(Number(this.CT_Tare_Width) <= 0 ){
      this.toastr.error('', this.translate.instant("WeightTareValMsg"));
      return false
    } else if(Number(this.CT_Max_Width) <= Number(this.CT_Tare_Width)){
      this.toastr.error('', this.translate.instant("MaxWeightValMsg"));
      return false
    }
    return true;
  }

  onAddUpdateClick() {
    if(!this.validateFields()){
      return;
    }
    if(this.isUpdate){
      this.updateContainerType();
    }else{
      this.addContainerType();
    }
  }

  addContainerType() {
    this.showLoader = true;
    this.containerTypeService.InsertIntoContainerType(this.CT_ContainerType, this.CT_Description, 
      this.CT_Length, this.CT_Width, this.CT_Height, this.CT_Max_Width, this.CT_Tare_Width).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.toastr.success('', data[0].RESULT);
            this.inboundMasterComponent.inboundComponent = 1;
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

  updateContainerType() {
    this.showLoader = true;
    this.containerTypeService.UpdateContainerType(this.CT_ContainerType, this.CT_Description, 
      this.CT_Length, this.CT_Width, this.CT_Height, this.CT_Max_Width, this.CT_Tare_Width).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.toastr.success('', data[0].RESULT);
            this.inboundMasterComponent.inboundComponent = 1;
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

  onCancelClick() {
    this.inboundMasterComponent.inboundComponent = 1;
  }

  onBackClick(){
    if (this.isUpdateHappen) {
      this.showDialog("BackConfirmation", this.translate.instant("yes"), this.translate.instant("no"),
        this.translate.instant("Plt_DataDeleteMsg"));
      return true;
    } else {
      this.inboundMasterComponent.inboundComponent = 1;
    }
  }

  UnitModel: any = "";
  GetUnitOfMeasure() {
    this.showLoader = true;
    this.commonservice.GetUnitOfMeasure().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data != undefined && data.length > 0){
            this.UnitModel = data[0];
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

  onContainerTypeChange(event){
    this.isUpdateHappen = true
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
          this.inboundMasterComponent.inboundComponent = 1;
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
