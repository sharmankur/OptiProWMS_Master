import { Component, OnInit} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-picking-item-details',
  templateUrl: './picking-item-details.component.html',
  styleUrls: ['./picking-item-details.component.scss']
})
export class PickingItemDetailsComponent implements OnInit {
 

  constructor(private router: Router) { }
  // GRID VAIRABLE
  public currentStepText = "Scan To Location";
  public currentStep = 1;
  public maxStep = 3;
  // GRID VARIABLE

  
  ngOnInit() {
  }

 
  
  prevStep(){
    if(this.currentStep > 1){
      this.currentStep = this.currentStep -1;
      this.changeText(this.currentStep)
    }
    
  }
  nextStep(){
    if(this.currentStep < this.maxStep ){
      this.currentStep = this.currentStep + 1;
      this.changeText(this.currentStep)
    }
  }

  changeText(step){
    if(step == 1){
      this.currentStepText = "Scan To Location";
    }
    else if( step == 2){
      this.currentStepText = 'Scan to Lot Number'
    }
    else if(step == 3){
      this.currentStepText = 'Enter Qty'
    }
  }

  public onNavClick(rul){
    this.router.navigate(['home/picking/picking-item-list'])
  }


  submitCurrentGRPO() {
    var oSubmitPOLotsObj: any = {};
    oSubmitPOLotsObj.Header = [];
    oSubmitPOLotsObj.POReceiptLots = [];
    oSubmitPOLotsObj.POReceiptLotDetails = [];
    oSubmitPOLotsObj.UDF = [];
    oSubmitPOLotsObj.LastSerialNumber = [];
    var oSubmitPOLotsObj = this.preparePickTaskData(oSubmitPOLotsObj); 
  //  this.SubmitGoodsReceiptPO(oSubmitPOLotsObj);
  }

  preparePickTaskData(oSubmitPOLotsObj: any): any {
    // oSubmitPOLotsObj = this.manageRecords(oSubmitPOLotsObj);
    // if (localStorage.getItem("Line") == null || localStorage.getItem("Line") == undefined ||
    //   localStorage.getItem("Line") == "") {
    //   localStorage.setItem("Line", "0");
    // }


    // oSubmitPOLotsObj.POReceiptLots.push({
    //   DiServerToken: localStorage.getItem("Token"),
    //   PONumber: this.Ponumber,
    //   DocEntry: this.DocEntry,
    //   CompanyDBId: localStorage.getItem("CompID"),
    //   LineNo: this.openPOLineModel[0].LINENUM,
    //   ShipQty: this.openPOLineModel[0].RPTQTY.toString(),
    //   OpenQty: this.openPOLineModel[0].OPENQTY.toString(),
    //   WhsCode: localStorage.getItem("whseId"),
    //   Tracking: this.openPOLineModel[0].TRACKING,
    //   ItemCode: this.openPOLineModel[0].ITEMCODE,
    //   LastSerialNumber: 0,
    //   Line: Number(localStorage.getItem("Line")),
    //   GUID: localStorage.getItem("GUID"),
    //   UOM: this.uomSelectedVal.UomEntry,
    //   UsernameForLic: localStorage.getItem("UserId")

    //   //------end Of parameter For License----
    // });
   

    // for (var iBtchIndex = 0; iBtchIndex < this.recvingQuantityBinArray.length; iBtchIndex++) {
    //   oSubmitPOLotsObj.POReceiptLotDetails.push({
    //     // POItemCode: this.Ponumber+this.openPOLineModel[0].ITEMCODE,
    //     Bin: this.recvingQuantityBinArray[iBtchIndex].Bin,
    //     LineNo: this.openPOLineModel[0].LINENUM,
    //     LotNumber: this.recvingQuantityBinArray[iBtchIndex].LotNumber, //getUpperTableData.GoodsReceiptLineRow[iBtchIndex].SysSerNo,
    //     LotQty: this.recvingQuantityBinArray[iBtchIndex].LotQty,
    //     SysSerial: "0",
    //     ExpireDate: this.GetSubmitDateFormat(this.expiryDate),//GetSubmitDateFormat(getUpperTableData.GoodsReceiptLineRow[iBtchIndex].EXPDATE), // oCurrentController.GetSubmitDateFormat(oActualGRPOModel.PoDetails[iIndex].ExpireDate),//oActualGRPOModel.PoDetails[iIndex].ExpireDate,
    //     VendorLot: this.recvingQuantityBinArray[iBtchIndex].VendorLot,
    //     //NoOfLabels: oActualGRPOModel.PoDetails[iIndex].NoOfLabels,
    //     //Containers: piContainers,
    //     SuppSerial: this.recvingQuantityBinArray[iBtchIndex].VendorLot,
    //     ParentLineNo: Number(localStorage.getItem("Line")),
    //     LotSteelRollId: "",
    //     ItemCode: this.openPOLineModel[0].ITEMCODE,
    //     PalletCode: this.recvingQuantityBinArray[iBtchIndex].PalletCode
    //   });
    // }


    localStorage.setItem("Line", "" + (Number(localStorage.getItem("Line")) + 1));

    oSubmitPOLotsObj.Header.push({
      NumAtCard: localStorage.getItem("VendRefNo")
    });
    return oSubmitPOLotsObj;
  }


}
