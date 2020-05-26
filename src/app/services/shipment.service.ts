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


  GetDataBasedOnShipmentId(OPTM_SHIPMENTID: string, OPTM_ARC): Observable<any> {
    OPTM_ARC = OPTM_ARC == "archiveddata"?'Y':'';
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_SHIPMENTID: OPTM_SHIPMENTID, 
        OPTM_ARC: OPTM_ARC
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/GetDataBasedOnShipmentId", jObject, this.commonService.httpOptions);
  }
  
  ScheduleShipment(OPTM_SHIPMENTID: string, OPTM_CARRIER: string, OPTM_SCH_DATETIME, OPTM_DOCKDOORID, OPTM_SHIPMENT_CODE, OPTM_SHP_PROCESS, OPTM_PROCESS_STEP_NO, OPTM_CONT_GRP): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_SHIPMENTID: OPTM_SHIPMENTID,
        OPTM_CARRIER: OPTM_CARRIER,
        OPTM_SCH_DATETIME: OPTM_SCH_DATETIME,
        OPTM_DOCKDOORID: OPTM_DOCKDOORID,
        OPTM_SHIPMENT_CODE: OPTM_SHIPMENT_CODE,
        OPTM_SHP_PROCESS: OPTM_SHP_PROCESS,
        OPTM_PROCESS_STEP_NO: OPTM_PROCESS_STEP_NO,
        OPTM_USERNAME: localStorage.getItem("UserId"),
        OPTM_CONT_GRP: OPTM_CONT_GRP
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

  updateShipment(OPTM_RETURN_ORDER_REF, OPTM_USE_CONTAINER, OPTM_SHIPMENTID, OPTM_BOLNUMBER, OPTM_VEHICLENO, OPTM_CONT_GRP, OPTM_CARRIER, OPTM_SCH_DATETIME, OPTM_DOCKDOORID): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_RETURN_ORDER_REF: OPTM_RETURN_ORDER_REF,
        OPTM_BOLNUMBER: OPTM_BOLNUMBER,
        OPTM_VEHICLENO: OPTM_VEHICLENO,
        OPTM_USE_CONTAINER: OPTM_USE_CONTAINER,
        OPTM_SHIPMENTID: OPTM_SHIPMENTID,
        OPTM_USERNAME: localStorage.getItem("UserId"),
        OPTM_CONT_GRP: OPTM_CONT_GRP,
        OPTM_CARRIER: OPTM_CARRIER,
        OPTM_SCH_DATETIME: OPTM_SCH_DATETIME,
        OPTM_DOCKDOORID: OPTM_DOCKDOORID,
      }])
    }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/UpdateShipment", jObject, this.commonService.httpOptions);
  }

  ChangeShippingProcess(SHIPMENTCODE, SHIPMENTPROCESS, SHIPMENTPROCESSNO, OPTM_STATUS): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        SHIPMENTCODE: SHIPMENTCODE,
        SHIPMENTPROCESS: SHIPMENTPROCESS,
        SHIPMENTPROCESSNO: SHIPMENTPROCESSNO,
        OPTM_STATUS: OPTM_STATUS
      }])
    }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/ChangeShippingProcess", jObject, this.commonService.httpOptions);
  }
  
  CreateContainerForPacking(oSaveModel): Observable<any> {
    let jObject = {Shipment: JSON.stringify(oSaveModel)}; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/CreateContainerForPacking", jObject, this.commonService.httpOptions);
  }

  CreateReturnDocument(OPTM_SHIPMENTID): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_SHIPMENTID: OPTM_SHIPMENTID,
        OPTM_ARC: "",
        UserId: localStorage.getItem("UserId")
      }])
    }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/CreateReturnDocument", jObject, this.commonService.httpOptions);
  }

  TransferArchieveDataToShipment(oSaveModel): Observable<any> {
    // let jObject = {
    //   Shipment: JSON.stringify([{
    //     CompanyDBId: localStorage.getItem("CompID"),
    //     OPTM_SHIPMENTID: OPTM_SHIPMENTID
    //   }])
    // }; 
    let jObject = {Shipment: JSON.stringify(oSaveModel)}; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/TransferArchieveDataToShipment", jObject, this.commonService.httpOptions);
  }
    

  GetArchieivingShipmentData(FROMSHIPMENTID, TOSHIPMENTID, FROMDATETIME, TODATETIME, FROMCUSTOMERCODE,
    TOCUSTOMERCODE): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        FROMSHIPMENTID: FROMSHIPMENTID,
        TOSHIPMENTID: TOSHIPMENTID,
        FROMDATETIME: FROMDATETIME,
        TODATETIME: TODATETIME,
        FROMCUSTOMERCODE: FROMCUSTOMERCODE,
        TOCUSTOMERCODE: TOCUSTOMERCODE
      }])
    }; 
    return this.httpclient.post(this.config_params.service_url + "/api/Ship/GetArchieivingShipmentData", jObject, this.commonService.httpOptions);
  }
}

