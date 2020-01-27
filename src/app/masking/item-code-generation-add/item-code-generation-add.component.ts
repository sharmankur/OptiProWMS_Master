import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonData } from 'src/app/models/CommonData';
import { ItemCodeGenerationComponent } from '../item-code-generation/item-code-generation.component';
import { Commonservice } from 'src/app/services/commonservice.service';
import { MaskingService } from 'src/app/services/masking.service';
import { CodeRow } from 'src/app/models/Inbound/CodeRow';

@Component({
  selector: 'app-item-code-generation-add',
  templateUrl: './item-code-generation-add.component.html',
  styleUrls: ['./item-code-generation-add.component.scss']
})
export class ItemCodeGenerationAddComponent implements OnInit {

  showLoader: boolean = false;
  showAddRowbtn: boolean = true;
  itemCodeRowList: any = [];
  codekey: string = "";
  countNumberRow: number = 0;
  finalString: string = "";
  made_changes: any;
  commonData: any = new CommonData();
  selectedOperation: string;
  selectedType: string;
  operations: any = [];
  stringTypes: any = [];
  buttonText: string = "";
  actionType: string = "";
  isUpdate: boolean = false;
  isLengthUpdate: boolean = false;
  defaultType: any;
  defaultOperation: any;

  constructor(private translate: TranslateService, private router: Router, private toastr: ToastrService,
    private itemCodeGenComponent: ItemCodeGenerationComponent, private maskingService: MaskingService,
    private commonService: Commonservice) { }

  ngOnInit() {
    let actionType = localStorage.getItem("Action")
    if (actionType != undefined && actionType != "") {
      if (localStorage.getItem("Action") == "edit") {
        this.isUpdate = true;
        this.buttonText = this.translate.instant("CT_Update");
        var data = JSON.parse(localStorage.getItem("Row"));
        this.codekey = data[0];
        this.getItemCodeGenerationByCode(this.codekey);
      } else if (localStorage.getItem("Action") == "copy") {
        var data = JSON.parse(localStorage.getItem("Row"));
        this.isUpdate = false;
        this.buttonText = this.translate.instant("CT_Add");
        this.codekey = data[0];
        this.getItemCodeGenerationByCode(this.codekey);
      } else {
        this.isUpdate = false;
        this.buttonText = this.translate.instant("CT_Add");
      }
    } else {
      this.isUpdate = false;
      this.buttonText = this.translate.instant("CT_Add");
    }

    this.itemCodeGenComponent.itemCodeGenComponent = 2;
    this.stringTypes = this.commonData.item_code_gen_string_dropdown();
    this.operations = this.commonData.item_code_gen_oper_drpdown();
    this.defaultType = this.stringTypes[0];
    this.defaultOperation = this.operations[0];
  }

  onCodeChangeBlur() {
    console.log("onCodeChangeBlur this.isValidateCalled: " + this.isValidateCalled);
    if (this.isValidateCalled) {
      return;
    }
    this.onCodeChange();
  }

  async onCodeChange() {
    if (this.codekey == undefined || this.codekey.trim() == "") {
      //this.toastr.error('', this.translate.instant("CodeBlank"));
      return false;
    }

    this.showLoader = true;
    var result = false;
    await this.maskingService.CheckDuplicateCode(this.codekey).then(
      (data: any) => {
        console.log("inside CheckDuplicateCode");
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonService.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data.length > 0 && data[0].TOTALCOUNT > 0) {
            this.toastr.error('', this.translate.instant("Masking_CodeAlreadyExist"));
            this.codekey = '';
            result = false;
          } else {
            result = true;
          }
        } else {
          result = false;
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        result = false;
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonService.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
    return result;
  }

  counter: number = 0;
  async onAddRow(oninit) {
    if (this.codekey == undefined || this.codekey.trim() == "") {
      this.toastr.error('', this.translate.instant("CodeBlank"));
      return false;
    }

    var result = await this.validateBeforeSubmit();
    this.isValidateCalled = false;
    console.log("validate result: " + result);
    if (result != undefined && result == false) {
      return;
    }

    if (oninit == 0) {
      if (this.validateRowData("AddRow") == false) {
        return
      }
    }
    if (this.itemCodeRowList.length == 0) {
      this.counter = 0;
    }
    else {
      this.counter = this.itemCodeRowList.length
    }

    this.counter++;
    this.defaultOperation = this.operations[0];
    this.defaultType = this.stringTypes[0]
    this.itemCodeRowList.push(new CodeRow(this.counter,
      1, "", 0, 1, "", localStorage.getItem("CompID"), localStorage.getItem("UserId"),
      this.codekey, true,
      localStorage.getItem("GUID"), localStorage.getItem("UserId")));

    // this.itemCodeRowList.push(new CodeRow(this.counter,
    //   1, "", 0, 1, "", localStorage.getItem("CompID"), "murtuza",
    //   this.codekey, true, 
    //   "", "murtuza"));

    // this.itemCodeRowList.push({
    //   rowindex: this.counter,
    //   stringtype: 1,
    //   string: "",
    //   length: "",
    //   operations: 1,
    //   delete: "",
    //   CompanyDBId: localStorage.getItem("CompID"),
    //   codekey: this.codekey,
    //   CreatedUser: localStorage.getItem("UserId"),
    //   isOperationDisable: true
    // });
    this.made_changes = true;

  }

  onCancelClick() {
    this.itemCodeGenComponent.itemCodeGenComponent = 1;
  }

  onDeleteClick(rowindex) {
    console.log("onDeleteClick rowindex: " + rowindex)
    // for (var i = 0; i < this.itemCodeRowList.length; i++) {
    //   if (this.itemCodeRowList[i].codekey == event.codekey){
    this.itemCodeRowList.splice(rowindex - 1, 1);
    // }
    // }

    this.finalString == "";
    for (let i = 0; i < this.itemCodeRowList.length; ++i) {
      this.finalString = this.finalString + this.itemCodeRowList[i].string
    }
  }

  validatedFieldsBeforeSave() {
    var row = 0;
    var type = 0;
    var opn = 0;

    for (let i = 0; i < this.itemCodeRowList.length; ++i) {
      if (this.itemCodeRowList[i].string == undefined || this.itemCodeRowList[i].string.length == 0) {
        if (this.itemCodeRowList[i].stringtype == 3) {
          return true;
        } else {
          this.toastr.error('', this.translate.instant("Masking_ValidateStringBlank"));
          return false;
        }
      }

      if (this.itemCodeRowList[i].length == undefined || this.itemCodeRowList[i].length == 0) {
        this.toastr.error('', this.translate.instant("Masking_ValidateLengthBlank"));
        return false;
      }

      if (this.itemCodeRowList[i].stringtype == 1) {
        if (this.itemCodeRowList[i].operations != 1) {
          row = i + 1;
          type = this.itemCodeRowList[i].stringtype;
          opn = this.itemCodeRowList[i].operations;
          break;
        }
      } else {
        if (this.itemCodeRowList[i].operations == 1) {
          row = i + 1;
          type = this.itemCodeRowList[i].stringtype;
          opn = this.itemCodeRowList[i].operations;
          break;
        }
      }
    }

    if (row == 0 && type == 0 && opn == 0) {
      return true;
    } else {
      this.toastr.error('', this.translate.instant("Masking_ValidateTypeAndOper") + " " + row);
      return false;
    }
  }

  onAddUpdateClick() {
    if (this.actionType == "add") {
      if (this.itemCodeRowList.length == 0) {
        return;
      }
    }
    if (!this.validatedFieldsBeforeSave()) {
      return;
    }
    this.showLoader = true;
    this.maskingService.saveData(this.itemCodeRowList).subscribe(
      (data: any) => {
        console.log("data: " + data);
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonService.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          if (data == "True") {
            this.toastr.success('', this.translate.instant("DataSaved"));
            this.onCancelClick();
          } else {
            this.toastr.error('', data[0].RESULT);
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonService.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  validateRowData(buttonpressevent) {
    if (buttonpressevent == "AddRow") {
      if (this.itemCodeRowList.length > 0) {

        for (let i = 0; i < this.itemCodeRowList.length; ++i) {
          if (this.itemCodeRowList[i].stringtype == 2 || this.itemCodeRowList[i].stringtype == 3) {
            if (isNaN(this.itemCodeRowList[i].string) == true) {
              this.toastr.error('', this.translate.instant("ValidNumber"));
              return false;
            }
            if (this.itemCodeRowList[i].operations == 1) {
              this.toastr.error('', this.translate.instant("ValidOperations"));
              return false;
            }

          } else {
            if (this.itemCodeRowList[i].operations != 1) {
              this.toastr.error('', this.translate.instant("ValidOperations"));
              return false;
            }
          }
          if (this.itemCodeRowList[i].codekey == "" || this.itemCodeRowList[i].codekey == null) {
            this.itemCodeRowList[i].codekey = this.codekey
          }

        }
      }
    } else {
      if (buttonpressevent != "Delete") {
        if (this.itemCodeRowList.length == 0) {
          this.toastr.error('', this.translate.instant("Addrow"));
          return false;
        }
        else {
          this.countNumberRow = 0;
          for (let i = 0; i < this.itemCodeRowList.length; ++i) {
            if (this.codekey == " " || this.codekey == "" || this.codekey == null) {
              this.toastr.error('', this.translate.instant("CodeBlank"));
              return false;
            }
            else if (this.codekey.trim() == "" || this.codekey.trim() == null || this.codekey.trim() == " ") {
              this.toastr.error('', this.translate.instant("CodeBlank"));
              return false;
            }
            else if (this.commonData.excludeSpecialCharRegex.test(this.codekey) === true) {
              this.toastr.error('', this.translate.instant("ValidString"));
              return false;
            }
            if (this.itemCodeRowList[i].stringtype == 2 || this.itemCodeRowList[i].stringtype == 3) {
              if (isNaN(this.itemCodeRowList[i].string) == true) {
                this.toastr.error('', this.translate.instant("ValidNumber"));
                return false;
              }
              if (this.itemCodeRowList[i].operations == 1) {
                this.toastr.error('', this.translate.instant("ValidOperations"));
                return false;
              }
              this.countNumberRow++;

            } else if (this.itemCodeRowList[i].stringtype == 1 && this.commonData.excludeSpecialCharRegex.test(this.itemCodeRowList[i].string) === true) {
              this.toastr.error('', this.translate.instant("ValidString"));
              return false;
            }
            else {
              if (this.itemCodeRowList[i].operations != 1) {
                this.toastr.error('', this.translate.instant("ValidOperations"));
                return false;
              }

            }
            if (this.itemCodeRowList[i].string.trim() == "") {
              this.toastr.error('', this.translate.instant("EnterString"));
              return false;
            }

          }
          if (this.countNumberRow == 0) {
            this.toastr.error('', this.translate.instant("RowNumberType"));
            return false;

          }
        }
      }
      // else {
      //   this.GetItemData = []
      //   this.GetItemData.push({
      //     CompanyDBId: this.companyName,
      //     ItemCode: this.codekey,
      //     GUID: sessionStorage.getItem("GUID"),
      //     UsernameForLic: sessionStorage.getItem("loggedInUser")
      //   })

      //   this.itemgen.DeleteData(this.GetItemData).subscribe(
      //     data => {
      //       if (data != undefined && data.length > 0) {
      //         if (data[0].ErrorMsg == "7001") {
      //           this.made_changes = false;
      //           this.commanService.RemoveLoggedInUser().subscribe();
      //           this.commanService.signOut(this.toastr, this.route, 'Sessionout');
      //           return;
      //         }
      //       }

      //       if (data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists") {
      //         // this.toastr.error('', this.translate.Refrence + ' at: ' + data[0].ItemCode , this.commonData.toast_config);
      //       }
      //       else if (data[0].IsDeleted == "1") {
      //         this.toastr.error('', this.translate.instant("DataDeleteSuccesfully"));
      //         this.made_changes = false;
      //         this.router.navigateByUrl('item-code-generation/view');
      //       }
      //       else {
      //         this.toastr.error('', this.translate.instant("DataNotDelete"));
      //       }

      //     }, error => {
      //       this.showLoader = false;
      //       if (error.error.ExceptionMessage.trim() == this.commonData.unauthorizedMessage) {
      //         // this.commanService.isUnauthorized();
      //       }
      //       return;
      //     }
      //   )
      // }
    }
    if (this.codekey == " " || this.codekey == "" || this.codekey == null) {
      this.toastr.error('', this.translate.instant("CodeBlank"));
      return false;
    }
    else if (this.codekey.trim() == "" || this.codekey.trim() == null || this.codekey.trim() == " ") {
      this.toastr.error('', this.translate.instant("CodeBlank"));
      return false;
    }
    if (this.finalString.length > 50) {
      this.toastr.error('', this.translate.instant("StringLengthValidation"));
      return false;
    }
  }

  onStringChange(selectedvalue, rowindex, string_number) {  // validate string on blur
    if (string_number == 2 || string_number == 3) {
      var rgexp = /^\d+$/;
      if (rgexp.test(selectedvalue) == false) {
        // selectedvalue = ""
        this.toastr.error('', this.translate.instant("ValidNumber"));
      } else {
        for (let i = 0; i < this.itemCodeRowList.length; ++i) {
          if (this.itemCodeRowList[i].rowindex === rowindex) {
            if (this.itemCodeRowList[i].operations == 1) {
              this.toastr.error('', this.translate.instant("ValidOperations"));
            }
          }
        }
      }
    } else {
      if (this.commonData.excludeSpecialCharRegex.test(selectedvalue.trim()) === true) {
        this.toastr.error('', this.translate.instant("ValidString"));
      }
    }

    if (this.itemCodeRowList.length > 0) {
      this.finalString = "";
      for (let i = 0; i < this.itemCodeRowList.length; ++i) {
        if (this.itemCodeRowList[i].rowindex === rowindex) {
          // if (selectedvalue == undefined || selectedvalue.trim().length == 0) {
          //   this.itemCodeRowList[i].string = "";
          // } else {
            this.itemCodeRowList[i].string = selectedvalue.trim();
          // }

          this.itemCodeRowList[i].codekey = this.codekey.trim();
          if (this.itemCodeRowList[i].stringtype == 1) {
            this.itemCodeRowList[i].length = selectedvalue.trim().length;
          }
        }
        this.finalString = this.finalString + this.itemCodeRowList[i].string
      }
    }
  }

  onStringTypeSelectChange(selectedvalue, rowindex) {
    selectedvalue = selectedvalue.value
    this.made_changes = true;
    for (let i = 0; i < this.itemCodeRowList.length; ++i) {
      if (this.itemCodeRowList[i].rowindex === rowindex) {
        this.itemCodeRowList[i].string = "";
        this.itemCodeRowList[i].length = 0;
        this.itemCodeRowList[i].stringtype = selectedvalue;
        if (selectedvalue == 1) {
          this.itemCodeRowList[i].isOperationDisable = true;
          this.itemCodeRowList[i].operations = 1;
          // this.defaultOperation = this.operations[0];
        } else if (selectedvalue == 2) {
          // this.itemCodeRowList[i].operations = 2;
          this.itemCodeRowList[i].isOperationDisable = false
          // this.defaultOperation = this.operations[1];
        } else if (selectedvalue == 3) {
          this.itemCodeRowList[i].string = "P1";
          this.itemCodeRowList[i].isOperationDisable = false
          // this.defaultOperation = this.operations[1];
        }
      }

    }

  }

  onStringOperationsSelectChange(selectedvalue, rowindex) {
    selectedvalue = selectedvalue.value
    this.made_changes = true;
    for (let i = 0; i < this.itemCodeRowList.length; ++i) {
      if (this.itemCodeRowList[i].rowindex === rowindex) {
        this.itemCodeRowList[i].operations = selectedvalue;
        if (this.itemCodeRowList[i].stringtype == 2 || this.itemCodeRowList[i].stringtype == 3) {
          if (this.itemCodeRowList[i].operations == 1) {
            this.toastr.error('', this.translate.instant("ValidOperations"));
            return
          }
          // else {
          //   this.itemCodeRowList[i].operations = 1;
          // }
        }
      }
    }
  }

  onLengthChange(selectedvalue, rowindex, string_number) {
    if (string_number == 2) { // validate string on blur
      var rgexp = /^\d+$/;
      if (rgexp.test(selectedvalue) == false) {
        this.toastr.error('', this.translate.instant("ValidNumber"));
      }
    } else {

    }
    if (this.itemCodeRowList.length > 0) {
      this.finalString = "";
      for (let i = 0; i < this.itemCodeRowList.length; ++i) {
        if (this.itemCodeRowList[i].rowindex === rowindex) {
          this.itemCodeRowList[i].length = Number("" + selectedvalue.trim());
          if (this.itemCodeRowList[i].string.length > this.itemCodeRowList[i].length) {
            this.toastr.error('', this.translate.instant("ValidLengthNumber"));
            return;
          } else {
            this.itemCodeRowList[i].length = Number(selectedvalue.trim());
          }
        }
        this.finalString = this.finalString + this.itemCodeRowList[i].string
      }
    }
  }

  getItemCodeGenerationByCode(itemCode: string) {
    this.showLoader = true;
    this.maskingService.getItemCodeGenerationByCode(itemCode).subscribe(
      (data: any) => {
        console.log("data: " + data);
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonService.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }

          this.finalString = "";
          var isOperationDisable = true
          for (let i = 0; i < data.length; ++i) {
            var len = 0;
            if (data[i].OPTM_TYPE == 1) {
              isOperationDisable = true
              len = data[i].OPTM_CODESTRING.length;
            }

            if (data[0].Reference == false && data[i].OPTM_TYPE == 2) {
              isOperationDisable = false
            }

            this.itemCodeRowList.push(new CodeRow(data[i].OPTM_LINEID,
              data[i].OPTM_TYPE,
              data[i].OPTM_CODESTRING,
              len,
              data[i].OPTM_OPERATION,
              "",
              localStorage.getItem("CompID"),
              localStorage.getItem("UserId"),
              data[i].OPTM_CODE,
              isOperationDisable,
              localStorage.getItem("GUID"),
              localStorage.getItem("UserId")));

            this.finalString = this.finalString + data[i].OPTM_CODESTRING
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonService.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  isValidateCalled: boolean = false;
  async validateBeforeSubmit(): Promise<any> {
    this.isValidateCalled = true;
    var currentFocus = document.activeElement.id;
    console.log("validateBeforeSubmit current focus: " + currentFocus);

    if (currentFocus != undefined) {
      if (currentFocus == "CodeInputField") {
        return this.onCodeChange();
      }
    }
  }
}
