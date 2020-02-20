import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { CommonData } from 'src/app/models/CommonData';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContainerShipmentService } from 'src/app/services/container-shipment.service';
import { ContainerBatchserialService } from 'src/app/services/container-batchserial.service';

@Component({
  selector: 'app-container-batchserial',
  templateUrl: './container-batchserial.component.html',
  styleUrls: ['./container-batchserial.component.scss']
})
export class ContainerBatchserialComponent implements OnInit {

  WarehouseId: any='';
  BinId: any='';
  ContainsItemID: any='';
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
  commonData: any = new CommonData();

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,private containerCreationService: ContainerCreationService,private router: Router,
    private containerShipmentService: ContainerShipmentService, private containerBatchserialService: ContainerBatchserialService) { }   

  ngOnInit() {   
    this.SelectedShipmentId = localStorage.getItem("ShipShipmentID");  
    this.SelectedWhse = localStorage.getItem("ShipWhse"); 
    this.SelectedBin = localStorage.getItem("ShipBin");   
    if(this.SelectedShipmentId != undefined && this.SelectedShipmentId != '' && this.SelectedShipmentId != null){
      this.IsShipment = true;
    }
    else{
      this.IsShipment = false;
    } 
    //this.fillBatchSerialDataInGrid();
  }

  ngOnDestroy(){
    localStorage.setItem("ShipShipmentID", '');
    localStorage.setItem("ShipWhse", '');
    localStorage.setItem("ShipBin", '');
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
            this.toastr.error('', this.translate.instant("Invalid warehouse"));
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

  onContainsItemChange() {
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
          if(data.length == 0){
            this.toastr.error('', this.translate.instant("Invalid Item Code"));
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

  onQueryBtnClick(){
    if(this.ContainsItemID == '' || this.ContainsItemID == undefined){
      this.toastr.error('', "Select Item Code");
    }    
    
    this.fillBatchSerialDataInGrid();
  }  

  fillBatchSerialDataInGrid(){

    //this.showLoader = true;
    this.containerBatchserialService.fillBatchSerialDataInGrid(this.SelectedShipmentId ,this.WarehouseId, this.BinId, this.ContainsItemID).subscribe(
      (data: any) => {
       // this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.ContainerBatchSerials = data;   
          for(let i =0; i<this.ContainerBatchSerials.length; i++){
            this.ContainerBatchSerials[i].Selected = false;
          }      
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
       // this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  selectContainerRowChange (isCheck,dataitem,idx){
    if(isCheck){
      this.ContainerBatchSerials[idx].Selected = true; 
      this.SelectedRowsforShipmentArr.push(dataitem);
    }
    else{
      this.ContainerBatchSerials[idx].Selected = false;
      // var index = this.SelectedRowsforShipmentArr.indexOf(dataitem.OPTM_CONTAINERID);
      // if(index > -1)
      // this.SelectedRowsforShipmentArr.splice(index,1);   
     }
  }

  onAssignShipmentPress(){

    if(this.SelectedRowsforShipmentArr.length == 0){
      this.toastr.error('', "Select row");
      return;
    }

    let oSaveData:any = {};
    oSaveData.SelectedRows = [];
    oSaveData.OtherData = [];

    oSaveData.OtherData.push({
      CompanyDBId: localStorage.getItem("CompID"),
      ContnrShipmentId: this.SelectedShipmentId,
      OPTM_CREATEDBY: localStorage.getItem("UserId")
    })

    for(let i=0; i<this.SelectedRowsforShipmentArr.length; i++){      
      oSaveData.SelectedRows.push(this.SelectedRowsforShipmentArr[i])
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
            if(data[0].RESULT != '' && data[0].RESULT != null){
              this.toastr.error('', data[0].RESULT);
            }
            else{
              this.toastr.success('', "Materials assigned to shipment successfully");
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

  onAssignedQtyChange(value,rowindex) {

    let qtyValue = parseInt(value);

    if(qtyValue == 0 || qtyValue == undefined || qtyValue == null){
      this.toastr.error('', "Enter Assign Quantity");
      return;
    }

    if(qtyValue > this.ContainerBatchSerials[rowindex].AvailableQty){
      this.toastr.error('', "Assigned Quantity cannot be greater than Available Quantity at row - " + rowindex);
      return;
    }
    else{
      this.ContainerBatchSerials[rowindex].QtytoAssign = qtyValue;
    }  
  }

  getLookupValue($event) {
    if ($event != null && $event == "close") {
      return;
    }
    else {     
       if (this.lookupfor == "WareHouse") {
        this.WarehouseId = $event[0];
       } 
      else if (this.lookupfor == "BinList") {
        this.BinId = $event[0];
      }    
      else if(this.lookupfor == "ContainsItem"){
        this.ContainsItemID =  $event[0];
      }
      
     }
  }

  onArrowBtnClick() {
    this.router.navigate(['home/shipment']);
  }

  onCancelClick () {
    this.router.navigate(['home/dashboard']);
  }

}
