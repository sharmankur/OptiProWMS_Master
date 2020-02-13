import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { CommonData } from 'src/app/models/CommonData';
import { ContainerCreationService } from 'src/app/services/container-creation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContainerShipmentService } from 'src/app/services/container-shipment.service';
import { ContainerBatchserialService } from 'src/app/services/container-batchserial.service';

@Component({
  selector: 'app-container-batchserial',
  templateUrl: './container-batchserial.component.html',
  styleUrls: ['./container-batchserial.component.scss']
})
export class ContainerBatchserialComponent implements OnInit {

  purposeArray: any = [];
  PurposeId: any;
  statusArray: any = [];
  StatusId: any='';
  StatusValue : any ='';
  InvPostStatusArray: any = [];
  InvPostStatusId: any='';
  InvPostStatusValue: any='';
  shipeligible: string;
  commonData: any = new CommonData();

  constructor(private translate: TranslateService, private commonservice: Commonservice, private toastr: ToastrService,private containerCreationService: ContainerCreationService,private router: Router,
    private containerShipmentService: ContainerShipmentService, private containerBatchserialService: ContainerBatchserialService) { }   

  ngOnInit() {
    this.purposeArray = this.commonData.container_creation_purpose_string_dropdown();
    this.statusArray = this.commonData.Container_Shipment_Status_DropDown();
    this.InvPostStatusArray = this.commonData.Container_Shipment_Inv_Status_DropDown();
  }

}
