import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrier-main',
  templateUrl: './carrier-main.component.html',
  styleUrls: ['./carrier-main.component.scss']
})
export class CarrierMainComponent implements OnInit {

  public carrierComponent: Number = 1;

  constructor() { }

  ngOnInit() {
  }

}
