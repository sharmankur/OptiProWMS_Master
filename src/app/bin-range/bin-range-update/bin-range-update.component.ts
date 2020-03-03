import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { Router } from '../../../../node_modules/@angular/router';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { BinRangeMainComponent } from '../bin-range-main/bin-range-main.component';

@Component({
  selector: 'app-bin-range-update',
  templateUrl: './bin-range-update.component.html',
  styleUrls: ['./bin-range-update.component.scss']
})
export class BinRangeUpdateComponent implements OnInit {

  hideLookup: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  WHSCODE: string;
  index: any;
  ToBinCode: string;
  FromBinCode: string;
  BinRange: string;
  Description: string;
  BtnTitle: string;
  isUpdate: boolean;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService, private router: Router, private binrangesMainComponent: BinRangeMainComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    let BinRangesRow = localStorage.getItem("BinRangesRow")
    if (BinRangesRow != undefined && BinRangesRow != "") {
      // this.BinRangesRow = JSON.parse(localStorage.getItem("BinRangesRow"));
      // this.carrierId = this.BinRangesRow[0];
      // this.carrierDesc = this.BinRangesRow[1];
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

  GetBinCode(lookupfor, index) {
    if (this.WHSCODE == undefined || this.WHSCODE == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }

    // this.binType = "from_bin"
    // this.showLoader = true;
    this.index = index;
    // this.fromType = type;
    this.showLoader = true;
    this.commonservice.GetBinCode(this.WHSCODE).subscribe(
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
          this.lookupfor = lookupfor;
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
    else if (this.lookupfor == "WareHouse") {
      this.WHSCODE = $event[0];
    }else if (this.lookupfor == "From_BinList") {
      this.FromBinCode = $event[0];
    }else if (this.lookupfor == "To_BinList") {
      this.ToBinCode = $event[0];
    }
  }

  IsValidWHSCODE() {
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

  validateFields(): boolean {
    if (this.BinRange == '' || this.BinRange == undefined) {
      this.toastr.error('', this.translate.instant("CarrierIdbalnkMsg"));
      return false;
    }else if (this.Description == '' || this.Description == undefined) {
      this.toastr.error('', this.translate.instant("CarrierIdbalnkMsg"));
      return false;
    }else if (this.ToBinCode == '' || this.ToBinCode == undefined) {
      this.toastr.error('', this.translate.instant("CarrierIdbalnkMsg"));
      return false;
    }else if (this.FromBinCode == '' || this.FromBinCode == undefined) {
      this.toastr.error('', this.translate.instant("CarrierIdbalnkMsg"));
      return false;
    }
    return true;
  }

  // public onAddUpdateClick() {
  //   if (!this.validateFields()) {
  //     return;
  //   }
  //   if (this.BtnTitle == this.translate.instant("CT_Update")) {
  //     this.UpdateBinRange();
  //   } else {
  //     this.InsertIntoBinRange();
  //   }
  // }

  // InsertIntoBinRange() {
  //   this.showLoader = true;
  //   this.carrierService.InsertIntoCarrier(this.carrierId, this.carrierDesc).subscribe(
  //     (data: any) => {
  //       this.showLoader = false;
  //       if (data != undefined) {
  //         if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
  //           this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
  //             this.translate.instant("CommonSessionExpireMsg"));
  //           return;
  //         }
  //         if (data[0].RESULT == this.translate.instant("DataSaved")) {
  //           this.toastr.success('', data[0].RESULT);
  //           this.carrierMainComponent.carrierComponent = 1;
  //         } else if (data[0].RESULT == "Data Already Exists") {
  //           this.toastr.error('', this.translate.instant("Carrier_CarrierIdAlreadyExist"));
  //         } else {
  //           this.toastr.error('', data[0].RESULT);
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

  // UpdateBinRange() {
  //   this.showLoader = true;
  //   this.carrierService.UpdateCarrier(this.carrierId, this.carrierDesc).subscribe(
  //     (data: any) => {
  //       this.showLoader = false;
  //       if (data != undefined) {
  //         if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
  //           this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
  //             this.translate.instant("CommonSessionExpireMsg"));
  //           return;
  //         }
  //         if (data[0].RESULT == this.translate.instant("DataSaved")) {
  //           this.toastr.success('', data[0].RESULT);
  //           this.carrierMainComponent.carrierComponent = 1;
  //         } else if (data[0].RESULT == "Data Already Exists") {
  //           this.toastr.error('', this.translate.instant("Carrier_CarrierIdAlreadyExist"));
  //         } else {
  //           this.toastr.error('', data[0].RESULT);
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

  onCancelClick() {
    this.binrangesMainComponent.binRangesComponent = 1;
  }
}
