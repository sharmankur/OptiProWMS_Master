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

   InsertIntoDockDoor(OPTM_DOCKDOORID: string, OPTM_DESC:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_DOCKDOORID: OPTM_DOCKDOORID,
        OPTM_DESC: OPTM_DESC,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      }])
    };
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

  UpdateDockDoor(OPTM_DOCKDOORID: string, OPTM_DESC:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_DOCKDOORID: OPTM_DOCKDOORID,
        OPTM_DESC: OPTM_DESC,
        OPTM_MODIFIEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/UpdateDockDoor", jObject, this.commonService.httpOptions);
  }
}
