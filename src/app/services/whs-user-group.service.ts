import { Injectable } from '@angular/core';
import { Commonservice } from './commonservice.service';
import { HttpClient } from '@angular/common/http';
import { OutRequest } from '../models/outbound/request-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhsUserGroupService {

 public config_params: any;
  public outRequest: OutRequest = new OutRequest();
  constructor(private httpclient: HttpClient, private commonService: Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetWHSList(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForDockDoor", jObject, this.commonService.httpOptions);
  }

  isValidWHS(whsCode:String): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForDockDoor", jObject, this.commonService.httpOptions);
  }

}
