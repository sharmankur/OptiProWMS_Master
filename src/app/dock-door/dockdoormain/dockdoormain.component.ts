import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dockdoormain',
  templateUrl: './dockdoormain.component.html',
  styleUrls: ['./dockdoormain.component.scss']
})
export class DockdoormainComponent implements OnInit {
  //ddComponent = 1;
  public ddComponent: Number =1;
  constructor() { }

  ngOnInit() {
  }

}
