import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ContainerGroupService } from 'src/app/services/container-group.service';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { WhsUserGroupService } from 'src/app/services/whs-user-group.service';
import { WhsUGMappingMasterComponent } from '../whs-ugmapping-master/whs-ugmapping-master.component';

@Component({
  selector: 'app-wmsugmapping-add-update',
  templateUrl: './wmsugmapping-add-update.component.html',
  styleUrls: ['./wmsugmapping-add-update.component.scss']
})
export class WMSUGMappingAddUpdateComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  groupData: any[];
  groupDataFor: any;
  lookupfor: string;
  showLoader: boolean = false;

  showLookup: boolean = false;


  whsCode: any ='';
  whsName: any='';
  pickingGroup: any='';
  packingGroup: any='';
  putAwayGroup: any='';
  receivingGroup: any='';
  shippingGroup: any='';
  returnGroup: any='';
  moveGroup: any='';
  binRange: any='';
  whsZone: any='';
  isValidateCalled: boolean = false; 
  UGM_ROW: any;
  BtnTitle: string;
  forUpdate: boolean = false;
  isUpdate: boolean = false;

  constructor(private whsUGMappingMasterComponent:WhsUGMappingMasterComponent,private translate: TranslateService,private commonservice: Commonservice,
     private toastr: ToastrService,  private router: Router, private userGroupMappingService: WhsUserGroupService,
     private containerCreationService: ContainerCreationService) { 
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    let UGMRow = localStorage.getItem("UGMapping_ROW")
    if (UGMRow != undefined && UGMRow != "") {
      this.UGM_ROW = JSON.parse(localStorage.getItem("UGMapping_ROW"));
    }
    
    if (localStorage.getItem("UGAction") == "copy") {
      this.isUpdate = false;
      this.BtnTitle = this.translate.instant("CT_Add");
      this.prepareAndSetDataForUpdateAndCopy();
    } else if (localStorage.getItem("UGAction") == "update") {
      this.isUpdate = true;
      this.BtnTitle = this.translate.instant("CT_Update");
      this.prepareAndSetDataForUpdateAndCopy()
    } else if (localStorage.getItem("UGAction") == "add") {
      this.BtnTitle = this.translate.instant("CT_Add");
      this.isUpdate = false;
      this.resetForm();
    } else {
      this.BtnTitle = this.translate.instant("CT_Add");
      this.isUpdate = false;
    }
  }
 
  prepareAndSetDataForUpdateAndCopy(){
    var $event = JSON.parse(localStorage.getItem("UGMapping_ROW"));
    this.whsCode = $event[0];
    this.whsZone = $event[1];
    this.binRange = $event[2];
    this.pickingGroup = $event[3];
    this.packingGroup = $event[4];
    this.putAwayGroup = $event[5];
    this.receivingGroup = $event[6];
    this.shippingGroup = $event[7];
    this.returnGroup = $event[8];
    this.moveGroup = $event[9];
  }
  GetWhseCode() {
    this.showLoader = true;
    this.commonservice.GetWhseCode().subscribe(
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
          this.lookupfor = "WareHouse";
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

  onWhseChangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.OnWhsCodeChange();
  }


  async OnWhsCodeChange() {
    if (this.whsCode == undefined || this.whsCode == "") {
      return;
    }
    this.showLookup = false;
    var result = false;
    await this.containerCreationService.IsValidWhseCode(this.whsCode).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.whsCode = '';
          this.whsZone = '';
          this.binRange = '';
        } else {
          this.whsCode = resp[0].WhsCode;
          this.whsName = resp[0].WhsName;
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


  
  GetBinRange() { 
    if(this.whsCode==undefined && this.whsCode==null || this.whsCode==""){
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
     return;
    }
    this.showLoader = true;
    this.userGroupMappingService.GetBinRangeList(this.whsCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data.length == 0){
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));

          }else{
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "BinRangeList";
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



  onBinRangeBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.OnBinRangeChange();
  }


  async OnBinRangeChange() {
    if (this.binRange == undefined || this.binRange == "") {
      return;
    }
    if(this.whsCode==undefined && this.whsCode==null || this.whsCode==""){
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
     return;
    }
    this.showLookup = false;
    var result = false;
    await this.userGroupMappingService.isValidBinRange(this.whsCode,this.binRange).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidBinRangeErrorMsg"));
          this.binRange = ''
        } else {
          this.binRange = resp[0]
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



  requiredFieldValidation(): boolean{
    if(this.whsCode==undefined && this.whsCode==null || this.whsCode==""){
      this.toastr.error('', this.translate.instant("SelectWhsCode"));
     return false;
    }
    // if(this.whsZone==undefined && this.whsZone==null || this.whsZone==""){
    //   this.toastr.error('', this.translate.instant("SelectWhsZone"));
    //  return false;
    // }
    if(this.binRange==undefined && this.binRange==null || this.binRange==""){
      this.toastr.error('', this.translate.instant("SelectBinRange"));
     return false;
    }
    return true;
  }

 
  GetDataForWhsZone() { 
    if(this.whsCode==undefined && this.whsCode==null || this.whsCode==""){
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
     return;
    }
    this.showLoader = true;
    this.userGroupMappingService.GetWHSZoneList(this.whsCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data.length == 0){
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          }else{
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "WhsZoneList";
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

 

  onWhsZoneBlur() {
    if (this.isValidateCalled) {
      return
    }
    this.OnWhsZoneChange();
  }


  async OnWhsZoneChange() {
    if (this.whsZone == undefined || this.whsZone == "") {
      return;
    }
    if(this.whsCode==undefined && this.whsCode==null || this.whsCode==""){
      this.toastr.error('', this.translate.instant("SelectWhsCodeFirst"));
     return;
    }
    this.showLookup = false;
    var result = false;
    await this.userGroupMappingService.isValidWHSZone(this.whsCode,this.whsZone).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsZoneErrorMsg"));
          this.whsZone = ''
        } else {
          this.whsZone = resp[0]
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






  forWhich: Number;
  GetDataForAllGroup(index) {
    this.forWhich = index;
    this.showLoader = true;
    this.userGroupMappingService.GetAllGroupList().subscribe(
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
          this.lookupfor = "GroupCode";
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


  onAllGroupCodeBlur(index) {
    if (this.isValidateCalled) {
      return
    }
    this.OnGroupCodeChange(index);
  }


  async OnGroupCodeChange(index) {
    if(!this.validateGrouptype(index)){
       return;
    }
    this.showLookup = false;
    var result = false;
    await this.userGroupMappingService.isValidGroup(this.getGroupValueByIndex(index)).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.resetGroupValueByIndex(index);
        } else {
          // assign value.
          this.assignValueForGroup(index,resp[0].OPTM_GROUPCODE);
          
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
  
  public validateGrouptype(index: Number): boolean {
    switch (index) {
      case 1:
        if (this.pickingGroup == undefined || this.pickingGroup == "") {
          return false;
        }
        break;
      case 2:
        if (this.packingGroup == undefined || this.packingGroup == "") {
          return false;
        }
        break;
      case 3:
        if (this.putAwayGroup == undefined || this.putAwayGroup == "") {
          return false;
        }
        break;
      case 4:
        if (this.receivingGroup == undefined || this.receivingGroup == "") {
          return false;
        }
        break;
      case 5:
        if (this.shippingGroup == undefined || this.shippingGroup == "") {
          return false;
        }
        break;
      case 6:
        if (this.returnGroup == undefined || this.returnGroup == "") {
          return false;
        }
        break;
      case 7:
        if (this.moveGroup == undefined || this.moveGroup == "") {
          return false;
        }
        break;
    }
    return true;
  }


  public assignValueForGroup(index: Number, value:any){
    switch (index) {
      case 1:
        this.pickingGroup = value;
        break;
      case 2:
        this.packingGroup = value;
        break;
      case 3:
        this.putAwayGroup = value;
        break;
      case 4:
        this.receivingGroup = value;
        break;
      case 5:
        this.shippingGroup = value;
        break;
      case 6:
        this.returnGroup = value;
        break;
      case 7:
        this.moveGroup = value;
        break;
    }
  }

  public getGroupValueByIndex(index: Number):any{
    switch (index) {
      case 1:
        return this.pickingGroup;
      case 2:
        return this.packingGroup;
      case 3:
        return this.putAwayGroup;
      case 4:
        return this.receivingGroup;
      case 5:
        return this.shippingGroup;
      case 6:
        return this.returnGroup;
      case 7:
        return this.moveGroup;
    }
  }
  public resetGroupValueByIndex(index: Number):any{
    switch (index) {
      case 1:
        this.pickingGroup ="";
        this.toastr.error('', this.translate.instant("InvalidPickingGroupErrorMsg"));
        break;
      case 2:
        this.packingGroup ="";
        this.toastr.error('', this.translate.instant("InvalidPackingGroupErrorMsg"));
        break;
      case 3:
        this.putAwayGroup ="";
        this.toastr.error('', this.translate.instant("InvalidPutawayGroupErrorMsg"));
        break;
      case 4:
        this.receivingGroup ="";
        this.toastr.error('', this.translate.instant("InvalidReceivingGroupErrorMsg"));
        break;
      case 5:
        this.shippingGroup ="";
        this.toastr.error('', this.translate.instant("InvalidShippingGroupErrorMsg"));
        break;
      case 6:
        this.returnGroup ="";
        this.toastr.error('', this.translate.instant("InvalidReturnsGroupErrorMsg"));
        break;
      case 7:
        this.moveGroup ="";
        this.toastr.error('', this.translate.instant("InvalidMoveGroupErrorMsg"));
        break;
    }
  }

  getLookupValue($event) {
    if ($event != null && $event == "close") {
      //nothing to do
      return;
    }
    else  if (this.lookupfor == "WareHouse") {
        this.whsCode = $event[0];
        this.whsName = $event[1];
        this.whsZone = ""
      }else if(this.lookupfor == "GroupCode"){
        this.assignValueForGroup(this.forWhich,$event[0]);
      } else if(this.lookupfor == "BinRangeList"){
        this.binRange = $event[1];
      } else if(this.lookupfor== "WhsZoneList"){
        this.whsZone = $event[1];
      }
    }

    getGridItemClick($event){
      this.whsCode = $event[0];
      this.whsZone = $event[1];
      this.binRange = $event[2];
      this.pickingGroup = $event[3];
      this.packingGroup = $event[4];
      this.putAwayGroup = $event[5];
      this.receivingGroup = $event[6];
      this.shippingGroup = $event[7];
      this.returnGroup = $event[8];
      this.moveGroup = $event[9];
      this.forUpdate =true;
      console.log("list Items:", this.groupData.length);
      this.groupDataFor = "groupData"
      this.groupData = this.groupData;
          this.GetDataForWarehouseUserGroupList();
     // this.onUpdateClick();
    }

   onUpdateClick(){
     // validation code will be here
     if(!this.requiredFieldValidation())return;
    this.showLoader = true;
    this.userGroupMappingService.updateWhsUserGroup(this.whsCode,this.whsZone,this.binRange,
      this.pickingGroup,this.packingGroup,this.putAwayGroup,
      this.receivingGroup,this.shippingGroup,this.returnGroup,this.moveGroup).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          } 
          if(data.length>0 && data[0].RESULT=="Data Saved"){
            
            this.toastr.success('', this.translate.instant("UpdatedSuccessfullyErrorMsg"));
            //this.resetForm();
            this.whsUGMappingMasterComponent.WhsUGComponent = 1;
            //this.GetDataForWarehouseUserGroupList();
          }else  if(data.length>0 && data[0].RESULT=="Data Not Saved"){
            this.toastr.error('', "Data Not Saved");
          }else{

          }
            //something went wrong
          //  this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"))
         
         
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
   OnAddUpdateClick(){
     if(this.isUpdate){
       this.onUpdateClick()
     }else{
       this.OnAddClick();
     }
   }


    OnAddClick(){
    // validate all fields.
    if(!this.requiredFieldValidation())return;
    this.showLoader = true;
    this.userGroupMappingService.addWhsUserGroup(this.whsCode,this.whsZone,this.binRange,
      this.pickingGroup,this.packingGroup,this.putAwayGroup,
      this.receivingGroup,this.shippingGroup,this.returnGroup,this.moveGroup).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          } 
          if (data.length > 0 && data[0].RESULT == "Data Saved") {

            this.toastr.success('', this.translate.instant("AddedSuccessfullyErrorMsg"));
            this.resetForm();
            this.GetDataForWarehouseUserGroupList();
              this.whsUGMappingMasterComponent.WhsUGComponent = 1;
          } else if (data.length > 0 && data[0].RESULT == "Data Already Exists") {
            this.toastr.error('', this.translate.instant("UserGroupAlreadyExists"));

          } else {

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
  

    GetDataForWarehouseUserGroupList() {
      this.showLoader = true;
      this.userGroupMappingService.GetDataForWarehouseUserGroupList().subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }
            this.groupDataFor = "groupData"
            this.groupData = data;
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


   resetForm(){
    
    this.whsCode  ='';
    this.whsName='';
    this.pickingGroup='';
    this.packingGroup='';
    this.putAwayGroup='';
    this.receivingGroup='';
    this.shippingGroup='';
    this.returnGroup='';
    this.moveGroup='';
    this.binRange='';
    this.whsZone='';
   }

  onCancelClick() {
    this.whsUGMappingMasterComponent.WhsUGComponent = 1;
  }


  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }
  onDeleteRowClick(event){
    var whsCode = event[0];
    var whsZone = event[1];
    var whsBinRange = event[2];
    this.deleteUserGroupListRow(whsCode,whsZone,whsBinRange);
    //this.DeleteFromDockDoor(ddDeleteArry);
  }

 
  
  OnDeleteSelected(event){
    if(event.length <= 0){
      this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
      return;
    }
    var ddDeleteArry: any[] = [];
    for(var i=0; i<event.length; i++){
      ddDeleteArry.push({
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_WHSCODE: event[i].OPTM_WHSCODE,
        OPTM_WHSEZONE: event[i].OPTM_WHSEZONE,
        OPTM_BINRANGE: event[i].OPTM_BINRANGE,
      });
    }
    this.deleteMultipleRows(ddDeleteArry);
    //this.DeleteFromDockDoor(ddDeleteArry);
  }
  onCopyItemClick($event) {

    this.whsCode = $event[0];
    this.whsZone = $event[1];
    this.binRange = $event[2];
    this.pickingGroup = $event[3];
    this.packingGroup = $event[4];
    this.putAwayGroup = $event[5];
    this.receivingGroup = $event[6];
    this.shippingGroup = $event[7];
    this.returnGroup = $event[8];
    this.moveGroup = $event[9];
    this.forUpdate =false;
    console.log("list Items:", this.groupData.length);
  
  }

  deleteUserGroupListRow(whsCode:String, whsZone:String, binRange:String) {
    this.showLoader = true;
    this.userGroupMappingService.DeleteUserGroup(whsCode,whsZone,binRange).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
        
        
          if(data.length>0 && data[0].RESULT=="Data Saved"){
            this.toastr.success('', this.translate.instant("DeletedSuccessfullyErrorMsg"));
            this.resetForm();
            this.groupData = [];
            this.groupDataFor = ''
            this.GetDataForWarehouseUserGroupList();
          }else{
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

  deleteMultipleRows(data:any) {
    this.showLoader = true;
    this.userGroupMappingService.DeleteMultipleUserGroup(data).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
        
        
          if(data.length>0 && data[0].RESULT=="Data Saved"){
            this.toastr.success('', this.translate.instant("DeletedSuccessfullyErrorMsg"));
            this.resetForm();
            this.groupData = [];
            this.groupDataFor = ''
            this.GetDataForWarehouseUserGroupList();
          }else{
            if(data.length>0 && data[0].RESULT=="Data Not Saved"){
              this.toastr.error('', this.translate.instant("UnableToDeleteErrorMsg"));
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
