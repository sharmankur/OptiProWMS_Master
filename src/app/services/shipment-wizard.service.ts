import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Commonservice } from './commonservice.service';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Injectable({
  providedIn: 'root'
})
export class ShipmentWizardService {

  public config_params: any;

  constructor(private httpclient: HttpClient,private commonService:Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
}

GetSalesOrder(SetParameter:any): Observable<any> {
  
      let url=this.config_params.service_url
      let jObject = {
        Shipment: JSON.stringify([{
        FROMCARDCODE: SetParameter[0].FROMCARDCODE,
        TOCARDCODE: SetParameter[0].TOCARDCODE,
        DOCDUEFROM: SetParameter[0].DOCDUEFROM,
        DOCDUETO: SetParameter[0].DOCDUETO,
        ITEMCODEFROM: SetParameter[0].ITEMCODEFROM,
        ITEMCODETO: SetParameter[0].ITEMCODETO,
        FROMSO: SetParameter[0].FROMSO,
        TOSO: SetParameter[0].TOSO,
        WHSCODE: SetParameter[0].WHSCODE,
        SHIPFROM:SetParameter[0].SHIPFROM,
        SHIPTO:SetParameter[0].SHIPTO,
        OPENQTYFROM:SetParameter[0].OPENQTYFROM,
        OPENQTYTO:SetParameter[0].OPENQTYTO,
        NOOFFOPENLINESFROM:SetParameter[0].NOOFFOPENLINESFROM,
        NOOFFOPENLINESTO:SetParameter[0].NOOFFOPENLINESTO,
        OPTM_CONTUSE:SetParameter[0].OPTM_CONTUSE,
        CompanyDBId: localStorage.getItem("CompID")
        }])
      };
      return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataOfSalesOrder", jObject, this.commonService.httpOptions);
    }

    GetSalesOrderConsolidatedData(SetParameter:any): Observable<any> {
    
      let url=this.config_params.service_url
      var jObject = { Shipment: JSON.stringify(SetParameter)};
      return this.httpclient.post(this.config_params.service_url + "/api/Shipment/GetDataOfConsolidation", jObject, this.commonService.httpOptions);
    }

    CreateShipMentData(SetParameter:any): Observable<any> {
    
      let url=this.config_params.service_url
      var jObject = { Shipment: JSON.stringify(SetParameter)};
      return this.httpclient.post(this.config_params.service_url + "/api/Shipment/CreateShipments", jObject, this.commonService.httpOptions);
    }
}
