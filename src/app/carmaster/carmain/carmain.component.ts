import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carmain',
  templateUrl: './carmain.component.html',
  styleUrls: ['./carmain.component.scss']
})
export class CARMainComponent implements OnInit {

  public carComponent: Number= 1;
  constructor() { }

  ngOnInit() {
  }

}
