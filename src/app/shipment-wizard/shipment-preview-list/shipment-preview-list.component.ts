import { Component, OnInit} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-shipment-preview-list',
  templateUrl: './shipment-preview-list.component.html',
  styleUrls: ['./shipment-preview-list.component.scss']
})
export class ShipmentPreviewListComponent implements OnInit {
 

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
