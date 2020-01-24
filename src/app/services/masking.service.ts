import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Commonservice } from './commonservice.service';

@Injectable({
  providedIn: 'root'
})
export class MaskingService {

  config_params: any = "http://localhost:57950/";
  logged_in_company = sessionStorage.selectedComp;
  constructor(private httpclient: HttpClient, private commonService: Commonservice) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  //save data
  saveData(ItemCodeGenerationData): Observable<any> {

    // ItemCodeGenerationData[0]['GUID'] = localStorage.getItem("GUID");
    // ItemCodeGenerationData[0]['UsernameForLic'] = localStorage.getItem("loggedInUser");

    // .push({
    //   GUID: sessionStorage.getItem("GUID"),
    //   UsernameForLic: sessionStorage.getItem("loggedInUser")
    // })
    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = {
      AddItemGeneration: JSON.stringify(ItemCodeGenerationData)
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/AddItemGeneration", jObject, this.commonService.httpOptions);
  }
  //get data
  getItemCodeGenerationByCode(ItemCode): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = {
      ItemList: JSON.stringify(ItemCode)
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/GetDataByItemCode", jObject, this.commonService.httpOptions);
  }
  DeleteData(ItemCode): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = {
      DeleteItemGeneration: JSON.stringify(ItemCode)
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/DeleteItemGenerationCode", jObject, this.commonService.httpOptions);
  }

  viewItemGenerationData(search: string, PageNumber: any, record_per_page: any): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      GetRecord: JSON.stringify([{
        CompanyDBID: localStorage.getItem("CompID"),
        SearchString: search,
        PageNumber: PageNumber,
        PageLimit: record_per_page,
        GUID: localStorage.getItem("GUID"),
        UsernameForLic: localStorage.getItem("loggedInUser")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/GetItemGenerationData", jObject, this.commonService.httpOptions);
  }
  getItemCodeReference(ItemCode): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = {
      DeleteItemGeneration: JSON.stringify(ItemCode)
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/GetItemCodeReference", jObject, this.commonService.httpOptions);
  }

  DeleteSelectedData(ItemCode): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { DeleteItemGeneration: JSON.stringify(ItemCode) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/DeleteItemGenerationCode", jObject, this.commonService.httpOptions);
  }
  CheckDuplicateCode(codekey: string): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = {
      ItemList: JSON.stringify([{
        CompanyDBID: localStorage.getItem("CompID"),
        codekey: codekey,
        GUID: localStorage.getItem("GUID"),
        UsernameForLic: localStorage.getItem("UserId")
      }])
    };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/CheckDuplicateItemCode", jObject, this.commonService.httpOptions);
  }
}
