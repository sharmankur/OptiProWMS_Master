import { Injectable } from '@angular/core';
import { Commonservice } from './commonservice.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContainerShipmentService {

  public config_params: any;

  constructor(private httpclient: HttpClient,private commonService:Commonservice) { 
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetContainsItemCode(SHIPMENTID:number, IsShipment: boolean): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")   ,
        SHIPMENTID: SHIPMENTID,
        IsShipment: IsShipment
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetContainsItemCode", jObject, this.commonService.httpOptions);
  }

  FillContainerDataInGrid(ContnrShipmentId:number,OPTM_CONTCODE:any, OPTM_SHIPELIGIBLE:string, OPTM_STATUS:number, OPTM_CONTTYPE:string, OPTM_ITEMCODE:string,
    OPTM_SHIPMENTID:number, OPTM_INV_STATUS:number, OPTM_WHSE:string, OPTM_BIN:string, IsShipment:boolean, WOId:any , SOId:any, SelectedOperation:number, OPTM_CONT_GROUPCODE): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_SHIPELIGIBLE: OPTM_SHIPELIGIBLE,
        ContnrShipmentId: ContnrShipmentId,
        OPTM_CONTCODE: OPTM_CONTCODE,        
        OPTM_STATUS: OPTM_STATUS,
        OPTM_CONTTYPE: OPTM_CONTTYPE,
        OPTM_ITEMCODE: OPTM_ITEMCODE,
        OPTM_SHIPMENTID: OPTM_SHIPMENTID,
        OPTM_INV_STATUS: OPTM_INV_STATUS,
        OPTM_WHSE: OPTM_WHSE,
        OPTM_BIN: OPTM_BIN,
        IsShipment: IsShipment,
        WOId: WOId,
        SOId: SOId,
        Operation: SelectedOperation,
        OPTM_CONT_GROUPCODE: OPTM_CONT_GROUPCODE
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/FillContainerDataInGrid", jObject, this.commonService.httpOptions);
  }

  IsValidContainsItemCode(ItemCode:string, IsShipment:boolean, ShipmentId:string){

    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ItemCode: ItemCode,
        IsShipment: IsShipment,
        ShipmentId: ShipmentId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/IsValidContainsItemCode", jObject, this.commonService.httpOptions);
  }

  AssignContainerToShipment(oSaveArray:any){
    let jObject = { Shipment: JSON.stringify(oSaveArray) };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/AssignContainerstoShipment", jObject, this.commonService.httpOptions);
  }

  RemoveContainerFromShipment(oSaveArray:any){
    let jObject = { Shipment: JSON.stringify(oSaveArray) };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/RemoveFromShipment", jObject, this.commonService.httpOptions);
  }

  SetDamagedContainer(oSaveArray:any){
    let jObject = { Shipment: JSON.stringify(oSaveArray) };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/SetContainersDamaged", jObject, this.commonService.httpOptions);
  }

  CloseContainer(oSaveArray:any){
    let jObject = { Shipment: JSON.stringify(oSaveArray) };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/CloseContainer", jObject, this.commonService.httpOptions);
  } 
  
  ContainerReturned(oSaveArray:any){
    let jObject = { Shipment: JSON.stringify(oSaveArray) };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/ContainerReturned", jObject, this.commonService.httpOptions);
  }  
}
