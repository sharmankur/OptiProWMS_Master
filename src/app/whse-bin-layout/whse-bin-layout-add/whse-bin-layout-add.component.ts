import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { CARMasterService } from '../../services/carmaster.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WhseBinLayoutComponent } from '../whse-bin-layout/whse-bin-layout.component';
import { WhseBinLayoutService } from '../../services/whse-bin-layout.service';

@Component({
  selector: 'app-whse-bin-layout-add',
  templateUrl: './whse-bin-layout-add.component.html',
  styleUrls: ['./whse-bin-layout-add.component.scss']
})
export class WhseBinLayoutAddComponent implements OnInit {

  showLookup: boolean = false;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  buttonText: string = "";
  isUpdate: boolean = false;
  whseCode: string = "";
  whseDescr: string = "";
  whseZoneList: any = [];
  whseRangeList: any = [];
  index: number;
  fromType: string;
  binType: string = "";
  WIP_FG_StageBin: string = '';
  WIP_RM_StageBin: string = '';
  TransferOutBin: string = '';
  TransferInBin: string = '';
  Ship_StageBin: string = '';
  zonePageSize: number = 10;
  zonePageable: boolean = false;
  rangePageSize: number = 10;
  rangePageable: boolean = false;

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,
    private router: Router, private carmasterService: CARMasterService,
    private whseBinLayout: WhseBinLayoutComponent, private whseService: WhseBinLayoutService) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe(() => {
    });
  }

  ngOnInit() {
    let actionType = localStorage.getItem("Action")
    if (actionType != undefined && actionType != "") {
      if (localStorage.getItem("Action") == "edit") {
        this.isUpdate = true;
        this.buttonText = this.translate.instant("CT_Update");
        var data = JSON.parse(localStorage.getItem("Row"));
        this.whseCode = data[0];
        this.getWhseMasterDetails(this.whseCode);
      } else if (localStorage.getItem("Action") == "copy") {
        var data = JSON.parse(localStorage.getItem("Row"));
        this.isUpdate = false;
        this.buttonText = this.translate.instant("CT_Add");
        this.whseCode = data[0];
        this.getWhseMasterDetails(this.whseCode);
      } else {
        this.isUpdate = false;
        this.buttonText = this.translate.instant("CT_Add");
      }
    } else {
      this.isUpdate = false;
      this.buttonText = this.translate.instant("CT_Add");
    }
  }

  onCancelClick() {
    this.whseBinLayout.whseBinLayoutComponent = 1;
  }

  onDeleteClick(type, rowindex) {
    console.log("onDeleteClick rowindex: " + rowindex)
    if (type == "zone") {
      this.whseZoneList.splice(rowindex, 1);
      this.zonePageable = false;
      if(this.whseZoneList.length > 10){
        this.zonePageable = true;
      }
    } else {
      this.whseRangeList.splice(rowindex, 1);
      this.rangePageable = false;
      if(this.whseRangeList.length > 10){
        this.rangePageable = true;
      }
    }
  }

  GetWhseCode() {
    this.showLoader = true;
    this.commonservice.GetWhseCode().subscribe(
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
          this.lookupfor = "WareHouse";
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

  GetFromBinCode(type, index) {
    if (this.whseCode == undefined || this.whseCode == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }

    this.binType = "from_bin"
    this.showLoader = true;
    this.index = index;
    this.fromType = type;

    this.showLoader = true;
    this.commonservice.GetBinCode(this.whseCode).subscribe(
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
          this.lookupfor = "BinList";
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
  GetToBinCode(type, index) {
    if (this.whseCode == undefined || this.whseCode == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }

    this.binType = "to_bin"
    this.showLoader = true;
    this.index = index;
    this.fromType = type;

    this.showLoader = true;
    this.commonservice.GetBinCode(this.whseCode).subscribe(
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
          this.lookupfor = "BinList";
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

  GetDefaultShipStageBin(from) {
    if (this.whseCode == undefined || this.whseCode == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }

    this.fromType = from;
    this.showLoader = true;
    this.commonservice.GetBinCode(this.whseCode).subscribe(
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
          this.lookupfor = "BinList";
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


  getLookupValue($event) {
    if ($event != null && $event == "close") {
      //nothing to do
      return;
    }
    else {
      if (this.lookupfor == "WareHouse") {
        this.whseCode = $event[0];
        this.whseDescr = $event[1];
        this.WIP_FG_StageBin = '';
        this.WIP_RM_StageBin = '';
        this.TransferOutBin = '';
        this.TransferInBin = '';
        this.Ship_StageBin = '';
      }
      else if (this.lookupfor == "BinList") {
        if (this.fromType == 'zone') {
          for (var i = 0; i < this.whseZoneList.length; i++) {
            if (i == this.index) {
              if (this.binType == 'from_bin') {
                this.whseZoneList[i].FromBin = $event[0];
              } else {
                this.whseZoneList[i].ToBin = $event[0];
              }
            }
          }
        } else if (this.fromType == 'range') {
          for (var i = 0; i < this.whseRangeList.length; i++) {
            if (i == this.index) {
              if (this.binType == 'from_bin') {
                this.whseRangeList[i].FromBin = $event[0];
              } else {
                this.whseRangeList[i].ToBin = $event[0];
              }
            }
          }
        } else {
          if (this.fromType == 'WIP_FG_StageBin') {
            this.WIP_FG_StageBin = $event[0];
          } else if (this.fromType == 'WIP_RM_StageBin') {
            this.WIP_RM_StageBin = $event[0];
          } else if (this.fromType == 'TransferOutBin') {
            this.TransferOutBin = $event[0];
          } else if (this.fromType == 'TransferInBin') {
            this.TransferInBin = $event[0];
          } else if (this.fromType == 'Ship_StageBin') {
            this.Ship_StageBin = $event[0];
          }
        }
      }
    }
  }

  onAddRowClick(event) {
    if (event == "zone") {
      this.whseZoneList.push({
        WhseCode: "",
        ZoneCode: "",
        ZoneType: "",
        FromBin: "",
        ToBin: ""
      })

      this.zonePageable = false;
      if(this.whseZoneList.length > 10){
        this.zonePageable = true;
      }
    } else if (event == "range") {
      this.whseRangeList.push({
        BinRange: "",
        FromBin: "",
        ToBin: ""
      })
      this.rangePageable = false;
      if(this.whseRangeList.length > 10){
        this.rangePageable = true;
      }
    }
  }

  shipmentModel: any = {};
  prepareSaveData() {
    this.shipmentModel.OPTM_SHP_WHSE_SETUP = [];
    this.shipmentModel.OPTM_SHP_WHSE_ZONES = [];
    this.shipmentModel.OPTM_SHP_WHSE_BINS = [];

    this.shipmentModel.OPTM_SHP_WHSE_SETUP.push({
      OPTM_WHSCODE: this.whseCode,
      OPTM_WHSDESC: this.whseDescr,
      OPTM_BIN_ENABLE: true,
      OPTM_DEF_SHP_STAGE_BIN: this.Ship_StageBin,
      OPTM_DEF_WIP_FG_STAGE_BIN: this.WIP_FG_StageBin,
      OPTM__DEF_WIP_RM_STAGE_BIN: this.WIP_RM_StageBin,
      OPTM_DEF_TRANS_OUT_BIN: this.TransferOutBin,
      OPTM_DEF_TRANS_IN_BIN: this.TransferInBin,
      OPTM_CREATEDBY: localStorage.getItem("UserId"),
      CompanyDBId: localStorage.getItem("CompID"),
      Username: localStorage.getItem("UserId"),
      UserId: localStorage.getItem("UserId"),
      GUID: localStorage.getItem("GUID")
    });

    for (var i = 0; i < this.whseZoneList.length; i++) {
      this.shipmentModel.OPTM_SHP_WHSE_ZONES.push({
        OPTM_WHSCODE: this.whseZoneList[i].WhseCode,
        OPTM_WHSZONE: this.whseZoneList[i].ZoneCode,
        OPTM_ZONETYPE: this.whseZoneList[i].ZoneType,
        OPTM_FROM_BIN: this.whseZoneList[i].FromBin,
        OPTM_TO_BIN: this.whseZoneList[i].ToBin,
        OPTM_CREATEDBY: localStorage.getItem("UserId"),
      });
    }

    for (var i = 0; i < this.whseRangeList.length; i++) {
      this.shipmentModel.OPTM_SHP_WHSE_BINS.push({
        OPTM_WHSCODE: this.whseRangeList[i].WhseCode,
        OPTM_BIN_RANGE: this.whseRangeList[i].BinRange,
        OPTM_FROM_BIN: this.whseRangeList[i].FromBin,
        OPTM_TO_BIN: this.whseRangeList[i].ToBin,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      });
    }

  }

  onAddUpdateClick() {
    if (this.whseCode == undefined || this.whseCode == '') {
      this.toastr.error('', this.translate.instant("Whs_blank_msg"));
      return;
    } else if (this.WIP_FG_StageBin == undefined || this.WIP_FG_StageBin == '') {
      this.toastr.error('', this.translate.instant("WIP_FG_StageBinMsg"));
      return;
    } else if (this.WIP_RM_StageBin == undefined || this.WIP_RM_StageBin == '') {
      this.toastr.error('', this.translate.instant("WIP_RM_StageBinMSg"));
      return;
    } else if (this.TransferOutBin == undefined || this.TransferOutBin == '') {
      this.toastr.error('', this.translate.instant("TransferOutBinMsg"));
      return;
    } else if (this.TransferInBin == undefined || this.TransferInBin == '') {
      this.toastr.error('', this.translate.instant("TransferInBinMsg"));
      return;
    } else if (this.Ship_StageBin == undefined || this.Ship_StageBin == '') {
      this.toastr.error('', this.translate.instant("Ship_StageBinMsg"));
      return;
    }

    for (var i = 0; i < this.whseZoneList.length; i++) {
      if (this.whseZoneList[i].FromBin == undefined || this.whseZoneList[i].FromBin == '') {
        this.toastr.error('', this.translate.instant("ZoneFromBinCannotBlankMsg"));
        return;
      }
      if (this.whseZoneList[i].ToBin == undefined || this.whseZoneList[i].ToBin == '') {
        this.toastr.error('', this.translate.instant("ZoneToBinCannotBlankMsg"));
        return;
      }
    }

    for (var i = 0; i < this.whseRangeList.length; i++) {
      if (this.whseRangeList[i].FromBin == undefined || this.whseRangeList[i].FromBin == '') {
        this.toastr.error('', this.translate.instant("RangeFromBinCannotBlankMsg"));
        return;
      }
      if (this.whseRangeList[i].ToBin == undefined || this.whseRangeList[i].ToBin == '') {
        this.toastr.error('', this.translate.instant("RangeToBinCannotBlankMsg"));
        return;
      }
      if (this.whseRangeList[i].BinRange == undefined || this.whseRangeList[i].BinRange == '') {
        this.toastr.error('', this.translate.instant("RangeCannotBlankMsg"));
        return;
      }
    }

    if (this.isUpdate) {
      this.update();
    } else {
      this.onAdd();
    }
  }

  onAdd() {
    this.prepareSaveData();
    this.showLoader = true;
    this.whseService.InsertIntoWareHouseMaster(this.shipmentModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == "Data Saved") {
            this.toastr.success('', this.translate.instant("PhyCount_DataSavedSuccessfully"));
            this.whseBinLayout.whseBinLayoutComponent = 1;
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
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  update() {
    this.prepareSaveData();
    this.showLoader = true;
    this.whseService.UpdateWareHouseMaster(this.shipmentModel).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data[0].RESULT == "Data Saved") {
            this.toastr.success('', this.translate.instant("PhyCount_DataSavedSuccessfully"));
            this.whseBinLayout.whseBinLayoutComponent = 1;
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
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }


  onBinRangeChangeBlur(value, index) {
    for (var i = 0; i < this.whseRangeList.length; i++) {
      if (i == index) {
        this.whseRangeList[i].BinRange = value;
      }
    }
  }

  onZoneCodeChange(value, index) {
    for (var i = 0; i < this.whseZoneList.length; i++) {
      if (i == index) {
        this.whseZoneList[i].ZoneCode = value;
      }
    }
  }

  onZoneTypeChange(value, index) {
    for (var i = 0; i < this.whseZoneList.length; i++) {
      if (i == index) {
        this.whseZoneList[i].ZoneType = value;
      }
    }
  }

  getWhseMasterDetails(whse) {
    this.whseService.IsValidWareHouseMaster(whse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.whseCode = data.OPTM_SHP_WHSE_SETUP[0].OPTM_WHSCODE
          this.whseDescr = data.OPTM_SHP_WHSE_SETUP[0].OPTM_WHSDESC
          this.Ship_StageBin = data.OPTM_SHP_WHSE_SETUP[0].OPTM_DEF_SHP_STAGE_BIN
          this.WIP_FG_StageBin = data.OPTM_SHP_WHSE_SETUP[0].OPTM_DEF_WIP_FG_STAGE_BIN
          this.WIP_RM_StageBin = data.OPTM_SHP_WHSE_SETUP[0].OPTM__DEF_WIP_RM_STAGE_BIN
          this.TransferOutBin = data.OPTM_SHP_WHSE_SETUP[0].OPTM_DEF_TRANS_OUT_BIN
          this.TransferInBin = data.OPTM_SHP_WHSE_SETUP[0].OPTM_DEF_TRANS_IN_BIN

          for (var i = 0; i < data.OPTM_SHP_WHSE_ZONES.length; i++) {
            this.whseZoneList.push({
              WhseCode: data.OPTM_SHP_WHSE_ZONES[i].OPTM_WHSCODE,
              ZoneCode: data.OPTM_SHP_WHSE_ZONES[i].OPTM_WHSZONE,
              ZoneType: data.OPTM_SHP_WHSE_ZONES[i].OPTM_ZONETYPE,
              FromBin: data.OPTM_SHP_WHSE_ZONES[i].OPTM_FROM_BIN,
              ToBin: data.OPTM_SHP_WHSE_ZONES[i].OPTM_TO_BIN,
            })
          }

          for (var i = 0; i < data.OPTM_SHP_WHSE_BINS.length; i++) {
            this.whseRangeList.push({
              BinRange: data.OPTM_SHP_WHSE_BINS[i].OPTM_BIN_RANGE,
              FromBin: data.OPTM_SHP_WHSE_BINS[i].OPTM_FROM_BIN,
              ToBin: data.OPTM_SHP_WHSE_BINS[i].OPTM_TO_BIN,
            })
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

  onBinChange(from, event) {
    var bin = event.value

    if (this.whseCode == undefined || this.whseCode == "") {
      this.toastr.error('', this.translate.instant("SelectWhseMsg"));
      return;
    }

    if (bin == undefined || bin == "") {
      return;
    }

    this.showLookup = false;
    var result = false;
    this.commonservice.IsValidBinCode(this.whseCode, bin).subscribe(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();
            return;
          }
        if (resp.length == 0) {
          //this.toastr.error('', this.translate.instant("INVALIDBIN"));
          if ("WIP_FG_StageBin" == from) {
            this.toastr.error('', this.translate.instant("WIP_FG_StageBinValid"));
            this.WIP_FG_StageBin = ""
          }
          if ("WIP_RM_StageBin" == from) {
            this.toastr.error('', this.translate.instant("WIP_RM_StageBinValid"));
            this.WIP_RM_StageBin = ""
          }
          if ("TransferOutBin" == from) {
            this.toastr.error('', this.translate.instant("TransferOutBinValid"));
            this.TransferOutBin = ""
          }
          if ("TransferInBin" == from) {
            this.toastr.error('', this.translate.instant("TransferInBinValid"));
            this.TransferInBin = ""
          }
          if ("Ship_StageBin" == from) {
            this.toastr.error('', this.translate.instant("Ship_StageBinValid"));
            this.Ship_StageBin = ""
          }
        } else {
          if ("WIP_FG_StageBin" == from) {
            this.WIP_FG_StageBin = resp[0].BinCode
          }
          if ("WIP_RM_StageBin" == from) {
            this.WIP_RM_StageBin = resp[0].BinCode
          }
          if ("TransferOutBin" == from) {
            this.TransferOutBin = resp[0].BinCode
          }
          if ("TransferInBin" == from) {
            this.TransferInBin = resp[0].BinCode
          }
          if ("Ship_StageBin" == from) {
            this.Ship_StageBin = resp[0].BinCode
          }
        }

        result = true;
      },
      error => {
        result = false;
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
    return result;
  }

  onWhseChange() {
    if (this.whseCode == undefined || this.whseCode == "") {
      return;
    }

    this.showLookup = false;
    var result = false;
    this.commonservice.IsValidWhseCode(this.whseCode).subscribe(
      resp => {
        this.showLookup = false;
        if (resp != null && resp != undefined)
          if (resp.ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router, this.translate.instant("CommonSessionExpireMsg"));//.subscribe();

            return;
          }
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.whseCode = ''
        } else {
          this.whseCode = resp[0].WhsCode
        }
        result = true;
      },
      error => {
        result = false;
        this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        this.showLookup = false;
      }
    );
    return result;
  }
}

