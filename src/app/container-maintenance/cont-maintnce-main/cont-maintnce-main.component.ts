import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { ContMaintnceComponent } from '../cont-maintnce/cont-maintnce.component';

@Component({
  selector: 'app-cont-maintnce-main',
  templateUrl: './cont-maintnce-main.component.html',
  styleUrls: ['./cont-maintnce-main.component.scss']
})
export class ContMaintnceMainComponent implements OnInit {

  viewLines: boolean = false
  showLookup: boolean = false;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  containerId: any;
  packProcess: any;
  containerCode: any;
  warehouse: any;
  containerStatus: any;
  binCode: any;
  inventoryStatus: any;
  weight: any;
  shipEligible: any;
  volume: any;
  containerItems: any = []
  constructor(private translate: TranslateService, private commonservice: Commonservice,
    private toastr: ToastrService,
    private router: Router, private containerCreationService: ContainerCreationService, private contMaintenance: ContMaintnceComponent) { }

  ngOnInit() {
    localStorage.setItem("From", "")
    this.contMaintenance.cmComponent = 1;
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  onPostToInvClick() {

  }

  onContainerOperationClick() {
    localStorage.setItem("From", "CMaintenance")
    this.contMaintenance.cmComponent = 2;
  }

  onCloseClick(){

  }

  onReopenClick() {

  }

  onSetDamagedClick() {

  }

  GetAllContainer() {
    this.showLoader = true;
    this.containerCreationService.GetAllContainer().subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "ContainerIdList";
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

  containerStatusEnum: any;
  inventoryStatusEnum: any;
  shipEligibleEnum: any;
  getLookupValue($event) {
    this.showLookup = false;
    if ($event != null && $event == "close") {
      //nothing to do
      return;
    }
    else {
      if (this.lookupfor == "ContainerIdList") {
        this.containerId = $event[0];
        this.containerCode = $event[1];
        this.containerStatusEnum = $event[11]
        this.shipEligibleEnum = $event[12]
        this.inventoryStatusEnum = $event[17]
        this.warehouse = $event[18]
        this.binCode = $event[19]
        this.weight = $event[20]
        this.volume = $event[22]
        this.containerStatus = this.getContainerStatus(this.containerStatusEnum)
        this.inventoryStatus = this.getInvStatus(this.inventoryStatusEnum)
        this.shipEligible = this.getShipEligible(this.shipEligibleEnum);
        this.getItemAndBSDetailByContainerId()
      }
    }
  }

  onContainerIdChange() {
    if (this.containerId == undefined || this.containerId == "") {
      return;
    }
    this.showLoader = true;
    this.containerCreationService.IsValidContainerId(this.containerId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length == 0) {
            this.containerId = '';
            this.toastr.error('', this.translate.instant("InvalidContainerId"));
          } else {
            this.containerId = data[0].OPTM_CONTAINERID;
            this.containerCode = data[0].OPTM_CONTCODE
            this.containerStatusEnum = data[0].OPTM_STATUS
            this.shipEligibleEnum = data[0].OPTM_SHIPELIGIBLE
            this.inventoryStatusEnum = data[0].OPTM_INV_STATUS
            this.warehouse = data[0].OPTM_WHSE
            this.binCode = data[0].OPTM_BIN
            this.weight = data[0].OPTM_WEIGHT
            this.volume = data[0].OPTM_VOLUME
            this.containerStatus = this.getContainerStatus(this.containerStatusEnum)
            this.inventoryStatus = this.getInvStatus(this.inventoryStatusEnum)
            this.shipEligible = this.getShipEligible(this.shipEligibleEnum);
            this.getItemAndBSDetailByContainerId()
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

  getContainerStatus(id) {
    if (id == undefined || id == "") {
      return ""
    }
    id = Number("" + id)

    if (id == 1) {
      return this.translate.instant("CStatusNew");
    } else if (id == 2) {
      return this.translate.instant("CScheduledNew");
    } else if (id == 3) {
      return this.translate.instant("CClosedNew");
    } else if (id == 4) {
      return this.translate.instant("CReopenedNew");
    } else if (id == 5) {
      return this.translate.instant("CAssignedNew");
    } else if (id == 6) {
      return this.translate.instant("CShippedNew");
    } else if (id == 7) {
      return this.translate.instant("CPickedNew");
    } else if (id == 8) {
      return this.translate.instant("CReturnNew");
    } else if (id == 9) {
      return this.translate.instant("CDamagedNew");
    } else if (id == 10) {
      return this.translate.instant("CCancelledNew");
    }
  }

  getInvStatus(id) {
    if (id == undefined || id == "") {
      return ""
    }
    id = Number("" + id)

    if (id == 1) {
      return this.translate.instant("InvStatusPending");
    } else if (id == 2) {
      return this.translate.instant("InvStatusPosted");
    }
  }

  getShipEligible(v) {
    if (v == undefined || v == "") {
      return ""
    }

    if (v == "Y") {
      return this.translate.instant("Shipping");
    } else if (v == "N") {
      return this.translate.instant("Internal");
    }
  }

  getItemAndBSDetailByContainerId() {
    if (this.containerId == undefined || this.containerId == "") {
      return;
    }
    this.showLoader = true;
    this.containerCreationService.GetItemAndBtchSerDetailBasedOnContainerID(this.containerId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length == 0) {
            this.containerId = '';
            this.toastr.error('', this.translate.instant("InvalidContainerId"));
          } else {
            this.containerItems = data.ItemDeiail
            var batchSerailsData = data.BtchSerDeiail
            for (var i = 0; i < this.containerItems.length; i++) {
              this.containerItems[i].ItemBatchSerailData = []
              for (var j = 0; j < batchSerailsData.length; j++) {
                if(this.containerItems[i].OPTM_ITEMCODE == batchSerailsData[j].OPTM_ITEMCODE){
                  this.containerItems[i].ItemBatchSerailData.push(batchSerailsData[j]);
                }
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
}
