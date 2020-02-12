import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../services/shipment.service';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonData } from '../../models/CommonData';
@Component({
  selector: 'app-shipment-view',
  templateUrl: './shipment-view.component.html',
  styleUrls: ['./shipment-view.component.scss']
})
export class ShipmentViewComponent implements OnInit {
  public pageSize = 10;
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
  ScheduleDatetime: string;
  ShipStageBin: string;
  DockDoor: string;
  ShipToCode: string;
  Status: string;
  CarrierCode: string;
  ReturnOrderRef: string;
  UseContainer: boolean;
  BOLNumber: string;
  VehicleNumber: string;
  shipmentLines: any[] = [];
  SODetails: any[] = [];
  commonData: any = new CommonData();
  shiment_status_array: any[] = [];


  constructor(private shipmentService: ShipmentService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {

    });
  }

  ngOnInit() {
    this.shiment_status_array = this.commonData.shiment_status_array();
    this.GetShipmentIdForShipment();
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
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.updateShipmentHDR(data.OPTM_SHPMNT_HDR);
          this.shipmentLines = data.OPTM_SHPMNT_DTL;
          this.SODetails = data.OPTM_SHPMNT_SODTL;
          this.updateShipmentHDR(data.OPTM_SHPMNT_HDR);
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

  updateShipmentHDR(OPTM_SHPMNT_HDR) {

    // this.ReturnOrderRef = OPTM_SHPMNT_HDR.OPTM_BPCODE;
    // this.UseContainer = OPTM_SHPMNT_HDR.OPTM_BPCODE;
    // this.BOLNumber = OPTM_SHPMNT_HDR.OPTM_BPCODE;
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  getValue(OPTM_STATUS): string{
    return this.shiment_status_array[Number(OPTM_STATUS)].Name;
  }
  
  getlookupSelectedItem(event) {
    if (this.lookupfor == "ShipmentList") {
      this.ShipmentID = event.OPTM_SHIPMENTID
      this.CustomerCode = event.OPTM_BPCODE
      this.WarehouseCode = event.OPTM_WHSCODE;
      this.ScheduleDatetime = event.OPTM_PICKUPDATETIME;
      this.ShipStageBin = event.OPTM_BINCODE;
      this.DockDoor = event.OPTM_DOCKDOORID;
      this.ShipToCode = event.OPTM_SHIPTO;
      this.Status = this.getValue(event.OPTM_STATUS);
      
      this.CarrierCode = event.OPTM_CARRIER;
      // this.ReturnOrderRef = event.OPTM_BPCODE;
      // this.UseContainer = event.OPTM_BPCODE;
      // this.BOLNumber = event.OPTM_BPCODE;
      this.VehicleNumber = event.OPTM_VEHICLENO;
      this.GetDataBasedOnShipmentId(this.ShipmentID);
    } else if (this.lookupfor == "DDList") {
      this.DockDoor = event.OPTM_DOCKDOORID
    } else if (this.lookupfor == "CarrierList") {
      this.CarrierCode = event.OPTM_CARRIERID
    }
  }

  onScheduleClick() {
    this.showLoader = true;
    this.shipmentService.ScheduleShipment(this.ShipmentID, this.CarrierCode, this.ScheduleDatetime,
      this.DockDoor).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            if (data[0].RESULT == this.translate.instant("DataSaved")) {
              // this.toastr.success('', data[0].RESULT);
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


  onStageORUnstageShipmentClick() {
    this.showLoader = true;
    this.shipmentService.StageORUnstageShipment(this.ShipmentID).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            // this.toastr.success('', data[0].RESULT);
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

}
