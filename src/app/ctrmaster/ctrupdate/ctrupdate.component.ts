import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { CTRMainComponent } from '../ctrmain/ctrmain.component';
import { CTRMasterService } from '../../services/ctrmaster.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ctrupdate',
  templateUrl: './ctrupdate.component.html',
  styleUrls: ['./ctrupdate.component.scss']
})
export class CTRUpdateComponent implements OnInit {

  CTR_ParentContainerType: string;
  CTR_ConainerPerParent: string;
  CTR_ConatainerPartofParent: string;
  CTR_ContainerType: string;
  CTR_ROW: any;
  BtnTitle: string;
  isUpdate: boolean = false;
  showLoader: boolean = false;
  hideLookup: boolean = true;
  lookupfor: string;
  serviceData: any[];
  
  constructor(private commonservice: Commonservice, private toastr: ToastrService, private translate: TranslateService, private ctrmainComponent: CTRMainComponent, private ctrmasterService: CTRMasterService, private router: Router
    ) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    let CtrRow = localStorage.getItem("CTR_ROW")
    if(CtrRow != undefined && CtrRow != ""){
    this.CTR_ROW = JSON.parse(localStorage.getItem("CTR_ROW"));
      this.CTR_ContainerType = this.CTR_ROW[0];
      this.CTR_ParentContainerType = this.CTR_ROW[1];
      this.CTR_ConainerPerParent = this.CTR_ROW[2];
      this.CTR_ConatainerPartofParent = this.CTR_ROW[3];
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

  onCancelClick(){
    this.ctrmainComponent.ctrComponent = 1;
  }

  validateFields(): boolean{
    if(this.CTR_ContainerType == '' || this.CTR_ContainerType == undefined){
      this.toastr.error('', this.translate.instant("CT_ContainerType_Blank_Msg"));
      return false;
    }
    else if(this.CTR_ParentContainerType == '' || this.CTR_ParentContainerType == undefined){
      this.toastr.error('', this.translate.instant("CTR_ParentContainerType_Blank_Msg"));
      return false;
    }
    return true;
  }

  async onAddUpdateClick() {
    if(!this.validateFields()){
      return;
    }

    if(this.BtnTitle == this.translate.instant("CT_Update")){
      this.UpdateContainerRelationship();
    }else{
      this.InsertIntoContainerRelationship();
    }
  }

  async InsertIntoContainerRelationship() {
    var result = await this.validateBeforeSubmit();
    this.isValidateCalled = false;
    console.log("validate result: " + result);
    if (result != undefined && result == false) {
      return;
    }

    this.showLoader = true;
    this.ctrmasterService.InsertIntoContainerRelationship(this.CTR_ContainerType, this.CTR_ParentContainerType, 
      this.CTR_ConainerPerParent, this.CTR_ConatainerPartofParent).then(
      (data: any) => {
        console.log("inside InsertIntoContainerRelationship")
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.toastr.success('', data[0].RESULT);
            this.ctrmainComponent.ctrComponent = 1;
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

  async UpdateContainerRelationship() {
    var result = await this.validateBeforeSubmit();
    this.isValidateCalled = false;
    console.log("validate result: " + result);
    if (result != undefined && result == false) {
      return;
    }

    this.showLoader = true;
    this.ctrmasterService.UpdateContainerRelationship(this.CTR_ContainerType, this.CTR_ParentContainerType, 
      this.CTR_ConainerPerParent, this.CTR_ConatainerPartofParent).then(
      (data: any) => {
        console.log("inside UpdateContainerRelationship")
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.toastr.error('', data[0].RESULT);
            this.ctrmainComponent.ctrComponent = 1;
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

  OnContainerTypeChangeBlur(){
    if(this.isValidateCalled){
      return;
    }
    this.OnContainerTypeChange();
  }

  async OnContainerTypeChange(){
    if(this.CTR_ContainerType == undefined || this.CTR_ContainerType == ""){
      return;
    }
    this.showLoader = true;
    var result = false;
    await this.commonservice.IsValidContainerType(this.CTR_ContainerType).then(
      (data: any) => {
        this.showLoader = false;
        result = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data.length > 0){
            this.CTR_ContainerType = data[0].OPTM_CONTAINER_TYPE;
            result = true;
          }else{
            this.CTR_ContainerType = "";
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          }
        } else {
          this.CTR_ContainerType = "";
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

  OnParentContainerTypeChangeBlur(){
    if(this.isValidateCalled){
      return;
    }
    this.OnParentContainerTypeChange();
  }

  async OnParentContainerTypeChange(){
    if(this.CTR_ParentContainerType == undefined || this.CTR_ParentContainerType == ""){
      return;
    }
    this.showLoader = true;
    var result = false;
    await this.commonservice.IsValidContainerType(this.CTR_ParentContainerType).then(
      (data: any) => {
        this.showLoader = false;
        result = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data.length > 0){
            this.CTR_ParentContainerType = data[0].OPTM_CONTAINER_TYPE;
            result = true;
          }else{
            this.CTR_ParentContainerType = "";
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          }
        } else {
          this.CTR_ParentContainerType = "";
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  GetDataForContainerType(fieldName) {
    this.showLoader = true;
    
    this.commonservice.GetDataForContainerType().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.hideLookup = false;
          this.serviceData = data;
          if(fieldName == "CT"){
            this.lookupfor = "CTList";
          }else{
            this.lookupfor = "PCTList";
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
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "CTList") {
      this.CTR_ContainerType = $event[0];
    }
    else if (this.lookupfor == "PCTList") {
      this.CTR_ParentContainerType = $event[0];
    }
  }

  formatCTR_ConainerPerParent() {
    this.CTR_ConainerPerParent = Number(this.CTR_ConainerPerParent).toFixed(Number(localStorage.getItem("DecimalPrecision")));
  }

  formatCTR_ConatainerPartofParent() {
    this.CTR_ConatainerPartofParent = Number(this.CTR_ConatainerPartofParent).toFixed(Number(localStorage.getItem("DecimalPrecision")));
  }

  isValidateCalled: boolean = false;
  async validateBeforeSubmit(): Promise<any> {
    this.isValidateCalled = true;
    var currentFocus = document.activeElement.id;
    console.log("validateBeforeSubmit current focus: " + currentFocus);

    if (currentFocus != undefined) {
      if (currentFocus == "CTR_ContainerTypeScanInputField") {
        return this.OnContainerTypeChange();
      } else if(currentFocus == "ctrParentContainerType"){
        return this.OnParentContainerTypeChange();
      }
    }
  }
}










