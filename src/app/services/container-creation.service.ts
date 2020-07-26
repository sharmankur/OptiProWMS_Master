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

    var url = this.config_params.service_url + "/api/Container/GetContainerType";
    return this.httpclient.post(url, jObject, this.commonService.httpOptions);
  }

  GetChildContainerTypes(ParentContainerType: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CREATEDBY: localStorage.getItem("UserId"),
        ParentContainerType: ParentContainerType
      }])
    };

    var url = this.config_params.service_url + "/api/Container/GetChildContainerTypes";
    return this.httpclient.post(url, jObject, this.commonService.httpOptions);
  }

  CheckDuplicateContainerIdCreate(containerId: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ContainerId: containerId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/CheckDuplicateContainerIdCreate", jObject, this.commonService.httpOptions);
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
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetAutoRule", jObject, this.commonService.httpOptions);
  }

  GenerateShipContainer(oSaveModel: any): Observable<any> {
    var jObject = {
      Shipment: JSON.stringify(oSaveModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GenerateShipContainer", jObject, this.commonService.httpOptions);
  }
   
  SaveReportProgress(OPTMID: any, Qty: any): Observable<any> {
    let jObject = {
      REPORTPROGRESSDETAILS: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        TaskId: 0,
        OPTMID: OPTMID,
        ScanLPNVal: 2,
        ContainerCount: 1,
        ProducedQty: Qty ,
        AcceptedQty: Qty ,
        RejectedQty: 0,
        NCQty: 0
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/SaveReportProgress", jObject, this.commonService.httpOptions);
  }
  
  RemoveShipContainer(oSaveModel: any): Observable<any> {
    var jObject = {
      Shipment: JSON.stringify(oSaveModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/RemoveShipContainer", jObject, this.commonService.httpOptions);
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
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetOtherItemsFromContDTL", jObject, this.commonService.httpOptions);
  }

  GetOpenSONumber(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetOpenSONumber", jObject, this.commonService.httpOptions);
  }

  IsValidWhseCode(whse: string): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        WhsCode: whse
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidWhseCode", jObject, this.commonService.httpOptions).toPromise();
  }

  IsValidBinCode(whse: string, binCode: string): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        WhsCode: whse,
        BinCode: binCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/IsValidBinCode", jObject, this.commonService.httpOptions).toPromise();
  }

  GetSampleOfContainerString(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_FUNCTION: "Shipping",
        OPTM_OBJECT: "Container"
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetSampleOfContainerString", jObject, this.commonService.httpOptions);
  }

  GetContainerNumber(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_FUNCTION: "shipping",
        OPTM_OBJECT: "container"
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetContainerNumber", jObject, this.commonService.httpOptions);
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
    return this.httpclient.post(this.config_params.service_url + "/api/Container/InsertItemInContainer", jObject, this.commonService.httpOptions);
  }

  InsertItemInContainerNew(oSaveModel: any): Observable<any> {
    var jObject = {
      Shipment: JSON.stringify(oSaveModel)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/InsertItemInContainer", jObject, this.commonService.httpOptions);
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
    return this.httpclient.post(this.config_params.service_url + "/api/Container/InsertContainerinContainer", jObject, this.commonService.httpOptions);
  }

  GetSelectesdRuleItem(ruleId: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetSelectesdRuleItem", jObject, this.commonService.httpOptions);
  }

  GetAllContainer(containerCode): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERCODE: containerCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetAllContainer", jObject, this.commonService.httpOptions);
  }

  //Validate container parameters against the parameters entered in the screen
  CheckContainer(CONTAINERCODE,WHSCODE,BINCODE,RULEID,GROUPCODE,SONO,CONTTYPE,PURPOSE, OPERATION, CREATEMODE,
    blnParentFlg, blnValidateCreateModeAndRuleID): Observable<any> {
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
        OPERATION: OPERATION,
        CREATEMODE: CREATEMODE,
        PARENT_FLG: blnParentFlg,
        ValidateCreateModeAndRuleID: blnValidateCreateModeAndRuleID
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/CheckContainer", jObject, this.commonService.httpOptions);
  }

  GetContainer(CONTAINERCODE, blnParentFlg): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERCODE: CONTAINERCODE,
        PARENT_FLG: blnParentFlg
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetContainer", jObject, this.commonService.httpOptions);
  }

  CheckContainerScan(CONTAINERCODE,WHSCODE,BINCODE,RULEID,GROUPCODE,SONO,CONTTYPE,PURPOSE, OPERATION): Promise<any> {
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
    return this.httpclient.post(this.config_params.service_url + "/api/Container/CheckContainer", jObject, this.commonService.httpOptions).toPromise();
  }

  IsValidContainerId(containerId: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERID: containerId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/IsValidContainerId", jObject, this.commonService.httpOptions);
  }

  IsValidSONumber(soNumber: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        SONUMBER: soNumber
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/IsValidSONumber", jObject, this.commonService.httpOptions);
  }
  
  IsValidSONumberBasedOnRule(soNumber: any, RULEID: any, WH: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        SONUMBER: soNumber,
        RULEID: RULEID,
        WAREHOUSE: WH
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/IsValidSONumberBasedOnRule", jObject, this.commonService.httpOptions);
  }

  IsValidItemCode(ruleId: any, itemCode: any, whse: any, bin: any, operation: any, contcode: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId,
        ITEMCODE: itemCode,
        WHSCODE: whse,
        BINCODE: bin,
        OPERATION: operation,
        CONTAINERCODE: contcode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/IsValidItemCode", jObject, this.commonService.httpOptions);
  }

  IsValidItemCodeScan(ruleId: any, itemCode: any, whse: any, bin: any, operation: any, contcode: any): Promise<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId,
        ITEMCODE: itemCode,
        WHSCODE: whse,
        BINCODE: bin,
        OPERATION: operation,
        CONTAINERCODE: contcode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/IsValidItemCode", jObject, this.commonService.httpOptions).toPromise();
  }

  IsValidBtchSer(itemCode: any, lotNo:any, whse: any, bin: any,operation: any, contcode: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_ITEMCODE: itemCode,
        OPTM_BTCHSER: lotNo,
        OPTM_WHSCODE: whse,
        OPTM_BINCODE: bin,
        OPERATION: operation,
        CONTAINERCODE: contcode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/IsValidBtchSer", jObject, this.commonService.httpOptions);
  }

  CheckScanAndCreateVisiblity(ruleId: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/CheckScanAndCreateVisiblity", jObject, this.commonService.httpOptions);
  }

  GetListOfContainerBasedOnRule(ruleId: any, itemCode: any, whse: any, binCode: any, ContainerId:any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId,
        ITEMCODE: itemCode,
        WHSCODE: whse,
        BINCODE: binCode,
        CONTAINERID: ContainerId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetListOfContainerBasedOnRule", jObject, this.commonService.httpOptions);
  }

  GetListOfBatchSerOfSelectedContainerID(containerId: any, itemCode: AnimationQueryOptions): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERID: containerId,
        ITEMCODE: itemCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetListOfBatchSerOfSelectedContainerID", jObject, this.commonService.httpOptions);
  }

  GetWorkOrderList(WorkOrder: any, Whse: any, AutoRule: any): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        WONUMBER: WorkOrder,
        WHSCODE: Whse,
        RULEID: AutoRule
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetWorkOrderList", jObject, this.commonService.httpOptions);
  }

  GetTotalWeightBasedOnRuleID(ruleId): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        RULEID: ruleId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetTotalWeightBasedOnRuleID", jObject, this.commonService.httpOptions);
  }

  GetDataForParentContainerType(ContainerType:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ContainerType: ContainerType
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetDataForParentContainerType", jObject, this.commonService.httpOptions);
  }
  
  GetCountOfParentContainer(ParentContId:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ParentContId: ParentContId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetCountOfParentContainer", jObject, this.commonService.httpOptions);
  }

  GetConatinersAddedInParentContainer(ParentContId:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ParentContId: ParentContId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetConatinersAddedInParentContainer", jObject, this.commonService.httpOptions);
  }
  
  IsDuplicateContainerCode(ContainerCode:string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ContainerCode: ContainerCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/IsDuplicateContainerCode", jObject, this.commonService.httpOptions);
  }

  GetDataofSelectedTask(TaskId:number): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        TaskId: TaskId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetDataofSelectedTask", jObject, this.commonService.httpOptions);
  }

  GetItemAndBtchSerDetailBasedOnContainerID(containerId, code): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        CONTAINERID: containerId,
        OPTM_CONTCODE: code
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Container/GetItemAndBtchSerDetailBasedOnContainerID", jObject, this.commonService.httpOptions);
  }

}
