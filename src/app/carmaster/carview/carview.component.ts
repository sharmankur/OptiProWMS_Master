import { Component, OnInit } from '@angular/core';
import { Commonservice } from '../../services/commonservice.service';
import { TranslateService, LangChangeEvent } from '../../../../node_modules/@ngx-translate/core';
import { Router } from '../../../../node_modules/@angular/router';
import { CARMainComponent } from '../carmain/carmain.component';
import { CARMasterService } from '../../services/carmaster.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';

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
    this.carmainComponent.carComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("CAR_ROW", "");
    this.carmainComponent.carComponent = 2;
  }

  onEditClick(){
    this.carmainComponent.carComponent = 2;
  }

  onDeleteRowClick(){
    this.carmainComponent.carComponent = 2;
  }


}
