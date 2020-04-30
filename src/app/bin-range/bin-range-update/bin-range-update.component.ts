import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { Router } from '../../../../node_modules/@angular/router';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { BinRangeMainComponent } from '../bin-range-main/bin-range-main.component';
import { BinRangeService } from '../../services/binrange.service';

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
  BinRangesRow: any;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService, private router: Router, private binrangesMainComponent: BinRangeMainComponent,
  private binRangeService: BinRangeService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    let BinRangesRow = localStorage.getItem("BinRangesRow")
    if (BinRangesRow != undefined && BinRangesRow != "") {
      this.BinRangesRow = JSON.parse(localStorage.getItem("BinRangesRow"));
      this.BinRange = this.BinRangesRow.OPTM_BIN_RANGE;
      this.FromBinCode = this.BinRangesRow.OPTM_FROM_BIN;
      this.WHSCODE = this.BinRangesRow.OPTM_WHSCODE;
      this.ToBinCode = this.BinRangesRow.OPTM_TO_BIN;
      this.Description = this.BinRangesRow.OPTM_RANGE_DESC;
      if (localStorage.getItem("Action") == "copy") {
        this.isUpdate = false;
        //this.WHSCODE = ''
        this.BinRange = ''
        // this.FromBinCode = '';
        // this.ToBinCode = '';
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

  getLookupKey($event) {
    if ($event != null && $event == "close") {
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "WareHouse") {
      this.WHSCODE = $event.WhsCode;
      this.FromBinCode = '';
      this.ToBinCode = '';
    }else if (this.lookupfor == "From_BinList") {
      this.FromBinCode = $event.BinCode;
    }else if (this.lookupfor == "To_BinList") {
      this.ToBinCode = $event.BinCode;
    }
  }

  IsValidWHSCODE() {
    if(this.WHSCODE == undefined || this.WHSCODE == ""){
      return;
    }
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
            this.FromBinCode = '';
            this.ToBinCode = '';
          }else{
            this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
            this.WHSCODE = "";
            this.FromBinCode = '';
            this.ToBinCode = '';
          }
          
        } else {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.WHSCODE = "";
          this.FromBinCode = '';
          this.ToBinCode = '';
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
    if (this.WHSCODE == '' || this.WHSCODE == undefined) {
      this.toastr.error('', this.translate.instant("Login_SelectwarehouseMsg"));
      return false;
    }else if (this.BinRange == '' || this.BinRange == undefined) {
      this.toastr.error('', this.translate.instant("BinRangeBlankMsg"));
      return false;
    }else if (this.Description == '' || this.Description == undefined) {
      this.toastr.error('', this.translate.instant("BinRangeDescBlankMsg"));
      return false;
    }else if (this.FromBinCode == '' || this.FromBinCode == undefined) {
      this.toastr.error('', this.translate.instant("ZoneFromBinCannotBlankMsg"));
      return false;
    }else if (this.ToBinCode == '' || this.ToBinCode == undefined) {
      this.toastr.error('', this.translate.instant("ZoneToBinCannotBlankMsg"));
      return false;
    }
    return true;
  }

  public onAddUpdateClick() {
    if (!this.validateFields()) {
      return;
    }
    if (this.BtnTitle == this.translate.instant("CT_Update")) {
      this.UpdateBinRange();
    } else {
      this.InsertIntoBinRange();
    }
  }

  InsertIntoBinRange() {
    this.showLoader = true;
    this.binRangeService.InsertIntoWareHouseBinRange(this.BinRange, this.WHSCODE, this.FromBinCode, this.ToBinCode, this.Description).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', data.OUTPUT[0].RESULT);
            this.binrangesMainComponent.binRangesComponent = 1;
          } else if (data.OUTPUT[0].RESULT == "Data Already Exists") {
            this.toastr.error('', this.translate.instant("UserGroupAlreadyExists"));
          } else {
            this.toastr.error('', data.OUTPUT[0].RESULT);
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

  IsValidBinCode(from) {
    let bincode = "";
    if(from == "frombin"){
      bincode = this.FromBinCode;
    }else{
      bincode = this.ToBinCode;
    }
    if(bincode == undefined || bincode == ""){
      return;
    }

    if(this.WHSCODE == "" || this.WHSCODE == undefined){
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }

    this.showLoader = true;
    this.commonservice.IsValidBinCode(this.WHSCODE, bincode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if(from == "frombin"){
              this.FromBinCode = data[0].BinCode;
            }else{
              this.ToBinCode = data[0].BinCode;
            }
          } else {
            this.toastr.error('', this.translate.instant("Invalid_Bin_Code"));
            if(from == "frombin"){
              this.FromBinCode = "";
            }else{
              this.ToBinCode = "";
            }
          }
        } else {
          this.toastr.error('', this.translate.instant("Invalid_Bin_Code"));
          if(from == "frombin"){
              this.FromBinCode = "";
            }else{
              this.ToBinCode = "";
            }
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

  UpdateBinRange() {
    this.showLoader = true;
    this.binRangeService.UpdateWareHouseBinRange(this.BinRange, this.WHSCODE, this.FromBinCode, this.ToBinCode, this.Description).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', data.OUTPUT[0].RESULT);
            this.binrangesMainComponent.binRangesComponent = 1;
          } else if (data.OUTPUT[0].RESULT == "Data Already Exists") {
            this.toastr.error('', this.translate.instant("Carrier_CarrierIdAlreadyExist"));
          } else {
            this.toastr.error('', data.OUTPUT[0].RESULT);
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
    this.binrangesMainComponent.binRangesComponent = 1;
  }
}
