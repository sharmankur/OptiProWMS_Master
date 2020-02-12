import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { DockdoormainComponent } from '../dockdoormain/dockdoormain.component';
import { DockdoorService } from '../../services/dockdoor.service';
import { Router } from '@angular/router';
import { LookupComponent } from '../../common/lookup/lookup.component';

@Component({
  selector: 'app-dockdoorview',
  templateUrl: './dockdoorview.component.html',
  styleUrls: ['./dockdoorview.component.scss']
})
export class DockdoorviewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private translate: TranslateService,private commonservice: Commonservice, private toastr: ToastrService, private ddmainComponent: DockdoormainComponent, private ddService: DockdoorService, private router: Router) { 
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
    this.ddService.GetDataForDockDoor().subscribe(
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
          this.lookupfor = "DDList";
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

  getlookupSelectedItem(event) {
    localStorage.setItem("DD_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "");
    this.ddmainComponent.ddComponent = 2;
  }

  onCopyItemClick(event) {
    localStorage.setItem("DD_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.ddmainComponent.ddComponent = 2;
  }
  
  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("DD_ROW", "");
    localStorage.setItem("Action", "");
    this.ddmainComponent.ddComponent = 2;
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
    this.ddService.DeleteFromDockDoor(ddDeleteArry).subscribe(
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
