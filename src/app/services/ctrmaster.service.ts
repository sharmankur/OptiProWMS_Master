import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OutRequest } from '../models/outbound/request-model';
import { Commonservice } from './commonservice.service';

@Injectable({
  providedIn: 'root'
})
export class CTRMasterService {


  public config_params: any;
  public outRequest: OutRequest = new OutRequest();

  constructor(private httpclient: HttpClient,private commonService:Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  GetDataForContainerRelationship(): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataForContainerRelationship", jObject, this.commonService.httpOptions);
  }

  InsertIntoContainerRelationship(OPTM_CONTAINER_TYPE: string, OPTM_PARENT_CONTTYPE: string, OPTM_CONT_PERPARENT: Number, OPTM_CONT_PARTOFPARENT:Number): Observable<any> {
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
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/InsertIntoContainerRelationship", jObject, this.commonService.httpOptions);
  }

  UpdateContainerRelationship(OPTM_CONTAINER_TYPE: string, OPTM_PARENT_CONTTYPE: string, OPTM_CONT_PERPARENT: Number, OPTM_CONT_PARTOFPARENT:Number): Observable<any> {
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
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/UpdateContainerRelationship", jObject, this.commonService.httpOptions);
  }

  DeleteFromContainerRelationship(OPTM_CONTAINER_TYPE: string, OPTM_PARENT_CONTTYPE: string): Observable<any> {
    let jObject = {
      Shipment: JSON.stringify([{
        OPTM_CONTAINER_TYPE: OPTM_CONTAINER_TYPE,
        OPTM_PARENT_CONTTYPE: OPTM_PARENT_CONTTYPE,
        CompanyDBId: localStorage.getItem("CompID")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Shipment/DeleteFromContainerRelationship", jObject, this.commonService.httpOptions);
  }

  getAutoLot(itemCode: string, tracking: string, quantity: any): Observable<any> {
    let jObject = {
      GoodsReceiptToken: JSON.stringify([{
        UserId: '',
        CompanyDBId: localStorage.getItem("CompID"),
        ItemCode: itemCode,
        TRACKING: tracking,
        QUANTITY: quantity,
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/GetAutoLot", jObject, this.commonService.httpOptions);
  }

  getUOMs(itemCode: string): Observable<any> {
    let jObject = {
      ItemKey: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"),
        ItemCode: itemCode
      }])
    };
   // console.log("getUOMs API's request:"+JSON.stringify(jObject));
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/getUOM", jObject, this.commonService.httpOptions);
  }

  getRevBins(QCrequired: string, itemcode: string): Observable<any> {
    var jObject = {
      WhsCode: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"), 
        ItemCode: itemcode,
        WhsCode: localStorage.getItem("whseId"), 
        QCRequired: QCrequired,
        PageId: "GRPO",
        GUID: localStorage.getItem("GUID"),
        UsernameForLic: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/GetBinsForReceiptWithReceivingBin", jObject, this.commonService.httpOptions);
  }

  getAllBins(QCrequired: string, targetWHS: string): Observable<any> {
    var jObject = {
      WhsCode: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"), ItemCode: '',
        WhsCode: targetWHS, QCRequired: QCrequired,
        GUID: localStorage.getItem("GUID"),
        UsernameForLic: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/GetBins", jObject, this.commonService.httpOptions);
  }

  GetTargetBins(QCrequired: string, targetWHS: string): Observable<any> {
    var jObject = {
      WhsCode: JSON.stringify([{
        CompanyDBId: localStorage.getItem("CompID"), ItemCode: '',
        WhsCode: targetWHS, QCRequired: QCrequired,
        GUID: localStorage.getItem("GUID"),
        UsernameForLic: localStorage.getItem("UserId")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/GetTargetBins", jObject, this.commonService.httpOptions);
  }

  binChange(targetWhs: string, binCode: string): Observable<any> {
    var jObject = { WhsCode: JSON.stringify([{ CompanyDBId: localStorage.getItem("CompID"), BinCode: binCode, ItemCode: '', WhsCode: targetWhs }]) };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/IsBinExist", jObject, this.commonService.httpOptions);
  } 

  isBinExistForProduction(targetWhs: string, binCode: string, Status: string): Observable<any> {
    var jObject = { WhsCode: JSON.stringify([{ CompanyDBId: localStorage.getItem("CompID"), BinCode: binCode, Status: Status, ItemCode: '', WhseCode: targetWhs }]) };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/isBinExistForProduction", jObject, this.commonService.httpOptions);
  } 
 
  SubmitGoodsReceiptPO(oSubmitPOLots: any): Observable<any> {
    var jObject = { GoodsReceiptToken: JSON.stringify(oSubmitPOLots) };    
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/SubmitGoodsReceiptPO", jObject, this.commonService.httpOptions);
  }

  // getTargetBins(QCrequired: string): Observable<any> {
  //   var jObject = {
  //     WhsCode: JSON.stringify([{
  //       CompanyDBId: localStorage.getItem("CompID"), ItemCode: '',
  //       WhsCode: localStorage.getItem("whseId"), QCRequired: QCrequired,ageId: "GRPO"}])
  //   };
  //   return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/GetBinsForReceiptWithReceivingBin", jObject, this.commonService.httpOptions);
  // }

  /**
   * get whs list for target whs.
   */
  getQCTargetWhse(): Observable<any> {
    var jObject = {
      WhsCode: JSON.stringify([{
          CompanyDBId: localStorage.getItem("CompID"),
          //Need to pass Username as Warehouses are filled Accordind to the Permission from Admin Portal 
          //Chane dt 2-July-2018
          UserId: localStorage.getItem("UserId")
      }])};
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/GetWHS", jObject, this.commonService.httpOptions);
  }

  /**
   * check whs is valid or not.
   * @param whsCode 
   */
  isWHSExists(whsCode:string){

    var jObject = { WhsCode: JSON.stringify([{ CompanyDBId:  localStorage.getItem("CompID"), ItemCode: '', WhsCode: whsCode}]) };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/IsWhsExist", jObject, this.commonService.httpOptions);
  }

   /**
   * check is serial exists or not.
   * @param whsCode 
   */
  isSerialExists(itemCode:string, serialNo:string){
    var jObject = { SerialNo: JSON.stringify([{ CompanyDBId:  localStorage.getItem("CompID"), ItemCode: itemCode, SerialNo: serialNo}]) };
    return this.httpclient.post(this.config_params.service_url + "/api/GoodReceiptPO/CheckSerialNo", jObject, this.commonService.httpOptions);
  }
  
  /**
   * check and scan code.
   * @param whsCode 
   */
  checkAndScanCode(vendCode:string,scanInputString){
    var jObject = {Gs1Token: JSON.stringify([{Vsvendorid:vendCode,StrScan:scanInputString,CompanyDBId:localStorage.getItem("CompID")}])};
    return this.httpclient.post(this.config_params.service_url + "/api/Gs1/GS1SETUP", jObject, this.commonService.httpOptions);
  }

    /**
    * This API method will return base64 string for pdf format for print.
    * @param item 
    * @param binNo 
    * @param noOfCopies 
    */
   printingServiceForSubmitGRPO(psReceiptNo:string) : Observable<any> {
    var jObject = { PrintingObject: JSON.stringify([{ CompanyDBId: localStorage.getItem("CompID"),
    USERID: localStorage.getItem("UserId"), RPTID: 6, DOCNO: psReceiptNo, 
    GUID: localStorage.getItem("GUID"), UsernameForLic: localStorage.getItem("UserId") }]) };
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
}

