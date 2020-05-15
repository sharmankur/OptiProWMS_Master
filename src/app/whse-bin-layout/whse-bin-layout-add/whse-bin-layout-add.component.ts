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
  isUpdateHappen: boolean = false;

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
    this.buttonText = this.translate.instant("Submit");

    let actionType = localStorage.getItem("Action")
    if (actionType != undefined && actionType != "") {
      if (localStorage.getItem("Action") == "edit") {
        this.isUpdate = true;
        var data = JSON.parse(localStorage.getItem("Row"));
        this.whseCode = data.OPTM_WHSCODE;
        this.getWhseMasterDetails(this.whseCode);
      } else if (localStorage.getItem("Action") == "copy") {
        var data = JSON.parse(localStorage.getItem("Row"));
        this.isUpdate = false;
        this.whseCode = data.OPTM_WHSCODE;
        this.getWhseMasterDetails(this.whseCode);
      } else {
        this.isUpdate = false;
      }
    } else {
      this.isUpdate = false;
    }
  }

  onCancelClick() {
    this.whseBinLayout.whseBinLayoutComponent = 1;
  }

  onBackClick() {
    if (this.isUpdateHappen) {
      this.showDialog("BackConfirmation", this.translate.instant("yes"), this.translate.instant("no"),
        this.translate.instant("Plt_DataDeleteMsg"));
      return true;
    } else {
      this.whseBinLayout.whseBinLayoutComponent = 1;
    }
  }

  onDeleteClick(type, rowindex) {
    console.log("onDeleteClick rowindex: " + rowindex)
    if (type == "zone") {
      //delete from common list
      for (let i = 0; i < this.whseRangeList.length; i++) {
        if (this.whseRangeList[i].ZoneCode == this.whseZoneList[rowindex].ZoneCode
          && this.whseRangeList[i].OPTM_BIN_RANGE == this.whseZoneList[rowindex].OPTM_BIN_RANGE) {
          this.whseRangeList.splice(i, 1)
          i = i - 1;
        }
      }
      //delete from display zone list
      this.whseZoneList.splice(rowindex, 1);
      //for paging
      this.zonePageable = false;
      if (this.whseZoneList.length > 10) {
        this.zonePageable = true;
      }
      this.filterRangeListByZone()
      if(this.whseZoneList.length == 0){
        this.displayWhseRangeList = []
        this.selectedZoneCodeRow = undefined
      }
    } else {
      //delete from common list
      for (let i = 0; i < this.whseRangeList.length; i++) {
        if (this.whseRangeList[i].ZoneCode == this.displayWhseRangeList[rowindex].ZoneCode
          && this.whseRangeList[i].OPTM_BIN_RANGE == this.displayWhseRangeList[rowindex].OPTM_BIN_RANGE) {
          this.whseRangeList.splice(i, 1)
          break;
        }
      }
      //delete from display range list
      this.displayWhseRangeList.splice(rowindex, 1);

      this.rangePageable = false;
      if (this.displayWhseRangeList.length > 10) {
        this.rangePageable = true;
      }
    }
    this.isUpdateHappen = true;
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

  resetPage() {
    this.whseCode = '';
    this.whseDescr = '';
    this.WIP_FG_StageBin = '';
    this.WIP_RM_StageBin = '';
    this.TransferOutBin = '';
    this.TransferInBin = '';
    this.Ship_StageBin = '';
    this.whseZoneList = []
    this.displayWhseRangeList = []
    this.whseRangeList = []
  }

  getLookupData($event) {
    if ($event != null && $event == "close") {
      //nothing to do
      return;
    }
    else {
      if (this.lookupfor == "WareHouse") {
        this.isUpdateHappen = true
        this.resetPage()
        this.whseCode = $event.WhsCode;
        this.whseDescr = $event.WhsName;
      }
      else if (this.lookupfor == "BinList") {
        this.isUpdateHappen = true
        if (this.fromType == 'zone') {
          for (var i = 0; i < this.whseZoneList.length; i++) {
            if (i == this.index) {
              if (this.binType == 'from_bin') {
                this.whseZoneList[i].FromBin = $event.BinCode;
              } else {
                this.whseZoneList[i].ToBin = $event.BinCode;
              }
            }
          }
        } else if (this.fromType == 'range') {
          for (var i = 0; i < this.whseRangeList.length; i++) {
            if (i == this.index) {
              if (this.binType == 'from_bin') {
                this.whseRangeList[i].FromBin = $event.BinCode;
              } else {
                this.whseRangeList[i].ToBin = $event.BinCode;
              }
            }
          }
          this.isUpdateHappen = true
        } else {
          this.isUpdateHappen = true
          if (this.fromType == 'WIP_FG_StageBin') {
            this.WIP_FG_StageBin = $event.BinCode;
          } else if (this.fromType == 'WIP_RM_StageBin') {
            this.WIP_RM_StageBin = $event.BinCode;
          } else if (this.fromType == 'TransferOutBin') {
            this.TransferOutBin = $event.BinCode;
          } else if (this.fromType == 'TransferInBin') {
            this.TransferInBin = $event.BinCode;
          } else if (this.fromType == 'Ship_StageBin') {
            this.Ship_StageBin = $event.BinCode;
          }
        }
      } else if (this.lookupfor == "BinRangeList") {
        if (this.displayWhseRangeList[this.index].OPTM_BIN_RANGE == $event.OPTM_BIN_RANGE) {
          return
        }

        if (this.isBinRangeExist($event.OPTM_BIN_RANGE, this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneCode)) {
          this.toastr.error('', this.translate.instant("BinRangeExistMsg"));
          this.displayWhseRangeList[this.index].OPTM_BIN_RANGE = ''
        } else {
          this.displayWhseRangeList[this.index].OPTM_BIN_RANGE = $event.OPTM_BIN_RANGE
        }
        this.whseRangeList = this.whseRangeList.filter(item => item.ZoneCode !== this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneCode)
        for (let i = 0; i < this.displayWhseRangeList.length; i++) {
            this.whseRangeList.push({
            OPTM_BIN_RANGE: this.displayWhseRangeList[i].OPTM_BIN_RANGE,
              WhseCode: this.whseCode,
              ZoneCode: this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneCode,
              ZoneType: this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneType,
              FromBin: "",
              ToBin: "",
            })
        }
        this.isUpdateHappen = true
      }
    }
  }

  isBinRangeExist(value, zoneCode) {
    let data = this.displayWhseRangeList.filter(item => (item.OPTM_BIN_RANGE === value && zoneCode === item.ZoneCode))
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  onAddRowClick(event) {
    if (this.whseCode == '' || this.whseCode == undefined) {
      this.toastr.error('', this.translate.instant("Whs_blank_msg"));
      return;
    }

    if (event == "zone") {
      this.whseZoneList.push({
        WhseCode: this.whseCode,
        ZoneCode: "",
        ZoneType: "",
        FromBin: "",
        ToBin: "",
        OPTM_BIN_RANGE: ""
      })

      this.zonePageable = false;
      if (this.whseZoneList.length > 10) {
        this.zonePageable = true;
      }
    } else if (event == "range") {
      if (this.selectedZoneCodeRow == undefined || this.selectedZoneCodeRow == null) {
        this.toastr.error('', this.translate.instant("ZoneRowSelectionValMsg"));
        return
      }

      if (this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneCode == '' || this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneType == '') {
        this.toastr.error('', this.translate.instant("SelectedRowFieldVal"));
        return
      }
      this.displayWhseRangeList.push({
        OPTM_BIN_RANGE: "",
        WhseCode: this.whseCode,
        ZoneCode: this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneCode,
        ZoneType: this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneType,
        FromBin: "",
        ToBin: "",
      })
      this.rangePageable = false;
      if (this.whseRangeList.length > 10) {
        this.rangePageable = true;
      }
    }
    this.isUpdateHappen = true
  }

  shipmentModel: any = {};
  prepareSaveData() {
    this.shipmentModel.OPTM_SHP_WHSE_SETUP = [];
    this.shipmentModel.OPTM_SHP_WHSE_ZONES = [];
    this.shipmentModel.OPTM_SHP_WHSE_BINS = [];

    if (this.whseRangeList.length == 0) {
      return
    } else {
      for (var i = 0; i < this.whseZoneList.length; i++) {
        if (this.whseZoneList[i].ZoneCode == undefined || this.whseZoneList[i].ZoneCode == '') {
          this.toastr.error('', this.translate.instant("ZoneCodeAndTypeBlank"));
          return;
        }
  
        if (this.whseZoneList[i].ZoneType == undefined || this.whseZoneList[i].ZoneType == '') {
          this.toastr.error('', this.translate.instant("ZoneCodeAndTypeBlank"));
          return;
        }
      }

      for (var i = 0; i < this.whseRangeList.length; i++) {
        if (this.whseRangeList[i].OPTM_BIN_RANGE == undefined || this.whseRangeList[i].OPTM_BIN_RANGE == '') {
          return
        }
      }
    }

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

    for (var i = 0; i < this.whseRangeList.length; i++) {
      this.shipmentModel.OPTM_SHP_WHSE_ZONES.push({
        OPTM_WHSCODE: this.whseRangeList[i].WhseCode,
        OPTM_WHSZONE: this.whseRangeList[i].ZoneCode,
        OPTM_ZONETYPE: this.whseRangeList[i].ZoneType,
        OPTM_FROM_BIN: this.whseRangeList[i].FromBin,
        OPTM_TO_BIN: this.whseRangeList[i].ToBin,
        OPTM_BIN_RANGE: this.whseRangeList[i].OPTM_BIN_RANGE,
        OPTM_CREATEDBY: localStorage.getItem("UserId"),
      });
    }

    // for (var i = 0; i < this.whseRangeList.length; i++) {
    //   this.shipmentModel.OPTM_SHP_WHSE_BINS.push({
    //     OPTM_WHSCODE: this.whseRangeList[i].WhseCode,
    //     OPTM_BIN_RANGE: this.whseRangeList[i].OPTM_BIN_RANGE,
    //     OPTM_FROM_BIN: this.whseRangeList[i].FromBin,
    //     OPTM_TO_BIN: this.whseRangeList[i].ToBin,
    //     OPTM_CREATEDBY: localStorage.getItem("UserId")
    //   });
    // }

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
      if (this.whseZoneList[i].ZoneCode == undefined || this.whseZoneList[i].ZoneCode == '') {
        this.toastr.error('', this.translate.instant("ZoneCodeAndTypeBlank"));
        return;
      }

      if (this.whseZoneList[i].ZoneType == undefined || this.whseZoneList[i].ZoneType == '') {
        this.toastr.error('', this.translate.instant("ZoneCodeAndTypeBlank"));
        return;
      }
    }

    // for (var i = 0; i < this.whseRangeList.length; i++) {
    //   if (this.whseRangeList[i].OPTM_BIN_RANGE == undefined || this.whseRangeList[i].OPTM_BIN_RANGE == '') {
    //     this.toastr.error('', this.translate.instant("RangeCannotBlankMsg"));
    //     return;
    //   }
    // }

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
            this.toastr.success('', this.translate.instant(data[0].RESULT));
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
            this.toastr.success('', data[0].RESULT);
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
        this.whseRangeList[i].OPTM_BIN_RANGE = value;
      }
    }
  }

  onZoneCodeChange(value, index) {
    if (value == undefined || value == '') {
      return
    }
    //if no change in code
    if (this.whseZoneList[index].ZoneCode == value) {
      return
    }
    //validate with duplicate zone code
    for (var i = 0; i < this.whseZoneList.length; i++) {
      if (this.whseZoneList[i].ZoneCode == value) {
        this.whseZoneList[i].ZoneCode = ' '
        this.toastr.error('', this.translate.instant("ZoneCodeAndTypeDuplicate"));
        setTimeout(() => {
          this.whseZoneList[i].ZoneCode = ''
        }, 200)
        return
      }
    }

    //first update all rows of whseRangelist with latest zone code.... this list will send on server
    for (var i = 0; i < this.whseRangeList.length; i++) {
      if (this.whseRangeList[i].ZoneCode == this.whseZoneList[index].ZoneCode) {
        this.whseRangeList[i].ZoneCode = value;
      }
    }

    //After update display zone list
    this.whseZoneList[index].ZoneCode = value;

    this.isUpdateHappen = true
  }

  onZoneTypeChange(value, index) {
    if (value == undefined || value == '') {
      return
    }
    //if no change in type
    if (this.whseZoneList[index].ZoneType == value) {
      return
      }
    //first update all rows of whseRangelist with latest zone type.... this list will send on server
    for (var i = 0; i < this.whseRangeList.length; i++) {
      if (this.whseRangeList[i].ZoneCode == this.whseZoneList[index].ZoneCode
        && this.whseRangeList[i].ZoneType == this.whseZoneList[index].ZoneType) {
        this.whseRangeList[i].ZoneType = value;
    }
    }

    //After update display zone list
    this.whseZoneList[index].ZoneType = value;

    this.isUpdateHappen = true
  }

  getWhseMasterDetails(whse) {
    if (whse == undefined || whse == "") {
      return;
    }
    this.showLoader = true
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
            this.whseRangeList.push({
              WhseCode: data.OPTM_SHP_WHSE_ZONES[i].OPTM_WHSCODE,
              ZoneCode: data.OPTM_SHP_WHSE_ZONES[i].OPTM_WHSZONE,
              ZoneType: data.OPTM_SHP_WHSE_ZONES[i].OPTM_ZONETYPE,
              FromBin: data.OPTM_SHP_WHSE_ZONES[i].OPTM_FROM_BIN,
              ToBin: data.OPTM_SHP_WHSE_ZONES[i].OPTM_TO_BIN,
              OPTM_BIN_RANGE: data.OPTM_SHP_WHSE_ZONES[i].OPTM_BIN_RANGE
            })
          }

          for (var i = 0; i < data.OPTM_SHP_WHSE_ZONES.length; i++) {
            if (!this.isExistZoneCode(data.OPTM_SHP_WHSE_ZONES[i].OPTM_WHSZONE, data.OPTM_SHP_WHSE_ZONES[i].OPTM_ZONETYPE)) {
              this.whseZoneList.push({
                WhseCode: data.OPTM_SHP_WHSE_ZONES[i].OPTM_WHSCODE,
                ZoneCode: data.OPTM_SHP_WHSE_ZONES[i].OPTM_WHSZONE,
                ZoneType: data.OPTM_SHP_WHSE_ZONES[i].OPTM_ZONETYPE,
                FromBin: data.OPTM_SHP_WHSE_ZONES[i].OPTM_FROM_BIN,
                ToBin: data.OPTM_SHP_WHSE_ZONES[i].OPTM_TO_BIN,
                OPTM_BIN_RANGE: data.OPTM_SHP_WHSE_ZONES[i].OPTM_BIN_RANGE
              })
            }
          }

          this.filterRangeListByZone()
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
        this.isUpdateHappen = true
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
        this.isUpdateHappen = true
        if (resp.length == 0) {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.whseCode = ''
          this.resetPage()
        } else {
          this.whseCode = resp[0].WhsCode
          this.whseDescr = resp[0].WhsName
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

  IsValidWareHouseBinRange(index, value, display_name) {
    if (value == undefined || value == "") {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidWareHouseBinRange(this.whseCode, value).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.isUpdateHappen = true
          if (data.OPTM_SHP_WHSE_BINS.length > 0) {
            if (this.displayWhseRangeList[index].OPTM_BIN_RANGE == data.OPTM_SHP_WHSE_BINS[0].OPTM_BIN_RANGE) {
              return
            }

            if (this.isBinRangeExist(data.OPTM_SHP_WHSE_BINS[0].OPTM_BIN_RANGE, this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneCode)) {
              this.toastr.error('', this.translate.instant("BinRangeExistMsg"));
              this.displayWhseRangeList[index].OPTM_BIN_RANGE = ' '
              setTimeout(() => {
                this.displayWhseRangeList[index].OPTM_BIN_RANGE = ''
              }, 200)
            } else {
              this.displayWhseRangeList[index].OPTM_BIN_RANGE = data.OPTM_SHP_WHSE_BINS[0].OPTM_BIN_RANGE
            }
            this.whseRangeList = this.whseRangeList.filter(item => item.ZoneCode !== this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneCode)
            for (let i = 0; i < this.displayWhseRangeList.length; i++) {
              this.whseRangeList.push({
                OPTM_BIN_RANGE: this.displayWhseRangeList[i].OPTM_BIN_RANGE,
                WhseCode: this.whseCode,
                ZoneCode: this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneCode,
                ZoneType: this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneType,
                FromBin: "",
                ToBin: "",
              })
            }
          } else {
            this.whseZoneList[index].OPTM_BIN_RANGE = "";
            display_name.value = "";
            this.toastr.error('', "Invalid Bin Ranges");
          }
        } else {
          this.whseZoneList[index].OPTM_BIN_RANGE = "";
          display_name.value = "";
          this.toastr.error('', "Invalid Bin Ranges");
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

  GetDataForBinRanges(index) {
    this.showLoader = true;
    this.index = index;
    this.commonservice.GetDataForBinRanges(this.whseCode).subscribe(
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
          this.lookupfor = "BinRangeList";
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

  dialogFor: any;
  yesButtonText: any;
  noButtonText: any;
  dialogMsg: any;
  showDialog(dialogFor: string, yesbtn: string, nobtn: string, msg: string) {
    this.dialogFor = dialogFor;
    this.yesButtonText = yesbtn;
    this.noButtonText = nobtn;
    this.showConfirmDialog = true;
    this.dialogMsg = msg;
  }

  showConfirmDialog: boolean = false;
  getConfirmDialogValue($event) {
    this.showConfirmDialog = false;
    if ($event.Status == "yes") {
      switch ($event.From) {
        case ("BackConfirmation"):
          this.whseBinLayout.whseBinLayoutComponent = 1;
          break;
        case ("Cancel"): {
          this.router.navigate(['home/dashboard']);
          break;
        }
      }
    } else {
      if ($event.Status == "no") {
        // switch ($event.From) {
        //   case ("Cancel"):
        //     break;
        // }
      }
    }
  }

  prepareWhsZoneList(list) {
    this.whseZoneList = []
    for (var i = 0; i < list.length; i++) {
      if (!this.isExistZoneCode(list[i].ZoneCode, list[i].ZoneType)) {
        this.whseZoneList.push(list[i])
      }
    }
  }

  displayWhseRangeList: any[]
  filterRangeListByZone() {
    if (this.selectedZoneCodeRow == undefined || this.selectedZoneCodeRow == null) {
      return
    } else {
      this.displayWhseRangeList = this.whseRangeList.filter(item => item.ZoneCode === this.selectedZoneCodeRow.selectedRows[0].dataItem.ZoneCode)
    }
  }

  isExistZoneCode(zoneCode: any, zoneType: any) {
    for (let i = 0; i < this.whseZoneList.length; i++) {
      if (this.whseZoneList[i].ZoneCode == zoneCode && this.whseZoneList[i].ZoneType == zoneType) {
        return true;
      }
    }
    return false;
  }

  selectedZoneCodeRow: any;
  onSelectionClick(event) {
    this.selectedZoneCodeRow = event
    this.filterRangeListByZone()
  }
}

