import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { CommonData } from '../../models/CommonData';
import { ContainerCreationService } from '../../services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContainerShipmentService } from '../../services/container-shipment.service';
import { ContainerBatchserialService } from '../../services/container-batchserial.service';
import { GridComponent ,PageChangeEvent} from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-container-batchserial',
  templateUrl: './container-batchserial.component.html',
  styleUrls: ['./container-batchserial.component.scss']
})
export class ContainerBatchserialComponent implements OnInit {

  WarehouseId: any='';
  BinId: any='';
  ContainsItemDD: any= {OPTM_ITEMCODE: '', OPEN_QTY: '', TRACKING: '', SHPSTATUS: ''};
  ContainsItemID: any = '';
  lookupfor: string;
  showLookup: boolean = false;
  showLoader: boolean = false;
  SelectedShipmentId: any = '';
  SelectedWhse: any = '';
  SelectedBin: any = '';
  IsShipment: boolean = false;
  serviceData: any[];
  ContainerBatchSerials: any = [];
  SelectedRowsforShipmentArr = [];
  ShowGridPaging: boolean = false;
  pageSize: number = Commonservice.pageSize;
  RowCount: number = 0;
  SelectedQty: any = 0;
  OpenQty: any = 0;
  ItemOpenQtyArr : any = [];
  ItemCodeArray: any = [];
  TempGridData: any = [];
  ShimpmentArray: any = [];
  Tracking: any = '';
  SHPStatus: any = '';
  commonData: any = new CommonData(this.translate);
  lookupData: any = [];
  BatchSerialData : any = [];
  showOtherLookup: boolean = false;
  isColumnFilterView: boolean = false;
  skip: any = 0;
  SelectedShipmentCode: any = '';
  SelectedShipmentStatus: any = '';
  ContainerOperationArray: any = [];
  SelectedLinkTitle: any = '';
  Selectedlink: number = 2;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,private containerCreationService: ContainerCreationService,private router: Router,
    private containerShipmentService: ContainerShipmentService, private containerBatchserialService: ContainerBatchserialService) { 
      let userLang = navigator.language.split('-')[0];
      userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
      translate.use(userLang);
      translate.onLangChange.subscribe((event: LangChangeEvent) => {            
      //  this.ContainerOperationArray = this.commonData.Container_Shipment_Operations();   
        this.Selectedlink = 2;
       // this.SelectedLinkTitle = this.ContainerOperationArray[0].Name;
      });
    }   

  ngOnInit() {  
    //this.SelectedShipmentId = localStorage.getItem("ShipShipmentID");  
    this.SelectedWhse = localStorage.getItem("ShipWhse"); 
    this.SelectedBin = localStorage.getItem("ShipBin");
    this.ShimpmentArray = JSON.parse(localStorage.getItem("ShipmentArrData"));   
    this.SelectedShipmentId = this.ShimpmentArray[0].OPTM_SHIPMENTID;
    this.SelectedShipmentCode = this.ShimpmentArray[0].OPTM_SHIPMENT_CODE;
    this.SelectedShipmentStatus = this.ShimpmentArray[0].OPTM_SHIPMENT_STATUS;
    this.isColumnFilterView = false;
    if(this.SelectedShipmentId != undefined && this.SelectedShipmentId != '' && this.SelectedShipmentId != null){
      this.IsShipment = true;
    }
    else{
      this.IsShipment = false;
    } 
    this.TempGridData = [];
    this.getContainsItemDD();    
  }

  ngOnDestroy(){
    localStorage.setItem("ShipShipmentID", '');
    localStorage.setItem("ShipWhse", '');
    localStorage.setItem("ShipBin", '');
  }

  setContainerOperation(){
    return this.ContainerOperationArray[Number(this.Selectedlink) - 1].Name;   
  }

  getContainsItemDD(){
    this.ItemCodeArray = [];
    let ItemCodeArray = this.ItemCodeArray;

    this.ShimpmentArray.filter(function(obj){
      let map = {};
      map['OPTM_ITEMCODE'] = obj.OPTM_ITEMCODE; 
      map['OPEN_QTY']  =  parseFloat(obj.OPTM_QTY) - parseFloat(obj.OPTM_QTY_FULFILLED == null ? 0 : obj.OPTM_QTY_FULFILLED);  
      map['TRACKING']  = obj.TRACKING;
      map['SHPSTATUS'] = obj.SHPSTATUS;
      ItemCodeArray.push(map);
    });

    this.ItemCodeArray  = ItemCodeArray;
    this.ContainsItemDD = this.ItemCodeArray[0];
    this.ContainsItemID = this.ItemCodeArray[0].OPTM_ITEMCODE;
    this.OpenQty = Number(this.ItemCodeArray[0].OPEN_QTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));    
    this.Tracking = this.ItemCodeArray[0].TRACKING;
    this.SHPStatus = this.ItemCodeArray[0].SHPSTATUS;
    
    this.fillBatchSerialDataInGrid(1);    
  }  

  GetWhseCode (){
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

  GetBinCode () {
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
          this.showLookup = true;
          this.serviceData = data;         

          this.lookupfor = "BinList";
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
          if(resp.length == 0){
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
          if(resp.length == 0){
            this.toastr.error('', this.translate.instant("Invalid_Bin_Code"));
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

  pageChange(event: PageChangeEvent){
    this.skip = event.skip;
  }

  onUpdateBtnPress(){
    switch (this.Selectedlink) {
      case (2):
        this.onAssignShipmentPress();
        break;
      case (3):
        this.onRemoveShipmentPress();
        break;
      case (4):
        this.ContainerReturned();
        break;                 
    }
  }

  onItemCodeChange($event){
    this.setDataInTempGrid();
    this.ContainsItemID = $event.OPTM_ITEMCODE;
    this.OpenQty = Number($event.OPEN_QTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));    
    this.Tracking = $event.TRACKING;
    this.SHPStatus = $event.SHPSTATUS;
    this.getDataFromTempGrid();   
  }

  getDataFromTempGrid() {
    this.pageChange({skip: 0, take: this.pageSize});
    this.ContainerBatchSerials = [];
    this.skip = 0;
    var index = -1;
    let flag = false;
    if(this.TempGridData.length > 0){
      for(let tempIdx=0; tempIdx<this.TempGridData.length; tempIdx++){
         index = this.TempGridData[tempIdx].findIndex(r=>r.ITEMCODE == this.ContainsItemID);    
         if(index > -1){
          this.ContainerBatchSerials = this.TempGridData[tempIdx];
          if(this.ContainerBatchSerials.length >  this.pageSize){
            this.ShowGridPaging = true;
          }
          else{
            this.ShowGridPaging = false;
          }
          flag = true;
         } 
      } 
      if(!flag){
        this.fillBatchSerialDataInGrid(this.Selectedlink);
        this.SelectedQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
      } 
      else{
        this.SelectedQty = this.ContainerBatchSerials[0].SelectedQty;
      }    
    }
    else{
      this.fillBatchSerialDataInGrid(this.Selectedlink);
    }
  }

  setDataInTempGrid() {
    var index = -1;
    let flag = false;
    if(this.TempGridData.length > 0){
      for(let tempIdx=0; tempIdx<this.TempGridData.length; tempIdx++){
         index = this.TempGridData[tempIdx].findIndex(r=>r.ITEMCODE == this.ContainsItemID);    
         if(index > -1){
           this.TempGridData[tempIdx] = this.ContainerBatchSerials;
           flag = true;           
         } 
      }      
      
      if(!flag){
        this.TempGridData.push(this.ContainerBatchSerials);
      }     
    }
    else{
      this.TempGridData.push(this.ContainerBatchSerials);
    }
  }

  // onQueryBtnClick(){
  //   this.fillBatchSerialDataInGrid();
  // }  

  fillBatchSerialDataInGrid(value){

    this.Selectedlink = value;
    //this.SelectedLinkTitle = this.setContainerOperation();
    this.SelectedLinkTitle = 'A';

    this.pageChange({skip: 0, take: this.pageSize});
    this.isColumnFilterView = false;
    this.ShowGridPaging = false;
    this.showLoader = true;
    this.containerBatchserialService.fillBatchSerialDataInGrid(this.SelectedShipmentId ,this.WarehouseId, this.BinId, 
      this.ContainsItemID, this.SHPStatus, this.Tracking, this.Selectedlink).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.ContainerBatchSerials = data; 
          let ItemCode = this.ContainsItemID;

          if(this.SelectedRowsforShipmentArr.length > 0){
            this.SelectedRowsforShipmentArr = this.SelectedRowsforShipmentArr.filter(val => val.ITEMCODE != ItemCode);
          }

          this.SelectedQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));    
          
          if(this.ContainerBatchSerials.length > this.pageSize){
            this.ShowGridPaging = true;          
          }
          else{
            this.ShowGridPaging = false;
          }
          for(let i =0; i<this.ContainerBatchSerials.length; i++){
            this.ContainerBatchSerials[i].Selected = false;
            this.ContainerBatchSerials[i].AssignQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));             
            this.ContainerBatchSerials[i].QtytoAssign = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision"))); 
            this.ContainerBatchSerials[i].AvailableQty = Number(data[i].AvailableQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));
            this.ContainerBatchSerials[i].SelectedQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
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

  onRemoveShipmentPress(){

    if(this.SelectedRowsforShipmentArr.length == 0){
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }
    
    let tempArray = [];
    for (let i = 0; i < this.SelectedRowsforShipmentArr.length; i++) {

    this.SelectedRowsforShipmentArr[i].QtytoAssign = parseFloat(this.SelectedRowsforShipmentArr[i].QtytoAssign);
    if(this.SelectedRowsforShipmentArr[i].LOTNO == undefined){
      this.SelectedRowsforShipmentArr[i].LOTNO = '';
    } 

    tempArray.push({
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_SHIPMENT_CODE: this.SelectedShipmentCode,
      OPTM_STATUS: this.SelectedShipmentStatus,
      OPTM_ITEMCODE: this.SelectedRowsforShipmentArr[i].ITEMCODE, 
      OPTM_BTCHSER: this.SelectedRowsforShipmentArr[i].LOTNO,
      OPTM_QTY_FULFILLED: this.SelectedRowsforShipmentArr[i].AvailableQty      
    });
   }
    this.containerBatchserialService.RemoveBatchSerialFromShipment(tempArray).subscribe(
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
              if(data[0].RESULT == 'Data Saved'){
                this.toastr.success('', this.translate.instant("Btch_removed_successfully"));
                this.fillBatchSerialDataInGrid(3);
              }
              else{
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

  selectContainerRowChange (checkedselectedvalue, isCheck,dataitem,idx){
    if(isCheck){
      let CalQty = -1;
      // if(this.Selectedlink == 2){
        if(Number(this.OpenQty) == 0){
          this.toastr.error('', this.translate.instant("ZeroOpenQty")); 
          checkedselectedvalue.checked = false;
          return;      
        }
        if(this.Selectedlink == 2){
          CalQty = this.commonData.validateOnCheck(this.SelectedRowsforShipmentArr, dataitem.AvailableQty, this.OpenQty, this.SelectedQty);
        }else{
          CalQty = 0;
        }
        if(CalQty == -1){
          if(this.SelectedRowsforShipmentArr.length == 0)
            this.toastr.error('', this.translate.instant("OpenQtyCheck"));
          else
            this.toastr.error('', this.translate.instant("TotalQtyCheck"));        
          this.ContainerBatchSerials[idx].Selected = false;  
          this.ContainerBatchSerials[idx].AssignQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));    
          this.ContainerBatchSerials[idx].QtytoAssign = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));   
          checkedselectedvalue.checked = false;
          return;
        }
        else{
           this.ContainerBatchSerials[idx].AssignQty = Number(CalQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));    
           this.ContainerBatchSerials[idx].QtytoAssign = Number(CalQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));  
           this.ContainerBatchSerials[idx].Selected = true; 
           this.SelectedRowsforShipmentArr.push(dataitem);
        } 
      // }else{
        // CalQty = 0;
        // this.ContainerBatchSerials[idx].AssignQty = Number(CalQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));    
        // this.ContainerBatchSerials[idx].QtytoAssign = Number(CalQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));  
        // this.ContainerBatchSerials[idx].Selected = true; 
        // this.SelectedRowsforShipmentArr.push(dataitem);
      // }        
    }
    else{
      this.ContainerBatchSerials[idx].Selected = false;
      this.ContainerBatchSerials[idx].AssignQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));  
      this.ContainerBatchSerials[idx].QtytoAssign = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));    

      if(dataitem.LOTNO == undefined){
        for(let i=0; i<this.SelectedRowsforShipmentArr.length; i++){
          if(this.SelectedRowsforShipmentArr[i].ITEMCODE == dataitem.ITEMCODE && this.SelectedRowsforShipmentArr[i].WHSCODE == dataitem.WHSCODE &&
            this.SelectedRowsforShipmentArr[i].BINNO == dataitem.BINNO){
              this.SelectedRowsforShipmentArr.splice(i,1); 
          }
        }        
      }else{
        for(let i=0; i<this.SelectedRowsforShipmentArr.length; i++){
          if(this.SelectedRowsforShipmentArr[i].ITEMCODE == dataitem.ITEMCODE && this.SelectedRowsforShipmentArr[i].WHSCODE == dataitem.WHSCODE &&
            this.SelectedRowsforShipmentArr[i].BINNO == dataitem.BINNO && this.SelectedRowsforShipmentArr[i].LOTNO == dataitem.LOTNO){
              this.SelectedRowsforShipmentArr.splice(i,1); 
          }
        } 
      }   
     }

     let array = this.SelectedRowsforShipmentArr.filter(val => val.ITEMCODE == this.ContainsItemID);
     var sum = array.reduce(function(a, b){
      return a + parseFloat(b.AssignQty);
      }, 0);
     this.SelectedQty = Number(sum).toFixed(Number(localStorage.getItem("DecimalPrecision")));   
    
     for(let upIdx=0; upIdx<this.ContainerBatchSerials.length; upIdx++){
      this.ContainerBatchSerials[upIdx].SelectedQty = this.SelectedQty;
    } 
  }

  onAssignShipmentPress(){

    if(this.SelectedRowsforShipmentArr.length == 0){
      this.toastr.error('', this.translate.instant("Select_row"));
      return;
    }

    for(let rowIdx=0; rowIdx<this.SelectedRowsforShipmentArr.length; rowIdx++){
      if(this.SelectedRowsforShipmentArr[rowIdx].AssignQty == '' || this.SelectedRowsforShipmentArr[rowIdx].AssignQty == Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision"))) || this.SelectedRowsforShipmentArr[rowIdx].AssignQty == undefined){
        this.toastr.error('', this.translate.instant("Enter_Assigned_Qty"));
        return;
      } 
    }

    this.showLoader = true;
    //this.SelectedRowsforShipmentArr = this.SelectedRowsforShipmentArr.filter(val => val.AssignQty != Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision"))));   

    let oSaveData:any = {};
    oSaveData.SelectedRows = [];
    oSaveData.OtherData = [];

    oSaveData.OtherData.push({
      CompanyDBId: localStorage.getItem("CompID"),
      ContnrShipmentId: this.SelectedShipmentId,
      OPTM_CREATEDBY: localStorage.getItem("UserId")
    })

    for(let i=0; i<this.SelectedRowsforShipmentArr.length; i++){   
      this.SelectedRowsforShipmentArr[i].QtytoAssign = parseFloat(this.SelectedRowsforShipmentArr[i].QtytoAssign);
      if(this.SelectedRowsforShipmentArr[i].LOTNO == undefined){
        this.SelectedRowsforShipmentArr[i].LOTNO = '';
      }
      oSaveData.SelectedRows.push(this.SelectedRowsforShipmentArr[i]);
    }

    this.containerBatchserialService.AssignMaterialToShipment(oSaveData).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data.length > 0){           
            if(data[0].RESULT == 'Shipment updated'){
             // this.toastr.success('', this.translate.instant("Materials_assigned_successfully"));
              this.toastr.success('', data[0].RESULT);
              this.SelectedRowsforShipmentArr = [];
              this.TempGridData = [];
              let OpenQty = this.OpenQty - this.SelectedQty;
              this.OpenQty = Number(OpenQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));
              this.fillBatchSerialDataInGrid(2);
            }
            else{
              if(data[0].RESULT != '' && data[0].RESULT != null){
                this.toastr.error('', data[0].RESULT);
              }
              else{
                this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
              }
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

  onAssignedQtyChange(value,rowindex) {

    if(value == '' || value == undefined || value == null){
      value = 0;
    }

    let qtyValue = parseFloat(value);

    // if(qtyValue == 0){
    //  this.ContainerBatchSerials[rowindex].Selected = false;    
    //   if(this.SelectedRowsforShipmentArr.length > 0){
    //     this.SelectedRowsforShipmentArr = this.SelectedRowsforShipmentArr.filter(val => val.AssignQty != Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision"))));
    //   }
    // }
    
    let IsValid = this.commonData.validateOnChange(qtyValue, this.ContainerBatchSerials[rowindex].AvailableQty,this.OpenQty, this.SelectedQty);  

    if(IsValid){
      this.ContainerBatchSerials[rowindex].AssignQty = Number(qtyValue).toFixed(Number(localStorage.getItem("DecimalPrecision")));
      this.ContainerBatchSerials[rowindex].QtytoAssign = Number(qtyValue).toFixed(Number(localStorage.getItem("DecimalPrecision")));  
    }
    else{
      this.toastr.error('',this.translate.instant("QtyCheck"));
      this.ContainerBatchSerials[rowindex].AssignQty = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));    
      this.ContainerBatchSerials[rowindex].QtytoAssign = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));  
      return;
    } 

    let array = this.SelectedRowsforShipmentArr.filter(val => val.ITEMCODE == this.ContainsItemID);
    var sum = array. reduce(function(a, b){
     return a + parseFloat(b.AssignQty);
     }, 0);
    this.SelectedQty = Number(sum).toFixed(Number(localStorage.getItem("DecimalPrecision"))); 

    for(let upIdx=0; upIdx<this.ContainerBatchSerials.length; upIdx++){
      this.ContainerBatchSerials[upIdx].SelectedQty = this.SelectedQty;
    }    
  }

  getLotNoInventoryData(WHSE,Bin){
    this.showLoader = true;
    this.containerBatchserialService.getLotNoInventoryData(WHSE,Bin).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }          
          this.BatchSerialData = data.BatchWiseInventory;        

          for(let i=0; i<this.BatchSerialData.length;i++){
            this.BatchSerialData[i].Quantity = Number(this.BatchSerialData[i].Quantity).toFixed(Number(localStorage.getItem("DecimalPrecision"))),
            this.BatchSerialData[i].Selected = false;
          }

          this.lookupData = this.BatchSerialData;
          this.lookupfor = "BatchSerialList";
          this.showLookup = false;
          this.showOtherLookup = true;
                   
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

  onShowButtonClick(event, index){
    let WHSE = event.WHSCODE;
    let Bin = event.BINNO;
    this.lookupData = [];
    this.getLotNoInventoryData(WHSE,Bin);
  }

  getLookupKey($event) {    
    this.showOtherLookup = false;
    this.showLookup = false;
    if($event.length == 0){
     //alert(1);
    }
    var code = $event[0].ITEMCODE;    
  }

  getLookupDataValue($event) {
    this.showOtherLookup = false;
    this.showLookup = false;

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
      // else if(this.lookupfor == "ContainsItem"){
      //   this.ContainsItemID =  $event.OPTM_ITEMCODE;
      // }      
     }
  }

  onArrowBtnClick() {
    if(this.SelectedRowsforShipmentArr.length > 0){
      this.event = event;
      this.dialogFor = "DataLost";
      this.yesButtonText = this.translate.instant("yes");
      this.noButtonText = this.translate.instant("no");
      this.showConfirmDialog = true;
      this.dialogMsg = this.translate.instant("SelectionLostMsg");
    } else {
      this.router.navigate(['home/shipment']);
    }
  }

  onCancelClick () {
    this.router.navigate(['home/dashboard']);
  }

  numberDecimalOnly(event){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onFilterChange(checkBox:any,grid:GridComponent){
    if(checkBox.checked==false){
      this.clearFilter(grid);
    }
  }

  clearFilter(grid:GridComponent){      
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
                this.fillBatchSerialDataInGrid(this.Selectedlink);
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

  showConfirmDialog: boolean = false;
  dialogMsg: string;
  yesButtonText: string;
  noButtonText: string;
  dialogFor: string;
  event: any = [];
  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("DataLost"):
          this.router.navigate(['home/shipment']);
          break;
        case ("Cancel"): {
          this.router.navigate(['home/dashboard']);
          break;
        }
      }
    } else {
      if ($event.Status == "no") {
        // switch ($event.From) {
        //   case ("Cancel"):
        //     break;
        // }
      }
    }
  }
}
