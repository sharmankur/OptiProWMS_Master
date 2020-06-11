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
  @Input() currentValue: any;  
  @Input() fromWhere: any;
  @Input() oDataModel: any;
  @Output() isYesClick = new EventEmitter();
  commonData: any = new CommonData(this.translate);
  IntContainerCode: any = '';
  showLoader: boolean = false;
  showLookup: boolean = false;
  serviceData: any[];
  lookupfor: string;
  forInternal: boolean = false;
  ParentContainerCode: any = '';
  ChildContnrCode: any = '';
  ContID : any = 0;
  IntContItemQuantity: number=0;
  bsrListByContainerId: any = [];
  intContainerStatus: number = 0;
  
  constructor(private commonservice: Commonservice, private translate: TranslateService, private toastr: ToastrService,
     private router: Router, private containerCreationService:ContainerCreationService) { }

  ngOnInit() {  
    this.IntContainerCode = this.currentValue;
    if(this.oDataModel.HeaderTableBindingData[0].ShowLookupFor == "Internal"){
      this.forInternal = true;
    }else{
      this.forInternal = false;
      this.ChildContnrCode =  this.oDataModel.HeaderTableBindingData[0].OPTM_CONTCODE;
    }
  }

  GetListOfContainerBasedOnRule(action) {

    let IntCode = '';
    if(action == 'blur'){
      if (this.IntContainerCode == undefined || this.IntContainerCode == "") {
        return;
      }
      IntCode = this.IntContainerCode
    }else{     
      IntCode = '';
    }

    this.showLoader = true;
    this.containerCreationService.GetListOfContainerBasedOnRule(this.oDataModel.HeaderTableBindingData[0].OPTM_AUTORULEID,
      this.oDataModel.HeaderTableBindingData[0].OPTM_ITEMCODE, this.oDataModel.HeaderTableBindingData[0].OPTM_WHSE,
      this.oDataModel.HeaderTableBindingData[0].OPTM_BIN,IntCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if(action == 'lookup'){            
            if(data.length == 0){
              this.toastr.error('',this.translate.instant("NoContFound"));
              return;
            }
            this.showLookup = true;
            this.serviceData = data;
            this.lookupfor = "ContainerIdList";
          }else{
            if(data.length == 0){
              this.IntContainerCode = '';
              this.toastr.error('', this.translate.instant("InvalidContainerId"));
              return;
            }
            this.IntContainerCode = data[0].OPTM_CONTCODE;
            this.ContID = data[0].OPTM_CONTAINERID;
            this.intContainerStatus= data[0].OPTM_STATUS;
            this.GetListOfBatchSerOfSelectedContainerID(data[0].OPTM_CONTAINERID, data[0].OPTM_ITEMCODE); 
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

  parentOnChangeStarted = false;
  onParentContainerCodeChange(){
    if(this.ParentContainerCode == '' || this.ParentContainerCode == undefined){      
      return;
    }     
    this.parentOnChangeStarted = true;
    this.showLoader = true;
    this.containerCreationService.CheckContainer(this.ParentContainerCode, this.oDataModel.HeaderTableBindingData[0].OPTM_WHSE ,
      this.oDataModel.HeaderTableBindingData[0].OPTM_BIN, this.oDataModel.HeaderTableBindingData[0].OPTM_AUTORULEID,
      this.oDataModel.HeaderTableBindingData[0].OPTM_GROUP_CODE,
      this.oDataModel.HeaderTableBindingData[0].OPTM_SONO, this.oDataModel.HeaderTableBindingData[0].OPTM_ParentContainerType,
      this.oDataModel.HeaderTableBindingData[0].OPTM_PURPOSE, 1,this.oDataModel.HeaderTableBindingData[0].OPTM_CREATEMODE, true).subscribe(
        (data: any) => {
          this.showLoader = false;
          if (data != undefined) {
            if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
              this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
                this.translate.instant("CommonSessionExpireMsg"));
              return;
            }

            if (data.OUTPUT[0].RESULT != undefined && data.OUTPUT[0].RESULT != null && data.OUTPUT[0].RESULT != '') {
              this.toastr.error('', data.OUTPUT[0].RESULT);
              this.ParentContainerCode = '';
              return;
            }
            else if(data.OPTM_CONT_HDR.length == 0){
              this.oDataModel.HeaderTableBindingData[0].OPTM_CONTAINERCODE = "" + this.ParentContainerCode;
              this.generateParentContnr();
            }
            else if(data.OPTM_CONT_HDR.length > 0){
              if(data.OPTM_CONT_HDR[0].OPTM_STATUS == 3){
                this.toastr.error('', this.translate.instant("ParentContClosed"));
                this.ParentContainerCode = '';
                return;
              }
            }


           // if (data.length > 0) {
            //  //Container is already created but there is some error
          //     if (data[0].RESULT != undefined && data[0].RESULT != null) {
          //       this.toastr.error('', data[0].RESULT);
          //       this.ParentContainerCode = '';
          //       return;
          //     }
          //     else {
               
          //       if(data[0].OPTM_STATUS == 3){
          //         this.toastr.error('', "Parent Container is Closed");
          //         this.ParentContainerCode = '';
          //         return;
          //       }
          //  }          
          // } else if (data.length == 0) {
          //   this.oDataModel.HeaderTableBindingData[0].OPTM_CONTAINERCODE = "" + this.ParentContainerCode;
          //   this.generateParentContnr();
          // } else {
          //   this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
          // }
        }else {
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
      


    // this.showLoader = true;
    // this.containerCreationService.GetAllContainer(this.ParentContainerCode).subscribe(
    //   (data: any) => {
    //     this.showLoader = false;
    //     if (data != undefined) {
    //       if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
    //         this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
    //           this.translate.instant("CommonSessionExpireMsg"));
    //         return;
    //       }
    //       if (data.length == 0) {
           
    //         this.oDataModel.HeaderTableBindingData[0].OPTM_CONTAINERCODE = "" + this.ParentContainerCode;
    //         this.generateParentContnr();
           
           
    //       } else {
            
                
    //       }
    //     } else {
    //       this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
    //     }
    //   },
    //   error => {
    //     this.showLoader = false;
    //     if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
    //       this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
    //     }
    //     else {
    //       this.toastr.error('', error);
    //     }
    //   }
    // );
  }

  generateParentContnr(){
    this.showLoader = true;
    this.containerCreationService.GenerateShipContainer(this.oDataModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {

            if(data[0].ErrMsg != undefined && data[0].ErrMsg != null){
              this.toastr.error('', data[0].ErrMsg);
              return;
            }

            if(data[0].RESULT != undefined && data[0].RESULT != null){              
                this.toastr.error('', data[0].RESULT);
                return;            
            }

            this.toastr.success('', this.translate.instant("ParentContainerCreatedSuccessMsg"));
          }
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

  onConfirmParentClick(){
    if (this.ParentContainerCode == undefined || this.ParentContainerCode == '') {
      this.toastr.error('', this.translate.instant("Enter_Parent_ContCode"));
      return;
    }   

    this.showLoader = true;
    this.containerCreationService.InsertContainerinContainer(this.ParentContainerCode, this.ChildContnrCode, "",
    this.oDataModel.HeaderTableBindingData[0].OPTM_CHILDCONTTYPE, this.oDataModel.HeaderTableBindingData[0].OPTM_ParentContainerType).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
        if (data.length > 0) {
          if (data[0].RESULT != undefined && data[0].RESULT != null) {

          //if (data[0].RESULT == "Data Saved") {           
            if (data[0].RESULT.indexOf("Data Saved") > -1) {
              if (data[0].RESULT.indexOf("Add") > -1) {
                this.toastr.success('', this.translate.instant("Container_Assigned_To_Parent"));  
              }else{
                this.toastr.success('', this.translate.instant("Container_Removed_From_Parent"));
              }            

              this.isYesClick.emit({
              Status: "yes",
              From: "AddToParentContainer",
              ParentContainerCode: this.ParentContainerCode
            });
          }
          else {
            this.toastr.error('', data[0].RESULT);
          }
        }
        else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  getLookupDataValue($event) {
    //this.showOtherLookup = false;
    this.showLookup = false;
    if ($event != null && $event == "close") {
      return;
    }
    else {
      if (this.lookupfor == "ContainerIdList") {       
        this.IntContainerCode = $event.OPTM_CONTCODE;
        this.ContID = $event.OPTM_CONTAINERID;
        this.IntContItemQuantity = $event.OPTM_QUANTITY;
        this.intContainerStatus = $event.OPTM_STATUS;
        this.GetListOfBatchSerOfSelectedContainerID($event.OPTM_CONTAINERID, $event.OPTM_ITEMCODE);        
      }
    }
  }
  
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
      if(this.forInternal){
        this.isYesClick.emit({
          Status: "no",
          From: "InternalContainer",
          IntContainerCode: "",
          ContId: 0,
          intContainerStatus: 0,
          BatSerList : []       
        });  
      } else{ 
        this.isYesClick.emit({
          Status: "no",
          From: "AddToParentContainer",
          ParentContainerCode: "" 
        }); 
    }               
   }
   else{
    if(this.forInternal){
      if (this.currentValue != undefined || this.currentValue != '') {
        if (this.IntContainerCode == undefined || this.IntContainerCode == '') {
          this.toastr.error('Convert to Constant', "Internal container cleared");            
        }
      } else
      if (this.IntContainerCode == undefined || this.IntContainerCode == '') {
        this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
        return;
      }
      this.isYesClick.emit({
        Status: "yes",
        From: "InternalContainer",
        IntContainerCode: this.IntContainerCode,
        ContId: this.ContID,
        intContainerStatus: this.intContainerStatus,
        BatSerList : this.bsrListByContainerId,
        IntContItemQuantity: this.IntContItemQuantity
      });  
    }
    else{    

      if(this.parentOnChangeStarted){
        this.onConfirmParentClick();
      }else{
        setTimeout(()=>{
          this.onConfirmParentClick();
        }, 400)
      }
     

    // this.isYesClick.emit({
    //   Status: "yes",
    //   From: "AddToParentContainer",
    //   ParentContainerCode: this.ParentContainerCode
    // }); 
   } 
   }
 }

}
