import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wmsugmapping-add-update',
  templateUrl: './wmsugmapping-add-update.component.html',
  styleUrls: ['./wmsugmapping-add-update.component.scss']
})
export class WMSUGMappingAddUpdateComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  constructor(private translate: TranslateService,private commonservice: Commonservice, private toastr: ToastrService,  private router: Router) { 
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
  }

  getLookupValue(event) {
    localStorage.setItem("DD_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "");
    //this.ddmainComponent.ddComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }
  onDeleteRowClick(event){
    var ddDeleteArry: any[] = [];
      ddDeleteArry.push({
        OPTM_DOCKDOORID: event[0],
        CompanyDBId: localStorage.getItem("CompID")
      });
    //this.DeleteFromDockDoor(ddDeleteArry);
  }

  onCopyItemClick(event) {
    localStorage.setItem("DD_ROW", JSON.stringify(event));
    localStorage.setItem("Action", "copy");
    //this.ddmainComponent.ddComponent = 2;
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
    //this.DeleteFromDockDoor(ddDeleteArry);
  }
}
