import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { CommonData } from 'src/app/models/CommonData';
import { ContainerCreationService } from 'src/app/services/container-creation.service';

@Component({
  selector: 'app-input-internal-container',
  templateUrl: './input-internal-container.component.html',
  styleUrls: ['./input-internal-container.component.scss']
})
export class InputInternalContainerComponent implements OnInit {

  @Input() titleMessage: any;
  @Input() yesButtonText: any;
  @Input() noButtonText: any;
  @Input() fromWhere: any;
  @Input() oDataModel: any;
  @Output() isYesClick = new EventEmitter();
  commonData: any = new CommonData(this.translate);
  IntContainerCode: any = '';
  showLoader: boolean = false;
  showLookup: boolean = false;
  serviceData: any[];
  lookupfor: string;
  
  constructor(private commonservice: Commonservice, private translate: TranslateService, private toastr: ToastrService,
     private router: Router, private containerCreationService:ContainerCreationService) { }

  ngOnInit() {
  this.IntContainerCode = '';
  }

  GetListOfContainerBasedOnRule() {
    this.showLoader = true;
    this.containerCreationService.GetListOfContainerBasedOnRule(this.oDataModel.HeaderTableBindingData[0].OPTM_AUTORULEID,
      this.oDataModel.HeaderTableBindingData[0].OPTM_ITEMCODE, this.oDataModel.HeaderTableBindingData[0].OPTM_WHSE,
      this.oDataModel.HeaderTableBindingData[0].OPTM_BIN).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookup = true;
          this.serviceData = data;
          this.lookupfor = "ContainerIdList";
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

  getLookupDataValue($event) {
    //this.showOtherLookup = false;
    this.showLookup = false;
    if ($event != null && $event == "close") {
      return;
    }
    else {
      if (this.lookupfor == "ContainerIdList") {       
        this.IntContainerCode = $event.OPTM_CONTAINERID;
        this.GetListOfBatchSerOfSelectedContainerID($event.OPTM_CONTAINERID, $event.OPTM_ITEMCODE);        
      }
    }
  }

  bsrListByContainerId: any = []
  GetListOfBatchSerOfSelectedContainerID(cId: any, itemCode: any) {
    // this.showLoader = true;
    var result = false;
    this.containerCreationService.GetListOfBatchSerOfSelectedContainerID(cId, itemCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.bsrListByContainerId = data;
        } else {
          // this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        result = false;
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result;
  }

  public close(status) {   
    if (status == "cancel" || status == "no") {   
     this.isYesClick.emit({
       Status: "no",
       From: "InternalContainer",
       IntContainerCode: "",
       BatSerList : []       
     });                
   }
   else{
    if (this.IntContainerCode == undefined || this.IntContainerCode == '') {
      this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
      return;
    }
    this.isYesClick.emit({
      Status: "yes",
      From: "InternalContainer",
      IntContainerCode: this.IntContainerCode,
      BatSerList : this.bsrListByContainerId
    });  
   }
 }

}
