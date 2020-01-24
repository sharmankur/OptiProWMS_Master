import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemCodeGenerationComponent } from '../item-code-generation/item-code-generation.component';
import { MaskingService } from 'src/app/services/masking.service';
import { Commonservice } from 'src/app/services/commonservice.service';

@Component({
  selector: 'app-item-code-generation-view',
  templateUrl: './item-code-generation-view.component.html',
  styleUrls: ['./item-code-generation-view.component.scss']
})
export class ItemCodeGenerationViewComponent implements OnInit {
  showLoader: boolean = false;
  showAddRowbtn: boolean = true;
  itemCodeRowList: any = [];
  serviceData: any[];
  lookupfor: string;
  showLookupLoader = true;

  constructor(private translate: TranslateService, private router: Router, private toastr: ToastrService,
    private itemCodeGenComponent: ItemCodeGenerationComponent, private maskingService: MaskingService,
    private commonService: Commonservice) { }

  ngOnInit() {
    this.itemCodeGenComponent.itemCodeGenComponent = 1;
    this.getItemGenerationData();
    // this.itemCodeRowList.push({
    //   rowindex: 1,
    //   stringtype: 1,
    //   string: "absccsdcsd",
    //   length: "",
    //   operations: 1,
    //   delete: "",
    //   CompanyDBId: localStorage.getItem("CompID"),
    //   codekey: "Test",
    //   CreatedUser: localStorage.getItem("UserId"),
    //   isOperationDisable: true
    // });
    // this.showLookupLoader = false;
    // this.serviceData = this.itemCodeRowList;
    // this.lookupfor = "ItemCodeGenRowView"

  }

  pageNumber: any = "1";
  perPageItem: any = "20";
  getItemGenerationData() {
    this.showLoader = true;
    this.maskingService.viewItemGenerationData("", this.pageNumber, this.perPageItem).subscribe(
      (data: any) => {
        console.log("data: " + data);
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonService.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.itemCodeRowList = data;
            this.serviceData = data;
            this.showLookupLoader = false;
            this.lookupfor = "ItemCodeGenRowView"
          } else {
            this.toastr.error('', data[0].RESULT);
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonService.unauthorizedToken(error, this.translate.instant("token_expired"));
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
    this.itemCodeGenComponent.itemCodeGenComponent = 2;
  }

  onCopyItemClick(event) {
    console.log("onCopyItemClick" + event)
    localStorage.setItem("Action", "copy");
    localStorage.setItem("Row", JSON.stringify(event));
    // this.itemCodeGenComponent.itemCodeGenComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  onAddClick() {
    localStorage.setItem("Action", "add");
    this.itemCodeGenComponent.itemCodeGenComponent = 2;
  }

  onDeleteClick() {

  }

  OnDeleteSelected(event) {//called on delete multiple selected items
    console.log("OnDeleteSelected" + event)
    // localStorage.setItem("Action", "delete");
    // var ddDeleteArry: any[] = [];
    // for(var i=0; i<event.length; i++){
    //   ddDeleteArry.push({       
    //     OPTM_RULEID: event[i].OPTM_CONTAINER_TYPE,
    //     OPTM_CONTTYPE: event[i].OPTM_PARENT_CONTTYPE,
    //     CompanyDBId: localStorage.getItem("CompID")
    //   });
    // }
    // this.deleteSelectedData("");
  }

  onDeleteRowClick(event) {
    console.log("onDeleteRowClick" + event.codekey)
    // this.deleteSelectedData(event.codekey);
    // var ddDeleteArry: any[] = [];
    //   ddDeleteArry.push({
    //     CompanyDBId: localStorage.getItem("CompID"),
    //     OPTM_CONTAINER_TYPE: event[0],
    //     OPTM_PARENT_CONTTYPE: event[1],
    //   });
    //this.DeleteFromContainerRelationship(ddDeleteArry);
  }

  deleteSelectedData(itemCodeKey: string) {
    this.showLoader = true;
    this.maskingService.DeleteSelectedData(itemCodeKey).subscribe(
      (data: any) => {
        console.log("data: " + data);
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonService.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {

          } else {
            this.toastr.error('', data[0].RESULT);
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonService.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }
}
