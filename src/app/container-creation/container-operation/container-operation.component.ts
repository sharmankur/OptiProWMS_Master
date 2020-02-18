import { Component, OnInit, Input } from '@angular/core';
import { CcmainComponent } from '../ccmain/ccmain.component';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { Router } from '@angular/router';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { CARMasterService } from 'src/app/services/carmaster.service';
import { ToastrService } from 'ngx-toastr';
import { CommonData } from 'src/app/models/CommonData';
import { ɵAnimationRendererFactory } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-container-operation',
  templateUrl: './container-operation.component.html',
  styleUrls: ['./container-operation.component.scss']
})
export class ContainerOperationComponent implements OnInit {

  commonData: any = new CommonData();
  showLookup: boolean = false;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  addItemsOpnArr: any = [];
  addContainerOpnArr: any = [];
  defaultItemOpn: any;
  defaultContOpn: any;
  addItemOpn: any;
  addContOpn: any;
  addContBtnText: string="Add";
  addItemBtnText: string="Add";
  whseCode: string;
  oSaveModel: any;
  containerType: string;
  binCode: string;
  containerId: string;
  containerMaxWgt: string;
  containerWgt: string;
  packingRule: string;
  containerUsage: string;
  itemCode: string;
  childContainerId: string;
  itemQty: any;
  containerCode: string;
  itemBatchSr: any;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router, private carmasterService: CARMasterService,
    private ccmain: CcmainComponent) {
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
    
    var data = localStorage.getItem("ContainerOperationData");
    this.oSaveModel = JSON.parse(data);

    this.whseCode = this.oSaveModel.HeaderTableBindingData[0].OPTM_WHSE;
    this.containerType = this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTTYPE;
    this.binCode = this.oSaveModel.HeaderTableBindingData[0].OPTM_BIN;
    this.containerCode = this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTAINERCODE;
    this.containerId = this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTAINERID;
    this.containerMaxWgt = this.oSaveModel.HeaderTableBindingData[0].OPTM_WEIGHT;
    this.containerWgt = this.oSaveModel.HeaderTableBindingData[0].OPTM_WEIGHT;
    this.packingRule = this.oSaveModel.HeaderTableBindingData[0].OPTM_AUTORULEID;
    this.containerUsage = this.oSaveModel.HeaderTableBindingData[0].Purpose;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.addItemBtnText = this.addItemOpn;
      this.addContBtnText = this.addContOpn;
    }, 200)
  }

  onCancelClick() {
    this.ccmain.ccComponent = 1;
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

  onItemCodeChange(){

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

  getContainerIdList(){

  }

  onContainerIdChange() {
    this.showLoader = true;
    this.containerCreationService.CheckDuplicateContainerIdCreate("").subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
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

  addItemToContainer() {
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

          if(this.addItemOpn == "Add"){
            this.toastr.success('', this.translate.instant("ItemAddedSuccessMsg"));
            this.itemCode = "";
            this.itemQty = 0;
            this.itemBatchSr = "";
          } else if(this.addItemOpn == "Remove"){
            this.toastr.success('', this.translate.instant("ItemRemovedSuccessMsg"));
          } else if(this.addItemOpn == "Query"){

          } else if(this.addItemOpn == "Delete Item"){
            this.toastr.success('', this.translate.instant("ItemDeletedSuccessMsg"));
          } else if(this.addItemOpn == "Delete All Items"){
            this.toastr.success('', this.translate.instant("ItemDeletedSuccessMsg"));
          } else {

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
          if(this.addItemOpn == "Add"){
            this.toastr.success('', this.translate.instant("ContainerAddedSuccessMsg"));
            this.itemCode = "";
            this.itemQty = 0;
            this.itemBatchSr = "";
          } else if(this.addItemOpn == "Remove"){
            this.toastr.success('', this.translate.instant("ContainerAddedSuccessMsg"));
          } else if(this.addItemOpn == "Delete All"){
            this.toastr.success('', this.translate.instant("ContainerDeletedSuccessMsg"));
          } else {

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
  getLookupValue($event) {
    if ($event != null && $event == "close") {
      this.showLookup = false;
      return;
    }
    else if (this.lookupfor == "ItemsListByRuleId") {
      this.ruleID = $event[0];
      this.itemCode = $event[1];
      this.partPerQty =  $event[2];
      this.fillPerQty =  $event[3];
    } else if(this.lookupfor == "ContainerIdList") {
      this.childContainerId = $event[0];
    }
  }

  GetAllContainer() {
    this.showLoader = true;
    this.containerCreationService.GetAllContainer().subscribe(
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
}
