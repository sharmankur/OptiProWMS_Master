import { Component, OnInit } from '@angular/core';
import { Commonservice } from '../../services/commonservice.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CARMainComponent } from '../carmain/carmain.component';
import { CARMasterService } from '../../services/carmaster.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-carview',
  templateUrl: './carview.component.html',
  styleUrls: ['./carview.component.scss']
})
export class CARViewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private carmasterService: CARMasterService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private carmainComponent: CARMainComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.GetDataForContainerAutoRule();
  }

  GetDataForContainerAutoRule() {
    this.showLoader = true;
    this.carmasterService.GetDataForContainerAutoRule().subscribe(
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
          for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
            if (this.serviceData[iBtchIndex].OPTM_ADD_TOCONT == 'Y') {
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = this.translate.instant("yes");
            } else {
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = this.translate.instant("no");
            }

            if (this.serviceData[iBtchIndex].OPTM_CONTUSE == '1') {
              this.serviceData[iBtchIndex].OPTM_CONTUSE = this.translate.instant("Shipping");
            } else if (this.serviceData[iBtchIndex].OPTM_CONTUSE == '2') {
              this.serviceData[iBtchIndex].OPTM_CONTUSE = this.translate.instant("Internal");
            } else {
              this.serviceData[iBtchIndex].OPTM_CONTUSE = this.translate.instant("Both");
            }
          }
          this.lookupfor = "CARList";
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
    localStorage.setItem("CAR_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "");
    this.IsValidContainerAutoRule(event.OPTM_RULEID, event.OPTM_CONTTYPE, event.OPTM_CONTUSE);
  }

  onCopyItemClick(event) {
    localStorage.setItem("CAR_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.IsValidContainerAutoRule(event.OPTM_RULEID, event.OPTM_CONTTYPE, event.OPTM_CONTUSE);
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick() {
    localStorage.setItem("CAR_ROW", "");
    localStorage.setItem("Action", "");
    this.carmainComponent.carComponent = 2;
  }

  OnDeleteSelected(event) {
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

  DeleteFromContainerAutoRule(ddDeleteArry) {
    for (var iBtchIndex = 0; iBtchIndex < ddDeleteArry.length; iBtchIndex++) {
      if (ddDeleteArry[iBtchIndex].OPTM_CONTUSE == this.translate.instant("Shipping")) {
        ddDeleteArry[iBtchIndex].OPTM_CONTUSE = '1';
      } else if (ddDeleteArry[iBtchIndex].OPTM_CONTUSE == this.translate.instant("Internal")) {
        ddDeleteArry[iBtchIndex].OPTM_CONTUSE = '2';
      } else {
        ddDeleteArry[iBtchIndex].OPTM_CONTUSE = '3';
      }
    }

    this.showLoader = true;
    this.carmasterService.DeleteFromContainerAutoRule(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.GetDataForContainerAutoRule();
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

  IsValidContainerAutoRule(ruleId, ContType, ContUse) {
    if (ContUse == this.translate.instant("Shipping")) {
      ContUse = '1';
    } else if (ContUse == this.translate.instant("Internal")) {
      ContUse = '2';
    } else {
      ContUse = '3';
    }
    this.showLoader = true;
    this.carmasterService.IsValidContainerAutoRule(ruleId, ContType, ContUse).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          localStorage.setItem("CAR_Grid_Data", JSON.stringify(data));
          this.carmainComponent.carComponent = 2;
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
  event: any[] = [];

  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("Delete"):
          var ddDeleteArry: any[] = [];
          ddDeleteArry.push({
            CompanyDBId: localStorage.getItem("CompID"),
            OPTM_RULEID: this.event[0],
            OPTM_CONTTYPE: this.event[1],
            OPTM_CONTUSE: this.event[2]
          });
          this.DeleteFromContainerAutoRule(ddDeleteArry);
          break;
        case ("DeleteSelected"):
          if (this.event.length <= 0) {
            this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
            return;
          }
          var ddDeleteArry: any[] = [];
          for (var i = 0; i < this.event.length; i++) {
            ddDeleteArry.push({
              OPTM_RULEID: this.event[i].OPTM_RULEID,
              OPTM_CONTTYPE: this.event[i].OPTM_CONTTYPE,
              OPTM_CONTUSE: this.event[i].OPTM_CONTUSE,
              CompanyDBId: localStorage.getItem("CompID")
            });
          }
          this.DeleteFromContainerAutoRule(ddDeleteArry);
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
