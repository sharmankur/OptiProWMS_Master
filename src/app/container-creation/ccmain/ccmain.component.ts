import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ccmain',
  templateUrl: './ccmain.component.html',
  styleUrls: ['./ccmain.component.scss']
})
export class CcmainComponent implements OnInit {

  public ccComponent: Number = 1;
  constructor() { }

  ngOnInit() {
  }

}
