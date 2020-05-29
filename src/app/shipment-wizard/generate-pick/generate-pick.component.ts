import { Component, OnInit, ViewChild } from '@angular/core';
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
  WareHouse: string = "";
  showLoader: boolean = false;
  CustomerFrom: string = "";
  CustomerTo: string = "";
  ShipToCodeFrom: string = "";
  ShipToCodeTo: string = "";
  Dock_DoorFrom: string = "";
  Dock_DoorTo: string = "";
  Schedule_DatetimeFrom: string = "";
  Schedule_DatetimeTo: string = "";
  ItemFrom: string = "";
  ItemTo: string = "";
  CarrierCodeFrom: string = "";
  CarrierCodeTo: string = "";
  PickContainer: boolean;
  TaskPlanDT: string = "";
  Priority: string = "99";
  SONoFrom: string = "";
  SONoTo: string = "";
  WOFrom: string = "";
  WOTo: string = "";
  ShipIdFrom: string = "";
  ShipIdTo: string = "";
  ShipmentCodeFrom: string = "";
  ShipmentCodeTo: string = "";
  PickListBasis: string = "";
  Pick_Type: string = "";
  Pick_Operation: string = "";
  PackListBasisArray: any[] = [];
  PackTypeList: any[] = [];
  PickOperationList: any[] = [];
  isSODisabled: boolean;
  isWODisabled: boolean;
  isSHIdDisabled: boolean;
  Plan_Shift: string = "";
  pickListBasisIndex = 1;
  pickTypeIndex = 1;
  pickOperationIndex = 1;
  iscontainerpicking: boolean = false;
  isUpdateHappen: boolean = false
  @ViewChild('cform',{static:false}) cform;
  @ViewChild('custTo',{static:false}) custTo;
  @ViewChild('shipForm',{static:false}) shipForm;
  @ViewChild('shipTo',{static:false}) shipTo;
  @ViewChild('whse',{static:false}) whse;
  @ViewChild('shipIdFrom',{static:false}) shipIdFromField;
  @ViewChild('shipIdTo',{static:false}) shipIdToField;
  @ViewChild('dockDoorFrom',{static:false}) dockDoorFrom;
  @ViewChild('dockDoorTo',{static:false}) dockDoorTo;
  @ViewChild('itemFrom',{static:false}) itemFrom;
  @ViewChild('itemTo',{static:false}) itemTo;
  @ViewChild('carrierCodeFrom',{static:false}) carrierCodeFrom;
  @ViewChild('carrierCodeTo',{static:false}) carrierCodeTo;
  @ViewChild('priority',{static:false}) priority;
  
  constructor(private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.initialize();
    });
  }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewInit(){
    console.log("ngAfterInit");
    this.cform.nativeElement.focus();
  } 
  initialize() {
    this.PackListBasisArray = ["Shipment",
      this.translate.instant("SalesOrder"), this.translate.instant("WorkOrder")];
    this.PickListBasis = this.PackListBasisArray[0];
    this.pickListBasisIndex = 1;

    this.PackTypeList = [this.translate.instant("Batch_Picking"),
    this.translate.instant("Cluster_Picking"), this.translate.instant("Container_Picking"),
    this.translate.instant("Discreate_Picking"), this.translate.instant("Zone_Picking")];
    // this.Pick_Type = this.PackTypeList[0];

    this.PickOperationList = [this.translate.instant("PickToTote"),
    this.translate.instant("PickToContainer"), this.translate.instant("Loose")];
    // this.Pick_Operation = this.PickOperationList[0];
    this.onPickListBasisChange(this.PickListBasis);
  }

  //#region "shipmentId"  
  IsValidShipmentCode(fieldName) {
    let soNum;
    if (fieldName == "ShipIdFrom") {
      soNum = this.ShipmentCodeFrom;
    }
    else if (fieldName == "ShipIdTo") {
      soNum = this.ShipmentCodeTo
    }
    if (soNum == "" || soNum == null || soNum == undefined) {
      return;
    }

    this.showLoader = true;
    this.commonservice.IsValidAllocatedShipmentCode(soNum).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "ShipIdFrom") {
              this.ShipIdFrom = data[0].OPTM_SHIPMENTID;
              this.ShipmentCodeFrom = data[0].OPTM_SHIPMENT_CODE;
            }
            else if (fieldName == "ShipIdTo") {
              this.ShipIdTo = data[0].OPTM_SHIPMENTID;
              this.ShipmentCodeTo = data[0].OPTM_SHIPMENT_CODE
            }
          } else {
            if (fieldName == "ShipIdFrom") {
              this.ShipIdFrom = this.ShipmentCodeFrom = "";
              this.shipIdFromField.nativeElement.focus();
            }
            else if (fieldName == "ShipIdTo") {
              this.ShipIdTo = this.ShipmentCodeTo = "";
              this.shipIdToField.nativeElement.focus();
            }
            this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
          }
        } else {
          if (fieldName == "ShipIdFrom") {
            this.ShipIdFrom = this.ShipmentCodeFrom = "";
            this.shipIdFromField.nativeElement.focus();
          }
          else if (fieldName == "ShipIdTo") {
            this.ShipIdTo = this.ShipmentCodeTo = "";
            this.shipIdToField.nativeElement.focus();
          }
          this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
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

  GetDataForShipmentId(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetAllocatedShipmentCode(3).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          this.lookupfor = fieldName;
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
  IsValidShipToAddress(fieldName) {
    let ccode;
    if (fieldName == "ShipFrom") {
      ccode = this.ShipToCodeFrom;
    }
    else if (fieldName == "ShipTo") {
      ccode = this.ShipToCodeTo
    }
    if (ccode == "" || ccode == null || ccode == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidShipToAddress(ccode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "ShipFrom") {
              this.ShipToCodeFrom = data[0].Address;
            }
            else if (fieldName == "ShipTo") {
              this.ShipToCodeTo = data[0].Address;
            }
          } else {
            if (fieldName == "ShipFrom") {
              this.ShipToCodeFrom = "";
              this.shipForm.nativeElement.focus();
            }
            else if (fieldName == "ShipTo") {
              this.ShipToCodeTo = "";
              this.shipTo.nativeElement.focus();
            }
            this.toastr.error('', this.translate.instant("Invalid_ShipToCode"));
          }
        } else {
          if (fieldName == "ShipFrom") {
            this.ShipToCodeFrom = "";
            this.shipForm.nativeElement.focus();
          }
          else if (fieldName == "ShipTo") {
            this.ShipToCodeTo = "";
            this.shipTo.nativeElement.focus();
          }
          this.toastr.error('', this.translate.instant("Invalid_ShipToCode"));
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

  GetDataForShipToCode(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetShipToAddress("").subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          this.lookupfor = fieldName;
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
  IsValidCustomerCode(fieldName) {
    let ccode;
    if (fieldName == "CustFrom") {
      ccode = this.CustomerFrom;
    }
    else if (fieldName == "CustTo") {
      ccode = this.CustomerTo
    }
    if (ccode == "" || ccode == null || ccode == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidCustomer(ccode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "CustFrom") {
              this.CustomerFrom = data[0].CardCode;
            }
            else if (fieldName == "CustTo") {
              this.CustomerTo = data[0].CardCode;
            }
          } else {
            if (fieldName == "CustFrom") {
              this.CustomerFrom = "";
              this.cform.nativeElement.focus();
            }
            else if (fieldName == "CustTo") {
              this.CustomerTo = "";
              this.custTo.nativeElement.focus();
            }
            this.toastr.error('', this.translate.instant("Invalid_CC"));
          }
        } else {
          if (fieldName == "CustFrom") {
            this.CustomerFrom = "";
            this.cform.nativeElement.focus();
          }
          else if (fieldName == "CustTo") {
            this.CustomerTo = "";
            this.custTo.nativeElement.focus();
          }
          this.toastr.error('', this.translate.instant("Invalid_CC"));
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

  GetDataForCustomer(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForCustomerLookup("").subscribe(
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
  IsValidWhseCode() {
    if (this.WareHouse == undefined || this.WareHouse == "") {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidWhseCode(this.WareHouse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.WareHouse = data[0].WhsCode;
          } else {
            this.whse.nativeElement.focus();
            this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
            this.WareHouse = "";
          }
        } else {
          this.whse.nativeElement.focus();
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.WareHouse = "";
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

  GetDataForWareHouse(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForWHSLookup("").subscribe(
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
  async IsValidItemCode(fieldName) {
    let value;
    if (fieldName == "ItmFrm") {
      value = this.ItemFrom;
    }
    else if (fieldName == "ItmTo") {
      value = this.ItemTo
    }
    if (value == undefined || value == "") {
      return;
    }
    this.showLoader = true;
    var result = false;
    await this.commonservice.IsValidItemCode(value).then(
      (data: any) => {
        this.showLoader = false;
        result = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "ItmFrm") {
              this.ItemFrom = data[0].ItemCode;
            }
            else if (fieldName == "ItmTo") {
              this.ItemTo = data[0].ItemCode;
            }
            result = true;
          } else {
            if (fieldName == "ItmFrm") {
              this.ItemFrom = "";
            }
            else if (fieldName == "ItmTo") {
              this.ItemTo = "";
            }
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
          }
        } else {
          if (fieldName == "ItmFrm") {
            this.ItemFrom = "";
          }
          else if (fieldName == "ItmTo") {
            this.ItemTo = "";
          }
          this.toastr.error('', this.translate.instant("InvalidItemCode"));
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

  GetDataForItemCode(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForItemCodeLookup("").subscribe(
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
          this.dockDoorFrom.nativeElement.focus();
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

  IsValidDockDoor(fieldName) {
    let DockDoor;
    if (fieldName == "DDFrom") {
      DockDoor = this.Dock_DoorFrom;
    }
    else if (fieldName == "DDTo") {
      DockDoor = this.Dock_DoorTo
    }
    if (DockDoor == "" || DockDoor == null || DockDoor == undefined) {
      return;
    }
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
          if (data.OPTM_DOCKDOOR.length > 0) {
            if (fieldName == "DDFrom") {
              this.Dock_DoorFrom = data.OPTM_DOCKDOOR[0].OPTM_DOCKDOORID;
            }
            else if (fieldName == "DDTo") {
              this.Dock_DoorTo = data.OPTM_DOCKDOOR[0].OPTM_DOCKDOORID;
            }
          } else {
            if (fieldName == "DDFrom") {
              this.Dock_DoorFrom = "";
              this.dockDoorFrom.nativeElement.focus();
            }
            else if (fieldName == "DDTo") {
              this.Dock_DoorTo = "";
              this.dockDoorTo.nativeElement.focus();
            }
            this.toastr.error('', this.translate.instant("InvalidDock_Door"));
          }
        } else {
          if (fieldName == "DDFrom") {
            this.Dock_DoorFrom = "";
            this.dockDoorFrom.nativeElement.focus();
          }
          else if (fieldName == "DDTo") {
            this.Dock_DoorTo = "";
            this.dockDoorTo.nativeElement.focus();
          }
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

  IsValidCarrier(fromField) {
    let CarrierCode;
    if (fromField == "CCFrom") {
      CarrierCode = this.CarrierCodeFrom;
    } else {
      CarrierCode = this.CarrierCodeTo;
    }
    if (CarrierCode == "" || CarrierCode == null || CarrierCode == undefined) {
      return;
    }
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
            if (fromField == "CCFrom") {
              this.CarrierCodeFrom = data[0].OPTM_CARRIERID;
            } else {
              this.CarrierCodeTo = data[0].OPTM_CARRIERID;
            }
          } else {
            if (fromField == "CCFrom") {
              this.CarrierCodeFrom = "";
            } else {
              this.CarrierCodeTo = "";
            }
            this.toastr.error('', this.translate.instant("Invalid_Carrier_code"));
          }
        } else {
          if (fromField == "CCFrom") {
            this.CarrierCodeFrom = "";
          } else {
            this.CarrierCodeTo = "";
          }
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
  //#region "Sales Order ID"
  IsValidSONumber(fieldName) {
    let soNum;
    if (fieldName == "SONoFrom") {
      soNum = this.SONoFrom;
    }
    else if (fieldName == "SONoTo") {
      soNum = this.SONoTo
    }
    if (soNum == "" || soNum == null || soNum == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidSONumber(soNum).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "SONoFrom") {
              this.SONoFrom = data[0].DocNum;
            }
            else if (fieldName == "SONoTo") {
              this.SONoTo = data[0].DocNum;
            }
          } else {
            if (fieldName == "SONoFrom") {
              this.SONoFrom = "";
            }
            else if (fieldName == "SONoTo") {
              this.SONoTo = "";
            }
            this.toastr.error('', this.translate.instant("InvalidSONo"));
          }
        } else {
          if (fieldName == "SONoFrom") {
            this.SONoFrom = "";
          }
          else if (fieldName == "SONoTo") {
            this.SONoTo = "";
          }
          this.toastr.error('', this.translate.instant("InvalidSONo"));
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

  GetDataForSalesOredr(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForSalesOrderLookup("", "").subscribe(
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
  //#region "WO ID"
  IsValidWONumber(fieldName) {
    let woNum;
    if (fieldName == "WOFrom") {
      woNum = this.WOFrom;
    }
    else if (fieldName == "WOTo") {
      woNum = this.WOTo
    }
    if (woNum == "" || woNum == null || woNum == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidWONumber(woNum).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "WOFrom") {
              this.WOFrom = data[0].OPTM_WONO;
            }
            else if (fieldName == "WOTo") {
              this.WOTo = data[0].OPTM_WONO;
            }
          } else {
            if (fieldName == "WOFrom") {
              this.WOFrom = "";
            }
            else if (fieldName == "WOTo") {
              this.WOTo = "";
            }
            this.toastr.error('', this.translate.instant("InvalidWONo"));
          }
        } else {
          if (fieldName == "WOFrom") {
            this.WOFrom = "";
          }
          else if (fieldName == "WOTo") {
            this.WOTo = "";
          }
          this.toastr.error('', this.translate.instant("InvalidWONo"));
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

  GetWorkOrderList(fromField) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetWorkOrderList().subscribe(
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
  //#endregion  

  //#region "Lookup selection"
  getlookupSelectedItem(event) {
    if (event != null && event == "close") {
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "ShipFrom") {
      this.ShipToCodeFrom = event.Address;
    }
    else if (this.lookupfor == "ShipTo") {
      this.ShipToCodeTo = event.Address;
    }
    else if (this.lookupfor == "CustomerFrom") {
      this.CustomerFrom = event.CardCode;
    }
    else if (this.lookupfor == "CustomerTo") {
      this.CustomerTo = event.CardCode;
    }
    else if (this.lookupfor == "ItemFrom") {
      this.ItemFrom = event.ItemCode;
    }
    else if (this.lookupfor == "ItemTo") {
      this.ItemTo = event.ItemCode;
    }
    else if (this.lookupfor == "CCFrom") {
      this.CarrierCodeFrom = event.OPTM_CARRIERID;
    }
    else if (this.lookupfor == "CCTo") {
      this.CarrierCodeTo = event.OPTM_CARRIERID;
    }
    else if (this.lookupfor == "DDFrom") {
      this.Dock_DoorFrom = event.OPTM_DOCKDOORID;
    }
    else if (this.lookupfor == "DDTo") {
      this.Dock_DoorTo = event.OPTM_DOCKDOORID;
    }
    else if (this.lookupfor == "SerialNoFrom") {
      this.SONoFrom = event.SODocNum;
    }
    else if (this.lookupfor == "SerialNoTo") {
      this.SONoTo = event.SODocNum;
    }
    else if (this.lookupfor == "WOFrom") {
      this.WOFrom = event.OPTM_WONO;
    }
    else if (this.lookupfor == "WOTo") {
      this.WOTo = event.OPTM_WONO;
    }
    else if (this.lookupfor == "ShipIdFrom") {
      this.ShipIdFrom = event.OPTM_SHIPMENTID;
      this.ShipmentCodeFrom = event.OPTM_SHIPMENT_CODE;
    }
    else if (this.lookupfor == "ShipIdTo") {
      this.ShipIdTo = event.OPTM_SHIPMENTID;
      this.ShipmentCodeTo = event.OPTM_SHIPMENT_CODE;
    }
    else if (this.lookupfor == "WareHouse") {
      this.WareHouse = event.WhsCode;
    }
  }
  //#endregion

  onPickListBasisChange(event) {
    this.isSODisabled = true
    this.isWODisabled = true;
    this.isSHIdDisabled = true;
    this.SONoFrom = this.SONoTo = "";
    this.WOFrom = this.WOTo = "";
    this.ShipIdFrom = this.ShipIdTo = "";
    if (event == this.PackListBasisArray[0]) {
      this.isSHIdDisabled = false;
      this.pickListBasisIndex = 1;
    } else if (event == this.PackListBasisArray[1]) {
      this.isSODisabled = false;
      this.pickListBasisIndex = 2;
    } else if (event == this.PackListBasisArray[2]) {
      this.isWODisabled = false;
      this.pickListBasisIndex = 3;
    }
  }

  onPickTypeChange(event) {
    this.isUpdateHappen = true
    this.PickOperationList = [this.translate.instant("PickToTote"),
    this.translate.instant("PickToContainer"), this.translate.instant("Loose")];
    this.pickTypeIndex = this.PackTypeList.indexOf(event);
    this.pickTypeIndex = this.pickTypeIndex + 1;
    if (event == this.PackTypeList[2]) {
      this.Pick_Operation = this.PickOperationList[2];
      this.pickOperationIndex = 3;
      this.iscontainerpicking = true;
    } else {
      this.iscontainerpicking = false;
    }

    switch (event) {
      case this.PackTypeList[0]:
      case this.PackTypeList[1]:
      case this.PackTypeList[4]:
        this.Pick_Operation = this.PickOperationList[0];
        this.pickOperationIndex = 1;
        break;
      case this.PackTypeList[3]:
        this.Pick_Operation = this.PickOperationList[1];
        this.pickOperationIndex = 2;
        break;
    }
  }

  onPickOperationChange(event, selectedvalue) {
    this.isUpdateHappen = true
    this.pickOperationIndex = this.PickOperationList.indexOf(event);
    this.pickOperationIndex = this.pickOperationIndex + 1;
    switch (this.Pick_Type) {
      case this.PackTypeList[0]:
        if (event == this.PickOperationList[1]) {
          this.toastr.error("", this.translate.instant("BatchPickingErrMsg"));
          this.Pick_Operation = this.PickOperationList[0];
          selectedvalue.text = this.PickOperationList[0];
          this.pickOperationIndex = 1;
        }
        break;
      case this.PackTypeList[1]:
        if (event == this.PickOperationList[1]) {
          this.toastr.error("", this.translate.instant("ClusterPickingErrMsg"));
          selectedvalue.text = this.Pick_Operation = this.PickOperationList[0];
          this.pickOperationIndex = 1;
        }
        break;
      case this.PackTypeList[4]:
        if (event == this.PickOperationList[1]) {
          this.toastr.error("", this.translate.instant("ZonePickingErrMsg"));
          selectedvalue.text = this.Pick_Operation = this.PickOperationList[0];
          this.pickOperationIndex = 1;
        }
        break;
    }
  }

  //#region "validation"
  ValidateFields(): boolean {
    if (this.Pick_Operation == "" || this.Pick_Operation == undefined || this.Pick_Operation == null) {
      this.toastr.error("", this.translate.instant("Pick_Opr_val_Msg"));
      return false;
    } else if (this.Pick_Type == "" || this.Pick_Type == undefined || this.Pick_Type == null) {
      this.toastr.error("", this.translate.instant("Pick_Type_val_Msg"));
      return false;
    } else if (this.WareHouse == "" || this.WareHouse == undefined || this.WareHouse == null) {
      this.toastr.error("", this.translate.instant("Login_SelectwarehouseMsg"));
      return false;
    } else if (this.Priority == "" || this.Priority == undefined || this.Priority == null) {
      let priority = Number(this.Priority);
      if (priority < 1 && priority > 99) {
        this.Priority = "99";
      }
    }
    return true;
  }
  //#endregion

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  //#region "Generate"
  onGenerateClick() {
    if (!this.ValidateFields()) {
      return;
    }
    this.generatePickList();
  }

  generatePickList() {
    this.showLoader = true;
    this.commonservice.GeneratePickList(this.Priority, this.pickListBasisIndex, this.pickOperationIndex, this.pickTypeIndex, this.WareHouse, this.CustomerFrom, this.CustomerTo, this.ShipToCodeFrom, this.ShipToCodeTo, this.ShipIdFrom, this.ShipIdTo, this.Dock_DoorFrom, this.Dock_DoorTo, this.Schedule_DatetimeFrom, this.Schedule_DatetimeTo, this.ItemFrom, this.ItemTo, this.CarrierCodeFrom, this.CarrierCodeTo, this.SONoFrom, this.SONoTo, this.WOFrom, this.WOTo, this.Plan_Shift, new Date(this.TaskPlanDT).toLocaleDateString()).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OUTPUT[0].RESULT == "Picklist created") {
            this.toastr.success('', this.translate.instant("Picklist_Created_Msg"));
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
  //#endregion

  onSchDateFromChange(event){
    console.log("onSchDateFromChange: s" + event.getDate())
    var cDate = new Date();
    event = new Date(event.getFullYear(), event.getMonth(), event.getDate());
    cDate = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate());
    if(event.getTime() < cDate.getTime()){
      this.Schedule_DatetimeFrom = '';
      this.toastr.error('', this.translate.instant("SchDateValMsg"));
    }
  }

  onSchDateToChange(event){
    console.log("onSchDateToChange: s" + event.getDate())
    var cDate = new Date();
    event = new Date(event.getFullYear(), event.getMonth(), event.getDate());
    cDate = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate());
    if(event.getTime() < cDate.getTime()){
      this.Schedule_DatetimeTo = '';
      this.toastr.error('', this.translate.instant("SchDateValMsg"));
    }
  }
}
