import { Component, OnInit } from '@angular/core';
import { OpenPOLinesModel } from '../models/Inbound/OpenPOLinesModel';

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
  public SubmitPOArray: OpenPOLinesModel[] = [];
  

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

  public AddPOList(openPOLinesModel: OpenPOLinesModel){
    this.SubmitPOArray.push(openPOLinesModel);
  }

}
