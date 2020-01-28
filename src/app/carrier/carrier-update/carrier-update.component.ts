import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { CarrierMainComponent } from '../carrier-main/carrier-main.component';
import { CarrierService } from 'src/app/services/carrier.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrier-update',
  templateUrl: './carrier-update.component.html',
  styleUrls: ['./carrier-update.component.scss']
})
export class CarrierUpdateComponent implements OnInit {

  DD_ID: string;
  DD_DESC: string;
  DD_ROW: any;
  BtnTitle: string;
  isUpdate: boolean = false;
  showLoader: boolean = false;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private carrierMainComponent: CarrierMainComponent, private carrierService: CarrierService, private router: Router) { }

  ngOnInit() {
    let DD_ROW = localStorage.getItem("DD_ROW")
    if (DD_ROW != undefined && DD_ROW != "") {
      this.DD_ROW = JSON.parse(localStorage.getItem("DD_ROW"));
      this.DD_ID = this.DD_ROW[0];
      this.DD_DESC = this.DD_ROW[1];
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
    this.carrierMainComponent.carrierComponent = 1;
    // this.onAddUpdateClick();
  }

  validateFields(): boolean {
    if (this.DD_ID == '' || this.DD_ID == undefined) {
      this.toastr.error('', this.translate.instant("DockDoorId_Blank_Msg"));
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
    this.carrierService.InsertIntoDockDoor(this.DD_ID, this.DD_DESC).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.error('', data[0].RESULT);
            this.carrierMainComponent.carrierComponent = 1;
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

  UpdateDockDoor() {
    this.showLoader = true;
    this.carrierService.UpdateDockDoor(this.DD_ID, this.DD_DESC).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.error('', data[0].RESULT);
            this.carrierMainComponent.carrierComponent = 1;
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
}
