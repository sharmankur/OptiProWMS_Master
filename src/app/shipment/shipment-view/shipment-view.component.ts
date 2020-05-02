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
  Container_Group: string;
  ShipmentID: string;
  ShipmentCode: string;
  CustomerCode: string;
  WarehouseCode: string;
  ScheduleDatetime: Date;
  ShipStageBin: string;
  DockDoor: string = "";
  ShipToCode: string;
  Status: string = "New";
  StatusId: string;
  CarrierCode: string = "";
  ReturnOrderRef: string;
  UseContainer: boolean = false;
  BOLNumber: string;
  VehicleNumber: string;
  shipmentLines: any[] = [];
  SODetails: any[] = [];
  ContainerItems: any[] = [];
  ShipmentLineDetails: any[] = [];
  ShipContainers: any[] = [];
  ContItems: any[] = [];
  ShipLineDetails: any[] = [];
  commonData: any = new CommonData(this.translate);
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
  showConfirmDialog: boolean = false;
  dialogMsg: string;
  yesButtonText: string;
  noButtonText: string;
  dialogFor: string;
  event: any;
  StatusValue: any;
  shpProcess: any;
  shipmentProcessList: any[] = [];
  dialogOpened = false;

  constructor(private shipmentService: ShipmentService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.onCheckChange();
      this.shiment_status_array = this.commonData.shiment_status_array();
      this.Container_status_array = this.commonData.Container_Status_DropDown();
      this.shiment_lines_status_array = this.commonData.Shipment_Lines_Status_DropDown();
    });
  }

  Container_Status_DropDown() {
    return [
      "New",
      "Open",
      "Closed",
      "Reopened",
      "Assigned",
      "Shipped",
      "Picked",
      "Returned",
      "Damaged",
      "Cancelled",
      "Loaded"
    ];
  }

  ShipmentStatusEnum() {
    return [
      { "Value": 10, "Name": "New" },
      { "Value": 20, "Name": "Schedule" },
      { "Value": 30, "Name": "Assign" },
      { "Value": 40, "Name": "Picking" },
      { "Value": 50, "Name": "Staging" },
      { "Value": 60, "Name": "Loading" }
    ];
  }

  ShipmentProcessEnum() {
    return [
      { "Value": 1, "Name": "Standard" },
      { "Value": 2, "Name": "No_Picking" },
      { "Value": 3, "Name": "No_Staging" },
      { "Value": 4, "Name": "No_Picking-No_Staging" },
      { "Value": 5, "Name": "No_Schedule" },
      { "Value": 6, "Name": "No_Schedule-No_Picking" },
      { "Value": 7, "Name": "No_Schedule-No_Picking-No_Staging" }
    ];
  }

  ShipmentProcessArray() {
    return [
      { "Value": 10, "Name": "No_Picking" },
      { "Value": 10, "Name": "No_Picking-No_Staging" },
      { "Value": 10, "Name": "No_Schedule" },
      { "Value": 10, "Name": "No_Schedule-No_Picking" },
      { "Value": 10, "Name": "No_Schedule-No_Picking-No_Staging" },
      { "Value": 10, "Name": "No_Staging" },
      { "Value": 10, "Name": "Standard" },
      { "Value": 20, "Name": "No_Picking" },
      { "Value": 20, "Name": "No_Picking-No_Staging" },
      { "Value": 20, "Name": "No_Staging" },
      { "Value": 20, "Name": "Standard" },
      { "Value": 30, "Name": "No_Picking" },
      { "Value": 30, "Name": "No_Picking-No_Staging" },
      { "Value": 30, "Name": "No_Staging" },
      { "Value": 30, "Name": "Standard" },
      { "Value": 40, "Name": "No_Staging" },
      { "Value": 40, "Name": "Standard" },
      { "Value": 50, "Name": "Standard" },
      { "Value": 60, "Name": "Standard" }
    ];
  }

  // no-

  showShipDetailsEnable = [false, false, false];
  showShipDetails(index) {
    this.showShipDetailsEnable[index] = !this.showShipDetailsEnable[index]
  }

  ngOnInit() {
    this.shiment_status_array = this.commonData.shiment_status_array();
    this.Container_status_array = this.commonData.Container_Status_DropDown();
    this.clearStorage();
    this.shiment_lines_status_array = this.commonData.Shipment_Lines_Status_DropDown();
    if (localStorage.getItem("ShipmentID") != null && localStorage.getItem("ShipmentID") != undefined && localStorage.getItem("ShipmentID") != "") {
      this.ShipmentID = localStorage.getItem("ShipmentID");
      this.ShipmentCode = localStorage.getItem("ShipmentCode");
      this.GetDataBasedOnShipmentId(localStorage.getItem("ShipmentID"));
    }
    this.dateFormat = localStorage.getItem("DATEFORMAT");
    this.onCheckChange();
  }

  clearStorage() {
    // localStorage.setItem("ShipmentID", '');
    localStorage.setItem("ShipmentArrData", '');
    localStorage.setItem("ShipWhse", '');
    localStorage.setItem("ShipBin", '');
  }

  clearFields() {
    this.CustomerCode = "";
    this.WarehouseCode = "";
    this.ScheduleDatetime = undefined;
    this.ShipStageBin = "";
    this.DockDoor = "";
    this.ShipToCode = "";
    this.CarrierCode = "";
    this.VehicleNumber = "";
    this.ReturnOrderRef = ""
    this.BOLNumber = "";
    this.shipmentLines = [];
    this.ShipmentLineDetails = [];
    this.ShipContainers = [];
    this.ContainerItems = [];
    this.SODetails = [];
  }

  IsValidShipmentCode(fieldName) {
    if (this.ShipmentCode == undefined || this.ShipmentCode == "") {
      return;
    }
    this.clearFields()
    this.showLoader = true;
    this.commonservice.IsValidShipmentCode(this.ShipmentCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.ShipmentID = data[0].OPTM_SHIPMENTID;
            this.ShipmentCode = data[0].OPTM_SHIPMENT_CODE;
            this.GetDataBasedOnShipmentId(this.ShipmentID);
          } else {
            this.ShipmentID = "";
            this.ShipmentCode = "";
            this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
            this.clearFields();
          }
          localStorage.setItem("ShipmentID", this.ShipmentID);
          localStorage.setItem("ShipmentCode", this.ShipmentCode);
        } else {
          this.ShipmentID = "";
          this.ShipmentCode = "";
          this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
          this.clearFields();
          localStorage.setItem("ShipmentID", this.ShipmentID);
          localStorage.setItem("ShipmentCode", this.ShipmentCode);
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
            data.OPTM_SHPMNT_DTL[i].OPTM_QTY = Number(data.OPTM_SHPMNT_DTL[i].OPTM_QTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          }
          this.shipmentLines = [];
          this.shipmentLines = data.OPTM_SHPMNT_DTL;
          if (this.shipmentLines != undefined && this.shipmentLines.length > this.pageSize1) {
            this.pagable1 = true;
          }

          let setShipmentdata = [];
          setShipmentdata = this.shipmentLines;

          for(let sidx=0; sidx<setShipmentdata.length; sidx++){
            setShipmentdata[sidx].OPTM_SHIPMENT_CODE = data.OPTM_SHPMNT_HDR[0].OPTM_SHIPMENT_CODE ;
            setShipmentdata[sidx].OPTM_SHIPMENT_STATUS = data.OPTM_SHPMNT_HDR[0].OPTM_STATUS ;
          }

          localStorage.setItem("ShipmentArrData", JSON.stringify(setShipmentdata));
          // SO Detail, Container Items, BtchSer Detail
          this.updateGridonShipmentLineId(this.shipmentLines[0].OPTM_LINEID);
          //Container Header 
          for (var i = 0; i < data.OPTM_CONT_HDR.length; i++) {
            data.OPTM_CONT_HDR[i].OPTM_STATUS = this.getContStatusValue(data.OPTM_CONT_HDR[i].OPTM_STATUS);
          }
          this.ShipContainers = data.OPTM_CONT_HDR;
          if (this.ShipContainers.length > 0) {
            this.UseContainer = true;
          }
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
        this.shipmentData.OPTM_SHPMNT_SODTL[i].OPTM_SOLINEQTY = Number(this.shipmentData.OPTM_SHPMNT_SODTL[i].OPTM_SOLINEQTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
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
        this.shipmentData.OPTM_CONT_DTL[i].OPTM_QUANTITY = Number(this.shipmentData.OPTM_CONT_DTL[i].OPTM_QUANTITY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
        this.ContainerItems.push(this.shipmentData.OPTM_CONT_DTL[i]);
      }
    }
    if (this.ContainerItems != undefined && this.ContainerItems.length > this.pageSize4) {
      this.pagable4 = true;
    }
    //BatchSer Details
    this.ShipmentLineDetails = [];
    if (this.shipmentData.OPTM_SHPMNT_INVDTL.length > 0) {
      for (var i = 0; i < this.shipmentData.OPTM_SHPMNT_INVDTL.length; i++) {
        if (this.shipmentData.OPTM_SHPMNT_INVDTL[i].OPTM_DTLLINEID === ShipmentLineId) {
          this.shipmentData.OPTM_SHPMNT_INVDTL[i].OPTM_QTY = Number(this.shipmentData.OPTM_SHPMNT_INVDTL[i].OPTM_QTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          this.ShipmentLineDetails.push(this.shipmentData.OPTM_SHPMNT_INVDTL[i]);
        }
      }
      if (this.ShipmentLineDetails.length < 1) {
        for (var i = 0; i < this.shipmentData.OPTM_SHPMNT_BINDTL.length; i++) {
          if (this.shipmentData.OPTM_SHPMNT_BINDTL[i].OPTM_DTLLINEID === ShipmentLineId) {
            this.shipmentData.OPTM_SHPMNT_BINDTL[i].OPTM_QTY = Number(this.shipmentData.OPTM_SHPMNT_BINDTL[i].OPTM_QTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
            this.ShipmentLineDetails.push(this.shipmentData.OPTM_SHPMNT_BINDTL[i]);
          }
        }
      }
    } else {
      for (var i = 0; i < this.shipmentData.OPTM_SHPMNT_BINDTL.length; i++) {
        if (this.shipmentData.OPTM_SHPMNT_BINDTL[i].OPTM_DTLLINEID === ShipmentLineId) {
          this.shipmentData.OPTM_SHPMNT_BINDTL[i].OPTM_QTY = Number(this.shipmentData.OPTM_SHPMNT_BINDTL[i].OPTM_QTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          this.ShipmentLineDetails.push(this.shipmentData.OPTM_SHPMNT_BINDTL[i]);
        }
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
    this.Container_Group = OPTM_SHPMNT_HDR[0].OPTM_CONT_GRP;
    this.UseContainer = OPTM_SHPMNT_HDR[0].OPTM_USE_CONTAINER == "Y" ? true : false;
    if (this.UseContainer == null) {
      this.UseContainer = false;
    }
    this.StatusValue = OPTM_SHPMNT_HDR[0].OPTM_PROCESS_STEP_NO;
    // this.shpProcess = this.ShipmentProcessArray().find(e => e.Name == this.ShipmentProcessEnum().find(e => e.Value == OPTM_SHPMNT_HDR[0].OPTM_SHP_PROCESS).Name && e.Value == this.StatusValue).Name;
    this.shpProcess = this.ShipmentProcessEnum().find(e => e.Value == OPTM_SHPMNT_HDR[0].OPTM_SHP_PROCESS).Name;
    this.onCheckChange();
  }

  onCancelClick() {
    localStorage.setItem("ShipmentID", "");
    localStorage.setItem("ShipmentCode", "");
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
      this.clearFields();
      this.ShipmentID = event.OPTM_SHIPMENTID
      this.ShipmentCode = event.OPTM_SHIPMENT_CODE
      localStorage.setItem("ShipmentID", this.ShipmentID);
      localStorage.setItem("ShipmentCode", this.ShipmentCode);
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
    } else if (this.lookupfor == "GroupCodeList") {
      this.Container_Group = event.OPTM_CONTAINER_GROUP;
    } else if (this.lookupfor == "ShipMentProcess") {
      this.onShpProcessChange(event);
    }
  }

  updateShipmentProcessArray(selectedvalue) {
    this.shipmentProcessList = this.ShipmentProcessArray().filter(element => element.Value == this.StatusValue);
    this.serviceData = this.shipmentProcessList;
    this.lookupfor = "ShipMentProcess";
    this.hideLookup = false;
  }

  onShpProcessChange(event) {
    this.event = event;
    this.dialogFor = "ShipmentProcess";
    this.yesButtonText = this.translate.instant("yes");
    this.noButtonText = this.translate.instant("no");
    this.showConfirmDialog = true;
    this.dialogMsg = this.translate.instant("ShipmentProcessChangeMsg");
  }

  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("ShipmentProcess"):
          // this.shpProcess = this.event.Name
          this.ChangeShipmentProcess();
          break;
      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
          case ("ShipmentProcess"):
            break;
        }
      }
    }
  }

  ChangeShipmentProcess() {
    this.showLoader = true;
    this.shipmentService.ChangeShippingProcess(this.ShipmentCode, this.ShipmentProcessEnum().find(e => e.Name == this.event.Name).Value, this.StatusValue, this.StatusId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', this.translate.instant("ShpProcessChange"));
            this.GetDataBasedOnShipmentId(this.ShipmentID);
          } else if (data.OUTPUT[0].RESULT == "Shipment not assigned any container. Please assign a container") {
            this.runningProcessName = "ShippingProcess"
            this.dialogOpened = true;
          } else {
            this.toastr.error('', data.OUTPUT[0].RESULT);
          }
        } else {
          // this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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
    } else if (this.ScheduleDatetime == undefined || this.ScheduleDatetime == null
      || this.ScheduleDatetime.toDateString() == "") {
      this.toastr.error('', this.translate.instant("ScheduleTimeBlank"));
      return false;
    }
    else if (this.DockDoor == undefined || this.DockDoor == "") {
      this.toastr.error('', this.translate.instant("InvalidDock_Door"));
      return false;
    }
    // else if (this.CarrierCode == undefined || this.CarrierCode == "") {
    //   this.toastr.error('', this.translate.instant("Invalid_Carrier_code"));
    //   return false;
    // }
    return true;
  }

  onScheduleClick() {
    if (!this.validateFields()) {
      return;
    }
    this.showLoader = true;
    this.shipmentService.ScheduleShipment(this.ShipmentID, this.CarrierCode, this.ScheduleDatetime.toLocaleDateString(),
      this.DockDoor, this.ShipmentCode, (this.ShipmentProcessEnum().find(e => e.Name == this.shpProcess)).Value, "20").subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
              this.toastr.success('', this.translate.instant("shipScheduled"));
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

  containerCode: string;
  generateContainer() {
    if(this.containerCode == "" || this.containerCode == undefined || this.containerCode == null){
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"))
      return;
    }
    this.PrepareModelAndCreateCont(this.containerCode);
  }

  onConfirmClick(){
    if(this.containerCode == "" || this.containerCode == undefined || this.containerCode == null){
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"))
      return;
    }
    this.close_kendo_dialog();
  }

  close_kendo_dialog() {
    this.dialogOpened = false;
  }

  runningProcessName = "";
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
          if(data.OUTPUT[0].RESULT == "Data Saved For Unstage"){
            this.toastr.success('', this.translate.instant("ShipmentUnstaged"));
          }else if (data.OUTPUT[0].RESULT == "Data Saved For Stage") {
            this.toastr.success('', this.translate.instant("ShipmentStaged"));
            this.GetDataBasedOnShipmentId(this.ShipmentID);
          } else if (data.OUTPUT[0].RESULT == "Shipment not assigned any container. Please assign a container") {
            this.runningProcessName = "Stage"
            this.dialogOpened = true;
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

  PrepareModelAndCreateCont(containerCode: any) {
    var oSaveModel: any = {};
    oSaveModel.HeaderTableBindingData = [];
    oSaveModel.OtherItemsDTL = [];
    oSaveModel.OtherBtchSerDTL = [];

    //Push data of header table into BatchSerial model
    oSaveModel.HeaderTableBindingData.push({
      OPTM_SHIPMENTID: this.ShipmentID,
      OPTM_SONO: "",
      OPTM_CONTAINERID: "",
      OPTM_CONTTYPE: "Manual",
      OPTM_CONTAINERCODE: "" + containerCode,
      OPTM_WEIGHT: "",
      OPTM_AUTOCLOSE_ONFULL: "Y",
      OPTM_AUTORULEID: "Manual",
      OPTM_WHSE: this.WarehouseCode,
      OPTM_BIN: this.ShipStageBin,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: '',
      Length: length,
      Width: "",
      Height: "",
      ItemCode: "",
      NoOfPacks: "1",
      OPTM_TASKID: 0, //changed
      CompanyDBId: localStorage.getItem("CompID"),
      Username: localStorage.getItem("UserId"),
      UserId: localStorage.getItem("UserId"),
      GUID: localStorage.getItem("GUID"),
      Action: "N",
      OPTM_PARENTCODE: "",
      OPTM_GROUP_CODE: 0,
      OPTM_CREATEMODE: "3",
      OPTM_PERPOSE: "Y",
      OPTM_FUNCTION: "Shipping",
      OPTM_OBJECT: "Container",
      OPTM_WONUMBER: 0,
      OPTM_TASKHDID: 0,
      OPTM_OPERATION: "",
      OPTM_QUANTITY: 1,
      OPTM_SOURCE: 3,
      OPTM_ParentContainerType: "",
      OPTM_ParentPerQty: "",
      IsWIPCont: false
    });

    oSaveModel.OtherItemsDTL.push({
      OPTM_ITEMCODE: "",
      OPTM_QUANTITY: "",
      OPTM_CONTAINER: "",
      OPTM_AVLQUANTITY: 0,
      OPTM_INVQUANTITY: 0,
      OPTM_BIN: '',
      OPTM_CONTAINERID: "",
      OPTM_TRACKING: "",
      OPTM_WEIGHT: ""
    });

    oSaveModel.OtherBtchSerDTL.push({
      OPTM_BTCHSER: "",
      OPTM_QUANTITY: "",
      OPTM_ITEMCODE: ""
    });
    
    this.shipmentService.CreateContainerForPacking(oSaveModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', this.translate.instant("ContainerCreatedSuccessMsg"));
            this.containerCode = "";
            if(this.runningProcessName == "Stage"){
              this.onStageORUnstageShipmentClick();
            }else if(this.runningProcessName == "ShippingProcess"){
              this.ChangeShipmentProcess();
            }
            this.runningProcessName = "";
          } else {
            this.toastr.error('', data.OUTPUT[0].RESULT);
          }
        } else {
          // this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  //#region "Dock Door"
  GetDataForDockDoor() {
    if (this.WarehouseCode == "" || this.WarehouseCode == null || this.WarehouseCode == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.GetDockDoorBasedOnWarehouse(this.WarehouseCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookupLoader = false;
          this.serviceData = data.Table;
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
          if (data.OPTM_DOCKDOOR.length > 0) {
            this.DockDoor = data.OPTM_DOCKDOOR[0].OPTM_DOCKDOORID;
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

  //#region "Container Group"
  GetDataForContainerGroup() {
    this.showLoader = true;
    this.commonservice.GetDataForContainerGroup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          this.lookupfor = "GroupCodeList";
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

  IsValidContainerGroup() {
    if (this.Container_Group == "" || this.Container_Group == null || this.Container_Group == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidContainerGroup(this.Container_Group).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.Container_Group = data[0].OPTM_CONTAINER_GROUP
          } else {
            this.Container_Group = '';
            this.toastr.error('', this.translate.instant("InvalidGroupCode"));
          }
        } else {
          this.Container_Group = '';
          this.toastr.error('', this.translate.instant("InvalidGroupCode"));
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

  cancelAndUnassign(){
    if (this.ShipmentID == "" || this.ShipmentID == null || this.ShipmentID == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.CancelOrUnassignShipment(this.ShipmentID).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.OUTPUT[0].RESULT == this.translate.instant("DataSaved")) {
            this.toastr.success('', this.translate.instant("CancelAndUnassignedMSg"));
            this.GetDataBasedOnShipmentId(this.ShipmentID);
          } else {
            this.toastr.error('', data.OUTPUT[0].RESULT);
          }
        } else {

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
