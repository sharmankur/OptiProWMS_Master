import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { CommonData } from '../../models/CommonData';
import { ContainerCreationService } from '../../services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContainerShipmentService } from '../../services/container-shipment.service';
import { GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-container-shipment',
  templateUrl: './container-shipment.component.html',
  styleUrls: ['./container-shipment.component.scss']
})
export class ContainerShipmentComponent implements OnInit {

  ContainerCodeId: any = '';
  purposeArray: any = [];
  PurposeId: any = { Value: '' };
  PurposeValue: any = '';
  statusArray: any = [];
  StatusId: any = { Value: '' };
  StatusValue: any = '';
  WarehouseId: any = '';
  BinId: any = '';
  ContainerTypeId: any = '';
  ContainerTypeArray: any = [];
  ShipmentId: any = '';
  ShipmentCode: any = '';
  InvPostStatusArray: any = [];
  InvPostStatusId: any = { Value: '' };
  InvPostStatusValue: any = '';
  status: any = '';
  ContainerList: any = [];
  serviceData: any[];
  lookupfor: string;
  showLookup: boolean = false;
  showLoader: boolean = false;
  SelectedShipmentId: any = '';
  SelectedWhse: any = '';
  SelectedBin: any = '';
  IsShipment: boolean = false;
  shipeligible: string = '';
  ContainsItemID: any = '';
  SelectedRowsforShipmentArr = [];
  ShowGridPaging: boolean = false;
  pageSize: number = Commonservice.pageSize;
  commonData: any = new CommonData(this.translate);
  oSaveModel: any = {};
  WOId: string = "";
  SOId: string = "";
  isColumnFilterView: boolean = false;
  ContainerBuildSourceArray: any = [];
  SelectedLinkTitle: any = '';
  Selectedlink: number = 1;
  containerGroupCode: string = "";
  ContainerOperationArray: any = [];
  ShipmentStatus: any = '';
  //statusArrMulti: any = [];

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService, private containerCreationService: ContainerCreationService, private router: Router,
    private containerShipmentService: ContainerShipmentService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
      this.statusArray = this.commonData.Container_Shipment_Status_DropDown();
      this.InvPostStatusArray = this.commonData.Container_Shipment_Inv_Status_DropDown();
      this.ContainerBuildSourceArray = this.commonData.ContainerBuildSourceEnum();
      this.ContainerOperationArray = this.commonData.Container_Shipment_Operations();

      this.SelectedLinkTitle = this.ContainerOperationArray[0].Name;
    });
  }

  clearFilterFields() {
    this.ContainerCodeId = "";
    this.PurposeId = "";
    this.PurposeValue = "";
    this.StatusValue = "";
    this.WarehouseId = "";
    this.BinId = "";
    this.ContainerTypeId = "";
    this.ShipmentId = "";
    this.ShipmentCode = "";
    this.InvPostStatusId = { Value: '' };
    this.InvPostStatusValue = "";
    this.status = "";
    this.SelectedShipmentId = "";
    this.IsShipment = false;
    this.ContainsItemID = '';
    this.SelectedRowsforShipmentArr = [];
    this.ShowGridPaging = false;
    this.WOId = "";
    this.SOId = "";
  }

  initialize(reset?) {
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.statusArray = this.commonData.Container_Shipment_Status_DropDown();
    this.InvPostStatusArray = this.commonData.Container_Shipment_Inv_Status_DropDown();
    this.ContainerBuildSourceArray = this.commonData.ContainerBuildSourceEnum();
    this.ContainerOperationArray = this.commonData.Container_Shipment_Operations();

    this.SelectedShipmentId = localStorage.getItem("ShipShipmentID");
    this.SelectedWhse = localStorage.getItem("ShipWhse");
    this.SelectedBin = localStorage.getItem("ShipBin");
    this.pageChange({ skip: 0, take: this.pageSize });
    this.isColumnFilterView = false;
    if (this.SelectedShipmentId != undefined && this.SelectedShipmentId != '' && this.SelectedShipmentId != null) {
      this.IsShipment = true;
      if (reset != "Y") {
        this.containerGroupCode = localStorage.getItem("ContGrpCode");
        this.ContainerTypeId = localStorage.getItem("ShpContType");
      }
      this.InvPostStatusId = this.InvPostStatusArray[1];
      this.InvPostStatusValue = this.InvPostStatusId.Value;

      this.StatusId = this.statusArray[2];
      this.status = this.StatusId.Value;
      this.StatusValue = "3";
      this.PurposeId = this.purposeArray[0];
      this.PurposeValue = this.PurposeId.Value;
      this.shipeligible = "Y";
      this.Selectedlink = 2;
    }
    else {
      this.IsShipment = false;
      this.Selectedlink = 1;
    }
    this.fillDataInGridWithShipment(this.Selectedlink);
  }

  ngOnInit() {
    this.initialize();
  }

  onResetClick() {
    this.clearFilterFields();
    this.initialize("Y");
    this.ContainerTypeId = "";
    this.containerGroupCode = "";
  }

  ngOnDestroy() {
    localStorage.setItem("ShipShipmentID", '');
    localStorage.setItem("ContGrpCode", '');
    localStorage.setItem("ShipWhse", '');
    localStorage.setItem("ShipBin", '');
  }

  setContainerOperation() {
    return this.ContainerOperationArray[Number(this.Selectedlink) - 1].Name;
  }

  updateContStatusFilter(value) {
    switch (value) {
      case 3: // Remove from shipment
        this.StatusId = this.statusArray[4];
        this.status = this.StatusId.Value;
        this.StatusValue = "5";
        break;
      case 1: // view container
      case 2: // assign to shipment
        this.StatusId = this.statusArray[2];
        this.status = this.StatusId.Value;
        this.StatusValue = "3";
        break;
      case 4: // return by customer
        this.StatusId = this.statusArray[7];
        this.status = this.StatusId.Value;
        this.StatusValue = "8";
        break;
      case 5: // set Damage
        this.StatusId = { "Value": 0, "Name": "" };
        this.status = "";
        this.StatusValue = "";
        break;
      case 6:  // Close Container
        this.StatusId = this.statusArray[1];
        this.status = this.StatusId.Value;
        this.StatusValue = "2";
        break;
    }
  }

  setContainerGridTitle(value) {
    switch (value) {
      case 3: // Remove from shipment
        this.SelectedLinkTitle = "Select Containers to Remove"
        break;
      case 4: // view container
      case 2: // assign to shipment
        this.SelectedLinkTitle = "Select Containers"
        break;
      case 7: // assign to Sales order
        this.SelectedLinkTitle = "Select Containers to Assign Sales Order"
        break;
      case 8: // assign to Container group code
        this.SelectedLinkTitle = "Select Containers to Assign Container group code"
        break;
      // case 2: // assign to shipment
      // this.SelectedLinkTitle = "Select Containers"
      // break;                        
    }
    this.toastr.success('', this.SelectedLinkTitle);
  }

  SelectShpandDisplayContainers(value) {
    this.ShipmentId = "";
    this.SelectedShipmentId = localStorage.getItem("ShipShipmentID");
    this.Selectedlink = value;
    if (this.SelectedShipmentId != undefined && this.SelectedShipmentId != '' && this.SelectedShipmentId != null) {
      if (value == 2 || value == 3 || value == 4) {
        this.setContainerGridTitle(value);
      }
      this.updateContStatusFilter(value);
      this.fillDataInGridWithShipment(value);
    } else {
      if (value == 2) {
        this.IsShipment = true;
      } else {
        this.IsShipment = false;
      }
      if (value == 2 || value == 3 || value == 4) {
        this.GetShipmentIdForShipment(value);
      } else {
        this.fillDataInGridWithShipment(value);
      }
    }
  }

  fillDataInGridWithShipment(value, val?) {
    this.isColumnFilterView = false;
    this.showLoader = true;
    this.containerShipmentService.FillContainerDataInGrid(this.SelectedShipmentId, this.ContainerCodeId, this.shipeligible, this.StatusValue, this.ContainerTypeId,
      this.ContainsItemID, this.ShipmentId, this.InvPostStatusValue, this.WarehouseId, this.BinId, this.IsShipment, this.WOId, this.SOId, this.Selectedlink, this.containerGroupCode).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            this.ContainerList = data.OPTM_CONT_HDR;
            if (this.ContainerList.length > 10) {
              this.ShowGridPaging = true;
            } else {
              this.ShowGridPaging = false;
            }
            this.updateContainerList();
            this.prepareGridDataForContainerItems(data);
            if (val == "yes") { // for treturn by customer
              this.on_Selectall_checkbox_checked(true)
            } else if (val == "no") {
              this.on_Selectall_checkbox_checked(false)
            }

            this.SelectedRowsforShipmentArr = [];
          } else {
            this.ContainerList = [];
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

  fillDataInGridWithShipment1(value, val?) {
    this.isColumnFilterView = false;
    this.showLoader = true;
    this.containerShipmentService.FillContainerDataInGrid(this.SelectedShipmentId, this.ContainerCodeId, this.shipeligible, this.StatusValue, this.ContainerTypeId,
      this.ContainsItemID, this.ShipmentId, this.InvPostStatusValue, this.WarehouseId, this.BinId, this.IsShipment, this.WOId, this.SOId, value, this.containerGroupCode).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            this.ContainerList = data.OPTM_CONT_HDR;
            if (this.ContainerList.length > 10) {
              this.ShowGridPaging = true;
            } else {
              this.ShowGridPaging = false;
            }
            this.updateContainerList();
            this.prepareGridDataForContainerItems(data);
            if (val == "yes") { // for treturn by customer
              this.on_Selectall_checkbox_checked(true)
            } else if (val == "no") {
              this.on_Selectall_checkbox_checked(false)
            }

            this.SelectedRowsforShipmentArr = [];
          } else {
            this.ContainerList = [];
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

  prepareGridDataForContainerItems(data: any) {
    var OPTM_CONT_DTL = data.OPTM_CONT_DTL
    for (var j = 0; j < this.ContainerList.length; j++) {
      this.ContainerList[j].ContainerItemList = []
      for (var i = 0; i < OPTM_CONT_DTL.length; i++) {
        if (this.ContainerList[j].CODE == OPTM_CONT_DTL[i].OPTM_CONTCODE) {
          this.ContainerList[j].ContainerItemList.push({
            TYPE: "Item",
            CODE: OPTM_CONT_DTL[i].OPTM_ITEMCODE,
            OPTM_QUANTITY: OPTM_CONT_DTL[i].OPTM_QUANTITY,
            OPTM_WEIGHT: OPTM_CONT_DTL[i].OPTM_WEIGHT1 == null ? '0' : OPTM_CONT_DTL[i].OPTM_WEIGHT1,
            OPTM_VOLUME: OPTM_CONT_DTL[i].OPTM_VOLUME == null ? '0' : OPTM_CONT_DTL[i].OPTM_VOLUME,
            OPTM_SHIPMENT_ID: OPTM_CONT_DTL[i].OPTM_SHIPMENTID == null ? '' : OPTM_CONT_DTL[i].OPTM_SHIPMENTID,
            OPTM_PARENTCONTID: OPTM_CONT_DTL[i].OPTM_PARENTCONTID,
            OPTM_PICKED_TOSHIP: OPTM_CONT_DTL[i].OPTM_PICKED_TOSHIP == "Y" ? true : false,
            OPTM_WHSE: OPTM_CONT_DTL[i].OPTM_WHSE,
            OPTM_BIN: OPTM_CONT_DTL[i].OPTM_BIN,
            OPTM_SHIPELIGIBLE: OPTM_CONT_DTL[i].OPTM_SHIPELIGIBLE == "Y" ? true : false,
            OPTM_SO_NUMBER: OPTM_CONT_DTL[i].OPTM_SO_NUMBER == null ? '' : OPTM_CONT_DTL[i].OPTM_SO_NUMBER,
          });
        }
      }
    }
  }

  public ShowContainerItems(dataItem: any): boolean {
    return dataItem.TYPE == "Container";
  }

  updateContainerList() {
    for (let i = 0; i < this.ContainerList.length; i++) {
      this.ContainerList[i].Selected = false;
      this.ContainerList[i].TYPE = "Container";
      this.ContainerList[i].CODE = this.ContainerList[i].OPTM_CONTCODE;
      this.ContainerList[i].OPTM_QUANTITY = 1;
      this.ContainerList[i].OPTM_WEIGHT = this.ContainerList[i].OPTM_WEIGHT == null || '' || undefined ? 0 : Number(this.ContainerList[i].OPTM_WEIGHT).toFixed(Number(localStorage.getItem("DecimalPrecision")));
      this.ContainerList[i].OPTM_STATUS = this.getContainerStatus(this.ContainerList[i].OPTM_STATUS);
      this.ContainerList[i].OPTM_BUILT_SOURCE = this.ContainerList[i].OPTM_BUILT_SOURCE == 0 ? '' : this.setBuiltSource(this.ContainerList[i].OPTM_BUILT_SOURCE);
      this.ContainerList[i].OPTM_SHIPELIGIBLE = (this.ContainerList[i].OPTM_SHIPELIGIBLE) == 'Y' ? 'Yes' : 'No';
    }
  }

  getContainerStatus(id) {
    if (id == undefined || id == "") {
      return //this.translate.instant("CStatusNew");
    }
    id = Number("" + id)

    if (id == 1) {
      return this.translate.instant("CStatusNew");
    } else if (id == 2) {
      return this.translate.instant("Open");
    } else if (id == 3) {
      return this.translate.instant("CClosedNew");
    } else if (id == 4) {
      return this.translate.instant("CReopenedNew");
    } else if (id == 5) {
      return this.translate.instant("CAssignedNew");
    } else if (id == 6) {
      return this.translate.instant("Status_Picked");
    } else if (id == 7) {
      return this.translate.instant("Loaded");
    } else if (id == 8) {
      return this.translate.instant("CShippedNew");
    } else if (id == 9) {
      return this.translate.instant("Returned");
    } else if (id == 10) {
      return this.translate.instant("CDamagedNew");
    } else if (id == 11) {
      return this.translate.instant("CCancelledNew");
    }
  }

  setContainerStatus(status) {
    let value = Number(status) - 1;
    let idx = this.statusArray.findIndex(r => r.Value == value);
    return this.statusArray[idx].Name;
    // return this.statusArray[Number(status) - 1].Name;   
  }

  setBuiltSource(builtsource) {
    return this.ContainerBuildSourceArray[Number(builtsource) - 1].Name;
  }

  onQueryBtnClick() {
    this.fillDataInGridWithShipment(this.Selectedlink);
  }

  getContainerType() {
    this.ContainerTypeArray = [];
    this.containerCreationService.GetContainerType().subscribe(
      (data: any) => {
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
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  onPurposeSelectChange($event) {
    this.PurposeId = $event.Value;
    if (this.PurposeId != undefined && this.PurposeId != null && this.PurposeId != '') {
      if (this.PurposeId == '1')
        this.shipeligible = "Y";
      else if (this.PurposeId == '2')
        this.shipeligible = "N";
    }
  }

  GetShipmentIdForShipment(operation) {
    this.showLoader = true;
    this.commonservice.GetShipmentIdForShipment("", operation).subscribe(
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
          if (operation == undefined) {
            this.lookupfor = "ShipmentListForFilter";
          } else {
            this.lookupfor = "ShipmentList";
            this.ShipmentId = "";
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

  onShipmentIdChange() {
    if (this.ShipmentId == undefined || this.ShipmentId == "") {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidShipmentId(this.ShipmentId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.ShipmentId = data[0].OPTM_SHIPMENTID;
            this.ShipmentCode = data[0].OPTM_SHIPMENT_CODE;
            this.ShipmentStatus = data[0].OPTM_STATUS;
          } else {
            this.ShipmentId = ""; this.ShipmentCode = '';
            this.toastr.error('', this.translate.instant("Invalid_Shipment_Id"));
          }
        } else {
          this.ShipmentId = ""; this.ShipmentCode = '';
          this.toastr.error('', this.translate.instant("Invalid_Shipment_Id"));
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

  GetWhseCode() {
    this.commonservice.GetWhseCode().subscribe(
      (data: any) => {
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
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  GetBinCode() {
    if (this.WarehouseId == undefined || this.WarehouseId == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }
    this.showLoader = true;
    this.commonservice.GetBinCode(this.WarehouseId).subscribe(
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
          }
          else {
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

  getContainsItem() {
    this.showLoader = true;
    this.containerShipmentService.GetContainsItemCode(this.SelectedShipmentId, this.IsShipment).subscribe(
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

          this.lookupfor = "ContainsItem";
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

  onStatusChange($event) {
    this.StatusValue = $event.Value;
  }

  // onStatusChange($event) {    
  //   if($event.length == 1) {
  //     this.StatusValue = $event[0].Value;
  //   } 
  //   else if($event.length == 0){
  //     this.StatusValue = "";
  //   }
  // }

  // open($event){
  //   if(this.StatusValue != "" && this.StatusValue != undefined){
  //     $event.preventDefault();
  //   }    
  // }


  // blurMultiSelect($event){   

  // }

  onInvPostStatusChange($event) {
    this.InvPostStatusValue = $event.Value;
  }

  async onWhseChange() {
    if (this.WarehouseId == undefined || this.WarehouseId == "") {
      return;
    }
    this.showLookup = false;
    var result = false;
    await this.containerCreationService.IsValidWhseCode(this.WarehouseId).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();

            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.WarehouseId = ''
        } else {
          this.WarehouseId = resp[0].WhsCode
        }
        result = true;
      },
      error => {
        result = false;
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
    return result;
  }

  async onBinChange() {
    if (this.BinId == undefined || this.BinId == "") {
      return;
    }

    this.showLookup = false;
    var result = false;
    await this.containerCreationService.IsValidBinCode(this.WarehouseId, this.BinId).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("Invalid Bin Code"));
          this.BinId = ''
        }
        // else {
        //   this.binNo = resp[0].WhsCode
        // }
        result = true;
      },
      error => {
        result = false;
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
    return result;
  }

  async onContainerTypeChange() {

    if (this.ContainerTypeId == undefined || this.ContainerTypeId == "") {
      return;
    }
    this.showLoader = true;
    var result = false;
    await this.commonservice.IsValidContainerType(this.ContainerTypeId).then(
      (data: any) => {
        this.showLoader = false;
        result = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data != null && data.length >= 1) {
            this.ContainerTypeId = data[0].OPTM_CONTAINER_TYPE;
            result = true;
          } else {
            this.ContainerTypeId = "";
            this.toastr.error('', this.translate.instant("InvalidContainerType"));
          }
        } else {
          this.ContainerTypeId = "";

          this.toastr.error('', this.translate.instant("InvalidContainerType"));
        }
      },
      error => {
        this.showLoader = false;
        result = false;
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

  onContainsItemChange() {

    if (this.ContainsItemID == '' || this.ContainsItemID == undefined) {
      return;
    }

    this.showLoader = true;
    this.containerShipmentService.IsValidContainsItemCode(this.ContainsItemID, this.IsShipment, this.SelectedShipmentId).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length == 0) {
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
            this.ContainsItemID = ''
          } else {
            this.ContainsItemID = data[0].OPTM_ITEMCODE
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
            this.containerGroupCode = data[0].OPTM_CONTAINER_GROUP;
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

  selectContainerRowChange(isCheck, dataitem, idx) {
    if (isCheck) {
      for (let i = 0; i < this.ContainerList.length; i++) {
        if (this.ContainerList[i].OPTM_CONTCODE == dataitem.OPTM_CONTCODE) {
          this.ContainerList[i].Selected = true;
        }
      }
      var index = this.SelectedRowsforShipmentArr.findIndex(r => r.OPTM_CONTCODE == dataitem.OPTM_CONTCODE);
      if (index == -1) {
        this.SelectedRowsforShipmentArr.push(dataitem);
      }
    }
    else {
      for (let i = 0; i < this.ContainerList.length; i++) {
        if (this.ContainerList[i].OPTM_CONTCODE == dataitem.OPTM_CONTCODE) {
          this.ContainerList[i].Selected = false;
        }
      }
      var index = this.SelectedRowsforShipmentArr.findIndex(r => r.OPTM_CONTCODE == dataitem.OPTM_CONTCODE);
      if (index > -1)
        this.SelectedRowsforShipmentArr.splice(index, 1);
    }
    for (var i = this.startIndex; i < this.endIndex; i++) {
      if (this.ContainerList[i].Selected == undefined || this.ContainerList[i].Selected == false) {
        this.selectall = false;
        break;
      }
    }
    this.selectedRowCount = this.SelectedRowsforShipmentArr.length;
  }

  public skip = 0;
  startIndex = 0;
  endIndex = 0;
  selectall: boolean;
  pageChange(event: PageChangeEvent) {
    this.skip = event.skip;
    let idx = event.skip / event.take;
    this.startIndex = idx * event.take;
    let pazeCount = parseInt((this.ContainerList.length / event.take).toLocaleString()); 
    let lastPazeSize = this.ContainerList.length % event.take
    if(lastPazeSize > 0){
      pazeCount = pazeCount + 1;
    }
    if(idx == pazeCount - 1){
      if(lastPazeSize == 0){
        this.endIndex = this.startIndex + event.take;
      }else{
        this.endIndex = this.startIndex + lastPazeSize;
      }
    }else{
      this.endIndex = this.startIndex + event.take;
    }
    if (this.ContainerList != undefined && this.ContainerList.length > 0) {
      this.selectall = true;
      for (var i = this.startIndex; i < this.endIndex; i++) {
        if (this.ContainerList[i].Selected == undefined || this.ContainerList[i].Selected == false) {
          this.selectall = false;
          break;
        }
      }
    }
  }

  selectedRowCount: number = 0;
  on_Selectall_checkbox_checked(checkedvalue) {
    var isExist = 0;
    this.selectall = false
    if (checkedvalue == true) {
      if (this.ContainerList.length > 0) {
        this.selectall = true
        // this.SelectedRowsforShipmentArr = [];
        for (let i = this.startIndex; i < this.endIndex; ++i) {
          this.ContainerList[i].Selected = true;
          this.SelectedRowsforShipmentArr.push(this.ContainerList[i]);
        }
      }
    }
    else {
      this.selectall = false
      // this.selectedValues = [];
      if (this.ContainerList.length > 0) {
        for (let i = this.startIndex; i < this.endIndex; ++i) {
          this.ContainerList[i].Selected = false;
          this.SelectedRowsforShipmentArr.splice(this.ContainerList[i])
        }
      }
    }
    this.selectedRowCount = this.SelectedRowsforShipmentArr.length;
  }

  onAssignShipmentPress() {
    this.Selectedlink = 2;
    this.SelectedLinkTitle = this.setContainerOperation();
  }

  onSetDamagedPress() {
    if (this.SelectedRowsforShipmentArr.length == 0) {
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }

    this.showLoader = false;
    let oSaveData: any = {};
    oSaveData.SelectedRows = [];
  
    let tempArray = [];
    for (let i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
      tempArray.push({
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTCODE: this.SelectedRowsforShipmentArr[i].OPTM_CONTCODE,
        CONTAINERID: this.SelectedRowsforShipmentArr[i].OPTM_CONTAINERID
      })
    }

    this.containerShipmentService.SetDamagedContainer(tempArray).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (data[0].RESULT != '' && data[0].RESULT != null) {
              if (data[0].RESULT == 'Data updated') {
                this.toastr.success('', this.translate.instant("SetDamagedMsg"));
                this.fillDataInGridWithShipment(this.Selectedlink);
              }
              else {
                this.toastr.error('', data[0].RESULT);
              }
            }
            else {
              this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
            }
          }
          else {
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

  onCloseContainerPress() {
    if (this.SelectedRowsforShipmentArr.length == 0) {
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }

    this.showLoader = false;
    let oSaveData: any = {};
    oSaveData.SelectedRows = [];
    // oSaveData.OtherData = [];

    // if (this.IsShipment) {
    //   oSaveData.OtherData.push({
    //     CompanyDBId: localStorage.getItem("CompID"),
    //    // ContnrShipmentId: this.SelectedShipmentId,
    //     OPTM_CREATEDBY: localStorage.getItem("UserId"),
    //    // OPTM_GROUP_CODE: this.containerGroupCode
    //   })
    // }
    // else {
    //   oSaveData.OtherData.push({
    //     CompanyDBId: localStorage.getItem("CompID"),
    //    // ContnrShipmentId: this.ShipmentId,
    //     OPTM_CREATEDBY: localStorage.getItem("UserId"),
    //   // OPTM_GROUP_CODE: this.containerGroupCode
    //   })
    // }

    // for (let i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
    //   oSaveData.SelectedRows.push({
    //     Container_Id: JSON.stringify(this.SelectedRowsforShipmentArr[i])
    //   })
    // }

    for (let i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
      oSaveData.SelectedRows.push({
        //OPTM_CONTCODE: JSON.stringify(this.SelectedRowsforShipmentArr[i]), 
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTCODE: this.SelectedRowsforShipmentArr[i].OPTM_CONTCODE,
        CONTAINERID: this.SelectedRowsforShipmentArr[i].OPTM_CONTAINERID
      })
    }

    let tempArray = [];
    for (let i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
      tempArray.push({
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTCODE: this.SelectedRowsforShipmentArr[i].OPTM_CONTCODE,
        CONTAINERID: this.SelectedRowsforShipmentArr[i].OPTM_CONTAINERID
      })
    }

    this.containerShipmentService.CloseContainer(tempArray).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (data[0].RESULT != '' && data[0].RESULT != null) {
              if (data[0].RESULT == 'Data Saved') {
                this.toastr.success('', this.translate.instant("ContainerClosedMsg"))
                this.fillDataInGridWithShipment(this.Selectedlink);
              }
              else {
                this.toastr.error('', data[0].RESULT);
              }
            }
            else {
              this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
            }
          }
          else {
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

  onShipmentBtnPress(action) {
    if (this.SelectedRowsforShipmentArr.length == 0) {
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }
    this.showLoader = true;
    let oSaveData: any = {};
    oSaveData.SelectedRows = [];
    oSaveData.OtherData = [];

    if (action == 'Assign') {
      if (this.SelectedShipmentId == "" || this.SelectedShipmentId == undefined || this.SelectedShipmentId == null) {
        this.showLoader = false;
        this.toastr.error('', this.translate.instant("Select_Shipment_Msg"))
        return;
      }
      oSaveData.OtherData.push({
        CompanyDBId: localStorage.getItem("CompID"),
        ContnrShipmentId: this.SelectedShipmentId,
        OPTM_CREATEDBY: localStorage.getItem("UserId"),
        OPTM_GROUP_CODE: this.containerGroupCode
      })
      // if (this.IsShipment) {
      //   oSaveData.OtherData.push({
      //     CompanyDBId: localStorage.getItem("CompID"),
      //     ContnrShipmentId: this.SelectedShipmentId,
      //     OPTM_CREATEDBY: localStorage.getItem("UserId"),
      //     OPTM_GROUP_CODE: this.containerGroupCode
      //   })
      // }
      // else {
      //   oSaveData.OtherData.push({
      //     CompanyDBId: localStorage.getItem("CompID"),
      //     ContnrShipmentId: this.SelectedShipmentId,
      //     OPTM_CREATEDBY: localStorage.getItem("UserId"),
      //     OPTM_GROUP_CODE: this.containerGroupCode
      //   })
      // }

      for (let i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
        oSaveData.SelectedRows.push({
          Container_Id: JSON.stringify(this.SelectedRowsforShipmentArr[i].OPTM_CONTCODE)
        })
      }
      this.containerShipmentService.AssignContainerToShipment(oSaveData).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            if (data.length > 0) {
              if (data[0].RESULT != '' && data[0].RESULT != null) {
                if (data[0].RESULT == 'Shipment updated') {
                  this.toastr.success('', data[0].RESULT);
                  this.fillDataInGridWithShipment(this.Selectedlink);
                }
                else {
                  this.toastr.error('', data[0].RESULT);
                }
              }
              else {
                this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
              }
            }
            else {
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
    else {
      let tempArray = [];
      for (let i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
        tempArray.push({
          CompanyDBId: localStorage.getItem("CompID"),
          OPTM_SHIPMENTCODE: this.SelectedRowsforShipmentArr[i].OPTM_SHIPMENTID,//this.IsShipment ? this.SelectedShipmentId : this.ShipmentCode,
          OPTM_CONTCODE: this.SelectedRowsforShipmentArr[i].OPTM_CONTCODE,
          OPTM_STATUS: this.ShipmentStatus
        })
      }

      this.containerShipmentService.RemoveContainerFromShipment(tempArray).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            if (data.length > 0) {
              if (data[0].RESULT != '' && data[0].RESULT != null) {
                if (data[0].RESULT == 'Data Saved') {
                  this.toastr.success('', this.translate.instant("Containers_removed_successfully"));
                  this.fillDataInGridWithShipment(this.Selectedlink);
                }
                else {
                  this.toastr.error('', data[0].RESULT);
                }
              }
              else {
                this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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
  }

  onUpdateBtnPress() {
    switch (this.Selectedlink) {
      case (2):
        this.onShipmentBtnPress('Assign');
        break;
      case (3):
        this.onShipmentBtnPress('Remove');
        break;
      case (4):
        this.ContainerReturned();
        break;
      case (5):
        this.onSetDamagedPress();
        break;
      case (6):
        this.onCloseContainerPress();
        break;
      case (7):
        this.updateSalesOrder();
        break;
      case (8):
        this.updateContainerGroupCode();
        break;
      case (9):
        this.dialogValue = "";
        this.SODocEntry = "";
        this.UpdateContainerSoNo();
        break;
      case (10):
        this.dialogValue = "";
        this.UpdateContainerGroupCode();
        break;
    }
  }

  getLookupDataValue($event) {
    if ($event != null && $event == "close") {
      return;
    }
    else {
      if (this.lookupfor == "WareHouse") {
        this.WarehouseId = $event.WhsCode;
      }
      else if (this.lookupfor == "BinList") {
        this.BinId = $event.BinCode;
      }
      else if (this.lookupfor == "CTList") {
        this.ContainerTypeId = $event.OPTM_CONTAINER_TYPE;
      }
      else if (this.lookupfor == "ContainsItem") {
        this.ContainsItemID = $event.OPTM_ITEMCODE;
      }
      else if (this.lookupfor == "ShipmentListForFilter") {
        this.ShipmentId = $event.OPTM_SHIPMENTID;
        this.ShipmentCode = $event.OPTM_SHIPMENT_CODE;
        this.ShipmentStatus = $event.OPTM_STATUS;
      }
      else if (this.lookupfor == "ShipmentList") {
        this.SelectedShipmentId = $event.OPTM_SHIPMENTID;
        this.setContainerGridTitle(this.Selectedlink);
        this.ShipmentStatus = $event.OPTM_STATUS;
        if (this.Selectedlink != 4) {
          this.fillDataInGridWithShipment(this.Selectedlink);
        } else {
          this.showDialog("ReturnByCustomer", this.translate.instant("yes"), this.translate.instant("no"),
            this.translate.instant("ReturnShpMsg"));
        }
      }
      else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
      }
      else if (this.lookupfor == "GroupCode") {
        this.dialogValue = $event.OPTM_CONTAINER_GROUP;
      }
      else if (this.lookupfor == "SerialNoFrom") {
        this.dialogValue = $event.SODocNum;
        this.SODocEntry = $event.SODocEntry;
      }
    }
  }

  dialogFor: any;
  yesButtonText: any;
  noButtonText: any;
  dialogMsg: any;
  showConfirmDialog = false;

  showDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.dialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.showConfirmDialog = true;
    this.dialogMsg = msg;
  }

  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("ReturnByCustomer"):
          this.fillDataInGridWithShipment(this.Selectedlink, "yes")
          break;
      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
          case ("ReturnByCustomer"):
            this.fillDataInGridWithShipment(this.Selectedlink, "no")
            break;
        }
      }
    }
  }

  onArrowBtnClick() {
    this.router.navigate(['home/shipment']);
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  onFilterChange(checkBox: any, grid: GridComponent) {
    if (checkBox.checked == false) {
      this.clearFilter(grid);
    }
  }

  clearFilter(grid: GridComponent) {
    //grid.filter.filters=[];    
    //this.clearFilters();
  }

  ContainerReturned() {
    if (this.SelectedRowsforShipmentArr.length == 0) {
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }

    this.showLoader = false;
    // for (let i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
    //   oSaveData.SelectedRows.push({
    //     //OPTM_CONTCODE: JSON.stringify(this.SelectedRowsforShipmentArr[i]), 
    //     CompanyDBId: localStorage.getItem("CompID"),
    //     OPTM_CONTCODE: this.SelectedRowsforShipmentArr[i].OPTM_CONTCODE,
    //     CONTAINERID: this.SelectedRowsforShipmentArr[i].OPTM_CONTAINERID
    //   })
    // }

    let tempArray = [];
    for (let i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
      tempArray.push({
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_SHIPMENTID: this.SelectedRowsforShipmentArr[i].OPTM_SHIPMENTID,
        OPTM_CONTCODE: this.SelectedRowsforShipmentArr[i].OPTM_CONTCODE,
        OPTM_USERID: localStorage.getItem("UserId"),
        OPTM_CONTAINERID: this.SelectedRowsforShipmentArr[i].OPTM_CONTAINERID
      })
    }

    this.showLoader = true;
    this.containerShipmentService.ContainerReturned(tempArray).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length > 0) {
            if (data[0].RESULT != '' && data[0].RESULT != null) {
              if (data[0].RESULT == 'Data updated') {
                this.toastr.success('', data[0].RESULT);
                this.fillDataInGridWithShipment(this.Selectedlink);
              }
              else {
                this.toastr.error('', data[0].RESULT);
              }
            }
            else {
              this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
            }
          }
          else {
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

  ///------------------------------Assign and remove SO and Container group------------------------
  dialogOpened = false;
  DialogTitle = "";
  dialogLabel = "";
  dialogValue = "";

  ShowSOandContainerCodeDialog(option) {
    this.dialogOpened = true;
    if (option == 1) {
      this.Selectedlink = 7;
      this.DialogTitle = this.translate.instant("AssignSO")
      this.dialogLabel = this.translate.instant("SalesOrder")
    } else {
      this.Selectedlink = 8;
      this.DialogTitle = this.translate.instant("AssignCC")
      this.dialogLabel = this.translate.instant("ContainerGroupingCode")
    }
    this.StatusId = { "Value": 0, "Name": "" };
    this.status = "";
    this.StatusValue = "";
    this.fillDataInGridWithShipment1(1);
  }

  close_kendo_dialog() {
    this.dialogOpened = false;
  }

  RemoveFromContainer(action) {
    // if (this.SelectedRowsforShipmentArr.length == 0) {
    //   this.toastr.error('', this.translate.instant("Select_row"));
    //   return;
    // }
    this.dialogValue = "";
    if (action == 1) {
      this.Selectedlink = 9;
      this.SODocEntry = "";
      this.UpdateContainerSoNo();
    } else {
      this.Selectedlink = 10;
      this.UpdateContainerGroupCode();
    }
  }

  DisplayAndValidateData(action) {
    if (this.DialogTitle == this.translate.instant("AssignSO")) {
      this.GetDataForSalesOredr(action);
    } else {
      if (action == 'blur') {
        this.oncontainerGroupChange();
      } else {
        this.GetContainerGroupLookupData(this.translate);
      }
    }
  }

  GetContainerGroupLookupData(translate: TranslateService): any {
    this.showLoader = true;
    this.commonservice.GetDataForContainerGroup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "GroupCode";
        } else {
          this.toastr.error('', translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  async oncontainerGroupChange() {
    if (this.dialogValue == undefined || this.dialogValue == "") {
      return;
    }

    this.showLoader = true;
    var result = false
    await this.commonservice.IsValidContainerGroupScan(this.dialogValue).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.dialogValue = data[0].OPTM_CONTAINER_GROUP;
            result = true;
          } else {
            this.dialogValue = '';
            this.toastr.error('', this.translate.instant("InvalidGroupCode"));
            result = false
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          result = false
        }
      },
      error => {
        result = false
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result
  }

  SODocEntry: any;
  GetDataForSalesOredr(event) {
    let soNum;
    soNum = this.dialogValue
    if ((soNum == "" || soNum == null || soNum == undefined) && (event == 'blur')) {
      return;
    }
    if (event != 'blur') {
      soNum = ""
    }
    let uc;
    uc = "";
    this.showLoader = true;
    this.showLookup = true;
    this.commonservice.GetDataForSalesOrderLookup(uc, soNum).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (event == 'blur') {
            if (data.length > 0) {
              this.dialogValue = data[0].SODocNum;
              this.SODocEntry = data[0].SODocEntry;
            } else {
              this.dialogValue = "";
              this.SODocEntry = "";
              this.toastr.error('', this.translate.instant("InvalidSONo"));
            }
          } else {
            this.serviceData = data;
            this.lookupfor = "SerialNoFrom";
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

  onConfirmClick(action) {
    this.setContainerGridTitle(this.Selectedlink);
    this.close_kendo_dialog();
  }

  updateSalesOrder() {
    if (this.SelectedRowsforShipmentArr.length == 0) {
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }

    if (this.dialogValue == undefined || this.dialogValue == "") {
      this.toastr.error('', this.translate.instant("FieldValidation"));
      return;
    }
    this.UpdateContainerSoNo();
  }

  updateContainerGroupCode() {
    if (this.SelectedRowsforShipmentArr.length == 0) {
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }

    if (this.dialogValue == undefined || this.dialogValue == "") {
      this.toastr.error('', this.translate.instant("FieldValidation"));
      return;
    }
    this.UpdateContainerGroupCode();
  }

  UpdateContainerGroupCode() {
    if (this.SelectedRowsforShipmentArr.length == 0) {
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }
    var ContUpdategroupCodeArray = []
    for (var i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
      ContUpdategroupCodeArray.push({
        CompanyDBId: localStorage.getItem("CompID"),
        GROUPCODE: this.dialogValue,
        OPTM_CONTCODE: this.SelectedRowsforShipmentArr[i].OPTM_CONTCODE
      });
    }
    this.commonservice.UpdateContainerGroupCode(ContUpdategroupCodeArray).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.dialogValue = "";
          if (data.OUTPUT[0].RESULT == "Data Saved") {
            this.toastr.success('', this.translate.instant("ContUpdatedMsg"));
            //this.Selectedlink = 1;
            this.fillDataInGridWithShipment(1);
          } else {
            this.toastr.error('', data.OUTPUT[0].RESULT);
          }
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

  UpdateContainerSoNo() {
    if (this.SelectedRowsforShipmentArr.length == 0) {
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }
    var ContUpdategroupCodeArray = [];
    for (var i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {
      ContUpdategroupCodeArray.push({
        CompanyDBId: localStorage.getItem("CompID"),
        SONO: this.SODocEntry,
        OPTM_CONTCODE: this.SelectedRowsforShipmentArr[i].OPTM_CONTCODE
      });
    }
    this.commonservice.UpdateContainerSoNo(ContUpdategroupCodeArray).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.dialogValue = "";
          this.SODocEntry = "";
          if (data.OUTPUT[0].RESULT == "Data Saved") {
            this.toastr.success('', this.translate.instant("ContUpdatedMsg"));
           // this.Selectedlink = 1;
            this.fillDataInGridWithShipment(1);
          } else {
            this.toastr.error('', data.OUTPUT[0].RESULT);
          }
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
