import { Component, OnInit} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-picking-item-list',
  templateUrl: './picking-item-list.component.html',
  styleUrls: ['./picking-item-list.component.scss']
})
export class PickingItemListComponent implements OnInit {
 

  constructor(private router: Router) { }
  // GRID VAIRABLE         
  public gridView: any = [
    {
      "TaskId":"Task123",
     "TaskType":"Type 1",
     "ItemCode":"Item123",
     "Warehouse":"Warehouse123",
     "Quantity":1,
     "PlanDate":"12-03-2020"
    },
    {
      "TaskId":"Task123",
     "TaskType":"Type 1",
     "ItemCode":"Item123",
     "Warehouse":"Warehouse123",
     "Quantity":1,
     "PlanDate":"12-03-2020"
    },
    {
      "TaskId":"Task123",
     "TaskType":"Type 1",
     "ItemCode":"Item123",
     "Warehouse":"Warehouse123",
     "Quantity":1,
     "PlanDate":"12-03-2020"
    },
    {
      "TaskId":"Task123",
     "TaskType":"Type 1",
     "ItemCode":"Item123",
     "Warehouse":"Warehouse123",
     "Quantity":1,
     "PlanDate":"12-03-2020"
    }
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
   this.router.navigate(['home/picking/picking-item-details']);
  }


}
