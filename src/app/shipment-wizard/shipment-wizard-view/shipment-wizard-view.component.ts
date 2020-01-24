import { Component, OnInit} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '../../../../node_modules/@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from '../../services/commonservice.service';
import { ShipmentWizardService } from '../../services/shipment-wizard.service';

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
  constructor(private WizardService:ShipmentWizardService, private router: Router, private commonservice: Commonservice, 
    private toastr: ToastrService, private translate: TranslateService)  { }
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
  public HoldSelectedRow:any = {};
  
  public HoldCheckBoxValue: any = [];
  public SetParameter: any=[];
  public CHKCustomer: boolean=true;
  public CHKShipto: boolean=true;
  public CHKItem: boolean=true;
  public CHKSOno: boolean=true;
  public CHKDueDate: boolean=true;
  ngOnInit() {
    this.HoldSelectedRow.SOLines = [];
    this.HoldSelectedRow.ConsolidationsBy = [];
    this.HoldSelectedRow.Company = [];
  }

  onPrevClick(){
    if(this.currentStep > 1){
      this.currentStep = this.currentStep - 1;
    }    
  }
  onNextClick(){
    if(this.currentStep < this.maxStep){
debugger
      if(this.currentStep===1)
        {
          if(this.WareHouse !="" && this.WareHouse !=undefined)this.GetSalesWizardData();
          else {
            this.toastr.error('', this.translate.instant("WareHouseValidation"));  
            return;
          }

        }
        if(this.currentStep===2)
        {
          if(this.HoldSelectedRow.SOLines.length >0)
            {
              this.currentStep = this.currentStep + 1;
            }
          else {
            this.toastr.error('', this.translate.instant("GridCheckBoxValidation"));  
            return;
          }

        }
        if(this.currentStep===3)
        {
          if(this.CHKCustomer ===false && this.CHKDueDate ===false && this.CHKItem ===false && this.CHKShipto===false &&
           this.CHKSOno ===false)
            {
              this.toastr.error('', this.translate.instant("CheckBoxValidation"));  
            return;
             
            }
          else {
           
            this.HoldSelectedRow.ConsolidationsBy.push({Customer:this.CHKCustomer,DueDate:this.CHKDueDate,
              Item:this.CHKItem,ShipTo:this.CHKShipto,SONO:this.CHKSOno})
              this.GetConsolidatedData();
           
          }

        }
     
    }    
  }

  onStepClick(currentStep){
    this.currentStep = currentStep;
  }

  GetSalesWizardData() {
    this.SetParameter=[];
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
      SHIPFROM:this.ShipFrom,
      SHIPTO:this.ShipTo,
      OPENQTYFROM:this.OpenQtyFrom,
      OPENQTYTO:this.OpenQtyTo,
      NOOFFOPENLINESFROM:this.NoofOpenLinesFrom,
      NOOFFOPENLINESTO:this.NoofOpenLinesTo,
      CompanyDBId: localStorage.getItem("CompID")
    });
    
    this.WizardService.GetSalesOrder(this.SetParameter).subscribe(
      resp => {
        if (resp != undefined && resp != null) {
          this.currentStep = this.currentStep + 1;
          for(let i=0; i <resp.length; i++)
              {
                if(resp[i].SELECT==="")resp[i].SELECT=false;
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

  GetConsolidatedData() {
    this.HoldSelectedRow.Company=[];
    this.HoldSelectedRow.Company.push({CompanyDBId: localStorage.getItem("CompID")})
    this.WizardService.GetSalesOrderConsolidatedData(this.HoldSelectedRow).subscribe(
      resp => {
        // this.currentStep = this.currentStep + 1;
        debugger
        if (resp != undefined && resp != null) {
          this.currentStep = this.currentStep + 1;
          // for(let i=0; i <resp.length; i++)
          //     {
          //       if(resp[i].SELECT==="")resp[i].SELECT=false;
          //     }
          //      this.gridData = resp;
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
    if(selection.selectedRows.length>0)
      {
        this.HoldSelectedRow.SOLines.push(selection.selectedRows[0].dataItem)
      }
      else if(selection.deselectedRows.length>0)
        {
          let SO=selection.deselectedRows[0].dataItem.SO
          let LN=selection.deselectedRows[0].dataItem.LN
          for(let i=0; i <  this.HoldSelectedRow.SOLines.length; i++)
              {
                if(this.HoldSelectedRow.SOLines[i].SO===SO && this.HoldSelectedRow.SOLines[i].LN===LN)
                   {
                    this.HoldSelectedRow.SOLines.splice(i, 1);
                   }
              }
        }
}

GetDataForContainerType(fieldName) {
  this.showLoader = true;
  this.hideLookup = false;
  this.commonservice.GetDataForContainerType().subscribe(
    (data: any) => {
      this.showLoader = false;
      if (data != undefined) {
        if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
          this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
            this.translate.instant("CommonSessionExpireMsg"));
          return;
        }
        this.serviceData = data;
        if(fieldName == "CT"){
          this.lookupfor = "CTList";
        }else{
          this.lookupfor = "PCTList";
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
