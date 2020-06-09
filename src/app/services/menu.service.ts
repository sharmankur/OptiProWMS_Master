import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commonservice } from './commonservice.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public config_params: any;

  constructor(private httpclient: HttpClient, private commonService: Commonservice, private httpClientSer: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  getAllMenus(): Observable<any> {
    if (this.config_params == null) {
      this.config_params = JSON.parse(localStorage.getItem('ConfigData'));
      console.log("this.config_params.service_url   "+this.config_params.service_url);
    }
    var jObject = { CompanyDBId: localStorage.getItem("CompID"), UserId: localStorage.getItem("UserId"), }
    return this.httpclient.post(this.config_params.service_url + "/api/login/AllModule", jObject,
      this.commonService.httpOptions);
  }
}
