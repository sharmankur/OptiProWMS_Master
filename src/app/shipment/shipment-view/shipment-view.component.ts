import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ShipmentService } from '../../services/shipment.service';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonData } from '../../models/CommonData';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-shipment-view',
  templateUrl: './shipment-view.component.html',
  styleUrls: ['./shipment-view.component.scss']
})
export class ShipmentViewComponent implements OnInit {
  public skip = 0;
  public gridData = [];
  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  hideLookup: boolean = true;
  ShipmentID: string;
  CustomerCode: string;
  WarehouseCode: string;
  ScheduleDatetime: Date;
  ShipStageBin: string;
  DockDoor: string;
  ShipToCode: string;
  Status: string = "New";
  StatusId: string;
  CarrierCode: string;
  ReturnOrderRef: string;
  UseContainer: boolean;
  BOLNumber: string;
  VehicleNumber: string;
  shipmentLines: any[] = [];
  SODetails: any[] = [];
  ContainerItems: any[] = [];
  ShipmentLineDetails: any[] = [];
  ShipContainers: any[] = [];
  ContItems: any[] = [];
  ShipLineDetails: any[] = [];
  commonData: any = new CommonData();
  shiment_status_array: any[] = [];
  Container_status_array: any[] = [];
  shiment_lines_status_array: any[] = [];
  showContainerShipmentScreen: boolean = false;
  dateFormat: string;
  gridheight = 200;
  pageSize1 = 10;
  pageSize2 = 10;
  pageSize3 = 10;
  pageSize4 = 10;
  pageSize5 = 10;
  pagable2 = false;
  pagable3 = false;
  pagable4 = false;
  pagable5 = false;
  pagable1 = false;
  btnText: string;
  isStageDiabled: boolean = true;
  isScheduledDiabled: boolean = false;
  shipmentData: any;

  constructor(private shipmentService: ShipmentService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.onCheckChange();
    });
  }

  ngOnInit() {
    this.shiment_status_array = this.commonData.shiment_status_array();
    this.Container_status_array = this.commonData.Container_Status_DropDown();   
    this.clearStorage();
    this.shiment_lines_status_array = this.commonData.Shipment_Lines_Status_DropDown();
    if (localStorage.getItem("ShipmentID") != null && localStorage.getItem("ShipmentID") != undefined && localStorage.getItem("ShipmentID") != "") {
      this.ShipmentID = localStorage.getItem("ShipmentID");
      this.GetDataBasedOnShipmentId(localStorage.getItem("ShipmentID"));
    }
    this.dateFormat = localStorage.getItem("DATEFORMAT");
  }

  clearStorage(){
  //  localStorage.setItem("ShipmentID", '');
    localStorage.setItem("ShipmentArrData", '');
    localStorage.setItem("ShipWhse", '');
    localStorage.setItem("ShipBin", '');
  }

  GetShipmentIdForShipment() {
    this.showLoader = true;
    this.shipmentService.GetShipmentIdForShipment().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.hideLookup = false;
          this.showLookupLoader = false;
          this.serviceData = data;
          this.lookupfor = "ShipmentList";
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

  GetDataBasedOnShipmentId(ShipmentID) {
    this.showLoader = true;
    this.shipmentService.GetDataBasedOnShipmentId(ShipmentID).subscribe(
      (data: any) => {
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          //Shipment Header 
          this.updateShipmentHDR(data.OPTM_SHPMNT_HDR);
          this.shipmentData = data;
          //Shipment Detail 
          for (var i = 0; i < data.OPTM_SHPMNT_DTL.length; i++) {
            data.OPTM_SHPMNT_DTL[i].OPTM_STATUS = this.getShipLinesStatusValue(data.OPTM_SHPMNT_DTL[i].OPTM_STATUS);
          }
          this.shipmentLines = data.OPTM_SHPMNT_DTL;
          if (this.shipmentLines != undefined && this.shipmentLines.length > this.pageSize1) {           
            this.pagable1 = true;
          }
          localStorage.setItem("ShipmentArrData", JSON.stringify(this.shipmentLines));
          // SO Detail, Container Items, BtchSer Detail
          this.updateGridonShipmentLineId(this.shipmentLines[0].OPTM_LINEID);
          //Container Header 
          for (var i = 0; i < data.OPTM_CONT_HDR.length; i++) {
            data.OPTM_CONT_HDR[i].OPTM_STATUS = this.getContStatusValue(data.OPTM_CONT_HDR[i].OPTM_STATUS);
          }
          this.ShipContainers = data.OPTM_CONT_HDR;
          if (this.ShipContainers != undefined && this.ShipContainers.length > this.pageSize3) {
            this.pagable3 = true;
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
        this.showLoader = false;
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

  onRowSelection(row) {
    this.updateGridonShipmentLineId(row.selectedRows[0].dataItem.OPTM_LINEID);
  }

  updateGridonShipmentLineId(ShipmentLineId) {
    //SO Details
    this.SODetails = [];
    for (var i = 0; i < this.shipmentData.OPTM_SHPMNT_SODTL.length; i++) {
      if (this.shipmentData.OPTM_SHPMNT_SODTL[i].OPTM_DTLLINEID === ShipmentLineId) {
        this.SODetails.push(this.shipmentData.OPTM_SHPMNT_SODTL[i]);
      }
    }
    if (this.SODetails != undefined && this.SODetails.length > this.pageSize2) {
      this.pagable2 = true;
    }
    //Container Items
    this.ContainerItems = [];
    for (var i = 0; i < this.shipmentData.OPTM_CONT_DTL.length; i++) {
      if (this.shipmentData.OPTM_CONT_DTL[i].OPTM_SHIPMENT_LINEID === ShipmentLineId) {
        this.ContainerItems.push(this.shipmentData.OPTM_CONT_DTL[i]);
      }
    }
    if (this.ContainerItems != undefined && this.ContainerItems.length > this.pageSize4) {
      this.pagable4 = true;
    }
    //BatchSer Details
    this.ShipmentLineDetails = [];
    for (var i = 0; i < this.shipmentData.OPTM_SHPMNT_INVDTL.length; i++) {
      if (this.shipmentData.OPTM_SHPMNT_INVDTL[i].OPTM_DTLLINEID === ShipmentLineId) {
        this.ShipmentLineDetails.push(this.shipmentData.OPTM_SHPMNT_INVDTL[i]);
      }
    }
    if (this.ShipmentLineDetails != undefined && this.ShipmentLineDetails.length > this.pageSize5) {
      this.pagable5 = true;
    }
  }

  updateShipmentHDR(OPTM_SHPMNT_HDR) {
    this.StatusId = OPTM_SHPMNT_HDR[0].OPTM_STATUS;
    this.Status = this.getShipStatusValue(this.StatusId);
    if (this.StatusId == "6" || this.StatusId == "7" || this.StatusId == "8" || this.StatusId == "9") {
      this.isStageDiabled = false;
    } else {
      this.isStageDiabled = true;
    }
    if (this.StatusId == "1") {
      this.isScheduledDiabled = false;
    } else {
      this.isScheduledDiabled = true;
    }

    this.ShipmentID = OPTM_SHPMNT_HDR[0].OPTM_SHIPMENTID
    localStorage.setItem("ShipmentID", this.ShipmentID);
    this.CustomerCode = OPTM_SHPMNT_HDR[0].OPTM_BPCODE
    this.WarehouseCode = OPTM_SHPMNT_HDR[0].OPTM_WHSCODE;
    if (OPTM_SHPMNT_HDR[0].OPTM_SCH_DATETIME != null) {
      this.ScheduleDatetime = new Date(OPTM_SHPMNT_HDR[0].OPTM_SCH_DATETIME);
    }
    this.ShipStageBin = OPTM_SHPMNT_HDR[0].OPTM_BINCODE;
    this.DockDoor = OPTM_SHPMNT_HDR[0].OPTM_DOCKDOORID;
    this.ShipToCode = OPTM_SHPMNT_HDR[0].OPTM_SHIPTO;
    this.CarrierCode = OPTM_SHPMNT_HDR[0].OPTM_CARRIER;
    this.VehicleNumber = OPTM_SHPMNT_HDR[0].OPTM_VEHICLENO;
    this.ReturnOrderRef = OPTM_SHPMNT_HDR[0].OPTM_RETURN_ORDER_REF;
    this.BOLNumber = OPTM_SHPMNT_HDR[0].OPTM_BOLNUMBER;
    this.UseContainer = OPTM_SHPMNT_HDR[0].OPTM_USE_CONTAINER == "Y" ? true : false;
    if(this.UseContainer == null){
      this.UseContainer = false;
    }
    this.onCheckChange();
  }

  onCancelClick() {
    localStorage.setItem("ShipmentID", "");
    this.router.navigate(['home/dashboard']);
  }

  getShipStatusValue(OPTM_STATUS): string {
    return this.shiment_status_array[Number(OPTM_STATUS) - 1].Name;
  }

  getShipLinesStatusValue(OPTM_STATUS): string {
    return this.shiment_lines_status_array[Number(OPTM_STATUS) - 1].Name;
  }

  getContStatusValue(OPTM_STATUS): string {
    return this.Container_status_array[Number(OPTM_STATUS) - 1].Name;
  }

  getlookupSelectedItem(event) {
    if (this.lookupfor == "ShipmentList") {
      this.ShipmentID = event.OPTM_SHIPMENTID
      localStorage.setItem("ShipmentID", this.ShipmentID);
      this.CustomerCode = event.OPTM_BPCODE
      this.WarehouseCode = event.OPTM_WHSCODE;
      if (event.OPTM_SCH_DATETIME != null) {
        this.ScheduleDatetime = new Date(event.OPTM_SCH_DATETIME);
      }
      this.ShipStageBin = event.OPTM_BINCODE;
      this.DockDoor = event.OPTM_DOCKDOORID;
      this.ShipToCode = event.OPTM_SHIPTO;
      this.CarrierCode = event.OPTM_CARRIER;
      this.VehicleNumber = event.OPTM_VEHICLENO;
      this.ReturnOrderRef = event.OPTM_RETURN_ORDER_REF;
      this.BOLNumber = event.OPTM_BOLNUMBER;
      this.UseContainer = event.OPTM_USE_CONTAINER == "Y" ? true : false;
      this.GetDataBasedOnShipmentId(this.ShipmentID);
    } else if (this.lookupfor == "DDList") {
      this.DockDoor = event.OPTM_DOCKDOORID
    } else if (this.lookupfor == "CarrierList") {
      this.CarrierCode = event.OPTM_CARRIERID
    }
  }

  OnContainerBtnClick() {
    if (this.ShipmentID == undefined || this.ShipmentID == "") {
      return false;
    }
    this.showContainerShipmentScreen = true;
    localStorage.setItem("ShipShipmentID", this.ShipmentID);
    localStorage.setItem("ShipWhse", (this.WarehouseCode) == undefined || (this.WarehouseCode) == null ? '' : this.WarehouseCode);
    localStorage.setItem("ShipBin", (this.ShipStageBin) == undefined || (this.ShipStageBin) == null ? '' : this.ShipStageBin);

    if (this.UseContainer) {
      this.router.navigate(['home/Container_List']);
    }
    else {
      this.router.navigate(['home/BatchSerial_List']);
    }
  }

  GetSubmitDateFormat(EXPDATE) {
    if (EXPDATE == "" || EXPDATE == null)
      return "";
    else {
      var d = new Date(EXPDATE);
      var day;

      if (d.getDate().toString().length < 2) {
        day = "0" + d.getDate();
      }
      else {
        day = d.getDate();
      }
      var mth;
      if ((d.getMonth() + 1).toString().length < 2) {
        mth = "0" + (d.getMonth() + 1).toString();
      }
      else {
        mth = d.getMonth() + 1;
      }
      // return day + ":" + mth + ":" + d.getFullYear();
      return mth + "/" + day + "/" + d.getFullYear();
    }
  }

  public disabledDates = (date: Date): boolean => {
    return date.getDate() % 2 === 0;
  }

  onCheckChange() {
    if (this.UseContainer) {
      this.btnText = this.translate.instant("Container");
    } else {
      this.btnText = this.translate.instant("BatchSerial");
    }
  }

  validateFields(): boolean {
    if (this.ShipmentID == undefined || this.ShipmentID == "") {
      return false;
    } else if (this.CarrierCode == undefined || this.CarrierCode == "") {
      this.toastr.error('', this.translate.instant("Invalid_Carrier_code"));
      return false;
    } else if (this.DockDoor == undefined || this.DockDoor == "") {
      this.toastr.error('', this.translate.instant("InvalidDock_Door"));
      return false;
    } else if (this.ScheduleDatetime == undefined || this.ScheduleDatetime == null
      || this.ScheduleDatetime.toDateString() == "") {
      this.toastr.error('', this.translate.instant("ScheduleTimeBlank"));
      return false;
    }
    return true;
  }

  onScheduleClick() {
    if (!this.validateFields()) {
      return;
    }
    this.showLoader = true;
    this.shipmentService.ScheduleShipment(this.ShipmentID, this.CarrierCode, this.ScheduleDatetime.toLocaleDateString(),
      this.DockDoor).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
              this.GetDataBasedOnShipmentId(this.ShipmentID);
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

  onStageORUnstageShipmentClick() {
    if (this.ShipmentID == undefined || this.ShipmentID == "") {
      return false;
    }
    this.showLoader = true;
    this.shipmentService.StageORUnstageShipment(this.ShipmentID, this.StatusId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
            this.GetDataBasedOnShipmentId(this.ShipmentID);
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

  onUpdateClick() {
    if (this.ShipmentID == undefined || this.ShipmentID == "") {
      return;
    }
    this.showLoader = true;
    let uc = this.UseContainer == true ? "Y" : "N";
    this.shipmentService.updateShipment(this.ReturnOrderRef, uc, this.ShipmentID, this.BOLNumber, this.VehicleNumber).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.GetDataBasedOnShipmentId(this.ShipmentID);
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

  //#region "Dock Door"
  GetDataForDockDoor() {
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
          this.showLookupLoader = false;
          this.serviceData = data;
          this.lookupfor = "DDList";
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

  IsValidDockDoor() {
    if (this.DockDoor == "" || this.DockDoor == null || this.DockDoor == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidDockDoor(this.DockDoor, this.WarehouseCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.DockDoor = data[0].OPTM_DOCKDOORID;
          } else {
            this.DockDoor = "";
            this.toastr.error('', this.translate.instant("InvalidDock_Door"));
          }
        } else {
          this.DockDoor = "";
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
  //#region "Carrier Code"
  GetDataForCarrier() {
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
          this.showLookupLoader = false;
          this.serviceData = data;
          this.lookupfor = "CarrierList";
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

  IsValidCarrier() {
    if (this.CarrierCode == "" || this.CarrierCode == null || this.CarrierCode == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidCarrier(this.CarrierCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.CarrierCode = data[0].OPTM_CARRIERID;
          } else {
            this.CarrierCode = "";
            this.toastr.error('', this.translate.instant("Invalid_Carrier_code"));
          }
        } else {
          this.CarrierCode = "";
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
}
