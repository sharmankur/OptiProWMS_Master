import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { PickTaskService } from '../../services/picktask.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { CommonData } from '../../models/CommonData';

@Component({
  selector: 'app-picking-list',
  templateUrl: './picking-list.component.html',
  styleUrls: ['./picking-list.component.scss']
})
export class PickingListComponent implements OnInit {

  // this component for maintainance picking
  showLookupLoader: boolean = true;
  ShipmentList: any[];
  showLoader: boolean = false;

  WarehouseId: any = '';
  serviceData: any[];
  lookupfor: string;
  showLookup: boolean = false;
  
  constructor(private picktaskService: PickTaskService,  private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private commonservice: Commonservice, private containerCreationService: ContainerCreationService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  // GRID VAIRABLE
  public gridView: any = [
    {
      "OPTM_DOCENTRY": "Ship123",
      "OPTM_BPCODE": "BatchMaster Pvt. Ltd",
      "OPTM_SHIPTO": "Indore",
      "OPTM_WHSCODE": "Warehouse123"
    }, {
      "OPTM_DOCENTRY": "Ship123",
      "OPTM_BPCODE": "BatchMaster Pvt. Ltd",
      "OPTM_SHIPTO": "Indore",
      "OPTM_WHSCODE": "Warehouse123"
    },
    {
      "OPTM_DOCENTRY": "Ship123",
      "OPTM_BPCODE": "BatchMaster Pvt. Ltd",
      "OPTM_SHIPTO": "Indore",
      "OPTM_WHSCODE": "Warehouse123"
    },
    {
      "OPTM_DOCENTRY": "Ship123",
      "OPTM_BPCODE": "BatchMaster Pvt. Ltd",
      "OPTM_SHIPTO": "Indore",
      "OPTM_WHSCODE": "Warehouse123"
    },
  ];

  commonData: any = new CommonData();
  public items: any[] = [];
  public mySelection: number[] = [];
  public pageSize = 10;
  public skip = 0;
  public mobileMedia = "(max-width: 767px)";
  public desktopMedia = "(min-width: 768px)";
  // GRID VARIABLE

  ngOnInit() {
    this.picktaskService.clearLocaStorage();
    this.statusArray = this.commonData.Container_Shipment_Status_DropDown();
   // this.getShipmentList()
    this.commonservice.setCustomizeInfo();
  }

  onShipmentSelection(row) {
    localStorage.setItem("ShipDetail", JSON.stringify(row.dataItem));
    localStorage.setItem("From", "shiplist");
    this.router.navigate(['home/picking/picking-item-details']);
  }

  showPickTaskList(row) {
    localStorage.setItem("ShipDetail", JSON.stringify(row));
    this.router.navigate(['home/picking/picking-item-list']);
  }

  getShipmentList() {
    this.showLoader = true;
    this.picktaskService.GetShipmentId().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookupLoader = false;
          
          this.ShipmentList = data;
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


  ShowBatchSerials(){
    
  }



  async onWhseChange() {
    if (this.WarehouseId == undefined || this.WarehouseId == "") {
      return;
    }
    this.showLookup = false;
    var result = false;
    await this.containerCreationService.IsValidWhseCode(this.WarehouseId).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.WarehouseId = ''
        } else {
          this.WarehouseId = resp[0].WhsCode
        }
        result = true;
      },
      error => {
        result = false;
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
    return result;
  }


  GetWhseCode() {
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
  statusArray: any = [];
  StatusValue:any='';
  onStatusChange($event) {
    this.StatusValue = $event.Value;
  }

  getLookupDataValue($event) {
    if ($event != null && $event == "close") {
      return;
    }
    else {
      if (this.lookupfor == "WareHouse") {
        this.WarehouseId = $event.WhsCode;
      }
      else if (this.lookupfor == "BinList") {
        //this.BinId = $event.BinCode;
      }

    }
  }

  onArrowBtnClick() {
    this.router.navigate(['home/shipment']);
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }
}
