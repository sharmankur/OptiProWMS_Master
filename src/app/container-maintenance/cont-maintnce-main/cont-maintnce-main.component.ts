import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { ContMaintnceComponent } from '../cont-maintnce/cont-maintnce.component';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ContainerShipmentService } from 'src/app/services/container-shipment.service';

@Component({
  selector: 'app-cont-maintnce-main',
  templateUrl: './cont-maintnce-main.component.html',
  styleUrls: ['./cont-maintnce-main.component.scss']
})
export class ContMaintnceMainComponent implements OnInit {

  viewLines: boolean = false
  showLookup: boolean = false;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  containerId: any;
  packProcessEnum: any;
  packProcess: any;
  containerCode: any = "";
  warehouse: any;
  containerStatus: any;
  binCode: any;
  inventoryStatus: any;
  weight: any = 0;
  purpose: any;
  volume: any = 0;
  weightUOM = "";
  volumeUOM = "";
  AutoPackRule = "";
  ContainerType = "";
  containerItems: any = []
  childContainerList: any = [];
  pageSize: number = 10
  pageable: boolean = false;
  pageable2: boolean = false;
  ExpandCollapseBtn: string = ""
  constructor(private translate: TranslateService, private commonservice: Commonservice,
    private toastr: ToastrService,
    private router: Router, private containerCreationService: ContainerCreationService,
    private contMaintenance: ContMaintnceComponent,
    private containerShipmentService: ContainerShipmentService) { }

  ngOnInit() {
    localStorage.setItem("From", "")
    this.contMaintenance.cmComponent = 1;
    this.ExpandCollapseBtn = "Expand All"
    // this.GetAllContainer('')
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  onPostToInvClick() {

  }

  onContainerOperationClick() {
    localStorage.setItem("ContainerId", this.containerId)
    localStorage.setItem("ContainerCode", this.containerCode)
    localStorage.setItem("From", "CMaintenance")
    this.contMaintenance.cmComponent = 2;
  }

  GetAllContainer(code) {
    this.showLoader = true;
    this.containerCreationService.GetAllContainer(code).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          this.serviceData = data;
          this.showLookup = true;
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

  containerStatusEnum: any;
  inventoryStatusEnum: any;
  purposeEnum: any;
  getLookupDataValue($event) {
    this.showLookup = false;
    if ($event != null && $event == "close") {
      //nothing to do
      return;
    }
    else {
      if (this.lookupfor == "ContainerIdList") {
        this.containerId = $event.OPTM_CONTAINERID;
        this.containerCode = $event.OPTM_CONTCODE;
        this.containerStatusEnum = $event.OPTM_STATUS
        this.purposeEnum = $event.OPTM_SHIPELIGIBLE
        this.packProcessEnum = $event.OPTM_BUILT_SOURCE
        this.inventoryStatusEnum = $event.OPTM_INV_STATUS
        this.warehouse = $event.OPTM_WHSE
        this.binCode = $event.OPTM_BIN
        this.weight = $event.OPTM_WT_UOM
        this.volume = $event.OPTM_VOLUME
        this.volumeUOM = $event.OPTM_VOL_UOM 
        this.weightUOM = $event.OPTM_WT_UOM 
        this.AutoPackRule = $event.OPTM_AUTORULEID
        this.ContainerType = $event.OPTM_CONTTYPE
        if (this.weight == undefined || this.weight == "") {
          this.weight = 0
        }
        if (this.volume == undefined || this.volume == "") {
          this.volume = 0
        }
        // if(this.inventoryStatusEnum == undefined || this.inventoryStatusEnum == ""){
        //   this.inventoryStatusEnum = 0
        // }
        this.containerStatus = this.getContainerStatus(this.containerStatusEnum)
        this.inventoryStatus = this.getInvStatus(this.inventoryStatusEnum)
        this.purpose = this.getShipEligible(this.purposeEnum);
        this.packProcess = this.getBuiltProcess(this.packProcessEnum);
        this.getItemAndBSDetailByContainerId()
      }
    }
  }

  setDefaultValues() {
    this.containerStatus = ''; this.packProcess = '';
    this.warehouse = ''; this.inventoryStatus = ''; this.binCode = '';
    this.purpose = ''; this.weight = 0; this.volume = 0;
  }

  onContainerCodeChange(code) {
    if (code == undefined || code == "") {
      this.setDefaultValues();
      return;
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
            this.resetFields()
            this.toastr.error('', this.translate.instant("InvalidContainerCode"));
          } else {
            this.containerId = data[0].OPTM_CONTAINERID;
            this.containerCode = data[0].OPTM_CONTCODE
            this.containerStatusEnum = data[0].OPTM_STATUS
            this.purposeEnum = data[0].OPTM_SHIPELIGIBLE
            this.inventoryStatusEnum = data[0].OPTM_INV_STATUS
            this.warehouse = data[0].OPTM_WHSE
            this.binCode = data[0].OPTM_BIN
            this.weight = data[0].OPTM_WEIGHT
            this.volume = data[0].OPTM_VOLUME
            this.AutoPackRule = data[0].OPTM_AUTORULEID
            this.ContainerType = data[0].OPTM_CONTTYPE
            this.packProcessEnum = data[0].OPTM_BUILT_SOURCE
            this.containerStatus = this.getContainerStatus(this.containerStatusEnum)
            this.inventoryStatus = this.getInvStatus(this.inventoryStatusEnum)
            this.purpose = this.getShipEligible(this.purposeEnum);
            this.packProcess = this.getBuiltProcess(this.packProcessEnum);
            this.getItemAndBSDetailByContainerId()
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

  resetFields() {
    this.containerId = '';
    this.containerCode = '';
    this.warehouse = '';
    this.binCode = '';
    this.weight = 0.0;
    this.containerStatus = ''
    this.inventoryStatus = ''
    this.purpose = ''
    this.packProcess = ''
    this.packProcessEnum = ""
    this.containerStatusEnum = ""
    this.purposeEnum = ""
    this.inventoryStatusEnum = ""
    this.containerItems = []
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

  getInvStatus(id) {
    if (id == undefined || id == "") {
      return //this.translate.instant("InvStatusPending");
    }
    id = Number("" + id)

    if (id == 1) {
      return this.translate.instant("InvStatusPending");
    } else if (id == 2) {
      return this.translate.instant("InvStatusPosted");
    }
  }

  getShipEligible(v) {
    if (v == undefined || v == "") {
      return this.translate.instant("Shipping");
    }

    if (v == "Y") {
      return this.translate.instant("Shipping");
    } else if (v == "N") {
      return this.translate.instant("Internal");
    }
  }

  getBuiltProcess(id) {
    if (id == undefined || id == "") {
      return;//this.translate.instant("BuiltProManufacturing");
    }
    id = Number("" + id)

    if (id == 1) {
      return this.translate.instant("BuiltProManufacturing");
    } else if (id == 2) {
      return this.translate.instant("BuiltProReceived_From_Vendor");
    } else if (id == 3) {
      return this.translate.instant("BuiltProPacked_In_WareHouse");
    }
  }

  getItemAndBSDetailByContainerId() {
    if (this.containerId == undefined || this.containerId == "") {
      return;
    }
    this.showLoader = true;
    this.containerCreationService.GetItemAndBtchSerDetailBasedOnContainerID(this.containerId, this.containerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.length == 0) {
            this.resetFields()
            this.toastr.error('', this.translate.instant("InvalidContainerCode"));
          } else {
            this.containerItems = data.ItemDeiail
            if (this.containerItems.length > 10) {
              this.pageable = true
            }
            this.prepareDataForGrid();

            for(var i=0; i<data.ChlidContainerDeiail.length; i++) {
              this.containerItems.push({
                TYPE: "Container",
                CODE: data.ChlidContainerDeiail[i].OPTM_CONTCODE,
                OPTM_QUANTITY: 1,
                OPTM_WEIGHT: data.ChlidContainerDeiail[i].OPTM_WEIGHT == null?'0':data.ChlidContainerDeiail[i].OPTM_WEIGHT,
                OPTM_VOLUME: data.ChlidContainerDeiail[i].OPTM_VOLUME== null?'0':data.ChlidContainerDeiail[i].OPTM_VOLUME,
                OPTM_SHIPMENT_ID: data.ChlidContainerDeiail[i].OPTM_SHIPMENTID == null?'':data.ChlidContainerDeiail[i].OPTM_SHIPMENTID,
                OPTM_PARENTCONTID: data.ChlidContainerDeiail[i].OPTM_PARENTCONTID,
                OPTM_PICKED_TOSHIP: data.ChlidContainerDeiail[i].OPTM_PICKED_TOSHIP=="Y"?true:false,
                OPTM_WHSE: data.ChlidContainerDeiail[i].OPTM_WHSE,
                OPTM_BIN: data.ChlidContainerDeiail[i].OPTM_BIN,
                OPTM_SHIPELIGIBLE: data.ChlidContainerDeiail[i].OPTM_SHIPELIGIBLE=="Y"?true:false,
                OPTM_SO_NUMBER: data.ChlidContainerDeiail[i].OPTM_SO_NUMBER == null?'':data.ChlidContainerDeiail[i].OPTM_SO_NUMBER,
              });
            }

            // var batchSerailsData = data.BtchSerDeiail
            // for (var i = 0; i < this.containerItems.length; i++) {
            //   this.containerItems[i].ItemBatchSerailData = []
            //   for (var j = 0; j < batchSerailsData.length; j++) {
            //     if (this.containerItems[i].OPTM_ITEMCODE == batchSerailsData[j].OPTM_ITEMCODE) {
            //       this.containerItems[i].ItemBatchSerailData.push(batchSerailsData[j]);
            //     } else if (this.containerItems[i].OPTM_TRACKING == "N") {
            //       this.containerItems[i].ItemBatchSerailData.push({
            //         TEMP_ID: -1
            //       });
            //     }
            //   }
            // }

            // prepare child container items list
            this.prepareGridDataForChildContainer(data);
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

  prepareGridDataForChildContainer(data: any) {
    var childContItems = data.ChildContItemDeiail

    for (var j = 0; j < this.containerItems.length; j++) {
      this.containerItems[j].ItemBatchSerailData = []
      for (var i = 0; i < childContItems.length; i++) {
        if (this.containerItems[j].CODE == childContItems[i].OPTM_CONTAINERID) {
          this.containerItems[j].ItemBatchSerailData.push({
            TYPE: "Item",
            CODE: childContItems[i].OPTM_ITEMCODE,
            OPTM_QUANTITY: childContItems[i].OPTM_QUANTITY,
            OPTM_WEIGHT: childContItems[i].OPTM_WEIGHT == null?'0':childContItems[i].OPTM_WEIGHT,
            OPTM_VOLUME: childContItems[i].OPTM_VOLUME== null?'0':childContItems[i].OPTM_VOLUME,
            OPTM_SHIPMENT_ID: childContItems[i].OPTM_SHIPMENTID == null?'':childContItems[i].OPTM_SHIPMENTID,
            OPTM_PARENTCONTID: childContItems[i].OPTM_PARENTCONTID,
            OPTM_PICKED_TOSHIP: childContItems[i].OPTM_PICKED_TOSHIP=="Y"?true:false,
            OPTM_WHSE: childContItems[i].OPTM_WHSE,
            OPTM_BIN: childContItems[i].OPTM_BIN,
            OPTM_SHIPELIGIBLE: childContItems[i].OPTM_SHIPELIGIBLE=="Y"?true:false,
            OPTM_SO_NUMBER: childContItems[i].OPTM_SO_NUMBER == null?'':childContItems[i].OPTM_SO_NUMBER,
          });
        }
      }
    }

    // var childContItems = data.ChildContItemDeiail
    // for (var i = 0; i < childContItems.length; i++) {
    //   this.childContainerList[i].childCoontItems = []
    //   this.childContainerList.push({
    //     OPTM_CONTAINERID: childContItems[i].OPTM_CONTAINERID,
    //     OPTM_CONTCODE: childContItems[i].OPTM_CONTCODE,
    //     OPTM_CONTTYPE: childContItems[i].OPTM_CONTTYPE,
    //     OPTM_STATUS: childContItems[i].OPTM_STATUS,
    //   })
    // }


    // this.childContainerList = []
    // for (var i = 0; i < childConts.length; i++) {
    //   var items = []
    //   for (var j = 0; j < childContItems.length; j++) {
    //     if (childConts[i].OPTM_CONTAINERID == childContItems[j].OPTM_CONTAINERID
    //       || childConts[i].OPTM_CONTCODE == childContItems[j].OPTM_CONTAINERID) {
    //       items.push(childContItems[j])
    //     }
    //   }
    //   this.childContainerList.push({
    //     OPTM_CONTAINERID: childConts[i].OPTM_CONTAINERID,
    //     OPTM_CONTCODE: childConts[i].OPTM_CONTCODE,
    //     OPTM_CONTTYPE: childConts[i].OPTM_CONTTYPE,
    //     OPTM_STATUS: this.getContainerStatus(childConts[i].OPTM_STATUS),
    //     childContItems: items
    //   })
    // }

    // if (this.childContainerList.length > 10) {
    //   this.pageable2 = true
    // }
  }

  prepareDataForGrid() {
    for (var i = 0; i < this.containerItems.length; i++) {
      this.containerItems[i].TYPE = "Item";
      this.containerItems[i].CODE = this.containerItems[i].OPTM_ITEMCODE;
      if (this.containerItems[i].OPTM_SHIPELIGIBLE == "Y") {
        this.containerItems[i].OPTM_SHIPELIGIBLE = true
      } else {
        this.containerItems[i].OPTM_SHIPELIGIBLE = false
      }

      if (this.containerItems[i].OPTM_PICKED_TOSHIP == "Y") {
        this.containerItems[i].OPTM_PICKED_TOSHIP = true
      } else {
        this.containerItems[i].OPTM_PICKED_TOSHIP = false
      }
      this.containerItems[i].OPTM_STATUS = this.getContainerStatus(this.containerItems[i].OPTM_STATUS)
    }

    for (var i = 0; i < this.containerItems.length; i++) {
      if (this.containerItems[i].OPTM_WEIGHT == undefined || this.containerItems[i].OPTM_WEIGHT == "") {
        this.containerItems[i].OPTM_WEIGHT = 0.0
      }

      if (this.containerItems[i].OPTM_WT_UOM == undefined || this.containerItems[i].OPTM_WT_UOM == "") {
        this.containerItems[i].OPTM_WT_UOM = 0.0
      }

      if (this.containerItems[i].OPTM_VOLUME == undefined || this.containerItems[i].OPTM_VOLUME == "") {
        this.containerItems[i].OPTM_VOLUME = 0.0
      }

      if (this.containerItems[i].OPTM_VOL_UOM == undefined || this.containerItems[i].OPTM_VOL_UOM == "") {
        this.containerItems[i].OPTM_VOL_UOM = 0.0
      }

      if (this.containerItems[i].CONTAINER_WEIGHT == undefined || this.containerItems[i].CONTAINER_WEIGHT == "") {
        this.containerItems[i].CONTAINER_WEIGHT = 0.0
      }

      if (this.containerItems[i].CONTAINER_WEIGHT_UOM == undefined || this.containerItems[i].CONTAINER_WEIGHT_UOM == "") {
        this.containerItems[i].CONTAINER_WEIGHT_UOM = 0.0
      }

      if (this.containerItems[i].CONTAINER_VOLUME == undefined || this.containerItems[i].CONTAINER_VOLUME == "") {
        this.containerItems[i].CONTAINER_VOLUME = 0.0
      }

      if (this.containerItems[i].CONTAINER_VOLUME_UOM == undefined || this.containerItems[i].CONTAINER_VOLUME_UOM == "") {
        this.containerItems[i].CONTAINER_VOLUME_UOM = 0.0
      }
    }
  }

  onCloseClick() {
    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("Enter_Container_Code"));
      return;
    }

    let oSaveData: any = {};
    oSaveData.SelectedRows = [];

    oSaveData.SelectedRows.push({
      //OPTM_CONTCODE: JSON.stringify(this.SelectedRowsforShipmentArr[i]), 
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_CONTCODE: this.containerCode,
      CONTAINERID: ''
    })

    let tempArray = [];
    tempArray.push({
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_CONTCODE: this.containerCode,
      CONTAINERID: ''
    });

    this.showLoader = true;
    //this.commonservice.CloseClick(this.containerCode).subscribe(
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
            if (data[0].RESULT == "Data Saved") {
              this.toastr.success('', this.translate.instant("ContainerClosedMsg"))
              this.onContainerCodeChange(this.containerCode);
            } else {
              this.toastr.error('', data[0].RESULT)
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

  onReopenClick() {
    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("Enter_Container_Code"));
      return;
    }
    this.showLoader = true;
    this.commonservice.ReopenClick(this.containerCode).subscribe(
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
              this.toastr.success('', this.translate.instant("ContainerReopenedMsg"))
              this.onContainerCodeChange(this.containerCode);
            } else {
              this.toastr.error('', data[0].RESULT)
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

  onSetDamagedClick() {
    if (this.containerCode == undefined || this.containerCode == "") {
      this.toastr.error('', this.translate.instant("Enter_Container_Code"));
      return;
    }

    this.showDialog("setDamage", this.translate.instant("yes"), this.translate.instant("no"),
      this.translate.instant("MoveAllContenttoInventory"));
  }

  SetDamagedCall(isRemoveAllContitemsBeforeDamage) {
    let oSaveData: any = {};
    oSaveData.SelectedRows = [];
    oSaveData.SelectedRows.push({
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_CONTCODE: this.containerCode,
      CONTAINERID: this.containerId
    });

    let tempArray = [];
    tempArray.push({
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_CONTCODE: this.containerCode,
      CONTAINERID: this.containerId,
      Delete: isRemoveAllContitemsBeforeDamage
    });

    this.showLoader = true;
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
            if (data[0].RESULT == "Data updated") {
              this.toastr.success('', this.translate.instant("SetDamagedMsg"));
              //this.toastr.success('', "ContainerCancelledMsg")
              this.onContainerCodeChange(this.containerCode);
            } else {
              this.toastr.error('', data[0].RESULT)
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

  onSetCancelClick() {
    if (this.containerId == undefined || this.containerId == "") {
      this.toastr.error('', this.translate.instant("Enter_Container_Code"));
      return;
    }
    this.showLoader = true;
    this.commonservice.CancelClick(this.containerId).subscribe(
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
              this.toastr.success('', this.translate.instant("ContainerCancelledMsg"))
              this.onContainerCodeChange(this.containerCode);
            } else {
              if (data[0].RESULT == "Container contains Items / Containers. Remove items from container before cancel") {
                this.showDialog("CancelContainer", this.translate.instant("yes"), this.translate.instant("no"),
                  this.translate.instant("RemoveItemFromContMSg"));
              } else {
                this.toastr.error('', data[0].RESULT)
              }

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

  public showOnlyBeveragesDetails(dataItem: any, index: number): boolean {
    return dataItem.TYPE == "Container";//dataItem.OPTM_TRACKING === "B" || dataItem.OPTM_TRACKING === "S";
  }

  @ViewChild(GridComponent, { static: false }) grid: GridComponent;
  isExpand: boolean = false;
  onExpandCollapse() {
    this.isExpand = !this.isExpand;
    this.ExpandCollapseBtn = (this.isExpand) ? this.translate.instant("CollapseAll") : this.translate.instant("ExpandAll")

    for (var i = 0; i < this.containerItems.length; i++) {
      if (this.isExpand) {
        this.grid.expandRow(i)
      } else {
        this.grid.collapseRow(i);
      }
    }
  }

  // public showOnlyBeveragesDetails1(dataItem: any, index: number): boolean {
  //   return dataItem.OPTM_TRACKING === "B" || dataItem.OPTM_TRACKING === "S";
  // }

  @ViewChild(GridComponent, { static: false }) grid1: GridComponent;
  isExpand1: boolean = false;
  onExpandCollapse1() {
    this.isExpand1 = !this.isExpand1;

    for (var i = 0; i < this.childContainerList.length; i++) {
      if (this.isExpand1) {
        this.grid1.expandRow(i)
      } else {
        this.grid1.collapseRow(i);
      }
    }
  }

  public showOnlyBeveragesDetails2(dataItem: any, index: number): boolean {
    // return dataItem.OPTM_TRACKING === "B" || dataItem.OPTM_TRACKING === "S" || dataItem.OPTM_TRACKING === "L";
    return true
  }

  @ViewChild(GridComponent, { static: false }) grid2: GridComponent;
  isExpand2: boolean = false;
  onExpandCollapse2() {
    this.isExpand2 = !this.isExpand2;

    for (var i = 0; i < this.childContainerList.childContItems.length; i++) {
      if (this.isExpand2) {
        this.grid2.expandRow(i)
      } else {
        this.grid2.collapseRow(i);
      }
    }
  }

  onAddItemClick() {
    localStorage.setItem("ContainerId", this.containerId)
    localStorage.setItem("ContainerCode", this.containerCode)
    localStorage.setItem("From", "CMaintenance")
    this.contMaintenance.cmComponent = 2;
  }

  dialogFor: any;
  yesButtonText: any;
  noButtonText: any;
  dialogMsg: any;
  showConfirmDialog: boolean = false;

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
        case ("setDamage"):
          this.SetDamagedCall(true);
          break;
        case ("CancelContainer"):
          localStorage.setItem("loadContainer", this.containerCode);
          this.router.navigate(['home/add-item-container']);
          break;
      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
          case ("setDamage"):
            this.SetDamagedCall(undefined);
            break;
          case ("CancelContainer"):
            break;
        }
      }
    }
  }
///------------------------------------------------------
  dialogOpened = false;
  DialogTitle = "";
  dialogLabel = "";
  dialogValue = "";
  ShowSOandContainerCodeDialog(option){
    this.dialogOpened = true;
    if(option == 1){
      this.DialogTitle = this.translate.instant("AssignSO")
      this.dialogLabel = this.translate.instant("SalesOrder")
    }else{
      this.DialogTitle = this.translate.instant("AssignCC")
      this.dialogLabel = this.translate.instant("ContainerGroupingCode")
    }    
  }

  close_kendo_dialog(){
    this.dialogOpened = false;
  }

  updateValue(option){
    if(this.DialogTitle == this.translate.instant("AssignSO") || option == 1){

    }else{

    }
  }

  showLookupData(){
    if(this.DialogTitle == this.translate.instant("AssignSO")){

    }else{

    }
  }

  onConfirmClick(){
    this.close_kendo_dialog();
  }
}
