import { Component, OnInit } from '@angular/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { CarrierMainComponent } from '../carrier-main/carrier-main.component';
import { CarrierService } from 'src/app/services/carrier.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-carrier-view',
  templateUrl: './carrier-view.component.html',
  styleUrls: ['./carrier-view.component.scss']
})
export class CarrierViewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService, 
    private carrierMainComponent: CarrierMainComponent, private carrierService: CarrierService, private router: Router) { 
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    this.GetDataForDockDoor();
  }

  GetDataForDockDoor() {
    this.showLoader = true;
    this.carrierService.GetDataForDockDoor().subscribe(
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
          this.lookupfor = "CarrierList";
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
    localStorage.setItem("DD_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "");
    this.carrierMainComponent.carrierComponent = 2;
  }

  onCopyItemClick(event) {
    localStorage.setItem("DD_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.carrierMainComponent.carrierComponent = 2;
  }
  
  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("DD_ROW", "");
    localStorage.setItem("Action", "");
    this.carrierMainComponent.carrierComponent = 2;
  }

  OnDeleteSelected(event){
    if(event.length <= 0){
      this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
      return;
    }
    var ddDeleteArry: any[] = [];
    for(var i=0; i<event.length; i++){
      ddDeleteArry.push({
        OPTM_DOCKDOORID: event[i].OPTM_DOCKDOORID,
        CompanyDBId: localStorage.getItem("CompID")
      });
    }
    this.DeleteFromDockDoor(ddDeleteArry);
  }

  onDeleteRowClick(event){
    var ddDeleteArry: any[] = [];
      ddDeleteArry.push({
        OPTM_DOCKDOORID: event[0],
        CompanyDBId: localStorage.getItem("CompID")
      });
    this.DeleteFromDockDoor(ddDeleteArry);
  }

  DeleteFromDockDoor(ddDeleteArry){
    this.showLoader = true;
    this.carrierService.DeleteFromDockDoor(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.GetDataForDockDoor();
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
