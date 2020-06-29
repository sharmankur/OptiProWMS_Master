import { Component, OnInit } from '@angular/core';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { WhseBinLayoutService } from '../../services/whse-bin-layout.service';
import { WhseBinLayoutComponent } from '../whse-bin-layout/whse-bin-layout.component';

@Component({
  selector: 'app-whse-bin-layout-view',
  templateUrl: './whse-bin-layout-view.component.html',
  styleUrls: ['./whse-bin-layout-view.component.scss']
})
export class WhseBinLayoutViewComponent implements OnInit {

  showLookup: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private commonservice: Commonservice, private router: Router, private toastr: ToastrService,
    private translate: TranslateService, private whseBinLayoutService: WhseBinLayoutService,
    private whseBintComponent: WhseBinLayoutComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.GetDataWareHouseMaster();
  }

  GetDataWareHouseMaster() {
    this.showLoader = true;
    this.whseBinLayoutService.GetDataWareHouseMaster().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = false;
          this.serviceData = data;
          for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
            if (this.serviceData[iBtchIndex].OPTM_ADD_TOCONT == 'Y') {
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "Yes";
            } else {
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "No";
            }
          }
          for (var i = 0; i < this.serviceData.length; i++) {
            this.serviceData[i].hideCopy = true
          }
          this.lookupfor = "WhseBinLayoutList";
        } else {
          //this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  getLookupKey(event) {
    console.log("getLookupKey" + event)
    localStorage.setItem("Action", "edit");
    localStorage.setItem("Row", JSON.stringify(event));
    this.whseBintComponent.whseBinLayoutComponent = 2;
  }

  onCopyItemClick(event) {
    localStorage.setItem("CAR_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.whseBintComponent.whseBinLayoutComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  selectedRows: any = []
  onChangeSelection(event) {
    console.log(event)
    this.selectedRows = event;
  }

  OnAddClick() {
    if (this.selectedRows.length > 0) {
      this.event = event;
      this.dialogFor = "DataLost";
      this.yesButtonText = this.translate.instant("yes");
      this.noButtonText = this.translate.instant("no");
      this.showConfirmDialog = true;
      this.dialogMsg = this.translate.instant("SelectionLostMsg");
    } else {
      localStorage.setItem("CAR_ROW", "");
      localStorage.setItem("Action", "");
      this.whseBintComponent.whseBinLayoutComponent = 2;
    }
  }

  showConfirmDialog: boolean = false;
  dialogMsg: string;
  yesButtonText: string;
  noButtonText: string;
  dialogFor: string;
  event: any = [];

  OnDeleteSelected(event) {
    if (event.length <= 0) {
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

  getConfirmDialogValue($data) {
    this.showConfirmDialog = false;
    if ($data.Status == "yes") {
      switch ($data.From) {
        case ("DataLost"):
          localStorage.setItem("CAR_ROW", "");
          localStorage.setItem("Action", "");
          this.whseBintComponent.whseBinLayoutComponent = 2;
          break
        case ("Delete"):
          var ddDeleteArry: any[] = [];
          ddDeleteArry.push({
            CompanyDBId: localStorage.getItem("CompID"),
            OPTM_WHSCODE: this.event.OPTM_WHSCODE
          });
          this.DeleteFromWareHouseMaster(ddDeleteArry);
          break;
        case ("DeleteSelected"):
          var ddDeleteArry: any[] = [];
          for (var i = 0; i < this.event.length; i++) {
            ddDeleteArry.push({
              OPTM_WHSCODE: this.event[i].OPTM_WHSCODE,
              CompanyDBId: localStorage.getItem("CompID")
            });
          }
          this.DeleteFromWareHouseMaster(ddDeleteArry);
          break;

      }
    } else {
      if ($data.Status == "no") {
        switch ($data.From) {
          case ("delete"):
            break;
          case ("DeleteSelected"):
            break;

        }
      }
    }
  }

  // OnDeleteSelected(event){
  //   if(event.length <= 0){
  //     this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
  //     return;
  //   }
  //   var ddDeleteArry: any[] = [];
  //   for(var i=0; i<event.length; i++){
  //     ddDeleteArry.push({       
  //       OPTM_WHSCODE: event[i].OPTM_WHSCODE,
  //       CompanyDBId: localStorage.getItem("CompID")
  //     });
  //   }
  //   this.DeleteFromWareHouseMaster(ddDeleteArry);
  // }

  onDeleteRowClick(event) {
    this.event = event;
    this.dialogFor = "Delete";
    this.yesButtonText = this.translate.instant("yes");
    this.noButtonText = this.translate.instant("no");
    this.showConfirmDialog = true;
    this.dialogMsg = this.translate.instant("DoYouWantToDeleteConf");
  }

  DeleteFromWareHouseMaster(ddDeleteArry) {
    this.showLoader = true;
    this.whseBinLayoutService.DeleteWhseBinLayout(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.GetDataWareHouseMaster();
          } else {
            this.toastr.error('', data[0].RESULT);
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
}
