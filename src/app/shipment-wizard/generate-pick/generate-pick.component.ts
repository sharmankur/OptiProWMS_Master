import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { PickTaskService } from '../../services/picktask.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';

@Component({
  selector: 'app-generate-pick',
  templateUrl: './generate-pick.component.html',
  styleUrls: ['./generate-pick.component.scss']
})
export class GeneratePickComponent implements OnInit {

  serviceData: any[];
  lookupfor: string;
  hideLookup: boolean = true;
  public mobileMedia = "(max-width: 767px)";
  public desktopMedia = "(min-width: 768px)";
  WareHouse: string;
  showLoader: boolean = false;
  CustomerFrom: string;
  CustomerTo: string;
  ShipFrom: string;
  ShipTo: string;
  Dock_DoorFrom: string;
  Dock_DoorTo: string;
  Schedule_DatetimeFrom: string;
  Schedule_DatetimeTo: string;
  ItemFrom: string;
  ItemTo: string;
  CarrierCodeFrom: string;
  CarrierCodeTo: string;
  PickContainer: boolean;
  TaskPlanDT: string;
  Priority: string;

  constructor(private picktaskService: PickTaskService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {

    });
  }

  ngOnInit() {
  }
  //#region "shipmentId"  
  GetDataForShipmentId(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForSalesOrderLookup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          if (fieldName == "SrNO") {
            this.lookupfor = "SerialNoFrom";
          } else if (fieldName == "SrNOTO") {
            this.lookupfor = "SerialNoTo";
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
  //#endregion
  //#region "ShipToCode"  
  GetDataForShipToCode(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetShipToAddress().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          // if (fieldName == "SrNO") {
          //   this.lookupfor = "SerialNoFrom";
          // } else if (fieldName == "SrNOTO") {
            this.lookupfor = fieldName;
          // }
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
  //#endregion  
  //#region "Cusotmer Code"
  GetDataForCustomer(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForCustomerLookup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          if (fieldName == "CustFrom") {
            this.lookupfor = "CustomerFrom";
          }
          else if (fieldName == "CustTo") {
            this.lookupfor = "CustomerTo";
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
  //#endregion
  //#region "Warehouse"
  GetDataForWareHouse(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForWHSLookup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          this.lookupfor = "WareHouse";
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
  //#endregion
  //#region "Item Code"
  GetDataForItemCode(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForItemCodeLookup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          if (fieldName == "ItmFrm") {
            this.lookupfor = "ItemFrom";
          }
          else if (fieldName == "ItmTo") {
            this.lookupfor = "ItemTo";
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
  //#endregion
  //#region "Dock Door"
  GetDataForDockDoor(fromField) {
    this.showLoader = true;
    this.commonservice.GetDataForDockDoor().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          this.lookupfor = fromField;
          this.hideLookup = false;
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

  IsValidDockDoor(DockDoor) {
    this.showLoader = true;
    this.commonservice.IsValidDockDoor(DockDoor, this.WareHouse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.Dock_DoorFrom = data[0].OPTM_DOCKDOORID;
          } else {
            this.Dock_DoorFrom = "";
            this.toastr.error('', this.translate.instant("InvalidDock_Door"));
          }
        } else {
          this.Dock_DoorFrom = "";
          this.toastr.error('', this.translate.instant("InvalidDock_Door"));
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
  //#endregion
  //#region "CarrierCode"
  GetDataForCarrier(fromField) {
    this.showLoader = true;
    this.commonservice.GetDataForCarrier().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          this.lookupfor = fromField;
          this.hideLookup = false;
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

  IsValidCarrier(CarrierCode) {
    this.showLoader = true;
    this.commonservice.IsValidCarrier(CarrierCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.CarrierCodeFrom = data[0].OPTM_CARRIERID;
          } else {
            this.CarrierCodeFrom = "";
            this.toastr.error('', this.translate.instant("Invalid_Carrier_code"));
          }
        } else {
          this.CarrierCodeFrom = "";
          this.toastr.error('', this.translate.instant("Invalid_Carrier_code"));
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
  //#endregion
  getLookupValue($event) {
    if ($event != null && $event == "close") {
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "ShipFrom") {
      this.ShipFrom = $event[0];
    }
    else if (this.lookupfor == "ShipTo") {
      this.ShipTo = $event[0];
    }
    else if (this.lookupfor == "CustomerFrom") {
      this.CustomerFrom = $event[0];
    }
    else if (this.lookupfor == "CustomerTo") {
      this.CustomerTo = $event[0];
    }
    else if (this.lookupfor == "ItemFrom") {
      this.ItemFrom = $event[0];
    }
    else if (this.lookupfor == "ItemTo") {
      this.ItemTo = $event[0];
    }
    else if (this.lookupfor == "CCFrom") {
      this.CarrierCodeFrom = $event[0];
    }
    else if (this.lookupfor == "CCTo") {
      this.CarrierCodeTo = $event[0];
    }      
    else if (this.lookupfor == "DDFrom") {
      this.Dock_DoorFrom = $event[0];
    }
    else if (this.lookupfor == "DDTo") {
      this.Dock_DoorTo = $event[0];
    }
    else if (this.lookupfor == "WareHouse") {
      this.WareHouse = $event[0];
    }
  }

  //#region "validation"
  ValidateFields(){

  }
  //#endregion
}
