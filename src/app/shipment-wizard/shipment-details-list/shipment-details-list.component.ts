import { Component, OnInit} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-shipment-details-list',
  templateUrl: './shipment-details-list.component.html',
  styleUrls: ['./shipment-details-list.component.scss']
})
export class ShipmentDetailsListComponent implements OnInit {
 

  constructor() { }
  // GRID VAIRABLE
  public gridView: any = [{"ItemCode":"Item123"}];
  public items: any[] = [];
  public mySelection: number[] = [];
  public pageSize = 10;
  public skip = 0;
  // GRID VARIABLE

  
  ngOnInit() {
  }

}
