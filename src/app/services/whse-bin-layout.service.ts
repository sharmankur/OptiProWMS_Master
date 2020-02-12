import { Injectable } from '@angular/core';
import { OutRequest } from '../models/outbound/request-model';
import { Commonservice } from './commonservice.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhseBinLayoutService {

  public config_params: any;
  public outRequest: OutRequest = new OutRequest();

  constructor(private httpclient: HttpClient, private commonService: Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetDataWareHouseMaster(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataWareHouseMaster", jObject, this.commonService.httpOptions);
  }

  DeleteWhseBinLayout(deleteArry: any[]): Observable<any>{
    var jObject = { Shipment: JSON.stringify(deleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/DeleteFromWareHouseMaster", jObject, this.commonService.httpOptions);
  }

  InsertIntoWareHouseMaster(shipmentModel: any): Observable<any>{
    let jObject = {
      Shipment: JSON.stringify(shipmentModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/InsertIntoWareHouseMaster", jObject, this.commonService.httpOptions);
  }

  IsValidWareHouseMaster(whsecode: any): Observable<any>{
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_WHSCODE: whsecode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/IsValidWareHouseMaster", jObject, this.commonService.httpOptions);
  }

  UpdateWareHouseMaster(shipmentModel: any): Observable<any>{
    let jObject = {
      Shipment: JSON.stringify(shipmentModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/UpdateWareHouseMaster", jObject, this.commonService.httpOptions);
  }
}
