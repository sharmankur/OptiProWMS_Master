import { Component, OnInit, Input } from '@angular/core';
import { CcmainComponent } from '../ccmain/ccmain.component';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '@angular/router';
import { ContainerCreationService } from '../../services/container-creation.service';
import { CARMasterService } from '../../services/carmaster.service';
import { ToastrService } from 'ngx-toastr';
import { CommonData } from '../../models/CommonData';
import { ɵAnimationRendererFactory } from '@angular/platform-browser/animations';
import { ContMaintnceComponent } from 'src/app/container-maintenance/cont-maintnce/cont-maintnce.component';

@Component({
  selector: 'app-container-operation',
  templateUrl: './container-operation.component.html',
  styleUrls: ['./container-operation.component.scss']
})
export class ContainerOperationComponent implements OnInit {

  commonData: any = new CommonData(this.translate);
  showLookup: boolean = false;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  addItemsOpnArr: any = [];
  addContainerOpnArr: any = [];
  defaultItemOpn: any;
  defaultContOpn: any;
  addItemOpn: any = "Add";
  addContOpn: any = "Add";
  addContBtnText: string = "Add";
  addItemBtnText: string = "Add";
  whseCode: string;
  oSaveModel: any;
  containerType: string;
  binCode: string;
  @Input() containerId: string;
  containerMaxWgt: number = 0;
  containerWgt: number = 0;
  packingRule: string;
  containerUsage: string;
  itemCode: string;
  childContainerId: string;
  itemQty: any = 0;
  containerCode: string;
  itemBatchSr: any;
  from: any;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router, private carmasterService: CARMasterService,
    private ccmain: CcmainComponent, private contMaintenance: ContMaintnceComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    this.addItemsOpnArr = this.commonData.Container_Operation_Add_Items();
    this.addContainerOpnArr = this.commonData.Container_Operation_Add_Container();
    this.defaultItemOpn = this.addItemsOpnArr[0];
    this.defaultContOpn = this.addContainerOpnArr[0];

    this.addItemOpn = this.defaultItemOpn.Name;
    this.addContOpn = this.defaultContOpn.Name;

    this.from = localStorage.getItem("From")

    // var data = localStorage.getItem("ContainerOperationData");
    // this.oSaveModel = JSON.parse(data);

    if (this.from == "CMaintenance") {
      this.containerId = localStorage.getItem("ContainerId")
      this.onContainerIdChange("parent")
    } else {
      this.GetParentContainer();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.addItemBtnText = this.addItemOpn;
      this.addContBtnText = this.addContOpn;
    }, 200)
  }

  onCancelClick() {
    if (this.from == "CMaintenance") {
      this.contMaintenance.cmComponent = 1;
    } else {
      this.ccmain.ccComponent = 1;
    }
  }

  onAddContOpnSelectChange($event) {
    this.addContBtnText = $event.Name;
    this.addContOpn = $event.Name;
  }

  onAddItemOpnSelectChange($event) {
    this.addItemBtnText = $event.Name;
    this.addItemOpn = $event.Name;
  }

  onBatchSrlChange($event) {

  }

  onItemCodeChange() {
    if ((this.itemCode == undefined || this.itemCode == "")) {
      return;
    }
    this.showLoader = true;
    this.containerCreationService.IsValidItemCode(this.packingRule, this.itemCode).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length == 0) {
            this.itemCode = ''
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
          } else {
            this.itemCode = data[0].OPTM_ITEMCODE
          }
        } else {
          this.itemCode = ''
          this.toastr.error('', this.translate.instant("InvalidItemCode"));
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

  getItemCode() {
    this.showLoader = true;
    this.containerCreationService.GetSelectesdRuleItem(this.packingRule).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "ItemsListByRuleId";
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

  getContainerIdList() {

  }

  addItemToContainer() {
    if (this.itemCode == undefined || this.itemCode == '') {
      this.toastr.error('', this.translate.instant("SelectItemCode"));
      return;
    }
    if (this.addItemOpn == "Add" && this.itemQty == 0) {
      this.toastr.error('', this.translate.instant("ItemQtyCannotZero"));
      return;
    }

    this.showLoader = true;
    this.containerCreationService.InsertItemInContainer(this.containerId, this.containerType,
      this.itemCode, this.packingRule, this.partPerQty, this.fillPerQty, true,
      this.addItemOpn, this.itemQty).subscribe(
        data => {
          this.showLoader = false;
          if (data != undefined && data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            if (data[0].RESULT == "Data Saved") {
              if (this.addItemOpn == "Add") {
                this.toastr.success('', this.translate.instant("ItemAddedSuccessMsg"));
                this.itemCode = "";
                this.itemQty = 0;
                this.itemBatchSr = "";
              } else if (this.addItemOpn == "Remove") {
                this.toastr.success('', this.translate.instant("ItemRemovedSuccessMsg"));
              } else if (this.addItemOpn == "Query") {
                this.itemQty = data[0].RESULT
              } else if (this.addItemOpn == "Delete Item") {
                this.toastr.success('', this.translate.instant("ItemDeletedSuccessMsg"));
              } else if (this.addItemOpn == "Delete All Items") {
                this.toastr.success('', this.translate.instant("ItemDeletedSuccessMsg"));
              }
            } else if (data[0].RESULT.length < 10) {
              this.itemQty = data[0].RESULT;
            } else {
              this.toastr.error('', this.translate.instant(data[0].RESULT));
            }
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

  addContainerToContainer() {
    if (this.childContainerId == undefined || this.childContainerId == '') {
      this.toastr.error('', this.translate.instant("ChildContainerCannotBlank"));
      return;
    }

    this.showLoader = true;
    this.containerCreationService.InsertContainerinContainer(this.containerId, this.childContainerId, this.addContOpn).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == "Data Saved") {
            if (this.addContOpn == "Add") {
              this.toastr.success('', this.translate.instant("ContainerAddedSuccessMsg"));
              this.itemCode = "";
              this.itemQty = 0;
              this.itemBatchSr = "";
            } else if (this.addContOpn == "Remove") {
              this.toastr.success('', this.translate.instant("ContainerAddedSuccessMsg"));
            } else if (this.addContOpn == "Delete All") {
              this.toastr.success('', this.translate.instant("ContainerDeletedSuccessMsg"));
            }
          } else {
            this.toastr.error('', this.translate.instant(data[0].RESULT));
          }
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

  ruleID: any;
  partPerQty: any;
  fillPerQty: any;
  getLookupData($event) {
    if ($event != null && $event == "close") {
      this.showLookup = false;
      return;
    }
    else if (this.lookupfor == "ItemsListByRuleId") {
      this.ruleID = $event.OPTM_RULEID;
      this.itemCode = $event.OPTM_ITEMCODE;
      this.partPerQty = $event.OPTM_PARTS_PERCONT;
      this.fillPerQty = $event.OPTM_MIN_FILLPRCNT;
    } else if (this.lookupfor == "ContainerIdList") {
      if (this.containerIdType == "parent") {
        this.containerId = $event.OPTM_CONTAINERID;
        this.containerCode = $event.OPTM_CONTCODE;
        this.containerType = $event.OPTM_CONTTYPE;
        this.containerUsage = ($event.OPTM_SHIPELIGIBLE == "Y") ? this.translate.instant("Shipping") : this.translate.instant("Internal")
        this.packingRule = $event.OPTM_AUTORULEID;
        this.whseCode = $event.OPTM_WHSE;
        this.binCode = $event.OPTM_BIN;
        if ($event.OPTM_WEIGHT == undefined || $event.OPTM_WEIGHT == "") {
          this.containerWgt = 0.0;
        }
        else {
          this.containerWgt = $event.OPTM_WEIGHT;
        }

      } else {
        this.childContainerId = $event.OPTM_CONTAINERID;
      }
    }
  }

  containerIdType: any = "parent"
  GetParentContainer() {
    this.showLoader = true;
    this.containerIdType = "parent"
    this.containerCreationService.GetAllContainer().subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.containerIdType = "parent"
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "ContainerIdList";
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

  GetAllContainer() {
    this.showLoader = true;
    this.containerIdType = "child"
    this.containerCreationService.GetAllContainer().subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.containerIdType = "child"
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "ContainerIdList";
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

  onContainerIdChange(from) {
    var id;
    if (from == 'parent') {
      id = this.containerId;
    } else {
      id = this.childContainerId;
    }
    if (id == undefined || id == "") {
      return
    }
    this.showLoader = true;
    this.containerCreationService.IsValidContainerId(id).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length == 0) {
            if (from == 'parent') {
              this.containerId = '';
            } else {
              this.childContainerId = '';
            }
            this.toastr.error('', this.translate.instant("InvalidContainerId"));
          } else {
            this.itemCode = data[0].ITEMCODE
            if (from == 'parent') {
              this.containerId = data[0].OPTM_CONTAINERID;
              this.containerId = data[0].OPTM_CONTAINERID;
              this.containerCode = data[0].OPTM_CONTCODE;
              this.containerType = data[0].OPTM_CONTTYPE;
              this.containerUsage = (data[0].OPTM_SHIPELIGIBLE == "Y") ? this.translate.instant("Shipping") : this.translate.instant("Internal")
              this.packingRule = data[0].OPTM_AUTORULEID;
              this.whseCode = data[0].OPTM_WHSE;
              this.binCode = data[0].OPTM_BIN;
              if (data[0].OPTM_WEIGHT == undefined || data[0].OPTM_WEIGHT == "") {
                this.containerWgt = 0.0;
              }
              else {
                this.containerWgt = data[0].OPTM_WEIGHT;
              }
            } else {
              this.childContainerId = data[0].OPTM_CONTAINERID;
            }
          }
        } else {
          if (from == 'parent') {
            this.containerId = '';
          } else {
            this.childContainerId = '';
          }
          this.toastr.error('', this.translate.instant("InvalidContainerId"));
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
