import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  showHideEnable:boolean = false;
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

  getLookupDataValue($event) {
    this.showLookup = false;
    if ($event != null && $event == "close") {
      return;
    }
    else {
      if (this.lookupfor == "CTList") {
        this.containerType = $event.OPTM_CONTAINER_TYPE;
        this.parentContainerType = '';
      }
      else if (this.lookupfor == "ParentCTList") {
        this.parentContainerType = $event.OPTM_PARENT_CONTTYPE;
        this.ParentPerQty = $event.OPTM_CONT_PERPARENT;
      }
      else if (this.lookupfor == "CARList") {
        this.autoRuleId = $event.OPTM_RULEID;
        this.packType = $event.OPTM_CONTUSE;

      } else if (this.lookupfor == "WareHouse") {
        this.whse = $event.WhsCode;
        this.binNo = "";
      } else if (this.lookupfor == "BinList") {
        this.binNo = $event.BinCode;
      } else if (this.lookupfor == "SOList") {
        this.soNumber = $event.DocEntry;
      } else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
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

    this.binNo = ''; this.parentcontainerCode = ''; this.childcontainerCode = '';
    this.RemQty = 0; this.count = 0;
    this.soNumber = ''; this.addItemList = [];
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
        } else {
          this.whse = resp[0].WhsCode
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
    if (this.binNo == undefined || this.binNo == "") {
      return;
    }

    if (this.whse == "" || this.whse == undefined) {
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
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
        }
        else {
          this.binNo = resp[0].BinCode;
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

  getContainerType(type) {
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

          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "CTList";
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

    if (this.containerType == "" || this.containerType == undefined || this.containerType == null) {
      this.toastr.error('', this.translate.instant("EnterContainerType"));
      return;
    }

    if (action == 'blur' && this.parentContainerType == '') {
      return;
    }

    this.showLoader = true;
    this.containerCreationService.GetDataForParentContainerType(this.containerType).subscribe(
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
              let index = this.ParentCTAray.findIndex(r => r.OPTM_PARENT_CONTTYPE == this.parentContainerType);
              if (index == -1) {
                this.parentContainerType = '';
                this.ParentPerQty = 0;
                this.toastr.error('', this.translate.instant("InvalidParentContType"));
                return;
              }
              else {
                this.ParentPerQty = this.ParentCTAray[index].OPTM_CONT_PERPARENT;
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

  onContainerTypeChangeBlur() {
    // this.autoPackRule = '';

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
            this.containerType = ""; this.containerType = "";
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
    this.commonservice.GetDataForContainerAutoRule(this.containerType,this.autoRuleId).subscribe(
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
      if (this.soNumber == undefined || this.soNumber == "") {
        return;
      }
    }

    if (this.whse == "" || this.whse == undefined) {
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
              this.toastr.error('', this.translate.instant("InvalidSOAutoRule"));
            } else {
              this.soNumber = data[0].DocEntry
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

  // public getSOrderList() {
  //   this.showLookup = false;
  //   this.containerCreationService.GetOpenSONumber().subscribe(
  //     resp => {
  //       this.showLookup = false;
  //       if (resp != null && resp != undefined)
  //         if (resp.ErrorMsg == "7001") {
  //           this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
  //           return;
  //         }
  //       this.serviceData = resp;
  //       this.lookupfor = "SOList";
  //       this.showLookup = true;
  //     },
  //     error => {
  //       this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
  //       this.showLookup = false;
  //     }
  //   );
  // }

  // onSONumberChange() {
  //   if (this.soNumber == undefined || this.soNumber == "") {
  //     return;
  //   }
  //   this.showLoader = true;
  //   this.containerCreationService.IsValidSONumber(this.soNumber).subscribe(
  //     (data: any) => {
  //       this.showLoader = false;
  //       if (data != undefined) {
  //         if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
  //           this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
  //             this.translate.instant("CommonSessionExpireMsg"));
  //           return;
  //         }
  //         if (data.length == 0) {
  //           this.soNumber = ''
  //           this.toastr.error('', this.translate.instant("InvalidSO"));
  //         } else {
  //           this.soNumber = data[0].DocEntry
  //         }
  //       } else {
  //         this.soNumber = ''
  //         this.toastr.error('', this.translate.instant("InvalidSO"));
  //       }
  //     },
  //     error => {
  //       this.showLoader = false;
  //       if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
  //         this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
  //       }
  //       else {
  //         this.toastr.error('', error);
  //       }
  //     }
  //   );
  // }

  validateAllFields() {

    if (this.whse == "" || this.whse == undefined) {
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }

    if (this.binNo == "" || this.binNo == undefined) {
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("SelectBinCodeMsg"));
      return;
    }

    if (this.containerType == "" || this.containerType == undefined) {
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("EnterContainerType"));
      return;
    }

    if (this.parentContainerType == "" || this.parentContainerType == undefined) {
      this.parentcontainerCode = '';
      this.childcontainerCode = '';
      this.toastr.error('', this.translate.instant("CTR_ParentContainerType_Blank_Msg"));
      return;
    }
  }

  IsvalidParentCode() {

    let operation = 1;
    if (this.RadioAction == "Add") {
      operation = 1;
    } else {
      operation = 2;
    }

    this.showLoader = true;
    this.containerCreationService.CheckContainer(this.parentcontainerCode, this.whse,
      this.binNo, "",
      this.containerGroupCode,
      this.soNumber, this.parentContainerType,
      this.purps, operation, 3).subscribe(
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
              return;
            }
            else if (data.OPTM_CONT_HDR.length == 0) {
              this.IsParentCodeValid = false;
              if (this.RadioAction == 'Add') {
                this.generateParentContnr();
              } else {
                this.toastr.error('', this.translate.instant("ParentContDoesNotExists"));
                this.parentcontainerCode = '';
                this.RemQty = 0;
                this.childcontainerCode = '';
              }
            }
            else if (data.OPTM_CONT_HDR.length > 0) {
              if (data.OPTM_CONT_HDR[0].OPTM_STATUS == 3) {
                this.toastr.error('', this.translate.instant("ParentContClosed"));
                this.parentcontainerCode = '';
                return;
              }
              this.IsParentCodeValid = true;
            }

            //   if (data.length > 0) {
            //     //Container is already created but there is some error
            //     if (data[0].RESULT != undefined && data[0].RESULT != null) {
            //       this.toastr.error('', data[0].RESULT);
            //       this.parentcontainerCode = '';
            //       return;
            //     }
            //     else {               
            //       if(data[0].OPTM_STATUS == 3){
            //         this.toastr.error('', "Parent Container is Closed");
            //         this.parentcontainerCode = '';
            //         return;
            //       }

            //       this.IsParentCodeValid = true;      //If correct container found
            //  }          
            // } else if (data.length == 0) {
            //   this.IsParentCodeValid = false;
            //   if(this.RadioAction == 'Add'){
            //     this.generateParentContnr();
            //   }else{
            //     this.toastr.error('', this.translate.instant("ParentContDoesNotExists"));
            //     this.parentcontainerCode = '';
            //     this.RemQty = 0;
            //     this.childcontainerCode = '';
            //   }
            // } else {
            //   this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
            // }
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


    // this.showLoader = true;
    // this.containerCreationService.GetAllContainer(this.parentcontainerCode).subscribe(
    //   (data: any) => {
    //     this.showLoader = false;
    //     if (data != undefined) {
    //       if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
    //         this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
    //           this.translate.instant("CommonSessionExpireMsg"));
    //         return;
    //       }
    //       if (data.length == 0) {
    //         this.IsParentCodeValid = false;
    //         if(this.RadioAction == 'Add'){
    //           this.generateParentContnr();
    //         }
    //         else{
    //           this.toastr.error('', this.translate.instant("ParentContDoesNotExists"));
    //           this.parentcontainerCode = '';
    //           this.RemQty = 0;
    //           this.childcontainerCode = '';
    //         }
    //       } else {
    //         this.IsParentCodeValid = true;       
    //       }
    //     } else {
    //       this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
    //     }
    //   },
    //   error => {
    //     this.showLoader = false;
    //     if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
    //       this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
    //     }
    //     else {
    //       this.toastr.error('', error);
    //     }
    //   }
    // );
  }

  onParentContainerCodeChange() {

    this.childcontainerCode = '';

    this.validateAllFields();

    if (this.parentcontainerCode == '' || this.parentcontainerCode == undefined) {
      this.childcontainerCode = '';
      this.count = 0;
      this.RemQty = 0;
      this.addItemList = [];
      return;
    }
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
            this.addItemList = data;
            this.displayTreeDataValue();
          }
          else {
            this.count = 0;
          }

          this.IsvalidParentCode();

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

  generateParentContnr() {

    this.oCreateModel.HeaderTableBindingData = [];
    this.oCreateModel.OtherItemsDTL = [];
    this.oCreateModel.OtherBtchSerDTL = [];

    this.oCreateModel.HeaderTableBindingData.push({
      OPTM_SONO: (this.soNumber == undefined) ? '' : this.soNumber,
      OPTM_CONTAINERID: 0,
      OPTM_CONTTYPE: this.parentContainerType,
      OPTM_CONTAINERCODE: "" + this.parentcontainerCode,
      OPTM_WEIGHT: 0,
      OPTM_AUTOCLOSE_ONFULL: 'N',
      OPTM_AUTORULEID: 0,
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
      OPTM_PERPOSE: this.purps,
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
          if (data.length > 0) {

            if (data[0].ErrMsg != undefined && data[0].ErrMsg != null) {
              this.toastr.error('', data[0].ErrMsg);
              return;
            }

            if (data[0].RESULT != undefined && data[0].RESULT != null) {
              this.toastr.error('', data[0].RESULT);
              return;
            }

            //this.insertChildContnr();
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
    this.containerCreationService.InsertContainerinContainer(this.parentcontainerCode, this.childcontainerCode, this.RadioAction,
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
                  if (this.RadioAction == 'Add') {
                    this.toastr.success('', this.translate.instant("Container_Assigned_To_Parent"));
                  } else {
                    this.toastr.success('', this.translate.instant("Container_Removed_From_Parent"));
                  }
                  this.childcontainerCode = '';
                  //this.onParentContainerCodeChange();
                  this.getCountofParentContAfterSave();
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

    this.validateAllFields();

    if (this.childcontainerCode == "" || this.childcontainerCode == undefined) {
      return;
    }

    if (this.parentcontainerCode == "" || this.parentcontainerCode == undefined) {
      this.toastr.error('', this.translate.instant("Enter_Parent_ContCode"));
      this.childcontainerCode = '';
      return;
    }
    this.insertChildContnr();
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
  addItemOpn: any;
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
}
