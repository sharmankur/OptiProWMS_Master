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

  // ShipToCodeFrom: string = "";
  // ShipToCodeTo: string = "";
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

  lookup: any;
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
    else if (this.lookup == "ShipIdFrom") {
      this.ShipIdFrom = event.OPTM_SHIPMENTID;
      this.ShipmentCodeFrom = event.OPTM_SHIPMENT_CODE;
    }
    else if (this.lookup == "ShipIdTo") {
      this.ShipIdTo = event.OPTM_SHIPMENTID;
      this.ShipmentCodeTo = event.OPTM_SHIPMENT_CODE;
    }
  }

  schedularFromDate: any;
  schedularToDate: any;
  tempFromDate: Date;
  tempToDate: Date;
  onScheduleFromDateChange(event) {
    console.log("onScheduleFromDateChange: s" + event.getDate())
    var cDate = new Date();
    event = new Date(event.getFullYear(), event.getMonth(), event.getDate());
    cDate = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate());
    this.tempFromDate = event
    if (event.getTime() < cDate.getTime()) {
      this.schedularFromDate = '';
      this.toastr.error('', this.translate.instant("SchDateValMsg"));
    }

    if (this.tempToDate.getTime() < event.getTime()) {
      this.schedularFromDate = '';
      this.toastr.error('', this.translate.instant("SchDateGreaterValMsg"));
    }
  }

  onScheduleToDateChange(event) {
    console.log("onScheduleToDateChange: s" + event.getDate())
    var cDate = new Date();
    event = new Date(event.getFullYear(), event.getMonth(), event.getDate());
    cDate = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate());
    this.tempToDate = event;
    if (event.getTime() < cDate.getTime()) {
      this.schedularToDate = '';
      this.toastr.error('', this.translate.instant("SchDateValMsg"));
    }

    if (event.getTime() < this.tempFromDate.getTime()) {
      this.schedularToDate = '';
      this.toastr.error('', this.translate.instant("SchDateGreaterValMsg"));
    }
  }

  GetShipmentIdWithAllocAndPartAllocStatus(fieldName) {
    var shipId = ''
    if (fieldName == 'ShipIdFrom') {
      shipId = this.ShipmentCodeFrom
    } else {
      shipId = this.ShipmentCodeTo
    }
    this.showLoader = true;
    this.hideLookup = true;
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
            this.serviceData = data.Table;
            this.lookup = fieldName;
            this.lookupfor = "AutoAllocate"
            this.hideLookup = false;
          } else {
            if (data.Table.length > 0) {
              if (fieldName == 'ShipIdFrom') {
                this.ShipmentCodeFrom = data.Table[0].OPTM_SHIPMENT_CODE
              } else {
                this.ShipmentCodeTo = data.Table[0].OPTM_SHIPMENT_CODE
              }
            } else {
              if (fieldName == 'ShipIdFrom') {
                this.ShipmentCodeFrom = ''
              } else {
                this.ShipmentCodeTo = ''
              }
              this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
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
    if (this.ShipmentCodeFrom == undefined || this.ShipmentCodeFrom == '') {
      this.toastr.error('', this.translate.instant("ShipmentFromBlankMsg"));
      return
    } else if (this.ShipmentCodeTo == undefined || this.ShipmentCodeTo == '') {
      this.toastr.error('', this.translate.instant("ShipmentFromBlankMsg"));
      return
    } else if (this.schedularFromDate == undefined || this.schedularFromDate == '') {
      this.toastr.error('', this.translate.instant("SheduleBlankMsg"));
      return
    } else if (this.schedularToDate == undefined || this.schedularToDate == '') {
      this.toastr.error('', this.translate.instant("SheduleBlankMsg"));
      return
    }
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
            this.ShipmentCodeFrom = ''
            this.ShipmentCodeTo = ''
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
