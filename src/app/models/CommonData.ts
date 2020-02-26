import { HttpHeaders } from '@angular/common/http';
// ng build --prod --base-href=/OptiProERPWMS/
//1. ng build --base-href=/OptiProERPShipment/
//2. add OptiProERPWMS in css path in index.html

export interface ColumnSetting {
    field: string;
    title: string;
    format?: string;
    type: 'text' | 'numeric' | 'boolean' | 'date';
    width?: string;
    headerClass?: string;
    class?: string;
}

// Example of Data as model, can be used for non updating data (exaple - names, task type and etc)
export class CommonData {
    public project_name: string = "Optipro Configurator";
    public adminDBName: string = "OPTIPROADMIN";
    public href: any = window.location.href;
    public application_path = this.get_current_url();
    public commonGridPageSize = 10;

    public get_current_url() {
        let temp: any = this.href.substring(0, this.href.lastIndexOf('/'));
        if (temp.lastIndexOf('#') != '-1') {
            temp = temp.substring(0, temp.lastIndexOf('#'));
        }
        let sanitized = temp.replace(/^http\:\/\//, '').replace(/\/+/g, '/').replace(/\/+$/, '');
        temp = (window.location.protocol + '//' + sanitized);

        return temp;
    }

    public toast_config = {
        closeButton: true,
        progressBar: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        iconClasses: {
            error: 'alert alert-danger',
            info: 'alert alert-info ',
            success: 'alert alert-success ',
            warning: 'alert alert-warning'
        }
    };

    //defining properties for the call 
    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    public lookup_selected_value = '';

    public stringtypevalue: any = [
        { "value": 1, "Name": "String" },
        { "value": 2, "Name": "Number" }
    ];

    public opertions: any = [
        { "value": 1, "Name": "No Operation" },
        { "value": 2, "Name": "Increase" },
        { "value": 3, "Name": "Decrease" }
    ];

    public bom_type: any = [
        { "value": 1, "Name": "Feature" },
        { "value": 2, "Name": "Item" },
        { "value": 3, "Name": "Value" }
    ];

    public less_bom_type: any = [
        { "value": 2, "Name": "Item" }
        /*  , { "value": 3, "Name": "Value" } */
    ];

    public model_bom_type: any = [
        { "value": 1, "Name": "Feature" },
        { "value": 2, "Name": "Item" },
        { "value": 3, "Name": "Model" }
    ];

    public rule_seq_type: any = [
        { "value": '', "Name": "" },
        { "value": 1, "Name": "Feature" },
        { "value": 2, "Name": "Model" }
    ];

    public operator_type: any = [
        { "value": '', "Name": "" },
        { "value": 'or', "Name": "OR" },
        { "value": 'and', "Name": "AND" }
    ];

    public yes_no_option: any = [
        { "value": '', "Name": "" },
        { "value": 'n', "Name": "No" },
        { "value": 'y', "Name": "Yes" }
    ];

    public bracket_list = [
        { "value": '' },
        { "value": "[" },
        { "value": "{", },
        { "value": "(" },
        { "value": "]" },
        { "value": "}", },
        { "value": ")" },
    ];

    public express_conditions = [
        { "value": "=" },
        { "value": "<" },
        { "value": ">" },
        { "value": "<=" },
        { "value": ">=" },
        { "value": "Between" }
        /* , { "value": "In" }, */
    ];

    public document_type = [
        //{ "value": '', "Name": "" },
        { "value": 'draft', "Name": "Draft", "selected": "1" },
        { "value": 'sales_quote', "Name": "Sales Quote", "selected": "0" },
        { "value": 'sales_order', "Name": "Sales Order", "selected": "0" }
    ];


    // for common view
    public default_limits = ["10", "25", "50", "100"];
    public default_count = "10";

    blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return <File>theBlob;
    }

    checkSession() {
        let login_page = this.application_path + '/index.html#login';
        if (sessionStorage.getItem('isLoggedIn') == null) {
            window.location.href = login_page;
        }
    }

    item_code_gen_string_dropdown() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "value": 1, "Name": "String" },
            { "value": 2, "Name": "Number" },
            { "value": 3, "Name": "Parameter" }
        ];
    }

    item_code_gen_oper_drpdown() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "value": 1, "Name": "No Operation" },
            { "value": 2, "Name": "Increase" },
            { "value": 3, "Name": "Decrease" }
        ];
    }

    public excludeSpecialCharRegex = /[{}*!^=<>?|/(\\)&#@%]/;

    container_creation_purpose_string_dropdown() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "Value": 1, "Name": "Shipping" },
            { "Value": 2, "Name": "Internal" }
        ];
    }

    container_use_array() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "Value": 1, "Name": "Shipping" },
            { "Value": 2, "Name": "Internal" },
            { "Value": 3, "Name": "Both" }
        ];
    }

    container_creation_create_mode_string_dropdown() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "Value": 1, "Name": "Auto Rule Based" },
            { "Value": 2, "Name": "Manual Rule Based" },
            { "Value": 3, "Name": "Manual" }
        ];
    }

    shiment_status_array() {
        return [
            { "Value": 1, "Name": "New" },
            { "Value": 2, "Name": "Scheduled" },
            { "Value": 3, "Name": "Part Fulfilled" },
            { "Value": 4, "Name": "Fulfilled" },
            { "Value": 5, "Name": "Picking" },
            { "Value": 6, "Name": "Picked" },
            { "Value": 7, "Name": "Ship Staged" },
            { "Value": 8, "Name": "Unstaged" },
            { "Value": 9, "Name": "Loaded on truck" },
            { "Value": 10, "Name": "Shipped" },
            { "Value": 11, "Name": "Part Returned" },
            { "Value": 12, "Name": "Returned" },
            { "Value": 13, "Name": "Return Accepted" },
            { "Value": 14, "Name": "Cancelled" }
        ];
    }

    Container_Status_DropDown() {
        return [
            { "Value": 1, "Name": "New" },
            { "Value": 2, "Name": "Open" },
            { "Value": 3, "Name": "Closed" },
            { "Value": 4, "Name": "Reopened" },
            { "Value": 5, "Name": "Assigned" },
            { "Value": 6, "Name": "Shipped" },
            { "Value": 7, "Name": "Returned" },
            { "Value": 8, "Name": "Damaged" },
            { "Value": 9, "Name": "Cancelled" }
        ];
    }

    Container_Shipment_Inv_Status_DropDown() {
        return [
            { "Value": 1, "Name": "Pending" },
            { "Value": 2, "Name": "Posted" }
        ];
    }

    Container_Shipment_Status_DropDown() {
        return [
            { "Value": 1, "Name": "New" },
            { "Value": 2, "Name": "Open" },
            { "Value": 3, "Name": "Closed" },
            { "Value": 4, "Name": "Reopened" },
            { "Value": 5, "Name": "Assigned" },
            { "Value": 6, "Name": "Shipped" },
            { "Value": 7, "Name": "Returned" },
            { "Value": 8, "Name": "Damaged" },
            { "Value": 9, "Name": "Cancelled" }
        ];
    }

    Shipment_Lines_Status_DropDown() {
        return [
            { "Value": 1, "Name": "New" },
            { "Value": 2, "Name": "Part Fulfilled" },
            { "Value": 3, "Name": "Fulfilled" },
            { "Value": 4, "Name": "Cancelled" }
        ];
    }

    Container_Operation_Add_Items() {
        return [
            { "Value": 1, "Name": "Add" },
            { "Value": 2, "Name": "Remove" },
            { "Value": 3, "Name": "Query" },
            { "Value": 4, "Name": "Delete Item" },
            { "Value": 5, "Name": "Delete All Items" }
        ];
    }

    Container_Operation_Add_Container(){
        return [
            { "Value": 1, "Name": "Add" },
            { "Value": 2, "Name": "Remove" },
            { "Value": 3, "Name": "Delete All" }
        ];
    }

    validateOnCheck(SelectedDataArray, AvailableQty, OpenQty, SelectedQty){

        if(SelectedDataArray.length == 0){
            if(parseFloat(AvailableQty) > parseFloat(OpenQty)){
              // let diffAvail = parseFloat(AvailableQty) - parseFloat(OpenQty);
               return OpenQty;
            }
            else{
                return AvailableQty;
            }  
         }
         else{
            let remQty: any = parseFloat(OpenQty) - parseFloat(SelectedQty);

            if(remQty == 0){
                return -1;            
            }

            AvailableQty = (AvailableQty - parseFloat(remQty))>0?parseFloat(remQty):AvailableQty;

            let diff = parseFloat(remQty) - AvailableQty;
            if(diff >= 0){
              return AvailableQty;
            }
            else{
              return -1;
            } 
         }

    }

    validateOnChange(value, AvailableQty, OpenQty, SelectedQty){

        if(parseFloat(value) > parseFloat(AvailableQty)){
            //this.toastr.error('', this.translate.instant("AssignedQty_cannot_be_greater"));
            return false;
        }
        else if(parseFloat(SelectedQty) > parseFloat(OpenQty)){
            return false;
        }
        else{
             return true;
        }

    }
}