import { Component, OnInit } from '@angular/core';
import { CTRMainComponent } from '../ctrmain/ctrmain.component';
import { Commonservice } from '../../services/commonservice.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CTRMasterService } from '../../services/ctrmaster.service';

@Component({
  selector: 'app-ctrview',
  templateUrl: './ctrview.component.html',
  styleUrls: ['./ctrview.component.scss']
})
export class CTRViewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private ctrmasterService: CTRMasterService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private ctrmainComponent: CTRMainComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.getContainerRelationship();
  }

  
getContainerRelationship() {
    this.showLoader = true;
    this.ctrmasterService.GetDataForContainerRelationship().subscribe(
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
            data[i].OPTM_CONT_PERPARENT = data[i].OPTM_CONT_PERPARENT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
            data[i].OPTM_CONT_PARTOFPARENT = data[i].OPTM_CONT_PARTOFPARENT.toFixed(Number(localStorage.getItem("DecimalPrecision")));
          }
          this.serviceData = data;
          this.lookupfor = "CTRList";
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
    localStorage.setItem("CTR_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "");
    this.ctrmainComponent.ctrComponent = 2;
  }

  onCopyItemClick(event) {
    localStorage.setItem("CTR_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.ctrmainComponent.ctrComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("CTR_ROW", "");
    localStorage.setItem("Action", "");
    this.ctrmainComponent.ctrComponent = 2;
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
        OPTM_PARENT_CONTTYPE: event[i].OPTM_PARENT_CONTTYPE,
        CompanyDBId: localStorage.getItem("CompID")
      });
    }
    this.DeleteFromContainerRelationship(ddDeleteArry);
  }

  onDeleteRowClick(event){
    var ddDeleteArry: any[] = [];
      ddDeleteArry.push({
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_CONTAINER_TYPE: event[0],
        OPTM_PARENT_CONTTYPE: event[1],
      });
    this.DeleteFromContainerRelationship(ddDeleteArry);
  }

  DeleteFromContainerRelationship(ddDeleteArry){
    this.showLoader = true;
    this.ctrmasterService.DeleteFromContainerRelationship(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.getContainerRelationship();
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
}
