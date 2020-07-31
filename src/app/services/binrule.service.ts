import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commonservice } from './commonservice.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinruleService {

  public config_params: any;

  constructor(private httpclient: HttpClient,private commonService:Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }


  GetDataForBinRuleList(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataWareHouseBinRule", jObject, this.commonService.httpOptions);
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
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidWareHouseBinRule", jObject, this.commonService.httpOptions).toPromise();
  }

  InsertIntoBinRule(oShipmentAutoRule: any): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };    
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/InsertIntoWareHouseBinRule", jObject, this.commonService.httpOptions);
  }

  UpdateBinRule(oShipmentAutoRule: any): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };    
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/UpdateWareHouseBinRule", jObject, this.commonService.httpOptions);
  }

  DeleteBinRule(ddDeleteArry: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(ddDeleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromWareHouseBinRule", jObject, this.commonService.httpOptions);
  }

}

