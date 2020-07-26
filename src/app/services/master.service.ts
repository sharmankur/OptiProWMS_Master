import { Injectable } from '@angular/core';
import { OutRequest } from '../models/outbound/request-model';
import { Commonservice } from './commonservice.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  
  public config_params: any;
  public outRequest: OutRequest = new OutRequest();

  constructor(private httpclient: HttpClient,private commonService:Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }
   
  //=============================== methods for bin range layout==================================  
  /**
   * this method checks bin rule is valid or not.
   * @param whsRule 
   * @param whsCode 
   * @param whsZone 
   * @param purspose 
   */
  IsValidBinRule(whsRule: String, whsCode: string, whsZone: number, purspose:String): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_WHS_RULE: whsRule,
        OPTM_WHSCODE: whsCode, 
        OPTM_WHS_ZONE: whsZone,
        OPTM_PURPOSE: purspose
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidWareHouseBinRule", jObject, this.commonService.httpOptions).toPromise();
  }

  /**
   * This method is used to create a bin range.
   * @param OPTM_BIN_RANGE 
   * @param OPTM_WHSCODE 
   * @param OPTM_FROM_BIN 
   * @param OPTM_TO_BIN 
   * @param OPTM_RANGE_DESC 
   */
  InsertIntoWareHouseBinRange(OPTM_BIN_RANGE: string, OPTM_WHSCODE, OPTM_FROM_BIN, OPTM_TO_BIN, OPTM_RANGE_DESC): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_BIN_RANGE: OPTM_BIN_RANGE,
        OPTM_WHSCODE: OPTM_WHSCODE, 
        OPTM_FROM_BIN: OPTM_FROM_BIN,
        OPTM_TO_BIN: OPTM_TO_BIN,
        OPTM_RANGE_DESC: OPTM_RANGE_DESC,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      }])
    };  
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/InsertIntoWareHouseBinRange", jObject, this.commonService.httpOptions);
  }

  /**
   * This method is used to update bin range.
   * @param OPTM_BIN_RANGE 
   * @param OPTM_WHSCODE 
   * @param OPTM_FROM_BIN 
   * @param OPTM_TO_BIN 
   * @param OPTM_RANGE_DESC 
   */
  UpdateWareHouseBinRange(OPTM_BIN_RANGE, OPTM_WHSCODE, OPTM_FROM_BIN, OPTM_TO_BIN, OPTM_RANGE_DESC): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_BIN_RANGE: OPTM_BIN_RANGE,
        OPTM_WHSCODE: OPTM_WHSCODE, 
        OPTM_FROM_BIN: OPTM_FROM_BIN,
        OPTM_TO_BIN: OPTM_TO_BIN,
        OPTM_RANGE_DESC: OPTM_RANGE_DESC,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      }])
    };      
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/UpdateWareHouseBinRange", jObject, this.commonService.httpOptions);
  }

  /**
  * This method used to delete bin range records.
  * @param ddDeleteArry 
  */
  DeleteFromBinranges(ddDeleteArry: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(ddDeleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromWareHouseBinRange", jObject, this.commonService.httpOptions);
  }

  //=============================== methods for warehouse bin layout==================================
  /**
  * This method is used to get warehouse bin layout detail list.
  */
  GetDataWareHouseMaster(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataWareHouseMaster", jObject, this.commonService.httpOptions);
  }
  /**
   * This method deletes the selected warehouse bins.
   * @param deleteArry 
   */
  DeleteWhseBinLayout(deleteArry: any[]): Observable<any>{
    var jObject = { Shipment: JSON.stringify(deleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromWareHouseMaster", jObject, this.commonService.httpOptions);
  }
  /**
   * This method is used to create a new warehouse bin layout record.
   * @param shipmentModel 
   */
  InsertIntoWareHouseMaster(shipmentModel: any): Observable<any>{
    let jObject = {
      Shipment: JSON.stringify(shipmentModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/InsertIntoWareHouseMaster", jObject, this.commonService.httpOptions);
  }
  /**
   * This method check the passed whsecode is valid or not.
   * @param whsecode 
   */
  IsValidWareHouseMaster(whsecode: any): Observable<any>{
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_WHSCODE: whsecode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidWareHouseMaster", jObject, this.commonService.httpOptions);
  }
 
  /**
   * THis method is used to update warehouse bin layout record.
   * @param shipmentModel 
   */
  UpdateWareHouseMaster(shipmentModel: any): Observable<any>{
    let jObject = {
      Shipment: JSON.stringify(shipmentModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/UpdateWareHouseMaster", jObject, this.commonService.httpOptions);
  }
   

  GetDataForBinRuleList(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataWareHouseBinRule", jObject, this.commonService.httpOptions);
  }
  
  // repeated method at binrule and bin range need to test
  //IsValidBinRule(whsRule: String, whsCode: string, whsZone: number, purspose:String): Promise<any> {
  //   let jObject = {
  //     Shipment: JSON.stringify([{
  //       CompanyDBId: localStorage.getItem("CompID"),
  //       OPTM_WHS_RULE: whsRule,
  //       OPTM_WHSCODE: whsCode, 
  //       OPTM_WHS_ZONE: whsZone,
  //       OPTM_PURPOSE: purspose
  //     }])
  //   };
  //   return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidWareHouseBinRule", jObject, this.commonService.httpOptions).toPromise();
  // }

  /**
   * This method will create a new bin rule record.
   * @param oShipmentAutoRule 
   */
  InsertIntoBinRule(oShipmentAutoRule: any): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };    
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/InsertIntoWareHouseBinRule", jObject, this.commonService.httpOptions);
  }

  /**
   * This method is for updating the existing bin rule.
   * @param oShipmentAutoRule 
   */
  UpdateBinRule(oShipmentAutoRule: any): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };    
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/UpdateWareHouseBinRule", jObject, this.commonService.httpOptions);
  }

  /**
   * This method removes(delete) the selected bin rule rows.
   * @param ddDeleteArry  
   */
  DeleteBinRule(ddDeleteArry: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(ddDeleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromWareHouseBinRule", jObject, this.commonService.httpOptions);
  }


 
 



}
