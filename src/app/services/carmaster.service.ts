import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OutRequest } from '../models/outbound/request-model';
import { Commonservice } from './commonservice.service';

@Injectable({
  providedIn: 'root'
})
export class CARMasterService {

  public config_params: any;
  public outRequest: OutRequest = new OutRequest();

  constructor(private httpclient: HttpClient,private commonService:Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetDataForContainerAutoRule(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTTYPE: '',
        RULEID: '',
        Purpose: '',
        AddItemFlg: ''
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataForContainerAutoRule", jObject, this.commonService.httpOptions);
  }

  IsValidContainerAutoRule(OPTM_RULEID: number, OPTM_CONTTYPE: string, OPTM_PACKTYPE: any): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_RULEID: OPTM_RULEID,
        OPTM_CONTTYPE: OPTM_CONTTYPE,
        OPTM_CONTUSE: OPTM_PACKTYPE
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidContainerAutoRule", jObject, this.commonService.httpOptions).toPromise();
  }
  
  InsertIntoContainerAutoRule(oShipmentAutoRule: any): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };    
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/InsertIntoContainerAutoRule", jObject, this.commonService.httpOptions);
  }

  UpdateContainerAutoRule(oShipmentAutoRule: any): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };    
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/UpdateContainerAutoRule", jObject, this.commonService.httpOptions);
  }

  DeleteFromContainerAutoRule(ddDeleteArry: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(ddDeleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromContainerAutoRule", jObject, this.commonService.httpOptions);
  }
  
}

