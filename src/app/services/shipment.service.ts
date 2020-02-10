import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OutRequest } from '../models/outbound/request-model';
import { Commonservice } from './commonservice.service';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  public config_params: any;
  public outRequest: OutRequest = new OutRequest();

  constructor(private httpclient: HttpClient,private commonService:Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetShipmentIdForShipment(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/GetShipmentIdForShipment", jObject, this.commonService.httpOptions);
  }

  GetDataBasedOnShipmentId(OPTM_DOCENTRY: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_DOCENTRY: OPTM_DOCENTRY
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/GetDataBasedOnShipmentId", jObject, this.commonService.httpOptions);
  }
  
  ScheduleShipment(OPTM_DOCENTRY: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_DOCENTRY: OPTM_DOCENTRY
      }])
    }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/ScheduleShipment", jObject, this.commonService.httpOptions);
  }

  StageORUnstageShipment(OPTM_DOCENTRY: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_DOCENTRY: OPTM_DOCENTRY
      }])
    }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/StageORUnstageShipment", jObject, this.commonService.httpOptions);
  }

  DeleteFromContainerAutoRule(ddDeleteArry: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(ddDeleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/DeleteFromContainerAutoRule", jObject, this.commonService.httpOptions);
  }
  
}

