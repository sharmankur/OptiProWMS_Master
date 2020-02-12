import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { InboundService } from '../../services/inbound.service';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CTMasterComponent } from '../ctmaster.component';

@Component({
  selector: 'app-ctview',
  templateUrl: './ctview.component.html',
  styleUrls: ['./ctview.component.scss']
})
export class CTViewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  

  constructor(private inboundService: InboundService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private inboundMasterComponent: CTMasterComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.GetDataForContainerType();
  }


  GetDataForContainerType() {
    this.showLoader = true;
    this.commonservice.GetDataForContainerType().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookupLoader = false;
          for(var i=0; i<data.length ;i++){
            data[i].OPTM_LENGTH = data[i].OPTM_LENGTH.toFixed(Number(localStorage.getItem("DecimalPrecision")));
            data[i].OPTM_WIDTH = data[i].OPTM_WIDTH.toFixed(Number(localStorage.getItem("DecimalPrecision")));
            data[i].OPTM_HEIGHT = data[i].OPTM_HEIGHT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
            data[i].OPTM_MAXWEIGHT = data[i].OPTM_MAXWEIGHT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          }
          this.serviceData = data;
          this.lookupfor = "CTList";  
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }


  DeleteFromContainerType(ddDeleteArry) {
    this.showLoader = true;
    this.inboundService.DeleteFromContainerType(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.GetDataForContainerType();
          }else{
            this.toastr.error('', data[0].RESULT);
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  getLookupValue(event) {
    localStorage.setItem("CT_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "");
    this.inboundMasterComponent.inboundComponent = 2;
  }

  onCopyItemClick(event) {
    localStorage.setItem("CT_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.inboundMasterComponent.inboundComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("CT_ROW", "");
    localStorage.setItem("Action", "");
    this.inboundMasterComponent.inboundComponent = 2;
  }

  onEditClick(row){
    this.inboundMasterComponent.inboundComponent = 2;
  }

  OnDeleteSelected(event){
    if(event.length <= 0){
      this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
      return;
    }
    var ddDeleteArry: any[] = [];
    for(var i=0; i<event.length; i++){
      ddDeleteArry.push({       
        OPTM_CONTAINER_TYPE: event[i].OPTM_CONTAINER_TYPE,
        CompanyDBId: localStorage.getItem("CompID")
      });
    }
    this.DeleteFromContainerType(ddDeleteArry);
  }

  onDeleteRowClick(event){
    var ddDeleteArry: any[] = [];
      ddDeleteArry.push({
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTAINER_TYPE: event[0],
      });
    this.DeleteFromContainerType(ddDeleteArry);
  }
}
