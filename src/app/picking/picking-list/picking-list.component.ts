import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { PickTaskService } from '../../services/picktask.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';

@Component({
  selector: 'app-picking-list',
  templateUrl: './picking-list.component.html',
  styleUrls: ['./picking-list.component.scss']
})
export class PickingListComponent implements OnInit {

  showLookupLoader: boolean = true;
  ShipmentList: any[];
  showLoader: boolean = false;

  constructor(private picktaskService: PickTaskService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService) {
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
  public items: any[] = [];
  public mySelection: number[] = [];
  public pageSize = 10;
  public skip = 0;
  public mobileMedia = "(max-width: 767px)";
  public desktopMedia = "(min-width: 768px)";
  // GRID VARIABLE

  ngOnInit() {
    this.picktaskService.clearLocaStorage();
    this.getShipmentList()
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
          // for (var i = 0; i < data.length; i++) {
          //   data[i].OPTM_CONT_PERPARENT = data[i].OPTM_CONT_PERPARENT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          //   data[i].OPTM_CONT_PARTOFPARENT = data[i].OPTM_CONT_PARTOFPARENT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          // }
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
}
