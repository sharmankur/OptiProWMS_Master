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
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForContainerAutoRule", jObject, this.commonService.httpOptions);
  }

  IsValidContainerAutoRule(OPTM_RULEID: number, OPTM_CONTTYPE: string, OPTM_PACKTYPE: number): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_RULEID: OPTM_RULEID,
        OPTM_CONTTYPE: OPTM_CONTTYPE,
        OPTM_PACKTYPE: OPTM_PACKTYPE
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/IsValidContainerAutoRule", jObject, this.commonService.httpOptions);
  }
  
  InsertIntoContainerAutoRule(oShipmentAutoRule: any): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };    
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/InsertIntoContainerAutoRule", jObject, this.commonService.httpOptions);
  }

  UpdateContainerAutoRule(oShipmentAutoRule: any): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };    
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/UpdateContainerAutoRule", jObject, this.commonService.httpOptions);
  }

}

