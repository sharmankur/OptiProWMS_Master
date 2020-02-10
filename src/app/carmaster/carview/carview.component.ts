import { Component, OnInit } from '@angular/core';
import { Commonservice } from '../../services/commonservice.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CARMainComponent } from '../carmain/carmain.component';
import { CARMasterService } from '../../services/carmaster.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-carview',
  templateUrl: './carview.component.html',
  styleUrls: ['./carview.component.scss']
})
export class CARViewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private carmasterService: CARMasterService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private carmainComponent: CARMainComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.GetDataForContainerAutoRule();
  }

  GetDataForContainerAutoRule() {
    this.showLoader = true;
    this.carmasterService.GetDataForContainerAutoRule().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookupLoader = false;
          this.serviceData = data;
          for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
            if(this.serviceData[iBtchIndex].OPTM_ADD_TOCONT == 'Y'){
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "Yes";
            }else{
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "No";
            }
          }
          this.lookupfor = "CARList";
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
    localStorage.setItem("CAR_ROW", JSON.stringify(event));    
    localStorage.setItem("Action", "");
    this.IsValidContainerAutoRule(event[0], event[1], event[2]);
  }

  onCopyItemClick(event) {
    localStorage.setItem("CAR_ROW", JSON.stringify(event));  
    localStorage.setItem("Action", "copy");  
    this.IsValidContainerAutoRule(event[0], event[1], event[2]);
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("CAR_ROW", "");
    localStorage.setItem("Action", "");
    this.carmainComponent.carComponent = 2;
  }

  OnDeleteSelected(event){
    if(event.length <= 0){
      this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
      return;
    }
    var ddDeleteArry: any[] = [];
    for(var i=0; i<event.length; i++){
      ddDeleteArry.push({       
        OPTM_RULEID: event[i].OPTM_RULEID,
        OPTM_CONTTYPE: event[i].OPTM_CONTTYPE,
        OPTM_PACKTYPE: event[i].OPTM_PACKTYPE,     
        CompanyDBId: localStorage.getItem("CompID")
      });
    }
    this.DeleteFromContainerAutoRule(ddDeleteArry);
  }

  onDeleteRowClick(event){
    var ddDeleteArry: any[] = [];
      ddDeleteArry.push({
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_RULEID: event[0],
        OPTM_CONTTYPE: event[1],
        OPTM_PACKTYPE: event[2]       
      });
    this.DeleteFromContainerAutoRule(ddDeleteArry);
  }

  // onDeleteRowClick(event){
  //   this.DeleteFromContainerAutoRule(event[0], event[1], event[2]);
  // }
  
  DeleteFromContainerAutoRule(ddDeleteArry) {
    this.showLoader = true;
    this.carmasterService.DeleteFromContainerAutoRule(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.GetDataForContainerAutoRule();
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

  IsValidContainerAutoRule(ruleId, ContType, PT) {
    this.showLoader = true;
    this.carmasterService.IsValidContainerAutoRule(ruleId, ContType, PT).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          localStorage.setItem("CAR_Grid_Data", JSON.stringify(data));
          this.carmainComponent.carComponent = 2;
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
