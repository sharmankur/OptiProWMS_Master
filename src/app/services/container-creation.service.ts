import { Injectable } from '@angular/core';
import { OutRequest } from '../models/outbound/request-model';
import { HttpClient } from '@angular/common/http';
import { Commonservice } from './commonservice.service';
import { Observable } from 'rxjs';
import { Shipment } from '../models/Shipment';

@Injectable({
  providedIn: 'root'
})
export class ContainerCreationService {

  public config_params: any;
  public outRequest: OutRequest = new OutRequest();
  constructor(private httpclient: HttpClient, private commonService: Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetContainerType(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      }])
    };

    var url = this.config_params.service_url + "/api/ShipContainer/GetContainerType";
    console.log("url: " + url);
    return this.httpclient.post(url, jObject, this.commonService.httpOptions);
  }

  CheckDuplicateContainerIdCreate(containerId: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ContainerId: containerId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/CheckDuplicateContainerIdCreate", jObject, this.commonService.httpOptions);
  }

  GetAutoRule(OPTM_CARRIERID: string, OPTM_DESC: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CARRIERID: OPTM_CARRIERID,
        OPTM_DESC: OPTM_DESC,
        OPTM_MODIFIEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetAutoRule", jObject, this.commonService.httpOptions);
  }

  GenerateShipContainer(oSaveModel: any): Observable<any> {

    // var oSaveModel: any = {};
    // oSaveModel.HeaderTableBindingData = [];
    // oSaveModel.OtherItemsDTL = [];

    // //Push data of header table into BatchSerial model
    // oSaveModel.HeaderTableBindingData.push({
    //   OPTM_AUTO: "",
    //   OPTM_CONTAINERID: containerId,
    //   OPTM_CONTTYPE: containerType,
    //   OPTM_CONTCODE: "",
    //   OPTM_WEIGHT: wieght,
    //   OPTM_AUTOCLOSE_ONFULL: 'Y',
    //   OPTM_AUTORULEID: 1,
    //   OPTM_WHSE: whse,
    //   OPTM_BIN: binNo,
    //   OPTM_CREATEDBY: localStorage.getItem("UserId"),
    //   OPTM_MODIFIEDBY: localStorage.getItem("UserId"),
    //   Length: length,
    //   Width: width,
    //   Height: height,
    //   ContainerWeight: "" + containerWeight,
    //   ItemCode: "",
    //   NoOfPacks: "1",
    //   OPTM_TASKID: 1,
    //   CompanyDBId: localStorage.getItem("CompID"),
    //   Username: localStorage.getItem("UserId"),
    //   UserId: localStorage.getItem("UserId"),
    //   GUID: localStorage.getItem("GUID"),
    //   Action: "",
    //   OPTM_PARENTCODE: "",
    //   OPTM_GROUP_CODE: "",
    //   CreateMode: createMode
    // });

    // oSaveModel.OtherItemsDTL.push({
    //   OPTM_ItemCode: "",
    //   OPTM_QUANTITY: 1,
    //   OPTM_CONTAINER: "",
    //   OPTM_AVLQUANTITY: 1,
    //   OPTM_INVQUANTITY: 1,
    //   OPTM_BIN: ''
    // });

    var jObject = {
      Shipment: JSON.stringify(oSaveModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GenerateShipContainer", jObject, this.commonService.httpOptions);
  }

  getContainerCode(oSaveModel: any): Observable<any> {
    var jObject = {
      Shipment: JSON.stringify(oSaveModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GenerateShipContainer", jObject, this.commonService.httpOptions);
  }

  GetOtherItemsFromContDTL(OPTM_CARRIERID: string, OPTM_DESC: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CARRIERID: OPTM_CARRIERID,
        OPTM_DESC: OPTM_DESC,
        OPTM_MODIFIEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetOtherItemsFromContDTL", jObject, this.commonService.httpOptions);
  }

  GetOpenSONumber(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetOpenSONumber", jObject, this.commonService.httpOptions);
  }

  IsValidWhseCode(whse: string): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        WhsCode: whse
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/IsValidWhseCode", jObject, this.commonService.httpOptions).toPromise();
  }

  IsValidBinCode(whse: string, binCode: string): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        WhsCode: whse,
        BinCode: binCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/IsValidBinCode", jObject, this.commonService.httpOptions).toPromise();
  }
}