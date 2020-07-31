import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commonservice } from './commonservice.service';

@Injectable({
  providedIn: 'root'
})
export class PickTaskService {


  public config_params: any;
  constructor(private httpclient: HttpClient, private commonService: Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  clearLocaStorage() {
    localStorage.setItem("PickItemIndex", "");
    localStorage.setItem("TaskDetail", "");
  }

  GetShipmentId(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/PickList/GetShipmentId", jObject, this.commonService.httpOptions);
  }

  GetPickTaskId(ShipmentId): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_SHIPMENTID: ShipmentId
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/PickList/GetDataBasedOnShipmentID", jObject, this.commonService.httpOptions);
  }

  InsertIntoContainerRelationship(OPTM_CONTAINER_TYPE: string, OPTM_PARENT_CONTTYPE: string, OPTM_CONT_PERPARENT, OPTM_CONT_PARTOFPARENT): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTAINER_TYPE: OPTM_CONTAINER_TYPE,
        OPTM_PARENT_CONTTYPE: OPTM_PARENT_CONTTYPE,
        OPTM_CONT_PERPARENT: OPTM_CONT_PERPARENT,
        OPTM_CONT_PARTOFPARENT: OPTM_CONT_PARTOFPARENT,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/InsertIntoContainerRelationship", jObject, this.commonService.httpOptions);
  }

  UpdateContainerRelationship(OPTM_CONTAINER_TYPE, OPTM_PARENT_CONTTYPE, OPTM_CONT_PERPARENT, OPTM_CONT_PARTOFPARENT): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTAINER_TYPE: OPTM_CONTAINER_TYPE,
        OPTM_PARENT_CONTTYPE: OPTM_PARENT_CONTTYPE,
        OPTM_CONT_PERPARENT: OPTM_CONT_PERPARENT,
        OPTM_CONT_PARTOFPARENT: OPTM_CONT_PARTOFPARENT,
        OPTM_MODIFIEDBY: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/UpdateContainerRelationship", jObject, this.commonService.httpOptions);
  }

  DeleteFromContainerRelationship(ddDeleteArry: any[]): Observable<any> {
    var jObject = { Shipment: JSON.stringify(ddDeleteArry) };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/DeleteFromContainerRelationship", jObject, this.commonService.httpOptions);
  }

  SubmitPickList(oSubmitPOLots: any): Observable<any> {
    var jObject = { Shipment: JSON.stringify(oSubmitPOLots) };
    return this.httpclient.post(this.config_params.service_url + "/api/PickList/SubmitPickList", jObject, this.commonService.httpOptions);
  }


  /**
   * check whs is valid or not.
   * @param whsCode 
   */
  isWHSExists(whsCode: string) {

    var jObject = { WhsCode: JSON.stringify([{ CompanyDBId: localStorage.getItem("CompID"), ItemCode: '', WhsCode: whsCode }]) };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/IsWhsExist", jObject, this.commonService.httpOptions);
  }

  /**
  * check is serial exists or not.
  * @param whsCode 
  */
  isSerialExists(itemCode: string, serialNo: string) {
    var jObject = { SerialNo: JSON.stringify([{ CompanyDBId: localStorage.getItem("CompID"), ItemCode: itemCode, SerialNo: serialNo }]) };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/CheckSerialNo", jObject, this.commonService.httpOptions);
  }

  /**
   * check and scan code.
   * @param whsCode 
   */
  checkAndScanCode(vendCode: string, scanInputString) {
    var jObject = { Gs1Token: JSON.stringify([{ Vsvendorid: vendCode, StrScan: scanInputString, CompanyDBId: localStorage.getItem("CompID") }]) };
    return this.httpclient.post(this.config_params.service_url + "/api/Gs1/GS1SETUP", jObject, this.commonService.httpOptions);
  }

  /**
  * This API method will return base64 string for pdf format for print.
  * @param item 
  * @param binNo 
  * @param noOfCopies 
  */
  printingServiceForSubmitGRPO(psReceiptNo: string): Observable<any> {
    var jObject = {
      PrintingObject: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        USERID: localStorage.getItem("UserId"), RPTID: 6, DOCNO: psReceiptNo,
        GUID: localStorage.getItem("GUID"), UsernameForLic: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Printing/WMSPrintingService", jObject, this.commonService.httpOptions);
  }

  GetPalletListsForGRPO(opType: number, itemCode: string, BinCode: string): Observable<any> {
    var jObject = {
      PalletCode: JSON.stringify([{
        COMPANYDBNAME: localStorage.getItem("CompID"),
        OPERATIONTYPE: "" + opType,
        WhseCode: localStorage.getItem("whseId"),
        ITEMCODE: itemCode,
        BinCode: BinCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Pallet/GetPalletListsForGRPO", jObject, this.commonService.httpOptions);
  }


  IsPalletValidForGRPO(palletCode: string, itemCode: string, BinCode: string): Observable<any> {
    var jObject = {
      PalletCode: JSON.stringify([{
        COMPANYDBNAME: localStorage.getItem("CompID"),
        WhseCode: localStorage.getItem("whseId"),
        PalletCode: palletCode,
        ITEMCODE: itemCode,
        BinCode: BinCode
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Pallet/IsPalletValidForGRPO", jObject, this.commonService.httpOptions);
  }


  FillPickListDataInGrid(FROMSHIPMENTID: any, TOSHIPMENTID: any, OPTM_WHSECODE: any, OPTM_PICKLISTBASIS: any, OPTM_PLANSHIFT: any, OPTM_STATUS: any,
    OPTM_PLANDATE: any, Priority): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        FROMSHIPMENTID: FROMSHIPMENTID,
        TOSHIPMENTID: TOSHIPMENTID,
        OPTM_WHSECODE: OPTM_WHSECODE,
        OPTM_STATUS: OPTM_STATUS,
        OPTM_PICKLISTBASIS: OPTM_PICKLISTBASIS,
        OPTM_PLANSHIFT: OPTM_PLANSHIFT,
        OPTM_PLANDATE: OPTM_PLANDATE,
        OPTM_PRIORITY: Priority
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/PickList/GetPickListData", jObject, this.commonService.httpOptions);
  }


  updateReleaseStatusForPickListItems(OPTM_PICKLIST_CODE_List: any): Observable<any> {
    var arrRequestBody = [];
    for (let i = 0; i < OPTM_PICKLIST_CODE_List.length; i++) {
      var obj = { CompanyDBId: localStorage.getItem("CompID"), OPTM_PICKLIST_ID: OPTM_PICKLIST_CODE_List[i] }
      arrRequestBody.push(obj);
    }
    let jObject = {
      Shipment: JSON.stringify(arrRequestBody)
    };
    return this.httpclient.post(this.config_params.service_url + "/api/PickList/ReleasePickList", jObject, this.commonService.httpOptions);
  }

  updatePickItemsAndTasks(data: any): Observable<any> {
    //Added By Srini on 26-Jul-2020
    //data.loginParams = this.commonService.GetloginParams;
    var jObject = { Shipment: JSON.stringify(data) };
    return this.httpclient.post(this.config_params.service_url + "/api/PickList/UpdateMaintainPicklist", jObject, this.commonService.httpOptions);
  }

  GetUserGroup(OPTM_BIN: string, OPTM_USERGROUP: string, OPTM_WHSE): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_BIN: OPTM_BIN,
        OPTM_USERGROUP: OPTM_USERGROUP,
        OPTM_WHSE: OPTM_WHSE
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/PickList/GetUserGroup", jObject, this.commonService.httpOptions);
  }

  IsAllItemPresentInSelectedBin(OPTM_TASKID: string, OPTM_WHSCODE: string, OPTM_BINNO): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_TASKID: OPTM_TASKID,
        OPTM_WHSCODE: OPTM_WHSCODE,
        OPTM_BINNO: OPTM_BINNO
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/PickList/IsAllItemPresentInSelectedBin", jObject, this.commonService.httpOptions);
  }


  GetAllShipmentOfPicklist(OPTM_PICKLIST_ID): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_PICKLIST_ID: OPTM_PICKLIST_ID
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/PickList/GetAllShipmentOfPicklist", jObject, this.commonService.httpOptions);
  }
  
}

