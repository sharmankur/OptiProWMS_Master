import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Commonservice } from './commonservice.service';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Injectable({
  providedIn: 'root'
})
export class DocumentNumberingService {

  public config_params: any;

  constructor(private httpclient: HttpClient, private commonService: Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }



  GetDocumentallData(code): Observable<any> {
    let Comp = [];
    Comp.push({ CompanyDBId: localStorage.getItem("CompID"),   OPTM_CODE: code});
    let url = this.config_params.service_url
    var jObject = { 
      Shipment: JSON.stringify(Comp)    
    };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetDocumentNumberingAllData", jObject, this.commonService.httpOptions);
  }

  GetLookupValue(): Observable<any> {
    let Comp = [];
    Comp.push({ CompanyDBId: localStorage.getItem("CompID") });
    let url = this.config_params.service_url
    var jObject = { Shipment: JSON.stringify(Comp) };
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/GetLookupValue", jObject, this.commonService.httpOptions);
  }


  AddUpdateDocNumbering(SetParameter: any): Observable<any> {
    // var DataArray: any = {};
    // DataArray.DocNumberData = SetParameter;
    // DataArray.CompanyDBId = localStorage.getItem("CompID")
    // var jObject = {
    //   Shipment: JSON.stringify(DataArray)
    // }

    var jObject = {
      Shipment: JSON.stringify(SetParameter)
    }
    return this.httpclient.post(this.config_params.service_url + "/api/Masters/AddUpdateDocumentNumber?Company=" + localStorage.getItem("CompID"), jObject, this.commonService.httpOptions);
    // return this.httpclient.post(this.config_params.service_url + "/api/Masters/AddUpdateDocumentNumber", jObject, this.commonService.httpOptions);
  }
}
