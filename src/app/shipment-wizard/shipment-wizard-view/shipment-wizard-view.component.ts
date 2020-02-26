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
  UseContainer: boolean=false; 
  constructor(private WizardService: ShipmentWizardService, private router: Router, private commonservice: Commonservice,
    private toastr: ToastrService, private translate: TranslateService) { }
  // GRID VAIRABLE
  //public gridView: any = [{"ProductName":"test"}];
  public items: any[] = [];
  public mySelection: number[] = [];
  public pageSize = 10;
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
    this.ConsolidatedDataSelection.Company.push({ CompanyDBId: localStorage.getItem("CompID"), UserId: localStorage.getItem("UserId"), OPTM_USE_CONTAINER: uc,
    OPTM_FUNCTION: "Shipping",
    OPTM_OBJECT: "Shipment" })
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
                resp["ShipmentHdr"][i]["ShipmentChildData"].push(resp["ShipmentDtl"][j]);
              }
            }
          }
          this.GetCreateShipMentData = resp["ShipmentHdr"];
          this.currentStep = this.currentStep + 1;
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
                resp["ShipmentHdr"][i]["ShipmentChildData"].push(resp["ShipmentDtl"][j]);
              }
            }
          }
          this.AllConsolidateData = resp["ShipmentHdr"];
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
  GetDataForSalesOredr(fieldName) {

    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForSalesOrderLookup(this.UseContainer).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          if (fieldName == "SrNO") {
            this.lookupfor = "SerialNoFrom";
          } else if (fieldName == "SrNOTO") {
            this.lookupfor = "SerialNoTo";
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

  GetDataForShipToCode(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetShipToAddress().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          // if (fieldName == "SrNO") {
          //   this.lookupfor = "SerialNoFrom";
          // } else if (fieldName == "SrNOTO") {
            this.lookupfor = fieldName;
          // }
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

  GetDataForCustomer(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForCustomerLookup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;

          if (fieldName == "CustFrom") {
            this.lookupfor = "CustomerFrom";
          }
          else if (fieldName == "CustTo") {
            this.lookupfor = "CustomerTo";
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

  GetDataForWareHouse(fieldName) {

    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForWHSLookup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          if (fieldName == "Whs") {
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

  GetDataForItemCode(fieldName) {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForItemCodeLookup().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          if (fieldName == "ItmFrm") {
            this.lookupfor = "ItemFrom";
          }
          else if (fieldName == "ItmTo") {
            this.lookupfor = "ItemTo";
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

  getLookupValue($event) {

    if ($event != null && $event == "close") {
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "SerialNoFrom") {
      this.SrNoFrom = $event[0];
      //this.CTR_ContainerType = $event[0];
    }
    else if (this.lookupfor == "SerialNoTo") {
      this.SrNoTo = $event[0];
      //this.CTR_ContainerType = $event[0];
    }
    else if (this.lookupfor == "CustomerFrom") {
      this.CustomerFrom = $event[0];
    }
    else if (this.lookupfor == "CustomerTo") {
      this.CustomerTo = $event[0];
    }
    else if (this.lookupfor == "ItemFrom") {
      this.ItemFrom = $event[0];
    }
    else if (this.lookupfor == "ItemTo") {
      this.ItemTo = $event[0];
    }
    else if (this.lookupfor == "ShipFrom") {
      this.ShipFrom = $event[0];
    }
    else if (this.lookupfor == "ShipTo") {
      this.ShipTo = $event[0];
    }
    else if (this.lookupfor == "WareHouse") {
      this.WareHouse = $event[0];
    }
  }

}
