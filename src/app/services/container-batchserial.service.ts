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

  fillBatchSerialDataInGrid(ContnrShipmentId:number, WarehouseId:string, BinId:string, ItemCode:string, SHPStatus: any, Tracking: any){

    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ContnrShipmentId: ContnrShipmentId,
        WarehouseId: WarehouseId,
        BinId: BinId,
        ItemCode: ItemCode,
        SHPStatus: SHPStatus,
        Tracking: Tracking
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerandShipment/FillBatchSerialDataInGrid", jObject, this.commonService.httpOptions);
  }
  
  AssignMaterialToShipment(oSaveArray:any){

    let jObject = { Shipment: JSON.stringify(oSaveArray) };

    return this.httpclient.post(this.config_params.service_url + "/api/ContainerandShipment/AssignMaterialToShipment", jObject, this.commonService.httpOptions);
  }

  GetItemsOpenQuantity(ContnrShipmentId:number){

    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ContnrShipmentId: ContnrShipmentId       
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerandShipment/GetItemsOpenQuantity", jObject, this.commonService.httpOptions);
  }
}
