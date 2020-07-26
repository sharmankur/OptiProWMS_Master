import { Injectable } from '@angular/core';
import { Commonservice } from './commonservice.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContainerGroupService {
  public config_params: any;

  constructor(private httpclient: HttpClient,private commonService:Commonservice) { 
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetDataForContainerGroup(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDataForContainerGroup", jObject, this.commonService.httpOptions);
  }

  InsertIntoContainerGroup(OPTM_CONTAINER_GROUP: string, OPTM_DESC:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTAINER_GROUP: OPTM_CONTAINER_GROUP,
        OPTM_DESC: OPTM_DESC,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/InsertIntoContainerGroup", jObject, this.commonService.httpOptions);
  }

  UpdateContainerGroup(OPTM_CONTAINER_GROUP: string, OPTM_DESC:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTAINER_GROUP: OPTM_CONTAINER_GROUP,
        OPTM_DESC: OPTM_DESC,
        OPTM_MODIFIEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/UpdateContainerGroup", jObject, this.commonService.httpOptions);
  }

  DeleteFromContainerGroup(oShipmentContnrGroup: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oShipmentContnrGroup) };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromContainerGroup", jObject, this.commonService.httpOptions);
  }

}
