import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContainerCreationService } from '../../services/container-creation.service';
import { Commonservice } from '../../services/commonservice.service';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-input-container-code',
  templateUrl: './input-container-code.component.html',
  styleUrls: ['./input-container-code.component.scss']
})
export class InputContainerCodeComponent implements OnInit {

  palletNo: string = "";
  @Input() titleMessage: any;
  @Input() yesButtonText: any;
  @Input() noButtonText: any;
  @Input() fromWhere: any;
  @Input() oSaveModel: any;
  @Output() isYesClick = new EventEmitter();
  showNoButton: boolean = true;
  showLoader: boolean = false;
  showLookup: boolean = true;
  lookupfor: string;
  containerCode: string = "";
  parentContainerCode: string = "";
  count: number = 0;
  ShowParentField : boolean = true;
  RemainingQty : any = 0;
  TotalQty : any=0;
  CreateFlag: boolean = false;
  TempContnrId: any = '';
  TempContnrCode: any = '';
  clickFlag : boolean = false;
  RadioAction: any = '';
  status: number=0;

  constructor(private commonservice: Commonservice, private translate: TranslateService, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router) {       
    }

  ngOnInit() {
    this.showLookup = true;
    this.showNoButton = true;
    this.CreateFlag = false;
    this.clickFlag = false;
    this.RadioAction = "Add";
    this.count = 0;    
    if (this.noButtonText == undefined || this.noButtonText == "") {
      this.showNoButton = false;
    }

    if(this.oSaveModel.HeaderTableBindingData[0].OPTM_ParentContainerType == "" || this.oSaveModel.HeaderTableBindingData[0].OPTM_ParentContainerType == undefined){
      this.ShowParentField = false;
    }    
  }

  public opened: boolean = true;  

  public close(status) {
    if (status == "yes") {        
        if (this.containerCode == undefined || this.containerCode == '') {
          this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
          return;
        }  
      }
      else if (status == "cancel" || status == "no") {
      if(this.CreateFlag){
        this.isYesClick.emit({
          Status: "yes",
          From: this.fromWhere,
          ContainerId: this.TempContnrId,
          ContainerCode: this.TempContnrCode,
          ParentContainerCode: this.parentContainerCode,
          Count: 0,
          ContnrStatus : this.status
        });
      }
      else{
        this.isYesClick.emit({
          Status: "no",
          From: this.fromWhere,
          ContainerCode: "",
          ParentContainerCode: "",
          Count: 0,
          ContnrStatus : this.status
        });                
      }
      this.opened = false;      
    }

    // this.isYesClick.emit({
    //   Status: status,
    //   From: this.fromWhere,
    //   ContainerCode: this.containerCode
    // });
    // this.opened = false;
  }

  public open() {
    this.opened = true;
  }

  getLookupValue($event) {
    if ($event != null && $event == "close") {
      //nothing to do
      return;
    }
    // else if (this.lookupfor == "toBinsList") {
    //   this.binNo = $event[0];
    // }
  }

  onParentContainerChange(){
    this.count = 0;
    if(this.parentContainerCode == '' || this.parentContainerCode == undefined){
      this.containerCode = '';
      this.RemainingQty = 0;
      return;
    }
    //alert(this.RadioAction);
    
    this.showLoader = true;
    this.containerCreationService.GetCountOfParentContainer(this.parentContainerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].Count == undefined){
            this.count= data[0].COUNT;  
          }
          else{
            this.count= data[0].Count;  
          }
         
          this.TotalQty =  this.oSaveModel.HeaderTableBindingData[0].OPTM_ParentPerQty;  
          this.RemainingQty = this.TotalQty - this.count;  
          this.IsvalidParentCode();   
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

  IsvalidParentCode(){

    let operation = 1;
    if(this.RadioAction == "Add"){
      operation = 1;
    }else{
      operation = 2;
    }   

    this.showLoader = true;
    this.containerCreationService.CheckContainer(this.parentContainerCode, this.oSaveModel.HeaderTableBindingData[0].OPTM_WHSE ,
    this.oSaveModel.HeaderTableBindingData[0].OPTM_BIN, this.oSaveModel.HeaderTableBindingData[0].OPTM_AUTORULEID,
    this.oSaveModel.HeaderTableBindingData[0].OPTM_GROUP_CODE,
    this.oSaveModel.HeaderTableBindingData[0].OPTM_SONO, this.oSaveModel.HeaderTableBindingData[0].OPTM_ParentContainerType,
    this.oSaveModel.HeaderTableBindingData[0].OPTM_PURPOSE,operation,this.oSaveModel.HeaderTableBindingData[0].OPTM_CREATEMODE, true,false).subscribe(
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
            this.parentContainerCode = '';
            this.RemainingQty = 0;
            this.containerCode = '';
            return;
          }
          else if(data.OPTM_CONT_HDR.length == 0){
            if(this.RadioAction == "Add"){
              this.CreateFlag = false;
              this.GenerateShipContainer('Parent');
            }
            else{
               this.toastr.error('', this.translate.instant("ParentContDoesNotExists"));
               this.parentContainerCode = '';
               this.RemainingQty = 0;
               this.containerCode = '';
            }
          }
          else if(data.OPTM_CONT_HDR.length > 0){
            if(data.OPTM_CONT_HDR[0].OPTM_STATUS == 3){
              this.toastr.error('', this.translate.instant("ParentContClosed"));
              this.parentContainerCode = '';
              this.RemainingQty = 0;
              this.containerCode = '';
              return;
            }
          }
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
    // this.containerCreationService.GetAllContainer(this.parentContainerCode).subscribe(
    //   (data: any) => {
    //     this.showLoader = false;
    //     if (data != undefined) {
    //       if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
    //         this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
    //           this.translate.instant("CommonSessionExpireMsg"));
    //         return;
    //       }
    //       if (data.length == 0) {
          
    //       if(this.RadioAction == "Add"){
    //         this.CreateFlag = false;
    //         this.GenerateShipContainer('Parent');
    //       }
    //       else{
    //          this.toastr.error('', this.translate.instant("ParentContDoesNotExists"));
    //          this.parentContainerCode = '';
    //          this.RemainingQty = 0;
    //          this.containerCode = '';
    //       }
    //     } 
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

  assignParentCont(){
    if (this.parentContainerCode != undefined && this.parentContainerCode != '' && this.ShowParentField) {
      this.showLoader = true;
      this.containerCreationService.InsertContainerinContainer(this.parentContainerCode, this.containerCode, this.RadioAction,
        this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTTYPE, this.oSaveModel.HeaderTableBindingData[0].OPTM_ParentContainerType).subscribe(
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
              if(this.RadioAction == 'Add'){
                this.toastr.success('', this.translate.instant("Container_Assigned_To_Parent"));
              }else{
                this.toastr.success('', this.translate.instant("Container_Removed_From_Parent"));
              }
              this.containerCode = '';
              this.CreateFlag = true;
              // this.TempContnrId = data[0].OPTM_CONTAINERID;
              // this.TempContnrCode = this.containerCode;
              // this.containerCode = '';
              // this.status = data[0].OPTM_STATUS; 

              this.getCountofParentContType();
              
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
    else{
      this.toastr.error('', this.translate.instant("Cont_already_exists"));
      this.containerCode = '';
      return;
    }
  }

  onContainerCodeChange(){

    if(this.containerCode == "" || this.containerCode == undefined){
      return;
    }

    let operation = 1;
    if(this.RadioAction == "Add"){
      operation = 1;
    }else{
      operation = 2;
    }

    this.showLoader = true;
    this.containerCreationService.CheckContainer(this.containerCode, this.oSaveModel.HeaderTableBindingData[0].OPTM_WHSE ,
    this.oSaveModel.HeaderTableBindingData[0].OPTM_BIN, this.oSaveModel.HeaderTableBindingData[0].OPTM_AUTORULEID,
    this.oSaveModel.HeaderTableBindingData[0].OPTM_GROUP_CODE,
    this.oSaveModel.HeaderTableBindingData[0].OPTM_SONO, this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTTYPE,
    this.oSaveModel.HeaderTableBindingData[0].OPTM_PURPOSE, operation, this.oSaveModel.HeaderTableBindingData[0].OPTM_CREATEMODE, false, true).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (data.OUTPUT[0].RESULT != undefined && data.OUTPUT[0].RESULT != null && data.OUTPUT[0].RESULT != '') {
            // this.toastr.error('', data[0].RESULT);
            // this.containerCode = '';           
            // return;
            this.assignParentCont();
          }
          else if(data.OPTM_CONT_HDR.length == 0){
            if(this.RadioAction == "Add"){
              this.CreateFlag = false;
              this.GenerateShipContainer('child'); 
            }
            else if(this.RadioAction == "Remove"){
               this.toastr.error('', this.translate.instant("Cont_Does_Not_Exists"));
               this.containerCode = '';
            }
          }
          else if(data.OPTM_CONT_HDR.length > 0){
            // if(data.OPTM_CONT_HDR[0].OPTM_STATUS == 3){
            //   this.toastr.error('', this.translate.instant("ParentContClosed"));
            //   this.parentContainerCode = '';
            //   this.RemainingQty = 0;
            //   this.containerCode = '';
            //   return;
            // }
            this.assignParentCont();
          }
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

    // this.CreateFlag = false;
    // this.GenerateShipContainer('child');    
  }

  getCountofParentContType(){
    this.showLoader = true;
    this.containerCreationService.GetCountOfParentContainer(this.parentContainerCode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].Count == undefined){
            this.count= data[0].COUNT;  
          }
          else{
            this.count= data[0].Count;  
          }
         
          this.TotalQty =  this.oSaveModel.HeaderTableBindingData[0].OPTM_ParentPerQty;  
          this.RemainingQty = this.TotalQty - this.count; 
          
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

  GenerateShipContainer(type) {

    let tempModel:any = {};
    tempModel.HeaderTableBindingData  = [];
    tempModel.OtherItemsDTL = [];
    tempModel.OtherBtchSerDTL = [];

    if(this.CreateFlag){
      return;
    }

    this.CreateFlag = true;

    if(this.ShowParentField && (this.parentContainerCode == "" || this.parentContainerCode == undefined)){
      this.toastr.error('', this.translate.instant("Enter_Parent_ContCode"));
      return;
    }

    if(this.ShowParentField && this.RemainingQty <= 0 ){
      this.toastr.error('', this.translate.instant("Cannot_Create_Container"));
      return;
    }    
    

    if(type == 'child'){

      if(this.containerCode == "" || this.containerCode == undefined){
        this.toastr.error('', this.translate.instant("Enter_Container_Code"));
        return;
      }  

      this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTCODE = this.containerCode;
      this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTAINERCODE = this.containerCode;
      this.oSaveModel.HeaderTableBindingData[0].OPTM_PARENTCODE = this.parentContainerCode; 
      
      tempModel.HeaderTableBindingData = this.oSaveModel.HeaderTableBindingData;
      tempModel.OtherItemsDTL = this.oSaveModel.OtherItemsDTL;
      tempModel.OtherBtchSerDTL = this.oSaveModel.OtherBtchSerDTL;
    }
    else{
      this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTCODE = this.parentContainerCode;
      this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTAINERCODE = this.parentContainerCode;
      this.oSaveModel.HeaderTableBindingData[0].OPTM_PARENTCODE = '';        
      
      tempModel.HeaderTableBindingData = this.oSaveModel.HeaderTableBindingData;
      tempModel.HeaderTableBindingData[0].OPTM_CONTTYPE = this.oSaveModel.HeaderTableBindingData[0].OPTM_ParentContainerType;
      tempModel.OtherItemsDTL = [];
      tempModel.OtherBtchSerDTL = [];
    } 

    if(this.RadioAction == "Add"){
    this.showLoader = true;
    this.containerCreationService.GenerateShipContainer(tempModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if(data == null || data.length == 0){
            this.toastr.error('', this.translate.instant("Code_not_generated")); 
          } 

          if(data != null && data.length > 0){
            if(data[0].ErrMsg != undefined && data[0].ErrMsg != null){
              this.toastr.error('',data[0].ErrMsg);
              return;
            } 

            if(data[0].RESULT != undefined && data[0].RESULT != null){
              this.toastr.error('', data[0].RESULT);
              return;             
            }

            if(type == 'child'){
              this.toastr.success('', this.translate.instant("ContainerCreatedSuccessMsg"));           
            }    
            else{
              this.toastr.success('', this.translate.instant("ParentContainerCreatedSuccessMsg"));
              this.getCountofParentContType();
              return;
            }   

            this.CreateFlag = true;
            this.TempContnrId = data[0].OPTM_CONTAINERID;
            this.TempContnrCode = this.containerCode;
            this.containerCode = '';
            this.status = data[0].OPTM_STATUS; 

            if(this.ShowParentField){
              this.getCountofParentContType();
            }   
            
            // this.isYesClick.emit({
            //   Status: "yes",
            //   From: this.fromWhere,
            //   ContainerId: data[0].OPTM_CONTAINERID,
            //   ParentContainerCode: this.parentContainerCode,
            //   ContainerCode: this.containerCode,
            //   Count: this.count
            // });
            //this.opened = false;

          } else {
            this.toastr.error('', this.translate.instant("Input_Code_exist"));
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
   else{
    this.showLoader = true;
    this.containerCreationService.RemoveShipContainer(this.oSaveModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        this.CreateFlag = true;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if(data == null || data.length == 0){
            this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
            return;
          } 

          if(data != null && data.length > 0){
            if(data[0].RESULT != undefined && data[0].RESULT != null){
              if(data[0].RESULT == "Success"){
                this.toastr.success('', this.translate.instant("ContainerRemovedSuccessMsg")); 
                
              }
              else{
                this.toastr.success('', data[0].RESULT); 
                return;
              }              
            } 
            else{
              this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
              return;
            }  

           // this.TempContnrId = data[0].OPTM_CONTAINERID;
           // this.TempContnrCode = this.containerCode;
           // this.containerCode = '';

            if(this.ShowParentField){
              this.onParentContainerChange();
            }           
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
}
