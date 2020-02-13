import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ContainerGroupService } from 'src/app/services/container-group.service';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { WhsUserGroupService } from 'src/app/services/whs-user-group.service';

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
  constructor(private translate: TranslateService,private commonservice: Commonservice,
     private toastr: ToastrService,  private router: Router, private userGroupMappingService: WhsUserGroupService,
     private containerCreationService: ContainerCreationService) { 
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    this.GetDataForWarehouseUserGroupList();
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
          this.whsCode = ''
        } else {
          this.whsCode = resp[0].WhsCode
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
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "BinRangeList";
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
    await this.userGroupMappingService.isValidBinRange(this.whsCode).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.whsCode = ''
        } else {
          this.whsCode = resp[0].WhsCode
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
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "WhsZoneList";
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
    await this.userGroupMappingService.isValidBinRange(this.whsCode).then(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.whsZone = ''
        } else {
          this.whsZone = resp[0].WhsCode
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
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.whsCode = ''
        } else {
          this.whsCode = resp[0].WhsCode
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
        this.packingGroup;
      case 3:
        this.putAwayGroup;
      case 4:
        this.receivingGroup;
      case 5:
        this.shippingGroup;
      case 6:
        this.returnGroup;
      case 7:
        this.moveGroup;
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
      }else if(this.lookupfor == "GroupCode"){
        this.assignValueForGroup(this.forWhich,$event[0]);
      } else if(this.lookupfor == "BinRangeList"){
        this.binRange = $event[0];
      } else if(this.lookupfor== "WhsZoneList"){
        this.whsZone = $event[0];
      }
    }

    OnAddClick(){
    // validate all fields.

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
          this.GetDataForWarehouseUserGroupList();
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
















  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }
  onDeleteRowClick(event){
    var ddDeleteArry: any[] = [];
      ddDeleteArry.push({
        OPTM_DOCKDOORID: event[0],
        CompanyDBId: localStorage.getItem("CompID")
      });
    //this.DeleteFromDockDoor(ddDeleteArry);
  }

  onCopyItemClick(event) {
    localStorage.setItem("DD_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    //this.ddmainComponent.ddComponent = 2;
  }
  
  OnDeleteSelected(event){
    if(event.length <= 0){
      this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
      return;
    }
    var ddDeleteArry: any[] = [];
    for(var i=0; i<event.length; i++){
      ddDeleteArry.push({
        OPTM_DOCKDOORID: event[i].OPTM_DOCKDOORID,
        CompanyDBId: localStorage.getItem("CompID")
      });
    }
    //this.DeleteFromDockDoor(ddDeleteArry);
  }
}
