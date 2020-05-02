import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '@angular/router';

import { CARMasterService } from '../../services/carmaster.service';
import { CARMainComponent } from '../../carmaster/carmain/carmain.component';
import { DocumentNumberingService } from '../../services/document-numbering.service';
@Component({
  selector: 'app-document-numbering',
  templateUrl: './document-numbering.component.html',
  styleUrls: ['./document-numbering.component.scss']
})

export class DocumentNumberingComponent implements OnInit {

  lookupfor: string;
  BtnTitle: string;

  CTR_ROW: any;
  serviceData: any[];
  public DocGridData: any[] = [];

  public Save: any = {};

  showLoader: boolean = false;
  isUpdate: boolean = false;
  hideLookup: boolean = true;
  index: number = -1;
  public ddlBusiness: any[];
  public selectedValue: string = '';
  // @ViewChild("display_name") display_name;

  constructor(private commonservice: Commonservice, private toastr: ToastrService,
    private translate: TranslateService, private carmainComponent: CARMainComponent,
    private carmasterService: CARMasterService, private router: Router, private docService: DocumentNumberingService
  ) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.Save.Comp = [];
    this.Save.Data = [];
    this.GetConsolidatedData();
    this.fillDDL();
    this.BtnTitle = this.translate.instant("CT_Add");
    this.isUpdate = false;
  }

  fillDDL() {
    this.ddlBusiness = [];
    this.ddlBusiness.push(
      { text: "Container", value: "Container" },
      { text: "Shipment", value: "Shipment" },
      { text: "Picklist", value: "Picklist" },
      { text: "Cluster", value: "Cluster" },
      { text: "Warehouse Task", value: "Warehouse Task" });
  }

  GetConsolidatedData() {
    this.docService.GetDocumentallData("").subscribe(
      resp => {
        this.DocGridData = resp;
      },
      error => {
        console.log("Error:", error);
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        }
      });
  }

  onCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick() {
    if (this.DocGridData.length > 0) {
      for (let i = 0; i < this.DocGridData.length; i++) {
        if (this.DocGridData[i].OPTM_FUNCTION_AREA === '' || this.DocGridData[i].SelectedBusiness === '') {
          this.DocGridData.splice(i, 1);
        }
      }
      this.Save.Comp = [];
      this.Save.Data = [];

      this.Save.Data = this.DocGridData;
      this.Save.Comp.push({ CompanyDBId: localStorage.getItem("CompID") });
      this.docService.AddUpdateDocNumbering(this.Save).subscribe(
        resp => {
          console.log("response:", resp);
        },
        error => {
          console.log("Error:", error);
          if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
            this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
          }
          else {
            this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
          }
        });
    }
  }
  onChangeBusinessObject(event, dataitem, index) {
    var IsDDLValueDuplicate = this.DocGridData.filter(function (el) {
      return el.OPTM_BUSINESS_OBJECT == dataitem.OPTM_BUSINESS_OBJECT;
    });
    this.DocGridData[index].OPTM_BUSINESS_OBJECT = event.value
    if (IsDDLValueDuplicate.length > 0) {
      // document.getElementById("display_name").focus()
      // this.DocGridData.splice(index, 1);
      this.toastr.error('', this.translate.instant("DuplicateBusinessMsg"));
      setTimeout(() => {
        this.DocGridData[index].OPTM_BUSINESS_OBJECT = ''
      }, 100)
    }
    console.log(this.DocGridData)
  }
  getLookupValue($event) {
    if ($event != null && $event == "close") {
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "DocNumbering") {
      for (let i = 0; i < this.DocGridData.length; ++i) {
        if (i === this.index) {
          this.DocGridData[i]["OPTM_CODE"] = $event[0];
        }
      }
    }
  }

  AddRow() {
    this.DocGridData.push({
      OPTM_FUNCTION_AREA: "Shipping", OPTM_BUSINESS_OBJECT: "", OPTM_CODE: "", OPTM_DEFAULT: "N",
      OPTM_CONTEXT: null, OPTM_CONTEXT_DESC: null, OPTM_CONTEXT_MINVALUE: null, OPTM_CONTEXT_MAXVALUE: null,
      OPTM_CREATEDBY: null, OPTM_CREATEDATE: null, OPTM_MODIFIEDBY: null, OPTM_MODIFYDATE: null
    });

  }

  GetItemCodeList(index) {
    this.showLoader = true;
    this.index = index;
    this.docService.GetLookupValue().subscribe(
      data => {

        this.showLoader = false;
        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.hideLookup = false;
          this.serviceData = data;
          this.lookupfor = "DocNumbering";
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  openConfirmForDelete(rowIndex, gridItem) {
    this.DocGridData.splice(rowIndex, 1);

    gridItem = this.DocGridData;
  }

  isValidateCalled: boolean = false;

  OnAddUpdateClick() {
    for (var i = 0; i < this.DocGridData.length; i++) {
      if (this.DocGridData[i].OPTM_BUSINESS_OBJECT == undefined || this.DocGridData[i].OPTM_BUSINESS_OBJECT == '') {
        this.toastr.error('', this.translate.instant("BusObjAndCodeBlank"));
        return
      } else if (this.DocGridData[i].OPTM_CODE == undefined || this.DocGridData[i].OPTM_CODE == '') {
        this.toastr.error('', this.translate.instant("BusObjAndCodeBlank"));
        return
      }
    }

    this.showLoader = true;
    this.docService.AddUpdateDocNumbering(this.DocGridData).subscribe(
      data => {

        this.showLoader = false;
        if (data != undefined && data.OUTPUT.length > 0) {
          if (data.OUTPUT[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          // this.hideLookup = false;
          // this.serviceData = data;
          // this.lookupfor = "DocNumbering";
          if (data.OUTPUT.length > 0) {
            if (data.OUTPUT[0].RESULT == "Data Saved") {
              this.toastr.success('', data.OUTPUT[0].RESULT)
            } else {
              this.toastr.error('', data.OUTPUT[0].RESULT)
            }
            this.GetConsolidatedData();
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  // onCodeChange(value, idx) {
  //   for (let i = 0; i < this.DocGridData.length; ++i) {
  //     if (i === idx) {
  //       this.DocGridData[i].OPTM_CODE = value;
  //     }
  //   }
  // }

  onCodeChange(value, idx) {
    if(value == undefined ||  value == ''){
      return
    }

    this.docService.GetDocumentallData(value).subscribe(
      resp => {
        if(resp.length > 0){
          this.DocGridData[idx].OPTM_CODE = resp[0].OPTM_CODE;
        } else {
          this.DocGridData[idx].OPTM_CODE = "";
          this.toastr.error('', this.translate.instant("InvalidCode"));
        }
        this.DocGridData = resp;
      },
      error => {
        console.log("Error:", error);
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        }
      }); 
  }
}

