import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { CommonData } from 'src/app/models/CommonData';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContainerShipmentService } from 'src/app/services/container-shipment.service';

@Component({
  selector: 'app-container-shipment',
  templateUrl: './container-shipment.component.html',
  styleUrls: ['./container-shipment.component.scss']
})
export class ContainerShipmentComponent implements OnInit {

  @Input() ShipId: any;
 // ShipId: any='';
  ContainerCodeId: any='';
  purposeArray: any = [];
  PurposeId: any;
  PurposeValue: any='';
  statusArray: any = [];
  StatusId: any='';
  StatusValue : any ='';
  WarehouseId: any='';
  BinId: any='';
  ContainerTypeId: any='';
  ContainerTypeArray: any = [];
  ShipmentId: any='';
  InvPostStatusArray: any = [];
  InvPostStatusId: any='';
  InvPostStatusValue: any='';
  ContainerItems: any = [];
  serviceData: any[];
  lookupfor: string;
  showLookup: boolean = false;
  showLoader: boolean = false;
  SelectedShipmentId: any = '';
  IsShipment: boolean = false;
  shipeligible: string= '';
  ContainsItemID: any='';
  SelectedRowsforShipmentArr = [];
  commonData: any = new CommonData();

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,private containerCreationService: ContainerCreationService,private router: Router,
    private containerShipmentService: ContainerShipmentService) { }

  ngOnInit() {
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.statusArray = this.commonData.Container_Shipment_Status_DropDown();
    this.InvPostStatusArray = this.commonData.Container_Shipment_Inv_Status_DropDown();

    this.PurposeId = this.purposeArray[0]; 
    this.PurposeValue = this.PurposeId.Value; 
    this.shipeligible = "Y";   

    //this.SelectedShipmentId = localStorage.getItem("ShipmentID");
    //this.SelectedShipmentId = '17'
    this.SelectedShipmentId  = this.ShipId;
    if(this.SelectedShipmentId != undefined && this.SelectedShipmentId != '' && this.SelectedShipmentId != null){
      this.IsShipment = true;
      this.InvPostStatusId = this.InvPostStatusArray[1];
      this.InvPostStatusValue = this.InvPostStatusId.Value;         
    }
    else{
      this.IsShipment = false;
      this.InvPostStatusId = this.InvPostStatusArray[0];
      this.InvPostStatusValue = this.InvPostStatusId.Value;
    } 
    this.fillDataInGridWithShipment();    
  }

  fillDataInGridWithShipment() {    

    this.containerShipmentService.FillContainerDataInGrid(this.SelectedShipmentId, this.ContainerCodeId, this.shipeligible, this.StatusValue, this.ContainerTypeId,
      this.ContainsItemID, this.ShipmentId, this.InvPostStatusValue, this.WarehouseId, this.BinId, this.IsShipment).subscribe(
      (data: any) => {
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
         this.ContainerItems = data;
         for(let i =0; i<this.ContainerItems.length; i++){
           this.ContainerItems[i].Selected = false;
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

  onQueryBtnClick(){
    if(this.PurposeId.Value == '1')
      this.shipeligible = "Y";
    else
      this.shipeligible = "N";
    
    this.fillDataInGridWithShipment();
  }  

  getContainerType(){
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

  onPurposeSelectChange ($event) {
    this.PurposeId = $event.Value;
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
          if(data.length > 0){
            this.showLookup = true;
            this.serviceData = data;
            this.lookupfor = "BinList";
          }
          else{
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
  
  onStatusChange ($event) {
    this.StatusValue = $event.Value;
  }
  
  onInvPostStatusChange ($event) {
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
            this.toastr.error('', this.translate.instant("Invalid Item"));
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

  selectContainerRowChange (isCheck,dataitem,idx){
    if(isCheck){
      this.ContainerItems[idx].Selected = true; 
      //this.SelectedRowsforShipmentArr.push(dataitem.OPTM_CONTAINERID);
    }
    else{
      this.ContainerItems[idx].Selected = true;
      // var index = this.SelectedRowsforShipmentArr.indexOf(dataitem.OPTM_CONTAINERID);
      // if(index > -1)
      // this.SelectedRowsforShipmentArr.splice(index,1);   
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
      else if(this.lookupfor == "CTList") {
        this.ContainerTypeId =  $event[0];
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
