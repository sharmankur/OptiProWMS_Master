import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { ShipmentWizardService } from '../../services/shipment-wizard.service';
import { isNumeric } from 'rxjs/util/isNumeric';
@Component({
  selector: 'app-shipment-wizard-view',
  templateUrl: './shipment-wizard-view.component.html',
  styleUrls: ['./shipment-wizard-view.component.scss']
})
export class ShipmentWizardViewComponent implements OnInit {

  showLoader: boolean = false;
  hideLookup: boolean = true;
  lookupfor: string;
  serviceData: any[];
  UseContainer: boolean = false;
  SOpageSize = 10;
  SOpagable: boolean = false;
  SPpagable: boolean = false;
  SPpageSize = 10;
  pageSize = 10;

  constructor(private WizardService: ShipmentWizardService, private router: Router, private commonservice: Commonservice,
    private toastr: ToastrService, private translate: TranslateService) { }
  // GRID VAIRABLE
  //public gridView: any = [{"ProductName":"test"}];
  public items: any[] = [];
  public mySelection: number[] = [];
  public skip = 0;
  // GRID VARIABLE

  public value: Date = new Date(2000, 2, 10);
  public currentStep = 1;
  public maxStep = 5;

  public SrNoFrom: string = '';
  public SrNoTo: string = '';
  public DueDateFrom: string = '';
  public DueDateTo: string = '';
  public CustomerFrom: string = '';
  public CustomerTo: string = '';
  public ItemFrom: string = '';
  public ItemTo: string = '';
  public WareHouse: string = '';
  public ShipFrom: string = '';
  public ShipTo: string = '';
  public OpenQtyFrom: string = '';
  public OpenQtyTo: string = '';
  public NoofOpenLinesFrom: string = '';
  public NoofOpenLinesTo: string = '';
  public gridData: any;
  public HoldSelectedRow: any = {};

  public HoldCheckBoxValue: any = [];
  public SetParameter: any = [];
  public CHKCustomer: boolean = true;
  public CHKShipto: boolean = true;
  public CHKItem: boolean = true;
  public CHKSOno: boolean = true;
  public CHKDueDate: boolean = true;
  public Step1: boolean = false;
  public Step2: boolean = false;
  public Step3: boolean = false;
  public step4: boolean = false;
  public SELECT: boolean = false;
  public isColumnFilter33: boolean = false;
  public AllConsolidateData: any = [];
  public ConsolidatedDataSelection: any = {};
  public GetCreateShipMentData: any = [];
  dateFormat: string;
  pageable: boolean = false;

  ngOnInit() {
    // this.HoldSelectedRow = [];
    this.HoldSelectedRow.ConsolidationsBy = [];
    this.HoldSelectedRow.Company = [];
    this.HoldSelectedRow.SOLines = [];
    this.ConsolidatedDataSelection.SelectedRows = [];
    this.ConsolidatedDataSelection.Company = [];
    this.dateFormat = localStorage.getItem("DATEFORMAT");
  }

  onPrevClick() {
    if (this.currentStep > 1) {
      this.currentStep = this.currentStep - 1;
    }
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  onNextClick() {
    let CheckValue = false;
    if (this.currentStep < this.maxStep) {

      if (this.currentStep === 1) {
        if (this.WareHouse != "" && this.WareHouse != undefined) {
          this.GetSalesWizardData();
        }
        else {
          this.toastr.error('', this.translate.instant("WareHouseValidation"));
          return;
        }
      }

      if (this.currentStep === 2) {
        if (this.HoldSelectedRow.SOLines.length > 0) {
          this.currentStep = this.currentStep + 1;
          return;
        }
        else {
          this.toastr.error('', this.translate.instant("GridCheckBoxValidation"));
          return;
        }
      }
      if (this.currentStep === 3) {
        if (this.CHKCustomer === false && this.CHKDueDate === false && this.CHKItem === false && this.CHKShipto === false &&
          this.CHKSOno === false) {
          this.toastr.error('', this.translate.instant("CheckBoxValidation"));
          return;

        }
        else {
          this.HoldSelectedRow.ConsolidationsBy.push({
            Customer: this.CHKCustomer, DueDate: this.CHKDueDate,
            Item: this.CHKItem, ShipTo: this.CHKShipto, SONO: this.CHKSOno
          })
          this.GetConsolidatedData();
        }
      }
      if (this.currentStep === 4) {
        if (this.ConsolidatedDataSelection.SelectedRows.length > 0) {
          this.CreateShipMentData();
        }
        else {
          this.toastr.error('', this.translate.instant("GridCheckBoxValidation"));
          return;
        }
      }
    }
  }

  onStepClick(currentStep) {

    //this.currentStep = currentStep;
  }
  CreateShipMentData() {
    this.ConsolidatedDataSelection.Company = [];
    let uc = this.UseContainer == true ? "Y" : "N";
    this.ConsolidatedDataSelection.Company.push({
      CompanyDBId: localStorage.getItem("CompID"), UserId: localStorage.getItem("UserId"), OPTM_USE_CONTAINER: uc,
      OPTM_FUNCTION: "Shipping",
      OPTM_OBJECT: "Shipment"
    })
    this.WizardService.CreateShipMentData(this.ConsolidatedDataSelection).subscribe(
      resp => {

        if (resp != undefined && resp != null) {
          for (let i = 0; i < resp.ShipmentHdr.length; i++) {
            resp["ShipmentHdr"][i]["ShipmentChildData"] = []
          }
          resp["ShipmentHdr"]["ShipmentChildData"] = []
          for (let i = 0; i < resp.ShipmentHdr.length; i++) {
            if (resp["ShipmentHdr"][i].SELECT === "") resp["ShipmentHdr"][i].SELECT = false;
            for (let j = 0; j < resp.ShipmentDtl.length; j++) {
              if (resp["ShipmentHdr"][i].OPTM_DOCENTRY === resp["ShipmentDtl"][j].OPTM_DOCENTRY) {
                resp["ShipmentDtl"][j].OPTM_QTY = Number(resp["ShipmentDtl"][j].OPTM_QTY).toFixed(Number(localStorage.getItem("DecimalPrecision")));
                resp["ShipmentHdr"][i]["ShipmentChildData"].push(resp["ShipmentDtl"][j]);
              }
            }
          }
          this.GetCreateShipMentData = resp["ShipmentHdr"];
          if (this.GetCreateShipMentData.length > this.pageSize) {
            this.pageable = true;
          } else {
            this.pageable = false;
          }
          this.currentStep = this.currentStep + 1;
          this.toastr.success('', this.translate.instant("CreatedShipmentMsg"));
        }
        else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        console.log("Error:", error);
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        }

      }
    )
  }
  //get step 2nd data
  GetSalesWizardData() {

    this.SetParameter = [];
    this.SetParameter.push({
      FROMCARDCODE: this.CustomerFrom,
      TOCARDCODE: this.CustomerTo,
      DOCDUEFROM: this.DueDateFrom,
      DOCDUETO: this.DueDateTo,
      ITEMCODEFROM: this.ItemFrom,
      ITEMCODETO: this.ItemTo,
      FROMSO: this.SrNoFrom,
      TOSO: this.SrNoTo,
      WHSCODE: this.WareHouse,
      SHIPFROM: this.ShipFrom,
      SHIPTO: this.ShipTo,
      OPENQTYFROM: this.OpenQtyFrom,
      OPENQTYTO: this.OpenQtyTo,
      NOOFFOPENLINESFROM: this.NoofOpenLinesFrom,
      NOOFFOPENLINESTO: this.NoofOpenLinesTo,
      CompanyDBId: localStorage.getItem("CompID")
    });

    this.WizardService.GetSalesOrder(this.SetParameter).subscribe(
      resp => {
        if (resp != undefined && resp != null) {
          this.currentStep = this.currentStep + 1;

          for (let i = 0; i < resp.length; i++) {
            if (resp[i].SELECT === "") resp[i].SELECT = false;
            if (resp[i].SalesUOM === null) resp[i].SalesUOM = '';
            if (resp[i].InvntryUom === null) resp[i].InvntryUom = '';
          }
          this.gridData = resp;
          if (this.gridData.length > this.SOpageSize) {
            this.SOpagable = true;
          } else {
            this.SOpagable = false;
          }
        }
        else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        console.log("Error:", error);
        //this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        }

      },
      () => {
      }
    )
  }
  onExpandWarehouse(event) {
    /*if(event.dataItem.selectedWarehouse == 'blank'){
      this.MessageService.errormessage("please choose Warehouse"); 
    }*/
  }

  gridConsilidateDataSelectionChange(selection, Data) {
    if (Data.selectedRows.length > 0) {
      this.ConsolidatedDataSelection.SelectedRows.push(Data.selectedRows[0].dataItem)
    }
    else if (Data.deselectedRows.length > 0) {
      let Shipment_Id = Data.deselectedRows[0].dataItem.Shipment_Id
      let Customer = Data.deselectedRows[0].dataItem.Customer
      for (let i = 0; i < this.ConsolidatedDataSelection.SelectedRows.length; i++) {
        if (this.ConsolidatedDataSelection.SelectedRows[i].Shipment_Id === Shipment_Id && this.ConsolidatedDataSelection.SelectedRows[i].Customer === Customer) {
          this.ConsolidatedDataSelection.SelectedRows.splice(i, 1);
        }
      }
    }
    console.log(this.ConsolidatedDataSelection.SelectedRows);
  }
  GetConsolidatedData() {
    let tempdata = [];
    //this.HoldSelectedRow.Company.push({CompanyDBId: localStorage.getItem("CompID"),UserId:localStorage.getItem("UserId")})
    this.HoldSelectedRow.Company.push({ CompanyDBId: localStorage.getItem("CompID"), UserId: localStorage.getItem("UserId") })
    this.WizardService.GetSalesOrderConsolidatedData(this.HoldSelectedRow).subscribe(
      resp => {
        if (resp != undefined && resp != null) {

          // tempdata=resp["ShipmentHdr"];
          for (let i = 0; i < resp.ShipmentHdr.length; i++) {
            resp["ShipmentHdr"][i]["ShipmentChildData"] = []
          }
          resp["ShipmentHdr"]["ShipmentChildData"] = []
          for (let i = 0; i < resp.ShipmentHdr.length; i++) {
            if (resp["ShipmentHdr"][i].SELECT === "") resp["ShipmentHdr"][i].SELECT = false;
            for (let j = 0; j < resp.ShipmentDtl.length; j++) {
              if (resp["ShipmentHdr"][i].Shipment_Id === resp["ShipmentDtl"][j].Shipment_Id) {
                resp["ShipmentDtl"][j].ShipQty = Number(resp["ShipmentDtl"][j].ShipQty).toFixed(Number(localStorage.getItem("DecimalPrecision")));
                resp["ShipmentHdr"][i]["ShipmentChildData"].push(resp["ShipmentDtl"][j]);
              }
            }
          }
          this.AllConsolidateData = resp["ShipmentHdr"];
          if (this.AllConsolidateData.length > this.SPpageSize) {
            this.SPpagable = true;
          } else {
            this.SPpagable = false;
          }
          this.currentStep = this.currentStep + 1;
        }
        else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        console.log("Error:", error);
        //this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', this.translate.instant("CommonSomeErrorMsg"));
        }

      },
      () => {
      }
    )
  }

  gridUserSelectionChange(gridUser, selection) {
    if (selection.selectedRows.length > 0) {
      this.HoldSelectedRow.SOLines.push(selection.selectedRows[0].dataItem)
    }
    else if (selection.deselectedRows.length > 0) {
      let SO = selection.deselectedRows[0].dataItem.SO
      let LN = selection.deselectedRows[0].dataItem.LN
      for (let i = 0; i < this.HoldSelectedRow.SOLines.length; i++) {
        if (this.HoldSelectedRow.SOLines[i].SO === SO && this.HoldSelectedRow.SOLines[i].LN === LN) {
          this.HoldSelectedRow.SOLines.splice(i, 1);
        }
      }
    }
  }

  ChangeSalesQty(event, dataItem, companyRowIndex) {
    dataItem.SalesOpenQty = event.target.value
  }

  IsValidSONumber(fieldName) {
    let soNum;
    if (fieldName == "SONoFrom") {
      soNum = this.SrNoFrom;
    }
    else if (fieldName == "SONoTo") {
      soNum = this.SrNoTo
    }
    if (soNum == "" || soNum == null || soNum == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidSONumber(soNum).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "SONoFrom") {
              this.SrNoFrom = data[0].DocNum;
            }
            else if (fieldName == "SONoTo") {
              this.SrNoTo = data[0].DocNum;
            }
          } else {
            if (fieldName == "SONoFrom") {
              this.SrNoFrom = "";
            }
            else if (fieldName == "SONoTo") {
              this.SrNoTo = "";
            }
            this.toastr.error('', this.translate.instant("InvalidSONo"));
          }
        } else {
          if (fieldName == "SONoFrom") {
            this.SrNoFrom = "";
          }
          else if (fieldName == "SONoTo") {
            this.SrNoTo = "";
          }
          this.toastr.error('', this.translate.instant("InvalidSONo"));
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

  GetDataForSalesOredr(fieldName, event) {
    let soNum;
    if (fieldName == "SONoFrom") {
      soNum = this.SrNoFrom;
    }
    else if (fieldName == "SONoTo") {
      soNum = this.SrNoTo
    }
    if ((soNum == "" || soNum == null || soNum == undefined) && (event == 'blur')) {
      return;
    }
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForSalesOrderLookup(this.UseContainer, soNum).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          if (event == 'blur') {
            if (data.length > 0) {
              if (fieldName == "SONoFrom") {
                this.SrNoFrom = data[0].DocNum;
              }
              else if (fieldName == "SONoTo") {
                this.SrNoTo = data[0].DocNum;
              }
            } else {
              if (fieldName == "SONoFrom") {
                this.SrNoFrom = "";
              }
              else if (fieldName == "SONoTo") {
                this.SrNoTo = "";
              }
              this.toastr.error('', this.translate.instant("InvalidSONo"));
            }
          } else {
            this.serviceData = data;
            if (fieldName == "SrNO") {
              this.lookupfor = "SerialNoFrom";
            } else if (fieldName == "SrNOTO") {
              this.lookupfor = "SerialNoTo";
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

  GetDataForShipToCode(fieldName, event) {
    let ccode;
    if (fieldName == "ShipFrom") {
      ccode = this.ShipFrom;
    }
    else if (fieldName == "ShipTo") {
      ccode = this.ShipTo
    }
    if ((ccode == "" || ccode == null || ccode == undefined) && event == 'blur') {
      return;
    }
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetShipToAddress(ccode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (event == 'blur') {
            if (data.length > 0) {
              if (fieldName == "ShipFrom") {
                this.ShipFrom = data[0].Address;
              }
              else if (fieldName == "ShipTo") {
                this.ShipTo = data[0].Address;
              }
            } else {
              if (fieldName == "ShipFrom") {
                this.ShipFrom = "";
              }
              else if (fieldName == "ShipTo") {
                this.ShipTo = "";
              }
              this.toastr.error('', this.translate.instant("Invalid_ShipToCode"));
            }
          } else {
            this.serviceData = data;
            this.lookupfor = fieldName;
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

  GetDataForCustomer(fieldName, event) {
    let ccode;
    if (fieldName == "CustFrom") {
      ccode = this.CustomerFrom;
    }
    else if (fieldName == "CustTo") {
      ccode = this.CustomerTo
    }
    if ((ccode == "" || ccode == null || ccode == undefined) && (event == 'blur')) {
      return;
    }
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForCustomerLookup(ccode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (event == 'blur') {
            if (data.length > 0) {
              if (fieldName == "CustFrom") {
                this.CustomerFrom = data[0].CardCode;
              }
              else if (fieldName == "CustTo") {
                this.CustomerTo = data[0].CardCode;
              }
            } else {
              if (fieldName == "CustFrom") {
                this.CustomerFrom = "";
              }
              else if (fieldName == "CustTo") {
                this.CustomerTo = "";
              }
              this.toastr.error('', this.translate.instant("Invalid_CC"));
            }
          } else {
            this.serviceData = data;
            if (fieldName == "CustFrom") {
              this.lookupfor = "CustomerFrom";
            }
            else if (fieldName == "CustTo") {
              this.lookupfor = "CustomerTo";
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

  GetDataForWareHouse(event) {
    if ((this.WareHouse == "" || this.WareHouse == null || this.WareHouse == undefined) && (event == 'blur')) {
      return;
    }
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForWHSLookup(this.WareHouse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (event == 'blur') {
            if (data.length > 0) {
              this.WareHouse = data.OUTPUT[0].WhsCode;
            } else {
              this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
              this.WareHouse = "";
            }
          } else {
            this.serviceData = data;
            this.lookupfor = "WareHouse";
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

  async IsValidItemCode(fieldName) {
    let value;
    if (fieldName == "ItmFrm") {
      value = this.ItemFrom;
    }
    else if (fieldName == "ItmTo") {
      value = this.ItemTo
    }
    if (value == undefined || value == "") {
      return;
    }
    this.showLoader = true;
    var result = false;
    await this.commonservice.IsValidItemCode(value).then(
      (data: any) => {
        this.showLoader = false;
        result = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "ItmFrm") {
              this.ItemFrom = data[0].ItemCode;
            }
            else if (fieldName == "ItmTo") {
              this.ItemTo = data[0].ItemCode;
            }
            result = true;
          } else {
            if (fieldName == "ItmFrm") {
              this.ItemFrom = "";
            }
            else if (fieldName == "ItmTo") {
              this.ItemTo = "";
            }
            this.toastr.error('', this.translate.instant("InvalidItemCode"));
          }
        } else {
          if (fieldName == "ItmFrm") {
            this.ItemFrom = "";
          }
          else if (fieldName == "ItmTo") {
            this.ItemTo = "";
          }
          this.toastr.error('', this.translate.instant("InvalidItemCode"));
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

  GetDataForItemCode(fieldName, event) {
    let value;
    if (fieldName == "ItmFrm") {
      value = this.ItemFrom;
    }
    else if (fieldName == "ItmTo") {
      value = this.ItemTo
    }
    if ((value == undefined || value == "") && event == 'blur') {
      return;
    }
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForItemCodeLookup(value).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (event == 'blur') {
            if (data.length > 0) {
              if (fieldName == "ItmFrm") {
                this.ItemFrom = data[0].ItemCode;
              }
              else if (fieldName == "ItmTo") {
                this.ItemTo = data[0].ItemCode;
              }
            } else {
              if (fieldName == "ItmFrm") {
                this.ItemFrom = "";
              }
              else if (fieldName == "ItmTo") {
                this.ItemTo = "";
              }
              this.toastr.error('', this.translate.instant("InvalidItemCode"));
            }
          } else {
            this.serviceData = data;
            if (fieldName == "ItmFrm") {
              this.lookupfor = "ItemFrom";
            }
            else if (fieldName == "ItmTo") {
              this.lookupfor = "ItemTo";
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

  IsValidWhseCode() {
    this.showLoader = true;
    this.commonservice.IsValidWhseCode(this.WareHouse).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            this.WareHouse = data.OUTPUT[0].WhsCode;
          } else {
            this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
            this.WareHouse = "";
          }

        } else {
          this.toastr.error('', this.translate.instant("InvalidWhsErrorMsg"));
          this.WareHouse = "";
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

  getLookupKey($event) {

    if ($event != null && $event == "close") {
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "SerialNoFrom") {
      this.SrNoFrom = $event.SODocNum;
      //this.CTR_ContainerType = $event[0];
    }
    else if (this.lookupfor == "SerialNoTo") {
      this.SrNoTo = $event.SODocNum;
      //this.CTR_ContainerType = $event[0];
    }
    else if (this.lookupfor == "CustomerFrom") {
      this.CustomerFrom = $event.CardCode;
    }
    else if (this.lookupfor == "CustomerTo") {
      this.CustomerTo = $event.CardCode;
    }
    else if (this.lookupfor == "ItemFrom") {
      this.ItemFrom = $event.ItemCode;
    }
    else if (this.lookupfor == "ItemTo") {
      this.ItemTo = $event.ItemCode;
    }
    else if (this.lookupfor == "ShipFrom") {
      this.ShipFrom = $event.CardCode;
    }
    else if (this.lookupfor == "ShipTo") {
      this.ShipTo = $event.CardCode;
    }
    else if (this.lookupfor == "WareHouse") {
      this.WareHouse = $event.WhsCode;
    }
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  IsValidShipToAddress(fieldName) {
    let ccode;
    if (fieldName == "ShipFrom") {
      ccode = this.ShipFrom;
    }
    else if (fieldName == "ShipTo") {
      ccode = this.ShipTo
    }
    if (ccode == "" || ccode == null || ccode == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidShipToAddress(ccode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "ShipFrom") {
              this.ShipFrom = data[0].Address;
            }
            else if (fieldName == "ShipTo") {
              this.ShipTo = data[0].Address;
            }
          } else {
            if (fieldName == "ShipFrom") {
              this.ShipFrom = "";
            }
            else if (fieldName == "ShipTo") {
              this.ShipTo = "";
            }
            this.toastr.error('', this.translate.instant("Invalid_ShipToCode"));
          }
        } else {
          if (fieldName == "ShipFrom") {
            this.ShipFrom = "";
          }
          else if (fieldName == "ShipTo") {
            this.ShipTo = "";
          }
          this.toastr.error('', this.translate.instant("Invalid_ShipToCode"));
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


  IsValidCustomerCode(fieldName) {
    let ccode;
    if (fieldName == "CustFrom") {
      ccode = this.CustomerFrom;
    }
    else if (fieldName == "CustTo") {
      ccode = this.CustomerTo
    }
    if (ccode == "" || ccode == null || ccode == undefined) {
      return;
    }
    this.showLoader = true;
    this.commonservice.IsValidCustomer(ccode).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0) {
            if (fieldName == "CustFrom") {
              this.CustomerFrom = data[0].CardCode;
            }
            else if (fieldName == "CustTo") {
              this.CustomerTo = data[0].CardCode;
            }
          } else {
            if (fieldName == "CustFrom") {
              this.CustomerFrom = "";
            }
            else if (fieldName == "CustTo") {
              this.CustomerTo = "";
            }
            this.toastr.error('', this.translate.instant("Invalid_CC"));
          }
        } else {
          if (fieldName == "CustFrom") {
            this.CustomerFrom = "";
          }
          else if (fieldName == "CustTo") {
            this.CustomerTo = "";
          }
          this.toastr.error('', this.translate.instant("Invalid_CC"));
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
