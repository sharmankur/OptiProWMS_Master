import { Component, OnInit } from '@angular/core';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '@angular/router';
import { opticonstants } from '../../constants';
import { CurrentSidebarInfo } from '../../models/sidebar/current-sidebar-info';
import { MenuService } from '../../services/menu.service';
import { UIHelper } from '../../helpers/ui.helpers';
import { CommandName } from 'selenium-webdriver';
import { CommonConstants } from '../../const/common-constants';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CustomizationDetails } from '../../models/CustomizationDetails';

@Component({
  selector: 'app-portal-left',
  templateUrl: './portal-left.component.html',
  styleUrls: ['./portal-left.component.scss']
})
export class PortalLeftComponent implements OnInit {

  isPalletizationEnable: boolean = false;
  WarehouseTransfer: boolean = false;
  allOptionMenus: any = []

  constructor(private commonService: Commonservice, private router: Router, private menuService: MenuService, private translate: TranslateService, private toastr: ToastrService) {

  }
  selectedThemeColor: string = 'opticonstants.DEFAULTTHEMECOLOR';
  selectedItem: string;

  ngOnInit() {
    if (localStorage.getItem("PalletizationEnabled") == "True") {
      this.isPalletizationEnable = true;
    } else {
      this.isPalletizationEnable = false;
    }

    // get current url with last word
    let partsOfUrl = this.router.url.split('/');
    this.selectedItem = partsOfUrl[partsOfUrl.length - 1];

    // get selected theme color
    this.commonService.themeCurrentData.subscribe(
      data => {
        this.selectedThemeColor = data;
      }
    );
    // this.getAllMenus();
    this.commonService.setCustomizeInfo();

    UIHelper.manageNavigationPanel(document.getElementById('sidebarCollapse-alt'));
  }

  getAllMenus() {
    this.menuService.getAllMenus().subscribe(
      data => {
        if (data != null) {
          this.displayMenuOptions(data.Modules);
          this.allOptionMenus = data.Modules
        }
      },
      error => {
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonService.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  displayMenuOptions(menus: any[]) {
    menus.forEach(element => {
      var thisRefs = this;
      console.log("forEach: element.id: " + document.getElementById(element.id))
      if (document.getElementById(element.id) != null) {
        document.getElementById(element.id).style.display = 'flex';
        if (document.getElementById(element.id).childNodes.length > 0 && document.querySelectorAll('#' + element.id + ".dropdown")[0] != undefined) {
          (<HTMLElement>document.querySelectorAll('#' + element.id + ".dropdown")[0].childNodes[0]).onclick = function () {
            for (var i = 0; i < document.querySelectorAll('#' + element.id + ".dropdown")[0].childNodes[2].childNodes.length; i++) {
              var menuId = (<HTMLElement>document.querySelectorAll('#' + element.id + ".dropdown")[0].childNodes[2].childNodes[i]).id;
              if (thisRefs.isMenuVisible(menuId)) {
                (<HTMLElement>document.querySelectorAll('#' + element.id + ".dropdown")[0].childNodes[2].childNodes[i]).style.display = 'flex';
              } else {
                (<HTMLElement>document.querySelectorAll('#' + element.id + ".dropdown")[0].childNodes[2].childNodes[i]).style.display = 'none';
              }
            }
          };
        }
      }
    });
  }

  isMenuVisible(menu: string) {
    for (var i = 0; i < this.allOptionMenus.length; i++) {
      if (this.allOptionMenus[i].id == menu) {
        return true;
      }
    }
    return false;
  }


  /**
   * 
   * @param event 
   * @param module 
   */
  listClick(event, module) {
    this.selectedItem = module;

    localStorage.setItem("ProdReceptItem", '');
    localStorage.setItem("FromReceiptProd", 'false');
    localStorage.setItem("GoodsReceiptModel", '');
    localStorage.setItem("AvailableRejectQty", 0 + "");

    if (module == "inbound") {
      this.onInboundClick();
    } else if (module == "whsTransfer") {
      localStorage.setItem("fromscreen", "WhsTransfer");
    } else if (module == "InventoryTransferRequest") {
      localStorage.setItem("fromscreen", "InventoryTransferRequest");
    } else if (module == "binTransfer") {
      localStorage.setItem("fromscreen", "");
      localStorage.setItem("towhseId", localStorage.getItem("whseId"));
      localStorage.setItem("fromwhseId", localStorage.getItem("whseId"));
    }
    else if (module == "TransactionStepSetup") {
      localStorage.setItem("TransStepSetup", "TransactionStepSetup");
    }
    else if (module == "DocumentNumbering") {
      localStorage.setItem("DocNumbering", "DocumentNumbering");
    }else if (module == "archiveddata") {
      localStorage.setItem("fromscreen", "archiveddata");
      localStorage.setItem("ShipmentID", "");
    }else if (module == "shipment") {
      localStorage.setItem("fromscreen", "shipment");
      localStorage.setItem("ShipmentID", "");
    }
    this.closeRightSidebar(event);
    this.router.navigate(['home/' + module]);
  }

  /** 
   * 
   */
  closeRightSidebar(e) {
    let currentSidebarInfo: CurrentSidebarInfo = new CurrentSidebarInfo();
    currentSidebarInfo.SideBarStatus = false;
    this.commonService.setCurrentSideBar(currentSidebarInfo);
    if (UIHelper.isMobile() == true) {
      document.getElementById('opti_RightPanelID').classList.remove('opti_menusidebar-mobile-open');
      document.getElementById('opti_LeftPanelID').classList.remove('opti_menusidebar-mobile-open');
    }
  }

  binClick() {
    // localStorage.setItem("towhseId", localStorage.getItem("whseId"));
  }

  onInboundClick() {
    this.commonService.clearInboundData();
  }

  onOutboundClick() {
    localStorage.setItem(CommonConstants.OutboundData, null);
    localStorage.setItem("ComingFrom", "");
  }
}
