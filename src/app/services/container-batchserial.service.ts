import { Injectable } from '@angular/core';
import { Commonservice } from './commonservice.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContainerBatchserialService {

  public config_params: any;

  constructor(private httpclient: HttpClient,private commonService:Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
   }

  fillBatchSerialDataInGrid(WarehouseId:string, BinId:string, ItemCode:string){

    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        WarehouseId: WarehouseId,
        BinId: BinId,
        ItemCode: ItemCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerandShipment/fillBatchSerialDataInGrid", jObject, this.commonService.httpOptions);
  }
}
