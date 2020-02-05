import { Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-shipment-view',
  templateUrl: './shipment-view.component.html',
  styleUrls: ['./shipment-view.component.scss']
})
export class ShipmentViewComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public gridData = [];
  constructor()  { }
  ngOnInit() {
  }


}
