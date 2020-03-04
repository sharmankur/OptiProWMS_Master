import { Injectable } from '@angular/core';
import { OutRequest } from '../models/outbound/request-model';
import { HttpClient } from '@angular/common/http';
import { Commonservice } from './commonservice.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinRangeService {

  public config_params: any;
  public outRequest: OutRequest = new OutRequest();

  constructor(private httpclient: HttpClient,private commonService:Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }
   

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
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/IsValidWareHouseBinRule", jObject, this.commonService.httpOptions).toPromise();
  }

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
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/InsertIntoWareHouseBinRange", jObject, this.commonService.httpOptions);
  }

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
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/UpdateWareHouseBinRange", jObject, this.commonService.httpOptions);
  }

  DeleteFromBinranges(ddDeleteArry: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(ddDeleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/DeleteFromWareHouseBinRange", jObject, this.commonService.httpOptions);
  }

}

