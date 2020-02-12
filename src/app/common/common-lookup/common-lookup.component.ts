import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import 'bootstrap';
import { ColumnSetting } from '../../models/CommonData';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-common-lookup',
  templateUrl: './common-lookup.component.html',
  styleUrls: ['./common-lookup.component.scss']
})
export class CommonLookupComponent implements OnInit {
  // @ViewChild("lookupsearch",{static:false}) _el: ElementRef;
  // input and output emitters
  @Input() serviceData: any;
  @Input() lookupfor: any;
  @Input() fillLookupArray: any;
  @Input() selectedImage: any
  @Output() lookupvalue = new EventEmitter();
  @Output() lookupkey = new EventEmitter();
  @Input() ruleselected: any;
  // @ViewChild('myInput',{static:false})
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
  showSelection: boolean = false;
  selectedValues: Array<any> = [];
  public mySelection: number[] = [];


  lookupPagable: boolean = false;
  lookupPageSize: number = 10;
  constructor(private translate: TranslateService, private router: Router) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
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

    if (this.serviceData != undefined && this.serviceData.length >= this.lookupPageSize) {
      this.lookupPagable = true;
    }
    if (this.lookupfor == "ShipmentList") {
      this.showShipmentList();
    } else if (this.lookupfor == "ItemsList") {
      this.showItemCodeList();
    } else if (this.lookupfor == "BatchNoList" || this.lookupfor == "BatchNoList2") {
      this.showBatchNoList();
    }
    else if (this.lookupfor == "CTList" || this.lookupfor == "PCTList") {
      this.showContainerType();
    } else if (this.lookupfor == "SBTrackFromBin") {
      this.showSBTrackFromBinList();
    } else if (this.lookupfor == "toBinsList") {
      this.showSBTrackFromBinList();
    }
    else if (this.lookupfor == "RecvBinList") {
      this.showRecvBinList();
    }
    else if (this.lookupfor == "PickItemBtchSer") {
      this.showPickItemBtchSerList();
    }
    else if(this.lookupfor == "CarrierList"){
      this.CarrierListView();
    }
    else if (this.lookupfor == "POItemList") {
      this.showPOItemList();
    }
    else if (this.lookupfor == "out-customer") {
      this.showCustomerList();
    }
    else if (this.lookupfor == "out-items") {
      this.showAvaliableItems();
    }

    else if (this.lookupfor == "out-order") {
      this.showOutSOList();
    }
    else if (this.lookupfor == "LotsList") {
      this.showLotsList();
    }
    else if (this.lookupfor == "FromBinList") {
      this.showBinList();
    }
    else if (this.lookupfor == "ToBinList") {
      this.showBinList();
    }
    else if (this.lookupfor == "OrderList") {
      this.orderList();
    } else if (this.lookupfor == "PhyCntItemList") {
      this.ShowPhyCntItemList();
    } else if (this.lookupfor == "showPhyCntItemsList") {
      this.ShowPhyCntInnerItemList();
    } else if (this.lookupfor == "ShowBatachSerList") {
      this.ShowBatachSerList();
    } else if (this.lookupfor == "PIOrderList") {
      this.orderList();
    } else if (this.lookupfor == "PalletList") {
      this.palletList();
    } else if (this.lookupfor == "ITRList") {
      this.showITRList();
    }
    else if (this.lookupfor == "SerialNoFrom") {
      this.showSrNoList("From");
      //this.showITRList();
    }
    else if (this.lookupfor == "SerialNoTo") {
      this.showSrNoList("To");
      //this.showITRList();
    }
    else if(this.lookupfor == "CustomerFrom"){
      this.showLookupCustomerList("From");      
    }
    else if(this.lookupfor == "CustomerTo"){
      this.showLookupCustomerList("To");      
    }

    else if (this.lookupfor == "ItemFrom") {
      this.showItemList("From");

    }
    else if(this.lookupfor == "ItemTo"){
      this.showItemList("To");      
    }
    else if(this.lookupfor == "WareHouse"){
      this.showLookupWHSList();      
    }
    else if (this.lookupfor == "CARList") {
      this.showCARList();
    }
    else if (this.lookupfor == "BinList") {
      this.showBinNoList();
    } else if (this.lookupfor == "DDList") {
      this.showDDList();
    }
    this.clearFilters();
    this.isColumnFilter = false
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

  showDDList() {
    this.table_head = [
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
        field: 'OPTM_PACKTYPE',
        title: this.translate.instant("CAR_PackType"),
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
    this.lookupTitle = this.translate.instant("CT_AutoPackRule");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }
  showLookupWHSList() {
    this.table_head = [
      {
        field: 'WhsCode',
        title: this.translate.instant("WHSCODE"),
        type: 'text',
        width: '100'
      },
      {
        field: 'WhsName',
        title: this.translate.instant("WHSName"),
        type: 'text',
        width: '100'
      }
    ];

    this.lookupTitle = this.translate.instant("LookupWareHouseFrm");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showLookupCustomerList(value) {
    this.table_head = [
      {
        field: 'CardCode',
        title: this.translate.instant("CardCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'CardName',
        title: this.translate.instant("CardName"),
        type: 'text',
        width: '100'
      },
    ];
    if (value === 'From')
      this.lookupTitle = this.translate.instant("LookupCustomerFrm");
    else
      this.lookupTitle = this.translate.instant("LookupCustomerTo");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }


  showItemList(value) {
    this.table_head = [
      {
        field: 'ItemCode',
        title: this.translate.instant("ItmCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'ItemName',
        title: this.translate.instant("ItmName"),
        type: 'text',
        width: '100'
      },
    ];
    if (value === 'From')
      this.lookupTitle = this.translate.instant("LookupItemFrm");
    else
      this.lookupTitle = this.translate.instant("LookupItemTo");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }



  showShipmentList() {
    this.table_head = [
      {
        field: 'OPTM_SHIPMENTID',
        title: this.translate.instant("PT_ShipmentId"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_BPCODE',
        title: this.translate.instant("CustomerCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_SHIPTO',
        title: this.translate.instant("Ship_To_Code"),
        type: 'text',
        width: '100'
      },
    ];
    this.lookupTitle = this.translate.instant("PT_ShipmentList");
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
        headerClass: 'text-right',
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

  showContainerType() {
    this.table_head = [
      {
        field: 'OPTM_CONTAINER_TYPE',
        title: this.translate.instant("CT_ContainerType"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_DESC',
        title: this.translate.instant("CT_Description"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_LENGTH',
        title: this.translate.instant("CT_Length"),
        headerClass: 'text-right',
        class: 'text-right',
        type: 'numeric',
        width: '100'
      },
      {
        field: 'OPTM_WIDTH',
        title: this.translate.instant("CT_Width"),
        headerClass: 'text-right',
        class: 'text-right',
        type: 'numeric',
        width: '100'
      },
      {
        field: 'OPTM_HEIGHT',
        title: this.translate.instant("CT_Height"),
        headerClass: 'text-right',
        class: 'text-right',
        type: 'numeric',
        width: '100'
      },
      {
        field: 'OPTM_MAXWEIGHT',
        title: this.translate.instant("CT_Max_Width"),
        headerClass: 'text-right',
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
        headerClass: 'text-right',
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

  showPickItemBtchSerList() {
    this.table_head = [
      // {
      //   field: 'OPTM_TASKID',
      //   title: this.translate.instant("VendorCode"),
      //   type: 'text',
      //   width: '100'
      // },
      {
        field: 'OPTM_ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_BTCHSER',
        title: this.translate.instant("BatchSerial_No"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_QTY',
        title: this.translate.instant("Quantity"),
        type: 'numeric',
        class: 'text-right',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("ItemDetail");
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
        headerClass: 'text-right',
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
        headerClass: 'text-right',
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
        headerClass: 'text-right',
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
      this.lookupkey.emit(lookup_key);
      this.lookupvalue.emit(Object.values(lookup_key));
      selection.selectedRows = [];
      selection.index = 0;
      selection.selected = false;
      this.serviceData = [];
      this.dialogOpened = false;
    }
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

  showBinNoList() {
    this.table_head = [
      {
        field: 'BinCode',
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
  showSrNoList(value) {

    this.table_head = [
      {
        field: 'SODocNum',
        title: this.translate.instant("DocNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'SODocEntry',
        title: this.translate.instant("DocEntry"),
        type: 'text',
        width: '100'
      }
    ];
    if (value === "From")
      this.lookupTitle = this.translate.instant("SrNoTitleFrom");
    else
      this.lookupTitle = this.translate.instant("SrNoTitleTo");
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
