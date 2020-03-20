import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-item-to-cont',
  templateUrl: './add-item-to-cont.component.html',
  styleUrls: ['./add-item-to-cont.component.scss']
})
export class AddItemToContComponent implements OnInit {

  addItemList: any = [];
  constructor() { }

  ngOnInit() {
  }

  onRadioMouseDown(id) {
    console.log("on radio mouse down");
    document.getElementById(id).click();
  }

  checkChangeEvent: any;
  radioSelected: number = 1;
  handleCheckChange(event) {
    if(this.radioSelected == 1){
      this.radioSelected = 2
    } else {
      this.radioSelected = 1
    }
    console.log("on radio handleCheckChange");
    this.checkChangeEvent = event;
    console.log("check change:" + this.checkChangeEvent);
    console.log(this.checkChangeEvent);


    console.log("by element: plt"+event.toElement.name)
  }

}
