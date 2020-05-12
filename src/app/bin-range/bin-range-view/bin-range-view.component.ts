import { Component, OnInit } from '@angular/core';
import { Commonservice } from '../../services/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BinRangeMainComponent } from '../bin-range-main/bin-range-main.component';
import { BinRangeService } from '../../services/binrange.service';

@Component({
  selector: 'app-bin-range-view',
  templateUrl: './bin-range-view.component.html',
  styleUrls: ['./bin-range-view.component.scss']
})
export class BinRangeViewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService, private binRangeService: BinRangeService,
    private binrangesMainComponent: BinRangeMainComponent, private router: Router) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  
  ngOnInit() {
    this.GetDataForBinRanges();
  }

  GetDataForBinRanges() {
    this.showLoader = true;
    this.commonservice.GetDataForBinRanges("").subscribe(
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
          this.lookupfor = "BinRangeList";
          for(var i=0;i<this.serviceData.length;i++){
            this.serviceData[i].hideCopy = true
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

  getlookupSelectedItem(event) {
    localStorage.setItem("BinRangesRow", JSON.stringify(event));
    localStorage.setItem("Action", "");
    this.binrangesMainComponent.binRangesComponent = 2;
  }

  onCopyItemClick(event) {
    localStorage.setItem("BinRangesRow", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.binrangesMainComponent.binRangesComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick() {
    localStorage.setItem("BinRangesRow", "");
    localStorage.setItem("Action", "");
    this.binrangesMainComponent.binRangesComponent = 2;
  }

  OnDeleteSelected(event) {
    if(event.length <= 0){
      this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
      return;
    }
    this.event = event;
    this.dialogFor = "DeleteSelected";
    this.yesButtonText = this.translate.instant("yes");
    this.noButtonText = this.translate.instant("no");
    this.showConfirmDialog = true;
    this.dialogMsg = this.translate.instant("DoYouWantToDeleteConf");
  }

  onDeleteRowClick(event) {
    this.event = event;
    this.dialogFor = "Delete";
    this.yesButtonText = this.translate.instant("yes");
    this.noButtonText = this.translate.instant("no");
    this.showConfirmDialog = true;
    this.dialogMsg = this.translate.instant("DoYouWantToDeleteConf");
  }

  DeleteFromBinranges(ddDeleteArry) {
    this.showLoader = true;
    this.binRangeService.DeleteFromBinranges(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.GetDataForBinRanges();
            this.toastr.success('', this.translate.instant("Masking_RowDeletedMsg"));
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

  showConfirmDialog: boolean = false;
  dialogMsg: string;
  yesButtonText: string;
  noButtonText: string;
  dialogFor: string;
  event: any = [];

  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("Delete"):
          var ddDeleteArry: any[] = [];
          ddDeleteArry.push({
            OPTM_BIN_RANGE: this.event.OPTM_BIN_RANGE,
            OPTM_WHSCODE: this.event.OPTM_WHSCODE,
            CompanyDBId: localStorage.getItem("CompID")
          });
          this.DeleteFromBinranges(ddDeleteArry);
          break;
        case ("DeleteSelected"):
          if (this.event.length <= 0) {
            this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
            return;
          }
          var ddDeleteArry: any[] = [];
          for (var i = 0; i < this.event.length; i++) {
            ddDeleteArry.push({
              OPTM_BIN_RANGE: this.event[i].OPTM_BIN_RANGE,
              OPTM_WHSCODE: this.event[i].OPTM_WHSCODE,
              CompanyDBId: localStorage.getItem("CompID")
            });
          }
          this.DeleteFromBinranges(ddDeleteArry);
          break;

      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
          case ("delete"):
            break;
          case ("DeleteSelected"):
            break;

        }
      }
    }
  }

}
