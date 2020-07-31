import { Injectable } from '@angular/core';
import { Commonservice } from './commonservice.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhsUserGroupService {

 public config_params: any;
  constructor(private httpclient: HttpClient, private commonService: Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetWHSList(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataForDockDoor", jObject, this.commonService.httpOptions);
  }
 
  isValidWHS(whsCode:String): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataForDockDoor", jObject, this.commonService.httpOptions).toPromise();
  } 

  GetWHSZoneList(whsCode): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID") ,
        OPTM_WHSCODE:whsCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataForWarehouseZone", jObject, this.commonService.httpOptions);
  }

  isValidWHSZone(whsCode:String, whsZone:String): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_WHSCODE:  whsCode,
        OPTM_WHSZONE: whsZone

      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidWarehouseZone", jObject, this.commonService.httpOptions).toPromise();
  }

  GetBinRangeList(whsCode:String): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID") ,
        OPTM_WHSCODE: whsCode    
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataForBinRange", jObject, this.commonService.httpOptions);
  }

  isValidBinRange(whsCode:String,binRange:String): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_WHSCODE:whsCode,
        OPTM_BIN_RANGE: binRange
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidBinRange", jObject, this.commonService.httpOptions).toPromise();
  }


  GetAllGroupList(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_TENANTKEY: localStorage.getItem("TenantId")      
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataForUserGroup", jObject, this.commonService.httpOptions);
  }

  isValidGroup(userGroup:String):Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_TENANTKEY: localStorage.getItem("TenantId") ,  
        OPTM_GROUPCODE: userGroup     
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidUserGroup", jObject, this.commonService.httpOptions).toPromise();
  }


  addWhsUserGroup(whsCode:String,whsZone:String,binRange:String,groupPicking:String,groupPacking:String,
   groupPutAway:String, groupReciving:String,groupShipping:String, groupReturn:String,groupMove:String ): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID") ,
        OPTM_WHSCODE: whsCode,
        OPTM_WHSEZONE: whsZone,
        OPTM_BINRANGE: binRange,
        OPTM_USRGRP_PICKING:groupPicking,
        OPTM_USRGRP_PACKING:groupPacking,
        OPTM_USRGRP_PUTAWAY:groupPutAway,
        OPTM_USRGRP_RECEIVING:groupReciving,
        OPTM_USRGRP_SHIPPING: groupShipping,
        OPTM_USRGRP_RETURNS:groupReturn,
        OPTM_USRGRP_MOVE:groupMove,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/InsertIntoWarehouseUserGroup", jObject, this.commonService.httpOptions);
  }
  

  GetDataForWarehouseUserGroupList(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataForWarehouseUserGroup", jObject, this.commonService.httpOptions);
  }

  DeleteUserGroup(optmId: String, whsCode:String,whsZone:String,whsBinRange:String): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        OPTM_ID :optmId,
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_WHSCODE:whsCode,
        OPTM_WHSEZONE:whsZone,
        OPTM_BINRANGE:whsBinRange
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromWarehouseUserGroup", jObject, this.commonService.httpOptions);
  }
  DeleteMultipleUserGroup(data:any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify(data)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromWarehouseUserGroup", jObject, this.commonService.httpOptions);
  }

  updateWhsUserGroup(optm_id:String, whsCode:String,whsZone:String,binRange:String,groupPicking:String,groupPacking:String,
    groupPutAway:String, groupReciving:String,groupShipping:String, groupReturn:String,groupMove:String ): Observable<any> {
     let jObject = {
       Shipment: JSON.stringify([{
        OPTM_ID:optm_id,
         CompanyDBId: localStorage.getItem("CompID") ,
         OPTM_WHSCODE: whsCode,
         OPTM_WHSEZONE: whsZone,
         OPTM_BINRANGE: binRange,
         OPTM_USRGRP_PICKING:groupPicking,
         OPTM_USRGRP_PACKING:groupPacking,
         OPTM_USRGRP_PUTAWAY:groupPutAway,
         OPTM_USRGRP_RECEIVING:groupReciving,
         OPTM_USRGRP_SHIPPING: groupShipping,
         OPTM_USRGRP_RETURNS:groupReturn,
         OPTM_USRGRP_MOVE:groupMove,
         OPTM_MODIFIEDBY: localStorage.getItem("UserId")
       }])
     };
     return this.httpclient.post(this.config_params.service_url + "/api/Masters/UpdateWarehouseUserGroup", jObject, this.commonService.httpOptions);
   }
}
