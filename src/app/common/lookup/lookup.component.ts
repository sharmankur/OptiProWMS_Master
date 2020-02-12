import { Component, OnInit, setTestabilityGetter, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'bootstrap';
import { ColumnSetting } from '../../models/CommonData';
import { OutboundData } from '../../models/outbound/outbound-data';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { UIHelper } from '../../helpers/ui.helpers';
import { State } from '@progress/kendo-data-query';
import { CommonConstants } from '../../const/common-constants';
// import { UIHelper } from '../../../helpers/ui.helpers';
// import { Http, ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
  // @ViewChild("lookupsearch") _el: ElementRef;
  // input and output emitters
  @Input() serviceData: any;
  @Input() lookupfor: any;
  @Input() fillLookupArray: any;
  @Input() selectedImage: any
  @Output() lookupvalue = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Output() deleteSelectedItems = new EventEmitter();
  @Output() copyItem = new EventEmitter();
  @Output() copyItemKey = new EventEmitter();
  @Output() lookupkey = new EventEmitter();
  @Input() ruleselected: any;
  myInputVariable: ElementRef;
  public table_head: ColumnSetting[] = [];
  dialogOpened: boolean = true;
  lookupTitle: string;
  pagable: boolean = false;
  pagesize: number;
  isMobile: boolean;
  isColumnFilter: boolean = false;
  isColumnGroup: boolean = false;
  gridHeight: number;
  showLoader: boolean = false;
  grid: any;
  selectall: boolean = false;
  showSelection: boolean = false;
  public selectedValues: Array<any> = [];
  public mySelection: number[] = [];


  lookupPagable: boolean = false;
  lookupPageSize: number = 10;
  constructor(private toastr: ToastrService, private translate: TranslateService, private router: Router) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
     // console.log("translate.onLangChange.subscribe inside lookup component");
      this.ngOnChanges();
    });
  }

  close_kendo_dialog() {
    if (this.lookupfor == "PhyCntItemList") {
      this.router.navigate(['home/dashboard']);
    } else {
      this.dialogOpened = false;
      this.lookupvalue.emit('close')
    }
  }
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public clearFilters() {
    this.state.filter = {
      logic: 'and',
      filters: []
    };
  }
  onFilterChange(checkBox: any, grid: GridComponent) {
    if (checkBox.checked == false) {
      this.clearFilter(grid);
    }
  }
  clearFilter(grid: GridComponent) {
    this.clearFilters()
  }
  ngOnInit() {

  }

  async ngOnChanges(): Promise<void> {
  //  console.log("ngOnChanges ");
    if (this.serviceData != undefined && this.serviceData.length >= this.lookupPageSize) {
      this.lookupPagable = true;
    }
    if (this.lookupfor == "toWhsList" || this.lookupfor == "fromWhsList") {
      this.showToWhsList();
    } else if (this.lookupfor == "ItemsList") {
      this.showItemCodeList();
    } else if (this.lookupfor == "BatchNoList" || this.lookupfor == "BatchNoList2") {
      this.showBatchNoList();
    } else if (this.lookupfor == "NTrackFromBin") {
      this.showNTrackFromBinList();
    } else if (this.lookupfor == "SBTrackFromBin") {
      this.showSBTrackFromBinList();
    } else if (this.lookupfor == "toBinsList") {
      this.showSBTrackFromBinList();
    }
    else if (this.lookupfor == "RecvBinList") {
      this.showRecvBinList();
    }
    else if (this.lookupfor == "CTList") {
      this.showContainerType();
    }
    else if (this.lookupfor == "CTRList") {
      this.showCTRList();
    }
    else if (this.lookupfor == "CARList") {
      this.showCARList();
    }
    else if (this.lookupfor == "DDList") {
      this.showDDList();
    }
    else if(this.lookupfor == "ItemCodeGenRowView"){
      this.ItemCodeGenRowListView();
    }
    else if(this.lookupfor == "CarrierList"){
      this.CarrierListView();
    } else if(this.lookupfor == "WhseBinLayoutList"){
      this.showWhseBinLayoutList();
    } else if(this.lookupfor == "SOList"){
      this.showOutSOList();
    }
    else if(this.lookupfor == "ContnrGroup"){
      this.ContainerGroupListView();
    }

    this.clearFilters();
    this.isColumnFilter = false
  }

  showWhseBinLayoutList(){
    this.table_head = [
      {
        field: 'OPTM_WHSCODE',
        title: this.translate.instant("Warehouse"),
        headerClass: 'text-center',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_WHSDESC',
        title: this.translate.instant("CT_Description"),
        headerClass: 'text-center',
        type: 'text',
        width: '150'
      }
    ];
    this.lookupTitle = this.translate.instant("WarehouseBinLayout");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showToWhsList() {
    this.table_head = [
      {
        field: 'WHSCODE',
        title: this.translate.instant("WhseCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'WHSName',
        title: this.translate.instant("WhseName"),
        type: 'text',
        width: '100'
      },
    ];
    this.lookupTitle = this.translate.instant("WarehouseList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showAvaliableItems() {
    this.pagesize = 5;
    if (this.serviceData.length > this.pagesize) {
      this.pagable = true;
    } else {
      this.pagable = false;
    }


    this.showSelection = true;
    this.selectedValues = [];
    this.table_head = [

      {
        field: 'LOTNO',
        title: this.translate.instant("BatchSerial_No"),
        type: 'text',
        width: '100'
      },

      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'TOTALQTY',
        headerClass: 'text-center',
        class: 'text-right',
        title: this.translate.instant("AvailableQty"),
        type: 'numeric',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("AvaliableMeterial");
    if (this.serviceData !== undefined) {
      var len = this.serviceData.length;
      if (len > 0) {
        //  console.log('ServiceData', this.serviceData);
        var tempData: any;
        for (var i = 0; i < len; i++) {
          var qty = Number(this.serviceData[i].TOTALQTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          this.serviceData[i].TOTALQTY = qty;
        }
        this.dialogOpened = true;
      }
    }
  }

  showBatchNoList() {
    this.table_head = [
      {
        field: 'LOTNO',
        title: this.translate.instant("BatchSerial_No"),
        type: 'text',
        width: '100'
      },
      {
        field: 'ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'TOTALQTY',
        headerClass: 'text-center',
        class: 'text-right',
        title: this.translate.instant("TOTALQTY"),
        type: 'text',
        width: '100'
      },
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'ITEMNAME',
        title: this.translate.instant("ItemName"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("Palletmessage.Lot");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showNTrackFromBinList() {
    this.table_head = [
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100',
        headerClass: '',
        class: '',
      },
      {
        field: 'TOTALQTY',
        headerClass: 'text-right',
        class: 'text-right',
        title: this.translate.instant("TOTALQTY"),
        type: 'text',
        width: '100',
      },
      {
        field: 'WHSCODE',
        title: this.translate.instant("WhseCode"),
        type: 'text',
        width: '100',
        headerClass: '',
        class: '',
      }
    ];
    this.lookupTitle = this.translate.instant("LookupTitle_BinNoList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showSBTrackFromBinList() {
    this.table_head = [
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'WHSCODE',
        title: this.translate.instant("WhseCode"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("LookupTitle_BinNoList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showToBinsList() {
    this.table_head = [
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'WHSCODE',
        title: this.translate.instant("WhseCode"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("LookupTitle_BinNoList");
  }

  showRecvBinList() {
    this.table_head = [
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("LookupTitle_BinNoList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showCustomerList() {

    this.table_head = [
      {
        title: this.translate.instant("CustomerCode"),
        field: 'CUSTOMER CODE',
        type: 'text',
        width: '100'
      },

      {
        title: this.translate.instant("Outbound_CustomerName"),
        field: 'CUSTOMER NAME',
        type: 'text',
        width: '100'
      }

    ];

    this.lookupTitle = this.translate.instant("CustomerList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showContainerType() {
    this.table_head = [
      {
        field: 'OPTM_CONTAINER_TYPE',
        title: this.translate.instant("CT_ContainerType"),
        headerClass: 'text-center',
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_DESC',
        title: this.translate.instant("CT_Description"),
        headerClass: 'text-center',
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_LENGTH',
        title: this.translate.instant("CT_Length"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
        width: '100'
      },
      {
        field: 'OPTM_WIDTH',
        title: this.translate.instant("CT_Width"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
        width: '100'
      },
      {
        field: 'OPTM_HEIGHT',
        title: this.translate.instant("CT_Height"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
        width: '100'
      },
      {
        field: 'OPTM_MAXWEIGHT',
        title: this.translate.instant("CT_Max_Width"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("CT_ContainerType");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showCTRList() {
    this.table_head = [
      {
        field: 'OPTM_CONTAINER_TYPE',
        title: this.translate.instant("CT_ContainerType"),
        headerClass: 'text-center',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_PARENT_CONTTYPE',
        title: this.translate.instant("CTR_Parent_CT"),
        headerClass: 'text-center',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_CONT_PERPARENT',
        title: this.translate.instant("CTRContainersPerParent"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
        width: '150'
      },
      {
        field: 'OPTM_CONT_PARTOFPARENT',
        title: this.translate.instant("CTRContainerPartofParent"),
        type: 'numeric',
        headerClass: 'text-center',
        class: 'text-right',
        width: '150'
      }
    ];
    this.lookupTitle = this.translate.instant("CT_ContainerType");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showCARList() {
    this.table_head = [
      {
        field: 'OPTM_RULEID',
        title: this.translate.instant("CAR_CPackRule"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
        width: '150'
      },
      {
        field: 'OPTM_CONTTYPE',
        title: this.translate.instant("CT_ContainerType"),
        headerClass: 'text-center',
        type: 'text',
        width: '150'
      },

      {
        field: 'OPTM_CONTUSE',
        title: this.translate.instant("Container_Use"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
        width: '150'
      },
      {
        field: 'OPTM_ADD_TOCONT',
        title: this.translate.instant("CAR_AddPartsToContainer"),
        headerClass: 'text-center',
        type: 'boolean',
        width: '150'
      }
    ];
    this.lookupTitle = this.translate.instant("CT_ContainerType");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }


  showDDList() {
    this.table_head = [
      {
        field: 'OPTM_WHSE',
        title: this.translate.instant("WHSCODE"),
        headerClass: 'text-center',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_DOCKDOORID',
        title: this.translate.instant("DD_ID"),
        headerClass: 'text-center',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_DESC',
        title: this.translate.instant("DD_DESC"),
        headerClass: 'text-center',
        type: 'text',
        width: '150'
      }
    ];
    this.lookupTitle = this.translate.instant("Dock_Door");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showPOItemList() {
    this.table_head = [
      {
        field: 'ItemCode',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'ItemName',
        title: this.translate.instant("ItemName"),
        type: 'text',
        width: '100'
      },
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showPOList() {
    this.table_head = [
      {
        field: 'DocNum',
        title: this.translate.instant("Inbound_PO#"),
        type: 'numeric',
        width: '100'
      },
      {
        field: 'DocDueDate',
        title: this.translate.instant("DelDate"),
        type: 'date',
        width: '100'
      }//,
      // {
      //   field: 'CardCode',
      //   title: this.translate.instant("VendorCode"),
      //   type: 'text',
      //   width: '100'
      // },
      // {
      //   field: 'CardName',
      //   title: this.translate.instant("VendorName"),
      //   type: 'text',
      //   width: '100'
      // }
    ];
    this.lookupTitle = this.translate.instant("Inbound_POList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  ShowPhyCntItemList() {
    this.table_head = [
      {
        field: 'DocNum',
        title: this.translate.instant("DocNum"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
        width: '50'
      },
      {
        field: 'ItemCode',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'Bin',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '180'
      },
      {
        field: 'InWhsQty',
        title: this.translate.instant("OnHandQty"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
        width: '70'
      },
      {
        field: 'CountDate',
        title: this.translate.instant("CountDate"),
        type: 'text',
        width: '70'
      },
      {
        field: 'IsTeamCount',
        title: this.translate.instant("TeamCount"),
        type: 'text',
        width: '70'
      }
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  ShowBatachSerList() {
    this.table_head = [
      {
        field: 'LOTNO',
        title: this.translate.instant("BatchSerial_No"),
        type: 'text'
      },
      {
        field: 'ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text'
      },
      {
        field: 'TOTALQTY',
        title: this.translate.instant("TOTALQTY"),
        headerClass: 'text-center',
        class: 'text-right',
        type: 'numeric',
      },
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text'
      }
    ];
    this.lookupTitle = this.translate.instant("Palletmessage.Lot");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  ShowPhyCntInnerItemList() {
    this.table_head = [
      {
        field: 'ItemCode',
        title: this.translate.instant("ItemCode"),
        type: 'text'
      },
      {
        field: 'BinCode',
        title: this.translate.instant("BinNo"),
        type: 'text'
      }
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showOutSOList() {
    this.table_head = [
      {
        field: 'DOCNUM',
        title: 'SO#',
        type: 'numeric',
        width: '100'
      },
      {
        field: 'DOCDUEDATE',
        title: 'Del. Date',
        type: 'date',
        width: '100'
      }
    ];

    this.lookupTitle = this.translate.instant("SalesOrderList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  on_item_select(selection) {
    if (!this.showSelection) {
      const lookup_key = selection.selectedRows[0].dataItem;
      //console.log("lookup_key - " + lookup_key);
      // console.log(lookup_key);
      this.lookupkey.emit(lookup_key);
      this.lookupvalue.emit(Object.values(lookup_key));
      //  console.log(selection);
      selection.selectedRows = [];
      selection.index = 0;
      selection.selected = false;
      this.serviceData = [];
      this.dialogOpened = false;
    }
  }

  onEditClick(lookup_key) {
    // this.lookupkey.emit(lookup_key);
    this.lookupvalue.emit(Object.values(lookup_key));
  }

  onDeleteRowClick(lookup_key) {
    // this.lookupkey.emit(lookup_key);
    this.deleteClick.emit(Object.values(lookup_key));
  }

  onCopyClick(lookup_key) {
    this.lookupkey.emit(lookup_key);
    this.copyItem.emit(Object.values(lookup_key));
    this.copyItemKey.emit(lookup_key);
  }

  onSelectedDeleteRowClick(lookup_key) {
   // this.lookupkey.emit(this.selectedValues);
    this.deleteSelectedItems.emit(Object.values(this.selectedValues));
  }

  showLotsList() {
    var titleValue = this.translate.instant("BatchNo");
    if (this.serviceData !== undefined && this.serviceData.length > 0) {
      if ("S" == this.serviceData[0].TRACKING) {
        titleValue = this.translate.instant("SerialNo");
      } else if ("N" == this.serviceData[0].TRACKING) {
        titleValue = this.serviceData[0].TRACKING;
      }
    }
    this.table_head = [
      {
        field: 'LOTNO',
        title: titleValue,
        type: 'text',
        width: '100'
      },
      {
        field: 'ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      }
    ];

    if ("N" == titleValue) {
      this.table_head.splice(0, 1);
    }

    this.lookupTitle = this.translate.instant("BatchSrBinList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showBinList() {
    this.table_head = [
      {
        field: 'BINNO',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("LookupTitle_BinNoList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  orderList() {
    this.table_head = [
      {
        field: 'Order No',
        title: this.translate.instant("Outbound_OrderNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'Item',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("LookupTitle_OrderList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showItemCodeList() {
    this.table_head = [
      {
        field: 'ItemCode',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'ItemName',
        title: this.translate.instant("ItemName"),
        type: 'text',
        width: '100'
      },
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  ItemCodeGenRowListView() {
    this.table_head = [
      {
        field: 'Code',
        title: this.translate.instant("Masking_Code"),
        type: 'text',
        width: '200'
      },
      {
        field: 'FinalString',
        title: this.translate.instant("Masking_FinalString"),
        type: 'text',
        width: '200'
      },
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  CarrierListView() {
    this.table_head = [
      {
        field: 'OPTM_CARRIERID',
        title: this.translate.instant("Carrier_CarrierId"),
        type: 'text',
        width: '200'
      },
      {
        field: 'OPTM_DESC',
        title: this.translate.instant("CT_Description"),
        type: 'text',
        width: '200'
      },
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  ContainerGroupListView() {
    this.table_head = [
      {
        field: 'OPTM_CONTAINER_GROUP',
        title: this.translate.instant("Container_Group"),
        type: 'text',
        width: '200'
      },
      {
        field: 'OPTM_DESC',
        title: this.translate.instant("CT_Description"),
        type: 'text',
        width: '200'
      },
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  on_Selectall_checkbox_checked(checkedvalue) {
    var isExist = 0;
    // this.CheckedData = []
    this.selectall = false
    if (checkedvalue == true) {
      if (this.serviceData.length > 0) {
        this.selectall = true
        for (let i = 0; i < this.serviceData.length; ++i) {
          let servivceItem: any = this.serviceData[i];
          this.selectedValues.push(servivceItem);
        }
      }
    }
    else {
      this.selectall = false
    }
  }

  onCheckboxClick(checked: any, index: number) {

    let servivceItem: any = this.serviceData[index];
    if (checked) {
      this.selectedValues.push(servivceItem);
    }
    else {
      // let rixd: number= this.selectedValues.findIndex(i => i.LOTNO == servivceItem.LOTNO && i.LOTNO == servivceItem.BINNO)
      var temp = this.selectedValues.splice(index, 1);
      this.selectedValues = this.selectedValues;
      //console.log("selectedValues.size", this.selectedValues.length);
    }
  }

  palletList() {
    this.table_head = [
      {
        field: 'Code',
        title: this.translate.instant("Plt_PalletNo"),
        type: 'text',
        width: '100'
      }
      // ,
      // {
      //   field: 'Name',
      //   title: this.translate.instant("ItemCode"),
      //   type: 'text',
      //   width: '100'
      // }
    ];
    this.lookupTitle = this.translate.instant("Plt_PalletList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showITRList() {
    this.table_head = [
      {
        field: 'DocNum',
        title: this.translate.instant("InvTransfer_ITRRequestNo"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("InvTransfer_ITRList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  Done() {
    this.lookupkey.emit(this.selectedValues);
    this.dialogOpened = false;
  }


}
