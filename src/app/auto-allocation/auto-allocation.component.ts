import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Commonservice } from '../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-auto-allocation',
  templateUrl: './auto-allocation.component.html',
  styleUrls: ['./auto-allocation.component.scss']
})
export class AutoAllocationComponent implements OnInit {

  ShipToCodeFrom: string = "";
  ShipToCodeTo: string = "";
  ShipIdFrom: string = "";
  ShipIdTo: string = "";
  ShipmentCodeFrom: string = "";
  ShipmentCodeTo: string = "";
  serviceData: any[];
  lookupfor: string;
  hideLookup: boolean = true;
  public mobileMedia = "(max-width: 767px)";
  public desktopMedia = "(min-width: 768px)";
  showLoader: boolean = false;

  constructor(private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.initialize();
    });
  }

  initialize() {

  }

  ngOnInit() {
  }

  getlookupSelectedItem(event) {
    if (event != null && event == "close") {
      this.hideLookup = false;
      return;
    }
    // else if (this.lookupfor == "ShipFrom") {
    //   this.ShipToCodeFrom = event.Address;
    // }
    // else if (this.lookupfor == "ShipTo") {
    //   this.ShipToCodeTo = event.Address;
    // }
    else if (this.lookupfor == "ShipIdFrom") {
      this.ShipIdFrom = event.OPTM_SHIPMENTID;
      this.ShipmentCodeFrom = event.OPTM_SHIPMENT_CODE;
    }
    else if (this.lookupfor == "ShipIdTo") {
      this.ShipIdTo = event.OPTM_SHIPMENTID;
      this.ShipmentCodeTo = event.OPTM_SHIPMENT_CODE;
    }
  }

  schedularFromDate: any;
  schedularToDate: any;
  onScheduleFromDateChange(event) {
    console.log("onScheduleFromDateChange: s" + event.getDate())
    var cDate = new Date();
    event = new Date(event.getFullYear(), event.getMonth(), event.getDate());
    cDate = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate());
    if (event.getTime() < cDate.getTime()) {
      this.schedularFromDate = '';
      this.toastr.error('', this.translate.instant("SchDateValMsg"));
    }
  }

  onScheduleToDateChange(event) {
    console.log("onScheduleToDateChange: s" + event.getDate())
    var cDate = new Date();
    event = new Date(event.getFullYear(), event.getMonth(), event.getDate());
    cDate = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate());
    if (event.getTime() < cDate.getTime()) {
      this.schedularToDate = '';
      this.toastr.error('', this.translate.instant("SchDateValMsg"));
    }
  }

  GetShipmentIdWithAllocAndPartAllocStatus(fieldName) {
    var shipId = ''
    if (fieldName == 'ShipIdFrom') {
      shipId = this.ShipIdFrom
    } else {
      shipId = this.ShipIdTo
    }
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetShipmentIdWithAllocAndPartAllocStatus(shipId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (shipId == undefined || shipId == '') {
            this.serviceData = data;
            this.lookupfor = fieldName;
          } else {
            if (data.length > 0) {
              if (fieldName == 'ShipIdFrom') {
                this.ShipIdFrom = data[0].OPTM_SHIPMENT_CODE
              } else {
                this.ShipIdTo = data[0].OPTM_SHIPMENT_CODE
              }
            } else {
              if (fieldName == 'ShipIdFrom') {
                this.ShipIdFrom = ''
              } else {
                this.ShipIdTo = ''
              }
            }
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

  onAutoAllocClick() {
    this.showLoader = true;
    this.commonservice.AllocateContAndBtchSerToShipment(this.ShipIdFrom, this.ShipIdTo,
      this.schedularFromDate, this.schedularToDate).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            this.ShipIdFrom = ''
            this.ShipIdTo = ''
            this.schedularFromDate = ''
            this.schedularToDate = ''
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
