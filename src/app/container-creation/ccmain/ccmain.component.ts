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
    if (window.location.href.indexOf("build") > -1) {
      this.ccComponent = 3;
    }
    else{
      this.ccComponent = 1;
    }
  }

}
