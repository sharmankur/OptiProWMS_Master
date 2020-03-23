import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContainerCreationService } from '../../services/container-creation.service';
import { Commonservice } from '../../services/commonservice.service';

@Component({
  selector: 'app-input-parent-container',
  templateUrl: './input-parent-container.component.html',
  styleUrls: ['./input-parent-container.component.scss']
})
export class InputParentContainerComponent implements OnInit {

  @Input() titleMessage: any;
  @Input() yesButtonText: any;
  @Input() noButtonText: any;
  @Input() fromWhere: any;
  @Input() oSaveModel: any;
  @Output() isYesClick = new EventEmitter();

  constructor(private commonservice: Commonservice, private translate: TranslateService, private toastr: ToastrService,
    private containerCreationService: ContainerCreationService, private router: Router) { }

  ngOnInit() {
  }

}
