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


  schedularFromDate: any;
  schedularToDate: any;
  tempFromDate: Date;
  tempToDate: Date;
  scheduleFromDate: string = "";
  scheduleToDate: string = "";
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
  isUpdateHappen: boolean = false

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
      if (this.ShipmentCodeTo == "" || this.ShipmentCodeTo == undefined) {
        this.ShipmentCodeTo = event.OPTM_SHIPMENT_CODE
        this.ShipIdTo = event.OPTM_SHIPMENTID;
      }
    }
    else if (this.lookup == "ShipIdTo") {
      this.ShipIdTo = event.OPTM_SHIPMENTID;
      this.ShipmentCodeTo = event.OPTM_SHIPMENT_CODE;
    }
    this.isUpdateHappen = true

  }

  onScheduleFromDateChange(event) {
    this.isUpdateHappen = true
    console.log("onScheduleFromDateChange: s" + event.getDate())
    var cDate = new Date();
    event = new Date(event.getFullYear(), event.getMonth(), event.getDate());
    cDate = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate());

    this.tempFromDate = event
    if (event.getTime() < cDate.getTime()) {
      this.schedularFromDate = '';
      this.toastr.error('', this.translate.instant("SchDateValMsg"));
    }

    if (this.tempToDate != null) {
      if (this.tempToDate.getTime() < event.getTime()) {
        this.schedularFromDate = '';
        this.toastr.error('', this.translate.instant("SchDateGreaterValMsg"));
      }
    }

    var varYear: string = event.getFullYear();
    var varMonth: string = (event.getMonth() + 1);
    var varDay: string = event.getDate();
    this.scheduleFromDate = varYear + "-" + varMonth + "-" + varDay
    if (this.schedularToDate == undefined || this.schedularToDate == "") {
      this.schedularToDate = this.schedularFromDate;
      this.scheduleToDate = this.scheduleFromDate;
    }
  }

  onScheduleToDateChange(event) {
    this.isUpdateHappen = true
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
    var varYear: string = event.getFullYear();
    var varMonth: string = (event.getMonth() + 1);
    var varDay: string = event.getDate();
    this.scheduleToDate = varYear + "-" + varMonth + "-" + varDay
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  GetShipmentIdWithAllocAndPartAllocStatus(fieldName, action?) {
    var shipId = ''
    if (action != 'lookup') {
      if (fieldName == 'ShipIdFrom') {
        shipId = this.ShipmentCodeFrom
      } else {
        shipId = this.ShipmentCodeTo
      }
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
            this.isUpdateHappen = true
            if (data.Table.length > 0) {
              if (fieldName == 'ShipIdFrom') {
                this.ShipmentCodeFrom = data.Table[0].OPTM_SHIPMENT_CODE
                this.ShipIdFrom = data.Table[0].OPTM_SHIPMENTID
                if (this.ShipmentCodeTo == "" || this.ShipmentCodeTo == undefined) {
                  this.ShipmentCodeTo = data.Table[0].OPTM_SHIPMENT_CODE
                  this.ShipIdTo = data.Table[0].OPTM_SHIPMENTID
                }
              } else {
                this.ShipmentCodeTo = data.Table[0].OPTM_SHIPMENT_CODE
                this.ShipIdTo = data.Table[0].OPTM_SHIPMENTID
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
    this.showLoader = true;
    this.commonservice.AllocateContAndBtchSerToShipment(this.ShipIdFrom, this.ShipIdTo,
      this.scheduleFromDate, this.scheduleToDate).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            // if (data.OUTPUT[0].RESULT == "Data Saved") {
              this.toastr.success('', this.translate.instant("ShpAllocatedSuccess"));
              this.AutoAllocateShipments = data.OUTPUT;
              this.dialogOpened = true;
              // return;
            // } 
            // else {
            //   this.toastr.error('', this.translate.instant(data.OUTPUT[0].RESULT));
            // }
            this.ShipmentCodeFrom = ''
            this.ShipmentCodeTo = ''
            this.schedularFromDate = ''
            this.schedularToDate = ''
            this.ShipIdTo = '';
            this.ShipIdFrom = '';
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

  AutoAllocateShipments = [];
  dialogOpened: boolean = false;
  closeDialog() {
    this.dialogOpened = false;
  }

  close_kendo_dialog() {
    this.dialogOpened = false;
  }
}
