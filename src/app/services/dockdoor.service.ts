import { Injectable } from '@angular/core';
import { OutRequest } from '../models/outbound/request-model';

import { Commonservice } from './commonservice.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DockdoorService {
  public config_params: any;
  public outRequest: OutRequest = new OutRequest();
  constructor(private httpclient: HttpClient,private commonService:Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
   }

   InsertIntoDockDoor(DDdetails): Observable<any> {
    var jObject = { Shipment: JSON.stringify(DDdetails) }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/InsertIntoDockDoor", jObject, this.commonService.httpOptions);
  }

  GetDataForDockDoor(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForDockDoor", jObject, this.commonService.httpOptions);
  }

  IsValidDockDoor(OPTM_DOCKDOORID: string, OPTM_WHSE: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        OPTM_DOCKDOORID: OPTM_DOCKDOORID,
        OPTM_WHSE: OPTM_WHSE,
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/IsValidDockDoor", jObject, this.commonService.httpOptions);
  }

  UpdateDockDoor(DDdetails): Observable<any> {
    var jObject = { Shipment: JSON.stringify(DDdetails) };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/UpdateDockDoor", jObject, this.commonService.httpOptions);
  }

  DeleteFromDockDoor(oShipmentAutoRule: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentAutoRule) };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/DeleteFromDockDoor", jObject, this.commonService.httpOptions);
  }
}
