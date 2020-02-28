import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { InboundService } from '../../services/inbound.service';
import { Commonservice } from '../../services/commonservice.service';
import { CTMasterComponent } from '../ctmaster.component';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ctupdate',
  templateUrl: './ctupdate.component.html',
  styleUrls: ['./ctupdate.component.scss']
})
export class CTUpdateComponent implements OnInit {
  CT_Description: string;
  CT_Length: string;
  CT_Width: string;
  CT_Height: string;
  CT_Max_Width: string;
  CT_Tare_Width: string;
  CT_ContainerType: string;
  CT_ROW: any;
  BtnTitle: string;
  showLoader: boolean = false;
  isUpdate: boolean = false;

  constructor(private inboundService: InboundService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private inboundMasterComponent: CTMasterComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    let CtRow = localStorage.getItem("CT_ROW")
    if(CtRow != undefined && CtRow != ""){
      this.CT_ROW = JSON.parse(localStorage.getItem("CT_ROW"));
      this.CT_ContainerType = this.CT_ROW[0];
      this.CT_Description = this.CT_ROW[1];
      this.CT_Length = this.CT_ROW[2];
      this.CT_Width = this.CT_ROW[3];
      this.CT_Height = this.CT_ROW[4];
      this.CT_Max_Width = this.CT_ROW[5];
      if(localStorage.getItem("Action") == "copy"){
        this.isUpdate = false;
        this.BtnTitle = this.translate.instant("CT_Add");
      }else{
        this.isUpdate = true;
        this.BtnTitle = this.translate.instant("CT_Update");
      }
    }else{
      this.isUpdate = false;
      this.BtnTitle = this.translate.instant("CT_Add");
    }
  }

  formatCT_Width() {
    this.CT_Width = Number(this.CT_Width).toFixed(Number(localStorage.getItem("DecimalPrecision")));
  }

  formatCT_Height() {
    this.CT_Height = Number(this.CT_Height).toFixed(Number(localStorage.getItem("DecimalPrecision")));
  }

  formatCT_Length() {
    this.CT_Length = Number(this.CT_Length).toFixed(Number(localStorage.getItem("DecimalPrecision")));
  }

  formatCT_Max_Width() {
    this.CT_Max_Width = Number(this.CT_Max_Width).toFixed(Number(localStorage.getItem("DecimalPrecision")));
  }

  formatCT_Tare_Width() {
    this.CT_Tare_Width = Number(this.CT_Tare_Width).toFixed(Number(localStorage.getItem("DecimalPrecision")));
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
    }
    return true;
  }

  onAddUpdateClick() {
    if(!this.validateFields()){
      return;
    }
    if(this.BtnTitle == this.translate.instant("CT_Update")){
      this.updateContainerType();
    }else{
      this.addContainerType();
    }
  }

  addContainerType() {
    this.showLoader = true;
    this.inboundService.InsertIntoContainerType(this.CT_ContainerType, this.CT_Description, 
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
    this.inboundService.UpdateContainerType(this.CT_ContainerType, this.CT_Description, 
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

}
