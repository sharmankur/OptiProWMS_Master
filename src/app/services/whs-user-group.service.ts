import { Injectable } from '@angular/core';
import { Commonservice } from './commonservice.service';
import { HttpClient } from '@angular/common/http';
import { OutRequest } from '../models/outbound/request-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhsUserGroupService {

 public config_params: any;
  public outRequest: OutRequest = new OutRequest();
  constructor(private httpclient: HttpClient, private commonService: Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetWHSList(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForDockDoor", jObject, this.commonService.httpOptions);
  }

  isValidWHS(whsCode:String): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForDockDoor", jObject, this.commonService.httpOptions).toPromise();
  } 

  GetWHSZoneList(whsCode): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID") ,
        OPTM_WHSCODE:whsCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForWarehouseZone", jObject, this.commonService.httpOptions);
  }

  isValidWHSZone(whsZone:String): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/IsValidWarehouseZone", jObject, this.commonService.httpOptions).toPromise();
  }

  GetBinRangeList(whsCode:String): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID") ,
        OPTM_WHSCODE: whsCode    
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForBinRange", jObject, this.commonService.httpOptions);
  }

  isValidBinRange(whsCode:String): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/IsValidBinRange", jObject, this.commonService.httpOptions).toPromise();
  }


  GetAllGroupList(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_TENANTKEY: "T21"      
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForUserGroup", jObject, this.commonService.httpOptions);
  }

  isValidGroup(whsCode:String):Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/IsValidUserGroup", jObject, this.commonService.httpOptions).toPromise();
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
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/InsertIntoWarehouseUserGroup", jObject, this.commonService.httpOptions);
  }
  

  GetDataForWarehouseUserGroupList(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForWarehouseUserGroup", jObject, this.commonService.httpOptions);
  }

  DeleteUserGroup(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/DeleteFromWarehouseUserGroup", jObject, this.commonService.httpOptions);
  }

  updateWhsUserGroup(whsCode:String,whsZone:String,binRange:String,groupPicking:String,groupPacking:String,
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
         OPTM_MODIFIEDBY: localStorage.getItem("UserId")
       }])
     };
     return this.httpclient.post(this.config_params.service_url + "/api/Shipment/UpdateWarehouseUserGroup", jObject, this.commonService.httpOptions);
   }
}
