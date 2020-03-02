import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { DockdoormainComponent } from '../dockdoormain/dockdoormain.component';
import { DockdoorService } from '../../services/dockdoor.service';
import { Router } from '@angular/router';
import { LookupComponent } from '../../common/lookup/lookup.component';

@Component({
  selector: 'app-dockdoorview',
  templateUrl: './dockdoorview.component.html',
  styleUrls: ['./dockdoorview.component.scss']
})
export class DockdoorviewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService, private ddmainComponent: DockdoormainComponent, private ddService: DockdoorService, private router: Router) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    this.GetDataForDockDoor();
  }

  GetDataForDockDoor() {
    this.showLoader = true;
    this.ddService.GetDataForDockDoor().subscribe(
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

  IsValidDockDoor(PTM_DOCKDOORID: string, OPTM_WHSE: string) {
    this.showLoader = true;
    this.ddService.IsValidDockDoor(PTM_DOCKDOORID, OPTM_WHSE).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          localStorage.setItem("DD_Grid_Data", JSON.stringify(data));
          this.ddmainComponent.ddComponent = 2;
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
    localStorage.setItem("DD_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "");
    this.IsValidDockDoor(event.OPTM_DOCKDOORID, event.OPTM_WHSE);
  }

  onCopyItemClick(event) {
    localStorage.setItem("DD_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.IsValidDockDoor(event.OPTM_DOCKDOORID, event.OPTM_WHSE);
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick() {
    localStorage.setItem("DD_ROW", "");
    localStorage.setItem("Action", "");
    this.ddmainComponent.ddComponent = 2;
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

  DeleteFromDockDoor(ddDeleteArry) {
    this.showLoader = true;
    this.ddService.DeleteFromDockDoor(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == this.translate.instant("DataSaved")) {
            this.GetDataForDockDoor();
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
  event: any[] = [];

  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("Delete"):
          var ddDeleteArry: any[] = [];
          ddDeleteArry.push({
            OPTM_DOCKDOORID: this.event[0],
            OPTM_WHSE: this.event[1],
            CompanyDBId: localStorage.getItem("CompID")
          });
          this.DeleteFromDockDoor(ddDeleteArry);
          break;
        case ("DeleteSelected"):
          if (this.event.length <= 0) {
            this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
            return;
          }
          var ddDeleteArry: any[] = [];
          for (var i = 0; i < this.event.length; i++) {
            ddDeleteArry.push({
              OPTM_DOCKDOORID: this.event[i].OPTM_DOCKDOORID,
              OPTM_WHSE: this.event[i].OPTM_WHSE,
              CompanyDBId: localStorage.getItem("CompID")
            });
          }
          this.DeleteFromDockDoor(ddDeleteArry);
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
