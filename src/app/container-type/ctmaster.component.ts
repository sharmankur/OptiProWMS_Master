import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ctmaster',
  templateUrl: './ctmaster.component.html',
  styleUrls: ['./ctmaster.component.scss']
})
export class CTMasterComponent implements OnInit {

  constructor() { }

  public inboundComponent: number = 1;
  public selectedVernder: string="";
  public openPOmodel: any;
  public oSubmitPOLotsArray: any[] = []; 
  public AddtoGRPOFlag: boolean = false;

  ngOnInit() {
    
  }

  setSelectedVender(vender: string){
    this.selectedVernder = vender;
  }

  setClickedItemDetail(openPOmodel){
    this.openPOmodel = openPOmodel;
  }

  public savePOLots(oSubmitPOLot: any){
    this.oSubmitPOLotsArray.push(oSubmitPOLot);
    this.AddtoGRPOFlag = true;
  }
}
