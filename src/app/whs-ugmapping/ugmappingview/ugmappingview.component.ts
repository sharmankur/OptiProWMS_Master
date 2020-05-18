import { Component, OnInit } from '@angular/core';
import { WhsUGMappingMasterComponent } from '../whs-ugmapping-master/whs-ugmapping-master.component';
import { Commonservice } from '../../services/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ContainerCreationService } from '../../services/container-creation.service';
import { WhsUserGroupService } from '../../services/whs-user-group.service';

@Component({
  selector: 'app-ugmappingview',
  templateUrl: './ugmappingview.component.html',
  styleUrls: ['./ugmappingview.component.scss']
})
export class UgmappingviewComponent implements OnInit {


  showLookupLoader: boolean = true;
  serviceData: any[];
  groupData: any[];
  groupDataFor: any;
  lookupfor: string;
  showLoader: boolean = false;
  showLookup: boolean = false;

  whsCode: any = '';
  whsName: any = '';
  pickingGroup: any = '';
  packingGroup: any = '';
  putAwayGroup: any = '';
  receivingGroup: any = '';
  shippingGroup: any = '';
  returnGroup: any = '';
  moveGroup: any = '';
  binRange: any = '';
  whsZone: any = '';
  isValidateCalled: boolean = false;
  forUpdate: boolean = false;

  constructor(private whsUGMappingMasterComponent: WhsUGMappingMasterComponent,
    private translate: TranslateService, private commonservice: Commonservice,
    private toastr: ToastrService, private router: Router, private userGroupMappingService: WhsUserGroupService,
    private containerCreationService: ContainerCreationService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    this.GetDataForWarehouseUserGroupList();
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
      this.whsUGMappingMasterComponent.WhsUGComponent = 2;
      localStorage.setItem("UGAction", "add");
    }
  }

  GetDataForWarehouseUserGroupList() {
    this.showLoader = true;
    this.userGroupMappingService.GetDataForWarehouseUserGroupList().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.groupDataFor = "groupData"
          this.groupData = data;
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

  getGridItemClick($event) {
    localStorage.setItem("UGMapping_ROW", JSON.stringify($event));
    localStorage.setItem("UGAction", "update");
    this.whsUGMappingMasterComponent.WhsUGComponent = 2;
  }

  showConfirmDialog: boolean = false;
  dialogMsg: string;
  yesButtonText: string;
  noButtonText: string;
  dialogFor: string;
  event: any = [];

  onDeleteRowClick(event) {
    this.event = event;
    this.event = event;
    this.dialogFor = "Delete";
    this.yesButtonText = this.translate.instant("yes");
    this.noButtonText = this.translate.instant("no");
    this.showConfirmDialog = true;
    this.dialogMsg = this.translate.instant("DoYouWantToDeleteConf");
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

  deleteUserGroupListRow(optmId: String, whsCode: String, whsZone: String, binRange: String) {
    this.showLoader = true;
    this.userGroupMappingService.DeleteUserGroup(optmId, whsCode, whsZone, binRange).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0 && data[0].RESULT == "Data Saved") {
            this.toastr.success('', this.translate.instant("DeletedSuccessfullyErrorMsg"));
            this.groupData = [];
            this.groupDataFor = ''
            this.GetDataForWarehouseUserGroupList();
          } else {
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

  deleteMultipleRows(data: any) {
    this.showLoader = true;
    this.userGroupMappingService.DeleteMultipleUserGroup(data).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0 && data[0].RESULT == "Data Saved") {
            this.toastr.success('', this.translate.instant("DeletedSuccessfullyErrorMsg"));
            // this.resetForm(1);
            this.groupData = [];
            this.groupDataFor = ''
            this.GetDataForWarehouseUserGroupList();
          } else {
            if (data.length > 0 && data[0].RESULT == "Data Not Saved") {
              this.toastr.error('', this.translate.instant("UnableToDeleteErrorMsg"));
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

  onCopyItemClick($event) {
    console.log("list Items:", this.groupData.length);
    localStorage.setItem("UGMapping_ROW", JSON.stringify($event));
    localStorage.setItem("UGAction", "copy");
    this.whsUGMappingMasterComponent.WhsUGComponent = 2;
  }

  selectedRows: any = []
  onChangeSelection(event) {
    console.log(event)
    this.selectedRows = event;
  }

  getConfirmDialogValue($data) {
    this.showConfirmDialog = false;
    if ($data.Status == "yes") {
      switch ($data.From) {
        case ("DataLost"):
          localStorage.setItem("UGAction", "add");
          this.whsUGMappingMasterComponent.WhsUGComponent = 2;
          break
        case ("Delete"):
          var optmId = this.event.OPTM_ID;
          var whsCode = this.event.OPTM_WHSCODE;
          var whsZone = this.event.OPTM_WHSEZONE;
          var whsBinRange = this.event.OPTM_BINRANGE;
          this.deleteUserGroupListRow(optmId, whsCode, whsZone, whsBinRange);
          break;
        case ("DeleteSelected"):
          var ddDeleteArry: any[] = [];
          for (var i = 0; i < this.event.length; i++) {
            ddDeleteArry.push({
              CompanyDBId: localStorage.getItem("CompID"),
              OPTM_ID: event[i].OPTM_ID,
              OPTM_WHSCODE: event[i].OPTM_WHSCODE,
              OPTM_WHSEZONE: event[i].OPTM_WHSEZONE,
              OPTM_BINRANGE: event[i].OPTM_BINRANGE,
            });
          }
          this.deleteMultipleRows(ddDeleteArry);
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
}