import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContainerCreationService } from '../../services/container-creation.service';
import { Commonservice } from '../../services/commonservice.service';
import { CommonData } from 'src/app/models/CommonData';
import { CARMasterService } from 'src/app/services/carmaster.service';

@Component({
  selector: 'app-build-parent-container',
  templateUrl: './build-parent-container.component.html',
  styleUrls: ['./build-parent-container.component.scss']
})
export class BuildParentContainerComponent implements OnInit {

  purposeArray: any = [];
  commonData: any = new CommonData(this.translate);
  defaultPurpose: any;
  purpose: any = '';
  addItemList: any = [];
  autoRuleId: any;
  containerType: any;
  packType: any;
  showLoader: boolean = false;
  showLookup: boolean = false
  serviceData: any = [];
  lookupfor: any;
  whse: any;
  binNo: any;
  containerGroupCode: any = '';
  parentContainerType: any = '';
  ParentCTAray: any = [];
  ParentPerQty: any = 0;
  soNumber: any = '';
  soDocEntry: any = '';
  RadioAction: string = "Add";
  count: number = 0;
  parentcontainerCode: any = '';
  public opened: boolean = true;
  childcontainerCode: any = '';
  oCreateModel: any = {};
  IsParentCodeValid: boolean = false;
  purposeId: any = '';
  NoOfPacksToGenerate: any = 1;
  RemQty: number = 0;
  purps: any = "Y";
  nextEnabled = true;
  BuildParentContainerTxt: any;
  showHideEnable: boolean = false;
  addItemOpn: any = "Add";
  autoClose: boolean = false;
  IsDisableScanChild: boolean = true;
  enableCloseCont: boolean = false;
  ConSelectionType: number = 1;
  @ViewChild("scanWhse", { static: false }) scanWhse;
  @ViewChild("scanBinNo", { static: false }) scanBinNo;
  @ViewChild("scanContType", { static: false }) scanContType;
  @ViewChild("scanPCType", { static: false }) scanPCType;
  @ViewChild("scanContGrCode", { static: false }) scanContGrCode;
  @ViewChild("scanSONo", { static: false }) scanSONo;
  @ViewChild("scanPContCode", { static: false }) scanPContCode;
  @ViewChild("scanContCode", { static: false }) scanContCode;

  showHideDetails() {
    this.showHideEnable = !this.showHideEnable
  }
  onNext() {
    this.nextEnabled = false;
    this.BuildParentContainerTxt = this.translate.instant("AddContainer")
  }
  onBack() {
    this.nextEnabled = true;
    this.BuildParentContainerTxt = this.translate.instant("BuildParentContainer")
  }
  treeViewShow = false;
  onOpenTreeview() {
    this.treeViewShow = !this.treeViewShow
  }

  constructor(private commonservice: Commonservice, private translate: TranslateService, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private carmasterService: CARMasterService, private router: Router) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
      this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    });
  }

  ngOnInit() {
    this.BuildParentContainerTxt = this.translate.instant("BuildParentContainer")
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.defaultPurpose = this.purposeArray[0];
    this.purpose = this.defaultPurpose.Name;
    this.purposeId = this.defaultPurpose.Value;
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  onPurposeSelectChange(event) {
    this.purpose = event.Name;
    this.purposeId = event.Value;

    if (this.purpose == "Shipping") {
      this.purps = "Y"
    } else {
      this.purps = "N"
    }
  }

  dialogFor: any;
  yesButtonText: any;
  noButtonText: any;
  dialogMsg: any;
  showDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.dialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.showConfirmDialog = true;
    this.dialogMsg = msg;
  }

  showConfirmDialog: boolean = false;
  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("ReopenConfirm"):
          this.ReOpenCont();
          break;
        case ("CloseConfirm"):
          this.onCloseContYesClick();
          break;
      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
          case ("ReopenConfirm"):
            break;
          case ("CloseConfirm"):
            break;
        }
      }
    }
  }

  getLookupDataValue($event) {
    this.showLookup = false;
    if ($event != null && $event == "close") {
      return;
    }
    else {
      if (this.lookupfor == "CTList") {
        this.containerType = $event.OPTM_CONTAINER_TYPE;
        this.parentContainerType = '';
        this.setDefaultValues();
      }
      else if (this.lookupfor == "ParentCTList") {
        this.parentContainerType = $event.OPTM_PARENT_CONTTYPE;
        this.ParentPerQty = $event.OPTM_CONT_PERPARENT;
        this.setDefaultValues();
      }
      else if (this.lookupfor == "CARList") {
        this.autoRuleId = $event.OPTM_RULEID;
        this.packType = $event.OPTM_CONTUSE;

      } else if (this.lookupfor == "WareHouse") {
        this.whse = $event.WhsCode;
        this.binNo = "";
        this.setDefaultValues();
      } else if (this.lookupfor == "BinList") {
        this.binNo = $event.BinCode;
        this.setDefaultValues();
      } else if (this.lookupfor == "SOList") {
        this.soNumber = $event.DocNum;
        this.soDocEntry = $event.DocEntry;
        this.setDefaultValues();
      } else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
        this.setDefaultValues();
      }
    }
  }

  GetWhseCode() {
    this.showLoader = true;
    this.commonservice.GetWhseCode().subscribe(
      (data: any) => {
        this.showLoader = false;
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

  onWhseChangeBlur() {

    this.binNo = '';
    this.soNumber = '';
    this.soDocEntry = '';
    this.setDefaultValues();
    if (this.whse == undefined || this.whse == "") {
      return;
    }

    this.showLookup = false;
    this.containerCreationService.IsValidWhseCode(this.whse).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();

            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.whse = ''
          this.scanWhse.nativeElement.focus()
        } else {
          this.whse = resp[0].WhsCode
          this.scanBinNo.nativeElement.focus()
        }
      },
      error => {
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
  }

  GetBinCode() {
    if (this.whse == undefined || this.whse == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }

    this.showLoader = true;
    this.commonservice.GetBinCode(this.whse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.showLookup = true;
            this.serviceData = data;
            this.lookupfor = "BinList";
          } else {
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  onBinChangeBlur() {
    this.setDefaultValues();
    if (this.binNo == undefined || this.binNo == "") {
      return;
    }

    if (this.whse == "" || this.whse == undefined) {
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      this.binNo = '';
      return;
    }

    this.showLookup = false;
    this.containerCreationService.IsValidBinCode(this.whse, this.binNo).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("INVALIDBIN"));
          this.binNo = ''
          this.scanBinNo.nativeElement.focus()
        }
        else {
          this.binNo = resp[0].BinCode;
          this.scanContType.nativeElement.focus()
        }
      },
      error => {
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
  }

  GetDataForContainerGroup() {
    this.showLoader = true;
    this.commonservice.GetDataForContainerGroup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "GroupCodeList";
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

  IsValidContainerGroupBlur() {
    this.setDefaultValues();
    if (this.containerGroupCode == undefined || this.containerGroupCode == "") {
      return
    }

    this.showLoader = true;
    this.commonservice.IsValidContainerGroup(this.containerGroupCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.containerGroupCode = data[0].OPTM_CONTAINER_GROUP
          } else {
            this.containerGroupCode = '';
            this.toastr.error('', this.translate.instant("InvalidGroupCode"));
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

  IsValidContainerGroup() {
    if (this.containerGroupCode == undefined || this.containerGroupCode == "") {
      return
    }

    this.showLoader = true;
    this.commonservice.IsValidContainerGroup(this.containerGroupCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.containerGroupCode = data[0].OPTM_CONTAINER_GROUP
          } else {
            this.containerGroupCode = '';
            this.toastr.error('', this.translate.instant("InvalidGroupCode"));
            this.scanContGrCode.nativeElement.focus()
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          this.scanSONo.nativeElement.focus()
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

  getContainerType(type) {

    if (this.binNo == undefined || this.binNo == "") {
      this.containerType = '';
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return;
    }

    this.showLoader = true;
    this.containerCreationService.GetContainerType().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          this.lookupfor = "CTList";
          this.showLookup = true;
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

  getParentContainerType(action) {

    var type = ''
    if (this.ConSelectionType == 1) {
      if (this.containerType == "" || this.containerType == undefined || this.containerType == null) {
        this.toastr.error('', this.translate.instant("EnterContainerType"));
        return;
      } else {
        type = this.containerType
      }
    } else {
      type = this.parentContainerType
    }       

    if (action == 'blur' && type == '') {
      return;
    }
    this.showLoader = true;
    this.containerCreationService.GetDataForParentContainerType(type).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (action == 'lookup') {
            this.serviceData = data;
            this.showLookup = true;
            this.lookupfor = "ParentCTList";
          } else {
            this.ParentCTAray = data;

            if (this.ParentCTAray.length > 0) {
              var index = 0
              if (this.ConSelectionType == 1) {
                index = this.ParentCTAray.findIndex(r => r.OPTM_PARENT_CONTTYPE == this.parentContainerType);
              } else {
                index = this.ParentCTAray.findIndex(r => r.OPTM_CONTAINER_TYPE == this.parentContainerType);
              }
              if (index == -1) {
                this.parentContainerType = '';
                this.ParentPerQty = 0;
                this.toastr.error('', this.translate.instant("InvalidParentContType"));
                this.scanPCType.nativeElement.focus()
                return;
              }
              else {
                this.ParentPerQty = this.ParentCTAray[index].OPTM_CONT_PERPARENT;
                // this.scanContGrCode.nativeElement.focus()

                if (this.ConSelectionType == 2 && this.parentcontainerCode != undefined && this.parentcontainerCode != '') {
                  this.getContainersAddedInParent();
                }
              }
            }
            else {
              this.parentContainerType = '';
              this.toastr.error('', this.translate.instant("InvalidParentContType"));
              return;
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

  setDefaultValues() {
    this.parentcontainerCode = '';
    this.childcontainerCode = '';
    this.count = 0; this.RemQty = 0;
    this.IsDisableScanChild = true;
    this.addItemList = [];
    this.enableCloseCont = false;
  }

  onContainerTypeChangeBlur() {

    this.parentContainerType = '';
    this.setDefaultValues();

    if (this.containerType == undefined || this.containerType == "") {
      return;
    }

    if (this.binNo == undefined || this.binNo == "") {
      this.containerType = '';
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return;
    }

    this.showLoader = true;
    this.commonservice.IsValidContainerType(this.containerType).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data != null && data.length >= 1) {
            this.containerType = data[0].OPTM_CONTAINER_TYPE;
          } else {
            this.containerType = "";
            this.toastr.error('', this.translate.instant("InvalidContainerType"));
          }
        } else {
          this.containerType = "";
          this.toastr.error('', this.translate.instant("InvalidContainerType"));
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

  getAutoPackRule() {
    if (this.containerType == undefined || this.containerType == "") {
      this.toastr.error('', this.translate.instant("SelectContainerMsg"));
      return;
    }

    this.showLoader = true;
    this.commonservice.GetDataForContainerAutoRule(this.containerType, this.autoRuleId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data.OPTM_CONT_AUTORULEHDR;
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

  onAutoPackRuleChangeBlur() {

    this.IsValidContainerAutoRule(this.autoRuleId, this.containerType, this.packType);
  }

  async IsValidContainerAutoRule(ruleId, ContType, packType) {
    if (packType == this.translate.instant("Shipping")) {
      packType = '1';
    } else if (packType == this.translate.instant("Internal")) {
      packType = '2';
    } else {
      packType = '3';
    }
    this.showLoader = true;
    var result = false;
    await this.carmasterService.IsValidContainerAutoRule(ruleId, ContType, packType).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          result = true;
          localStorage.setItem("CAR_Grid_Data", JSON.stringify(data));

        } else {
          // this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        result = false;
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result;
  }

  IsValidSONumberBasedOnRule(action) {

    if (action == 'blur') {
      this.setDefaultValues();
      if (this.soNumber == undefined || this.soNumber == "") {
        return;
      }
    }

    if (this.whse == "" || this.whse == undefined) {
      this.soNumber = '';
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }

    this.containerCreationService.IsValidSONumberBasedOnRule(this.soNumber, "", this.whse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (action == 'blur') {
            if (data.length == 0) {
              this.soNumber = '';
              this.soDocEntry = '';
              this.toastr.error('', this.translate.instant("InvalidSOAutoRule"));
              this.scanSONo.nativeElement.focus()
            } else {
              this.soNumber = data[0].DocNum
              this.soDocEntry = data[0].DocEntry;
            }
          } else {
            if (data.length == 0) {
              this.toastr.error('', this.translate.instant("NoDataFound"));
              return;
            }
            this.serviceData = data;
            for (let sidx = 0; sidx < this.serviceData.length; sidx++) {
              if (this.serviceData[sidx].CardName == null || this.serviceData[sidx].CardName == undefined) {
                this.serviceData[sidx].CardName = '';
              }
            }
            this.lookupfor = "SOList";
            this.showLookup = true;
          }
        } else {
          this.soNumber = '';
          this.soDocEntry = '';
          this.toastr.error('', this.translate.instant("NoDataFound"));
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

  validateAllFields() {

    if (this.whse == "" || this.whse == undefined) {
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return false;
    }

    if (this.binNo == "" || this.binNo == undefined) {
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return false;
    }

    if (this.containerType == "" || this.containerType == undefined) {
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("EnterContainerType"));
      return false;
    }

    if (this.parentContainerType == "" || this.parentContainerType == undefined) {
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("CTR_ParentContainerType_Blank_Msg"));
      return false;
    }
  }

  ReOpenCont() {

    this.commonservice.ReopenClick(this.parentcontainerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length > 0) {
            if (data[0].RESULT == "Data Saved" || data[0].RESULT == "Data saved.") {
              this.toastr.success('', this.translate.instant("ContainerReopenedMsg"));
              this.IsDisableScanChild = false;
              this.DisplayTreeData = [];
              this.getContainersAddedInParent();
            } else {
              this.toastr.error('', data[0].RESULT);
              this.setDefaultValues();
            }
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          this.setDefaultValues();
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

  CONT_SELECT_TYPE: any = '';
  IsvalidParentCode() {

    let operation = 1;
    if (this.addItemOpn == "Add") {
      operation = 1;
    } else {
      operation = 2;
    }

    this.showLoader = true;
    this.containerCreationService.CheckContainer(this.parentcontainerCode, this.whse,
      this.binNo, "",
      this.containerGroupCode,
      this.soNumber, this.parentContainerType,
      this.purps, operation, 3, this.CONT_SELECT_TYPE, true).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            if (data.OUTPUT[0].RESULT != undefined && data.OUTPUT[0].RESULT != null && data.OUTPUT[0].RESULT != '') {
              this.toastr.error('', data.OUTPUT[0].RESULT);
              this.parentcontainerCode = '';
              this.enableCloseCont = false;
              this.addItemList = [];
              this.displayTreeDataValue(); this.count = 0; this.RemQty = 0;
              this.IsDisableScanChild = true;
              return;
            }
            else if (data.OPTM_CONT_HDR.length == 0) {
              if (this.ConSelectionType == 2) {
                this.toastr.error('', this.translate.instant("CreateConMsg"));
                return;
              }

              this.IsParentCodeValid = false;
              this.enableCloseCont = false;
              if (this.addItemOpn == 'Add') {
                this.generateParentContnr();
              } else {
                this.toastr.error('', this.translate.instant("ParentContDoesNotExists"));
                this.addItemList = [];
                this.displayTreeDataValue(); this.count = 0;
                this.parentcontainerCode = '';
                this.RemQty = 0;
                this.childcontainerCode = '';
                this.IsDisableScanChild = true;
              }
            }
            else if (data.OPTM_CONT_HDR.length > 0) {
              if (data.OPTM_CONT_HDR[0].OPTM_STATUS == 3) {
                this.toastr.error('', this.translate.instant("ParentContClosed"));
                this.IsDisableScanChild = true;

                if (this.radioSelected == 2) {
                  this.showDialog("ReopenConfirm", this.translate.instant("yes"), this.translate.instant("no"),
                    this.translate.instant("ReopenAlert"));
                } else {
                  this.parentcontainerCode = '';
                  this.radioSelected = 3; this.treeViewShow = true;
                  this.enableCloseCont = false;
                  this.addItemList = [];
                  this.displayTreeDataValue();
                  return;
                }

              }
              this.IsParentCodeValid = true;
              this.IsDisableScanChild = false;
              this.DisplayTreeData = [];

              if (this.ConSelectionType == 2) {
                this.setOtherReqFields(data.OPTM_CONT_HDR[0]);
                this.getParentContainerType('blur')
              } else {
                this.getContainersAddedInParent();
              }
            }
            //this.IsDisableScanChild=false;        
          }
          else {
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

  getContainersAddedInParent() {
    this.addItemList = [];
    this.showLoader = true;
    this.containerCreationService.GetConatinersAddedInParentContainer(this.parentcontainerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined && data != null) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          //this.count= data[0].Count;
          if (data.length != undefined) {
            this.count = data.length;
            this.RemQty = this.ParentPerQty - this.count;
            if (this.RemQty < 0) {
              this.RemQty = 0
            }
            this.addItemList = data;
            this.displayTreeDataValue();
          }
          else {
            this.count = 0;
          }

          if (this.count > 0) {
            this.enableCloseCont = true;
          } else {
            this.enableCloseCont = false;
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

  onParentContainerCodeChange() {
    if (this.ConSelectionType == 2) {
      this.CONT_SELECT_TYPE = 'Fetch'
      // this.setDefaultValues();
    } else {
      this.CONT_SELECT_TYPE = ''
      if (this.validateAllFields() == false) {
        return;
      }
    }

    if (this.parentcontainerCode == '' || this.parentcontainerCode == undefined) {
      this.setDefaultValues();
      return;
    }

    this.IsvalidParentCode();
  }

  getCountofParentContAfterSave() {
    this.addItemList = [];
    this.showLoader = true;
    this.containerCreationService.GetConatinersAddedInParentContainer(this.parentcontainerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined && data != null) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          //this.count= data[0].Count;
          if (data.length != undefined) {
            this.count = data.length;
            this.RemQty = this.ParentPerQty - this.count;
            if (this.RemQty == 0) {
              this.parentcontainerCode = '';
              this.count = 0;
              this.addItemList = [];
            }
            else {
              this.addItemList = data;
              this.displayTreeDataValue();
            }
          }
          else {
            this.count = 0;
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

  onCheckChange(event) {
    this.autoClose = !this.autoClose;
  }

  generateParentContnr() {

    this.oCreateModel.HeaderTableBindingData = [];
    this.oCreateModel.OtherItemsDTL = [];
    this.oCreateModel.OtherBtchSerDTL = [];

    this.oCreateModel.HeaderTableBindingData.push({
      //OPTM_SONO: (this.soNumber == undefined) ? '' : this.soNumber,
      OPTM_SONO: this.soDocEntry,
      OPTM_CONTAINERID: 0,
      OPTM_CONTTYPE: this.parentContainerType,
      OPTM_CONTAINERCODE: "" + this.parentcontainerCode,
      OPTM_WEIGHT: 0,
      OPTM_AUTOCLOSE_ONFULL: ((this.autoClose == true) ? 'Y' : 'N'),
      OPTM_AUTORULEID: '',
      OPTM_WHSE: this.whse,
      OPTM_BIN: this.binNo,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      OPTM_MODIFIEDBY: '',
      Length: 0,
      Width: 0,
      Height: 0,
      ItemCode: "",
      NoOfPacks: "1",
      OPTM_TASKID: 0, //change
      CompanyDBId: localStorage.getItem("CompID"),
      Username: localStorage.getItem("UserId"),
      UserId: localStorage.getItem("UserId"),
      GUID: localStorage.getItem("GUID"),
      Action: "Y",
      OPTM_PARENTCODE: '',
      OPTM_GROUP_CODE: this.containerGroupCode,
      OPTM_CREATEMODE: 3,
      //OPTM_PERPOSE: this.purposeId,
      OPTM_PURPOSE: this.purps,
      OPTM_FUNCTION: "Shipping",
      OPTM_OBJECT: "Container",
      OPTM_WONUMBER: 0,
      OPTM_TASKHDID: 0,
      OPTM_OPERATION: 0,
      OPTM_QUANTITY: 0,
      OPTM_SOURCE: 3,
      OPTM_ParentContainerType: this.parentContainerType,
      OPTM_ParentPerQty: this.ParentPerQty,
      IsWIPCont: false,
      OPTM_WONO: "",
      OPTM_OPERNO: ""
    });

    this.showLoader = true;
    this.containerCreationService.GenerateShipContainer(this.oCreateModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.OUTPUT != undefined) {
            if (data.OUTPUT[0].RESULT != null && data.OUTPUT[0].RESULT != undefined && data.OUTPUT[0].RESULT != '') {
              this.toastr.error('', data.OUTPUT[0].RESULT);
              this.IsDisableScanChild = false;
              this.setDefaultValues();
              return;
            }

            if (data.OUTPUT[0].ErrMsg != undefined && data.OUTPUT[0].ErrMsg != null) {
              this.toastr.error('', this.translate.instant("GreaterOpenQtyCheck"));
              this.IsDisableScanChild = false;
              this.setDefaultValues();
              return;
            }
          }

          if (data.OPTM_CONT_HDR != undefined && data.OPTM_CONT_HDR.length > 0) {
            this.IsDisableScanChild = false;
            this.DisplayTreeData = [];
            this.getContainersAddedInParent();
            this.toastr.success('', this.translate.instant("ParentContainerCreatedSuccessMsg"));
          }
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

  insertChildContnr() {
    this.showLoader = true;
    this.containerCreationService.InsertContainerinContainer(this.parentcontainerCode, this.childcontainerCode, this.addItemOpn,
      this.containerType, this.parentContainerType).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            if (data.length > 0) {
              if (data[0].RESULT != undefined && data[0].RESULT != null) {

                //if (data[0].RESULT == "Data Saved") {
                if (data[0].RESULT.indexOf("Data Saved") > -1) {
                  if (this.addItemOpn == 'Add') {
                    this.toastr.success('', this.translate.instant("Container_Assigned_To_Parent"));
                  } else {
                    this.toastr.success('', this.translate.instant("Container_Removed_From_Parent"));
                  }
                  this.childcontainerCode = '';
                  //this.onParentContainerCodeChange();
                  //this.getCountofParentContAfterSave();
                  this.DisplayTreeData = [];
                  this.getContainersAddedInParent();
                }
                else {
                  this.toastr.error('', data[0].RESULT);
                }
              }
              else {
                this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
              }
            } else {
              this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  onChildContCodeChange() {

    if (this.validateAllFields() == false) {
      return;
    }

    if (this.childcontainerCode == "" || this.childcontainerCode == undefined) {
      return;
    }

    if (this.parentcontainerCode == "" || this.parentcontainerCode == undefined) {
      this.toastr.error('', this.translate.instant("Enter_Parent_ContCode"));
      this.setDefaultValues();
      return;
    }
    this.insertChildContnr();
  }

  onCloseContClick() {
    if (this.count >= 1 && this.RemQty >= 1) {
      this.showDialog("CloseConfirm", this.translate.instant("yes"), this.translate.instant("no"),
        this.translate.instant("CloseContValMsg"));
      return
    }

    this.showLoader = true;
    this.commonservice.CloseParentContainer(this.parentcontainerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length > 0) {
            if (data[0].RESULT == "Full") {
              this.onCloseContYesClick();
            } else {
              this.showDialog("CloseConfirm", this.translate.instant("yes"), this.translate.instant("no"),
                this.translate.instant("CloseAlert"));
            }
          } else {
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  onCloseContYesClick() {
    if (this.parentcontainerCode == undefined || this.parentcontainerCode == "") {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      return;
    }
    this.showLoader = true;
    this.commonservice.CloseClick(this.parentcontainerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length > 0) {
            if (data[0].RESULT == "Data Saved") {
              this.toastr.success('', this.translate.instant("ContainerClosedMsg"));
              this.radioSelected = 3;
              this.treeViewShow = true;
              this.enableCloseCont = false;
              this.IsDisableScanChild = true;

            } else {
              this.toastr.error('', data[0].RESULT);
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

  DisplayTreeData: any = []
  displayTreeDataValue() {
    var DisplayTreeChildData = [];
    for (let treeidx = 0; treeidx < this.addItemList.length; treeidx++) {
      DisplayTreeChildData.push({
        text: this.addItemList[treeidx].OPTM_CONTCODE,
        quantity: 0,
        // items: childArr
      })
    }

    this.DisplayTreeData.push({
      text: this.parentcontainerCode,
      quantity: DisplayTreeChildData.length,
      items: DisplayTreeChildData
    })
  }

  radioSelected: any = 1;
  checkChangeEvent: any;

  handleCheckChange(event, action) {
    this.treeViewShow = false;
    if (action == 'add') {
      this.radioSelected = 1;
      this.addItemOpn = "Add"
    } else if (action == 'remove') {
      this.radioSelected = 2;
      this.addItemOpn = "Remove";
    } else {
      this.radioSelected = 3;
      this.addItemOpn = "View"
      this.treeViewShow = true;
      this.childcontainerCode = '';
    }
    this.checkChangeEvent = event;
  }

  isExpanded: boolean = false;
  isExpand: boolean = false;
  expandedKeys: any[] = [];
  onExpandCollapseAll(event) {
    console.log("onExpandCollapseAll: " + event)
    this.expandedKeys = [];
    this.isExpand = !this.isExpand
    if (event == 'expand') {
      for (let i = 0; i < this.addItemList.length; i++) {
        this.expandedKeys.push("" + i)
      }
    }
  }

  setOtherReqFields(OPTM_CONT_HDR) {
    this.whse = OPTM_CONT_HDR.OPTM_WHSE;
    this.binNo = OPTM_CONT_HDR.OPTM_BIN;
    this.parentContainerType = OPTM_CONT_HDR.OPTM_CONTTYPE;
    this.autoRuleId = OPTM_CONT_HDR.OPTM_AUTORULEID;
    // this.getAutoPackRule('blur');
    this.soNumber = OPTM_CONT_HDR.DocNum;
    this.soDocEntry = OPTM_CONT_HDR.OPTM_SO_NUMBER;
    this.containerGroupCode = OPTM_CONT_HDR.OPTM_GROUP_CODE;
    this.parentcontainerCode = OPTM_CONT_HDR.OPTM_CONTCODE;
    // this.parentContainerId = OPTM_CONT_HDR.OPTM_CONTAINERID;
    // this.workOrder = OPTM_CONT_HDR.OPTM_WO_NUMBER;
    // this.taskId = OPTM_CONT_HDR.OPTM_TASKHDID;
    // this.operationNo = OPTM_CONT_HDR.OPTM_OPER_NUMBER;
    // if(OPTM_CONT_HDR.OPTM_CREATE_MODE == 1){
    //   this.radioRuleSelected = 1;
    // }else{
    //   this.radioRuleSelected = 2;
    // }
  }

  handleContainerRadioChange(event) {
    if (this.ConSelectionType == 1) {
      this.ConSelectionType = 2;
    } else {
      this.ConSelectionType = 1;
    }
    this.checkChangeEvent = event;
    this.setDefaultValues()
    this.whse = '';
    this.binNo = '';
    this.parentContainerType = '';
    this.autoRuleId = '';
    this.soNumber = '';
    this.soDocEntry = '';
    this.containerGroupCode = '';
    this.parentcontainerCode = '';
    this.DisplayTreeData = [];
  }

  onRadioMouseDown(event) {

  }
}
