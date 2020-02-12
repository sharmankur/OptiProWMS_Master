import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { Commonservice } from '../../services/commonservice.service';

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
  count: any = 0;

  constructor(private commonservice: Commonservice, private translate: TranslateService, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router) { }

  ngOnInit() {
    this.showLookup = true;
    this.showNoButton = true;
    if (this.noButtonText == undefined || this.noButtonText == "") {
      this.showNoButton = false;
    }
  }

  public opened: boolean = true;

  public close(status) {
    if (status == "yes") {
      if (this.containerCode == undefined || this.containerCode == '') {
        this.toastr.error('', this.translate.instant("ContainerCodeBlankMsg"));
        return
      }
      this.getContainerCode();
    } else if (status == "cancel" || status == "no") {
      this.isYesClick.emit({
        Status: "no",
        From: this.fromWhere,
        ContainerCode: "",
        ParentContainerCode: "",
        Count: 0
      });
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

  getContainerCode() {
    this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTCODE = this.containerCode;
    this.oSaveModel.HeaderTableBindingData[0].OPTM_CONTAINERID = "";

    this.showLoader = true;
    this.containerCreationService.getContainerCode(this.oSaveModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if(data == null || data.length == 0){
            this.toastr.error('', this.translate.instant("Code not generated."));
          } else if(data != null && data.length == 1){
            this.isYesClick.emit({
              Status: "yes",
              From: this.fromWhere,
              ContainerId: data[0].OPTM_CONTAINERID,
              ParentContainerCode: this.parentContainerCode,
              ContainerCode: this.containerCode,
              Count: this.count
            });
            this.opened = false;
          } else {
            this.toastr.error('', this.translate.instant("Code already exist."));
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
