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
  WareHouse: string="01";
  showLoader: boolean = false;
  CustomerFrom: string="";
  CustomerTo: string="";
  ShipToCodeFrom: string="";
  ShipToCodeTo: string="";
  Dock_DoorFrom: string="";
  Dock_DoorTo: string="";
  Schedule_DatetimeFrom: string="";
  Schedule_DatetimeTo: string="";
  ItemFrom: string="";
  ItemTo: string="";
  CarrierCodeFrom: string="";
  CarrierCodeTo: string="";
  PickContainer: boolean;
  TaskPlanDT: string="";
  Priority: string="99";
  SONoFrom: string="";
  SONoTo: string="";
  WOFrom: string="";
  WOTo: string="";
  ShipIdFrom: string="";
  ShipIdTo: string="";
  PickListBasis: string="";
  Pick_Type: string="";
  Pick_Operation: string="";
  PackListBasisArray: any[] = [];
  PackTypeList: any[] = [];
  PickOperationList: any[] = [];
  isSODisabled: boolean;
  isWODisabled: boolean;
  isSHIdDisabled: boolean;
  Plan_Shift: string="";
  pickListBasisIndex = 1;
  pickTypeIndex = 3;
  pickOperationIndex = 2;

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

  initialize() {
    this.PackListBasisArray = ["Shipment",
      this.translate.instant("SalesOrder"), this.translate.instant("WorkOrder")];
    this.PickListBasis = this.PackListBasisArray[0];
    this.pickListBasisIndex = 1;

    this.PackTypeList = [this.translate.instant("Batch_Picking"),
    this.translate.instant("Cluster_Picking"), this.translate.instant("Container_Picking"),
    this.translate.instant("Discreate_Picking"), this.translate.instant("Zone_Picking")];
    this.Pick_Type = this.PackTypeList[0];

    this.PickOperationList = [this.translate.instant("PickToTote"),
    this.translate.instant("PickToContainer"), this.translate.instant("Loose")];
    this.Pick_Operation = this.PickOperationList[0];
    this.onPickListBasisChange(this.PickListBasis);
  }

  //#region "shipmentId"  
  GetDataForShipmentId(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetShipmentIdForShipment().subscribe(
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
  //#region "Sales Order ID"
  GetDataForSalesOredr(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForSalesOrderLookup("").subscribe(
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
  GetDataForWorkOredr(fromField) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForSalesOrderLookup("").subscribe(
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
      this.WOFrom = event.SODocNum;
    }
    else if (this.lookupfor == "WOTo") {
      this.WOTo = event.SODocNum;
    }
    else if (this.lookupfor == "ShipIdFrom") {
      this.ShipIdFrom = event.OPTM_SHIPMENTID;
    }
    else if (this.lookupfor == "ShipIdTo") {
      this.ShipIdTo = event.OPTM_SHIPMENTID;
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
    this.pickTypeIndex = this.PackTypeList.indexOf(event);
    this.pickTypeIndex = this.pickTypeIndex + 1;
    // alert(this.pickTypeIndex);
    if (event == this.PackTypeList[2]) {
      this.Pick_Operation = this.PickOperationList[2];
      this.pickOperationIndex = 3;
    } 
  }

  onPickOperationChange(event) {
    this.pickOperationIndex = this.PickOperationList.indexOf(event);
    this.pickOperationIndex = this.pickOperationIndex + 1;
  }

  //#region "validation"
  ValidateFields(): boolean {
    if (this.Pick_Operation == "" || this.Pick_Operation == undefined || this.Pick_Operation == null) {
      this.toastr.error("", this.translate.instant("Pick_Opr_val_Msg"));
      return false;
    }else if (this.Pick_Type == "" || this.Pick_Type == undefined || this.Pick_Type == null) {
      this.toastr.error("", this.translate.instant("Pick_ListBasis_val_Msg"));
      return false;
    }else if(this.WareHouse == "" || this.WareHouse == undefined || this.WareHouse == null){
      this.toastr.error("", this.translate.instant("Login_SelectwarehouseMsg"));
      return false;
    }else if(this.Priority == "" || this.Priority == undefined || this.Priority == null){
      let priority = Number(this.Priority);
      if(priority < 1 && priority > 99){
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
    if(!this.ValidateFields()){
      return;
    }
    this.generatePickList();
  }

  generatePickList() {
    this.showLoader = true;
    this.commonservice.GeneratePickList(this.Priority, this.pickListBasisIndex, this.pickOperationIndex, this.pickTypeIndex, this.WareHouse, this.CustomerFrom, this.CustomerTo, this.ShipToCodeFrom, this.ShipToCodeTo, this.ShipIdFrom, this.ShipIdTo, this.Dock_DoorFrom, this.Dock_DoorTo, this.Schedule_DatetimeFrom, this.Schedule_DatetimeTo, this.ItemFrom, this.ItemTo, this.CarrierCodeFrom, this.CarrierCodeTo, this.SONoFrom, this.SONoTo, this.WOFrom, this.WOTo, this.Plan_Shift, this.TaskPlanDT).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
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
}
