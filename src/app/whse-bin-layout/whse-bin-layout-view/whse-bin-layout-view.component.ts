import { Component, OnInit } from '@angular/core';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { WhseBinLayoutService } from '../../services/whse-bin-layout.service';
import { WhseBinLayoutComponent } from '../whse-bin-layout/whse-bin-layout.component';

@Component({
  selector: 'app-whse-bin-layout-view',
  templateUrl: './whse-bin-layout-view.component.html',
  styleUrls: ['./whse-bin-layout-view.component.scss']
})
export class WhseBinLayoutViewComponent implements OnInit {

  showLookup: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private commonservice: Commonservice, private router: Router, private toastr: ToastrService, 
    private translate: TranslateService, private whseBinLayoutService: WhseBinLayoutService,
    private whseBintComponent: WhseBinLayoutComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.GetDataWareHouseMaster();
  }

  GetDataWareHouseMaster() {
    this.showLoader = true;
    this.whseBinLayoutService.GetDataWareHouseMaster().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = false;
          this.serviceData = data;
          for (var iBtchIndex = 0; iBtchIndex < this.serviceData.length; iBtchIndex++) {
            if(this.serviceData[iBtchIndex].OPTM_ADD_TOCONT == 'Y'){
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "Yes";
            }else{
              this.serviceData[iBtchIndex].OPTM_ADD_TOCONT = "No";
            }
          }
          this.lookupfor = "WhseBinLayoutList";
        } else {
          //this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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
    console.log("getLookupValue" + event)
    localStorage.setItem("Action", "edit");
    localStorage.setItem("Row", JSON.stringify(event));
    this.whseBintComponent.whseBinLayoutComponent = 2;
  }

  onCopyItemClick(event) {
    localStorage.setItem("CAR_ROW", JSON.stringify(event));  
    localStorage.setItem("Action", "copy");
    this.whseBintComponent.whseBinLayoutComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("CAR_ROW", "");
    localStorage.setItem("Action", "");
    this.whseBintComponent.whseBinLayoutComponent = 2;
    // this.whseBintComponent.whseBinLayoutComponent = 2;
  }

  OnDeleteSelected(event){
    if(event.length <= 0){
      this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
      return;
    }
    var ddDeleteArry: any[] = [];
    for(var i=0; i<event.length; i++){
      ddDeleteArry.push({       
        OPTM_WHSCODE: event[i].OPTM_WHSCODE,
        CompanyDBId: localStorage.getItem("CompID")
      });
    }
    this.DeleteFromWareHouseMaster(ddDeleteArry);
  }

  onDeleteRowClick(event){
    var ddDeleteArry: any[] = [];
      ddDeleteArry.push({
        CompanyDBId: localStorage.getItem("CompID"),
        OPTM_WHSCODE: event[0]     
      });
    this.DeleteFromWareHouseMaster(ddDeleteArry);
  }
  
  DeleteFromWareHouseMaster(ddDeleteArry) {
    this.showLoader = true;
    this.whseBinLayoutService.DeleteWhseBinLayout(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          // if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.GetDataWareHouseMaster();
          // }else{
          //   this.toastr.error('', data[0].RESULT);
          // }
        } else {
          // this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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
