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

  GetDataBasedOnShipmentId(OPTM_SHIPMENTID: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_SHIPMENTID: OPTM_SHIPMENTID
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/GetDataBasedOnShipmentId", jObject, this.commonService.httpOptions);
  }
  
  ScheduleShipment(OPTM_SHIPMENTID: string, OPTM_CARRIER: string, OPTM_SCH_DATETIME, OPTM_DOCKDOORID): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_SHIPMENTID: OPTM_SHIPMENTID,
        OPTM_CARRIER: OPTM_CARRIER,
        OPTM_SCH_DATETIME: OPTM_SCH_DATETIME,
        OPTM_DOCKDOORID: OPTM_DOCKDOORID,
        OPTM_USERNAME: localStorage.getItem("UserId")
      }])
    }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/ScheduleShipment", jObject, this.commonService.httpOptions);
  }

  StageORUnstageShipment(OPTM_SHIPMENTID: any, OPTM_STATUS: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_SHIPMENTID: OPTM_SHIPMENTID,
        OPTM_STATUS: OPTM_STATUS,
        OPTM_USERNAME: localStorage.getItem("UserId")
      }])
    }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/StageORUnstageShipment", jObject, this.commonService.httpOptions);
  }

  updateShipment(OPTM_RETURN_ORDER_REF, OPTM_USE_CONTAINER, OPTM_SHIPMENTID, OPTM_BOLNUMBER, OPTM_VEHICLENO): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_RETURN_ORDER_REF: OPTM_RETURN_ORDER_REF,
        OPTM_BOLNUMBER: OPTM_BOLNUMBER,
        OPTM_VEHICLENO: OPTM_VEHICLENO,
        OPTM_USE_CONTAINER: OPTM_USE_CONTAINER,
        OPTM_SHIPMENTID: OPTM_SHIPMENTID,
        OPTM_USERNAME: localStorage.getItem("UserId")
      }])
    }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/UpdateShipment", jObject, this.commonService.httpOptions);
  }

  DeleteFromContainerAutoRule(ddDeleteArry: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(ddDeleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/DeleteFromContainerAutoRule", jObject, this.commonService.httpOptions);
  }
  
}

