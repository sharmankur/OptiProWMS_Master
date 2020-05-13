import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { CarrierMainComponent } from '../carrier-main/carrier-main.component';
import { CarrierService } from '../../services/carrier.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrier-update',
  templateUrl: './carrier-update.component.html',
  styleUrls: ['./carrier-update.component.scss']
})
export class CarrierUpdateComponent implements OnInit {

  carrierId: string = "";
  carrierDesc: string = "";
  DD_ROW: any;
  BtnTitle: string;
  isUpdate: boolean = false;
  showLoader: boolean = false;
  isUpdateHappen: boolean = false;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private carrierMainComponent: CarrierMainComponent, private carrierService: CarrierService, private router: Router) { }

  ngOnInit() {
    let DD_ROW = localStorage.getItem("DD_ROW")
    if (DD_ROW != undefined && DD_ROW != "") {
      this.DD_ROW = JSON.parse(localStorage.getItem("DD_ROW"));
      this.carrierId = this.DD_ROW.OPTM_CARRIERID;
      this.carrierDesc = this.DD_ROW.OPTM_DESC;
      if (localStorage.getItem("Action") == "copy") {
        this.carrierId = ''
        this.isUpdate = false;
        this.BtnTitle = this.translate.instant("Submit");
      } else {
        this.isUpdate = true;
        this.BtnTitle = this.translate.instant("Submit");
      }
    } else {
      this.isUpdate = false;
      this.BtnTitle = this.translate.instant("Submit");
    }
  }

  onBackClick(){
    if (this.isUpdateHappen) {
      this.showDialog("BackConfirmation", this.translate.instant("yes"), this.translate.instant("no"),
        this.translate.instant("Plt_DataDeleteMsg"));
      return true;
    } else {
      this.carrierMainComponent.carrierComponent = 1;
    }
  }
  
  onCancelClick() {
    this.carrierMainComponent.carrierComponent = 1;
    // this.onAddUpdateClick();
  }

  validateFields(): boolean {
    if (this.carrierId == '' || this.carrierId == undefined) {
      this.toastr.error('', this.translate.instant("CarrierIdbalnkMsg"));
      return false;
    }
    return true;
  }

  public onAddUpdateClick() {
    if (!this.validateFields()) {
      return;
    }
    if (this.BtnTitle == this.translate.instant("Submit")) {
      this.UpdateDockDoor();
    } else {
      this.InsertIntoDockDoor();
    }
  }

  InsertIntoDockDoor() {
    this.showLoader = true;
    this.carrierService.InsertIntoCarrier(this.carrierId, this.carrierDesc).subscribe(
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
            this.carrierMainComponent.carrierComponent = 1;
          } else if (data[0].RESULT == "Data Already Exists") {
            this.toastr.error('', this.translate.instant("Carrier_CarrierIdAlreadyExist"));
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
    this.carrierService.UpdateCarrier(this.carrierId, this.carrierDesc).subscribe(
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
            this.carrierMainComponent.carrierComponent = 1;
          } else if (data[0].RESULT == "Data Already Exists") {
            this.toastr.error('', this.translate.instant("Carrier_CarrierIdAlreadyExist"));
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

  onCarrierIdChangeBlur(){
    if(this.carrierId == undefined || this.carrierId == ""){
      return;
    }
    this.isUpdateHappen = true
  }

  onDescChangeBlur(){
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
          this.carrierMainComponent.carrierComponent = 1;
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
