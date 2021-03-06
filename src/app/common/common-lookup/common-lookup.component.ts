import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import 'bootstrap';
import { ColumnSetting } from '../../models/CommonData';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';

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
  @Input() partPerQty: any;
  @Input() qtyAdded: any;
  fromWhere: any;

  constructor(private translate: TranslateService, private router: Router, private toastr: ToastrService) {
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
      this.lookupvalue.emit('close')
    }
    this.dialogOpened = false;
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
    this.fromWhere = localStorage.getItem("FromWhere");
    if (this.fromWhere == "CreateContainer") {
      this.selectedValues = []
      this.qtyAdded = 0
      if(this.serviceData != undefined){
        for (var i = 0; i < this.serviceData.length; i++) {
          if (this.serviceData[i].OldData) {
            this.selectedValues.push(this.serviceData[i])
            this.qtyAdded = this.qtyAdded + Number("" + this.serviceData[i].QuantityToAdd)
          }
        }
      }
    }
  }

  async ngOnChanges(): Promise<void> {

    if (this.serviceData != undefined && this.serviceData.length >= this.lookupPageSize) {
      this.lookupPagable = true;
    }
    if (this.lookupfor == "ShipmentList" || this.lookupfor == "ShipmentListForFilter" || this.lookupfor == "ShipIdFrom" || this.lookupfor == "ShipIdTo") {
      this.showShipmentList();
    } else if (this.lookupfor == "ItemsList") {
      this.showItemCodeList();
    } else if (this.lookupfor == "BatchNoList" || this.lookupfor == "BatchNoList2") {
      this.showBatchNoList();
    }
    else if (this.lookupfor == "CTList" || this.lookupfor == "PCTList") {
      this.showContainerType();
    } 
    else if(this.lookupfor == "ParentCTList"){
      this.showParentContList();
    }
    else if (this.lookupfor == "SBTrackFromBin") {
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
    else if (this.lookupfor == "CarrierList" || this.lookupfor == "CCFrom" || this.lookupfor == "CCTo") {
      this.CarrierListView();
    }
    else if (this.lookupfor == "POItemList") {
      this.showPOItemList();
    }
    else if (this.lookupfor == "ShipFrom" || this.lookupfor == "ShipTo") {
      this.showShiptoCodeList();
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
    } else if (this.lookupfor == "ShipMentProcess") {
      this.showShipMentProcessList();
    }
    else if (this.lookupfor == "SerialNoFrom") {
      this.showSrNoList("From");
      //this.showITRList();
    }
    else if (this.lookupfor == "SerialNoTo") {
      this.showSrNoList("To");
      //this.showITRList();
    }
    else if (this.lookupfor == "CustomerFrom") {
      this.showLookupCustomerList("From");
    }
    else if (this.lookupfor == "CustomerTo") {
      this.showLookupCustomerList("To");
    }

    else if (this.lookupfor == "ItemFrom") {
      this.showItemList("From");

    }
    else if (this.lookupfor == "ItemTo") {
      this.showItemList("To");
    }
    else if (this.lookupfor == "WareHouse") {
      this.showLookupWHSList();
    }
    else if (this.lookupfor == "CARList") {
      this.showCARList();
    }
    else if (this.lookupfor == "BinList"||this.lookupfor == "From_BinList"||this.lookupfor == "To_BinList") {
      this.showBinNoList();
    } else if (this.lookupfor == "SOList") {
      this.showOutSOListNew();
    } else if (this.lookupfor == "GroupCodeList" || this.lookupfor == "GroupCode") {
      this.showContainerGroupCodeList();
    } else if (this.lookupfor == "DDList" || this.lookupfor == "DDFrom" || this.lookupfor == "DDTo") {
      this.showDDList();
    } else if (this.lookupfor == "GroupCode") {
      this.showGroupCodeList();
    } else if (this.lookupfor == "BinRangeList") {
      this.showBinRangeList();
    } else if (this.lookupfor == "WhsZoneList") {
      this.showWhsZoneList();
    }
    else if (this.lookupfor == "ContainsItem") {
      this.ContainsItemListView();
    } else if (this.lookupfor == "BatchSerialList") {
      this.showBatchSerialItems();
    } else if (this.lookupfor == "ItemsListByRuleId") {
      this.showItemCodeListByRuleId();
    } else if (this.lookupfor == "ContainerIdList") {
      this.showContainerIdList();
    } else if(this.lookupfor == "WOLIST" || this.lookupfor == "WOFrom" || this.lookupfor == "WOTo") {
      this.workOrderList();
    }
    else if(this.lookupfor == "DocNumbering") {
      this.DocumentNumberingView();
    } else if(this.lookupfor == "ContItemsList"){
      this.showContItemsList();
    }else if(this.lookupfor == "ContItemBatchSerialList"){
      this.showContItemBatchSerialList();
      
    }else if(this.lookupfor == "RULEITEMS"){
      this.showRuleItemList();
    } else if(this.lookupfor == "AutoAllocate"||this.lookupfor == "PicklistShipments"){
      this.showShipsForAutoAllocate();
    }else if(this.lookupfor == "ContItems"){
      this.showContitems();
    }else if(this.lookupfor == "showContBatchSerialList"){
      this.showContBatchSerialList();
    }
    else if(this.lookupfor == "UserGrp"){
      this.showUserGrpList();
    }
    this.dialogOpened = true;
    this.clearFilters();
    this.isColumnFilter = false
  }

  workOrderList() {
    this.table_head = [
      {
        field: 'OPTM_WONO',
        title: this.translate.instant("WorkOrderNo"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_FGCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_FROMOPERNO',
        title: this.translate.instant("FROMOPERNO"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_FROMOPRCODE',
        title: this.translate.instant("FROMOPRCODE"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_ID',
        title: this.translate.instant("PT_TaskId"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_WHSE',
        title: this.translate.instant("Login_Warehouse"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_WC',
        title: this.translate.instant("WorkCenter"),
        type: 'text',
        width: '100'
      }
      
    ];
    this.lookupTitle = this.translate.instant("WOList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showContainerIdList() {
    this.table_head = [
      {
        field: 'OPTM_CONTAINERID',
        title: this.translate.instant("ContainerId"),
        type: 'text',
        width: '90'
      },
      {
        field: 'OPTM_CONTCODE',
        title: this.translate.instant("ContainerCode"),
        type: 'text',
        width: '160'
      },
      {
        field: 'OPTM_CONTTYPE',
        title: this.translate.instant("CT_ContainerType"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_STATUS_VAL',
        title: this.translate.instant("ContainerStatus"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_SHIPELIGIBLE_VAL',
        title: this.translate.instant("Purpose"),
        type: 'text',
        width: '90'
      },
      {
        field: 'OPTM_BUILT_SOURCE_VAL',
        title: this.translate.instant("PackProcess"),
        type: 'text',
        width: '150'
      }
    ];
    this.lookupTitle = this.translate.instant("Container_List");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }
  DocumentNumberingView()
    {
      this.table_head = [
        {
          field: 'Code',
          title: this.translate.instant("Masking_Code"),
          type: 'text',
          width: '100'
        },
        {
          field: 'Name',
          title: this.translate.instant("CardName"),
          type: 'text',
          width: '100'
        }
        
      ];
      this.lookupTitle = this.translate.instant("ItemsList");
      if (this.serviceData !== undefined) {
        if (this.serviceData.length > 0) {
          this.dialogOpened = true;
        }
      }
    }

  showItemCodeListByRuleId() {
    this.table_head = [
      {
        field: 'OPTM_ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      }
      // ,
      // {
      //   field: 'ItemName',
      //   title: this.translate.instant("ItemName"),
      //   type: 'text',
      //   width: '100'
      // },
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showContItemsList(){
    this.table_head = [
      {
        field: 'ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',        
        width: '100'
      }
      ,
      {
        field: 'OPTM_TRACKING_VALUE',
        title: this.translate.instant("TrackType"),
        type: 'text',
        width: '100'
      },{
        field: 'OPTM_PARTS_PERCONT_VAL',
        title: this.translate.instant("Rule_Qty"),
        type: 'text',
        class: 'text-right',
        headerClass: 'text-right',
        width: '100'
      },
      {
        field: 'QtyAdded',
        title: 'Qty Added',
        type: 'text',
        class: 'text-right',
        headerClass: 'text-right',
        width: '100'
      },
      {
        field: 'BalQty',
        title: "Bal Qty",
        type: 'text',
        class: 'text-right',
        headerClass: 'text-right',
        width: '100'
      },
      {
        field: 'INVENTORY',
        title: this.translate.instant("BIN_Qty"),
        type: 'text',
        class: 'text-right',
        headerClass: 'text-right',
        width: '100'
      },
      {
        field: 'INTCONTQTY',
        title: this.translate.instant("INT_CONT_QTY"),
        type: 'text',
        class: 'text-right',
        headerClass: 'text-right',
        width: '100'
      },
      {
        field: 'SHIPCNTQTY',
        title: this.translate.instant("SHP_CONT_QTY"),
        type: 'text',
        class: 'text-right',
        headerClass: 'text-right',
        width: '100'
      },
      {
        field: 'TOTALQTY',
        title: this.translate.instant("Item_Qty"),
        type: 'text',
        class: 'text-right',
        headerClass: 'text-right',
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

  showContBatchSerialList(){
    this.table_head = [
      {
        field: 'OPTM_BTCHSER',
        title: this.translate.instant("Batch_Serial"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },{
        field: 'OPTM_WHSE',
        title: this.translate.instant("Warehouse"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_BIN',
        title: this.translate.instant("Bin_No"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_QUANTITY',
        title: this.translate.instant("Quantity"),
        type: 'text',
        class: 'text-right',
        headerClass: 'text-right',
        width: '100'
      },
    ];
    this.lookupTitle = this.translate.instant("BatchSerialList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }  

  showUserGrpList(){
    this.table_head = [
      {
        field: 'OPTM_GROUPCODE',
        title: this.translate.instant("AssignedUserGroup"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_WHSE',
        title: this.translate.instant("Warehouse"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("UserGroupList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }  

  showContItemBatchSerialList(){
    this.table_head = [
      {
        field: 'LOTNO',
        title: this.translate.instant("Batch_Serial"),
        type: 'text',
        width: '100'
      }
      ,
      {
        field: 'ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },{
        field: 'WHSCODE',
        title: this.translate.instant("Warehouse"),
        type: 'text',
        width: '100'
      },
      {
        field: 'BINNO',
        title: this.translate.instant("Bin_No"),
        type: 'text',
        width: '100'
      },
      {
        field: 'TOTALQTY',
        title: this.translate.instant("Quantity"),
        type: 'text',
        class: 'text-right',
        width: '100'
      },
    ];
    this.lookupTitle = this.translate.instant("BatchSerialList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showRuleItemList(){
    this.table_head = [
      {
        field: 'OPTM_ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_TRACKING_VALUE',
        title: this.translate.instant("TrackType"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_PARTS_PERCONT_VAL',
        title: this.translate.instant("Rule_Qty"),
        type: 'text',
        class: 'text-right',
        headerClass: 'text-right',
        width: '100'
      },
      {
        field: 'OPTM_MIN_FILLPRCNT',
        title: "Min Fill Percent",
        type: 'text',
        headerClass: 'text-right',
        class: 'text-right',
        width: '100'
      }

      
    ];
    this.lookupTitle = this.translate.instant("Rule_Items");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showContainerGroupCodeList() {
    this.table_head = [
      {
        field: 'OPTM_CONTAINER_GROUP',
        title: this.translate.instant("ContainerGroupingCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_DESC',
        title: this.translate.instant("CT_Description"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("ContainerGroupingList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showOutSOListNew() {
    this.table_head = [
      {
        field: 'DocNum',
        title: this.translate.instant("SO_NUM"),
        type: 'numeric',
        width: '100'
      },
      {
        field: 'CardCode',
        title: this.translate.instant("CustomerId"),
        type: 'text',
        width: '100'
      },
      {
        field: 'CardName',
        title: this.translate.instant("CustomerName"),
        type: 'text',
        width: '100'
      }
      //,
      // {
      //   field: 'DocNum',
      //   title: 'Doc Num',
      //   type: 'date',
      //   width: '100'
      // }
    ];

    this.lookupTitle = this.translate.instant("SalesOrderList");
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

  showDDList() {
    this.table_head = [
      {
        field: 'OPTM_DOCKDOORID',
        title: this.translate.instant("DD_ID"),
        headerClass: 'text-left',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_DESC',
        title: this.translate.instant("DD_DESC"),
        headerClass: 'text-left',
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
  showGroupCodeList() {
    this.table_head = [
      {
        field: 'OPTM_GROUPCODE',
        title: this.translate.instant("GroupCode"),
        headerClass: 'text-left',
        type: 'text',
        width: '150'
      }
    ];
    this.lookupTitle = this.translate.instant("GroupList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showBinRangeList() {
    this.table_head = [
      {
        field: 'OPTM_WHSCODE',
        title: this.translate.instant("WarehouseCode"),
        headerClass: 'text-left',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_BIN_RANGE',
        title: this.translate.instant("WhsUserGroup_Bin_Range"),
        headerClass: 'text-left',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_FROM_BIN',
        title: this.translate.instant("FromBinCode"),
        headerClass: 'text-left',
        type: 'text',
        width: '150'
      }, {
        field: 'OPTM_TO_BIN',
        title: this.translate.instant("ToBinCode"),
        headerClass: 'text-left',
        type: 'text',
        width: '150'
      }
    ];
    this.lookupTitle = this.translate.instant("BinRange");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showWhsZoneList() {

    this.table_head = [
      {
        field: 'OPTM_WHSCODE',
        title: this.translate.instant("WarehouseCode"),
        headerClass: 'text-left',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_WHSZONE',
        title: this.translate.instant("WhsZone"),
        headerClass: 'text-left',
        type: 'text',
        width: '150'
      },
      {
        field: 'OPTM_ZONETYPE',
        title: this.translate.instant("WhseZoneType"),
        headerClass: 'text-left',
        type: 'text',
        width: '150'
      }
    ];
    this.lookupTitle = this.translate.instant("Zone_list");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  // showCARList() {
  //   this.table_head = [
  //     {
  //       field: 'OPTM_RULEID',
  //       title: this.translate.instant("CAR_CPackRule"),
  //       headerClass: 'text-left',
  //       class: 'text-right',
  //       type: 'numeric',
  //       width: '150'
  //     },
  //     {
  //       field: 'OPTM_CONTTYPE',
  //       title: this.translate.instant("CT_ContainerType"),
  //       headerClass: 'text-left',
  //       type: 'text',
  //       width: '150'
  //     },

  //     {
  //       field: 'OPTM_PACKTYPE',
  //       title: this.translate.instant("CAR_PackType"),
  //       headerClass: 'text-left',
  //       class: 'text-right',
  //       type: 'numeric',
  //       width: '150'
  //     },
  //     {
  //       field: 'OPTM_ADD_TOCONT',
  //       title: this.translate.instant("CAR_AddPartsToContainer"),
  //       headerClass: 'text-left',
  //       type: 'boolean',
  //       width: '150'
  //     }
  //   ];
  //   this.lookupTitle = this.translate.instant("CT_AutoPackRule");
  //   if (this.serviceData !== undefined) {
  //     if (this.serviceData.length > 0) {
  //       this.dialogOpened = true;
  //     }
  //   }
  // }

  showCARList(){
    this.table_head = [
      {
        field: 'OPTM_RULEID',
        title: this.translate.instant("CAR_CPackRule"),
        headerClass: 'text-left',
        class: 'text-left',
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_CONTTYPE',
        title: this.translate.instant("CT_ContainerType"),
        headerClass: 'text-left',
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_RULE_DESC',
        title: this.translate.instant("CT_Description"),
        headerClass: 'text-left',
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_CONTUSE',
        title: this.translate.instant("Container_Use"),
        headerClass: 'text-left',
        class: 'text-left',
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_ADD_TOCONT',
        title: this.translate.instant("CAR_AddPartsToContainer"),
        headerClass: 'text-left',
        type: 'boolean',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("AutoPackRule");
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
        field: 'OPTM_SHIPMENT_CODE',
        title: this.translate.instant("Shipment_Code"),
        type: 'text',
        width: '200'
      },
      {
        field: 'OPTM_STATUS_VAL',
        title: this.translate.instant("Status"),
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
      {
        field: 'OPTM_USE_CONTAINER',
        title: this.translate.instant("ShipmentContainers"),
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_WHSCODE',
        title: this.translate.instant("Warehouse"),
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

  showBatchSerialItems() {
    this.partPerQty = localStorage.getItem("PartPerQty");
    if (this.partPerQty == undefined || this.partPerQty == '') {
      this.partPerQty = "0"
    }
    this.partPerQty = Number(this.partPerQty);

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
        field: 'ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '100'
      },
      {
        field: 'LOTNO',
        title: this.translate.instant("BatchSerial_No"),
        type: 'text',
        width: '100'
      },

      {
        field: 'BinCode',
        title: this.translate.instant("BinNo"),
        type: 'text',
        width: '160'
      },
      {
        field: 'Quantity',
        headerClass: 'text-left',
        class: 'text-right',
        title: this.translate.instant("AvailableQty"),
        type: 'numeric',
        width: '80'
      }
    ];

    
    //this.lookupTitle = this.translate.instant("BatchSerialList");
    if (this.serviceData !== undefined) {
      var len = this.serviceData.length;
      if (len > 0) {       

        if(this.serviceData[0].OPTM_TRACKING  == "S"){
          this.lookupTitle = this.translate.instant("Serial");
        }
        else if(this.serviceData[0].OPTM_TRACKING == "B"){
          this.lookupTitle = this.translate.instant("Batch");
        }
        else{
          this.lookupTitle = this.translate.instant("None");
        } 

        var tempData: any;
        for (var i = 0; i < len; i++) {
          var qty = Number(this.serviceData[i].TOTALQTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          this.serviceData[i].TOTALQTY = qty;
        }
        this.dialogOpened = true;
      }
    }
  }

  showParentContList() {
    this.table_head = [
      {
        field: 'OPTM_PARENT_CONTTYPE',
        title: this.translate.instant("Parent_Container_Type"),
        type: 'text',
        width: '100'
      },   
      {
        field: 'OPTM_CONT_PERPARENT',
        title: this.translate.instant("CTRContainersPerParent"),
        headerClass: 'text-right',
        class: 'text-right',
        type: 'text',
        width: '100'
      },
      {
        field: 'OPTM_CONT_PARTOFPARENT',
        title: this.translate.instant("CTRContainerPartofParent"),
        headerClass: 'text-right',
        class: 'text-right',
        type: 'text',
        width: '100'
      }   
    ];
    this.lookupTitle = this.translate.instant("Parent_Container_Type");
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

  showShiptoCodeList() {
    this.table_head = [
      {
        title: this.translate.instant("ShipTo"),
        field: 'Address',
        type: 'text',
        width: '100'
      },
      {
        title: this.translate.instant("CustomerName"),
        field: 'CardCode',
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("Ship_To_Code");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showContitems() {
    this.table_head = [
      {
        title: "Item Code",
        field: 'OPTM_ITEMCODE',
        type: 'text',
        width: '100'
      },
      {
        title: this.translate.instant("TrackType"),
        field: 'OPTM_TRACKING_VALUE',
        type: 'text',
        width: '100'
      },
      {
        title: "Item Qty.",
        field: 'OPTM_QUANTITY_VAL',
        class : 'text-right',
        headerClass: 'text-right',
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  showShipsForAutoAllocate() {
    this.table_head = [
      {
        title: this.translate.instant("PT_ShipmentId"),
        field: 'OPTM_SHIPMENTID',
        type: 'text',
        width: '100'
      },
      {
        title: this.translate.instant("Shipment_Code"),
        field: 'OPTM_SHIPMENT_CODE',
        type: 'text',
        width: '170'
      },
      {
        title: this.translate.instant("Status"),
        field: 'STATUS',
        type: 'text',
        width: '100'
      },
      {
        title: this.translate.instant("Use_Container"),
        field: 'OPTM_USE_CONTAINER',
        type: 'text',
        width: '80'
      }
      ,
      {
        title: this.translate.instant("Customer"),
        field: 'OPTM_BPCODE',
        type: 'text',
        width: '100'
      }
      ,
      {
        title: this.translate.instant("Schedule_Datetime"),
        field: 'OPTM_SCH_DATE',
        type: 'text',
        width: '150'
        // format: 'MM/dd/yyyy'
      }
    ];
    this.lookupTitle = this.translate.instant("PT_ShipmentList");
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

  ContainsItemListView() {
    this.table_head = [
      {
        field: 'OPTM_ITEMCODE',
        title: this.translate.instant("ItemCode"),
        type: 'text',
        width: '200'
      }
    ];
    this.lookupTitle = this.translate.instant("ItemsList");
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.dialogOpened = true;
      }
    }
  }

  onCheckboxClick(chkSelection, checked: any, index: number, dataItem) {
    let servivceItem: any = this.serviceData[index];
    if (checked) {

      servivceItem.QuantityToAdd = servivceItem.Quantity;
      this.selectedValues.push(servivceItem);
      //If check assign available qty as default qty to add
      this.serviceData[index].OldData = true;
      this.serviceData[index].QuantityToAdd = servivceItem.Quantity;

      this.getTotalQtyOfSelectedItems();

      if (this.qtyAdded > this.partPerQty) {
        // this.toastr.error('', this.translate.instant("QtyToAddValidMsg"));
        this.serviceData[index].OldData = false;
        chkSelection.checked = false;
        this.serviceData[index].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));

        let indexTemp = this.selectedValues.findIndex(r => r.LOTNO == servivceItem.LOTNO);
        if (indexTemp > -1) {
          this.selectedValues.splice(indexTemp, 1);
        }
        this.getTotalQtyOfSelectedItems();

        var result = this.assignRemainQty(servivceItem.Quantity);
        if (result != -1) {
          this.serviceData[index].OldData = true;
          chkSelection.checked = true;
          servivceItem.QuantityToAdd = Number(result).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          this.serviceData[index].QuantityToAdd = Number(result).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          this.selectedValues.push(servivceItem);
          this.getTotalQtyOfSelectedItems();
        } else {
          this.toastr.error('', this.translate.instant("QtyToAddValidMsg"));
        }
      }
    } else {
      for (var i = 0; i < this.selectedValues.length; i++) {
        if (servivceItem.LOTNO == this.selectedValues[i].LOTNO) {
          this.selectedValues.splice(i, 1);
          break;
        }
      }
      //Reset qty if unchecked
      for (var i = 0; i < this.serviceData.length; i++) {
        if (i == index) {
          this.serviceData[i].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
        }
      }
      this.getTotalQtyOfSelectedItems();
    }
  }

  assignRemainQty(avlQty) {
    let remQty: any = parseFloat(this.partPerQty) - parseFloat(this.qtyAdded);
    if (remQty == 0) {
      return -1
    }
    var qq = (avlQty - parseFloat(remQty)) > 0 ? parseFloat(remQty) : avlQty;

    let diff = parseFloat(remQty) - qq;
    if (diff >= 0) {
      return qq;

    } else {
      return -1;
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

  showShipMentProcessList() {
    this.table_head = [
      {
        field: 'Name',
        title: this.translate.instant("ShipmentProcess"),
        type: 'text',
        width: '100'
      }
    ];
    this.lookupTitle = this.translate.instant("ShipmentProcess");
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
        title: this.translate.instant("SONumber"),
        type: 'text',
        width: '100'
      },
      {
        field: 'CardCode',
        title: this.translate.instant("Customer"),
        type: 'text',
        width: '100'
      },
      {
        field: 'DelDate',
        title: this.translate.instant("DueDate"),
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
    if (this.fromWhere == "CreateContainer") {


      for (var i = 0; i < this.selectedValues.length; i++) {
        if (this.selectedValues[i].QuantityToAdd == 0) {
          this.toastr.error('', this.translate.instant("CheckedItemQtyValid"));
          return;
        }
      }

      if (this.getTotalQtyOfSelectedItems() > this.partPerQty) {
        this.toastr.error('', this.translate.instant("QtyToAddValidMsg"));
        return;
      }
    }

    this.lookupkey.emit(this.selectedValues);
    this.dialogOpened = false;
  }

  getTotalQtyOfSelectedItems(): number {
    var sum = 0;
    for (var i = 0; i < this.selectedValues.length; i++) {
      sum = sum + Number("" + this.selectedValues[i].QuantityToAdd)
    }
    this.qtyAdded = sum;
    return sum;
  }

  resetAddedQty(index) {
    let servivceItem: any = this.serviceData[index];
    this.serviceData[index].QuantityToAdd = 0;
    this.qtyAdded = this.qtyAdded - servivceItem.QuantityToAdd;
    this.getTotalQtyOfSelectedItems();
  }

  onQtyToAddChange(value, index, qtytoadd) {
    let servivceItem: any = this.serviceData[index];
    value = parseFloat(value);
    for (var i = 0; i < this.selectedValues.length; i++) {
      if (servivceItem.LOTNO == this.selectedValues[i].LOTNO) {
        if (value == 0) {
          this.toastr.error('', this.translate.instant("CheckedItemQtyValid"));
          this.selectedValues[i].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          this.serviceData[index].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          qtytoadd.value = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
        } else if (value > this.selectedValues[i].Quantity) {
          this.selectedValues[i].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          this.toastr.error('', this.translate.instant("AddedQtyValidMsg"));
          this.serviceData[index].QuantityToAdd = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          qtytoadd.value = Number(0).toFixed(Number(localStorage.getItem("DecimalPrecision")));
          // this.resetAddedQty(index);
          //break
        } else {
          this.selectedValues[i].QuantityToAdd = value;
          this.selectedValues[i].Balance = this.selectedValues[i].Quantity - value;
          break;
        }
      }
    }
    this.qtyAdded = 0
    for (var i = 0; i < this.selectedValues.length; i++) {
      this.qtyAdded = this.qtyAdded + Number("" + this.selectedValues[i].QuantityToAdd)
    }
    if (this.qtyAdded > this.partPerQty) {
      this.toastr.error('', this.translate.instant("QtyToAddValidMsg"));
    }
  }
}
