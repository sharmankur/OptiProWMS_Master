import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { CommonData } from '../../models/CommonData';
import { ContainerCreationService } from '../../services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContainerShipmentService } from '../../services/container-shipment.service';
import { GridComponent } from '@progress/kendo-angular-grid';

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
  ContainerItems: any = [];
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
      this.Selectedlink = 1;
      this.SelectedLinkTitle = this.ContainerOperationArray[0].Name;
    });
  }

  ngOnInit() {
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.statusArray = this.commonData.Container_Shipment_Status_DropDown();
    this.InvPostStatusArray = this.commonData.Container_Shipment_Inv_Status_DropDown();
    this.ContainerBuildSourceArray = this.commonData.ContainerBuildSourceEnum();
    this.ContainerOperationArray = this.commonData.Container_Shipment_Operations();

    // this.statusArrMulti = [];
    // for(let i=0; i<this.statusArray.length; i++){
    //   this.statusArrMulti.push(this.statusArray[i].Name);
    // }   

    this.SelectedShipmentId = localStorage.getItem("ShipShipmentID");
    this.SelectedWhse = localStorage.getItem("ShipWhse");
    this.SelectedBin = localStorage.getItem("ShipBin");
    
    this.isColumnFilterView = false;

    if (this.SelectedShipmentId != undefined && this.SelectedShipmentId != '' && this.SelectedShipmentId != null) {
      this.IsShipment = true;
      this.containerGroupCode = localStorage.getItem("ContGrpCode");
      this.InvPostStatusId = this.InvPostStatusArray[1];
      this.InvPostStatusValue = this.InvPostStatusId.Value;

      this.StatusId = this.statusArray[2];
      this.status = this.StatusId.Value;
      this.StatusValue = "3";
      this.PurposeId = this.purposeArray[0];
      this.PurposeValue = this.PurposeId.Value;
      this.shipeligible = "Y";
    }
    else {
      // this.InvPostStatusId = this.InvPostStatusArray[0];
      // this.InvPostStatusValue = this.InvPostStatusId.Value;

      this.IsShipment = false;
    }
    this.fillDataInGridWithShipment(1);
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
      case 3:
        this.StatusId = this.statusArray[4];
        this.status = this.StatusId.Value;
        this.StatusValue = "5";
        break;
      case 1:
      case 2:
        this.StatusId = this.statusArray[2];
        this.status = this.StatusId.Value;
        this.StatusValue = "3";
        break;
      case 4:
        this.StatusId = this.statusArray[4];
        this.status = this.StatusId.Value;
        this.StatusValue = "4";
        break;
      case 5:
        this.StatusId = { "Value": 0, "Name": "" };
        this.status = "";
        this.StatusValue = "";
        break;
      case 6:
        this.StatusId = this.statusArray[1];
        this.status = this.StatusId.Value;
        this.StatusValue = "2";
        break;
    }
  }

  fillDataInGridWithShipment(value) {

    if (this.SelectedShipmentId != undefined && this.SelectedShipmentId != '' && this.SelectedShipmentId != null) {
      this.updateContStatusFilter(value);
    }

    this.Selectedlink = value;
    this.SelectedLinkTitle = this.setContainerOperation();

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
            this.ContainerItems = data;

            if (this.ContainerItems.length > 10) {
              this.ShowGridPaging = true;
            } else {
              this.ShowGridPaging = false;
            }

            for (let i = 0; i < this.ContainerItems.length; i++) {
              this.ContainerItems[i].Selected = false;
              this.ContainerItems[i].OPTM_QUANTITY = this.ContainerItems[i].OPTM_QUANTITY == null || '' || undefined ? 0 : Number(this.ContainerItems[i].OPTM_QUANTITY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
              this.ContainerItems[i].OPTM_WEIGHT = this.ContainerItems[i].OPTM_WEIGHT == null || '' || undefined ? 0 : Number(this.ContainerItems[i].OPTM_WEIGHT).toFixed(Number(localStorage.getItem("DecimalPrecision")));
              this.ContainerItems[i].OPTM_STATUS = this.getContainerStatus(this.ContainerItems[i].OPTM_STATUS);
              this.ContainerItems[i].OPTM_BUILT_SOURCE = this.ContainerItems[i].OPTM_BUILT_SOURCE == 0 ? '' : this.setBuiltSource(this.ContainerItems[i].OPTM_BUILT_SOURCE);
              this.ContainerItems[i].OPTM_SHIPELIGIBLE = (this.ContainerItems[i].OPTM_SHIPELIGIBLE) == 'Y' ? 'Yes' : 'No';
            }
          } else {
            this.ContainerItems = [];
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

  GetShipmentIdForShipment() {
    this.showLoader = true;
    this.commonservice.GetShipmentIdForShipment("").subscribe(
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
          this.lookupfor = "ShipmentList";
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
      for (let i = 0; i < this.ContainerItems.length; i++) {
        if (this.ContainerItems[i].OPTM_CONTCODE == dataitem.OPTM_CONTCODE) {
          this.ContainerItems[i].Selected = true;
        }
      }
      var index = this.SelectedRowsforShipmentArr.findIndex(r => r.OPTM_CONTCODE == dataitem.OPTM_CONTCODE);
      if (index == -1) {
        this.SelectedRowsforShipmentArr.push(dataitem);
        // this.SelectedRowsforShipmentArr.push({
        //   OPTM_CONTCODE: dataitem.OPTM_CONTCODE,
        //   OPTM_CONTAINERID: dataitem.OPTM_CONTAINERID,
        //   OPTM_STATUS: dataitem.OPTM_STATUS
        // });
      }
    }
    else {
      for (let i = 0; i < this.ContainerItems.length; i++) {
        if (this.ContainerItems[i].OPTM_CONTCODE == dataitem.OPTM_CONTCODE) {
          this.ContainerItems[i].Selected = false;
        }
      }
      var index = this.SelectedRowsforShipmentArr.findIndex(r => r.OPTM_CONTCODE == dataitem.OPTM_CONTCODE);
      if (index > -1)
        this.SelectedRowsforShipmentArr.splice(index, 1);
    }
  }

  selectall: boolean;
  on_Selectall_checkbox_checked(checkedvalue) {
    var isExist = 0;
    // this.CheckedData = []
    this.selectall = false
    if (checkedvalue == true) {
      if (this.ContainerItems.length > 0) {
        this.selectall = true
        this.SelectedRowsforShipmentArr = [];
        for (let i = 0; i < this.ContainerItems.length; ++i) {
          this.ContainerItems[i].Selected = true;
          this.SelectedRowsforShipmentArr.push(this.ContainerItems[i]);
          // this.SelectedRowsforShipmentArr.push({
          //   OPTM_CONTCODE: this.ContainerItems[i].OPTM_CONTCODE,
          //   OPTM_CONTAINERID: this.ContainerItems[i].OPTM_CONTAINERID,
          //   OPTM_STATUS: this.ContainerItems[i].OPTM_STATUS
          // });
        }
      }
    }
    else {
      this.selectall = false
      // this.selectedValues = [];
      if (this.ContainerItems.length > 0) {
        for (let i = 0; i < this.ContainerItems.length; ++i) {
          this.ContainerItems[i].Selected = false;
          this.SelectedRowsforShipmentArr = [];
        }
      }
    }
  }

  onAssignShipmentPress() {
    this.Selectedlink = 2;
    this.SelectedLinkTitle = this.setContainerOperation();
    // this.SelectedLinkTitle = this.translate.instant("Assign_to_shipment");    
  }

  onSetDamagedPress() {
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
    //     //OPTM_CONTCODE: JSON.stringify(this.SelectedRowsforShipmentArr[i]), 
    //     CompanyDBId: localStorage.getItem("CompID"),
    //     OPTM_CONTCODE: this.SelectedRowsforShipmentArr[i], 
    //     CONTAINERID: ''
    //   })
    // }

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
    // if (!this.IsShipment && action == 'Assign') {
    //   if (this.ShipmentId == "" || this.ShipmentId == undefined || this.ShipmentId == null) {
    //     this.toastr.error('', this.translate.instant("Enter_shipmentid"));
    //     return;
    //   }
    // }

    if (this.SelectedRowsforShipmentArr.length == 0) {
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }
    this.showLoader = true;
    let oSaveData: any = {};
    oSaveData.SelectedRows = [];
    oSaveData.OtherData = [];

    if (action == 'Assign') {
      if (this.IsShipment) {
        oSaveData.OtherData.push({
          CompanyDBId: localStorage.getItem("CompID"),
          ContnrShipmentId: this.SelectedShipmentId,
          OPTM_CREATEDBY: localStorage.getItem("UserId"),
          OPTM_GROUP_CODE: this.containerGroupCode
        })
      }
      else {
        oSaveData.OtherData.push({
          CompanyDBId: localStorage.getItem("CompID"),
          ContnrShipmentId: this.ShipmentId,
          OPTM_CREATEDBY: localStorage.getItem("UserId"),
          OPTM_GROUP_CODE: this.containerGroupCode
        })
      }

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

      this.containerShipmentService.RemoveShipmentFromContainer(tempArray).subscribe(
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
      else if (this.lookupfor == "ShipmentList") {
        this.ShipmentId = $event.OPTM_SHIPMENTID;
        this.ShipmentCode = $event.OPTM_SHIPMENT_CODE;
        this.ShipmentStatus = $event.OPTM_STATUS;
      }
      else if (this.lookupfor == "GroupCodeList") {
        this.containerGroupCode = $event.OPTM_CONTAINER_GROUP;
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
}
