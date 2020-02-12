import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { CommonData } from 'src/app/models/CommonData';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-container-shipment',
  templateUrl: './container-shipment.component.html',
  styleUrls: ['./container-shipment.component.scss']
})
export class ContainerShipmentComponent implements OnInit {

  ContainerCodeId: any;
  purposeArray: any = [];
  PurposeId: any;
  statusArray: any = [];
  StatusId: any;
  WarehouseId: any;
  BinId: any;
  ContainerTypeId: any;
  ContainerTypeArray: any = [];
  ShipmentId: any;
  InvPostStatusArray: any = [];
  InvPostStatusId: any;
  ContainerItems: any = [];
  serviceData: any[];
  lookupfor: string;
  showLookup: boolean = false;
  showLoader: boolean = false;
  commonData: any = new CommonData();

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,private containerCreationService: ContainerCreationService,private router: Router) { }

  ngOnInit() {
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.statusArray = this.commonData.Container_Shipment_Status_DropDown();
    this.InvPostStatusArray = this.commonData.Container_Shipment_Inv_Status_DropDown();
    this.getContainerType();
  }

  getContainerType(){
    this.ContainerTypeArray = [];
    this.containerCreationService.GetContainerType().subscribe(
      (data: any) => {
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          
          for(let i=0; i<data.length;i++){   
            this.ContainerTypeArray.push({
              "Name": data[i].OPTM_CONTAINER_TYPE,
              "Value": data[i].OPTM_CONTAINER_TYPE
            })
          }          
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  onPurposeSelectChange ($event) {
    this.PurposeId = $event.Value;
  }

  GetWhseCode (){
    this.commonservice.GetWhseCode().subscribe(
      (data: any) => {
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;          

          this.lookupfor = "WareHouse";
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  GetBinCode () {
    if (this.WarehouseId == undefined || this.WarehouseId == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }
    this.showLoader = true;
    this.commonservice.GetBinCode(this.WarehouseId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;         

          this.lookupfor = "BinList";
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
  
  onContainerTypeChange ($event) {

  }

  onStatusChange ($event) {
    this.StatusId = $event.Value;
  }
  
  onInvPostStatusChange ($event) {
    this.InvPostStatusId = $event.Value;
  }

  getLookupValue($event) {
    if ($event != null && $event == "close") {
      return;
    }
    else {     
       if (this.lookupfor == "WareHouse") {
        this.WarehouseId = $event[0];
       } 
    else if (this.lookupfor == "BinList") {
        this.BinId = $event[0];
      }
     }
  }

}
