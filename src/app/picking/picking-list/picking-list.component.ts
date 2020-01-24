import { Component, OnInit} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-picking-list',
  templateUrl: './picking-list.component.html',
  styleUrls: ['./picking-list.component.scss']
})
export class PickingListComponent implements OnInit {
 

  constructor(private router: Router) { }
  // GRID VAIRABLE
  public gridView: any = [
    {
      "ShipmentId":"Ship123", 
      "Customer":"BatchMaster Pvt. Ltd",
      "ShipTo":"Indore",
      "Warehouse":"Warehouse123"
    },{
      "ShipmentId":"Ship123", 
      "Customer":"BatchMaster Pvt. Ltd",
      "ShipTo":"Indore",
      "Warehouse":"Warehouse123"
    },
    {
      "ShipmentId":"Ship123", 
      "Customer":"BatchMaster Pvt. Ltd",
      "ShipTo":"Indore",
      "Warehouse":"Warehouse123"
    },
    {
      "ShipmentId":"Ship123", 
      "Customer":"BatchMaster Pvt. Ltd",
      "ShipTo":"Indore",
      "Warehouse":"Warehouse123"
    },
  ];
  public items: any[] = [];
  public mySelection: number[] = [];
  public pageSize = 10;
  public skip = 0;
  public mobileMedia = "(max-width: 767px)";
  public desktopMedia = "(min-width: 768px)";
  // GRID VARIABLE

  
  ngOnInit() {
  }
  cellClickHandler(e){
    debugger
   this.router.navigate(['home/picking/picking-item-list']);
  }


}
