import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { PickTaskService } from '../../services/picktask.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { ContainerCreationService } from '../../services/container-creation.service';
import { CommonData } from '../../models/CommonData';
import { PLPickListItemModel } from 'src/app/models/pick-list/PLPickListItemModel';
import { DateTimeHelper } from 'src/app/helpers/datetime.helper';
import { PLPickListTaskModel } from 'src/app/models/pick-list/PLPickListTaskModel';
import * as moment from 'moment';
@Component({
  selector: 'app-picking-list',
  templateUrl: './picking-list.component.html',
  styleUrls: ['./picking-list.component.scss']
})
export class PickingListComponent implements OnInit {

  // this component for maintainance picking
  showLookupLoader: boolean = true;
  ShipmentList: any[];
  showLoader: boolean = false;

  WarehouseId: any = '';
  serviceData: any[];
  lookupfor: string;
  showLookup: boolean = false;

  PickListBasisArray: any[] = [];
  PlanShiftArray: any[] = [];//{Name:'',Value:''} ;
  PickShiftArray: any[] = [];


  updatedPicItemsArray: Array<PLPickListItemModel> = [];
  updatedPickTasksArray: Array<PLPickListTaskModel> = [];
  meansData: any;
  selectedMeansValue: any
  selectedPLItems: any = [];
  selectedPLItemsDataForValidate: any = [];

  commonData: any = new CommonData(this.translate);
  public items: any[] = [];
  public mySelection: number[] = [];
  public pageSize = Commonservice.pageSize;
  public skip = 0;
  public mobileMedia = "(max-width: 767px)";
  public desktopMedia = "(min-width: 768px)";
  // GRID VARIABLE
  StatusValue: any = { Name: '', Value: '' };
  PickListBasis: any = { Name: '', Value: '' };
  PlanShift: any = { Name: '', Value: '' };
  //StatusId: any =  {Name: '' , Value: ''};
  planDate: Date = undefined// new Date();
  public ShipmentCodeFrom: any = '';
  public ShipmentCodeTo: any = '';
  ShipmentIdFrom: string = "";
  ShipmentIdTo: string = "";


  @ViewChild('wareHouse', { static: false }) wareHouse;
  @ViewChild('fromShipment', { static: false }) fromShipment;
  @ViewChild('toShipment', { static: false }) toShipment;
  dateFormat: any = 'mm/dd/yyyy'
  //pageSize: number = Commonservice.pageSize;
  constructor(private picktaskService: PickTaskService, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private commonservice: Commonservice, private containerCreationService: ContainerCreationService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.PickListBasisArray = this.commonData.PickListEnum();
      this.PlanShiftArray = this.commonData.PlanShiftEnum();
      this.statusArray = this.commonData.PickListStatusEnum();
    });
    this.PickListBasisArray = this.commonData.PickListEnum();
    this.PlanShiftArray = this.commonData.PlanShiftEnum();
    this.statusArray = this.commonData.PickListStatusEnum();
    this.shiment_status_array = this.commonData.shiment_status_array();
  }
  shiment_status_array = [];

  ngOnInit() {

    this.picktaskService.clearLocaStorage();
    // this.getShipmentList()
    this.commonservice.setCustomizeInfo();
    this.meansData = this.commonData.TransferMeansTypeEnum()
    // this.meansData =  [
    //   { Value: 1, Name:  this.translate.instant("Manual") },
    //   { Value: 2, Name:  this.translate.instant("Name_ForkLift") },
    //   { Value: 3, Name:  this.translate.instant("Name_Crane") }
    //  ];
    this.selectedMeansValue = this.meansData[0];// { "Value": 1, "Name": "Manual" };
  }


  ngAfterViewInit() {
    console.log("ngAfterInit");
    this.wareHouse.nativeElement.focus();
  }

  onShipmentSelection(row) {
    localStorage.setItem("ShipDetail", JSON.stringify(row.dataItem));
    localStorage.setItem("From", "shiplist");
    this.router.navigate(['home/picking/picking-item-details']);
  }

  showPickTaskList(row) {
    localStorage.setItem("ShipDetail", JSON.stringify(row));
    this.router.navigate(['home/picking/picking-item-list']);
  }

  getShipmentList() {
    this.showLoader = true;
    this.picktaskService.GetShipmentId().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookupLoader = false;
          this.ShipmentList = data;
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


  ShowBatchSerials() {

  }

  GetDataForShipmentId(fieldName, event) {
    if (this.WarehouseId == "" || this.WarehouseId == undefined) {
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
      return;
    }
    let shipmentCode;
    if (fieldName == "ShipIdFrom") {
      shipmentCode = this.ShipmentCodeFrom;
    }
    else if (fieldName == "ShipIdTo") {
      shipmentCode = this.ShipmentCodeTo
    }
    if ((shipmentCode == "" || shipmentCode == null || shipmentCode == undefined) && (event == 'blur')) {
      return;
    }
    if (event != 'blur') {
      shipmentCode = ""
    }
    this.showLoader = true;
    this.commonservice.GetAllocatedShipmentCode(4, shipmentCode, this.WarehouseId).subscribe(
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
              if (fieldName == "ShipIdFrom") {
                this.ShipmentIdTo = data[0].OPTM_SHIPMENTID;
                this.ShipmentCodeTo = data[0].OPTM_SHIPMENT_CODE;
                if (this.ShipmentCodeTo == "" || this.ShipmentCodeTo == undefined) {
                  this.ShipmentIdTo = data[0].OPTM_SHIPMENTID;
                  this.ShipmentCodeTo = data[0].OPTM_SHIPMENT_CODE;
                }
              }
              else if (fieldName == "ShipIdTo") {
                this.ShipmentIdTo = data[0].OPTM_SHIPMENTID;
                this.ShipmentCodeTo = data[0].OPTM_SHIPMENT_CODE;
              }
            } else {
              if (fieldName == "ShipIdFrom") {
                this.ShipmentIdTo = "";
                this.ShipmentCodeTo = ""
              }
              else if (fieldName == "ShipIdTo") {
                this.ShipmentIdTo = ""
                this.ShipmentCodeTo = ""
              }
              this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
            }
          } else {
            this.showLookup = true;
            this.serviceData = data;
            for (let i = 0; i < this.serviceData.length; i++) {
              this.serviceData[i].OPTM_STATUS = this.shiment_status_array[Number(this.serviceData[i].OPTM_STATUS) - 1].Name;
            }
            this.lookupfor = fieldName;
          }
        } else {
          this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
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
          this.wareHouse.nativeElement.focus();
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


  //#region "shipmentId"  
  IsValidShipmentCode(fieldName) {
    let soNum;
    if (fieldName == "ShipIdFrom") {
      soNum = this.ShipmentCodeFrom;
    }
    else if (fieldName == "ShipIdTo") {
      soNum = this.ShipmentCodeTo
    }
    if (soNum == "" || soNum == null || soNum == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidAllocatedShipmentCode(soNum).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "ShipIdFrom") {
              //  this.ShipIdFrom = data[0].OPTM_SHIPMENTID;
              this.ShipmentCodeFrom = data[0].OPTM_SHIPMENT_CODE;
              if (this.ShipmentCodeTo == "" || this.ShipmentCodeTo == undefined) {
                this.ShipmentCodeTo = data[0].OPTM_SHIPMENT_CODE
                this.ShipmentIdFrom = this.ShipmentIdTo = data[0].OPTM_SHIPMENTID;
              }
            }
            else if (fieldName == "ShipIdTo") {
              this.ShipmentIdTo = data[0].OPTM_SHIPMENTID;
              this.ShipmentCodeTo = data[0].OPTM_SHIPMENT_CODE
            }
          } else {
            if (fieldName == "ShipIdFrom") {
              this.ShipmentIdFrom = "";
              this.ShipmentCodeFrom = "";
              this.fromShipment.nativeElement.focus();
            }
            else if (fieldName == "ShipIdTo") {
              this.ShipmentIdTo = "";
              this.ShipmentCodeTo = "";
              this.toShipment.nativeElement.focus();
            }
            this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
          }
        } else {
          if (fieldName == "ShipIdFrom") {
            this.ShipmentIdFrom = "";
            this.ShipmentCodeFrom = "";
          }
          else if (fieldName == "ShipIdTo") {
            this.ShipmentIdTo = "";
            this.ShipmentCodeTo = "";
          }
          this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
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

  pickListBasisIndex = 1;
  onPickListBasisChange($event) {
    this.PickListBasis = $event.Value;
  }

  pickShiftIndex = 1;
  onPlanShiftChange($event) {
    this.PlanShift = $event.Value;
  }

  statusArray: any = [];

  onStatusChange($event) {
    this.StatusValue = $event.Value;
  }


  onQueryBtnClick() {
    //validation method.
    if (this.WarehouseId == null || this.WarehouseId == undefined || this.WarehouseId == "") {
      this.toastr.error('', this.translate.instant("Login_SelectwarehouseMsg"));
      return;
    }
    this.PickItemList = [];
    this.PickTaskList = [];
    this.FillPickListDataInGrid();
  }

  ShowGridPaging: boolean = false;
  PickItemList: any = [];
  PickItemListM: Array<PLPickListItemModel>;
  PickTaskListM: Array<PLPickListTaskModel>;
  PickTaskList: any = [];
  selectedItemPickTaskList: any = [];

  FillPickListDataInGrid() {
    var PickListBasicVal = this.PickListBasis.Value;
    var statusVal = this.StatusValue.Value;
    var planShiftVal = this.PlanShift.Value;
    this.showLoader = true;
    let plandateString = "";
    if (this.planDate != undefined) {
      plandateString = this.planDate.toLocaleDateString();
    }
    this.picktaskService.FillPickListDataInGrid(this.ShipmentIdFrom, this.ShipmentIdTo, this.WarehouseId, PickListBasicVal, planShiftVal, statusVal, plandateString).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined && data != null) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.PickItemList = data.OPTM_WHS_PICKLIST;
          this.PickTaskList = data.OPTM_WHSTASKLIST;
          this.PickTaskListM = data.OPTM_WHSTASKLIST;
          this.PickItemListM = data.OPTM_WHS_PICKLIST;

          this.setTaskMeanValue()
          if (this.PickItemList.length > 10) {
            this.ShowGridPaging = true;
          } else {
            this.ShowGridPaging = false;
          }
          this.PickItemListM.forEach(element => {
            element.OPTM_PLANDATETIME_Object = DateTimeHelper.ParseDate(element.OPTM_PLANDATETIME);
          });

          if (this.PickItemListM.length > 0) {
            this.FilterPickTask(this.PickItemListM[0]);
          } else {
            this.selectedItemPickTaskList = [];
          }

          for (let i = 0; i < this.PickItemList.length; i++) {
            this.PickItemList[i].Selected = false;
            this.PickItemList[i].OPTM_STATUS = this.PickItemList[i].OPTM_STATUS;

          }

        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
        // this.PickItemList = data.OPTM_WHS_PICKLIST;
        // this.PickTaskList = data.OPTM_WHSTASKLIST;
        // if (this.PickItemList.length > 10) {
        //   this.ShowGridPaging = true;
        // } else {
        //   this.ShowGridPaging = false;
        // }
        // for (let i = 0; i < this.PickItemList.length; i++) {
        //   this.PickItemList[i].Selected = false;
        //   this.PickItemList[i].OPTM_STATUS = this.PickItemList[i].OPTM_STATUS;
        // }
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

  setTaskMeanValue() {
    for (let i = 0; i < this.PickTaskListM.length; i++) {
      var meanVal = this.PickTaskListM[i].OPTM_TRANSIT_MEANS
      this.PickTaskListM[i].selectedMeansVal = { Value: meanVal, Name: this.commonData.getMeansStringByValue(meanVal) }
    }
    console.log("value set");
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
        var row = this.updatedPickTasksArray.filter(task => task.OPTM_TASKID === this.selectedPickTaskRow.OPTM_TASKID)
        if (row != null && row != undefined && row.length > 0) {
          row[0].OPTM_SRC_BIN = $event.BinCode;
        } else {
          this.selectedPickTaskRow.OPTM_SRC_BIN = $event.BinCode;
          this.updatedPickTasksArray.push(this.selectedPickTaskRow);
        }
      } else if (this.lookupfor == "ShipIdFrom") {
        this.ShipmentIdFrom = $event.OPTM_SHIPMENTID;
        this.ShipmentCodeFrom = $event.OPTM_SHIPMENT_CODE;
        if (this.ShipmentCodeTo == "" || this.ShipmentCodeTo == undefined) {
          this.ShipmentCodeTo = $event.OPTM_SHIPMENT_CODE
          this.ShipmentIdTo = $event.OPTM_SHIPMENTID;
        }
      }
      else if (this.lookupfor == "ShipIdTo") {
        this.ShipmentIdTo = $event.OPTM_SHIPMENTID;
        this.ShipmentCodeTo = $event.OPTM_SHIPMENT_CODE;
      }

    }
  }

  /**
   * This method filter task grid data on item click.
   * @param $event 
   */
  onPickListItemClick($event) {
    this.FilterPickTask($event.selectedRows[0].dataItem);
  }

  FilterPickTask(selectedRows) {
    let selectedPickTasks = this.PickTaskList.filter(item =>
      item.OPTM_PICKLIST_ID === selectedRows.OPTM_PICKLIST_ID);
    this.selectedItemPickTaskList = selectedPickTasks;
    for (var i = 0; i < this.selectedItemPickTaskList.length; i++) {
      this.selectedItemPickTaskList.OPTM_PICKLIST_STATUS = selectedRows.OPTM_STATUS;
    }
  }

  selectContainerRowChange(checkValue, dataItem, index) {
    var itemId = dataItem.OPTM_PICKLIST_ID;
    if (checkValue == true && !this.selectedPLItems.includes(itemId)) {
      this.selectedPLItems.push(itemId);
      this.selectedPLItemsDataForValidate.push(dataItem);
    } else {
      if (checkValue == false && this.selectedPLItems.includes(itemId)) {
        this.selectedPLItems.splice(this.selectedPLItems.indexOf(itemId), 1);
        this.selectedPLItemsDataForValidate.splice(this.selectedPLItemsDataForValidate.indexOf(this.filterRow(this.selectedPLItemsDataForValidate, itemId), 1))
      }
    }
  }


  public filterRow(arryData, id): any {
    //var row = arryData.filter(item => item.OPTM_PICKLIST_CODE == id);
    let index = arryData.findIndex(x => x.OPTM_PICKLIST_CODE === id);
    return index;
  }

  validateDataForRelase(dataArray: any): boolean {
    var status = true;
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i].OPTM_STATUS == "2") {
        status = false;
        break;
      }
    }
    return status;
  }

  public meansDropDownValueChange($event, dataItem, index) {
    this.selectedPickTaskRow = dataItem;
    this.selectedPickTaskRow.OPTM_TRANSIT_MEANS = $event.Value;
    var row = this.updatedPickTasksArray.filter(task => task.OPTM_TASKID === dataItem.OPTM_TASKID)
    if (row != null && row != undefined && row.length > 0) {
      row[0].OPTM_TRANSIT_MEANS = $event.Value;
    } else {
      this.selectedPickTaskRow.OPTM_TRANSIT_MEANS = $event.value;
      this.updatedPickTasksArray.push(this.selectedPickTaskRow);
    }
  }

  // need to confirm is this required or not for getting value for update.
  ChangePriority(event, dataItem, companyRowIndex) {
    dataItem.OPTM_PRIORITY = event.target.value
    this.selectedPickItemRow = dataItem;
    //update to list and use that item.
    var row = this.updatedPicItemsArray.filter(pickItem => pickItem.OPTM_PICKLIST_ID === dataItem.OPTM_PICKLIST_ID)
    if (row != null && row != undefined && row.length > 0) {
      row[0].OPTM_PRIORITY = event.target.value;
    } else {
      this.selectedPickItemRow.OPTM_PRIORITY = event.target.value;
      this.updatedPicItemsArray.push(this.selectedPickItemRow);
    }
  }
  ChangeToteNumber(event, dataItem, companyRowIndex) {
    dataItem.OPTM_TOTE_NUMBER = event.target.value
    this.selectedPickItemRow = dataItem;
    //update to list and use that item.
    var row = this.updatedPicItemsArray.filter(pickItem => pickItem.OPTM_PICKLIST_ID === dataItem.OPTM_PICKLIST_ID)
    if (row != null && row != undefined && row.length > 0) {
      row[0].OPTM_TOTE_NUMBER = event.target.value;
    } else {
      this.selectedPickItemRow.OPTM_TOTE_NUMBER = event.target.value;
      this.updatedPicItemsArray.push(this.selectedPickItemRow);
    }
  }

  // need to confirm is this required or not for getting value for update.
  ChangeShieft(event, dataItem, companyRowIndex) {
    dataItem.OPTM_PLANWHSESHIFT_ID = event.target.value
    this.selectedPickItemRow = dataItem;
    //update to list and use that item.
    var row = this.updatedPicItemsArray.filter(pickItem => pickItem.OPTM_PICKLIST_ID === dataItem.OPTM_PICKLIST_ID)
    if (row != null && row != undefined && row.length > 0) {
      row[0].OPTM_PLANWHSESHIFT_ID = event.target.value;
    } else {
      this.selectedPickItemRow.OPTM_PLANWHSESHIFT_ID = event.target.value;
      this.updatedPicItemsArray.push(this.selectedPickItemRow);
    }
    // get row from  pick list item list.
  }

  // run when user change anything in assigned user group.
  ChangeAssignedUserGroup(event, dataItem, companyRowIndex) {
    dataItem.OPTM_USER_GRP = event.target.value;
    this.selectedPickTaskRow = dataItem;
    //update to list and use that item.
    var row = this.updatedPickTasksArray.filter(task => task.OPTM_TASKID === dataItem.OPTM_TASKID)
    if (row != null && row != undefined && row.length > 0) {
      row[0].OPTM_USER_GRP = event.target.value;
    } else {
      this.selectedPickTaskRow.OPTM_USER_GRP = event.target.value;
      this.updatedPickTasksArray.push(this.selectedPickTaskRow);
    }
  }
  changePlanDateTime(date: any, dataItem: any, companyRowIndex: Number) {
    dataItem.OPTM_PLANDATETIME = date;
    this.selectedPickItemRow = dataItem;
    var dateString = moment(date).format('MM/DD/YYYY');
    //  new Date(event.getFullYear(), event.getMonth(), event.getDate());
    // new Date(event.getFullYear(), event.getMonth(), event.getDate());
    //update to list and use that item.
    var row = this.updatedPicItemsArray.filter(pickItem => pickItem.OPTM_PICKLIST_ID === dataItem.OPTM_PICKLIST_ID)
    if (row != null && row != undefined && row.length > 0) {
      row[0].OPTM_PLANDATETIME = dateString;
    } else {
      this.selectedPickItemRow.OPTM_PLANDATETIME = dateString;
      this.updatedPicItemsArray.push(this.selectedPickItemRow);
    }
  }


  updateReleaseStatus() {
    if (this.selectedPLItems.length == 0) {
      this.toastr.error('', this.translate.instant("PL_ReleaseStatusItemsValidate"));
      return;
    }

    if (!this.validateDataForRelase(this.selectedPLItemsDataForValidate)) {
      this.toastr.error('', this.translate.instant("validateRelease"));
      return;
    }
    this.showLoader = true;
    this.picktaskService.updateReleaseStatusForPickListItems(this.selectedPLItems).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined && data != null) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          } else {
            var result = data.OUTPUT[0].RESULT;
            if (result == "Data Saved") {
              this.toastr.success('', this.translate.instant("PL_StatusUpdateSuccess"));
              this.PickItemList = [];
              this.PickTaskList = [];
              this.FillPickListDataInGrid();
            } else {
              // show error.
              this.toastr.error('', data.OUTPUT[0].RESULT);
            }
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
  onArrowBtnClick() {
    this.router.navigate(['home/shipment']);
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  selectall: boolean;
  on_Selectall_checkbox_checked(checkedvalue) {
    var isExist = 0;
    // this.CheckedData = []
    this.selectall = false
    if (checkedvalue == true) {
      if (this.PickItemList.length > 0) {
        this.selectall = true
        //   this.SelectedRowsforShipmentArr = [];
        this.selectedPLItems = [];
        this.selectedPLItemsDataForValidate = [];
        for (let i = 0; i < this.PickItemList.length; ++i) {
          var dataItem = this.PickItemList[i];
          var itemId = dataItem.OPTM_PICKLIST_ID;
          this.selectedPLItems.push(itemId);
          this.selectedPLItemsDataForValidate.push(dataItem);
          this.PickItemList[i].Selected = true;
        }
      }
    }
    else {
      this.selectall = false
      // this.selectedValues = [];
      if (this.PickItemList.length > 0) {
        for (let i = 0; i < this.PickItemList.length; ++i) {
          this.PickItemList[i].Selected = false;
          this.selectedPLItems = [];
          this.selectedPLItemsDataForValidate = [];
        }
      }
    }
  }


  isColumnFilterView: boolean = false;

  onFilterChange(checkBox: any, grid: GridComponent) {
    if (checkBox.checked == false) {
      this.clearFilter(grid);
    }
  }

  clearFilter(grid: GridComponent) {
    grid.filter.filters = [];
    //this.clearFilters();
  }





  WHSCODE: any = ''
  hideLookup: boolean = false;
  srcWhsID: any;
  selectedPickTaskRow: any;
  selectedPickItemRow: any;
  GetSrcBinList(index, dataItem: any) {
    this.srcWhsID = dataItem.OPTM_SRC_WHSE;
    this.selectedPickTaskRow = dataItem;
    this.commonservice.GetBinCode(this.srcWhsID).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          this.serviceData = data;
          this.lookupfor = "BinList";
          this.showLookup = true;
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

  IsValidSrcBinCode(index, bincode, display_name, dataItem) {
    this.srcWhsID = dataItem.OPTM_SRC_WHSE;
    this.selectedPickTaskRow = dataItem;
    if (bincode == undefined || bincode == "") {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidBinCode(this.srcWhsID, bincode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            //update to list and use that item.
            var row = this.updatedPickTasksArray.filter(task => task.OPTM_TASKID === dataItem.OPTM_TASKID)
            if (row != null && row != undefined && row.length > 0) {
              row[0].OPTM_SRC_BIN = data[0].BinCode;
            } else {
              this.selectedPickTaskRow.OPTM_SRC_BIN = data[0].BinCode;
              this.updatedPickTasksArray.push(this.selectedPickTaskRow);
            }
          } else {
            this.toastr.error('', this.translate.instant("Invalid_Bin_Code"));
          }
        } else {
          this.toastr.error('', this.translate.instant("Invalid_Bin_Code"));
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


  onUpdatePress() {
    this.updatePickItemAndTasks(this.updatedPicItemsArray, this.updatedPickTasksArray)
  }

  updatePickItemAndTasks(pickItemList: any, pickTaskList: any) {
    var object: any = {}
    var dbId: any[] = [];
    dbId.push({ CompanyDBId: localStorage.getItem("CompID") });
    object.DBId = dbId;
    for (let i = 0; i < pickItemList.length; i++) {
      pickItemList[i].OPTM_PLANDATETIME_Object = ""
    }
    for (let i = 0; i < pickTaskList.length; i++) {
      pickTaskList[i].selectedMeansVal = ""
    }
    object.OPTM_WHS_PICKLIST = pickItemList;
    object.OPTM_WHSTASKLIST = pickTaskList;
    if (pickItemList.length == 0 && pickTaskList.length == 0) {
      this.toastr.error('', this.translate.instant("PickingNoItemToUpdate"));
      return;
    }

    this.showLoader = true;
    this.picktaskService.updatePickItemsAndTasks(object).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined && data != null) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          } else {
            var result = data.OUTPUT[0].RESULT;
            if (result == "Data Saved")
              this.toastr.success('', this.translate.instant("PL_StatusUpdateSuccess"));
            this.PickItemList = [];
            this.PickTaskList = [];
            this.updatedPicItemsArray = [];
            this.updatedPickTasksArray = [];
            this.FillPickListDataInGrid();
          }
        } else {
          // show error.
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
