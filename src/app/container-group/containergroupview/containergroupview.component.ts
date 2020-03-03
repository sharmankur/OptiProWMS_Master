import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ContainerGroupService } from '../../services/container-group.service';
import { ContainergroupmainComponent } from '../containergroupmain/containergroupmain.component';
import { LookupComponent } from '../../common/lookup/lookup.component';

@Component({
  selector: 'app-containergroupview',
  templateUrl: './containergroupview.component.html',
  styleUrls: ['./containergroupview.component.scss']
})
export class ContainergroupviewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(private translate: TranslateService,private commonservice: Commonservice, private toastr: ToastrService,private router: Router,
    private contnrServ: ContainerGroupService, private contrMainComp : ContainergroupmainComponent) { 
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }
  
  ngOnInit() {
    this.GetDataForContainerGroups();
  }

  GetDataForContainerGroups() {
    this.showLoader = true;
    this.contnrServ.GetDataForContainerGroup().subscribe(
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
          this.lookupfor = "ContnrGroup";
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
    localStorage.setItem("CG_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "");
    this.contrMainComp.cgComponent = 2;
  }

  onCopyItemClick(event) {
    localStorage.setItem("CG_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    this.contrMainComp.cgComponent = 2;
  }
  
  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("CG_ROW", "");
    localStorage.setItem("Action", "");
    this.contrMainComp.cgComponent = 2;
  }

  OnDeleteSelected(event){
    if(event.length <= 0){
      this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
      return;
    }
    var cgDeleteArry: any[] = [];
    for(var i=0; i<event.length; i++){
      cgDeleteArry.push({
        OPTM_CONTAINER_GROUP: event[i].OPTM_CONTAINER_GROUP,
        CompanyDBId: localStorage.getItem("CompID")
      });
    }
    this.DeleteContnrGroup(cgDeleteArry);
  }

  onDeleteRowClick(event){
    var cgDeleteArry: any[] = [];
    cgDeleteArry.push({
        OPTM_CONTAINER_GROUP: event[0],
        CompanyDBId: localStorage.getItem("CompID")
      });
    this.DeleteContnrGroup(cgDeleteArry);
  }

  DeleteContnrGroup(ddDeleteArry){
    this.showLoader = true;
    this.contnrServ.DeleteFromContainerGroup(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.GetDataForContainerGroups();
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
