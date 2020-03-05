import { Component, OnInit } from '@angular/core';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BinrulemasterComponent } from '../binrulemaster/binrulemaster.component';
import { BinruleService } from '../../services/binrule.service';

@Component({
  selector: 'app-binruleview',
  templateUrl: './binruleview.component.html',
  styleUrls: ['./binruleview.component.scss']
})
export class BinruleviewComponent implements OnInit {
  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  PurposeList: any[] = ["Shipping", "WIP","Receiving","Transfer"];
  RuleTypeList: any[] = ["Pick", "Putaway"];
  constructor(private binRuleServie:BinruleService, private commonservice: Commonservice, private router: Router, private toastr: ToastrService, private translate: TranslateService,
    private binRuleMasterComponent: BinrulemasterComponent) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
   this.GetDataForBinRule();
  }


  GetDataForBinRule() {
    this.showLoader = true;
    this.binRuleServie.GetDataForBinRuleList().subscribe(
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
          for (var i = 0; i < this.serviceData.length; i++) {
              this.serviceData[i].OPTM_RULE_TYPE_Text = "";
              this.serviceData[i].OPTM_PURPOSE_Text = "";
          }
          
          for (var j = 0; j < this.serviceData.length; j++) {
            if (this.serviceData[j].OPTM_PURPOSE == 1) {
              this.serviceData[j].OPTM_PURPOSE_Text = this.PurposeList[0];
            } else if (this.serviceData[j].OPTM_PURPOSE == 2) {
              this.serviceData[j].OPTM_PURPOSE_Text = this.PurposeList[1];
            } else if (this.serviceData[j].OPTM_PURPOSE == 3) {
              this.serviceData[j].OPTM_PURPOSE_Text = this.PurposeList[2];
            } else if (this.serviceData[j].OPTM_PURPOSE == 4) {
              this.serviceData[j].OPTM_PURPOSE_Text = this.PurposeList[3];
            }

            if (this.serviceData[j].OPTM_RULE_TYPE == 1) {
              this.serviceData[j].OPTM_RULE_TYPE_Text = this.RuleTypeList[0];
            } else if (this.serviceData[j].OPTM_RULE_TYPE == 2) {
              this.serviceData[j].OPTM_RULE_TYPE_Text = this.RuleTypeList[1];
            }  
        }
        this.lookupfor = "BinRuleList";
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

  IsValidBinRule(whsRule, whsCode, whsZone,purpose) {
    this.showLoader = true;
    this.binRuleServie.IsValidBinRule(whsRule, whsCode, whsZone,purpose).then(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          localStorage.setItem("binRule_Grid_Data", JSON.stringify(data));
          this.binRuleMasterComponent.binRuleComponent = 2;
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
    localStorage.setItem("binRule_ROW", JSON.stringify(event));    
    localStorage.setItem("brAction", "update");
    //it means we dont need to redirect on its click.
    this.IsValidBinRule(event[0], event[3], event[4],event[2]);
  }

  onCopyItemClick(event) {
    localStorage.setItem("binRule_ROW", JSON.stringify(event));  
    localStorage.setItem("brAction", "copy");  
    this.IsValidBinRule(event[0], event[3], event[4],event[2]);
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("binRule_ROW", "");
    localStorage.setItem("brAction", "");
    this.binRuleMasterComponent.binRuleComponent = 2;
  }

  OnDeleteSelected(event){
    this.event = event;
    this.dialogFor = "DeleteSelected";
    this.yesButtonText = this.translate.instant("yes");
    this.noButtonText = this.translate.instant("no");
    this.showConfirmDialog = true;
    this.dialogMsg = this.translate.instant("DoYouWantToDeleteConf");
  }

  onDeleteRowClick(event){
    this.event = event;
    this.dialogFor = "Delete";
    this.yesButtonText = this.translate.instant("yes");
    this.noButtonText = this.translate.instant("no");
    this.showConfirmDialog = true;
    this.dialogMsg = this.translate.instant("DoYouWantToDeleteConf");
  }
  
  DeleteFromBinRule(ddDeleteArry) {
    this.showLoader = true;
    this.binRuleServie.DeleteBinRule(ddDeleteArry).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.GetDataForBinRule();
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




  showConfirmDialog: boolean = false;
  dialogMsg: string;
  yesButtonText: string;
  noButtonText: string;
  dialogFor: string;
  event: any = [];

  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("Delete"):
        var ddDeleteArry: any[] = [];
        ddDeleteArry.push({
          CompanyDBId: localStorage.getItem("CompID"),
          OPTM_WHS_RULE: this.event.OPTM_WHS_RULE,
          OPTM_WHSCODE: this.event.OPTM_WHSCODE,
          OPTM_WHS_ZONE: this.event.OPTM_WHS_ZONE,
        });
      this.DeleteFromBinRule(ddDeleteArry);
          break;
        case ("DeleteSelected"): // case for multiple delete.
        if(this.event.length <= 0){
          this.toastr.error('', this.translate.instant("CAR_deleteitem_Msg"));
          return;
        }
        var ddDeleteArry: any[] = [];
        for(var i=0; i<this.event.length; i++){
          ddDeleteArry.push({       
            OPTM_WHS_RULE: this.event[i].OPTM_WHS_RULE,
            OPTM_WHSCODE: this.event[i].OPTM_WHSCODE,
            OPTM_WHS_ZONE: this.event[i].OPTM_WHS_ZONE,     
            CompanyDBId: localStorage.getItem("CompID")
          });
        }
        this.DeleteFromBinRule(ddDeleteArry);
          break;

      }
    } else {
      if ($event.Status == "no") {
        switch ($event.From) {
          case ("delete"):
            break;
          case ("DeleteSelected"):
            break;

        }
      }
    }
  }


}
