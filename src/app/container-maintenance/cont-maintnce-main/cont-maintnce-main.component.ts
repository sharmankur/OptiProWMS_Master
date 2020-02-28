import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { ContainerCreationService } from 'src/app/services/container-creation.service';

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

  constructor(private translate: TranslateService, private commonservice: Commonservice,
    private toastr: ToastrService,
    private router: Router, private containerCreationService: ContainerCreationService) { }

  ngOnInit() {
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  onPostToInvClick() {

  }

  onContainerOperationClick() {

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
        this.containerStatus = $event[11]
        this.shipEligible = $event[12]
        this.inventoryStatus = $event[17]
        this.warehouse = $event[18]
        this.binCode = $event[19]
        this.weight = $event[20]
        this.volume = $event[22]
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
