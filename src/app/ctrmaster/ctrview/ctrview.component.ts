import { Component, OnInit } from '@angular/core';
import { CTRMainComponent } from '../ctrmain/ctrmain.component';
import { Commonservice } from '../../services/commonservice.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CTRMasterService } from '../../services/ctrmaster.service';

@Component({
  selector: 'app-ctrview',
  templateUrl: './ctrview.component.html',
  styleUrls: ['./ctrview.component.scss']
})
export class CTRViewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private ctrmasterService: CTRMasterService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private ctrmainComponent: CTRMainComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.getContainerRelationship();
  }


  getContainerRelationship() {
    this.showLoader = true;
    this.ctrmasterService.GetDataForContainerRelationship().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookupLoader = false;
          for (var i = 0; i < data.length; i++) {
            data[i].OPTM_CONT_PERPARENT = data[i].OPTM_CONT_PERPARENT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
            data[i].OPTM_CONT_PARTOFPARENT = data[i].OPTM_CONT_PARTOFPARENT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          }
          this.serviceData = data;
          this.lookupfor = "CTRList";
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
    localStorage.setItem("CTR_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "");
    this.ctrmainComponent.ctrComponent = 2;
  }

  onCopyItemClick(event) {
    localStorage.setItem("CTR_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.ctrmainComponent.ctrComponent = 2;
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
      localStorage.setItem("CTR_ROW", "");
      localStorage.setItem("Action", "");
      this.ctrmainComponent.ctrComponent = 2;
    }
  }

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

  onDeleteRowClick(event) {
    this.event = event;
    this.dialogFor = "Delete";
    this.yesButtonText = this.translate.instant("yes");
    this.noButtonText = this.translate.instant("no");
    this.showConfirmDialog = true;
    this.dialogMsg = this.translate.instant("DoYouWantToDeleteConf");
  }

  DeleteFromContainerRelationship(ddDeleteArry) {
    this.showLoader = true;
    this.ctrmasterService.DeleteFromContainerRelationship(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.getContainerRelationship();
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
        case ("DataLost"):
          localStorage.setItem("CTR_ROW", "");
          localStorage.setItem("Action", "");
          this.ctrmainComponent.ctrComponent = 2;
          break
        case ("Delete"):
          var ddDeleteArry: any[] = [];
          ddDeleteArry.push({
            CompanyDBId: localStorage.getItem("CompID"),
            OPTM_CONTAINER_TYPE: this.event.OPTM_CONTAINER_TYPE,
            OPTM_PARENT_CONTTYPE: this.event.OPTM_PARENT_CONTTYPE,
          });
          this.DeleteFromContainerRelationship(ddDeleteArry);
          break;
        case ("DeleteSelected"):
          if (this.event.length <= 0) {
            this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
            return;
          }
          var ddDeleteArry: any[] = [];
          for (var i = 0; i < this.event.length; i++) {
            ddDeleteArry.push({
              OPTM_CONTAINER_TYPE: this.event[i].OPTM_CONTAINER_TYPE,
              OPTM_PARENT_CONTTYPE: this.event[i].OPTM_PARENT_CONTTYPE,
              CompanyDBId: localStorage.getItem("CompID")
            });
          }
          this.DeleteFromContainerRelationship(ddDeleteArry);
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
