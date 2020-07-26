import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OutRequest } from '../models/outbound/request-model';
import { Commonservice } from './commonservice.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarrierService {
  public config_params: any;
  public outRequest: OutRequest = new OutRequest();
  constructor(private httpclient: HttpClient, private commonService: Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  InsertIntoCarrier(OPTM_CARRIERID: string, OPTM_DESC: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CARRIERID: OPTM_CARRIERID,
        OPTM_DESC: OPTM_DESC,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/InsertIntoCarrier", jObject, this.commonService.httpOptions);
  }

  GetDataForCarrier(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataForCarrier", jObject, this.commonService.httpOptions);
  }

  UpdateCarrier(OPTM_CARRIERID: string, OPTM_DESC: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CARRIERID: OPTM_CARRIERID,
        OPTM_DESC: OPTM_DESC,
        OPTM_MODIFIEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/UpdateCarrier", jObject, this.commonService.httpOptions);
  }

  DeleteFromCarrier(oShipmentAutoRule: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromCarrier", jObject, this.commonService.httpOptions);
  }
}
