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
    this.ctrmainComponent.ctrComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("CTR_ROW", "");
    this.ctrmainComponent.ctrComponent = 2;
  }

  onEditClick(){
    this.ctrmainComponent.ctrComponent = 2;
  }

  onDeleteRowClick(event){
    this.DeleteFromContainerRelationship(event[0], event[1]);
  }

  DeleteFromContainerRelationship(OPTM_CONTAINER_TYPE, OPTM_PARENT_CONTTYPE){
    this.showLoader = true;
    this.ctrmasterService.DeleteFromContainerRelationship(OPTM_CONTAINER_TYPE, OPTM_PARENT_CONTTYPE).subscribe(
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
