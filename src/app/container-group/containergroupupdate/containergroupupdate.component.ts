import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ContainergroupmainComponent } from '../containergroupmain/containergroupmain.component';
import { ContainerGroupService } from '../../services/container-group.service';

@Component({
  selector: 'app-containergroupupdate',
  templateUrl: './containergroupupdate.component.html',
  styleUrls: ['./containergroupupdate.component.scss']
})
export class ContainergroupupdateComponent implements OnInit {

  CG_ID: string;
  CG_DESC: string;
  CG_ROW: any;
  BtnTitle: string;
  isUpdate: boolean = false;
  showLoader: boolean = false;

  constructor(private translate: TranslateService,private commonservice: Commonservice, private toastr: ToastrService,
  private router: Router,private contnrServ: ContainerGroupService, private contrMainComp : ContainergroupmainComponent) { }

  ngOnInit() {
    let CG_ROW = localStorage.getItem("CG_ROW")
    if(CG_ROW != undefined && CG_ROW != ""){
    this.CG_ROW = JSON.parse(localStorage.getItem("CG_ROW"));
      this.CG_ID = this.CG_ROW[0];
      this.CG_DESC = this.CG_ROW[1];
      if(localStorage.getItem("Action") == "copy"){
        this.isUpdate = false;
        this.BtnTitle = this.translate.instant("CT_Add");
      }else{
        this.isUpdate = true;
        this.BtnTitle = this.translate.instant("CT_Update");
      }
    }else{
      this.isUpdate = false;
      this.BtnTitle = this.translate.instant("CT_Add");
    }
  }

  onCancelClick(){
    this.contrMainComp.cgComponent= 1;
  }

  validateFields(): boolean{
    if(this.CG_ID == '' || this.CG_ID == undefined){
      this.toastr.error('', this.translate.instant("ContnrGrpd_Blank_Msg"));
      return false;
    }
    return true;
  }

  public onAddUpdateClick() {
    if(!this.validateFields()){
      return;
    }
    if(this.BtnTitle == this.translate.instant("CT_Update")){
      this.UpdateContnrGroup();
    }else{
      this.InsertIntoContnrGroup();
    }
  }

  InsertIntoContnrGroup() {
    this.showLoader = true;
    this.contnrServ.InsertIntoContainerGroup(this.CG_ID, this.CG_DESC).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.toastr.success('', data[0].RESULT);
            this.contrMainComp.cgComponent= 1;
          }else{
            this.toastr.error('', data[0].RESULT);
          }
        } else {
          this.toastr.success('', this.translate.instant("CommonNoDataAvailableMsg"));
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

  UpdateContnrGroup() {
    this.showLoader = true;
    this.contnrServ.UpdateContainerGroup(this.CG_ID, this.CG_DESC).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if(data[0].RESULT == this.translate.instant("DataSaved")){
            this.toastr.success('', data[0].RESULT);
            this.contrMainComp.cgComponent= 1;
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
