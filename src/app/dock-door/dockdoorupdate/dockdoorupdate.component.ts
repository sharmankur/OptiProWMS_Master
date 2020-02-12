import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { DockdoormainComponent } from '../dockdoormain/dockdoormain.component';
import { DockdoorService } from '../../services/dockdoor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dockdoorupdate',
  templateUrl: './dockdoorupdate.component.html',
  styleUrls: ['./dockdoorupdate.component.scss']
})
export class DockdoorupdateComponent implements OnInit {

  DD_ID: string;
  DD_DESC: string;
  DD_ROW: any;
  BtnTitle: string;
  isUpdate: boolean = false;
  showLoader: boolean = false;
  WHSCODE: string;
  hideLookup: boolean = true;
  lookupfor: string;
  serviceData: any[];

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private ddmainComponent: DockdoormainComponent, private ddService: DockdoorService, private router: Router) { }

  ngOnInit() {
    let DD_ROW = localStorage.getItem("DD_ROW")
    if (DD_ROW != undefined && DD_ROW != "") {
      this.DD_ROW = JSON.parse(localStorage.getItem("DD_ROW"));
      this.DD_ID = this.DD_ROW.OPTM_DOCKDOORID;
      this.DD_DESC = this.DD_ROW.OPTM_DESC;
      this.WHSCODE = this.DD_ROW.OPTM_WHSE;
      if (localStorage.getItem("Action") == "copy") {
        this.isUpdate = false;
        this.BtnTitle = this.translate.instant("CT_Add");
      } else {
        this.isUpdate = true;
        this.BtnTitle = this.translate.instant("CT_Update");
      }
    } else {
      this.isUpdate = false;
      this.BtnTitle = this.translate.instant("CT_Add");
    }
  }


  onCancelClick() {
    this.ddmainComponent.ddComponent = 1;
    // this.onAddUpdateClick();
  }

  validateFields(): boolean {
    if (this.DD_ID == '' || this.DD_ID == undefined) {
      this.toastr.error('', this.translate.instant("DockDoorId_Blank_Msg"));
      return false;
    } else if (this.WHSCODE == '' || this.WHSCODE == undefined) {
      this.toastr.error('', this.translate.instant("Whs_blank_msg"));
      return false;
    }
    return true;
  }

  public onAddUpdateClick() {
    if (!this.validateFields()) {
      return;
    }
    if (this.BtnTitle == this.translate.instant("CT_Update")) {
      this.UpdateDockDoor();
    } else {
      this.InsertIntoDockDoor();
    }
  }

  InsertIntoDockDoor() {
    this.showLoader = true;
    this.ddService.InsertIntoDockDoor(this.DD_ID, this.DD_DESC, this.WHSCODE).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', data[0].RESULT);
            this.ddmainComponent.ddComponent = 1;
          } else {
            this.toastr.error('', data[0].RESULT);
          }
        } else {
          this.toastr.success('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  UpdateDockDoor() {
    this.showLoader = true;
    this.ddService.UpdateDockDoor(this.DD_ID, this.DD_DESC, this.WHSCODE).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', data[0].RESULT);
            this.ddmainComponent.ddComponent = 1;
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

  onWhsLookupClick() {
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
          this.lookupfor = "WareHouse"
          this.hideLookup = false;
          this.serviceData = data;
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

  IsValidWhseCode() {
    this.showLoader = true;
    this.commonservice.IsValidWhseCode(this.WHSCODE).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data.length > 0){
            this.WHSCODE = data[0].WhsCode;
          }else{
            this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
            this.WHSCODE = "";
          }
          
        } else {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.WHSCODE = "";
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
    else if (this.lookupfor == "WareHouse") {
      this.WHSCODE = $event[0];
    }
  }

}
