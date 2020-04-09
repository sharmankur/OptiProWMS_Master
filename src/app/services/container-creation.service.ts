import { Injectable } from '@angular/core';
import { OutRequest } from '../models/outbound/request-model';
import { HttpClient } from '@angular/common/http';
import { Commonservice } from './commonservice.service';
import { Observable } from 'rxjs';
import { Shipment } from '../models/Shipment';
import { AnimationQueryOptions } from '@angular/animations';

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
    var jObject = {
      Shipment: JSON.stringify(oSaveModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GenerateShipContainer", jObject, this.commonService.httpOptions);
  }
  
  RemoveShipContainer(oSaveModel: any): Observable<any> {
    var jObject = {
      Shipment: JSON.stringify(oSaveModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/RemoveShipContainer", jObject, this.commonService.httpOptions);
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

  GetContainerNumber(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_FUNCTION: "shipping",
        OPTM_OBJECT: "container"
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetContainerNumber", jObject, this.commonService.httpOptions);
  }

  InsertItemInContainer(conatinerId: any, containerType: any, itemCode: any,
    ruleId: any, ruleQty: any, fillPer: any, binEnable: any, operation: any, itemQty: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTID: conatinerId,
        OPTM_CONTTYPE: containerType,
        OPTM_ITEMCODE: itemCode,
        OPTM_RULEID: ruleId,
        OPTM_ITEMQTY: itemQty,
        OPTM_RULEQTY: ruleQty,
        OPTM_FILLPER: fillPer,
        OPTM_LIMITRULEQTY: 0,
        OPTM_BINENABLE: binEnable,
        OPTM_CREATEDBY: localStorage.getItem("UserId"),
        OPTM_OPERATION: operation
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerOperation/InsertItemInContainer", jObject, this.commonService.httpOptions);
  }

  InsertItemInContainerNew(oSaveModel: any): Observable<any> {
    var jObject = {
      Shipment: JSON.stringify(oSaveModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerOperation/InsertItemInContainer", jObject, this.commonService.httpOptions);
  }

  InsertContainerinContainer(containerId: any, containerChildID: any, opn: any, containerType: any, parentContainerType: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTID: containerId,
        OPTM_CONTCHILDID: containerChildID,
        OPTM_OPERATION: opn,
        OPTM_CONTTYPE: containerType,
        OPTM_PARENTCONTTYPE: parentContainerType
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerOperation/InsertContainerinContainer", jObject, this.commonService.httpOptions);
  }

  GetSelectesdRuleItem(ruleId: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerOperation/GetSelectesdRuleItem", jObject, this.commonService.httpOptions);
  }

  GetAllContainer(containerCode): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERCODE: containerCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerOperation/GetAllContainer", jObject, this.commonService.httpOptions);
  }

  CheckContainer(CONTAINERCODE,WHSCODE,BINCODE,RULEID,GROUPCODE,SONO,CONTTYPE,PURPOSE, OPERATION): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERCODE: CONTAINERCODE,
        WHSCODE: WHSCODE,
        BINCODE: BINCODE,
        RULEID: RULEID,
        GROUPCODE: GROUPCODE,
        SONO: SONO,
        CONTTYPE: CONTTYPE,
        PURPOSE: PURPOSE,
        OPERATION: OPERATION
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerOperation/CheckContainer", jObject, this.commonService.httpOptions);
  }

  IsValidContainerId(containerId: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERID: containerId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerOperation/IsValidContainerId", jObject, this.commonService.httpOptions);
  }

  IsValidSONumber(soNumber: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        SONUMBER: soNumber
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/IsValidSONumber", jObject, this.commonService.httpOptions);
  }
  
  IsValidSONumberBasedOnRule(soNumber: any, RULEID: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        SONUMBER: soNumber,
        RULEID: RULEID
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/IsValidSONumberBasedOnRule", jObject, this.commonService.httpOptions);
  }

  IsValidItemCode(ruleId: any, itemCode: any, whse: any, bin: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId,
        ITEMCODE: itemCode,
        WHSCODE: whse,
        BINCODE: bin
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerOperation/IsValidItemCode", jObject, this.commonService.httpOptions);
  }

  IsValidBtchSer(itemCode: any, lotNo:any, whse: any, bin: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_ITEMCODE: itemCode,
        OPTM_BTCHSER: lotNo,
        OPTM_WHSCODE: whse,
        OPTM_BINCODE: bin
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ContainerOperation/IsValidBtchSer", jObject, this.commonService.httpOptions);
  }

  CheckScanAndCreateVisiblity(ruleId: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/CheckScanAndCreateVisiblity", jObject, this.commonService.httpOptions);
  }

  GetListOfContainerBasedOnRule(ruleId: any, itemCode: any, whse: any, binCode: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId,
        ITEMCODE: itemCode,
        WHSCODE: whse,
        BINCODE: binCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetListOfContainerBasedOnRule", jObject, this.commonService.httpOptions);
  }

  GetListOfBatchSerOfSelectedContainerID(containerId: any, itemCode: AnimationQueryOptions): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERID: containerId,
        ITEMCODE: itemCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetListOfBatchSerOfSelectedContainerID", jObject, this.commonService.httpOptions);
  }

  GetWorkOrderList(WorkOrder: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        WONUMBER: WorkOrder
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetWorkOrderList", jObject, this.commonService.httpOptions);
  }

  GetTotalWeightBasedOnRuleID(ruleId): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetTotalWeightBasedOnRuleID", jObject, this.commonService.httpOptions);
  }

  GetDataForParentContainerType(ContainerType:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ContainerType: ContainerType
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetDataForParentContainerType", jObject, this.commonService.httpOptions);
  }
  
  GetCountOfParentContainer(ParentContId:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ParentContId: ParentContId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetCountOfParentContainer", jObject, this.commonService.httpOptions);
  }

  GetConatinersAddedInParentContainer(ParentContId:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ParentContId: ParentContId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetConatinersAddedInParentContainer", jObject, this.commonService.httpOptions);
  }
  
  IsDuplicateContainerCode(ContainerCode:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ContainerCode: ContainerCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/IsDuplicateContainerCode", jObject, this.commonService.httpOptions);
  }

  GetDataofSelectedTask(TaskId:number): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        TaskId: TaskId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetDataofSelectedTask", jObject, this.commonService.httpOptions);
  }

  GetItemAndBtchSerDetailBasedOnContainerID(containerId, code): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERID: containerId,
        OPTM_CONTCODE: code
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/ShipContainer/GetItemAndBtchSerDetailBasedOnContainerID", jObject, this.commonService.httpOptions);
  }

}
