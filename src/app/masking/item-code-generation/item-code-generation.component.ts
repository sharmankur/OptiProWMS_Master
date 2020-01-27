import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-code-generation',
  templateUrl: './item-code-generation.component.html',
  styleUrls: ['./item-code-generation.component.scss']
})
export class ItemCodeGenerationComponent implements OnInit {

  public itemCodeGenComponent: Number = 1;

  constructor() { }

  ngOnInit() {
  }

}
