import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { PickTaskService } from '../../services/picktask.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { CommonData } from '../../models/CommonData';

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
  PlanShiftArray:any[]= [];//{Name:'',Value:''} ;
  PickShiftArray: any[] = [];
  
  commonData: any = new CommonData(this.translate);
  public items: any[] = [];
  public mySelection: number[] = [];
  public pageSize =  Commonservice.pageSize;
  public skip = 0;
  public mobileMedia = "(max-width: 767px)";
  public desktopMedia = "(min-width: 768px)";
  // GRID VARIABLE
  StatusValue:any =  {Name: '' , Value: ''};
  PickListBasis:any ={Name: '' , Value: ''};
  PlanShift:any= {Name: '' , Value: ''}; 
  //StatusId: any =  {Name: '' , Value: ''};
  planDate: any =''// new Date();
  public ShipmentCodeFrom: any = '';
  public ShipmentCodeTo: any ='';
  //pageSize: number = Commonservice.pageSize;
  constructor(private picktaskService: PickTaskService,  private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private commonservice: Commonservice, private containerCreationService: ContainerCreationService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
    this.PickListBasisArray =this.commonData.PickListEnum();
    this.PlanShiftArray =this.commonData.PlanShiftEnum();
    this.statusArray = this.commonData.PickListStatusEnum();
  }

   

  
 
  ngOnInit() {

    this.picktaskService.clearLocaStorage();
   // this.getShipmentList()
    this.commonservice.setCustomizeInfo();
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


  ShowBatchSerials(){
    
  }

  GetDataForShipmentId(fieldName) {
    this.showLoader = true;
    //this.hideLookup = false;
    this.commonservice.GetAllocatedShipmentCode().subscribe(
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
          this.lookupfor = fieldName;
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
            }
            else if (fieldName == "ShipIdTo") {
          //    this.ShipIdTo = data[0].OPTM_SHIPMENTID;
              this.ShipmentCodeTo = data[0].OPTM_SHIPMENT_CODE
            }
          } else {
            if (fieldName == "ShipIdFrom") {
             // this.ShipIdFrom = this.ShipmentCodeFrom = "";
             this.ShipmentCodeFrom = "";
            }
            else if (fieldName == "ShipIdTo") {
            //  this.ShipIdTo = this.ShipmentCodeTo = "";
            this.ShipmentCodeTo = "";
            }
            this.toastr.error('', this.translate.instant("Invalid_ShipmentCode"));
          }
        } else {
          if (fieldName == "ShipIdFrom") {
         //   this.ShipIdFrom = this.ShipmentCodeFrom = "";
         this.ShipmentCodeFrom = "";
          }
          else if (fieldName == "ShipIdTo") {
         //   this.ShipIdTo = this.ShipmentCodeTo = "";
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
    this.PickListBasis =  $event.Value;
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
     if(this.WarehouseId==null ||this.WarehouseId==undefined || this.WarehouseId=="" ){
      this.toastr.error('', this.translate.instant("Login_SelectwarehouseMsg"));
       return;
      }
      this.PickItemList =[];
      this.PickTaskList = [];
    this.FillPickListDataInGrid();
  }

  ShowGridPaging:boolean=false;
  PickItemList:any = [];
  PickTaskList:any = [];
  selectedItemPickTaskList:any=[];
  FillPickListDataInGrid() {
    var PickListBasicVal= this.PickListBasis.Value;
    var statusVal = this.StatusValue.Value;
    var planShiftVal = this.PlanShift.Value;
    this.showLoader = true;
    this.picktaskService.FillPickListDataInGrid(this.ShipmentCodeFrom, this.ShipmentCodeTo, this.WarehouseId,PickListBasicVal,planShiftVal,statusVal,this.planDate).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined && data!=null) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            this.PickItemList = data.OPTM_WHS_PICKLIST;
            this.PickTaskList = data.OPTM_WHSTASKLIST;
            if (this.PickItemList.length > 10) {
              this.ShowGridPaging = true;
            }else{
              this.ShowGridPaging = false;
            }           

            for (let i = 0; i < this.PickItemList.length; i++) {
              this.PickItemList[i].Selected = false;
              this.PickItemList[i].OPTM_STATUS = this.PickItemList[i].OPTM_STATUS;
              
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

  getLookupDataValue($event) {
    if ($event != null && $event == "close") {
      return;
    }
    else {
      if (this.lookupfor == "WareHouse") {
        this.WarehouseId = $event.WhsCode;
      }
      else if (this.lookupfor == "BinList") {
        //this.BinId = $event.BinCode;
      } else if (this.lookupfor == "ShipIdFrom") {
     //   this.ShipIdFrom = event.OPTM_SHIPMENTID;
        this.ShipmentCodeFrom = $event.OPTM_SHIPMENT_CODE;
      }
      else if (this.lookupfor == "ShipIdTo") {
        //this.ShipIdTo = event.OPTM_SHIPMENTID;
        this.ShipmentCodeTo = $event.OPTM_SHIPMENT_CODE;
      }

    }
  }

  /**
   * This method filter task grid data on item click.
   * @param $event 
   */
  onPickListItemClick($event){
    var taskCode = $event.selectedRows[0].dataItem.OPTM_TASK_CODE;
    let selectedPickTasks = this.PickTaskList.filter(item =>
      item.OPTM_TASK_CODE === taskCode );
      this.selectedItemPickTaskList = selectedPickTasks ;
  } 

  selectedPLItems:any = [];
  selectedPLItemsDataForValidate:any = [];
  selectContainerRowChange(checkValue,dataItem,index){
    var itemId= dataItem.OPTM_PICKLIST_CODE;
     console.log("selected index values");
     if(checkValue==true && !this.selectedPLItems.includes(itemId)){
       this.selectedPLItems.push(itemId);
       this.selectedPLItemsDataForValidate.push(dataItem);
     }else{
       if(checkValue == false && this.selectedPLItems.includes(itemId)){
         this.selectedPLItems.splice(this.selectedPLItems.indexOf(itemId),1);
         this.selectedPLItemsDataForValidate.splice(this.selectedPLItemsDataForValidate.indexOf(this.filterRow(this.selectedPLItemsDataForValidate,itemId),1))
       }
     }
     console.log("selectePI Items:",this.selectedPLItems.length);
  }
  public filterRow(arryData,id): any{
    //var row = arryData.filter(item => item.OPTM_PICKLIST_CODE == id);
    let index = arryData.findIndex(x => x.OPTM_PICKLIST_CODE === id);
    return index;
  }

  validateDataForRelase(dataArray:any): boolean{
    var status = true;
    for(let i=0;i<dataArray.length;i++){ 
      if(dataArray[i].OPTM_STATUS=="2"){
        status = false;
        break;
      }
    }
    return status;
  }

  // need to confirm is this required or not for getting value for update.
  ChangePriority(event, dataItem, companyRowIndex) {
    dataItem.OPTM_PRIORITY = event.target.value
  }
  ChangeUserGroup(event, dataItem, companyRowIndex) {
    dataItem.OPTM_USER_GRP = event.target.value;
  }
  changePlanDateTime(event, dataItem, companyRowIndex){
    dataItem.OPTM_PLANDATETIME = event.target.value;
  }
  updateReleaseStatus(){ 
    if(this.selectedPLItems.length==0){
      this.toastr.error('', this.translate.instant("PL_ReleaseStatusItemsValidate"));
      return;
    }    

    if(!this.validateDataForRelase(this.selectedPLItemsDataForValidate)){
      this.toastr.error('', this.translate.instant("validateRelease"));
      return ;
    }
    this.showLoader = true;
    this.picktaskService.updateReleaseStatusForPickListItems(this.selectedPLItems).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined && data!=null) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }else {
             var result = data.OUTPUT[0].RESULT;
             if(result == "Data Saved")
            this.toastr.success('', this.translate.instant("PL_StatusUpdateSuccess"));
            this.PickItemList = [];
            this.PickTaskList = [];
            this.FillPickListDataInGrid();
          }
         }else{
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
  onArrowBtnClick() {
    this.router.navigate(['home/shipment']);
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }
}
