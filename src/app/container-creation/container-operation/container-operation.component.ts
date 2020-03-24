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
  containerQty: number = 0
  containerMaxWgt: number = 0;
  containerWgt: number = 0;
  packingRule: string;
  containerUsage: string;
  itemCode: string;
  childContainerId: string;
  childContainerCode: string;
  itemQty: any = 0;
  containerCode: string = "";
  itemBatchSr: any;
  from: any;
  disableCCodeField: boolean = false;
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
      this.disableCCodeField = true
      this.containerId = localStorage.getItem("ContainerId")
      this.containerCode = localStorage.getItem("ContainerCode")
      this.onContainerCodeChange("parent")
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
    this.containerCreationService.IsValidItemCode(this.packingRule, this.itemCode,this.whseCode, this.binCode).subscribe(
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
    } else if (this.containerCode == this.childContainerCode) {
      this.toastr.error('', this.translate.instant("SameContainerValidMsg"));
      this.childContainerId = '';
      this.childContainerCode = ''
      return;
    }

    this.showLoader = true;
    this.containerCreationService.InsertContainerinContainer(this.containerId, this.childContainerId, this.addContOpn, '', '').subscribe(
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
  containerStatusEnum: any;
  containerStatus: any;
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
        this.containerStatusEnum = $event.OPTM_STATUS
        if ($event.OPTM_WEIGHT == undefined || $event.OPTM_WEIGHT == "") {
          this.containerWgt = 0.0;
        }
        else {
          this.containerWgt = $event.OPTM_WEIGHT;
        }
        this.containerStatus = this.getContainerStatus(this.containerStatusEnum)
      } else {
        this.childContainerId = $event.OPTM_CONTAINERID;
        this.childContainerCode =  $event.OPTM_CONTCODE;
      }
    }
  }

  containerIdType: any = "parent"
  GetParentContainer() {
    this.showLoader = true;
    this.containerIdType = "parent"
    this.containerCreationService.GetAllContainer("").subscribe(
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

  GetAllContainer(code) {
    this.showLoader = true;
    this.containerIdType = "child"
    this.containerCreationService.GetAllContainer(code).subscribe(
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

  onContainerCodeChange(from) {
    var code;
    if (from == 'parent') {
      code = this.containerCode;
    } else {
      code = this.childContainerCode;
    }
    if (code == undefined || code == "") {
      return
    }
    this.showLoader = true;
    this.containerCreationService.GetAllContainer(code).subscribe(
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
              this.containerCode = '';
              this.resetFields()
            } else {
              this.childContainerId = '';
              this.childContainerCode = '';
            }
            
            this.toastr.error('', this.translate.instant("InvalidContainerCode"));
          } else {
            this.itemCode = data[0].ITEMCODE
            if (from == 'parent') {
              this.containerId = data[0].OPTM_CONTAINERID;
              this.containerCode = data[0].OPTM_CONTCODE;
              this.childContainerCode = ''
              this.containerType = data[0].OPTM_CONTTYPE;
              this.containerUsage = (data[0].OPTM_SHIPELIGIBLE == "Y") ? this.translate.instant("Shipping") : this.translate.instant("Internal")
              this.packingRule = data[0].OPTM_AUTORULEID;
              this.whseCode = data[0].OPTM_WHSE;
              this.binCode = data[0].OPTM_BIN;
              this.containerStatusEnum = data[0].OPTM_STATUS
              if (data[0].OPTM_WEIGHT == undefined || data[0].OPTM_WEIGHT == "") {
                this.containerWgt = 0.0;
              }
              else {
                this.containerWgt = data[0].OPTM_WEIGHT;
              }
              this.containerStatus = this.getContainerStatus(this.containerStatusEnum)
            } else {
              this.childContainerId = data[0].OPTM_CONTAINERID;
              this.childContainerCode =  data[0].OPTM_CONTCODE;
            }
          }
        } else {
          if (from == 'parent') {
            this.containerId = '';
            this.resetFields()
          } else {
            this.childContainerId = '';
          }
          
          this.toastr.error('', this.translate.instant("InvalidContainerCode"));
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

  resetFields(){
    this.containerId = '';
    this.containerCode = '';
    this.childContainerCode = ''
    this.containerType = '';
    this.containerUsage = ''
    this.packingRule = '';
    this.whseCode = '';
    this.binCode = '';
    this.containerWgt = 0.0;
    this.itemCode = ''
    this.itemBatchSr = ''
    this.itemQty = 0.0;
    this.containerMaxWgt = 0.0
    this.containerQty = 0.0
  }

  getContainerStatus(id) {
    if (id == undefined || id == "") {
      return //this.translate.instant("CStatusNew");
    }
    id = Number("" + id)

    if (id == 1) {
      return this.translate.instant("CStatusNew");
    } else if (id == 2) {
      return this.translate.instant("CScheduledNew");
    } else if (id == 3) {
      return this.translate.instant("CClosedNew");
    } else if (id == 4) {
      return this.translate.instant("CReopenedNew");
    } else if (id == 5) {
      return this.translate.instant("CAssignedNew");
    } else if (id == 6) {
      return this.translate.instant("CShippedNew");
    } else if (id == 7) {
      return this.translate.instant("CPickedNew");
    } else if (id == 8) {
      return this.translate.instant("CReturnNew");
    } else if (id == 9) {
      return this.translate.instant("CDamagedNew");
    } else if (id == 10) {
      return this.translate.instant("CCancelledNew");
    }
  }
}
